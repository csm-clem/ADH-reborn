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
 day=button.evaluate('e=>getComputedStyle(e).backgroundImage');assert 'linear-gradient' in day;assert contrast()>=4.5
 page.screenshot(path=str(out/'sunrise-jour.png'));button.hover();hover=button.evaluate('e=>getComputedStyle(e).backgroundImage');assert 'linear-gradient' in hover and hover!=day;assert contrast()>=4.5
 page.screenshot(path=str(out/'sunrise-hover.png'));page.mouse.move(0,0);page.evaluate('document.documentElement.dataset.theme="dark"');night=button.evaluate('e=>getComputedStyle(e).backgroundImage');assert night!=day;assert contrast()>=4.5;page.screenshot(path=str(out/'sunrise-nuit.png'))
 assert not errors,errors
 (out/'keyboard-palette.json').write_text(json.dumps({'single_tab_stop':True,'arrow_navigation':True,'home_end':True,'enter_answers':True,'day':day,'hover':hover,'night':night,'errors':errors},indent=2));b.close()
