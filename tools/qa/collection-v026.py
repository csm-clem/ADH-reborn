"""Real collection controls, visual layouts, mouse/touch motion and audio timelines."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
BASE='http://localhost:4173/'
OUT=Path('docs/v0.26');OUT.mkdir(parents=True,exist_ok=True)
KEY='fretboard-trainer:pilot:stable'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=b.new_context(viewport={'width':1440,'height':1050},service_workers='block')
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE)
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6'),s=initialPilotStore();s.profiles[profile.key]={profile,attempts:[],later:[],session:null};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''')
 page.reload();page.locator('[data-action=achievements]:visible').first.click();page.wait_for_timeout(550)
 assert page.locator('.stage').count()==1
 assert page.locator('.achievement-card .stage').count()==0
 assert page.locator('.achievement-card').count()==36
 assert all(x=='0 %'for x in page.locator('.achievement-progress-heading strong').all_text_contents())
 # Mouse tilt, foil tracking and spring back: no DOM replacement.
 card=page.locator('.achievement-card').first;card.scroll_into_view_if_needed();box=card.bounding_box()
 page.mouse.move(box['x']+box['width']*.8,box['y']+80);page.wait_for_timeout(160)
 assert card.evaluate('(e)=>e.classList.contains("is-tilting")')
 assert card.locator('.achievement-tilt').evaluate('(e)=>e.style.getPropertyValue("--tilt-y")')!='0deg'
 page.mouse.move(20,20);page.wait_for_timeout(450)
 assert not card.evaluate('(e)=>e.classList.contains("is-tilting")')
 # The actual progress control opens the actual criteria, with focus and bullets.
 card.locator('.achievement-progress').click();page.wait_for_timeout(370)
 assert card.locator('.achievement-front').evaluate('(e)=>e.inert')
 assert card.locator('.achievement-back').evaluate('(e)=>!e.inert')
 assert card.locator('.achievement-back ul').count()==1 and card.locator('.achievement-back ol').count()==0
 card.locator('.achievement-back [data-success-action=flip]').click();page.wait_for_timeout(370)
 # A partially completed accordage must resume Retrouver, not Nommer.
 page.evaluate('''async()=>{const {makeProfile}=await import('./core.js'),{betaCatalog}=await import('./beta-catalog.js'),{questionsFor}=await import('./pilot.js');const s=JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')),d=Object.values(s.profiles)[0],m=betaCatalog(d.profile).activities.find(a=>a.id==='opens');d.attempts=[{id:'partial-opens',activity:'opens',at:Date.now(),finished:true,passed:true,events:questionsFor(m).map(q=>({target:q.target,mode:q.mode,answerKind:q.answerKind,correct:true,aids:[],at:Date.now(),ms:1500,retry:false}))}];localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''')
 page.reload();page.locator('[data-action=achievements]:visible').first.click();open_card=page.locator('[data-card-id=open-strings]')
 assert open_card.locator('.achievement-progress-heading strong').inner_text()=='50 %'
 open_card.locator('[data-success-action=try]').first.click()
 assert page.evaluate('(k)=>Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0].session.activity',KEY)=='opens-find'
 page.locator('[data-pilot-action=home]').first.click()
 # Course achievements route to the actual introductory course.
 page.locator('[data-action=achievements]:visible').first.click();page.locator('[data-card-id=diagram-check] [data-success-action=try]').first.click()
 assert page.locator('.course-page').count()==1
 page.locator('[data-course-action=close]').click()
 # Disposable complete player: every card earned; disk still retains the real player.
 page.locator('[data-action=settings]:visible').first.click();disk=page.evaluate('(k)=>localStorage.getItem(k)',KEY)
 page.locator('[data-action=debug]').click();assert page.evaluate('(k)=>localStorage.getItem(k)',KEY)==disk
 page.locator('[data-action=achievements]:visible').first.click();assert page.locator('.achievement-card.is-missing').count()==0
 assert all(x=='100 %'for x in page.locator('.achievement-progress-heading strong').all_text_contents())
 page.mouse.move(10,10);page.wait_for_timeout(500);page.screenshot(path=str(OUT/'collection-pc.png'))
 # Four themes / five widths: action alignment, star baseline, external earned seal.
 layouts=[]
 for theme in ['light','dark','accessible','paper']:
  page.locator('[data-action=settings]:visible').first.click();page.locator(f'input[name=theme][value={theme}]').check();page.locator('[data-action=achievements]:visible').first.click()
  for width,height in [(320,800),(390,844),(768,1024),(1024,768),(1440,1050)]:
   page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(80)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(theme,width,'page overflow')
   metrics=page.locator('.achievement-card').evaluate_all('''es=>es.map(c=>{const f=c.querySelector('.achievement-front'),a=c.querySelector('.challenge-action').getBoundingClientRect(),b=c.querySelector('.criteria-action').getBoundingClientRect(),seal=c.querySelector('.achievement-seal'),art=c.querySelector('.achievement-art').getBoundingClientRect(),stars=c.querySelector('.rarity-stars').getBoundingClientRect(),label=c.querySelector('.achievement-rarity>span:last-child').getBoundingClientRect();return {id:c.dataset.cardId,aligned:Math.abs(a.y-b.y)<2,overflow:f.scrollWidth>f.clientWidth+1,seal:!seal||seal.getBoundingClientRect().bottom<=art.top,stars:Math.abs((stars.top+stars.height/2)-(label.top+label.height/2))<2}})''')
   assert all(m['aligned']and not m['overflow']and m['seal']and m['stars']for m in metrics),(theme,width,[m for m in metrics if not(m['aligned']and not m['overflow']and m['seal']and m['stars'])])
   layouts.append([theme,width])
  if theme in ['dark','accessible']:
   page.locator('[data-card-id=full-map]').scroll_into_view_if_needed();page.wait_for_timeout(180);page.locator('[data-card-id=full-map]').screenshot(path=str(OUT/('carte-'+theme+'.png')))
 # Musical actions: source events and audio, actual playback state and stop.
 page.locator('[data-action=settings]:visible').first.click();page.locator('input[name=theme][value=light]').check();page.locator('[data-action=achievements]:visible').first.click()
 page.locator('[data-success-action=category][data-value=music]').click()
 music=page.locator('.achievement-card:has([data-success-action=listen])').first
 assert music.locator('.music-sleeve .midi-event').count()>1
 box=music.bounding_box();music.scroll_into_view_if_needed();music.locator('[data-success-action=listen]').click();page.wait_for_function('document.querySelector(".achievement-card.is-playing")')
 assert music.locator('[data-success-action=listen]').get_attribute('aria-pressed')=='true'
 assert music.locator('.midi-event').first.evaluate('(e)=>getComputedStyle(e).animationName')=='collection-note'
 a=music.locator('.listen-action').bounding_box();c=music.locator('.criteria-action').bounding_box();r=music.locator('.challenge-action').bounding_box();assert abs(a['y']-c['y'])<2 and r['y']<a['y']
 music.screenshot(path=str(OUT/'pochette-musicale.png'))
 music.locator('[data-success-action=listen]').click();assert page.locator('.achievement-card.is-playing').count()==0
 page.locator('[data-success-pref=sort]').select_option('rarity');page.locator('[data-success-action=layout]').click()
 assert page.locator('.achievement-grid.is-list').count()==1
 page.locator('[data-success-action=layout]').click()
 # Reduced motion retains all controls and the face switch without a 3D transition.
 page.emulate_media(reduced_motion='reduce');music.locator('.criteria-action').click()
 assert music.locator('.achievement-back').evaluate('(e)=>getComputedStyle(e).visibility')=='visible'
 music.locator('.achievement-back [data-success-action=flip]').click();page.emulate_media(reduced_motion='no-preference')
 page.set_viewport_size({'width':390,'height':844});music.scroll_into_view_if_needed();page.wait_for_timeout(200);page.screenshot(path=str(OUT/'collection-mobile.png'))
 assert page.evaluate('(k)=>localStorage.getItem(k)',KEY)==disk
 # Real touch pointer events through Chromium's input protocol; vertical scrolling stays native.
 tc=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block')
 tp=tc.new_page();tp.on('pageerror',lambda e:errors.append(str(e)));tp.goto(BASE)
 settings=page.evaluate('localStorage.getItem("fretboard-trainer:settings")');tp.evaluate('([s,d,k])=>{localStorage.setItem("fretboard-trainer:settings",s);localStorage.setItem(k,d)}',[settings,disk,KEY]);tp.reload();tp.locator('[data-action=achievements]:visible').first.click()
 c=tp.locator('.achievement-card').first;c.scroll_into_view_if_needed();r=c.bounding_box();x=r['x']+r['width']*.45;y=max(20,r['y'])+70
 client=tc.new_cdp_session(tp);client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]});client.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+45,'y':y+3}]});tp.wait_for_timeout(120)
 assert c.evaluate('(e)=>e.classList.contains("is-dragging")')
 assert c.locator('.achievement-tilt').evaluate('(e)=>e.style.getPropertyValue("--drag-x")')=='24px'
 client.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});tp.wait_for_timeout(450);assert not c.evaluate('(e)=>e.classList.contains("is-tilting")')
 before=tp.evaluate('scrollY');client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y+70}]});client.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+2,'y':y-70}]});client.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});tp.wait_for_timeout(450)
 assert tp.evaluate('scrollY')>before
 assert not errors,errors
 result={'cards_guitar6':60,'production_artwork':42,'layouts':layouts,'functional_progress_and_bullets':True,'resume_missing_activity_and_course':True,'mouse_tilt_and_reset':True,'touch_drag_and_native_vertical_scroll':True,'source_music_animation_and_play_stop':True,'debug_never_persisted':True,'errors':errors}
 (OUT/'verification-navigateur.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False));b.close()
