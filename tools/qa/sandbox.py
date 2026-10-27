"""Same-origin live/sandbox isolation, public history, filters and offline caches."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
BASE='http://localhost:4173/'
out=Path('work/sandbox');out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
with sync_playwright()as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',viewport={'width':390,'height':844});q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)))
 q.goto(BASE);q.evaluate('''async()=>{const{makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{initialPilotStore}=await import('./pilot.js');const raw=JSON.stringify({...initialState(),profile:makeProfile('guitar6'),sound:false,beginnerGuide:true});localStorage.setItem('fretboard-trainer:settings',raw);localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(initialPilotStore()));localStorage.setItem('fretboard-trainer:pilot:0.28.0',JSON.stringify(initialPilotStore()));localStorage.setItem('adh-reborn:state:v1',raw);}''')
 live=q.evaluate("()=>[localStorage.getItem('fretboard-trainer:settings'),localStorage.getItem('fretboard-trainer:pilot:stable')]")
 q.goto(BASE+'dist-sandbox/');q.wait_for_timeout(150)
 assert q.evaluate("()=>localStorage.getItem('fretboard-trainer:sandbox:settings')&&JSON.parse(localStorage.getItem('fretboard-trainer:sandbox:settings')).profile===null")
 assert q.evaluate("()=>[localStorage.getItem('fretboard-trainer:settings'),localStorage.getItem('fretboard-trainer:pilot:stable')]")==live
 assert q.evaluate('''async()=>{const {storageService}=await import('./services/storage-service.js');return Object.keys(storageService.readPilot().value.profiles).length===0}''')
 q.evaluate('''async()=>{const {storageService}=await import('./services/storage-service.js'),{initialState}=await import('./state.js'),{makeProfile}=await import('./core.js');storageService.saveSettings({...initialState(),profile:makeProfile('guitar6'),sound:false,beginnerGuide:true});}''');q.reload()
 q.locator('[data-pilot-action=beta-branch][data-id=targeted]').click();assert q.locator('.route-card').count()==25
 assert q.locator('[data-pilot-action=beta-route][data-id=duo5]').count()==1
 assert q.locator('[data-pilot-action=beta-route][data-id=mix24]').count()==1
 q.locator('[data-action=settings]:visible').first.click();assert 'Bac à sable' in q.locator('h2').all_text_contents().__str__()
 q.locator('[data-action=changelog]').click();count=q.locator('.change-release').count();assert count>10
 versions=q.locator('.change-release summary strong').all_text_contents();expected=q.evaluate('''async()=>{const {LIVE_RELEASES}=await import('./release-history.js');return LIVE_RELEASES.map(e=>'v'+e.version)}''');assert versions==expected
 q.locator('[data-change-action=expand]').click();assert q.locator('.change-release[open]').count()==count
 q.locator('[data-change-action=collapse]').click();assert q.locator('.change-release[open]').count()==0
 q.locator('[data-change-action=filters]').click();assert q.locator('#change-filters').is_visible()
 for kind in ['feature','improvement','bug','event']:
  q.locator(f'[data-change-filter={kind}]').click();q.locator('[data-change-action=expand]').click();assert q.locator(f'[data-change-type]:visible').count()>0
  assert set(q.locator('[data-change-type]:visible').evaluate_all('es=>es.map(e=>e.dataset.changeType)'))=={kind}
  q.locator('[data-change-action=collapse]').click();assert q.locator('.change-release[open]:visible').count()==0
 q.locator('[data-change-filter=all]').click();assert q.locator('.change-release:visible').count()==count
 for width,height in [(320,568),(1440,900)]:
  q.set_viewport_size({'width':width,'height':height});assert q.evaluate('document.documentElement.scrollWidth<=innerWidth');q.screenshot(path=str(out/f'journal-{width}.png'),full_page=True)
 assert q.evaluate("()=>[localStorage.getItem('fretboard-trainer:settings'),localStorage.getItem('fretboard-trainer:pilot:stable')]")==live
 assert q.evaluate('''async()=>{const {updateTarget}=await import('./services/update-service.js');return updateTarget({version:'99.0.0',channel:'live',url:'../'},location.href,location.href)===null}''')
 assert not errors,errors
 checks.extend(['Same-origin settings and progress isolated','No live legacy migration into sandbox','25 scopes without special URL','Published releases only','Four working type filters','Expand/collapse all','Mobile/desktop no overflow','Live update manifest rejected by sandbox'])
 c.close()
 # Install both workers on the same origin; sandbox activation must preserve live caches.
 c=b.new_context();q=c.new_page();q.goto(BASE);q.evaluate('navigator.serviceWorker.ready');q.wait_for_function('navigator.serviceWorker.controller!==null');before=q.evaluate('caches.keys()')
 q.goto(BASE+'dist-sandbox/');q.evaluate('navigator.serviceWorker.ready');q.wait_for_function('navigator.serviceWorker.controller?.scriptURL.includes("/dist-sandbox/")');after=q.evaluate('caches.keys()');assert set(before)<=set(after);assert any('sandbox' in k for k in after)
 c.set_offline(True);q.reload();q.wait_for_selector('#app button');checks.append('Offline sandbox works and live caches remain present');c.close();b.close()
 (out/'verification.json').write_text(json.dumps({'checks':checks,'errors':errors},indent=2));print(json.dumps({'checks':len(checks),'errors':errors}))
