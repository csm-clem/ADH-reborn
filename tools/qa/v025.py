"""Contradictory regression checks for the v0.24 audit and the v0.25 UI."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import ast,json,os
OUT=Path(os.environ.get('ADH_QA_OUTPUT','/tmp/dft-v025'));OUT.mkdir(parents=True,exist_ok=True)
BASE=os.environ.get('ADH_BASE_URL','http://localhost:4173/')
tree=ast.parse(Path('tools/qa/beta-browser.py').read_text());SEED=next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(x,ast.Name) and x.id=='SEED' for x in n.targets))
checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,service_workers='block');page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 def state():return page.evaluate("Object.values(JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable')).profiles)[0]")
 def seed(activity=None,instrument='guitar6'):
  page.goto(BASE);page.evaluate(SEED,{'instrument':instrument,'activity':activity});page.reload();page.wait_for_timeout(100)
 def shot(name):
  page.wait_for_timeout(250);page.screenshot(path=str(OUT/(name+'.png')),full_page=True)
 def start(a):
  page.locator('.chapter-options summary').click();page.locator(f'[data-module="{a}"]').click()
  while page.locator('[data-pilot-action=help-next]').count():page.locator('[data-pilot-action=help-next]').click()
  if page.locator('.pilot-count').count():page.wait_for_selector('.pilot-count',state='detached')
  page.wait_for_timeout(100)
 # Exact old failure: primary action after reload must preserve the existing session.
 seed('opens');start('opens')
 for _ in range(3):
  s=state()['session'];q=s['queue'][s['index']];page.locator(f'[data-note="{q["target"]["midi"]}"]').click()
 saved=state()['session'];page.reload();shot('resume-chapter');assert 'Reprendre' in page.locator('[data-pilot-action=beta-begin]').inner_text();page.locator('[data-pilot-action=beta-begin]').click();page.wait_for_timeout(1100);resumed=state()['session'];assert resumed['id']==saved['id'] and resumed['index']==3;checks.append('reload resumes exact session at question four')
 # Demonstration is a separate target and never consumes or reorders the evaluated queue.
 seed('opens');page.evaluate("()=>{let d=JSON.parse(localStorage.getItem('fretboard-trainer:pilot:stable'));Object.values(d.profiles)[0].seenInstructions=[];localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(d))}");page.reload();page.locator('.chapter-options summary').click();page.locator('[data-module=opens]').click();q=state()['session']['queue'][0];demo=page.locator('.help-name-example .neck-point').evaluate('e=>({x:e.getAttribute("cx"),y:e.getAttribute("cy")})');html=page.locator('.help-name-example').inner_text();name=page.evaluate('async m=>(await import("./core.js")).pitchLabel(m)',q['target']['midi']);assert page.locator('.help-note.example-correct').inner_text()!=name;shot('separate-demonstration');page.locator('[data-pilot-action=help-next]').click();page.wait_for_timeout(1100);assert state()['session']['queue'][0]['id']==q['id'];checks.append('demonstration answer differs from first evaluated answer')
 # Three branches only and all path entries below their branch.
 seed();assert page.locator('.branch-jumbo').count()==3;assert page.locator('.route-card').count()==0;shot('branches-mobile');page.locator('[data-pilot-action=beta-branch][data-id=targeted]').click();assert page.locator('.route-card').count()==6;shot('targeted-paths');checks.append('three jumbo branches and six targeted child paths')
 # Full board, fixed target size, persistent visible scrollbar, fade disappearing at the end.
 page.locator('[data-action=stats]:visible').first.click();assert page.locator('[data-pilot-action=beta-stats]').count()==0;assert page.locator('.progress-cell').count()==150
 widths=page.locator('.progress-cell summary').evaluate_all('(es)=>es.map(e=>e.getBoundingClientRect().width)');assert min(widths)>=44
 scroll=page.locator('.progress-map');assert scroll.evaluate('e=>e.scrollWidth>e.clientWidth');assert scroll.evaluate('e=>getComputedStyle(e).overflowX')=='scroll';assert page.locator('.progress-scrollbar').is_visible();shot('progress-start')
 scroll.evaluate('e=>{e.scrollLeft=e.scrollWidth}');page.wait_for_timeout(100);assert page.locator('.progress-map-frame.is-at-end').count()==1;page.locator('[data-progress-string="5"][data-progress-fret="24"] summary').click();page.wait_for_function("document.querySelector('.progress-selection').textContent.includes('E6')");shot('progress-end');checks.append('150 wide targets, horizontal scrolling, end fade and uncut selected-note details')
 # New course, retry on another figure, shared realistic diagram overview.
 seed();page.locator('[data-pilot-action=beta-branch][data-id=beginner]').click();page.locator('[data-pilot-action=beta-route][data-id=beginner]').click();page.locator('[data-pilot-action=beta-chapter][data-id=gd-01]').click();page.locator('[data-pilot-action=beta-course]').first.click();assert page.locator('.instrument-overview').count();shot('beginner-instrument');page.locator('[data-course-action=next]').click();before=page.locator('.course-feature').get_attribute('viewBox');page.locator('[data-course-action=answer][data-value=cell]').click();after=page.locator('.course-feature').get_attribute('viewBox');assert before!=after;assert page.locator('[data-course-action=next]').is_disabled();checks.append('wrong beginner answer produces another figure and does not validate')
 # The route has a real three-scope synthesis, also after completing debug mode.
 seed();page.locator('[data-pilot-action=beta-branch][data-id=guided]').click();page.locator('[data-pilot-action=beta-route][data-id=guided]').click();assert page.locator('.guided-bilan').count()==1;page.locator('.guided-bilan>summary').click();assert page.locator('.bilan-scopes>div').count()==3;shot('guided-bilan');checks.append('guided level summary covers all three required scopes')
 # Visual review over four themes and four useful viewport sizes.
 for theme in ['light','dark','accessible','paper']:
  seed();page.evaluate('''async theme=>{const {STATE_KEY}=await import('./release.js');let s=JSON.parse(localStorage.getItem(STATE_KEY));s.theme=theme;localStorage.setItem(STATE_KEY,JSON.stringify(s));}''',theme);page.reload()
  for w,h in [(320,568),(390,844),(844,390),(1440,900)]:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(100);assert page.evaluate('document.documentElement.scrollWidth')<=w;shot('branches-'+theme+'-'+str(w));checks.append('branch layout '+theme+' '+str(w))
 # Actual AudioContext and synthesized buffers: one graph, independent tails, quick warmed note.
 audio=page.evaluate('''async()=>{const {createAudioService}=await import('./services/audio-service.js');const ctx=new AudioContext({latencyHint:'interactive'}),engine=createAudioService({createContext:()=>ctx,getState:()=>({sound:true,voice:'bass-electric',profile:null})});await engine.unlockAudio();let t=performance.now();await engine.playNote(40);let first=performance.now()-t;t=performance.now();await engine.playNote(40);let warm=performance.now()-t;const r={state:ctx.state,firstMs:first,warmMs:warm,sampleRate:ctx.sampleRate};await engine.dispose();return r;}''');assert audio['state']=='running';assert audio['warmMs']<30;checks.append({'browserAudio':audio})
 assert not errors,errors
 (OUT/'validation.json').write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2));print(json.dumps({'checks':len(checks),'audio':audio,'errors':errors}))
 ctx.close();b.close()
