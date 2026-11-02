from pathlib import Path
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);q=b.new_page(viewport={'width':1100,'height':1000});errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.goto('http://localhost:4173/result-motion.html');q.clock.install()
 q.evaluate('''async()=>{const {ArcadeController}=await import('./arcade-ui.js'),{makeProfile}=await import('./core.js'),{newArcadeRun}=await import('./arcade-rules.js');const root=document.createElement('div');root.id='qa-result';document.body.replaceChildren(root);const c=new ArcadeController({root,getState:()=>({profile:makeProfile('guitar6')}),storageError:()=>false});c.run=newArcadeRun('zones-natural');Object.assign(c.run,{score:4450,correct:38,questions:40,combos:4,longest:38});c.phase='result';c.streakRecord=true;root.innerHTML=c.result();window.qa=c;c.layout();}''')
 q.clock.run_for(800);assert q.locator('[data-result-score]').inner_text()!='4\u202f450';assert q.locator('.result-sparks').evaluate('e=>e.parentElement.tagName')=='DD'
 q.clock.run_for(900);assert q.locator('.result-sparks i').evaluate_all('es=>es.some(e=>Number(e.style.opacity)>.1)')
 assert q.locator('.result-record').evaluate('e=>getComputedStyle(e).padding')=='5px 9px';assert q.locator('.result-record').evaluate('e=>getComputedStyle(e).borderWidth')=='0px'
 q.screenshot(path='work/c-integration-result.png',full_page=True);q.clock.run_for(1000)
 assert q.locator('[data-result-score]').inner_text()=='4\u202f450';assert q.evaluate('qa.run.score')==4450
 q.evaluate('qa.layout()');q.clock.run_for(300);assert q.locator('[data-result-score]').inner_text()=='4\u202f450'
 q.set_viewport_size({'width':390,'height':844});assert q.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 q.emulate_media(reduced_motion='reduce');q.evaluate('qa.resultMotionPlayed=false;qa.layout()');assert q.locator('.result-sparks i').evaluate_all('es=>es.every(e=>e.style.opacity==="0")')
 assert not errors,errors;b.close()
print('Real Arcade results: slow count, number-centred celebration, compact rows, final score, no restart, mobile and reduced motion passed.')
