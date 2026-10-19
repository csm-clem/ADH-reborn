"""Boot the actual extracted FTP ZIP at a nested URL, then reload offline."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
BASE='http://localhost:4173/work/v026/ftp-check/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);context=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);page.evaluate('navigator.serviceWorker.ready');page.wait_for_function('navigator.serviceWorker.controller!==null')
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6'),s=initialPilotStore();s.profiles[profile.key]={profile,attempts:[],later:[],session:null};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''')
 paths=page.evaluate('''async()=>{const name=(await caches.keys()).find(k=>k.includes('0.26.0')),c=await caches.open(name);return (await c.keys()).map(r=>new URL(r.url).pathname)}''')
 assert len([p for p in paths if '/achievement-art/'in p])==46
 for name in ['achievement-catalog.js','achievement-evidence.js','achievement-art.js','achievement-motion.js']:
  assert any(p.endswith('/'+name)for p in paths),name
 context.set_offline(True);page.reload();page.locator('[data-action=achievements]:visible').first.click();assert page.locator('.stage').count()==1 and page.locator('.achievement-card').count()==36
 page.locator('img.achievement-artwork').evaluate_all('(es)=>es.forEach(e=>e.loading="eager")');page.wait_for_function('Array.from(document.querySelectorAll("img.achievement-artwork")).every(e=>e.complete&&e.naturalWidth>0)')
 page.locator('.achievement-card .achievement-progress').first.click();assert page.locator('.achievement-card.is-flipped').count()==1
 page.locator('.achievement-back [data-success-action=flip]').first.click();page.locator('[data-success-action=category][data-value=music]').click();assert page.locator('.music-sleeve .midi-event').count()>20
 assert not errors,errors
 result={'extracted_zip_nested_url':True,'cached_artwork':46,'new_modules_cached':4,'offline_reload_and_all_visible_assets':True,'offline_criteria_and_music_sleeves':True,'errors':errors}
 Path('docs/v0.26/verification-hors-ligne.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result));b.close()
