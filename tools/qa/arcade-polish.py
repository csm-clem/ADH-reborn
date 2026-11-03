from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re
out=Path('work/arcade-polish');out.mkdir(parents=True,exist_ok=True)
seed='''async()=>{const {makeProfile}=await import('./core.js');const {initialState}=await import('./state.js');const {initialPilotStore}=await import('./pilot.js');const {STATE_KEY,PILOT_KEY}=await import('./release.js');const profiles=[makeProfile('guitar6'),makeProfile('guitar6','D2 A2 D3 G3 B3 E4'),makeProfile('bass4')],store=initialPilotStore();profiles.forEach(p=>store.profiles[p.key]={profile:p,attempts:[],later:[],session:null});localStorage.setItem(STATE_KEY,JSON.stringify({...initialState(),profile:profiles[0],sound:false,beginnerGuide:true}));localStorage.setItem(PILOT_KEY,JSON.stringify(store));return profiles.map(p=>p.key);}'''
def contrast(a,b):
 def lum(c):
  c=[v/255 for v in c];c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c];return .2126*c[0]+.7152*c[1]+.0722*c[2]
 x,y=lum(a),lum(b);return (max(x,y)+.05)/(min(x,y)+.05)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);q=b.new_page(viewport={'width':1440,'height':900});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 q.clock.install();q.goto('http://localhost:4173/');keys=q.evaluate(seed);q.reload();q.locator('.sidebar [data-action=arcade]').click();q.locator('[data-mode=zones-natural]').click()
 assert q.locator('.launch-screen .launch-message').inner_text()=='À vous de jouer !'
 launch=q.locator('.launch-message').evaluate('e=>({animation:getComputedStyle(e).animationName,size:getComputedStyle(e).fontSize,bg:getComputedStyle(e.parentElement).backgroundColor})')
 assert launch['animation']=='none' and float(launch['size'][:-2])>=60
 q.screenshot(path=str(out/'launch.png'));q.clock.run_for(2500)
 actual=q.locator('.arcade-neck svg').evaluate('e=>({width:e.getBoundingClientRect().width,model:e.viewBox.baseVal.width})');assert abs(actual['width']-actual['model'])<1,actual
 q.screenshot(path=str(out/'laptop-neck.png'),full_page=True)
 # Mount an independent test controller to control targets and inspect actual geometry/camera.
 q.locator('[data-arcade-action=menu]').click()
 geometry=q.evaluate('''async()=>{const {ArcadeController}=await import('./arcade-ui.js'),{makeProfile}=await import('./core.js'),{newArcadeRun}=await import('./arcade-rules.js');const root=document.createElement('div');root.id='qa-arcade';document.querySelector('main').append(root);let c;const host={root,getState:()=>({profile:makeProfile('guitar6'),sound:false}),getData:()=>({}),render:()=>{root.innerHTML=c.render();},icon:()=>'',playNote(){},playBonus(){}};c=new ArcadeController(host);c.run=newArcadeRun('zones-natural');c.phase='question';c.target={string:0,fret:0,midi:40};c.serial=1;host.render();c.layout();window.qaController=c;const svg=root.querySelector('svg'),first=svg.querySelector('.neck-fret:not(.neck-nut)'),point=root.querySelector('.neck-point');window.qaSvg=svg;const g=c.neckGeometryFor(svg);return {w:g.width,widths:g.visibleFrets.filter(f=>f>0).map(f=>g.bounds(f)[1]-g.bounds(f)[0]),open:g.openWidth};}''')
 assert geometry['open']==18 and geometry['widths'][0]>3.7*geometry['widths'][-1]
 # At mobile width, case 0 -> case 4 must keep the same viewport offset.
 q.set_viewport_size({'width':390,'height':844});q.clock.run_for(100)
 stable=q.evaluate('''()=>{const c=qaController,el=c.host.root.querySelector('.arcade-neck'),g=c.neckGeometryFor(qaSvg);c.target={string:0,fret:0,midi:40};c.serial++;c.layout();el.scrollLeft=0;const before=el.scrollLeft;c.target={string:0,fret:4,midi:44};qaSvg.querySelector('.neck-point').setAttribute('cx',g.centers[4]);c.serial++;c.layout();return {before,after:el.scrollLeft};}''')
 q.clock.run_for(120);assert q.evaluate('qaController.host.root.querySelector(".arcade-neck").scrollLeft')==stable['before']
 # Crossing to zone 4–8 then returning to shared fret 4 must retain that second zone.
 q.evaluate('''()=>{const c=qaController;c.target.fret=5;c.serial++;c.layout();}''');q.clock.run_for(120)
 shared=q.evaluate('''()=>{const c=qaController,el=c.host.root.querySelector('.arcade-neck'),before=el.scrollLeft;c.target.fret=4;c.serial++;c.layout();return {before,zone:c.neckZone};}''');q.clock.run_for(120)
 assert shared['zone']=='4:8' and q.evaluate('qaController.host.root.querySelector(".arcade-neck").scrollLeft')==shared['before'],shared
 q.evaluate('''()=>{qaController.leave();qaController.host.root.remove();}''')
 # Render an actual result with useful per-position facts and check number-first rows.
 q.evaluate('''async()=>{const {responseTimeMap}=await import('./progress.js'),{makeProfile}=await import('./core.js');const c=new (await import('./arcade-ui.js')).ArcadeController({getState:()=>({profile:makeProfile('guitar6')}),storageError:()=>false});c.run=(await import('./arcade-rules.js')).newArcadeRun('zones-natural');c.run.questions=3;c.run.timeouts=3;c.phase='result';const root=document.createElement('div');root.id='qa-result';root.innerHTML=c.result();document.querySelector('main').append(root);const map=document.createElement('div');map.innerHTML=responseTimeMap(makeProfile('guitar6'),{'0:0':{total:3,correct:2,timeSum:1000,timeMin:400,timeMax:600,errors:1,timeouts:0},'0:1':{total:1,correct:1,timeSum:2250},'0:2':{total:1,correct:1,timeSum:4000}},'latin',{meanMs:1500});root.append(map);}''')
 rows=q.locator('#qa-result .arcade-stats>div').all()
 for row in rows:assert row.locator('dd').bounding_box()['x']<row.locator('dt').bounding_box()['x']
 assert q.locator('#qa-result').get_by_text('Combos',exact=True).count()==1
 assert 'Plus long combo' not in q.locator('#qa-result').inner_text()
 colors=q.locator('#qa-result .progress-cell[style] summary').evaluate_all('es=>es.map(e=>({bg:getComputedStyle(e).backgroundColor,fg:getComputedStyle(e).color}))')
 for c in colors:
  a=[int(v) for v in re.findall(r'\d+',c['bg'])[:3]];d=[int(v) for v in re.findall(r'\d+',c['fg'])[:3]];assert contrast(a,d)>=4.5,c
 q.locator('#qa-result [data-progress-string="0"][data-progress-fret="0"] summary').click();q.wait_for_function("document.querySelector('#qa-result .progress-selection').textContent.includes('Plus rapide')")
 detail=q.locator('#qa-result .progress-selection').inner_text();assert 'Précision' in detail and 'Plus rapide' in detail and 'Délais dépassés' in detail and 'moyenne de la partie' in detail
 q.screenshot(path=str(out/'result-map.png'),full_page=True)
 q.evaluate('document.querySelector("#qa-result").remove()')
 q.locator('.mobile-nav [data-action=settings]').click();q.locator('#reset-tuning').select_option(keys[1]);q.locator('[data-action=reset-instrument]').click()
 dialog=q.locator('.reset-progress-dialog');assert 'cet accordage' in dialog.inner_text() and 'autres accordages' in dialog.inner_text()
 dialog.locator('[data-reset-ack]').check();dialog.locator('[data-reset-confirm]').click()
 saved=q.evaluate('''async()=>JSON.parse(localStorage.getItem((await import('./release.js')).PILOT_KEY)).profiles''')
 assert keys[0] in saved and keys[1] not in saved and keys[2] in saved
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'launch':launch,'geometry':geometry,'stable_zone':stable,'contrast':colors,'tuning_reset':True,'errors':errors},indent=2));b.close()
print('Arcade polish passed: shared launch, realistic geometry, stable zones, number-first results, bright readable map and tuning-only reset.')
