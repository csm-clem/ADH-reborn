from pathlib import Path
from playwright.sync_api import sync_playwright
import json
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0].replace('betaCatalog(profile)','betaCatalog(profile,{full:true})'),h)
h['BASE']='http://localhost:4173/'
out=Path('work/roadmap');out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',viewport={'width':844,'height':390},is_mobile=True,has_touch=True);page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 for instrument,activity in [('guitar6','z2-note-4-find'),('guitar8','z6-note-4-find'),('bass5','cs5-mix-11'),('guitar6','c24s6-note-4-find'),('guitar6','duo1-mix-4-find'),('bass6','mix24-mix-10-find')]:
  print(instrument,activity,flush=True);h['launch'](page,activity,instrument);q=h['snap'](page)['session']['queue'][0];assert q['target']['midi']==h['snap'](page)['profile']['tuning'][q['target']['string']]+q['target']['fret']
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  if q['mode']=='name':page.locator('[data-note="'+str(q['target']['midi'] if q['answerKind']=='pitch' else q['target']['midi']%12)+'"]').click()
  else:h['tap'](page,q['target']['string'],q['target']['fret'])
  assert len(h['snap'](page)['session']['events'])==1
  checks.append([instrument,activity]);page.screenshot(path=str(out/(activity+'.png')))
 # Discovery: every required pitch can be found in the upper zone, then practice begins.
 h['launch'](page,'z2-note-4-discover');assert page.locator('[data-pilot-action=practice]').count()==1
 assert not errors,errors
 (out/'browser.json').write_text(json.dumps({'checks':checks,'errors':errors},indent=2));b.close()
