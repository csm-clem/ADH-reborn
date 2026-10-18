"""User-facing v0.21 regressions: controls, exit context, discovery lock, collection and debug isolation."""
from practice_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':1280,'height':800});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);page.evaluate('localStorage.clear()');page.reload();page.wait_for_timeout(300)
 for w,h in [(1280,800),(1920,1080),(768,1024),(375,812),(320,568),(844,390),(568,320),(240,320)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(250)
  result=page.evaluate('''()=>{const box=s=>document.querySelector(s).getBoundingClientRect(),a=box('h1'),d=box('.landing-description'),n=box('.landing-neck'),f=box('.landing-features'),svg=box('.landing-neck svg');return {aligned:!d.width||Math.abs(a.left-d.left)<1,contained:n.width===0||svg.bottom<=n.bottom+1,overlap:n.width>0&&f.width>0&&n.bottom>f.top+1,scroll:document.documentElement.scrollHeight>innerHeight+1}}''');assert result['aligned'] and result['contained'] and not result['overlap'] and not result['scroll'],(w,h,result)
  if w in [1280,375,844]:page.screenshot(path=str(OUT/f'onboarding-{w}.png'))
 page.set_viewport_size({'width':375,'height':812});setup_standard(page)
 # Exit returns to the course list at its previous scroll position, directly, from either control.
 page.locator('.lesson-row[data-module="note-4"]').scroll_into_view_if_needed();y=page.evaluate('scrollY');page.locator('.lesson-row[data-module="note-4"]').click();page.locator('[data-pilot-action="home"]').click();assert page.locator('.lesson-row').count()==50;assert abs(page.evaluate('scrollY')-y)<2
 page.evaluate("document.addEventListener('pointerdown',()=>window.qaCourseY=scrollY,{once:true,capture:true})");page.locator('.lesson-row[data-module="note-4"]').click();y=page.evaluate('qaCourseY');dismiss_help(page);page.locator('[data-pilot-action="exit"]').click();assert page.locator('.lesson-row').count()==50;assert not page.locator('.pause-card').count();assert abs(page.evaluate('scrollY')-y)<2,(y,page.evaluate('scrollY'))
 # Every position found => neck + accessible grid freeze, but the CTA remains available.
 page.locator('.lesson-row[data-module="note-4"]').click();dismiss_help(page)
 focus=page.evaluate('''async k=>{const {pilotPlan,practiceActivities}=await import('./pilot.js'),d=Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0];return practiceActivities(pilotPlan(d.profile)).find(a=>a.id==='note-4').focus}''',KEY)
 for x in focus:tap(page,x['string'],x['fret'])
 assert page.locator('.discovery-progress').inner_text().endswith('Tous retrouvés !');before=json.dumps(snap(page)['session'],sort_keys=True)
 page.locator('[data-pilot-action="toggle-positions"]').click();assert page.locator('[data-pilot-action="position"]:enabled').count()==0
 page.locator('[data-pilot-action="position"]').first.dispatch_event('click');assert json.dumps(snap(page)['session'],sort_keys=True)==before
 page.screenshot(path=str(OUT/'discovery-complete.png'));page.locator('[data-pilot-action="exit"]').click();assert page.locator('.lesson-row').count()==50
 # Native fullscreen changes both label and SVG, including external exit/Escape events.
 page.locator('[data-action="settings"]').last.click();fs=page.locator('[data-action="fullscreen"]');outside=fs.locator('svg').inner_html();fs.click();page.wait_for_function('!!document.fullscreenElement');page.wait_for_function("document.querySelector('[data-action=fullscreen]').textContent.includes('Quitter')");assert fs.inner_text()=='Quitter le plein écran';assert fs.locator('svg').inner_html()!=outside;page.evaluate('document.exitFullscreen()');page.wait_for_function('!document.fullscreenElement');page.wait_for_function("document.querySelector('[data-action=fullscreen]').textContent==='Plein écran'");assert fs.inner_text()=='Plein écran';assert fs.locator('svg').inner_html()==outside
 assert page.locator('.profile-audio svg path').get_attribute('d')=='m9 5 11 7-11 7z';mute=page.locator('#setting-sound');assert mute.get_attribute('class')=='icon-button sound-toggle '
 mute.click();assert page.locator('#setting-sound').get_attribute('aria-pressed')=='true';assert page.locator('.profile-audio').is_disabled();assert 'Coupé' in page.locator('label[for="setting-sound"]').inner_text();page.locator('#setting-sound').click();assert page.locator('.profile-audio').is_enabled()
 # Partial progress is visible next to every card, before simulation.
 page.locator('[data-action="achievements"]').last.click();assert page.locator('.achievement-card').count()==6;assert page.locator('.achievement-progress progress').count()==6;assert all('%' in s for s in page.locator('.achievement-progress strong').all_text_contents());assert any('Réunion de famille' in s for s in page.locator('.achievement-card h2').all_text_contents())
 page.locator('[data-action="settings"]').last.click();real=page.evaluate('(k)=>localStorage.getItem(k)',KEY);page.locator('[data-action="debug"]').click();assert 'Retrouver mes vrais résultats' in page.locator('[data-action="debug"]').inner_text();assert page.evaluate('(k)=>localStorage.getItem(k)',KEY)==real
 page.locator('[data-action="home"]').last.click();assert page.locator('.lesson-symbol.complete').count()==50
 page.locator('[data-action="achievements"]').last.click();counts={}
 for category in ['landmarks','fluency','music']:
  page.locator(f'[data-success-action="category"][data-value="{category}"]').click();assert page.locator('.achievement-card.is-missing').count()==0;assert all(s=='100 %' for s in page.locator('.achievement-progress strong').all_text_contents());counts[category]=page.locator('.achievement-card.is-earned').count()
  if category=='music':assert page.locator('.achievement-card [data-success-action="listen"]').count()==18
  page.screenshot(path=str(OUT/f'collection-{category}.png'),full_page=True)
 assert counts=={'landmarks':6,'fluency':2,'music':20};assert page.evaluate('(k)=>localStorage.getItem(k)',KEY)==real
 page.locator('[data-action="stats"]').last.click();page.screenshot(path=str(OUT/'debug-progress.png'),full_page=True)
 page.locator('[data-action="settings"]').last.click();page.locator('[data-action="debug"]').click();assert page.evaluate('(k)=>localStorage.getItem(k)',KEY)==real;assert not page.locator('.debug-notice').count()
 page.locator('[data-action="home"]').last.click();assert page.locator('.lesson-symbol.complete').count()==0
 page.locator('[data-action="settings"]').last.click();page.locator('[data-action="debug"]').click();page.reload();assert not page.locator('.debug-notice').count();assert page.evaluate('(k)=>localStorage.getItem(k)',KEY)==real
 # Actual live exercise still accepts rapid answers; no pause introduced by the new return path.
 practice(page,'mix-4');q=snap(page)['session']['queue'][0];page.locator(f'[data-note="{q["target"]["midi"]%12}"]').dispatch_event('click');assert snap(page)['session']['index']==1;page.locator('[data-pilot-action="exit"]').click();assert page.locator('.lesson-row').count()==50
 assert not errors,errors
 print(json.dumps({'onboarding_alignment_and_fixed_slot':8,'direct_exit_and_scroll_context':True,'discovery_freezes_neck_and_buttons':True,'fullscreen_native_and_external_exit':True,'global_mute_and_play_icon':True,'achievement_progress_every_card':True,'debug_all_50_exercises':True,'debug_collection':counts,'debug_real_storage_unchanged_and_reload_reset':True,'rapid_answers':True,'errors':errors}));b.close()
