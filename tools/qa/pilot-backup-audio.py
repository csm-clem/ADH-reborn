from pilot_support import *
from pathlib import Path
import json
LEGACY='adh-reborn:state:v1';KEY='adh-reborn:pilot:v1'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');c.add_init_script('''window.__audio=[];const original=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){window.__audio.push({state:this.context.state,when:args[0],samples:this.buffer?.length,max:Math.max(...this.buffer.getChannelData(0).slice(0,3000).map(Math.abs))});return original.apply(this,args)};''');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
 page.goto(BASE);page.get_by_role('button',name='C’est parti').click();page.locator('[data-action="settings"]:visible').first.click();page.locator('#import-file').set_input_files(str(OUT/'backup.json'))
 page.wait_for_selector('.pilot-hero');legacy_before=page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',LEGACY);pilot_before=page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',KEY);assert len(next(iter(pilot_before['profiles'].values()))['attempts'])==2
 # An invalid pilot backup must leave both stores intact.
 bad=json.load(open(str(OUT/'backup.json')));next(iter(bad['pilotBackup']['profiles'].values()))['attempts'][0]['events'][0]['target']['midi']=99
 Path(str(OUT/'invalid.json')).write_text(json.dumps(bad));page.locator('[data-action="settings"]:visible').first.click();page.locator('#import-file').set_input_files(str(OUT/'invalid.json'));page.wait_for_selector('.toast')
 assert page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',LEGACY)==legacy_before;assert page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',KEY)==pilot_before
 page.locator('[data-action="home"]:visible').first.click();page.locator('.lesson-row[data-module="degree-5"]').click();page.locator('[data-pilot-action="discovery-reveal"]').click();page.locator('[data-pilot-action="replay"]').click();page.wait_for_function('window.__audio.length>=2');assert all(v['state']=='running' and v['max']>0 for v in page.evaluate('window.__audio'))
 tap(page,1,2);page.locator('[data-pilot-action="practice"]').click();page.wait_for_selector('.pilot-count',state='detached',timeout=5000);page.wait_for_function('window.__audio.length>=4')
 n=page.evaluate('window.__audio.length');page.locator('[data-pilot-action="mute"]').click();page.locator('#pilot-neck [role="button"]').first.click();page.wait_for_timeout(100);assert page.evaluate('window.__audio.length')==n
 page.locator('[data-pilot-action="mute"]').click()
 # Keyboard name selection can continue directly into the next task.
 value=page.evaluate('(k)=>{const d=Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0];return d.session.queue[d.session.index].target.midi%12}',KEY)
 index=snap(page)['session']['index'];page.locator(f'[data-pilot-action="note"][data-note="{value}"]').focus();page.keyboard.press('Enter');assert page.locator('.feedback.correct').count()==1;wait_advance(page,index)
 while snap(page)['session']['queue'][snap(page)['session']['index']]['mode']=='name':
  s=snap(page)['session'];q=s['queue'][s['index']];page.locator(f'[data-note="{q["target"]["midi"]%12}"]').click();wait_advance(page,s['index'])
 # The coordinate-button alternative must keep native keyboard activation.
 q=page.evaluate('(k)=>{const d=Object.values(JSON.parse(localStorage.getItem(k)).profiles)[0];return d.session.queue[d.session.index]}',KEY)
 assert q['mode']=='find'
 page.locator('.pilot-position-buttons summary').click()
 cell=page.locator(f'[data-pilot-action="position"][data-string="{q["target"]["string"]}"][data-fret="{q["target"]["fret"]}"]');cell.focus();page.keyboard.press('Enter');assert page.locator('.feedback.correct').count()==1
 wait_advance(page,snap(page)['session']['index'])
 # Corrupt local pilot state is preserved, rather than overwritten by a fresh session.
 page.locator('[data-pilot-action="pause"]').last.click();page.locator('[data-pilot-action="home"]').click();page.evaluate('(k)=>localStorage.setItem(k,"{broken")',KEY);page.reload();assert page.locator('[role="alert"]').count()>=1;page.locator('.lesson-row[data-module="opens"]').click();page.locator('[data-pilot-string="0"][data-pilot-fret="0"]').click();assert page.evaluate('(k)=>localStorage.getItem(k)',KEY)=='{broken'
 page.locator('[data-pilot-action="pause"]').last.click();page.locator('[data-pilot-action="home"]').click();page.locator('[data-action="settings"]:visible').first.click()
 with page.expect_download() as d:page.locator('[data-action="export"]').click()
 d.value.save_as(str(OUT/'recovery-export.json'));export=json.load(open(str(OUT/'recovery-export.json')));assert next(iter(export['pilotBackup']['profiles'].values()))['session']['explored']==['0:0']
 assert not errors,errors
 print(json.dumps({'import_both_stores':True,'reject_corrupt_backup_without_mutation':True,'scheduled_audio_non_silent':True,'mute':True,'keyboard_answer_and_continue':True,'coordinate_buttons_keyboard':True,'corrupt_local_store_preserved':True,'in_memory_recovery_export':True,'errors':errors}));b.close()
