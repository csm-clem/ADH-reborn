from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':375,'height':812},reduced_motion='reduce');page.goto(BASE)
 for activity in ['note-5-find','note-11-find','note-0-find']:
  seed(page,'guitar6',activity)
  page.evaluate('''async({key,activity})=>{const s=JSON.parse(localStorage.getItem(key)),d=Object.values(s.profiles)[0],{practiceActivities,pilotPlan,questionsFor}=await import('./pilot.js'),m=practiceActivities(pilotPlan(d.profile)).find(m=>m.id===activity),queue=questionsFor(m);d.session={id:'intro-music',activity,queue,events:[],index:queue.length,stage:'motif',motifIndex:0,motifErrors:0,startedAt:Date.now()};d.seenInstructions=[];localStorage.setItem(key,JSON.stringify(s));}''',{'key':KEY,'activity':activity});page.reload();page.locator('[data-pilot-action="resume"]').click();assert page.locator('.melody-passage').count()
  for w,h in [(320,480),(375,812),(844,390),(568,320),(1280,720)]:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(250);bad=page.evaluate('''()=>[...document.querySelectorAll('.instruction-page button')].filter(e=>{const r=e.getBoundingClientRect();return e.checkVisibility()&&(r.top<0||r.left<0||r.right>innerWidth+.5||r.bottom>innerHeight+.5)}).map(e=>e.textContent)''');
   if bad:
    page.screenshot(path=str(OUT/'music-lesson-failure.png'));print(page.locator('.instruction-page').evaluate('e=>[...e.querySelectorAll(".instruction-content,.instruction-heading,.instruction-visual,.instruction-summary,.lesson-actions")].map(n=>({class:n.className,box:n.getBoundingClientRect().toJSON(),text:n.innerText}))'));assert False,(activity,w,h,bad)
  page.locator('[data-pilot-action="home"]').click()
 print(json.dumps({'fifteen_musical_introduction_layouts':True}));b.close()
