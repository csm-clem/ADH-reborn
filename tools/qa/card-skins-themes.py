from playwright.sync_api import sync_playwright
from pathlib import Path
import json
Path('work/card-skins').mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},service_workers='block');page.goto('http://localhost:4173/')
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6'),s=initialPilotStore();s.profiles[profile.key]={profile,attempts:[],later:[],session:null};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''');page.reload();page.locator('[data-action=settings]:visible').first.click();page.locator('[data-action=debug]').click();page.locator('[data-action=achievements]:visible').first.click();result=[]
 for theme in ['light','dark','accessible','paper']:
  page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
  for rarity in ['common','uncommon','rare','epic','legendary']:
   card=page.locator('.achievement-card.rarity-'+rarity).first;card.scroll_into_view_if_needed();page.wait_for_timeout(100)
   assert card.locator('h2').first.is_visible();assert card.locator('[data-success-action=try]').first.is_visible()
   if theme=='accessible':
    checks=card.locator('.achievement-front .quiet-button').evaluate_all('''es=>es.map(e=>{const s=getComputedStyle(e),nums=v=>v.match(/[0-9.]+/g).slice(0,3).map(Number),lum=v=>nums(v).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4}).reduce((a,n,i)=>a+n*[.2126,.7152,.0722][i],0),a=lum(s.color),b=lum(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)})''')
    assert all(v>=7 for v in checks),checks
    assert card.evaluate('''e=>{const f=e.querySelector('.achievement-front').getBoundingClientRect();return [...e.querySelectorAll('.achievement-front button,.achievement-front .achievement-number')].every(b=>b.getBoundingClientRect().bottom<=f.bottom-8)}''')
   result.append({'theme':theme,'rarity':rarity,'text':card.locator('h2').first.evaluate('e=>getComputedStyle(e).color'),'skin':card.locator('.achievement-front').evaluate('e=>getComputedStyle(e,"::before").backgroundImage')})
   if theme=='accessible' and rarity=='legendary':card.screenshot(path='work/card-skins/accessible-legendary.png')
 Path('work/card-skins/themes.json').write_text(json.dumps(result,indent=2));b.close()
print('Five skins retain their materials and readable controls across four themes')
