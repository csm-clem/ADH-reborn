"""Behaviour contracts on the real Arcade and Parcours controllers."""
from pathlib import Path
from playwright.sync_api import sync_playwright
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);errors=[]
 for mode in ['arcade','course']:
  q=b.new_page(viewport={'width':390,'height':844},service_workers='block');q.on('pageerror',lambda e:errors.append(str(e)))
  if mode=='course':h['launch'](q,'mix-4')
  else:
   h['seed'](q);q.locator('[data-action=arcade]:visible').first.click();q.locator('[data-mode=zones-natural]').click();q.wait_for_selector('.arcade-ready',state='detached');q.wait_for_timeout(100)
  q.clock.install();q.clock.pause_at(q.evaluate('new Date(Date.now()+1000).toISOString()'))
  attr='data-arcade-action' if mode=='arcade' else 'data-pilot-action'
  q.keyboard.press('Escape');assert q.locator(f'[{attr}="resume"], [{attr}="resume-pause"]').count()>0
  q.clock.run_for(5000)
  if mode=='arcade':assert '0' in q.locator('.arcade-hud').inner_text()
  else:assert not h['snap'](q)['session']['events']
  sound=q.locator(f'.shared-game-hud [{attr}=mute]');sound.click();assert sound.evaluate('e=>e===document.activeElement');pressed=sound.get_attribute('aria-pressed');sound.click();assert sound.get_attribute('aria-pressed')!=pressed
  q.keyboard.press('Escape');assert q.locator(f'.shared-game-hud [{attr}=pause]').evaluate('e=>e===document.activeElement')
  restart='replay' if mode=='arcade' else 'restart';q.locator(f'.shared-game-hud [{attr}={restart}]').click();q.clock.run_for(2500)
  assert q.locator('.shared-game-hud').count()==1
  if mode=='course':assert h['snap'](q)['session']['index']==0
  else:assert q.locator('.arcade-hud strong').first.inner_text()=='0'
  q.close()
 assert not errors,errors;b.close()
print('Real controls passed: Escape pause/resume, paused time, sound state, focus restoration and replay in both modes.')
