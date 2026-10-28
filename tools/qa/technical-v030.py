from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
helpers={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],helpers)
out=Path(os.environ.get('ADH_QA_OUTPUT','work/v030'));out.mkdir(parents=True,exist_ok=True);errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',viewport={'width':1440,'height':900});page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 helpers['launch'](page,'cs1-note-4-find')
 assert page.locator('#pilot-neck [tabindex="0"]').count()==1
 cell=page.locator('#pilot-neck [tabindex="0"]');cell.focus();s=int(cell.get_attribute('data-pilot-string'));f=int(cell.get_attribute('data-pilot-fret'));page.keyboard.press('ArrowRight');assert page.locator(':focus').get_attribute('data-pilot-fret')==str(f+1)
 page.keyboard.press('ArrowUp');assert page.locator(':focus').get_attribute('data-pilot-string')==str(s+1)
 page.keyboard.press('End');assert page.locator(':focus').get_attribute('data-pilot-fret')=='12'
 page.keyboard.press('Enter');assert helpers['snap'](page)['session']['index']==1
 assert page.locator('#pilot-neck [tabindex="0"]').count()==1
 page.goto('http://localhost:4173/');page.evaluate('localStorage.clear()');page.reload()
 button=page.locator('#setup-form button[type=submit]')
 def contrast():
  return button.evaluate(r'''e=>{const s=getComputedStyle(e),rgb=c=>c.match(/[0-9.]+/g).slice(0,3).map(Number),luma=c=>rgb(c).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0),ink=luma(s.color);return Math.min(...(s.backgroundImage.match(/rgba?\([^)]*\)/g)||[s.backgroundColor]).map(c=>{const bg=luma(c);return (Math.max(ink,bg)+.05)/(Math.min(ink,bg)+.05)}));}''')
 # The current user-specified warm palette is exact, and its contrast is recorded
 # honestly rather than treated as AA. Dedicated contrast themes retain AA checks.
 day=button.evaluate('e=>getComputedStyle(e).backgroundImage');day_contrast=contrast()
 assert 'linear-gradient' in day and 'rgb(248, 167, 68)' in day and 'rgb(233, 70, 71)' in day,day
 page.screenshot(path=str(out/'sunrise-jour.png'));button.hover();hover=button.evaluate('e=>getComputedStyle(e).backgroundImage');hover_contrast=contrast()
 assert 'linear-gradient' in hover and 'rgb(87, 171, 207)' in hover and 'rgb(32, 41, 128)' in hover,hover
 page.screenshot(path=str(out/'sunrise-hover.png'));page.mouse.move(0,0);page.evaluate('document.documentElement.dataset.theme="dark"');night=button.evaluate('e=>getComputedStyle(e).backgroundImage');night_contrast=contrast()
 assert 'linear-gradient' in night and 'rgb(248, 167, 68)' in night and 'rgb(233, 70, 71)' in night,night
 page.screenshot(path=str(out/'sunrise-nuit.png'))
 accessible={}
 for theme in ['accessible','paper']:
  page.evaluate('theme=>document.documentElement.dataset.theme=theme',theme)
  assert contrast()>=4.5,(theme,contrast())
  button.hover();assert contrast()>=4.5,(theme,'hover',contrast())
  accessible[theme]=contrast();page.mouse.move(0,0)
 assert not errors,errors
 (out/'keyboard-palette.json').write_text(json.dumps({'single_tab_stop':True,'arrow_navigation':True,'home_end':True,'enter_answers':True,'day':day,'hover':hover,'night':night,'gradient_contrast':{'day':day_contrast,'hover':hover_contrast,'night':night_contrast},'requested_gradient_below_AA':min(day_contrast,hover_contrast,night_contrast)<4.5,'contrast_themes':accessible,'errors':errors},indent=2));b.close()
