"""One-column layouts, usable long teaching necks, keyboard-only focus and collection gesture."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
out=Path('work/ux-next');out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',has_touch=True,viewport={'width':1920,'height':1080});q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)))
 for w,height in [(320,568),(390,844),(844,390),(1366,768),(1920,1080),(2560,1440)]:
  q.set_viewport_size({'width':w,'height':height});h['launch'](q,'mix-4')
  boxes=q.evaluate('''()=>{const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom}};return {neck:box('#pilot-neck'),answer:box('.answer-workspace'),question:box('.question-copy')}}''')
  assert boxes['answer']['y']>=boxes['neck']['b']-1,(w,boxes)
  if height==1080:assert 245<=boxes['neck']['h']<=255,boxes
  assert q.evaluate("document.documentElement.dataset.keyboard==='false'")
  q.keyboard.press('Tab');assert q.evaluate("document.documentElement.dataset.keyboard==='true'")
  q.locator('[data-pilot-action=mute]').click();assert q.evaluate("document.documentElement.dataset.keyboard==='false'")
  q.screenshot(path=str(out/f'game-{w}.png'));checks.append({'one_column':[w,height],'neck_height':round(boxes['neck']['h'])})
 q.set_viewport_size({'width':390,'height':844})
 for scope in ['cs1','c24s1']:
  activity=scope+'-note-9-discover';h['seed'](q,'guitar6',activity);q.evaluate('''()=>{const k='fretboard-trainer:pilot:stable',s=JSON.parse(localStorage.getItem(k));Object.values(s.profiles)[0].seenInstructions=[];localStorage.setItem(k,JSON.stringify(s));}''');q.reload();q.locator('.chapter-options summary').click();q.locator(f'[data-module="{activity}"]').click();svg=q.locator('svg[data-neck-scroll=true]');assert svg.count() and svg.bounding_box()['height']>=239
  visual=q.locator('.lesson-neck-scroll');assert visual.evaluate('e=>e.scrollWidth>e.clientWidth');q.screenshot(path=str(out/f'intro-{scope}.png'));checks.append('readable scrollable intro '+scope)
 h['seed'](q);q.locator('[data-pilot-action=beta-branch][data-id=targeted]').click();box=q.locator('h1').bounding_box();x=75;y=box['y']+12;q.dispatch_event('h1','pointerdown',{'pointerType':'touch','isPrimary':True,'pointerId':44,'clientX':x,'clientY':y});q.dispatch_event('h1','pointermove',{'pointerType':'touch','isPrimary':True,'pointerId':44,'clientX':x+100,'clientY':y});assert 'translate3d' in q.locator('.content').get_attribute('style');q.dispatch_event('h1','pointerup',{'pointerType':'touch','isPrimary':True,'pointerId':44,'clientX':x+100,'clientY':y});q.wait_for_timeout(240);assert q.locator('.branch-jumbo').count()==3;checks.append('page follows finger and returns through history')
 q.locator('[data-action=achievements]:visible').first.click();card=q.locator('.achievement-card').first;card.scroll_into_view_if_needed();art=card.locator('.achievement-art');box=art.bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
 touch=c.new_cdp_session(q);touch.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
 for dx in [8,15,25,35]:touch.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx,'y':y+1}]});q.wait_for_timeout(25)
 q.wait_for_timeout(150);assert card.locator('.achievement-tilt').evaluate("e=>parseFloat(e.style.getPropertyValue('--drag-x'))>0");touch.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});q.wait_for_timeout(450);assert not card.locator('.achievement-tilt').get_attribute('style') or '--tilt-x' not in card.locator('.achievement-tilt').get_attribute('style');checks.append('damped touch card and return to flat')
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'checks':checks,'errors':errors,'real_devices':False},indent=2));b.close()
print('New UX requirements passed.')
