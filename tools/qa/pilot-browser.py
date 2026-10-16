from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);page.evaluate('''async()=>{const c=await import('./core.js');const s=c.initialState();s.profile=c.makeProfile('guitar6');s.progress[s.profile.key]={'s0-first':{stars:5}};s.stats=[{key:s.profile.key,lesson:'s0-first',at:1,answers:[{target:{string:0,fret:0,midi:40},mode:'name',correct:true,ms:500}]}];localStorage.setItem('adh-reborn:state:v1',JSON.stringify(s))}''');page.reload()
 legacy=page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',LEGACY)
 assert page.locator('.lesson-row[data-module="degree-5"]').is_disabled()
 page.locator('.lesson-row[data-module="opens"]').click();page.screenshot(path=str(OUT/'discovery-v06.png'),full_page=True)
 complete(page,wrong=True,hint=True)
 data=snap(page);assert len(data['attempts'])==1 and data['session']==None
 attempt=data['attempts'][0];assert attempt['events'][0]['correct']==False;assert any(e['retry'] for e in attempt['events']);assert any(e['aids'] for e in attempt['events'])
 assert data['later'];page.screenshot(path=str(OUT/'result-v06.png'),full_page=True)
 page.locator('[data-pilot-action="home"]').click();assert page.locator('.lesson-row[data-module="degree-5"]').is_enabled()
 page.locator('.lesson-row[data-module="degree-5"]').click();page.locator('[data-pilot-action="discovery-reveal"]').click();assert page.locator('.pilot-legend').count()==1
 page.set_viewport_size({'width':844,'height':390});page.screenshot(path=str(OUT/'quinte-v06.png'),full_page=True)
 a=page.locator('.neck-panel').bounding_box();z=page.locator('.answer-workspace').bounding_box();assert abs(a['height']-z['height'])<1,(a,z)
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 complete(page);assert len(snap(page)['attempts'])==2
 page.locator('[data-pilot-action="home"]').click();page.set_viewport_size({'width':375,'height':812})
 for width,height in [(320,740),(375,812),(768,1024),(1280,800)]:
  page.set_viewport_size({'width':width,'height':height});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.locator('[data-action="stats"]:visible').first.click();assert page.locator('.pilot-results').count()==1
 page.locator('[data-action="settings"]:visible').first.click()
 with page.expect_download() as d:page.locator('[data-action="export"]').click()
 d.value.save_as(str(OUT/'backup.json'));backup=json.load(open(str(OUT/'backup.json')));assert 'pilotBackup' in backup and len(backup['pilotBackup']['profiles'][legacy['profile']['key']]['attempts'])==2
 current=page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',LEGACY);assert current['progress']==legacy['progress'] and current['stats']==legacy['stats']
 page.locator('[data-action="home"]:visible').first.click();page.locator('[data-action="legacy"]').click();assert page.locator('.lesson-row[data-lesson="s0-first"]').count()==1
 # Offline fresh boot includes both pilot code and assets.
 page.evaluate('navigator.serviceWorker.ready');page.reload();page.wait_for_function('navigator.serviceWorker.controller!==null');c.set_offline(True);page.reload();assert page.locator('.pilot-hero').count()==1
 page.locator('.lesson-row[data-module="degree-4"]').click();assert page.locator('.pilot-game').count()==1
 assert not errors,errors
 print(json.dumps({'complete_open_activity':True,'error_retry_and_reload_no_duplicate':True,'aid_recorded':True,'separate_directions':True,'motif_without_self_evaluation':True,'legacy_progress_preserved':True,'backup_includes_both':True,'landscape_equal_height':True,'mobile_no_overflow':True,'offline':True,'errors':errors}));b.close()
