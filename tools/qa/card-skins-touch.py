from playwright.sync_api import sync_playwright
import json
from pathlib import Path
Path('work/card-skins').mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block');page=c.new_page();page.goto('http://localhost:4173/')
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6'),s=initialPilotStore();s.profiles[profile.key]={profile,attempts:[],later:[],session:null};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''');page.reload();page.locator('[data-action=achievements]:visible').first.click();page.wait_for_timeout(250)
 card=page.locator('.achievement-card').first;card.scroll_into_view_if_needed();box=card.bounding_box();cdp=c.new_cdp_session(page)
 x=box['x']+box['width']*.3;y=max(140,min(400,box['y']+150))
 def touch(kind,x,y):cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[] if kind=='touchEnd' else [{'x':x,'y':y}]})
 touch('touchStart',x,y)
 for i in range(1,9):touch('touchMove',x+i*9,y+2);page.wait_for_timeout(18)
 assert card.evaluate('e=>e.classList.contains("is-dragging")')
 assert card.locator('.achievement-tilt').evaluate('e=>e.style.getPropertyValue("--tilt-y")') not in ['', '0deg']
 touch('touchEnd',x+72,y);page.wait_for_timeout(400);assert not card.evaluate('e=>e.classList.contains("is-tilting")')
 # Vertical scrolling remains native and does not claim the card.
 card.scroll_into_view_if_needed();box=card.bounding_box();x=box['x']+box['width']*.3;y=400;before=page.evaluate('scrollY');touch('touchStart',x,y)
 for i in range(1,9):touch('touchMove',x,y-i*16);page.wait_for_timeout(18)
 touch('touchEnd',x,y-128);page.wait_for_timeout(300);assert page.evaluate('scrollY')>before+20
 assert not card.evaluate('e=>e.classList.contains("is-dragging")')
 # The existing Album stays a three-column mobile overview, opening real controls.
 page.locator('[data-success-action=layout]').click();assert page.locator('.album-thumbnail').count()>0
 cols=page.locator('.achievement-grid').evaluate('e=>getComputedStyle(e).gridTemplateColumns.split(" ").length');assert cols==3,cols
 page.locator('.album-thumbnail').first.click();page.wait_for_timeout(250);assert page.locator('.collection-dialog[open] .achievement-front').count()==1
 page.locator('[data-success-action=collapse]').click();page.emulate_media(reduced_motion='reduce')
 page.locator('[data-success-action=layout]').click();card=page.locator('.achievement-card').first;card.scroll_into_view_if_needed();assert card.locator('.card-reflection').evaluate('e=>getComputedStyle(e).display')=='none'
 Path('work/card-skins/touch.json').write_text(json.dumps({'horizontalTilt':True,'releaseReset':True,'verticalScroll':True,'albumColumns':cols,'albumExpand':True,'reducedMotion':True},indent=2));b.close()
print('Touch tilt/reset, native vertical scroll, Album and reduced motion passed')
