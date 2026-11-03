"""Approved real launches: identical timeline, separate palettes, active-time guards."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
out=Path('work/launch-integrated');out.mkdir(parents=True,exist_ok=True)
read="""()=>{const s=document.querySelector('.approved-launch'),p=s.querySelector('.launch-panel'),t=s.querySelector('.launch-message');return {panel:+p.style.opacity,y:p.style.transform,text:+t.style.opacity,scale:t.style.transform,color:getComputedStyle(t).color,bg:getComputedStyle(p).backgroundImage,old:+s.querySelector('.launch-before').style.opacity};}"""
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);errors=[];checks=[]
 for mode in ['arcade','course']:
  q=b.new_page(viewport={'width':390,'height':844},service_workers='block');q.on('pageerror',lambda e:errors.append(str(e)))
  h['seed'](q,'guitar6','mix-4');q.clock.install();q.clock.pause_at(q.evaluate('new Date().toISOString()'))
  if mode=='arcade':
   q.locator('.mobile-nav [data-action=arcade]').click();q.locator('[data-mode=zones-natural]').click()
  else:
   q.locator('.chapter-options summary').click();q.locator('[data-module=mix-4][data-pilot-action=start]').click()
   for _ in range(5):
    if not q.locator('[data-pilot-action=help-next]').count():break
    q.locator('[data-pilot-action=help-next]').click()
  assert q.locator('.approved-launch').count()==1
  q.clock.run_for(100);f=q.evaluate(read);assert 0<f['panel']<1 and f['color']=='rgb(255, 255, 255)',f
  assert ('248, 167, 68' if mode=='arcade' else '87, 171, 207') in f['bg'],f
  assert q.locator('.launch-next[inert]').count()==1 and q.locator('.launch-before[inert]').count()==1
  assert q.locator('.launch-before [data-pilot-action],.launch-before [data-arcade-action],.rgb-layer').count()==0
  q.clock.run_for(400);f=q.evaluate(read);assert f['panel']==1 and f['text']==1 and f['old']==0,f
  if mode=='arcade':
   marker=q.locator('.launch-next .neck-point').get_attribute('cx')
   q.locator('.launch-next [data-arcade-answer]').first.evaluate('e=>e.click()')
   assert q.locator('.arcade-hud strong').first.inner_text()=='0'
   q.locator('.launch-tools [data-arcade-action=pause]').click()
  else:
   identity=h['snap'](q)['session']['queue'][0]['id']
   q.locator('.launch-next [data-pilot-action=note]').first.evaluate('e=>e.click()')
   assert not h['snap'](q)['session']['events'] and h['snap'](q)['session']['activeMs']==0
   q.locator('.launch-tools [data-pilot-action=pause]').click()
  q.clock.run_for(20);frozen=q.evaluate(read);q.clock.run_for(3000);assert q.evaluate(read)==frozen,(mode,frozen,q.evaluate(read))
  q.locator('.approved-launch > .pilot-pause-layer .button.primary').click()
  mute=q.locator('.launch-tools [data-arcade-action=mute],.launch-tools [data-pilot-action=mute]');mute.click();assert q.evaluate(read)==frozen,(mode,frozen,q.evaluate(read))
  q.clock.run_for(1100);f=q.evaluate(read);assert 0<f['text']<1,f
  q.screenshot(path=str(out/f'{mode}-fade.png'))
  q.clock.run_for(400);f=q.evaluate(read);assert f['y']!='translateY(0%)' and f['text']>0,f
  q.screenshot(path=str(out/f'{mode}-exit.png'))
  q.clock.run_for(450);assert q.locator('.approved-launch').count()==0
  if mode=='arcade':assert q.locator('.neck-point').get_attribute('cx')==marker
  else:
   assert h['snap'](q)['session']['queue'][0]['id']==identity
   s=h['snap'](q)['session'];target=s['queue'][0]['target']['midi']%12
   # mix may ask for a position: use the live target in either response mode.
   if s['queue'][0]['mode']=='name':q.locator(f'[data-pilot-action=note][data-note="{target}"]').click()
   else:h['tap'](q,s['queue'][0]['target']['string'],s['queue'][0]['target']['fret'])
   event=h['snap'](q)['session']['events'][0];assert event['ms']<1000,event
  checks.append({'mode':mode,'palette':f['bg'],'pause_and_input_guards':True});q.close()
 # Same real launch also respects reduced motion and desktop sizing.
 q=b.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce',service_workers='block');q.on('pageerror',lambda e:errors.append(str(e)));h['seed'](q);q.clock.install();q.clock.pause_at(q.evaluate('new Date().toISOString()'));q.locator('.sidebar [data-action=arcade]').click();q.locator('[data-mode=zones-natural]').click();q.clock.run_for(2100)
 f=q.evaluate(read);assert f['scale']=='scale(1)' and f['y']=='translateY(0%)' and 0<f['panel']<1,f
 assert q.locator('.launch-before').evaluate('e=>e.style.filter')=='none'
 assert q.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 q.clock.run_for(400);assert q.locator('.approved-launch').count()==0
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'checks':checks,'reduced_motion':True,'errors':errors},indent=2));b.close()
print('Integrated launches passed: orange/blue, white text, full-page motion, long fade, pause/resume/mute, inert next game, timer exclusion, reduced motion.')
