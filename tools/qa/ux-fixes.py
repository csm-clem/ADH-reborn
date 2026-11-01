from pathlib import Path
from playwright.sync_api import sync_playwright
import json
BASE='http://localhost:4173/'
out=Path('work/ux-fixes');out.mkdir(parents=True,exist_ok=True)
seed='''async()=>{const {makeProfile}=await import('./core.js');const {initialState}=await import('./state.js');const {initialPilotStore}=await import('./pilot.js');const {STATE_KEY,PILOT_KEY}=await import('./release.js');const profiles=[makeProfile('guitar6'),makeProfile('guitar6','D2 A2 D3 G3 B3 E4'),makeProfile('bass4')];const store=initialPilotStore();profiles.forEach(p=>store.profiles[p.key]={profile:p,attempts:[],later:[],session:null,courses:{}});localStorage.setItem(STATE_KEY,JSON.stringify({...initialState(),profile:profiles[0],sound:false,beginnerGuide:true}));localStorage.setItem(PILOT_KEY,JSON.stringify(store));return profiles.map(p=>p.key);}'''
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 q=b.new_page(viewport={'width':390,'height':844});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 q.goto(BASE);keys=q.evaluate(seed);q.reload()
 assert q.locator('.sidebar .nav-item[data-action=arcade]').count()==1
 q.locator('.mobile-nav [data-action=arcade]').click()
 assert q.get_by_text('Bonus de combo',exact=True).count()==0
 q.locator('[data-mode=strings-chromatic]').click();assert q.locator('.arcade-ready').count()==1
 q.wait_for_timeout(1200)
 assert q.locator('.arcade-neck svg').get_attribute('data-neck-end')=='24'
 assert q.locator('.arcade-neck svg').get_attribute('data-neck-start')=='0'
 q.evaluate('window.qaNeck=document.querySelector(".arcade-neck svg")')
 q.locator('[data-arcade-action=pause]').click()
 assert q.locator('.arcade-playfield').evaluate('e=>getComputedStyle(e).visibility')=='hidden'
 assert q.locator('.arcade-hud').evaluate('e=>getComputedStyle(e).visibility')=='visible'
 assert q.locator('.arcade-pause').evaluate('e=>getComputedStyle(e).backgroundColor')=='rgba(0, 0, 0, 0)'
 q.screenshot(path=str(out/'pause-hud.png'),full_page=True)
 q.locator('[data-arcade-action=resume]').click()
 q.wait_for_timeout(100)
 note=q.evaluate('''async()=>{const {scrollingNeckGeometry}=await import('./core.js');const svg=document.querySelector('.arcade-neck svg'),g=scrollingNeckGeometry(6,24,{height:+svg.dataset.neckHeight,minFretWidth:+svg.dataset.neckMinWidth,realistic:svg.dataset.neckRealistic==='true'}),p=svg.querySelector('.neck-point');const nearest=(a,n)=>a.reduce((best,v,i)=>Math.abs(v-n)<Math.abs(a[best]-n)?i:best,0);return ([40,45,50,55,59,64][nearest(g.ys,+p.getAttribute('cy'))]+nearest(g.centers,+p.getAttribute('cx')))%12;}''')
 q.locator(f'[data-arcade-answer="{note}"]').click()
 assert q.evaluate('qaNeck===document.querySelector(".arcade-neck svg")')
 # Force a distant target only in a separately instantiated test controller, then verify intermediate scroll.
 scroll=q.evaluate('''async()=>{const {ArcadeController}=await import('./arcade-ui.js');const root=document.createElement('div');document.body.append(root);let c;const host={root,getState:()=>({profile:{tuning:[40,45,50,55,59,64]},sound:false}),render:()=>{root.innerHTML=c.render();},getData:()=>({}),icon:()=>'',playNote(){},playBonus(){}};c=new ArcadeController(host);c.run=(await import('./arcade-rules.js')).newArcadeRun('strings-natural');c.phase='question';c.target={string:0,fret:0,midi:40};c.serial=1;host.render();c.layout();const el=root.querySelector('.arcade-neck');const point=el.querySelector('.neck-point'),g=(await import('./core.js')).scrollingNeckGeometry(6,24,{height:+el.querySelector('svg').dataset.neckHeight,minFretWidth:+el.querySelector('svg').dataset.neckMinWidth,realistic:true});point.setAttribute('cx',g.centers[22]);c.target={string:0,fret:22,midi:62};c.serial++;c.layout();await new Promise(r=>setTimeout(r,35));const mid=el.scrollLeft;await new Promise(r=>setTimeout(r,90));const end=el.scrollLeft;c.leave();root.remove();return {mid,end};}''')
 assert 0<scroll['mid']<scroll['end'],scroll
 q.locator('[data-arcade-action=menu]').click()
 q.locator('.mobile-nav [data-action=settings]').click()
 assert q.locator('#reset-instrument').count()==1
 q.locator('#reset-tuning').select_option('all')
 q.locator('[data-action=reset-instrument]').click()
 dialog=q.locator('.reset-progress-dialog');assert dialog.locator('[data-reset-confirm]').is_disabled()
 assert 'irréversible' in dialog.inner_text() and 'tous les accordages' in dialog.inner_text().lower()
 dialog.locator('[data-reset-cancel]').click()
 current=q.evaluate('''async()=>JSON.parse(localStorage.getItem((await import('./release.js')).PILOT_KEY))''')
 assert len(current['profiles'])==3
 q.evaluate('''async()=>{const {PILOT_KEY}=await import('./release.js');window.qaSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===PILOT_KEY)throw new Error('Quota de test');return window.qaSetItem.call(this,k,v);};}''')
 q.locator('[data-action=reset-instrument]').click();dialog.locator('[data-reset-ack]').check();dialog.locator('[data-reset-confirm]').click()
 assert 'Vos données sont conservées' in dialog.inner_text()
 assert len(q.evaluate('''async()=>JSON.parse(localStorage.getItem((await import('./release.js')).PILOT_KEY)).profiles'''))==3
 dialog.locator('[data-reset-cancel]').click();q.evaluate('()=>{Storage.prototype.setItem=window.qaSetItem;}')
 q.locator('[data-action=reset-instrument]').click();dialog.locator('[data-reset-ack]').check();dialog.locator('[data-reset-confirm]').click()
 saved=q.evaluate('''async()=>JSON.parse(localStorage.getItem((await import('./release.js')).PILOT_KEY))''')
 assert keys[1] not in saved['profiles'] and keys[2] in saved['profiles']
 # Rendering the current profile may recreate an empty entry; the old alternate tuning must stay deleted.
 assert not saved['profiles'].get(keys[0],{}).get('attempts')
 # Exercise dynamically mounted details, including reversal and keyboard activation.
 q.evaluate('''()=>{const d=document.createElement('details');d.id='qa-details';d.innerHTML='<summary>Déplier le test</summary><div style="height:180px">Contenu</div>';document.querySelector('main').prepend(d);}''')
 d=q.locator('#qa-details');d.locator('summary').click();q.wait_for_timeout(60)
 middle=d.evaluate('e=>e.getBoundingClientRect().height');q.wait_for_timeout(250);full=d.evaluate('e=>e.getBoundingClientRect().height');assert middle<full
 d.locator('summary').click();q.wait_for_timeout(300);assert d.get_attribute('open') is None
 d.locator('summary').focus();q.keyboard.press('Enter');q.wait_for_timeout(300);assert d.get_attribute('open') is not None
 q.evaluate('document.querySelector("#qa-details").remove()');q.screenshot(path=str(out/'settings-reset.png'),full_page=True)
 # Check the actual update dialog copy and retained download progress.
 progress=q.evaluate('''async()=>{const {UpdateController}=await import('./services/update-service.js');const u=new UpdateController({canPrompt:()=>true,beforeUpdate:()=>true});u.pending={version:'0.39.99',url:location.href};u.offer();const before=u.dialog.querySelector('.update-progress').textContent;u.progress={loaded:1,total:2};u.paintProgress();const during=u.dialog.querySelector('.update-progress').textContent;u.dialog.remove();return {before,during};}''')
 assert progress['before']=='' and '50 %' in progress['during'],progress
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'errors':errors,'scroll':scroll,'update':progress,'reset':True,'details_keyboard_and_motion':True,'physical_devices':False},indent=2))
 b.close()
print('UX fixes passed: dedicated Arcade tab, ready screen, stable full neck, scrolling, visible HUD in pause, reset guard, details animation and update progress.')
