from playwright.sync_api import sync_playwright
import json
from pathlib import Path
Path('work/card-skins').mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844});page=c.new_page();page.goto('http://localhost:4173/')
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6'),s=initialPilotStore();s.profiles[profile.key]={profile,attempts:[],later:[],session:null};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));await navigator.serviceWorker.register('./sw.js');await navigator.serviceWorker.ready;}''');page.reload();page.wait_for_function('!!navigator.serviceWorker.controller')
 assets=page.evaluate('''async()=>{const out=[];for(const name of await caches.keys()){const cache=await caches.open(name);for(const request of await cache.keys()){let path=new URL(request.url).pathname;if(path.includes('/achievement-art/raster/')||(path.startsWith('/achievement-finishes/')&&path.endsWith('.webp')))out.push(path)}}return [...new Set(out)]}''');assert len(assets)==64,len(assets)
 c.set_offline(True);page.reload();page.locator('[data-action=achievements]:visible').first.click();page.wait_for_timeout(500);card=page.locator('.achievement-card').first;card.scroll_into_view_if_needed();assert card.locator('img').evaluate('e=>e.complete&&e.naturalWidth>0');card.locator('.achievement-progress').click();assert card.locator('.achievement-front').evaluate('e=>e.inert')
 Path('work/card-skins/offline.json').write_text(json.dumps({'cachedImages':len(assets),'offlineReload':True,'offlineArtwork':True,'offlineCriteria':True},indent=2));b.close()
print('All 64 images cached; reload, artwork and criteria work offline')
