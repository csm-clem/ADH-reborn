from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':375,'height':812});seed(page,'guitar6','note-4-find')
 page.evaluate('''async k=>{const store=JSON.parse(localStorage.getItem(k)),d=Object.values(store.profiles)[0],{questionsFor,pilotPlan,practiceActivities}=await import('./pilot.js'),m=practiceActivities(pilotPlan(d.profile)).find(m=>m.id==='note-4-find'),q=questionsFor(m);d.session={id:'result-fit',activity:m.id,stage:'motif',queue:q,events:q.map(q=>({...q,at:Date.now(),ms:800,correct:true,aids:[]})),index:q.length,motifIndex:0,motifErrors:0,startedAt:Date.now()};d.seenInstructions=['motif','melody-note-4'];localStorage.setItem(k,JSON.stringify(store));}''',KEY);page.reload();page.locator('[data-pilot-action="resume"]').click();dismiss_help(page)
 seq=page.evaluate('''async k=>{const {melodiesForPlan}=await import('./melodies.js'),{pilotPlan}=await import('./pilot.js'),d=Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0];return melodiesForPlan(pilotPlan(d.profile)).get('note-4-find').sequence}''',KEY)
 # Assert exactly the final-note delay (using DOM event dispatch, not actionability waits).
 page.clock.install();page.clock.pause_at(page.evaluate('new Date().toISOString()'))
 for note in seq:page.locator(f'#pilot-neck [data-pilot-string="{note["string"]}"][data-pilot-fret="{note["fret"]}"]').dispatch_event('pointerdown',{'button':0})
 assert not page.locator('.score-display').count();page.clock.run_for(299);assert not page.locator('.score-display').count();page.clock.run_for(1);assert page.locator('.score-display').count()
 for w,h in [(240,320),(320,480),(375,812),(568,320),(844,390),(1280,720)]:
  page.set_viewport_size({'width':w,'height':h});page.clock.run_for(500)
  bad=page.evaluate('''()=>[...document.querySelectorAll('.result-card button')].filter(e=>{const r=e.getBoundingClientRect();return r.left<-.5||r.top<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5}).map(e=>({text:e.textContent,box:e.getBoundingClientRect().toJSON()}))''')
  assert not bad,(w,h,bad)
 print(json.dumps({'final_note_300ms_delay':True,'six_result_sizes_with_success_banner':True}));b.close()
