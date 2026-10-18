"""Run with ADH_BASE_URL=http://127.0.0.1:4174/ and a PHP mail capture, never live mail."""
from pilot_support import *
assert BASE.startswith("http://127.0.0.1:4174/"), "This mail test must use the local capture server."
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':375,'height':812});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE);setup_standard(page);page.locator('[data-action="settings"]').last.click()
 assert page.locator('[data-action="debug"]').count()==1
 page.locator('[data-action="report-bug"]').click();assert page.locator('dialog[open]').count()==1;assert 'clement@' not in page.locator('dialog').inner_text();page.fill('#bug-description','court');page.locator('#bug-form [type="submit"]').click();assert page.locator('dialog[open]').count()==1;assert not page.locator('#bug-description').evaluate('e=>e.validity.valid')
 text='Sur mon téléphone, le son ne démarre pas après la rotation.';page.fill('#bug-description',text);page.fill('#bug-reply','test@example.org');sent=[];page.on('request',lambda r:sent.append(r.post_data_json) if r.method=='POST' and '/api/bug-report.php' in r.url else None);page.locator('#bug-form [type="submit"]').click();page.wait_for_selector('dialog .notice');assert len(sent)==1 and sent[0]['description']==text;assert 'clement@' not in json.dumps(sent);page.screenshot(path=str(OUT/'bug-confirmation.png'));page.locator('[data-bug-action="close"]').last.click();assert page.evaluate('document.activeElement.dataset.action')=='report-bug'
 # In-app retry preserves the message on offline and server failure, with no false success.
 page.locator('[data-action="report-bug"]').click();page.fill('#bug-description',text);c.set_offline(True);page.locator('#bug-form [type="submit"]').click();page.wait_for_function('document.querySelector(".bug-error").textContent.length>0');assert page.locator('#bug-description').input_value()==text;assert not page.locator('dialog .notice').count();c.set_offline(False)
 def fail(route):
  if route.request.method=='GET':route.fulfill(status=200,content_type='application/json',body='{"token":"test"}')
  else:route.fulfill(status=503,content_type='application/json',body='{"error":"Le serveur est indisponible. Votre texte est conservé."}')
 page.route('**/api/bug-report.php',fail);page.locator('#bug-form [type="submit"]').click();page.wait_for_function('document.querySelector(".bug-error").textContent.includes("serveur est indisponible")');assert page.locator('#bug-description').input_value()==text
 for w,h in [(320,480),(375,812),(844,390),(1280,720)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(150);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');assert page.locator('dialog[open]').count()==1
 page.set_viewport_size({'width':375,'height':812});page.screenshot(path=str(OUT/'bug-form.png'));page.keyboard.press('Escape');assert not page.locator('dialog').count();page.unroute('**/api/bug-report.php')
 # Existing debug mode is complete, reversible and compatible with v3 musical proofs.
 real=page.evaluate('(k)=>localStorage.getItem(k)',KEY);page.locator('[data-action="debug"]').click();page.locator('input[name=theme][value=accessible]').check();page.locator('[data-action="home"]').last.click();assert page.locator('.lesson-symbol.complete').count()==50
 colors=page.locator('.lesson-symbol.complete').first.evaluate('e=>({background:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color})');assert colors=={'background':'rgb(253, 251, 247)','color':'rgb(51, 54, 56)'},colors;page.screenshot(path=str(OUT/'course-accessible.png'))
 page.locator('[data-action="achievements"]').last.click()
 for cat in ['landmarks','fluency','music']:
  page.locator(f'[data-success-action="category"][data-value="{cat}"]').click();assert page.locator('.achievement-card.is-missing').count()==0
  for w,h in [(280,640),(375,812),(844,390),(1280,720)]:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(150)
   bad=page.locator('.achievement-card.is-earned').evaluate_all('''cards=>cards.filter(c=>{const b=c.querySelector('[data-success-action=try]').getBoundingClientRect(),s=c.querySelector('.achievement-stamp').getBoundingClientRect();return Math.abs((b.top+b.height/2)-(s.top+s.height/2))>2||s.right>c.getBoundingClientRect().right+1}).length''');assert bad==0,(cat,w,h,bad)
  page.set_viewport_size({'width':375,'height':812});page.screenshot(path=str(OUT/f'success-{cat}.png'),full_page=True)
 assert page.evaluate('(k)=>localStorage.getItem(k)',KEY)==real
 # Read actual browser scheduling for every instrument: the reward prefix must match every exact exercise MIDI.
 count=page.evaluate('''async()=>{const {INSTRUMENTS,makeProfile}=await import('./core.js'),{pilotPlan}=await import('./pilot.js'),{melodiesForPlan}=await import('./melodies.js'),{rewardFor}=await import('./reward-music.js');let n=0;for(const i of INSTRUMENTS)for(const m of melodiesForPlan(pilotPlan(makeProfile(i.id))).values()){const lead=rewardFor(m).events.filter(e=>e.velocity===1);if(m.sequence.some((p,i)=>p.midi!==lead[i].midi))throw Error(m.id+' wrong octave');n++;}return n}''');assert count==108
 assert not errors,errors
 print(json.dumps({'in_app_mail_capture':True,'offline_and_server_errors_preserve_text':True,'no_recipient_in_client_payload':True,'dialog_keyboard_and_four_sizes':True,'stamp_same_row_twelve_layouts':True,'accessible_check_colors':colors,'debug_all_successes_and_real_progress_untouched':True,'exact_reward_prefixes_six_instruments':count,'errors':errors}));b.close()
