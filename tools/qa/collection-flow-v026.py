from pathlib import Path
from playwright.sync_api import sync_playwright
import json
KEY='fretboard-trainer:pilot:stable'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1280,'height':900},service_workers='block');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:4173/')
 page.evaluate('''async()=>{const {makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{initialPilotStore,questionsFor}=await import('./pilot.js'),{betaCatalog}=await import('./beta-catalog.js');const profile=makeProfile('guitar6'),s=initialPilotStore(),m=betaCatalog(profile).activities.find(m=>m.id==='opens');s.profiles[profile.key]={profile,attempts:[],later:[],session:{id:'flow-open',activity:'opens',taskContract:'register-v1',stage:'practice',queue:questionsFor(m),events:[],index:0,motifIndex:0,motifErrors:0,startedAt:Date.now()},discoveredModules:['opens'],seenInstructions:['name-pitch'],navigation:{branch:'targeted',route:'z1',chapter:'z1-opens'}};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true,sound:false}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''')
 page.reload();page.clock.install();page.clock.pause_at(page.evaluate('new Date().toISOString()'));page.locator('[data-pilot-action=beta-begin]').click()
 for i in range(4):
  if page.locator('[data-pilot-action=help-next]').count():page.locator('[data-pilot-action=help-next]').click()
 page.clock.run_for(1400)
 for i in range(30):
  state=page.evaluate('(k)=>Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0].session',KEY)
  if not state or state['stage']=='result':break
  assert state['stage']=='practice'
  q=state['queue'][state['index']];page.locator('[data-note="'+str(q['target']['midi'])+'"]').click();page.clock.run_for(125)
 page.clock.run_for(500)
 assert page.locator('.score-display').count()==1
 assert page.locator('.achievement-celebration').count()==1
 page.locator('[data-pilot-action=achievements]').click()
 assert page.locator('[data-card-id=first-session].is-earned').count()==1
 assert page.locator('[data-card-id=opens-named].is-earned').count()==1
 assert page.locator('[data-card-id=open-strings] .achievement-progress-heading strong').inner_text()=='50 %'
 # Follow the actual course action and its visible checks, without writing completion flags.
 page.locator('[data-card-id=diagram-check] [data-success-action=try]').first.click()
 for i in range(100):
  if not page.locator('.course-page').count():break
  quiz=page.evaluate('''async k=>{const {betaCatalog}=await import('./beta-catalog.js'),{betaCourses,coursePage}=await import('./beta-courses.js'),d=Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0];return coursePage(betaCourses(d.profile,betaCatalog(d.profile)).get('gd-02'),d.courses?.['gd-02']||{index:0,visited:[],correct:[],completed:false}).quiz||null}''',KEY)
  if quiz:
   if quiz['kind']=='choice':page.locator('[data-course-action=answer][data-value="'+quiz['answer']+'"]').click()
   else:
    target=quiz['target'];page.locator('[data-lesson-string="'+str(target['string'])+'"][data-lesson-fret="'+str(target['fret'])+'"]').first.click()
  page.locator('[data-course-action=next]').click();page.clock.run_for(50)
 assert not page.locator('.course-page').count()
 page.locator('[data-action=achievements]:visible').first.click();assert page.locator('[data-card-id=diagram-check].is-earned').count()==1
 assert not errors,errors
 result={'real_naming_activity_unlocks':True,'missing_direction_remains_at_50_percent':True,'real_course_checks_unlock':True,'errors':errors}
 Path('docs/v0.26/verification-parcours-reel.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result));b.close()
