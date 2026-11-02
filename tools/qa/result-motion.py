from pathlib import Path
from playwright.sync_api import sync_playwright
out=Path('work/result-motion');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);q=b.new_page(viewport={'width':1440,'height':1000});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 q.goto('http://localhost:4173/result-motion.html');assert q.locator('.motion-board').count()==3
 q.locator('#replay-all').click();q.wait_for_timeout(2800)
 assert q.locator('.demo-score strong').all_text_contents()==['4\u202f450']*3
 for slider in q.locator('.board-controls input').all():
  slider.fill('0');assert slider.locator('xpath=../../..').locator('.demo-result').evaluate('e=>getComputedStyle(e).opacity')=='0';slider.fill('1000')
 q.screenshot(path=str(out/'desktop.png'),full_page=True)
 q.locator('#reduce-motion').check();q.locator('#replay-all').click();q.wait_for_timeout(400)
 assert q.locator('.demo-result').evaluate_all('es=>es.every(e=>getComputedStyle(e).transform==="none")')
 for width in [390,844]:
  q.set_viewport_size({'width':width,'height':844});assert q.evaluate('document.documentElement.scrollWidth<=innerWidth+1');q.screenshot(path=str(out/f'mobile-{width}.png'),full_page=True)
 assert not errors,errors;b.close()
print('Motion boards passed: replay, scrub, reduced motion and responsive layouts.')
