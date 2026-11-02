from playwright.sync_api import sync_playwright
import json
from pathlib import Path
out=Path('work/card-skins');out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1050},service_workers='block');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:4173/')
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6'),s=initialPilotStore();s.profiles[profile.key]={profile,attempts:[],later:[],session:null};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''')
 page.reload();page.locator('[data-action=settings]:visible').first.click();page.locator('[data-action=debug]').click();page.locator('[data-action=achievements]:visible').first.click();page.wait_for_timeout(500)
 results=[]
 for w,h in [(1440,1050),(390,844),(320,760),(844,390)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(400)
  for rarity in ['common','uncommon','rare','epic','legendary']:
   card=page.locator('.achievement-card.rarity-'+rarity).first
   card.scroll_into_view_if_needed();card.locator('img').first.wait_for();page.wait_for_timeout(120)
   info=card.evaluate('''e=>{let f=e.querySelector('.achievement-front'),r=f.getBoundingClientRect();return {rarity:e.dataset.rarity,width:r.width,height:r.height,skin:getComputedStyle(f,'::before').backgroundImage,images:[...e.querySelectorAll('img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),overflow:[...f.querySelectorAll('button,h2,time')].filter(n=>{let q=n.getBoundingClientRect();return q.left<r.left-1||q.right>r.right+1||q.bottom>r.bottom+1}).map(n=>n.className)}}''')
   assert all(i['loaded'] for i in info['images']),info
   assert not info['overflow'],info
   assert rarity+'.webp' in info['skin'],info
   results.append({'viewport':w,**info})
   if w in [390,1440]:card.screenshot(path=str(out/f'{w}-{rarity}.png'))
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 card=page.locator('.achievement-card.rarity-legendary').first;card.scroll_into_view_if_needed();box=card.bounding_box();page.mouse.move(box['x']+box['width']*.75,max(120,min(330,box['y']+200)));page.wait_for_timeout(250)
 assert card.evaluate('e=>e.classList.contains("is-tilting")')
 assert card.locator('.achievement-front>.card-foil').count()==1
 page.mouse.move(0,0);page.wait_for_timeout(450);assert not card.evaluate('e=>e.classList.contains("is-tilting")')
 card.locator('.achievement-progress').click();page.wait_for_timeout(350);assert card.locator('.achievement-front').evaluate('e=>e.inert');assert card.locator('.achievement-back ul').count()==1
 card.locator('.achievement-back [data-success-action=flip]').click();page.wait_for_timeout(350)
 music=page.locator('.achievement-card.is-musical').first;music.scroll_into_view_if_needed();assert music.locator('.midi-event').count()>0
 music.locator('[data-success-action=listen]').click();page.wait_for_timeout(500);assert music.locator('[data-success-action=listen]').get_attribute('aria-pressed')=='true';music.locator('[data-success-action=listen]').click()
 assert not errors,errors
 (out/'browser.json').write_text(json.dumps({'layouts':results,'errors':errors,'mouse':True,'criteria':True,'listen':True},indent=2));b.close()
print('Card layout, raster loading, mouse/reset, criteria and audio controls passed')
