"""Course gestures and retries on representative extended scopes, using real browser input."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
h['BASE']='http://localhost:4173/?curriculum=full'
checks=[];errors=[]
def open_course(q,course,instrument='guitar6',index=0):
 h['seed'](q,instrument)
 q.evaluate('''({id,index})=>{const k='fretboard-trainer:pilot:stable',s=JSON.parse(localStorage.getItem(k)),d=Object.values(s.profiles)[0];d.navigation={branch:'targeted',route:id.replace(/-entry$|-co$/,''),chapter:id};d.courses={[id]:{index,visited:[],correct:[],completed:false}};localStorage.setItem(k,JSON.stringify(s));}''',{'id':course,'index':index});q.reload();q.locator('[data-pilot-action=beta-course]').first.click()
def current(q,course):
 return q.evaluate('''async id=>{const d=Object.values(JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')).profiles)[0],{betaCatalog}=await import('./beta-catalog.js'),{betaCourses,coursePage}=await import('./beta-courses.js'),c=betaCourses(d.profile,betaCatalog(d.profile,{full:true})).get(id),r=d.courses[id];return {page:coursePage(c,r),record:r,strings:c.strings};}''',course)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',has_touch=True,is_mobile=True);q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)))
 for width,height in [(320,568),(844,390),(1440,900)]:
  q.set_viewport_size({'width':width,'height':height});open_course(q,'c24s1-entry',index=2)
  neck=q.locator('.course-neck-scroll');assert neck.evaluate('e=>e.scrollWidth>e.clientWidth')
  assert q.locator('.course-position-options').get_attribute('open') is None
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert q.locator('[data-lesson-string="5"]').count()==25
  # Mouse grab never submits, including when starting over a hit target.
  box=neck.bounding_box();x=box['x']+box['width']*.7;y=box['y']+60
  q.mouse.move(x,y);q.mouse.down();q.mouse.move(x-100,y,steps=8);q.mouse.up()
  assert neck.evaluate('e=>e.scrollLeft')>30
  assert not current(q,'c24s1-entry')['record']['correct']
  assert not current(q,'c24s1-entry')['record'].get('variants')
  # Native touch pan also leaves the question unanswered.
  neck.evaluate('e=>e.scrollLeft=300');cdp=c.new_cdp_session(q)
  for kind,dx in [('touchStart',0),('touchMove',15),('touchMove',50),('touchMove',95),('touchEnd',None)]:
   cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[] if dx is None else [{'x':box['x']+50+dx,'y':y}]});q.wait_for_timeout(25)
  q.wait_for_timeout(100);assert neck.evaluate('e=>e.scrollLeft')<300
  assert not current(q,'c24s1-entry')['record'].get('variants')
  # Wrong string changes the example, but keeps the target on the studied string.
  q.locator('[data-lesson-string="5"][data-lesson-fret="0"] rect').click()
  state=current(q,'c24s1-entry');assert state['record']['variants']['address-0']==1;assert state['page']['quiz']['target']['string']==0
  t=state['page']['quiz']['target'];q.locator(f'[data-lesson-string="{t["string"]}"][data-lesson-fret="{t["fret"]}"] rect').click()
  assert 'address-0' in current(q,'c24s1-entry')['record']['correct']
  q.screenshot(path=f'docs/v0.37/course24-{width}.png')
  checks.append({'viewport':[width,height],'mouse':'no answer','touch':'no answer','retry':'same physical string','directTap':'passed'})
 # Complete representative entry lessons entirely via their visible controls.
 for instrument,course in [('guitar6','duo1-entry'),('guitar8','c24s8-entry'),('bass4','mix24-entry'),('bass5','z6-entry')]:
  q.set_viewport_size({'width':390,'height':844});open_course(q,course,instrument)
  for _ in range(12):
   if not q.locator('.course-page').count():break
   state=current(q,course);page=state['page'];quiz=page.get('quiz')
   if quiz:
    if quiz['kind']=='position':
     t=quiz['target'];assert t['string'] in state['strings'];q.locator(f'[data-lesson-string="{t["string"]}"][data-lesson-fret="{t["fret"]}"] rect').click()
    else:q.locator(f'[data-course-action=answer][data-value="{quiz["answer"]}"]').click()
   assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
   q.locator('[data-course-action=next]').click()
  assert current(q,course)['record']['completed']
  checks.append({'instrument':instrument,'course':course,'completed':True})
 assert not errors,errors
 Path('docs/v0.37/course-browser.json').write_text(json.dumps({'checks':checks,'errors':errors},indent=2));b.close()
 print('Course input checks passed:',len(checks))
