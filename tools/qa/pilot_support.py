from playwright.sync_api import sync_playwright
import json,re,os
from pathlib import Path
BASE=os.environ.get("ADH_BASE_URL","http://localhost:4173")
OUT=Path(os.environ.get("ADH_QA_OUTPUT","/tmp/adh-pilot-qa"));OUT.mkdir(parents=True,exist_ok=True)
CHROMIUM=os.environ.get("CHROMIUM_BIN","/usr/bin/chromium")
KEY='fretboard-trainer:pilot:0.9.0';SETTINGS='fretboard-trainer:settings';LEGACY=SETTINGS
def setup_standard(page):
 page.get_by_role('button',name='Continuer',exact=True).click();page.get_by_role('button',name='C’est parti').click()
def snap(page):return page.evaluate('(key)=>{const v=JSON.parse(localStorage.getItem(key));return v.profiles[Object.keys(v.profiles)[0]]}',KEY)
def dismiss_help(page):
 for _ in range(4):
  if not page.locator('[data-pilot-action="help-next"]').count():break
  page.locator('[data-pilot-action="help-next"]').click()
  if getattr(page,'fast_clock',False):page.clock.run_for(40)

def tap(page,s,f):
 if getattr(page,'fast_clock',False):page.clock.run_for(40)
 cell=page.locator(f'#pilot-neck [data-pilot-string="{s}"][data-pilot-fret="{f}"]');box=cell.bounding_box() if cell.count() else None;view=page.locator('#pilot-neck').bounding_box()
 if page.locator('.pilot-position-buttons details[open]').count()==0 and box and box['x']>=view['x'] and box['x']+box['width']<=view['x']+view['width']:cell.click()
 else:
  if not page.locator('.pilot-position-buttons details[open]').count():page.locator('.pilot-position-buttons summary').click()
  page.locator(f'[data-pilot-action="position"][data-string="{s}"][data-fret="{f}"]').click()
 if getattr(page,'fast_clock',False):page.clock.run_for(40)
def wait_advance(page,index):
 if getattr(page,'fast_clock',False):page.clock.run_for(550)
 page.wait_for_function('(p)=>{const s=Object.values(JSON.parse(localStorage.getItem(p.key)).profiles)[0].session;return !s||s.index!==p.index||s.stage!=="practice"}',arg={'key':KEY,'index':index},timeout=3000)
def complete(page,wrong=False,hint=False):
 dismiss_help(page)
 s=snap(page)['session']
 while s['stage']=='discovery' and not page.locator('[data-pilot-action="practice"]').is_enabled():
  focus=page.evaluate('''async()=>{const {pilotPlan}=await import('./pilot.js');const s=JSON.parse(localStorage.getItem('fretboard-trainer:pilot:0.9.0'));const d=s.profiles[Object.keys(s.profiles)[0]];const m=pilotPlan(d.profile).modules.find(m=>m.id===d.session.activity);return ['opens','tuning'].includes(m.kind)?m.pool.find(p=>!(d.session.explored||[]).includes(p.string+':'+p.fret)):m.focus[0]}''')
  before=s.get('explored',[]);tap(page,focus['string'],focus['fret']);s=snap(page)['session'];assert s.get('discoveryDone') or s.get('explored',[])!=before or s.get('discoveryTried'),s
 if page.locator('[data-pilot-action="practice"]').count():
  page.locator('[data-pilot-action="practice"]').click();dismiss_help(page);
  if getattr(page,'fast_clock',False):page.clock.run_for(1600)
  page.wait_for_selector('.pilot-count',state='detached',timeout=5000)
 failed=False;used_hint=False
 if getattr(page,'fast_clock',False) and page.locator('.pilot-count').count():page.clock.run_for(1600)
 page.wait_for_selector('.pilot-count',state='detached',timeout=5000)
 while snap(page)['session'] and snap(page)['session']['stage']=='practice':
  dismiss_help(page)
  if getattr(page,'fast_clock',False) and page.locator('.pilot-count').count():page.clock.run_for(1600)
  s=snap(page)['session'];q=s['queue'][s['index']]
  if s.get('feedback'):
   if s['feedback']['correct']:wait_advance(page,s['index'])
   else:page.locator('[data-pilot-action="next"]').click()
   continue
  if hint and not used_hint and not q['evaluation']:
   page.locator('[data-pilot-action="hint"]').click();used_hint=True
  if wrong and not failed and q['mode']=='name':
   choices=[int(v) for v in page.locator('[data-pilot-action="note"]').evaluate_all('els=>els.map(e=>e.dataset.note)')];bad=next(v for v in choices if v!=q['target']['midi']%12)
   page.locator(f'[data-pilot-action="note"][data-note="{bad}"]').click();failed=True
   events=len(snap(page)['session']['events']);page.reload();page.locator('[data-pilot-action="resume"]').click()
   assert len(snap(page)['session']['events'])==events
   assert page.locator('.feedback.incorrect').count()==1
   page.locator('[data-pilot-action="next"]').click();continue
  if q['mode']=='name':page.locator(f'[data-pilot-action="note"][data-note="{q["target"]["midi"]%12}"]').click()
  else:
   string=5 if q['scope']=='any' and q.get('allowedFrets')==[0] and q['target']['midi']%12==4 else q['target']['string']
   tap(page,string,q['target']['fret'])
   assert snap(page)['session']['events'][-1]['target']['string']==string
  wait_advance(page,s['index'])
 if page.locator('.score-display').count():return
 while snap(page)['session'] and snap(page)['session']['stage']=='motif':
  dismiss_help(page)
  current=page.locator('.pilot-motif .current')
  if not current.count():break
  content=current.inner_text().splitlines();name=content[0];number=int(re.search(r'\d+',content[-1]).group())
  profile=snap(page)['profile'];string=len(profile['tuning'])-number
  # Names use international notation in this test.
  pc=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'].index(name)
  fret=next(f for f in range(5) if (profile['tuning'][string]+f)%12==pc);tap(page,string,fret)
 if page.locator('[data-pilot-action="complete"]').count():page.locator('[data-pilot-action="complete"]').click()
 assert page.locator('.score-display').count()==1

def seed(page,instrument='guitar6',activity=None,tuning=None):
 page.goto(BASE)
 page.evaluate('''async({instrument,activity,tuning})=>{
  const {makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{STATE_KEY,PILOT_KEY}=await import('./release.js'),{pilotPlan,questionsFor,initialPilotStore}=await import('./pilot.js');
  const profile=makeProfile(instrument,tuning),state={...initialState(),profile},store=initialPilotStore(),plan=pilotPlan(profile),index=activity?plan.modules.findIndex(m=>m.id===activity):0;
  const attempts=plan.modules.slice(0,index).map((m,i)=>({id:'seed-'+i,activity:m.id,at:1,finished:true,passed:true,events:questionsFor(m).map(q=>({mode:q.mode,target:q.target,correct:true,aids:[],ms:2000,at:1,retry:false}))}));
  store.profiles[profile.key]={profile,attempts,later:[],session:null,diagnostic:null};localStorage.setItem(STATE_KEY,JSON.stringify(state));localStorage.setItem(PILOT_KEY,JSON.stringify(store));
 }''',{'instrument':instrument,'activity':activity,'tuning':tuning});page.reload()

def enable_fast_clock(page):
 page.clock.install();page.clock.pause_at(page.evaluate('Date.now()'));page.fast_clock=True
