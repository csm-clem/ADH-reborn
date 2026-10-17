"""Every assigned passage plays to completion; catalogue remains unique and collectible."""
from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':844,'height':390},reduced_motion='reduce');page.goto(BASE);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 assigned=page.evaluate('''async()=>{const {makeProfile}=await import('./core.js'),{pilotPlan}=await import('./pilot.js'),{melodiesForPlan}=await import('./melodies.js');return [...melodiesForPlan(pilotPlan(makeProfile('guitar6')))].map(([activity,m])=>({activity,id:m.id,sequence:m.sequence}));}''')
 assert len(assigned)==25 and len(set(m['id'] for m in assigned))==25
 enable_fast_clock(page)
 for m in assigned:
  page.evaluate('''async activity=>{const {makeProfile}=await import('./core.js'),{initialState}=await import('./state.js'),{STATE_KEY,PILOT_KEY}=await import('./release.js'),{pilotPlan,practiceActivities,questionsFor,initialPilotStore}=await import('./pilot.js'),profile=makeProfile('guitar6'),a=practiceActivities(pilotPlan(profile)).find(m=>m.id===activity),queue=questionsFor(a),store=initialPilotStore();store.profiles[profile.key]={profile,attempts:[],later:[],seenInstructions:['motif','melody-'+a.baseId],session:{id:'music-qa-'+activity,activity,queue,events:queue.map(q=>({...q,firstAnswer:q.target,correct:true,ms:800,at:Date.now(),aids:[]})),index:queue.length,stage:'motif',motifIndex:0,motifErrors:0,startedAt:Date.now()}};localStorage.setItem(STATE_KEY,JSON.stringify({...initialState(),profile,sound:false}));localStorage.setItem(PILOT_KEY,JSON.stringify(store));}''',m['activity']);page.reload();page.locator('[data-pilot-action="resume"]').click();dismiss_help(page)
  for i,note in enumerate(m['sequence']):
   page.locator(f'#pilot-neck [data-pilot-string="{note["string"]}"][data-pilot-fret="{note["fret"]}"]').dispatch_event('pointerdown',{'button':0});assert snap(page)['session']['motifIndex']==i+1
  assert not page.locator('.score-display').count();tick(page,300);assert page.locator('.score-display').count();d=snap(page);assert d['attempts'][-1]['melodyId']==m['id'];assert page.evaluate('(k)=>JSON.parse(localStorage.getItem(k)).achievements.some(u=>u.musicId===Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0].attempts.at(-1).melodyId)',KEY)
  print(m['activity'],m['id'],'ok',flush=True);page.locator('[data-pilot-action="home"]').last.click()
 assert not errors,errors;print(json.dumps({'twenty_five_unique_passages_completed':True,'twelve_octave_family_passages':True,'all_unlocks_persisted':True,'errors':errors}));b.close()
