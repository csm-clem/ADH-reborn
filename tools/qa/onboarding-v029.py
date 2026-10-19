from pathlib import Path
from playwright.sync_api import sync_playwright
import json
results=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 for instrument in ['guitar6','guitar7','guitar8','bass4','bass5','bass6']:
  for w,h in [(320,568),(844,390)]:
   page.set_viewport_size({'width':w,'height':h});page.goto('http://localhost:4173/');page.evaluate('localStorage.clear()');page.reload();page.locator('#instrument').select_option(instrument);page.locator('#setup-form button[type=submit]').click();page.locator('#notation').select_option('latin');page.locator('#setup-form button[type=submit]').click();page.locator('#tuning-preset').select_option('custom');page.wait_for_timeout(220)
   for _ in range(12):
    bad=page.evaluate('''()=>[...document.querySelectorAll('.setup-wizard button,.setup-wizard select')].filter(e=>e.checkVisibility()&&e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {label:e.getAttribute('aria-label')||e.textContent,top:r.top,bottom:r.bottom,right:r.right,left:r.left}}).filter(r=>r.top<-.5||r.left<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5)''')
    assert not bad,(instrument,w,bad)
    nxt=page.locator('[data-setup-action=page][data-delta="1"]')
    if not nxt.is_visible() or nxt.is_disabled():break
    nxt.click();page.wait_for_timeout(100)
   note=page.locator('[data-setup-action=listen-string][data-string]').first;string=int(note.get_attribute('data-string'));before=note.inner_text()
   page.locator(f'[data-setup-action=adjust][data-string="{string}"][data-delta="1"]').click();assert page.locator(f'[data-setup-action=listen-string][data-string="{string}"]').inner_text()!=before
   page.locator('[data-setup-action=adjust][data-delta="-1"]:not([data-string])').click();page.locator('#setup-form button[type=submit]').click()
   state=page.evaluate("JSON.parse(localStorage.getItem('fretboard-trainer:settings'))");assert state['profile']['instrumentId']==instrument and state['notation']=='latin';assert len(state['profile']['tuning'])==int(instrument[-1]);results.append({'instrument':instrument,'viewport':[w,h],'custom_editor_pages_fit':True,'per_string_and_global_adjustment':True,'profile_saved':True})
 assert not errors,errors
 Path('docs/v0.29/verification-onboarding-personnalise.json').write_text(json.dumps({'checks':results,'errors':errors},ensure_ascii=False,indent=2));print(json.dumps({'custom_configurations':len(results),'errors':errors}));b.close()
