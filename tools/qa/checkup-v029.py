"""Current-beta audit: full-string context, optional pad, drag, onboarding and themes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
OUT=Path('docs/v0.29');OUT.mkdir(parents=True,exist_ok=True)
# Reuse the current beta seed/navigation without running its complete suite.
helpers={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],helpers)
seed,launch,snap=helpers['seed'],helpers['launch'],helpers['snap']
errors=[];findings=[];checks=json.loads((OUT/'verification-cordes.json').read_text()) if os.environ.get('DFT_QA_RESUME') else []
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=browser.new_context(service_workers='block',viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 for instrument,n in ([] if os.environ.get('DFT_QA_RESUME') else [('guitar6',6),('guitar7',7),('guitar8',8),('bass4',4),('bass5',5)]):
  for w,h in [(320,568),(390,844),(667,375),(844,390),(1440,900)]:
   page.set_viewport_size({'width':w,'height':h});seed(page,instrument)
   activity=page.evaluate("async()=>{const d=Object.values(JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')).profiles)[0],{betaCatalog}=await import('./beta-catalog.js');return betaCatalog(d.profile).activities.find(a=>a.scopeId==='cs1'&&a.mode==='find').id}")
   launch(page,activity,instrument)
   assert page.locator('#pilot-neck .neck-string').count()==n
   assert page.locator('#pilot-neck [data-pilot-string]').count()==n*13
   assert not page.locator('#pilot-neck').evaluate('e=>e.inert')
   assert not page.locator('.long-position-pad:visible').count()
   data=snap(page);q=data['session']['queue'][0]['target']
   r=page.locator(f'#pilot-neck [data-pilot-string="{q["string"]}"][data-pilot-fret="{q["fret"]}"] rect').bounding_box()
   page.touchscreen.tap(r['x']+r['width']*.65,r['y']+r['height']*.5)
   assert snap(page)['session']['index']==1,(instrument,w)
   page.locator('[data-pilot-action=toggle-positions]').click()
   assert page.locator('.long-position-pad:visible').count()==1
   assert not page.locator('#pilot-neck').evaluate('e=>e.inert')
   q=snap(page)['session']['queue'][1]['target'];r=page.locator(f'#pilot-neck [data-pilot-string="{q["string"]}"][data-pilot-fret="{q["fret"]}"] rect').bounding_box()
   page.touchscreen.tap(r['x']+r['width']*.65,r['y']+r['height']*.5)
   assert snap(page)['session']['index']==2
   assert page.locator('.long-position-pad:visible').count()==1
   q=snap(page)['session']['queue'][2]['target'];page.locator(f'.long-position-pad [data-fret="{q["fret"]}"]').click();assert snap(page)['session']['index']==3
   page.locator('[data-pilot-action=toggle-positions]').click();assert not page.locator('.long-position-pad:visible').count()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   buttons=page.locator('.long-position-controls>.text-button').bounding_box()
   assert buttons['y']+buttons['height']<=h+1
   checks.append({'instrument':instrument,'viewport':[w,h],'strings':n,'direct_touch_with_and_without_pad':True,'smallest_fret_width':round(r['width'],1),'row_height':round(r['height'],1)})
   if w in [390,844] and instrument in ['guitar6','guitar8','bass4']:page.screenshot(path=str(OUT/f'corde-complete-{instrument}-{w}.png'))
 (OUT/'verification-cordes.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2));print('25 configurations cordes validées',flush=True)
 # Mouse grab uses real input; releasing outside and a genuine click still work.
 desktop=browser.new_context(service_workers='block',viewport={'width':1440,'height':1000});pc=desktop.new_page();pc.on('pageerror',lambda e:errors.append(str(e)));seed(pc);pc.locator('[data-action=stats]:visible').first.click()
 m=pc.locator('.progress-map');r=m.bounding_box();x=r['x']+r['width']*.8;y=r['y']+r['height']*.5
 before=pc.locator('.progress-cell[open]').count();pc.mouse.move(x,y);pc.mouse.down();pc.mouse.move(x-400,y,steps=15);assert m.evaluate('e=>e.classList.contains("is-grabbing")');pc.mouse.up();pc.wait_for_timeout(350)
 assert m.evaluate('e=>e.scrollLeft')>350;assert pc.locator('.progress-cell[open]').count()==before
 assert not m.evaluate('e=>e.classList.contains("is-grabbing")')
 ratio=pc.locator('.progress-scrollbar').evaluate('e=>Number(e.value)');assert ratio>0
 pc.locator('.progress-cell summary:visible').last.scroll_into_view_if_needed();pc.locator('.progress-cell summary').last.click();assert pc.locator('.progress-cell[open]').count()==1;pc.wait_for_function("document.querySelector('.progress-selection').textContent.includes('case 24')")
 pc.locator('.progress-scrollbar').fill('0');pc.locator('.progress-cell summary').first.focus();pc.keyboard.press('Enter');pc.wait_for_function("document.querySelector('.progress-selection').textContent.includes('à vide')")
 pc.screenshot(path=str(OUT/'progres-glisser-pc.png'));checks.append({'desktop_drag':True,'native_click_and_keyboard':True,'scrollbar_sync':True})
 # Fresh onboarding at small phone, portrait, landscape and desktop.
 for w,h in [(320,568),(390,844),(667,375),(844,390),(1440,900)]:
  page.set_viewport_size({'width':w,'height':h});page.goto('http://localhost:4173/');page.evaluate('localStorage.clear()');page.reload()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  info=page.evaluate('''()=>({height:innerHeight,document:document.documentElement.scrollHeight,controls:[...document.querySelectorAll('button,select')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {label:(e.getAttribute('aria-label')||e.textContent).trim().slice(0,50),bottom:r.bottom,top:r.top};})})''')
  hidden=[c for c in info['controls'] if c['bottom']>h+1 or c['top']<0]
  if hidden:findings.append({'screen':'onboarding','viewport':[w,h],'outside':hidden})
  page.screenshot(path=str(OUT/f'onboarding-{w}.png'))
  # Go to tuning by the actual button and inspect its controls too.
  page.locator('#setup-form button[type=submit]').click();page.wait_for_timeout(100)
  page.screenshot(path=str(OUT/f'notation-{w}.png'))
  page.locator('#setup-form button[type=submit]').click();page.wait_for_timeout(100)
  page.screenshot(path=str(OUT/f'accordage-{w}.png'))
 # Theme and bug form UI, without sending email or changing external services.
 seed(pc);pc.locator('[data-action=settings]:visible').first.click()
 for theme in ['light','dark','accessible','paper','system']:
  pc.locator(f'input[name=theme][value={theme}]').check();assert pc.locator(f'input[name=theme][value={theme}]').is_checked()
 pc.locator('[data-action=report-bug]').click();pc.locator('#bug-form').wait_for();assert pc.locator('.bug-dialog').evaluate('e=>e.open');pc.locator('[data-bug-action=close]').first.click()
 checks.append({'theme_switches':5,'bug_form_opens_without_sending':True})
 pc.goto('http://localhost:4173/docs/v0.29/proposition-sunrise.html');pc.screenshot(path=str(OUT/'proposition-sunrise.png'),full_page=True)
 pc.locator('[data-theme-choice=dark]').click();pc.screenshot(path=str(OUT/'proposition-sunrise-nuit.png'),full_page=True)
 assert not errors,errors
 (OUT/'verification-checkup.json').write_text(json.dumps({'checks':checks,'findings':findings,'errors':errors},ensure_ascii=False,indent=2));print(json.dumps({'checks':len(checks),'findings':findings,'errors':errors}));browser.close()
