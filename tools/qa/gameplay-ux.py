"""Instruction-first gameplay, shared neck rendering and real keyboard controls."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
out=Path('work/gameplay-ux');out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',viewport={'width':390,'height':844},has_touch=True);q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)))
 for w,height in [(320,568),(390,844),(667,375),(844,390),(1024,600),(1366,768)]:
  q.set_viewport_size({'width':w,'height':height})
  for activity in ['note-4','note-4-find','cs1-note-4','c24s1-note-4-find']:
   h['launch'](q,activity);q.wait_for_timeout(180)
   boxes=q.evaluate('''()=>{const box=s=>{const b=document.querySelector(s).getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height}};return {question:box('.question-copy'),neck:box('#pilot-neck'),body:box('.game-body')}}''')
   assert boxes['question']['bottom']<=boxes['neck']['y']+2,(activity,w,boxes)
   assert q.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(w,activity)
   assert abs(boxes['neck']['x']+boxes['neck']['width']/2-w/2)<15
   if 'c24' in activity and w<=844:assert q.locator('#pilot-neck').evaluate('e=>e.scrollWidth>e.clientWidth')
   for button in q.locator('.pilot-wheel button').all():
    r=button.bounding_box();assert r and r['x']>=-1 and r['x']+r['width']<=w+1 and (height<=430 or r['y']>=-1 and r['y']+r['height']<=height+1),(w,activity,r)
   q.screenshot(path=str(out/f'{activity}-{w}.png'));checks.append({'layout':activity,'size':[w,height],'instruction_above_hand':True})
 # A 24-fret board must share the same graphic scale as the four-fret instrument.
 q.set_viewport_size({'width':390,'height':844});styles=[]
 for activity in ['note-4-find','c24s1-note-4-find']:
  h['launch'](q,activity);q.wait_for_timeout(150)
  styles.append(q.evaluate('''()=>{const svg=document.querySelector('#pilot-neck svg'),b=svg.getBoundingClientRect(),scale=b.width/svg.viewBox.baseVal.width,lines=[...svg.querySelectorAll('.neck-string')],ys=lines.map(l=>l.getBoundingClientRect().y);return {gap:Math.abs(ys[0]-ys[1]),string:parseFloat(getComputedStyle(lines[0]).strokeWidth)*scale,fret:parseFloat(getComputedStyle(svg.querySelector('.neck-fret:not(.neck-nut)')).strokeWidth)*scale,inlay:parseFloat(svg.querySelector('.neck-inlay').getAttribute('r'))*scale}}'''))
 for k in ['string','fret','inlay','gap']:assert abs(styles[0][k]-styles[1][k])<.8,(k,styles)
 checks.append({'shared_neck_scale':styles})
 # Keyboard: select and play on the board, pause with Escape, retain mute access.
 h['launch'](q,'note-4-find');first=q.locator('#pilot-neck [tabindex="0"]');first.focus();first.press('ArrowRight');assert q.locator('#pilot-neck [data-pilot-fret="1"]:focus').count()==1
 q.keyboard.press('Escape');assert q.locator('.pause-card').count()==1;assert q.locator('[data-pilot-action=resume-pause]:focus').count()==1
 q.locator('[data-pilot-action=mute]').focus();q.keyboard.press('Enter');assert q.locator('[data-pilot-action=mute]:focus').count()==1
 q.keyboard.press('Escape');assert not q.locator('.pause-card').count();assert q.locator('[data-pilot-action=pause]:focus').count()==1;checks.append('keyboard board arrows and Escape pause with reachable mute')
 # The reason for a disabled discovery action follows the actual instrument.
 h['launch'](q,'note-4-discover');assert q.locator('[data-pilot-action=practice]').is_disabled();assert 'emplacement' in q.locator('#discovery-condition').inner_text();checks.append('visible discovery condition')
 # Existing introductory example receives a visual action cue, without a new screen.
 h['seed'](q,'guitar6','note-4');q.evaluate('''()=>{const key='fretboard-trainer:pilot:stable',s=JSON.parse(localStorage.getItem(key));Object.values(s.profiles)[0].seenInstructions=[];localStorage.setItem(key,JSON.stringify(s))}''');q.reload();q.locator('.chapter-options summary').click();q.locator('[data-pilot-action=start][data-module="mix-4"]').click();assert q.locator('.interaction-cue').count()==1;assert 'roue' in q.locator('.interaction-cue').inner_text();checks.append('first-use cue in existing intro')
 q.locator('[data-pilot-action=home]').click();q.locator('[data-action=settings]:visible').first.click();assert q.locator('.keyboard-help').count()==1
 q.locator('[data-action=report-bug]').click();q.wait_for_selector('dialog[open]');q.keyboard.press('Escape');assert not q.locator('dialog[open]').count();assert q.locator('[data-action=report-bug]:focus').count()==1;checks.append('dialog closes and restores keyboard focus')
 q.locator('[data-action=stats]:visible').first.click();cell=q.locator('.progress-cell>summary').first;cell.focus();q.keyboard.press('ArrowRight');assert q.locator('.progress-cell[data-progress-fret="1"]>summary:focus').count()==1;q.keyboard.press('Enter');assert q.locator('.progress-cell[open]').count()>0;checks.append('progress cells support arrows and Enter')
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'checks':checks,'errors':errors,'real_phones_tested':False},indent=2));b.close()
print('Gameplay UX and shared renderer passed.')
