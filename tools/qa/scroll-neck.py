from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0].replace('betaCatalog(profile)','betaCatalog(profile,{full:true})'),h);h['BASE']='http://localhost:4173/'
out=Path(os.environ.get('ADH_SCROLL_QA_OUTPUT','work/scroll-neck'));out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',has_touch=True,is_mobile=True,viewport={'width':390,'height':844});q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)))
 for w,hgt in [(320,568),(390,844),(844,390),(1440,900)]:
  print(w,hgt,flush=True);q.set_viewport_size({'width':w,'height':hgt});h['launch'](q,'c24s1-note-4-find');neck=q.locator('#pilot-neck');scrollable=neck.evaluate('e=>e.scrollWidth>e.clientWidth+100');assert q.locator('.long-position-pad:visible').count()==0
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  widths=q.locator('[data-pilot-string="0"] rect:first-child').evaluate_all('es=>es.map(e=>e.getBoundingClientRect().width)');assert min(widths)>=39.9,(w,min(widths))
  before=h['snap'](q)['session']['index']
  if scrollable:
   # Scroll position survives a correct response, and scrolling never submits an answer.
   neck.evaluate('e=>e.scrollLeft=e.scrollWidth-e.clientWidth');before=h['snap'](q)['session']['index'];q.wait_for_timeout(80);assert h['snap'](q)['session']['index']==before
   # Native touch pan, from the far end towards the nut.
   box=neck.bounding_box();cdp=c.new_cdp_session(q);x=box['x']+box['width']*.3;y=box['y']+box['height']*.45
   def t(kind,x=None):cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[] if x is None else [{'x':x,'y':y}]})
   left=neck.evaluate('e=>e.scrollLeft');t('touchStart',x)
   for dx in [12,35,70,100]:t('touchMove',x+dx);q.wait_for_timeout(20)
   t('touchEnd');q.wait_for_timeout(160);assert neck.evaluate('e=>e.scrollLeft')<left,(w,'touch pan');assert h['snap'](q)['session']['index']==before
   # Desktop grab also scrolls without a wrong answer.
   neck.evaluate('e=>e.scrollLeft=400');q.mouse.move(box['x']+80,y);q.mouse.down();q.mouse.move(box['x']+180,y,steps=8);q.mouse.up();q.wait_for_timeout(70);assert neck.evaluate('e=>e.scrollLeft')<400;assert h['snap'](q)['session']['index']==before
  q.locator('[data-pilot-action=toggle-positions]:visible').first.click();assert q.locator('.long-position-pad:visible').count()==1
  target=h['snap'](q)['session']['queue'][before]['target'];q.locator('.long-position-pad [data-fret="'+str(target['fret'])+'"]').click();assert len(h['snap'](q)['session']['events'])==1
  assert q.locator('.long-position-pad:visible').count()==1
  q.locator('[data-pilot-action=toggle-positions]:visible').first.click()
  target=h['snap'](q)['session']['queue'][1]['target'];h['tap'](q,target['string'],target['fret']);assert len(h['snap'](q)['session']['events'])==2
  q.screenshot(path=str(out/f'corde24-{w}.png'));checks.append([w,hgt])
 # All strings remain visible, including in a mixed activity.
 q.set_viewport_size({'width':844,'height':390});h['launch'](q,'mix24-mix-10-find','guitar8');assert q.locator('.pilot-axis-string').count()==8
 q.locator('[data-pilot-action=toggle-positions]:visible').first.click();target=h['snap'](q)['session']['queue'][0]['target'];q.locator('.position-grid-row [data-string="'+str(target['string'])+'"][data-fret="'+str(target['fret'])+'"]').click();assert len(h['snap'](q)['session']['events'])==1
 q.locator('[data-pilot-action=toggle-positions]:visible').first.click();toggle=q.locator('.position-toggle-slot').bounding_box();assert toggle['width']>200;q.screenshot(path=str(out/'melange24.png'))
 # Naming questions keep their stimulus visible, without affecting finding questions.
 h['launch'](q,'c24s1-note-4');seen_far=False
 for i in range(8):
  q.wait_for_timeout(70);target=h['snap'](q)['session']['queue'][i]['target'];v=q.locator('#pilot-neck').bounding_box();dot=q.locator('.pilot-marker.tone-neutral').bounding_box();assert dot and dot['x']>=v['x']-1 and dot['x']+dot['width']<=v['x']+v['width']+1
  seen_far|=target['fret']>=12
  q.locator('[data-note="'+str(target['midi']%12)+'"]').click()
 assert seen_far
 # Existing 0–12 necks keep their fitted, non-scrolling layout.
 h['launch'](q,'cs1-note-4-find');assert q.locator('.is-scroll-neck').count()==0;assert q.locator('#pilot-neck').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'layouts':checks,'native_pan':True,'mouse_grab':True,'no_drag_answers':True,'optional_buttons':True,'direct_neck_tap':True,'mixed_optional_grid':True,'naming_stimulus_visible':True,'no_change_0_12':True,'errors':errors},indent=2));b.close()
