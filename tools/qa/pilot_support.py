from playwright.sync_api import sync_playwright
import json,re,os
from pathlib import Path
BASE=os.environ.get('ADH_BASE_URL','http://localhost:4173/')
OUT=Path(os.environ.get('ADH_QA_OUTPUT','/tmp/adh-pilot-qa'));OUT.mkdir(parents=True,exist_ok=True)
CHROMIUM=os.environ.get('CHROMIUM_BIN','/usr/bin/chromium')
KEY='fretboard-trainer:pilot:0.11.0';SETTINGS='fretboard-trainer:settings';LEGACY=SETTINGS

def setup_standard(page):
 page.get_by_role('button',name='Continuer',exact=True).click();page.get_by_role('button',name='C’est parti').click()
def snap(page):return page.evaluate('(k)=>Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0]',KEY)
def tick(page,ms=40):
 if getattr(page,'fast_clock',False):page.clock.run_for(ms)
def dismiss_help(page):
 for _ in range(4):
  if not page.locator('[data-pilot-action="help-next"]').count():break
  page.locator('[data-pilot-action="help-next"]').click();tick(page)
def tap(page,s,f):
 tick(page);cell=page.locator(f'#pilot-neck [data-pilot-string="{s}"][data-pilot-fret="{f}"]')
 if not page.locator('.pilot-position-buttons details[open]').count() and cell.count():cell.click()
 else:
  if not page.locator('.pilot-position-buttons details[open]').count():page.locator('.pilot-position-buttons summary').click()
  page.locator(f'[data-pilot-action="position"][data-string="{s}"][data-fret="{f}"]').click()
 tick(page)
def wait_advance(page,index):
 data=snap(page)['session'];tick(page,550 if data and (data.get('feedback') or {}).get('correct') else 1050)
 page.wait_for_function('(p)=>{const s=Object.values(JSON.parse(localStorage.getItem(p.key)).profiles)[0].session;return !s||s.index!==p.index||s.stage!=="practice"}',arg={'key':KEY,'index':index},timeout=3000)
def complete(page,wrong=False,hint=False):
 dismiss_help(page);s=snap(page)['session']
 while s and s['stage']=='discovery' and not page.locator('[data-pilot-action="practice"]').is_enabled():
  focus=page.evaluate('''async k=>{const {pilotPlan,practiceActivities}=await import('./pilot.js'),d=Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0],m=practiceActivities(pilotPlan(d.profile)).find(m=>m.id===d.session.activity);return ['opens','tuning'].includes(m.kind)?m.pool.find(p=>!(d.session.explored||[]).includes(p.string+':'+p.fret)):m.focus[0]}''',KEY)
  tap(page,focus['string'],focus['fret']);s=snap(page)['session']
 if page.locator('[data-pilot-action="practice"]').count():page.locator('[data-pilot-action="practice"]').click();dismiss_help(page)
 if page.locator('.pilot-count').count():tick(page,1600)
 page.wait_for_selector('.pilot-count',state='detached');failed=False
 while snap(page)['session'] and snap(page)['session']['stage']=='practice':
  dismiss_help(page)
  if page.locator('.pilot-count').count():tick(page,1600)
  s=snap(page)['session'];q=s['queue'][s['index']]
  if s.get('feedback'):wait_advance(page,s['index']);continue
  if q['mode']=='name':
   note=q['target']['midi']%12
   if wrong and not failed:note=next(n for n in [0,2,4,5,7,9,11] if n!=note);failed=True
   page.locator(f'[data-note="{note}"]').click()
  else:tap(page,q['target']['string'],q['target']['fret'])
  wait_advance(page,s['index'])
 if page.locator('.score-display').count():return
 while snap(page)['session'] and snap(page)['session']['stage']=='motif':
  dismiss_help(page);current=page.locator('.pilot-motif .current')
  if not current.count():break
  content=current.inner_text().splitlines();name=content[0];number=int(re.search(r'\d+',content[-1]).group());profile=snap(page)['profile'];string=len(profile['tuning'])-number;pc=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'].index(name);fret=next(f for f in range(5) if (profile['tuning'][string]+f)%12==pc);tap(page,string,fret);tick(page,550)
 if page.locator('[data-pilot-action="complete"]').count():page.locator('[data-pilot-action="complete"]').click()
 assert page.locator('.score-display').count()==1

def seed(page,instrument='guitar6',activity=None,tuning=None):
 page.goto(BASE);page.evaluate('''async({instrument,activity,tuning})=>{const {makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{STATE_KEY,PILOT_KEY}=await import('./release.js'),{pilotPlan,practiceActivities,questionsFor,initialPilotStore}=await import('./pilot.js');const profile=makeProfile(instrument,tuning),state={...initialState(),profile},store=initialPilotStore(),plan=practiceActivities(pilotPlan(profile)),index=activity?plan.findIndex(m=>m.id===activity):0,previous=plan.slice(0,Math.max(0,index)),attempts=previous.map((m,i)=>({id:'seed-'+i,activity:m.id,at:1,finished:true,passed:true,events:questionsFor(m).map(q=>({mode:q.mode,target:q.target,correct:true,aids:[],ms:2000,at:1,retry:false}))}));store.profiles[profile.key]={profile,attempts,later:[],session:null,diagnostic:null,discoveredModules:[...new Set(previous.map(m=>m.baseId))]};localStorage.setItem(STATE_KEY,JSON.stringify(state));localStorage.setItem(PILOT_KEY,JSON.stringify(store))}''',{'instrument':instrument,'activity':activity,'tuning':tuning});page.reload()
def enable_fast_clock(page):
 page.clock.install();page.clock.pause_at(page.evaluate('Date.now()'));page.fast_clock=True
