from pilot_support import *
BASE=os.environ.get('ADH_BASE_URL','http://127.0.0.1:4175/')
errors=[];checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
 for w,h in [(375,667),(844,390),(1280,800)]:
  ctx=b.new_context(viewport={'width':w,'height':h});page=ctx.new_page();page.set_default_timeout(7000);page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE)
  for step in range(3):
   assert page.evaluate('document.documentElement.scrollHeight<=innerHeight+1')
   assert page.locator('button[type=submit]').is_visible();page.locator('button[type=submit]').click()
  for i in range(5):
   assert page.locator('dialog[open] h1').is_visible();page.screenshot(path=str(OUT/f'guide-{w}-{i}.png'));page.locator('[data-guide=next]').click()
  assert page.evaluate('JSON.parse(localStorage.getItem("fretboard-trainer:settings")).beginnerGuide')
  page.locator('[data-pilot-action=start]').first.click();assert page.locator('.lesson-tuning-reminder').is_visible();page.screenshot(path=str(OUT/f'first-help-{w}.png'))
  ctx.close()
 checks.append('3 screen sizes: onboarding 3 steps, primer 5 pages, tuning reminder')
 ctx=b.new_context(viewport={'width':390,'height':844});page=ctx.new_page();page.set_default_timeout(7000);page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE)
 page.evaluate('''async()=>{const {makeProfile}=await import('./core.js'),{pilotPlan}=await import('./pilot.js'),{initialState}=await import('./state.js'),{simulatedCompletion}=await import('./debug-mode.js');const profile=makeProfile('guitar6'),old=simulatedCompletion(profile,pilotPlan(profile));localStorage.clear();localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),epoch:'0.22.0',beginnerGuide:true,profile}));localStorage.setItem('fretboard-trainer:pilot:0.22.0',JSON.stringify(old));window.expected=JSON.stringify(old);}''')
 expected=page.evaluate('window.expected');page.reload();assert page.evaluate('localStorage.getItem("fretboard-trainer:pilot:stable")')==expected
 assert page.evaluate('localStorage.getItem("fretboard-trainer:pilot:0.22.0")')==expected
 checks.append('real v0.22 store migrates, 100 attempts and achievements retained')
 page.locator('[data-action=achievements]:visible').first.click();page.locator('[data-success-action=category][data-value=music]').click();card=page.locator('.achievement-card').first;card.locator('[data-success-action=flip]').first.click();assert card.locator('.achievement-front').evaluate('(el)=>el.inert');assert card.locator('.achievement-back').evaluate('(el)=>!el.inert');page.wait_for_timeout(400);page.screenshot(path=str(OUT/'card-back.png'));assert card.locator('.achievement-back a,details,.achievement-proof').count()==0;card.locator('.achievement-back [data-success-action=flip]').click();page.wait_for_timeout(400);page.screenshot(path=str(OUT/'card-front.png'))
 page.locator('[data-success-action=listen]').first.click();page.wait_for_timeout(500)
 checks.append('achievement flip: front inert, back accessible, only unlock criteria')
 page.locator('[data-action=settings]:visible').first.click();page.locator('#setting-voice').select_option('guitar-driven');page.locator('[data-action=preview-voice]').click();assert page.evaluate('JSON.parse(localStorage.getItem("fretboard-trainer:settings")).voice')=='guitar-driven'
 page.locator('[data-action=install-help]').click();assert page.locator('.install-steps li').count()==3;page.locator('.install-guide button').click()
 checks.append('distorted voice selectable; iPhone install guide opens and closes')
 page.route('**/update.json',lambda route:route.fulfill(json={'version':'0.24.0','url':'./'}));page.reload();page.wait_for_selector('.update-dialog[open]');before=page.evaluate('localStorage.getItem("fretboard-trainer:pilot:stable")');page.locator('[data-update=later]').click();page.locator('[data-action=stats]:visible').first.click();page.wait_for_timeout(200);assert page.locator('.update-dialog[open]').count()==0;assert page.evaluate('localStorage.getItem("fretboard-trainer:pilot:stable")')==before;page.reload();page.wait_for_selector('.update-dialog[open]');page.screenshot(path=str(OUT/'update.png'));page.locator('[data-update=later]').click()
 checks.append('update can be declined; no data change; offered again on reload')
 ctx.close()
 # A genuinely partial open-string achievement must lead to the second activity.
 ctx=b.new_context();page=ctx.new_page();page.set_default_timeout(7000);page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE)
 page.evaluate('''async()=>{const {makeProfile}=await import('./core.js'),{pilotPlan}=await import('./pilot.js'),{initialState}=await import('./state.js'),{simulatedCompletion}=await import('./debug-mode.js');const profile=makeProfile('guitar6'),store=simulatedCompletion(profile,pilotPlan(profile));store.profiles[profile.key].attempts=store.profiles[profile.key].attempts.filter(a=>a.activity==='opens');store.achievements=[];localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),beginnerGuide:true,profile}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(store));}''');page.reload();page.locator('[data-action=achievements]:visible').first.click();page.locator('[data-success-action=try][data-id=open-strings]').first.click();assert snap(page)['session']['activity']=='opens-find';checks.append('partial challenge routes to opens-find')
 ctx.close();b.close()
assert not errors,errors
print(json.dumps({'checks':checks,'pageErrors':errors},ensure_ascii=False))
