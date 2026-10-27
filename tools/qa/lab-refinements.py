"""Native touch parent navigation, controls and first debug panel."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',is_mobile=True,has_touch=True,viewport={'width':390,'height':844});q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)))
 h['seed'](q,'guitar6','note-4-find')
 def nav():return h['snap'](q)['navigation']
 def swipe(selector='h1',dx=200,dy=0):
  box=q.locator(selector).first.bounding_box();y=max(45,box['y']+min(25,box['height']/2));x=300 if dx<0 else 80
  s=c.new_cdp_session(q);s.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
  for i in range(1,9):
   s.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx*i/8,'y':y+dy*i/8}]});q.wait_for_timeout(25)
  s.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});q.wait_for_timeout(150);s.detach()
 before=nav();assert before['chapter']
 swipe();assert nav()['chapter'] is None and nav()['route']==before['route'];checks.append('chapter to route')
 # Swipe directly over a navigation tile: no ghost click into its child.
 swipe('.lesson-row');assert nav()['route'] is None and nav()['branch']=='targeted';checks.append('route to branch over a button')
 swipe();assert nav()=={'branch':None,'route':None,'chapter':None};checks.append('branch to root')
 swipe();assert nav()=={'branch':None,'route':None,'chapter':None};checks.append('root unchanged')
 swipe(dx=-200);assert nav()['branch']=='targeted';checks.append('left swipe follows forward history')
 q.locator('[data-action=settings]:visible').first.click();assert q.locator('.content > .panel').first.get_attribute('class')=='panel debug-panel';checks.append('debug first panel')
 q.screenshot(path='work/sandbox/debug-first-mobile.png',full_page=True)
 h['launch'](q,'note-4-find');assert q.locator('.pilot-game').count()
 # Real native gesture in the header exits to the existing chapter.
 swipe('.game-header');assert not q.locator('.pilot-game').count();assert nav()['chapter'];checks.append('activity to chapter')
 # A visual course similarly closes to its chapter.
 q.locator('[data-action=home]:visible').first.click();q.locator('[data-pilot-action=beta-branch][data-id=beginner]').click()
 q.locator('[data-pilot-action=beta-route][data-id=beginner]').click();q.locator('[data-pilot-action=beta-chapter]').first.click();q.locator('[data-pilot-action=beta-course]').first.click()
 swipe('.course-content h1');assert not q.locator('.course-page').count();assert nav()['chapter'];checks.append('course to chapter')
 assert not errors,errors
 Path('work/sandbox/parent-swipe.json').write_text(json.dumps({'checks':checks,'errors':errors},indent=2));b.close()
print('Parent swipe and debug layout passed.')
