from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':375,'height':812},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for instrument,activity in [('guitar6','opens'),('guitar6','note-4'),('guitar8','note-6'),('bass4','note-4')]:
  seed(page,instrument,activity);page.locator(f'.lesson-row[data-module="{activity}"]').click()
  for w,h in [(320,480),(375,812),(844,390),(568,320),(1280,720)]:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(250);bad=page.evaluate('''()=>[...document.querySelectorAll('.instruction-page button')].filter(e=>{if(!e.checkVisibility())return false;const r=e.getBoundingClientRect(),top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return r.top<0||r.left<0||r.right>innerWidth+.5||r.bottom>innerHeight+.5||!e.contains(top)}).map(e=>({text:e.innerText,box:e.getBoundingClientRect().toJSON()}))''');assert not bad,(instrument,activity,w,h,bad)
  page.set_viewport_size({'width':375,'height':812});page.wait_for_timeout(200);page.screenshot(path=str(OUT/f'lesson-{instrument}-{activity}-v018.png'))
 assert not errors,errors;print(json.dumps({'twenty_lesson_layouts':True,'all_actions_visible_and_touchable':True,'errors':errors}));b.close()
