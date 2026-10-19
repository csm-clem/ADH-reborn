"""Browser regression of viewport use, wheel choices, feedback and full-board progress."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
OUT=Path('docs/v0.27');OUT.mkdir(parents=True,exist_ok=True)
BASE='http://localhost:4173/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(service_workers='block');page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 def seed(instrument='guitar6',activity=None):
  page.goto(BASE)
  page.evaluate('''async({instrument,activity})=>{const {makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{initialPilotStore,questionsFor}=await import('./pilot.js'),{betaCatalog}=await import('./beta-catalog.js');const profile=makeProfile(instrument),s=initialPilotStore(),catalog=betaCatalog(profile),m=catalog.activities.find(a=>a.id===activity),chapter=m&&catalog.chapters.find(c=>c.activityIds.includes(activity));const d={profile,attempts:[],later:[],session:null,seenInstructions:['name','name-pitch','mix-intro','find'],discoveredModules:['opens']};if(m){d.navigation={branch:'targeted',route:m.scopeId,chapter:chapter.id};d.discoveredModules=[m.baseId];d.session={id:'qa',activity:m.id,stage:'practice',queue:questionsFor(m),events:[],index:0,motifIndex:0,motifErrors:0,startedAt:Date.now()};}s.profiles[profile.key]=d;localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true,sound:false}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''',{'instrument':instrument,'activity':activity});page.reload()
 def start(instrument,activity):
  seed(instrument,activity);page.locator('[data-pilot-action=beta-begin]').click()
  for _ in range(4):
   if page.locator('[data-pilot-action=help-next]').count():page.locator('[data-pilot-action=help-next]').click()
  page.wait_for_timeout(1400)
 layouts=[]
 for instrument in ['guitar6','guitar8','bass4']:
  for w,h in [(390,844),(844,390),(1440,1000)]:
   page.set_viewport_size({'width':w,'height':h});start(instrument,'mix-4')
   assert page.locator('.answer-wheel [data-note]').count()==7
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   viewport=page.locator('.neck-viewport').bounding_box();ys=page.locator('.neck-axis.pilot-axis-string').evaluate_all('(es)=>es.map(e=>{const b=e.getBoundingClientRect();return b.y+b.height/2})')
   margins={'top':round(min(ys)-viewport['y'],1),'bottom':round(viewport['y']+viewport['height']-max(ys),1)}
   assert margins['top']<35 and margins['bottom']<50,(instrument,w,margins)
   button=page.locator('.answer-wheel button').first;button.hover();page.wait_for_timeout(150);assert button.evaluate('e=>{const p=document.createElement("i");p.style.backgroundColor="var(--surface-soft)";document.body.append(p);const neutral=getComputedStyle(p).backgroundColor;p.remove();return getComputedStyle(e).backgroundColor===neutral;}')
   layouts.append({'instrument':instrument,'width':w,'margins':margins})
   if instrument=='guitar6':page.screenshot(path=str(OUT/f'jeu-{w}.png'))
 start('guitar6','mix-6');assert page.locator('.answer-wheel [data-note]').count()==12
 # Actual wheel input advances immediately while previous correction animation lives on.
 q=page.evaluate('Object.values(JSON.parse(localStorage.getItem("fretboard-trainer:pilot:stable")).profiles)[0].session.queue[0]')
 wrong=next(n for n in range(12) if n!=q['target']['midi']%12);page.locator(f'[data-note="{wrong}"]').click();page.wait_for_timeout(80)
 assert page.locator('.game-counter').inner_text().startswith('2 /')
 assert page.locator('.echo-dot.tone-wrong').count()>0
 page.locator('[data-pilot-action=exit]').first.click();page.locator('[data-action=stats]:visible').first.click()
 # Fill a few representative positions, including durable statistics only.
 page.evaluate('''()=>{const key='fretboard-trainer:pilot:stable',s=JSON.parse(localStorage.getItem(key)),d=Object.values(s.profiles)[0];d.session=null;d.attempts=[];d.evidence={version:1,activities:{},coverage:{name:[],find:[]},records:{},processed:[],stats:{'0:0':{name:{total:3,correct:3},find:{total:3,correct:3}},'1:1':{name:{total:10,correct:9},find:{total:10,correct:9}},'2:2':{name:{total:3,correct:1},find:{total:3,correct:2}}}};localStorage.setItem(key,JSON.stringify(s));}''');page.reload();page.locator('[data-action=stats]:visible').first.click()
 for theme in ['light','dark','accessible','paper']:
  page.locator('[data-action=settings]:visible').first.click();page.locator(f'input[name=theme][value={theme}]').check();page.locator('[data-action=stats]:visible').first.click()
  for w,h in [(390,844),(1440,1100)]:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(80)
   metrics=page.locator('.progress-scrollbar').evaluate('e=>{const m=document.querySelector(".progress-map");return {actual:parseFloat(e.style.getPropertyValue("--scroll-thumb"))/e.clientWidth,expected:m.clientWidth/m.scrollWidth}}')
   assert abs(metrics['actual']-metrics['expected'])<.003,metrics
   assert page.locator('.progress-cell.perfect summary').first.inner_text().endswith('100% ✓✓')
   cell=page.locator('.progress-cell.perfect summary').first
   assert cell.evaluate('e=>getComputedStyle(e).backgroundColor')!='rgba(0, 0, 0, 0)'
   assert cell.evaluate('e=>getComputedStyle(e).borderBottomWidth')=='1px'
   if w==1440:page.screenshot(path=str(OUT/f'progres-{theme}.png'))
  page.locator('.progress-scrollbar').fill('1000');page.wait_for_timeout(40);assert page.locator('.progress-map-frame').evaluate('e=>e.classList.contains("is-at-end")')
 # Desaturation affects art, never the live primary CTA or its ancestors.
 seed();page.locator('[data-action=achievements]:visible').first.click();card=page.locator('.achievement-card.is-missing').first
 assert card.locator('.achievement-art').evaluate('e=>getComputedStyle(e).filter')=='grayscale(1)'
 assert card.locator('.challenge-action').evaluate('e=>{for(let p=e;p&&!p.matches("body");p=p.parentElement){if(getComputedStyle(p).filter!=="none")return false;}return true}')
 page.screenshot(path=str(OUT/'collection-en-cours.png'))
 assert not errors,errors
 (OUT/'verification-jeu-progres.json').write_text(json.dumps({'game_layouts':layouts,'progress_themes':4,'scroll_ratio':True,'immediate_answers':True,'all_wheel_choices':True,'grayscale_except_try':True,'errors':errors},ensure_ascii=False,indent=2))
 print(json.dumps({'layouts':len(layouts),'themes':4,'errors':errors}));b.close()
