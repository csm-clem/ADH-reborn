from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':844,'height':390},reduced_motion='reduce');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);setup_standard(page);enable_fast_clock(page)
 ids=page.locator('.lesson-row[data-module]').evaluate_all('els=>els.map(e=>e.dataset.module)')
 for ident in ids:
  page.locator('.lesson-row[data-module="'+ident+'"]').click();complete(page)
  assert page.locator('.score-display').count()==1
  assert snap(page)['attempts'][-1]['passed'] is True
  primary=page.locator('.result-card>.primary');assert primary.inner_text()==('Leçon suivante' if ident!=ids[-1] else 'Retour au parcours')
  print(ident,'ok',flush=True)
  page.locator('[data-pilot-action="home"]').last.click()
 data=snap(page);assert len(data['attempts'])==len(ids);assert data['session']==None
 assert not errors,errors
 print(json.dumps({'all_pilot_activities':len(ids),'no_speed_gate':True,'at_least_twenty_questions':all(len([e for e in a['events'] if not e['retry']])>=20 for a in data['attempts']),'no_duplicate_attempts':True,'errors':errors}));b.close()
