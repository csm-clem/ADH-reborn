"""Album, modal controls, gesture arbitration and remembered path navigation."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
helpers={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],helpers)
out=Path('work/collection-next');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block')
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 helpers['seed'](page,activity='note-4-find');nav=helpers['snap'](page)['navigation']
 page.locator('[data-action=stats]:visible').first.click()
 page.locator('[data-action=home]:visible').first.click();assert helpers['snap'](page)['navigation']==nav
 page.locator('[data-action=home]:visible').first.click();assert not helpers['snap'](page)['navigation'].get('branch') and not helpers['snap'](page)['navigation'].get('chapter')
 page.locator('[data-action=achievements]:visible').first.click()
 assert page.locator('.album-thumbnail').count()>40
 layouts=[]
 for width,height in [(320,568),(390,844),(844,390),(1440,900)]:
  page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(80)
  assert page.locator('.achievement-grid').evaluate('e=>getComputedStyle(e).gridTemplateColumns.split(" ").length')==3
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.locator('.album-thumbnail').first.click();page.wait_for_timeout(250)
  assert page.locator('.collection-dialog').evaluate('e=>e.open')
  assert page.evaluate('()=>{const ids=[...document.querySelectorAll("[id]")].map(e=>e.id);return ids.length===new Set(ids).size}')
  assert page.locator('.collection-dialog').evaluate('e=>e.scrollWidth<=e.clientWidth')
  page.locator('.collection-dialog .criteria-action').click();page.wait_for_timeout(350)
  assert page.locator('.collection-dialog .achievement-back').evaluate('e=>!e.inert')
  assert page.locator('.collection-dialog .achievement-criteria').count()==1
  page.locator('.album-close').click();assert not page.locator('.collection-dialog').count()
  layouts.append([width,height])
 page.set_viewport_size({'width':390,'height':844});page.locator('[data-success-action=layout]').click()
 card=page.locator('.achievement-card').first;card.scroll_into_view_if_needed();page.wait_for_timeout(150)
 # Actual Chromium touch input lets native pan-y arbitrate the gesture.
 cdp=context.new_cdp_session(page)
 def touch(kind,x=None,y=None):
  cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[] if x is None else [{'x':x,'y':y}]})
 card.locator('.achievement-art').scroll_into_view_if_needed();box=card.locator('.achievement-art').bounding_box();x=box['x']+box['width']*.4;y=box['y']+box['height']*.5
 touch('touchStart',x,y);page.wait_for_timeout(30)
 assert not card.evaluate('e=>e.classList.contains("is-tilting")')
 for dx in [8,18,35,55]:touch('touchMove',x+dx,y);page.wait_for_timeout(20)
 assert card.evaluate('e=>e.classList.contains("is-dragging")')
 assert card.locator('.achievement-tilt').evaluate('e=>e.style.getPropertyValue("--tilt-y")')
 touch('touchEnd');page.wait_for_timeout(450)
 assert not card.evaluate('e=>e.classList.contains("is-tilting")')
 before=page.evaluate('scrollY');card.locator('.achievement-art').scroll_into_view_if_needed();box=card.locator('.achievement-art').bounding_box();x=box['x']+box['width']*.4;y=box['y']+box['height']*.7
 touch('touchStart',x,y)
 for dy in [12,30,60,95]:touch('touchMove',x,y-dy);page.wait_for_timeout(30)
 touch('touchEnd');page.wait_for_timeout(200)
 assert page.evaluate('scrollY')>before
 assert not card.evaluate('e=>e.classList.contains("is-tilting")')
 # An earned card exposes the same compact double check in legend and cells.
 page.locator('[data-action=settings]:visible').first.click();page.locator('[data-action=debug]').click();page.locator('[data-action=stats]:visible').first.click()
 assert page.locator('.double-check').count()>1
 spacing=page.locator('.double-check').evaluate_all('es=>es.map(e=>parseFloat(getComputedStyle(e).letterSpacing))');assert all(n<0 for n in spacing)
 page.locator('[data-action=achievements]:visible').first.click();page.locator('[data-success-action=layout]').click();page.locator('.album-thumbnail').first.click()
 page.wait_for_timeout(280);page.screenshot(path=str(out/'carte-mobile.png'));page.locator('.album-close').click();page.wait_for_timeout(80);page.screenshot(path=str(out/'album-mobile.png'))
 # Keyboard modal escape and reduced motion still expose functional content.
 page.locator('.album-thumbnail').first.click();page.keyboard.press('Escape');assert not page.locator('.collection-dialog').count()
 page.emulate_media(reduced_motion='reduce');page.locator('.album-thumbnail').first.click();assert page.locator('.collection-dialog').evaluate('e=>getComputedStyle(e).animationName')=='none'
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'layouts':layouts,'horizontal_card_drag':True,'vertical_native_scroll':True,'no_tilt_before_gesture':True,'album_modal_controls':True,'path_memory':True,'shared_double_checks':True,'reduced_motion':True,'errors':errors},indent=2))
 browser.close()
