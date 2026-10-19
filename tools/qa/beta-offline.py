from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
OUT=Path(os.environ.get('ADH_QA_OUTPUT','/tmp/dft-beta-qa'));OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(os.environ.get('ADH_BASE_URL','http://localhost:4173/'))
 page.evaluate('''async()=>{const {makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{STATE_KEY,PILOT_KEY}=await import('./release.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6'),store=initialPilotStore();store.profiles[profile.key]={profile,attempts:[],later:[],session:null,seenInstructions:['find','family-cs1-4'],discoveredModules:['cs1-note-4'],navigation:{route:'cs1',chapter:'cs1-f04'}};localStorage.setItem(STATE_KEY,JSON.stringify({...initialState(),profile,beginnerGuide:true,sound:false}));localStorage.setItem(PILOT_KEY,JSON.stringify(store));}''')
 page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=15000)
 page.reload();page.wait_for_timeout(150)
 cached=page.evaluate('''async()=>{const {RELEASE}=await import('./release.js');const cache=await caches.open((await caches.keys()).find(k=>k.includes(RELEASE)));return (await cache.keys()).map(r=>new URL(r.url).pathname);}''')
 for name in ['learning-evidence.js','navigation-rules.js','instrument-diagram.js','beta-catalog.js','beta-courses.js','beta-home.js','course-ui.js','beta.css']:
  assert any(path.endswith('/'+name) for path in cached),name
 context.set_offline(True);page.reload();page.locator('.chapter-options summary').click();page.locator('[data-module="cs1-note-4-find"]').click();page.wait_for_selector('.pilot-count',state='detached')
 page.wait_for_timeout(150)
 s=page.evaluate("()=>Object.values(JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')).profiles)[0].session")
 q=s['queue'][0];wrong=12 if q['target']['fret']==0 else 0
 svg=page.locator('#pilot-neck svg');page.evaluate('window.qaOriginal=document.querySelector("#pilot-neck svg")')
 page.locator('[data-pilot-action=toggle-positions]').click()
 page.locator(f'.long-position-pad [data-fret="{wrong}"]').click()
 next_state=page.evaluate("()=>Object.values(JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')).profiles)[0].session")
 assert next_state['index']==1
 assert next_state['events'][0]['correct'] is False
 assert page.locator('.echo-dot.tone-wrong').count()==1
 assert page.locator('.echo-label text').last.text_content()==('E2' if q['target']['fret']==0 else 'E3')
 assert page.evaluate('qaOriginal===document.querySelector("#pilot-neck svg")')
 page.wait_for_timeout(150)
 assert float(page.locator('.echo-label').last.evaluate('e=>getComputedStyle(e).opacity'))>.95
 page.locator('[data-pilot-action=exit]').click()
 assert page.locator('[data-module="cs1-note-4-find"]').count()==1
 page.locator('[data-pilot-action=beta-route]').click()
 page.locator('[data-pilot-action=beta-branch]').click();page.locator('[data-pilot-action=beta-catalog]').click()
 page.locator('[data-pilot-action=beta-branch][data-id=beginner]').click();page.locator('[data-pilot-action=beta-route][data-id=beginner]').click()
 page.locator('[data-pilot-action=beta-chapter][data-id=gd-01]').click()
 page.locator('[data-pilot-action=beta-course]').click()
 assert page.locator('.course-page').count()==1
 page.locator('[data-course-action=skip]').click()
 course=page.evaluate("()=>Object.values(JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')).profiles)[0].courses['gd-01']")
 assert course['completed'] is False
 page.locator('[data-pilot-action=beta-route]').click();page.locator('[data-pilot-action=beta-branch]').click();page.locator('[data-pilot-action=beta-catalog]').click()
 # The main first-session action fits the small portrait screen.
 page.set_viewport_size({'width':320,'height':568});page.wait_for_timeout(200)
 box=page.locator('.branch-jumbo').first.bounding_box();nav=page.locator('.mobile-nav').bounding_box()
 assert box['y']+box['height']<=nav['y'],(box,nav)
 assert not errors,errors
 page.screenshot(path=str(OUT/'catalog-small.png'))
 result={'offline_reload':True,'new_modules_precached':True,'offline_course':True,'wrong_octave_rejected':True,'wrong_target_red_and_named':True,'neck_dom_stable':True,'skip_not_validation':True,'small_portrait_primary_visible':True,'errors':errors}
 (OUT/'offline.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
 b.close()
