"""Real touch input: contact, tiny motion, horizontal drag and native page scrolling."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
OUT=Path('docs/v0.28');OUT.mkdir(exist_ok=True,parents=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);context=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block');page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:4173/')
 page.evaluate('''async()=>{const {makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6'),s=initialPilotStore();s.profiles[profile.key]={profile,attempts:[],later:[],session:null};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''');page.reload()
 page.locator('[data-action=settings]:visible').first.click();page.locator('[data-action=debug]').click();page.locator('[data-action=achievements]:visible').first.click()
 client=context.new_cdp_session(page);findings=[]
 def touch(kind,x=None,y=None):client.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[] if x is None else [{'x':x,'y':y}]})
 for rarity in ['common','rare','legendary']:
  card=page.locator(f'.achievement-card.rarity-{rarity}').first;card.locator('.achievement-art').scroll_into_view_if_needed();rect=card.locator('.achievement-art').bounding_box();x=rect['x']+rect['width']*.44;y=rect['y']+rect['height']*.4
  touch('touchStart',x,y);page.wait_for_timeout(300)
  assert 'is-tilting' in card.get_attribute('class');assert 'is-dragging' not in card.get_attribute('class')
  assert float(card.locator('.card-reflection').evaluate('e=>getComputedStyle(e).opacity'))>=.65
  initial=card.locator('.achievement-tilt').evaluate('e=>e.style.getPropertyValue("--light-x")')
  touch('touchMove',x+3,y+1);page.wait_for_timeout(80)
  assert card.locator('.achievement-tilt').evaluate('e=>e.style.getPropertyValue("--light-x")')!=initial
  touch('touchMove',x+35,y+2);page.wait_for_timeout(150)
  assert 'is-dragging' in card.get_attribute('class')
  page.screenshot(path=str(OUT/f'reflet-tactile-{rarity}.png'))
  touch('touchEnd');page.wait_for_timeout(450)
  assert 'is-tilting' not in card.get_attribute('class');assert card.locator('.achievement-tilt').evaluate('e=>e.style.getPropertyValue("--tilt-x")')==''
  findings.append(rarity)
 # A deliberate vertical gesture still scrolls; canceling it clears the highlight.
 card=page.locator('.achievement-card').first;card.locator('.achievement-art').scroll_into_view_if_needed();r=card.locator('.achievement-art').bounding_box();x=r['x']+r['width']*.5;y=r['y']+r['height']*.65;before=page.evaluate('scrollY')
 touch('touchStart',x,y);touch('touchMove',x,y-30);page.wait_for_timeout(40);touch('touchMove',x,y-120);page.wait_for_timeout(80);touch('touchEnd');page.wait_for_timeout(400)
 assert page.evaluate('scrollY')>before+10;assert 'is-tilting' not in card.get_attribute('class')
 # Buttons are genuine controls, not gesture areas.
 card.locator('.criteria-action').tap();page.wait_for_timeout(350);assert 'is-flipped' in card.get_attribute('class');card.locator('.achievement-back [data-success-action=flip]').tap()
 page.emulate_media(reduced_motion='reduce');card.locator('.achievement-art').scroll_into_view_if_needed();r=card.locator('.achievement-art').bounding_box();touch('touchStart',r['x']+40,r['y']+40);page.wait_for_timeout(100);assert 'is-tilting' not in card.get_attribute('class');touch('touchEnd')
 assert not errors,errors
 result={'immediate_touch_and_tiny_motion':findings,'horizontal_drag_and_return':True,'vertical_scroll_preserved':True,'buttons_work':True,'reduced_motion':True,'errors':errors};(OUT/'verification-tactile.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result));b.close()
