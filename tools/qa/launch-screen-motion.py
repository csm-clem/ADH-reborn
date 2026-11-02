from pathlib import Path
from playwright.sync_api import sync_playwright
out=Path('work/launch-screen-motion');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);q=b.new_page(viewport={'width':1440,'height':1100});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 q.goto('http://localhost:4173/launch-motion.html');q.clock.install();assert q.locator('.launch-board').count()==3
 for board in q.locator('.launch-board').all():
  slider=board.locator('input');panel=board.locator('.page-transition');states=[]
  for progress in ['0','500','1000']:
   slider.fill(progress);states.append(panel.evaluate('e=>[e.style.transform,e.style.opacity]'))
  assert len({str(x) for x in states})==3,states
  assert board.locator('.page-after').evaluate('e=>e.style.opacity')=='1'
  slider.fill('620');assert board.locator('.launch-preview-text').evaluate('e=>getComputedStyle(e).color')=='rgb(255, 255, 255)'
  assert '0.85' in board.locator('.launch-preview-text').get_attribute('style')
 q.screenshot(path=str(out/'zoom-out.png'),full_page=True)
 q.locator('[name=text-zoom][value=in]').check()
 for slider in q.locator('.board-controls input').all():slider.fill('620')
 assert q.locator('.launch-preview-text').evaluate_all('es=>es.every(e=>getComputedStyle(e).transform.startsWith("matrix(1,"))')
 q.screenshot(path=str(out/'zoom-in.png'),full_page=True)
 q.locator('#launch-replay-all').click();q.clock.run_for(2600);assert q.locator('.launch-board').evaluate_all('es=>es.every(e=>e.dataset.progress==="1")')
 q.locator('[data-launch-fullscreen]').first.click();q.wait_for_function('document.fullscreenElement!==null');q.locator('.fs-exit:visible').click();q.wait_for_function('document.fullscreenElement===null')
 q.locator('#launch-reduce').check();q.locator('#launch-replay-all').click();q.clock.run_for(350)
 assert q.locator('.mock-page').evaluate_all('es=>es.every(e=>e.style.transform==="none")')
 q.clock.run_for(400)
 q.set_viewport_size({'width':390,'height':844});assert q.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 assert not errors,errors;b.close()
print('Whole-screen Arcade boards passed: entry/exit of all panels, previous/next context, white text, both zooms, replay/scrub, mobile and reduced motion.')
