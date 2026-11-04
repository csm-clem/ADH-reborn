from pathlib import Path
from playwright.sync_api import sync_playwright
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);q=b.new_page(viewport={'width':390,'height':844},service_workers='block');errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 for mode in ['arcade','pilot']:
  if mode=='pilot':h['launch'](q,'mix-4')
  else:
   h['seed'](q);q.locator('[data-action=arcade]:visible').first.click();q.locator('[data-mode=zones-natural]').click();assert q.locator('.launch-tools').count()==0;q.wait_for_selector('.approved-launch',state='detached')
  attr='data-arcade-action' if mode=='arcade' else 'data-pilot-action'
  assert q.locator('.hud-tools button').count()==3
  assert q.locator('.hud-tools button').evaluate_all('(es)=>es.map(e=>e.getAttribute("aria-label"))')[1]=='Réglages'
  q.locator(f'[{attr}=game-settings]').click();d=q.locator('dialog[open]');assert d.count()==1
  d.locator('[data-pref=theme]').select_option('paper');assert q.locator('html').get_attribute('data-theme')=='paper'
  d.locator('[data-pref=notation]').select_option('latin');d.get_by_role('button',name='Fermer').click()
  q.locator(f'.hud-tools [{attr}=pause]').click();pause=q.locator('.arcade-pause' if mode=='arcade' else '.pause-card');assert pause.locator('button').count()==3
  pause.get_by_role('button',name='Rejouer',exact=True).click();assert q.locator('.approved-launch').count()==1;assert q.locator('.launch-tools').count()==0;q.wait_for_selector('.approved-launch',state='detached')
  q.screenshot(path=f'work/{mode}-new-hud.png')
 h['finish'](q)
 q.locator('[data-result-help=stars]').click();assert '3 étoiles' in q.locator('dialog').inner_text();q.get_by_role('button',name='Fermer',exact=True).click()
 q.locator('[data-result-help=record]').click();q.get_by_role('button',name='Fermer',exact=True).click()
 q.locator('[data-pilot-action=home]').first.click()
 # Cancel instrument changes restores the profile.
 q.set_viewport_size({'width':1366,'height':900});q.wait_for_timeout(400);q.locator('.instrument-badge').click();assert q.locator('[data-setup-action=cancel]').count()==1;q.locator('[data-setup-action=cancel]').click();assert q.locator('.settings-content').count()==1
 assert not errors,errors
 b.close()
print('HUD, settings, themes, replay during pause, transition without controls and setup cancellation passed')
