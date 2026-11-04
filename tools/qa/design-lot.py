"""Local browser verification for the approved design lot, no external requests."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from functools import partial
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[2]
out=ROOT/'work/design-lot';out.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(service_workers='block',viewport={'width':1280,'height':900})
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base)
 page.evaluate('''async()=>{const {makeProfile}=await import('./core.js');const {initialState}=await import('./state.js');const {STATE_KEY}=await import('./release.js');localStorage.setItem(STATE_KEY,JSON.stringify({...initialState(),profile:makeProfile('guitar6'),sound:false,beginnerGuide:true}));}''')
 page.reload();page.locator('[data-action="stats"]').first.click();page.get_by_role('heading',name='Trajectoire',exact=True).wait_for()
 page.evaluate('''async()=>{const {makeProfile}=await import('./core.js');const {initialPilotStore}=await import('./pilot.js');const {PILOT_KEY}=await import('./release.js');const profile=makeProfile('guitar6'),store=initialPilotStore();store.profiles[profile.key]={profile,attempts:[],later:[],arcade:{version:1,records:{},history:[1000,1700,1400,2300].map((score,i)=>({at:Date.now()-(4-i)*86400000,mode:'zones-natural',rules:1,score,longest:[5,12,8,16][i],meanMs:[2300,1800,null,1400][i]}))}};localStorage.setItem(PILOT_KEY,JSON.stringify(store));}''')
 page.reload();page.locator('[data-action="stats"]').first.click();page.locator('.trajectory > details > summary').first.click();assert page.locator('.trajectory svg').count()==3
 page.screenshot(path=str(out/'trajectory-desktop.png'),full_page=True)
 page.get_by_role('button',name='Explorer le manche',exact=True).click()
 hit=page.locator('.explorer-page [data-lesson-string="0"][data-lesson-fret="0"]');hit.focus();hit.press('Enter')
 assert 'E2' in page.locator('.explorer-page [role="status"]').inner_text()
 page.get_by_role('button',name='Activer le son',exact=True).click();assert page.get_by_role('button',name='Couper le son',exact=True).count()==1
 page.screenshot(path=str(out/'explorer-desktop.png'))
 page.get_by_role('button',name='Retour au parcours',exact=True).click()
 # Real controller result rendering and interaction, with a separate synthetic profile store.
 page.evaluate('''async()=>{const {PilotController}=await import('./pilot-ui.js');const {initialPilotStore}=await import('./pilot.js');const {makeProfile}=await import('./core.js');const {icon}=await import('./ui-icons.js');const state={profile:makeProfile('guitar6'),notation:'international',sound:false};const root=document.createElement('div');root.id='qa-results';document.body.replaceChildren(root);let c;const host={root,getState:()=>state,storage:{readPilot:()=>({value:initialPilotStore(),ok:true}),savePilot:()=>({ok:true})},icon,render:()=>{root.innerHTML=c.render();},playNote(){},stopAudio(){}};c=new PilotController(host);window.designQA=c;const m=c.catalog.activities.find(x=>x.mode==='name');const events=Array.from({length:24},(_,i)=>({target:m.pool[i%m.pool.length],correct:true,mode:'name',ms:800+i*10,aids:[],retry:false}));c.session={id:'qa',activity:m.id,stage:'result',queue:events.map(e=>({target:e.target})),events};c.resultView='summary';c.bind(root);host.showPilot=host.render;host.render();}''')
 page.get_by_role('button',name='Mon bilan de maîtrise').click();assert page.get_by_role('heading',name='Vos repères, en détail').count()==1
 assert not errors,errors
 page.screenshot(path=str(out/'mastery-desktop.png'))
 result=page.evaluate('''()=>{const c=window.designQA;const d=c.catalog.discoveries.find(d=>d.pitchClass===4&&d.scopeId==='z1');c.data.seenInstructions=['family-4'];c.session={id:'discovery-qa',activity:d.id,stage:'discovery',queue:[],index:0,explored:[]};c.feedback=null;c.host.showPilot();c.neckTap(0,1);return {selected:document.querySelector('.note-tag[data-string="0"][data-fret="1"]')?.textContent,correct:document.querySelectorAll('.pilot-marker.tone-correct').length,events:c.session.events};}''')
 assert 'F2' in result['selected'];assert result['correct']==0;assert result.get('events') is None
 page.evaluate('''()=>{const c=window.designQA;c.data.seenInstructions=[];c.lessonTrial=null;c.host.showPilot();c.lessonTap(0,2);}''')
 assert 'F♯2' in page.locator('.instruction-page .discovery-direction').inner_text()
 assert page.locator('.instruction-page .note-tag[data-string="0"][data-fret="2"]').count()==1
 page.wait_for_timeout(500)
 page.screenshot(path=str(out/'context-exploration-desktop.png'))
 # Mobile functional mockups share the actual scoring modules.
 page.set_viewport_size({'width':390,'height':844});page.goto(base+'docs/design/resultats-maquettes.html')
 page.get_by_role('button',name='Sans faute lent').click();page.get_by_role('button',name='Mon bilan de maîtrise').click();assert page.locator('#detail').is_visible()
 page.get_by_role('button',name='Comprendre les étoiles').click();assert page.locator('dialog').is_visible();page.get_by_role('button',name='Fermer',exact=True).click()
 page.get_by_role('button',name='Avec erreurs',exact=True).click();assert page.get_by_role('button',name='Comprendre mes erreurs',exact=True).count()==1
 page.screenshot(path=str(out/'result-errors-mobile.png'))
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'browser_errors':errors,'checks':['trajectory empty state','explorer keyboard pitch','shared mute','real mastery result','selected discovery note','free contextual exploration','three history charts','mockup stars popup','mockup mistakes','desktop and mobile screenshots']},ensure_ascii=False,indent=2))
 browser.close()
server.shutdown()
print('Recette navigateur du lot design réussie.')
