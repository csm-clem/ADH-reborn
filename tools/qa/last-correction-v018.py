from practice_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':375,'height':812});practice(page,'opens');count=len(snap(page)['session']['queue'])
 for i in range(count-1):
  q=snap(page)['session']['queue'][i];page.locator(f'[data-note="{q["target"]["midi"]%12}"]').dispatch_event('click')
 q=snap(page)['session']['queue'][-1];bad=next(n for n in [0,2,4,5,7,9,11] if n!=q['target']['midi']%12);page.locator(f'[data-note="{bad}"]').dispatch_event('click');dot=page.locator('.answer-echo').last.locator('.echo-dot').first
 center=lambda box:(box['x']+box['width']/2,box['y']+box['height']/2)
 before=center(dot.bounding_box());page.wait_for_timeout(350);assert not page.locator('.score-display').count();assert float(page.locator('.echo-label').last.evaluate('e=>getComputedStyle(e).opacity'))>.95;page.wait_for_timeout(350);after=center(dot.bounding_box());assert max(abs(a-b) for a,b in zip(before,after))<.2,(before,after);page.wait_for_selector('.score-display');assert snap(page)['attempts'][-1]['events'][-1]['correct'] is False;assert len(snap(page)['attempts'][-1]['events'])==count;print(json.dumps({'last_error_readable_before_result':True,'zoom_center_stable':True,'no_duplicate_final_answer':True}));b.close()
