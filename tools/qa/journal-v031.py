from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path('docs/v0.31');out.mkdir(parents=True,exist_ok=True)
helpers={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],helpers)
errors=[];checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',viewport={'width':1440,'height':900});page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:4173/');primary=page.locator('#setup-form button[type=submit]');page.mouse.move(0,0)
 def flat(button):
  return button.evaluate('e=>{const s=getComputedStyle(e);return {gradient:s.backgroundImage,text:s.textShadow,shadow:s.boxShadow,border:s.borderBottomWidth}}')
 day=flat(primary);assert day['text']=='none' and day['shadow']=='none' and day['border']=='0px';assert '90deg' in day['gradient'];assert day['gradient'].index('255, 178, 48')<day['gradient'].index('255, 56, 57')
 page.screenshot(path=str(out/'bouton-primaire.png'));primary.hover();hover=flat(primary);assert hover['gradient'].index('81, 187, 232')<hover['gradient'].index('39, 51, 158');assert hover['text']=='none';page.screenshot(path=str(out/'bouton-survol.png'))
 helpers['seed'](page);page.locator('[data-action=settings]:visible').first.click();page.mouse.move(0,0);secondary=flat(page.locator('.button.secondary').first);assert secondary['border']=='0px' and secondary['text']=='none' and '90deg' in secondary['gradient']
 page.locator('[data-action=changelog]').click();assert page.locator('h1').inner_text()=='Journal des modifications';assert page.locator('.change-legend>span').count()==4;assert page.locator('.change-release').count()==30;assert page.locator('.change-release[open]').count()==1
 page.locator('.change-release summary').nth(1).click();assert page.locator('.change-release[open]').count()==2
 for w,h in [(320,568),(390,844),(844,390),(1440,900)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(250);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=str(out/f'journal-{w}.png'));checks.append([w,h])
 page.locator('.content [data-action=settings]').click();assert page.locator('[data-action=changelog]').count()==1
 # Fresh real production install and cached journal on a nested URL.
 off=b.new_context(viewport={'width':390,'height':844});q=off.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto('http://localhost:4173/work/v031/ftp-production/');q.evaluate('navigator.serviceWorker.ready');q.wait_for_function('navigator.serviceWorker.controller!==null')
 q.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js');localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile:makeProfile('guitar6'),beginnerGuide:true}));}''');off.set_offline(True);q.reload();q.locator('[data-action=settings]:visible').first.click();q.locator('[data-action=changelog]').click();assert q.locator('.change-release').count()==30;assert q.locator('[data-action=debug]').count()==0
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'primary':day,'hover':hover,'secondary':secondary,'journal_versions':30,'layouts':checks,'return_settings':True,'production_offline':True,'errors':errors},ensure_ascii=False,indent=2));b.close()
