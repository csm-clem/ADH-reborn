"""Complete a real activity, inspect the unlock, and follow its exact collectible card."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
OUT=Path('docs/v0.28');OUT.mkdir(parents=True,exist_ok=True)
KEY='fretboard-trainer:pilot:stable'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},service_workers='block');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:4173/')
 page.evaluate('''async()=>{const {makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{initialPilotStore,questionsFor}=await import('./pilot.js'),{betaCatalog}=await import('./beta-catalog.js');const profile=makeProfile('guitar6'),s=initialPilotStore(),m=betaCatalog(profile).activities.find(a=>a.id==='note-4-find');s.profiles[profile.key]={profile,attempts:[],later:[],session:{id:'celebration-actual',activity:'note-4-find',taskContract:'register-v1',stage:'practice',queue:questionsFor(m),events:[],index:0,motifIndex:0,motifErrors:0,startedAt:Date.now()},discoveredModules:['note-4'],seenInstructions:['find','melody-note-4','motif'],navigation:{branch:'targeted',route:'z1',chapter:betaCatalog(profile).chapters.find(c=>c.activityIds.includes(m.id)).id}};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true,sound:false}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''')
 page.reload();page.clock.install();page.clock.pause_at(page.evaluate('new Date().toISOString()'));page.locator('[data-pilot-action=beta-begin]').click();page.clock.run_for(1400)
 for _ in range(30):
  s=page.evaluate('(k)=>Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0].session',KEY)
  if not s or s['stage']!='practice':break
  if page.locator('[data-pilot-action=help-next]').count():page.locator('[data-pilot-action=help-next]').click();page.clock.run_for(1400)
  s=page.evaluate('(k)=>Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0].session',KEY);q=s['queue'][s['index']]
  page.locator(f'#pilot-neck [data-pilot-string="{q["target"]["string"]}"][data-pilot-fret="{q["target"]["fret"]}"]').click();page.clock.run_for(140)
 seq=page.evaluate("async()=>{const {makeProfile}=await import('./core.js'),{betaCatalog}=await import('./beta-catalog.js'),{catalogMelodies}=await import('./melodies.js');return catalogMelodies(betaCatalog(makeProfile('guitar6'))).get('note-4-find').sequence}")
 for note in seq:
  if page.locator('[data-pilot-action=help-next]').count():page.locator('[data-pilot-action=help-next]').click();page.clock.run_for(50)
  page.locator(f'#pilot-neck [data-pilot-string="{note["string"]}"][data-pilot-fret="{note["fret"]}"]').click();page.clock.run_for(100)
 page.clock.run_for(1000)
 banner=page.locator('.achievement-unlock');assert banner.count()==1
 assert 'Succès débloqué' in banner.locator('.unlock-event').text_content()
 assert banner.locator('.unlock-description').inner_text()=='Ajouté à votre collection.'
 first_title=banner.locator('h3').inner_text();page.locator('[data-pilot-action=unlock-next]').click();page.clock.run_for(900)
 assert banner.locator('h3').inner_text()!=first_title
 layouts=[]
 for _ in range(15):
  if banner.locator('h3').inner_text()=='Higher Ground':break
  page.locator('[data-pilot-action=unlock-next]').click();page.clock.run_for(100)
 assert banner.locator('h3').inner_text()=='Higher Ground'
 assert banner.locator('svg.music-sleeve').count()==1
 assert page.locator('.reward-listen').count()==1
 for theme in ['light']:
  page.evaluate('(theme)=>document.documentElement.dataset.theme=theme',theme)
  for w,h in [(320,568),(844,390),(1440,1000)]:
   page.set_viewport_size({'width':w,'height':h});page.clock.run_for(900)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(theme,w,'overflow')
   for sel in ['.result-actions>.primary','.result-details-button','.unlock-actions>.button']:
    bb=page.locator(sel).bounding_box();assert bb['y']>=0 and bb['y']+bb['height']<=h+1,(theme,w,h,sel,bb)
   assert banner.locator('h3').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),(theme,w,'title overflow')
   layouts.append([theme,w,h])
   if theme=='light':page.screenshot(animations='disabled',path=str(OUT/f'resultat-musique-{w}.png'))
  if theme in ['dark','accessible']:page.screenshot(animations='disabled',path=str(OUT/f'resultat-{theme}.png'))
 page.set_viewport_size({'width':390,'height':844});page.evaluate('document.documentElement.dataset.theme="light"');page.clock.run_for(500)
 page.emulate_media(reduced_motion='reduce');assert banner.evaluate('e=>getComputedStyle(e).animationName')=='none'
 target=banner.locator('[data-pilot-action=achievements]').get_attribute('data-id');selected_title=banner.locator('h3').inner_text()
 page.locator('[data-pilot-action=achievements]').click();page.clock.run_for(100)
 card=page.locator(f'[data-card-id="{target}"]');assert card.evaluate('e=>document.activeElement===e');assert 'is-revealed' in card.get_attribute('class');assert card.get_attribute('aria-label').startswith(selected_title)
 assert page.locator('[data-success-action=category][data-value=all]').get_attribute('aria-pressed')=='true'
 page.screenshot(animations='disabled',path=str(OUT/'succes-retrouve.png'));assert not errors,errors
 (OUT/'verification-celebration-musicale.json').write_text(json.dumps({'actual_activity':True,'multiple_rewards':True,'exact_card_target':target,'focus_and_filters':True,'layouts':layouts,'reduced_motion':True,'errors':errors},ensure_ascii=False,indent=2));print(json.dumps({'layouts':len(layouts),'target':target,'errors':errors}));b.close()
