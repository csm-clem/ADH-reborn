from playwright.sync_api import sync_playwright
from pathlib import Path
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://localhost:4173/dist/')
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js');localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile:makeProfile('guitar6'),beginnerGuide:true}));}''');page.reload();page.locator('[data-action=settings]:visible').first.click();assert page.locator('[data-action=debug]').count()==0;assert page.locator('.debug-panel').count()==0;assert not errors,errors
 Path('work/ci').mkdir(parents=True,exist_ok=True);Path('work/ci/production.json').write_text(json.dumps({'settings_work':True,'no_debug':True,'errors':errors}));b.close()
