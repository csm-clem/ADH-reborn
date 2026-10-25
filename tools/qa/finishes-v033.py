"""Imported finish materials, responsive controls, card backs and offline textures."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path('docs/v0.33');out.mkdir(parents=True,exist_ok=True)
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 c=b.new_context(viewport={'width':1440,'height':1050},service_workers='block');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 h['seed'](page);page.locator('[data-action=settings]:visible').first.click();page.locator('[data-action=debug]').click()
 for theme in ['light','dark','accessible','paper']:
  page.locator(f'input[name=theme][value={theme}]').check();page.locator('[data-action=achievements]:visible').first.click()
  if page.locator('.is-album').count():page.locator('[data-success-action=layout]').click()
  for w,hgt in [(320,568),(390,844),(768,1024),(844,390),(1440,1050)]:
   page.set_viewport_size({'width':w,'height':hgt});page.wait_for_timeout(90)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(theme,w)
   assert page.locator('.achievement-front').evaluate_all('es=>es.every(e=>e.scrollWidth<=e.clientWidth+1)'),(theme,w,'card overflow')
   assert page.locator('.achievement-actions .button').evaluate_all('es=>es.every(e=>e.getBoundingClientRect().height>=44)'),(theme,w,'touch target')
   checks.append([theme,w])
  for rarity in ['common','uncommon','rare','epic','legendary']:
   card=page.locator('.achievement-card.rarity-'+rarity).first;card.scroll_into_view_if_needed()
   materials=card.evaluate('e=>[...e.querySelectorAll(".achievement-front,.achievement-back")].map(x=>getComputedStyle(x).backgroundImage)')
   assert materials[0]==materials[1]
   card.locator('.criteria-action').click();page.wait_for_timeout(330);assert card.locator('.achievement-back').evaluate('e=>!e.inert')
   card.locator('.achievement-back [data-success-action=flip]').click();page.wait_for_timeout(330)
   if theme=='light':card.screenshot(path=str(out/('finition-'+rarity+'.png')))
  page.locator('[data-success-action=layout]').click();page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(100)
  page.locator('.album-thumbnail.rarity-legendary').first.scroll_into_view_if_needed();page.screenshot(path=str(out/('album-'+theme+'.png')))
  thumb=page.locator('.album-thumbnail.rarity-legendary').first;thumb.click();page.wait_for_timeout(280)
  assert page.locator('.collection-dialog').evaluate('e=>e.open')
  assert page.evaluate('()=>{const ids=[...document.querySelectorAll("[id]")].map(e=>e.id);return ids.length===new Set(ids).size}')
  page.screenshot(path=str(out/('carte-'+theme+'.png')));page.locator('.album-close').click()
  page.locator('[data-action=settings]:visible').first.click()
 # Fresh nested install: resources must really exist in packaged output and cache.
 off=b.new_context(viewport={'width':390,'height':844});q=off.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto('http://localhost:4173/dist/');q.evaluate('navigator.serviceWorker.ready');q.wait_for_function('navigator.serviceWorker.controller!==null')
 q.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js');localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile:makeProfile('guitar6'),beginnerGuide:true}));}''')
 off.set_offline(True);q.reload();q.locator('[data-action=achievements]:visible').first.click();q.locator('.album-thumbnail').first.click();q.wait_for_timeout(280)
 for name in ['paper','brushed','engraved']:
  assert q.evaluate('''async name=>{const r=await fetch('./achievement-finishes/'+name+'.svg');return r.ok&&(await r.text()).includes('<svg');}''',name),name
 q.locator('.album-close').click();q.locator('[data-action=settings]:visible').first.click();q.locator('[data-action=changelog]').click();assert q.locator('.change-release').count()==32
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'layouts':checks,'rarities':5,'themes':4,'same_finish_on_back':True,'offline_textures':True,'journal_versions':32,'errors':errors},indent=2))
 b.close()
