"""Onboarding current release: every configuration fits, and audible semitone edits persist."""
from pilot_support import *

SIZES=[(375,812),(320,568),(320,480),(844,390),(568,320),(768,1024),(1280,720),(240,320)]
INSTRUMENTS=['guitar6','guitar7','guitar8','bass4','bass5','bass6']

def fits(page):
 problems=page.evaluate('''()=>{const bad=[];if(document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight+1)bad.push('page scroll');for(const e of document.querySelectorAll('.setup-wizard button,.setup-wizard select')){const r=e.getBoundingClientRect();if(!r.width||!r.height||!e.checkVisibility())continue;if(r.left<-.5||r.top<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5)bad.push(e.outerHTML.slice(0,150)+' outside');if(r.height<43.5)bad.push(e.outerHTML.slice(0,150)+' too small');const top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);if(!top||!e.contains(top))bad.push(e.outerHTML.slice(0,150)+' covered by '+top?.outerHTML.slice(0,150));}return bad}''')
 assert not problems,(page.viewport_size,page.locator('h1').inner_text(),problems)

def select_custom(page,instrument='guitar6'):
 page.select_option('#instrument',instrument);page.get_by_role('button',name='Continuer',exact=True).click();page.select_option('#tuning-preset','custom');page.wait_for_timeout(180)

def draft(page):
 return page.evaluate('''()=>[...document.querySelectorAll('[data-setup-action="listen-string"]')].map(e=>({string:Number(e.dataset.string),label:e.textContent}))''')

with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);errors=[]
 # Every instrument, both steps, and every visible page of the short-screen editor.
 for instrument in INSTRUMENTS:
  c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE);page.select_option('#instrument',instrument)
  for w,h in SIZES:page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(100);fits(page)
  page.set_viewport_size({'width':375,'height':812});page.get_by_role('button',name='Continuer',exact=True).click();assert page.locator('img.setup-instrument-picture').count()==1;assert instrument[:-1]+instrument[-1]+'strings.webp' in page.locator('img.setup-instrument-picture').get_attribute('src');assert page.locator('.setup-note-strip small').all_text_contents()==[str(i) for i in range(int(instrument[-1]),0,-1)];options=page.locator('#tuning-preset option').all_text_contents();assert 'Personnalisé…' in options and len(options)>=5
  for w,h in SIZES:page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(100);fits(page)
  page.set_viewport_size({'width':375,'height':812});page.select_option('#tuning-preset','custom');page.wait_for_timeout(180)
  for w,h in SIZES:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(150);fits(page)
   seen=set()
   while True:
    seen.update(v['string'] for v in draft(page));fits(page);next_button=page.locator('[data-setup-action="page"][data-delta="1"]')
    if not next_button.count() or next_button.is_disabled():break
    next_button.click()
   count=int(instrument[-1]);assert seen==set(range(count)),(instrument,w,h,seen)
   prev=page.locator('[data-setup-action="page"][data-delta="-1"]')
   while prev.count() and prev.is_enabled():prev.click()
  c.close()
 # Audible changes, whole-instrument transposition, mute and actual saved profile.
 c=b.new_context(viewport={'width':375,'height':812});c.add_init_script('''window.__sounds=[];window.__stops=0;const start=AudioBufferSourceNode.prototype.start,stop=AudioBufferSourceNode.prototype.stop;AudioBufferSourceNode.prototype.start=function(...a){window.__sounds.push({when:a[0],state:this.context.state,max:Math.max(...this.buffer.getChannelData(0).slice(0,3000).map(Math.abs))});return start.apply(this,a)};AudioBufferSourceNode.prototype.stop=function(...a){window.__stops++;return stop.apply(this,a)};''');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE)
 page.get_by_role('button',name='Continuer',exact=True).click();page.select_option('#tuning-preset','eb');assert 'D♯4' in page.locator('.setup-note-strip').inner_text();page.select_option('#tuning-preset','custom');assert draft(page)[0]['label']=='D♯4';page.locator('[data-setup-action="back"]').click();page.select_option('#tuning-preset','dadgad');page.select_option('#tuning-preset','custom');page.wait_for_timeout(180)
 assert [r['label'] for r in draft(page)]==['D4','A3','G3','D3','A2','D2']
 page.locator('[data-setup-action="adjust"][data-string="5"][data-delta="1"]').click();assert draft(page)[0]['label']=='D♯4';page.wait_for_function('window.__sounds.length===1');assert page.evaluate('window.__sounds[0].state==="running"&&window.__sounds[0].max>0')
 page.locator('[data-setup-action="adjust"][data-delta="1"]:not([data-string])').click();page.wait_for_function('window.__sounds.length===7');assert [r['label'] for r in draft(page)]==['E4','A♯3','G♯3','D♯3','A♯2','D♯2']
 page.locator('[data-setup-action="mute"]').click();before=page.evaluate('window.__sounds.length');page.locator('[data-setup-action="adjust"][data-string="5"][data-delta="-1"]').click();page.wait_for_timeout(80);assert page.evaluate('window.__sounds.length')==before;assert page.evaluate('window.__stops')>=6
 page.locator('[data-setup-action="back"]').click();assert page.locator('#tuning-preset').input_value()=='custom';page.locator('[data-setup-action="back"]').click();page.select_option('#notation','latin');page.get_by_role('button',name='Continuer',exact=True).click();page.locator('[data-setup-action="edit"]').click();assert draft(page)[0]['label']=='Ré♯4'
 page.screenshot(path=str(OUT/'custom.png'));page.get_by_role('button',name='C’est parti').click();assert page.locator('.pilot-hero').count()==1
 saved=page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',LEGACY);assert saved['profile']['tuning']==[39,46,51,56,58,63];assert saved['notation']=='latin'
 page.locator('[data-action="settings"]:visible').first.click();page.locator('[data-action="edit-profile"]').click();assert page.locator('#instrument').input_value()=='guitar6';page.get_by_role('button',name='Continuer',exact=True).click();assert page.locator('#tuning-preset').input_value()=='custom';page.locator('[data-setup-action="edit"]').click();assert draft(page)[0]['label']=='Ré♯4'
 # Individual drafts survive instrument changes; each instrument gets its own list.
 page.locator('[data-setup-action="back"]').click();page.locator('[data-setup-action="back"]').click();page.select_option('#instrument','bass4');page.get_by_role('button',name='Continuer',exact=True).click();assert 'BEAD — Si grave' in page.locator('#tuning-preset option').all_text_contents();page.locator('[data-setup-action="back"]').click();page.select_option('#instrument','guitar6');page.get_by_role('button',name='Continuer',exact=True).click();page.locator('[data-setup-action="edit"]').click();assert draft(page)[0]['label']=='Ré♯4'
 assert not errors,errors
 print(json.dumps({'all_6_instruments':True,'all_8_sizes':True,'no_page_scroll_or_hidden_controls':True,'all_strings_reachable':True,'half_step_audio':True,'whole_tuning_audio':True,'mute_cancels_scheduled_notes':True,'custom_saved_with_registers':True,'notation_and_drafts_preserved':True,'initial_profile_correction':True,'errors':errors}));b.close()
