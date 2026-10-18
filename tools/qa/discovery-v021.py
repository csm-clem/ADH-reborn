from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);errors=[]
 for instrument in ['guitar6','guitar7','guitar8','bass4','bass5','bass6']:
  c=b.new_context(viewport={'width':375,'height':812});page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page,instrument,'note-4');page.locator('.lesson-row[data-module="note-4"]').click();dismiss_help(page)
  for w,h in [(320,480),(375,812),(844,390),(568,320),(1280,720)]:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(250)
   result=page.evaluate('''()=>{const b=document.querySelector('[data-pilot-action=practice]'),r=b.getBoundingClientRect(),p=document.querySelector('.answer-workspace').getBoundingClientRect();return {scroll:document.documentElement.scrollHeight>innerHeight+1,outside:r.bottom>innerHeight||r.right>innerWidth,belowPanel:r.bottom>p.bottom+1}}''')
   if any(result.values()):page.screenshot(path=str(OUT/'discovery-layout-fail.png'));raise AssertionError((instrument,w,h,result))
  c.close()
 assert not errors,errors;print(json.dumps({'discovery_counter_and_cta_six_instruments_five_sizes':True,'errors':errors}));b.close()
