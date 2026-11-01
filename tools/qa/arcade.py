"""Arcade gameplay, record migration, layout and offline integration (Chromium only)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os
BASE=os.environ.get('ADH_BASE_URL','http://localhost:4173/')
out=Path('work/arcade');out.mkdir(parents=True,exist_ok=True)
seed='''async()=>{const {makeProfile}=await import('./core.js');const {initialState}=await import('./state.js');const {STATE_KEY}=await import('./release.js');localStorage.setItem(STATE_KEY,JSON.stringify({...initialState(),profile:makeProfile('guitar6'),notation:'latin',sound:false,beginnerGuide:true}));}'''
# Read only the visible SVG coordinates, using the same shared geometry as the UI.
target='''async()=>{const {scrollingNeckGeometry}=await import('./core.js');const svg=document.querySelector('.arcade-neck svg');const g=scrollingNeckGeometry(6,+svg.dataset.neckEnd,{startFret:+svg.dataset.neckStart,height:+svg.dataset.neckHeight,minFretWidth:+svg.dataset.neckMinWidth});const p=svg.querySelector('.neck-point');const closest=(xs,x)=>xs.reduce((best,v,i)=>Math.abs(v-x)<Math.abs(xs[best]-x)?i:best,0);const s=closest(g.ys,+p.getAttribute('cy'));const f=closest(g.centers,+p.getAttribute('cx'));return [40,45,50,55,59,64][s]%12+f;}'''
checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 q=b.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 q.clock.install();q.goto(BASE);q.evaluate(seed);q.reload();q.clock.run_for(150)
 q.get_by_role('button',name='Jouer en Arcade',exact=True).click()
 assert q.locator('[data-arcade-action=start]').count()==4
 for w,h in [(390,844),(844,390),(320,568),(1920,1080)]:
  q.set_viewport_size({'width':w,'height':h})
  q.locator('[data-mode=zones-chromatic]').click();assert q.locator('.arcade-ready').count()==1;q.clock.run_for(1100)
  assert q.locator('[data-arcade-answer]').count()==12
  metrics=q.evaluate('''()=>{const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};return {wheel:box(document.querySelector('.answer-wheel')),buttons:[...document.querySelectorAll('[data-arcade-answer]')].map(box),width:document.documentElement.scrollWidth}}''')
  assert metrics['width']<=w+1,(w,metrics)
  assert abs(metrics['wheel']['w']-metrics['wheel']['h'])<1
  for i,a in enumerate(metrics['buttons']):
   assert a['w']>=44 and a['h']>=44
   for d in metrics['buttons'][i+1:]:
    assert ((a['x']+a['w']/2-d['x']-d['w']/2)**2+(a['y']+a['h']/2-d['y']-d['h']/2)**2)**.5>=min(a['w'],d['w'])-1,(w,a,d)
  q.screenshot(path=str(out/f'chromatic-{w}.png'),full_page=True)
  checks.append({'viewport':[w,h],'layout':metrics})
  q.locator('[data-arcade-action=menu]').click()
 q.set_viewport_size({'width':390,'height':844})
 q.locator('[data-mode=zones-natural]').click();q.clock.run_for(1000)
 for i in range(100):
  q.clock.run_for(100)
  note=q.evaluate(target)%12
  q.locator(f'[data-arcade-answer="{note}"]').click()
 assert '14' in q.locator('.arcade-scope').inner_text() or '15' in q.locator('.arcade-scope').inner_text()
 assert '14\u202f500' in q.locator('.arcade-hud').inner_text() or '14 500' in q.locator('.arcade-hud').inner_text()
 assert '+2 UP' in q.locator('.arcade-bonus').inner_text()
 q.screenshot(path=str(out/'combo-100.png'),full_page=True)
 q.locator('[data-arcade-action=pause]').click()
 before=q.locator('.arcade-hud').inner_text();q.clock.run_for(20000)
 assert q.locator('.arcade-hud').inner_text()==before
 assert q.locator('.arcade-playfield').get_attribute('inert') is not None
 q.locator('[data-arcade-action=resume]').click()
 # Six lives after the two life awards; expire each one without answering.
 q.clock.run_for(25000)
 q.get_by_role('button',name='Voir les statistiques',exact=True).wait_for()
 result=q.locator('.arcade-results').inner_text()
 assert '100' in result and '10' in result and '14\u202f500' in result,result
 assert q.locator('#arcade-statistics').count()==0
 q.get_by_role('button',name='Voir les statistiques',exact=True).click()
 assert 'Temps écoulés' in q.locator('#arcade-statistics').inner_text()
 q.screenshot(path=str(out/'result.png'),full_page=True)
 record=q.evaluate('''async()=>{const {PILOT_KEY}=await import('./release.js');const {validatePilotStore}=await import('./pilot.js');const saved=validatePilotStore(JSON.parse(localStorage.getItem(PILOT_KEY)));const p=Object.values(saved.profiles)[0];return {arcade:p.arcade,attempts:p.attempts.length,evidence:p.evidence||null};}''')
 r=record['arcade']['records']['zones-natural'];assert r['correct']==100 and r['score']==14500 and r['combos']==10 and r['longest']==100 and r['earnedLives']==3 and r['timeouts']==6,r
 assert record['attempts']==0 and record['evidence'] is None
 q.reload();q.get_by_role('button',name='Jouer en Arcade',exact=True).click();assert '14\u202f500' in q.locator('main').inner_text()
 q.wait_for_function('navigator.serviceWorker.controller !== null')
 cached=q.evaluate("async()=>{const c=await caches.open((await caches.keys()).find(k=>k.includes('0.39')));return (await c.keys()).map(r=>new URL(r.url).pathname);}")
 for name in ['arcade-ui.js','arcade-rules.js','arcade.css','answer-wheel.js']:
  assert any(path.endswith('/'+name) for path in cached),name
 q.context.set_offline(True);q.reload();q.get_by_role('button',name='Jouer en Arcade',exact=True).click()
 q.locator('[data-mode=strings-chromatic]').click();q.clock.run_for(1100)
 assert q.locator('[data-arcade-answer]').count()==12
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'checks':checks,'record':record,'errors':errors,'physical_devices':False,'offline_arcade':True},indent=2))
 b.close()
print('Arcade: four modes, chromatic layouts, 100-combo bonuses, pause, expiry, results and durable records passed.')
