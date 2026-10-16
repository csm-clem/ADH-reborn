from pilot_support import *
import json,re
KEY='adh-reborn:pilot:v1'
def current(page):return page.evaluate('(k)=>{const v=JSON.parse(localStorage.getItem(k));return v.profiles[Object.keys(v.profiles)[0]]}',KEY)
def tap_old(page,s,f):page.locator(f'#pilot-neck [data-pilot-string="{s}"][data-pilot-fret="{f}"]').click()
def seed(page,instrument,tuning):
 page.goto(BASE);page.evaluate('''async p=>{const c=await import('./core.js'),m=await import('./pilot.js');const s=c.initialState();s.profile=c.makeProfile(p.id,p.tuning);s.sound=false;localStorage.setItem('adh-reborn:state:v1',JSON.stringify(s));const d={version:1,profiles:{}};d.profiles[s.profile.key]={profile:s.profile,attempts:m.pilotPlan(s.profile).modules.map((a,i)=>({id:'seed-'+i,activity:a.id,at:1,events:[],finished:true,instrument:{}})),later:[],session:null};localStorage.setItem('adh-reborn:pilot:v1',JSON.stringify(d))}''',{'id':instrument,'tuning':tuning});page.reload()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);errors=[]
 for instrument,tuning,target_id,expected in [('guitar7',None,'degree-5','diminuée'),('guitar6','D2 A2 D3 G3 A3 D4','degree-4','autre octave'),('guitar7','B1 F#2 B2 E3 A3 C#4 F#4','tuning','préambule')]:
  c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page,instrument,tuning)
  assert not page.locator('[data-module="workshop-fsharp"]').count()
  page.locator(f'.lesson-row[data-module="{target_id}"]').click()
  if target_id=='tuning':assert expected in page.inner_text('body')
  else:
   page.locator('[data-pilot-action="discovery-reveal"]').click();assert expected in page.inner_text('body')
  if target_id=='tuning':
   assert 'F♯' in page.inner_text('body') and 'C♯' in page.inner_text('body')
   profile=current(page)['profile']
   for string in range(len(profile['tuning'])):tap(page,string,0)
   page.locator('[data-pilot-action="practice"]').click();page.wait_for_selector('.pilot-count',state='detached',timeout=5000)
   choices=page.locator('[data-pilot-action="note"]').all_text_contents();assert len(choices)==5 and 'F♯' in choices and 'C♯' in choices
  page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(200)
  a=page.locator('.neck-panel').bounding_box();z=page.locator('.answer-workspace').bounding_box();assert abs(a['height']-z['height'])<1
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.screenshot(path=str(OUT/f'{instrument}-{target_id}.png'),full_page=True);c.close()
 # The natural diagnostic uses name production and a full family search, without target audio.
 c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');c.add_init_script('''window.__sounds=0;const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...a){window.__sounds++;return start.apply(this,a)};''');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page,'guitar6',None)
 # Enable audio to verify the evaluation does not play the answer before it is given.
 page.evaluate("let s=JSON.parse(localStorage.getItem('adh-reborn:state:v1'));s.sound=true;localStorage.setItem('adh-reborn:state:v1',JSON.stringify(s))");page.reload();page.locator('[data-module="natural-diagnostic"]').click();page.wait_for_selector('.pilot-count',state='detached',timeout=5000)
 assert page.evaluate('window.__sounds')==0;assert page.locator('.pilot-wheel button').count()==7
 for i in range(36):
  s=current(page)['session'];q=s['queue'][s['index']]
  if q['mode']=='name':page.locator(f'[data-note="{q["target"]["midi"]%12}"]').click()
  else:
   from pilot_support import tap as accessible_tap
   accessible_tap(page,q['target']['string'],q['target']['fret'])
  wait_advance(page,s['index'])
 assert current(page)['session']['stage']=='motif'
 natural=page.evaluate('''async()=>{const m=await import('./pilot.js');const d=JSON.parse(localStorage.getItem('adh-reborn:pilot:v1'));return m.pilotPlan(d.profiles[Object.keys(d.profiles)[0]].profile).natural}''')
 for pc in current(page)['session']['familyOrder']:
  for pos in natural:
   if pos['midi']%12==pc:accessible_tap(page,pos['string'],pos['fret'])
  page.locator('[data-pilot-action="family-next"]').click()
 assert 'Prérequis vérifiés' in page.locator('h1').inner_text();assert current(page)['diagnostic']['passed']==True
 events=current(page)['attempts'][-1]['events'];assert sum(e['format']=='choice' for e in events)==18
 # Countdown pause and active time survive refresh, including a requested hint.
 page.locator('[data-pilot-action="home"]').click();page.locator('.lesson-row[data-module="degree-5"]').click();page.locator('[data-pilot-action="discovery-reveal"]').click();tap(page,1,2);page.locator('[data-pilot-action="practice"]').click()
 page.wait_for_timeout(1100);page.locator('[data-pilot-action="pause"]').last.click();number=page.locator('.pilot-count').inner_text();page.wait_for_timeout(1100);assert page.locator('.pilot-count').inner_text()==number
 page.locator('.pilot-pause-layer [data-pilot-action="resume-pause"]').click();page.wait_for_selector('.pilot-count',state='detached',timeout=5000)
 page.locator('[data-pilot-action="hint"]').click();page.wait_for_timeout(250);page.reload();page.locator('[data-pilot-action="resume"]').click();page.wait_for_selector('.pilot-count',state='detached',timeout=5000)
 q=current(page)['session']['queue'][current(page)['session']['index']];page.locator(f'[data-pilot-action="note"][data-note="{q["target"]["midi"]%12}"]').click();e=current(page)['session']['events'][-1];assert 'labels' in e['aids'];assert e['ms']<2500,e['ms'];assert e['ms']>=200,e['ms']
 assert not errors,errors
 print(json.dumps({'seven_strings_diminished':True,'dadgad_register':True,'altered_open_preamble_only':True,'diagnostic_wheel_36_items':True,'all_natural_families':True,'no_evaluation_audio_cue':True,'pause_countdown':True,'active_time_and_hint_survive_reload':True,'no_workshop':True,'errors':errors}));b.close()
