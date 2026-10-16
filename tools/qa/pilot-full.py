from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':844,'height':390},reduced_motion='reduce');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);page.get_by_role('button',name='C’est parti').click()
 ids=page.locator('.lesson-row[data-module]').evaluate_all('els=>els.map(e=>e.dataset.module)')
 for ident in ids:
  page.locator('.lesson-row[data-module="'+ident+'"]').click();complete(page)
  assert page.locator('.score-display').count()==1
  print(ident,'ok',flush=True)
  page.locator('[data-pilot-action="home"]').click()
 data=snap(page);assert len(data['attempts'])==len(ids);assert data['session']==None
 assert not errors,errors
 print(json.dumps({'all_pilot_activities':len(ids),'no_speed_gate':True,'no_duplicate_attempts':True,'errors':errors}));b.close()
