from pathlib import Path
from playwright.sync_api import sync_playwright
import xml.etree.ElementTree as E,json
out=Path('work/uncommon-art');out.mkdir(exist_ok=True)
for f in Path('docs/art/uncommon-proposals').glob('*.svg'):E.fromstring(f.read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);q=b.new_page(viewport={'width':1440,'height':1100},accept_downloads=True);q.goto('http://localhost:4173/');q.evaluate('''()=>{document.body.innerHTML='<button id="share">Partager</button>';document.querySelector('#share').onclick=async()=>{const {shareResult}=await import('./result-ui.js');window.shared=await shareResult({title:'Test',subtitle:'Nommer',profileLabel:'Guitare',metrics:{correct:20,total:20,accuracy:1,meanMs:800},stars:5});};}''')
 with q.expect_download() as download:q.click('#share')
 d=download.value;d.save_as(str(out/'resultat.png'));assert d.suggested_filename.endswith('.png');q.wait_for_function('window.shared==="downloaded"')
 q.evaluate('''()=>{window.matchMedia=()=>({matches:true});Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});Object.defineProperty(navigator,'share',{configurable:true,writable:true,value:async()=>{throw new DOMException('Denied','NotAllowedError');}});}''')
 with q.expect_download() as fallback:q.click('#share')
 assert fallback.value.suggested_filename.endswith('.png')
 assert q.evaluate('''async()=>{navigator.share=async()=>{throw new DOMException('Cancelled','AbortError');};const {shareResult}=await import('./result-ui.js');try{await shareResult({title:'Test',subtitle:'Nommer',profileLabel:'Guitare',metrics:{correct:20,total:20,accuracy:1,meanMs:800},stars:5});}catch(e){return e.name;}}''')=='AbortError'
 q.goto('http://localhost:4173/docs/art/uncommon-proposals/index.html');q.locator('img').evaluate_all('es=>Promise.all(es.map(e=>e.decode()))');assert q.locator('img').count()==11;q.screenshot(path=str(out/'planche.png'),full_page=True)
 q.goto('http://localhost:4173/');q.evaluate('''async()=>{const {renderAchievementUnlock}=await import('./achievement-unlock.js');document.body.innerHTML=renderAchievementUnlock([{id:'first-session',title:'La première fait le jack',rarity:{id:'common'}}]);}''');q.screenshot(path=str(out/'celebration.png'));b.close()
print('Téléchargement PNG desktop réel vérifié ; onze SVG valides et chargés ; aperçu de célébration créé.')
