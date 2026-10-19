from playwright.sync_api import sync_playwright
from pathlib import Path
import json,time,os
OUT=Path(os.environ.get('ADH_QA_OUTPUT','/tmp/dft-beta-qa'));OUT.mkdir(parents=True,exist_ok=True)
BASE=os.environ.get('ADH_BASE_URL','http://localhost:4173/')
errors=[];checks=[]
SEED='''async({instrument,activity})=>{
 const {makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{STATE_KEY,PILOT_KEY}=await import('./release.js'),{initialPilotStore}=await import('./pilot.js'),{betaCatalog}=await import('./beta-catalog.js');
 const profile=makeProfile(instrument),catalog=betaCatalog(profile),store=initialPilotStore(),a=activity?catalog.activities.find(a=>a.id===activity)||catalog.discoveries.find(a=>a.id===activity):null,ch=a?catalog.chapters.find(c=>c.activityIds.includes(a.id)||c.discoveryId===a.id):null;
 store.profiles[profile.key]={profile,attempts:[],later:[],session:null,discoveredModules:activity?.endsWith('-discover')?[]:catalog.discoveries.map(d=>d.baseId).concat('opens'),seenInstructions:['name','name-pitch','find','mix-intro','motif','explore',...catalog.discoveries.map(d=>'family-'+(d.scopeId!=='z1'?d.scopeId+'-':'')+d.pitchClass),...catalog.scopes.flatMap(s=>s.plan.modules.map(m=>'melody-'+m.id))],navigation:{route:a?.scopeId||null,chapter:ch?.id||null}};
 localStorage.setItem(STATE_KEY,JSON.stringify({...initialState(),profile,beginnerGuide:true,sound:false}));localStorage.setItem(PILOT_KEY,JSON.stringify(store));return profile.key;
}'''
def snap(page):return page.evaluate("()=>Object.values(JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')).profiles)[0]")
def seed(page,instrument='guitar6',activity=None):
 page.goto(BASE);page.evaluate(SEED,{'instrument':instrument,'activity':activity});page.reload();page.wait_for_timeout(130)
def launch(page,activity,instrument='guitar6'):
 seed(page,instrument,activity);page.locator('.chapter-options summary').click();page.locator(f'[data-pilot-action="start"][data-module="{activity}"]').click()
 for _ in range(5):
  if not page.locator('[data-pilot-action="help-next"]').count():break
  page.locator('[data-pilot-action="help-next"]').click()
 if page.locator('.pilot-count').count():page.wait_for_selector('.pilot-count',state='detached')
 page.wait_for_timeout(60)
def bounds(page):
 return page.evaluate('''()=>({viewport:[innerWidth,innerHeight],doc:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],controls:[...document.querySelectorAll('.pilot-wheel button,.long-position-pad:not([hidden]) button,[data-pilot-action=practice],.result-actions .button')].filter(e=>e.getBoundingClientRect().width).map(e=>{const b=e.getBoundingClientRect();return {text:e.textContent.trim(),box:[b.x,b.y,b.right,b.bottom],visible:b.left>=-1&&b.right<=innerWidth+1&&b.top>=-1&&b.bottom<=innerHeight+1};})})''')
def tap(page,string,fret):
 pad=page.locator(f'.long-position-pad:not([hidden]) [data-string="{string}"][data-fret="{fret}"]')
 if pad.count():pad.click()
 else:page.locator(f'#pilot-neck [data-pilot-string="{string}"][data-pilot-fret="{fret}"] rect').click()
def finish(page):
 while True:
  data=snap(page);s=data['session']
  if not s or s['stage']!='practice':break
  q=s['queue'][s['index']]
  if q['mode']=='name':page.locator(f'[data-pilot-action=note][data-note="{q["target"]["midi"] if q.get("answerKind")=="pitch" else q["target"]["midi"]%12}"]').click()
  else:tap(page,q['target']['string'],q['target']['fret'])
 while True:
  s=snap(page)['session']
  if not s or s['stage']!='motif':break
  if s.get('motifCompleted'):page.wait_for_timeout(350);continue
  if page.locator('[data-pilot-action="help-next"]').count():page.locator('[data-pilot-action="help-next"]').click();continue
  target=page.evaluate('''async()=>{const d=Object.values(JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')).profiles)[0],{betaCatalog}=await import('./beta-catalog.js'),{melodiesForPlan}=await import('./melodies.js'),c=betaCatalog(d.profile),m=c.activities.find(m=>m.id===d.session.activity),melody=m.scopeId==='z1'?melodiesForPlan(c.byScope.get('z1').plan).get(m.id):null,sorted=m.pool.slice().sort((a,b)=>a.midi-b.midi),motif=melody?.sequence||[sorted[0],sorted.at(-1),sorted[Math.floor(sorted.length/2)],sorted[0]];return motif[d.session.motifIndex];}''')
  tap(page,target['string'],target['fret'])
 page.wait_for_selector('.result-card')
 assert 'Exercice réussi' in page.locator('.result-card').inner_text()
 return snap(page)['attempts'][-1]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block')
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 # Layouts of evaluated and discovery questions, including the small phone edge cases.
 for instrument,activity in [('guitar6','cs1-note-4-discover'),('guitar6','cs1-note-4-find'),('guitar6','cs1-note-4'),('guitar8','z2-note-4-find'),('bass4','cs2-mix-11-find')]:
  for width,height in [(320,568),(390,844),(667,375),(844,390),(1440,900)]:
   page.set_viewport_size({'width':width,'height':height});launch(page,activity,instrument)
   b=bounds(page);bad=[x for x in b['controls'] if not x['visible']]
   assert not bad,(instrument,activity,width,height,bad)
   assert b['doc'][0]<=width+1 and b['doc'][1]<=height+1,(activity,b)
   if activity=='cs1-note-4-find' and width==844:
    boxes=page.locator('#pilot-neck [data-pilot-string] rect').evaluate_all('(es)=>es.map(e=>{const b=e.getBoundingClientRect();return [b.width,b.height]})')
    assert min(b[0] for b in boxes)>=43.8,boxes
   if (width,height) in [(390,844),(844,390)]:page.screenshot(path=str(OUT/f'{instrument}-{activity}-{width}.png'))
   checks.append({'layout':activity,'instrument':instrument,'size':[width,height],'controls':len(b['controls'])})
 # Real answer loops: every response comes through the visible UI.
 for instrument,activity,size in [('guitar6','opens',(390,844)),('guitar6','opens-find',(844,390)),('guitar6','z2-note-4',(390,844)),('guitar6','z3-note-4-find',(844,390)),('guitar6','cs1-note-4-find',(390,844)),('bass4','cs2-mix-11-find',(667,375)),('guitar8','z2-mix-0',(390,844))]:
  page.set_viewport_size({'width':size[0],'height':size[1]});launch(page,activity,instrument)
  page.evaluate('window.qaNeck=document.querySelector("#pilot-neck svg")')
  q=snap(page)['session']['queue'][0]
  if q['mode']=='name':page.locator(f'[data-note="{q["target"]["midi"] if q.get("answerKind")=="pitch" else q["target"]["midi"]%12}"]').click()
  else:tap(page,q['target']['string'],q['target']['fret'])
  assert page.evaluate('qaNeck===document.querySelector("#pilot-neck svg")'),'neck replaced'
  result=finish(page);assert result['passed'] and all(e['correct'] for e in result['events'])
  assert all(e['ms']<1000 for e in result['events']),[e['ms'] for e in result['events']]
  assert all(not e['aids'] for e in result['events'])
  page.screenshot(path=str(OUT/f'result-{instrument}-{activity}.png'))
  page.locator('[data-pilot-action=home]').click()
  assert page.locator('[data-pilot-action=beta-begin]').count(),activity
  checks.append({'completed':activity,'questions':len(result['events']),'maxMs':max(e['ms'] for e in result['events'])})
 # Rotation retains the same question; its resize interval isn't charged to response time.
 page.set_viewport_size({'width':390,'height':844});launch(page,'cs1-note-4-find')
 s=snap(page)['session'];page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(350)
 assert snap(page)['session']['index']==s['index']
 assert not page.locator('.pause-card').count()
 assert page.locator('.long-position-pad:visible').count()==0
 # The four beginner chapters, one entry course, and a correspondence course.
 for course_id in ['gd-01','gd-02','gd-03','gd-04','cs1-entry','z2-entry','z1-co','z3-co','cs1-co']:
  page.set_viewport_size({'width':390,'height':844});seed(page)
  data=page.evaluate('''async id=>{const {betaCatalog}=await import('./beta-catalog.js'),{betaCourses}=await import('./beta-courses.js'),d=Object.values(JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')).profiles)[0];return betaCourses(d.profile,betaCatalog(d.profile)).get(id);}''',course_id)
  # Navigate via the actual route and chapter card.
  route='beginner' if course_id.startswith('gd-') else course_id.split('-')[0]
  page.locator(f'[data-pilot-action=beta-branch][data-id="{"beginner" if route=="beginner" else "targeted"}"]').click();page.locator(f'[data-pilot-action=beta-route][data-id="{route}"]').click()
  page.locator(f'[data-pilot-action=beta-chapter][data-id="{course_id}"]').click()
  page.locator('[data-pilot-action=beta-course]').click()
  for index,card in enumerate(data['pages']):
   if card.get('quiz'):
    q=card['quiz']
    if q['kind']=='choice':page.locator(f'[data-course-action=answer][data-value="{q["answer"]}"]').click()
    else:
     if not page.locator('.course-position-options').get_attribute('open')=='' :page.locator('.course-position-options summary').click()
     page.locator(f'[data-course-action=position][data-string="{q["target"]["string"]}"][data-fret="{q["target"]["fret"]}"]').click()
   page.locator('[data-course-action=next]').click()
  assert snap(page)['courses'][course_id]['completed'],course_id
  checks.append({'course':course_id,'pages':len(data['pages'])})
 (OUT/'validation.json').write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2))
 # Debug must exercise the full beta without replacing a real saved result.
 seed(page);before=page.evaluate("localStorage.getItem('fretboard-trainer:pilot:stable')")
 page.locator('[data-action=settings]:visible').first.click();page.locator('[data-action=debug]').click()
 assert 'Simulation active' in page.locator('body').inner_text()
 page.locator('[data-action=home]:visible').first.click()
 page.locator('[data-pilot-action=beta-branch][data-id=guided]').click();page.locator('[data-pilot-action=beta-route][data-id=guided]').click();assert '42 / 42' in page.locator('.route-summary').inner_text()
 assert page.evaluate("localStorage.getItem('fretboard-trainer:pilot:stable')")==before
 page.locator('[data-action=settings]:visible').first.click();page.locator('[data-action=debug]').click()
 assert page.evaluate("localStorage.getItem('fretboard-trainer:pilot:stable')")==before
 assert not errors,errors
 (OUT/'validation.json').write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2))
 print(json.dumps({'checks':len(checks),'errors':errors},ensure_ascii=False))
 context.close();browser.close()
