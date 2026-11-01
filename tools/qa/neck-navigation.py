from pathlib import Path
from playwright.sync_api import sync_playwright
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
out=Path('work/neck-navigation');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);q=b.new_page(viewport={'width':1440,'height':900});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 h['seed'](q,'guitar6','z2-note-4-discover')
 icons=q.locator('.sidebar .nav-item svg');assert icons.count()==5
 for svg in icons.all():assert svg.get_attribute('fill')=='none' and svg.get_attribute('stroke-linejoin')=='round'
 q.screenshot(path=str(out/'navigation.png'))
 h['launch'](q,'z2-note-4-discover');svg=q.locator('#pilot-neck svg')
 ratio=svg.evaluate('e=>e.viewBox.baseVal.width/e.viewBox.baseVal.height')
 expected=q.evaluate('''async()=>{const {neckGeometry}=await import('./core.js');const g=neckGeometry(6,8,648,{gameplay:true,startFret:4});return g.width/g.height;}''');assert abs(ratio-expected)<.001,(ratio,expected)
 assert svg.locator('linearGradient[id$="left-fade"]').count()==1
 q.screenshot(path=str(out/'zone-discover.png'))
 h['seed'](q,'guitar6','z2-mix-4');q.locator('.chapter-options summary').click();q.locator('[data-pilot-action=start][data-module=z2-mix-4]').click()
 q.wait_for_selector('.launch-screen.pilot-count')
 bg=q.locator('.launch-screen').evaluate('e=>getComputedStyle(e).backgroundImage');assert '87, 171, 207' in bg and '32, 41, 128' in bg,bg
 q.screenshot(path=str(out/'course-launch.png'))
 q.wait_for_selector('.pilot-count',state='detached');q.locator('[data-pilot-action=exit]').click();q.locator('.sidebar [data-action=arcade]').click();q.locator('[data-mode=zones-natural]').click()
 bg=q.locator('.launch-screen').evaluate('e=>getComputedStyle(e).backgroundImage');assert '248, 167, 68' in bg and '233, 70, 71' in bg,bg
 q.screenshot(path=str(out/'arcade-launch.png'))
 assert not errors,errors;b.close()
print('Navigation, unscaled zone discovery, left fade and both launch gradients passed.')
