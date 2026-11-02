from pathlib import Path
from playwright.sync_api import sync_playwright
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
out=Path('work/uxlot');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',is_mobile=True,has_touch=True,viewport={'width':390,'height':844});q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 q.goto('http://localhost:4173/');q.clock.install()
 q.evaluate('''async()=>{const {PilotController}=await import('./pilot-ui.js'),{makeProfile}=await import('./core.js');const profile=makeProfile('guitar6'),root=document.createElement('main');root.id='qa-input';document.body.replaceChildren(root);let c;const host={getState:()=>({profile,sound:false}),showPilot:()=>{root.innerHTML=c.wheel();},playNote(){},stopAudio(){}};c=new PilotController(host);const pool=[{string:5,fret:0,midi:64},{string:4,fret:1,midi:60},{string:4,fret:3,midi:62},{string:5,fret:1,midi:65}];Object.defineProperty(c,'module',{get:()=>({pool,mode:'name',strings:[0,1,2,3,4,5],zone:{start:0,end:4}})});Object.defineProperty(c,'plan',{get:()=>({all:pool})});Object.defineProperty(c,'introduction',{get:()=>null});c.save=()=>{};c.session={id:'rapid',activity:'test',stage:'practice',index:0,events:[],queue:pool.map((target,i)=>({id:'q'+i,mode:'name',answerKind:'class',target}))};c.bind(root);host.showPilot();window.qaInput=c;}''')
 q.locator('[data-note="4"]').click()
 for _ in range(5):q.locator('[data-note="4"]').click()
 assert q.evaluate('qaInput.session.events.length')==1
 assert q.evaluate('qaInput.session.events.every(e=>e.correct)')
 q.clock.run_for(200);q.locator('[data-note="0"]').click();assert q.evaluate('qaInput.session.index')==2
 q.locator('[data-note="2"]').dispatch_event('pointerdown',{'pointerId':11,'pointerType':'touch','isPrimary':True,'button':0})
 q.evaluate('qaInput.answer(2)')
 q.locator('[data-note="2"]').dispatch_event('click',{'pointerId':11,'detail':1})
 assert q.evaluate('qaInput.session.events.length')==3
 assert q.evaluate('qaInput.session.events.every(e=>e.correct)')
 q.close();q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)))
 h['seed'](q,'guitar6','z2-note-4-discover');q.set_viewport_size({'width':1440,'height':900});q.reload();q.locator('.sidebar [data-action=settings]').click()
 assert q.locator('[data-action=choose-import] svg').count()==1
 assert q.locator('label[for=reset-instrument]').evaluate('e=>e.classList.contains("visually-hidden")')
 q.locator('#setting-accidentals').select_option('mixed');assert q.locator('#setting-accidentals').input_value()=='mixed'
 q.locator('[data-action=accidentals-help]').click();assert q.locator('.spelling-article h1').count()==1;q.screenshot(path=str(out/'article.png'),full_page=True)
 q.locator('.spelling-article [data-action=settings]').first.click();q.screenshot(path=str(out/'settings.png'),full_page=True)
 h['seed'](q,'guitar6','z2-mix-4');q.locator('.sidebar [data-action=settings]').click();q.locator('#setting-accidentals').select_option('mixed');q.locator('.sidebar .nav-item[data-action=home]').click();q.locator('.chapter-options summary').click();q.locator('[data-pilot-action=start][data-module=z2-mix-4]').click();q.wait_for_selector('.pilot-count',state='detached')
 toggle=q.locator('.accidentals-toggle');assert toggle.inner_text()=='♯♭'
 for expected in ['♯','♭','♯♭']:
  toggle.click();assert toggle.inner_text()==expected
 q.locator('[data-pilot-action=exit]').click()
 q.locator('.sidebar [data-action=achievements]').click();q.locator('[data-success-action=layout]').click();assert q.locator('.is-album').evaluate('e=>getComputedStyle(e).gridTemplateColumns.split(" ").length')==5
 assert q.locator('.is-album .is-musical').count()>0;q.screenshot(path=str(out/'album-landscape.png'),full_page=True)
 q.set_viewport_size({'width':390,'height':844});assert q.locator('.is-album').evaluate('e=>getComputedStyle(e).gridTemplateColumns.split(" ").length')==3
 q.goto('http://localhost:4173/launch-motion.html');assert q.locator('.launch-board').count()==3;q.locator('#launch-replay-all').click();q.wait_for_timeout(200);assert q.locator('.launch-board').evaluate_all('es=>es.every(e=>e.getAnimations({subtree:true}).length>0)')
 q.locator('[value=course]').check();assert q.locator('.launch-preview[data-palette=course]').count()==3
 q.screenshot(path=str(out/'launch-boards.png'),full_page=True)
 q.set_viewport_size({'width':320,'height':844})
 q.evaluate('''async()=>{const {ArcadeController}=await import('./arcade-ui.js'),{makeProfile}=await import('./core.js'),{newArcadeRun}=await import('./arcade-rules.js');const root=document.createElement('div');document.body.replaceChildren(root);let c;const host={root,getState:()=>({profile:makeProfile('guitar6'),sound:false}),getData:()=>({}),icon:()=>'',render:()=>{root.innerHTML=c.render();}};c=new ArcadeController(host);c.run=newArcadeRun('zones-natural');c.run.stage=5;c.run.score=5000;c.targetStage=5;c.target={string:0,fret:4,midi:44};c.phase='question';host.render();c.layout();window.qaArcade=c;}''')
 edges=q.evaluate('''()=>{const c=qaArcade,v=c.host.root.querySelector('.arcade-neck'),svg=v.querySelector('svg'),g=c.neckGeometryFor(svg),r=v.getBoundingClientRect(),x=svg.getBoundingClientRect().left;return {left:x+g.bounds(4)[0],fadeEnd:r.x+r.width*.06,right:x+g.frets[8],fadeStart:r.right-r.width*.06};}''')
 assert edges['left']>=edges['fadeEnd']-1 and edges['right']<=edges['fadeStart']+1,edges
 q.screenshot(path=str(out/'arcade-zone-fade.png'))
 q.evaluate('''()=>{const c=qaArcade;c.run.stage=6;c.targetStage=6;c.target.fret=0;c.serial++;c.layout();}''');q.wait_for_timeout(150)
 assert q.evaluate('''()=>{const c=qaArcade,v=c.host.root.querySelector('.arcade-neck');return c.neckZone==='0:4'&&v.scrollLeft===0;}''')
 assert not errors,errors;b.close()
print('UX lot passed: rapid bursts and stale touches ignored, fresh correct answers retained, reset/upload, mixed spelling article, 5/3 album, musical editions and launch boards.')
