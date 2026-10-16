"""Alternate tunings, transfers, diagnostic and failed-result gating."""
from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);errors=[]
 for instrument,tuning,activity,expected in [('guitar7',None,'degree-5','diminuée'),('guitar6','D2 A2 D3 G3 A3 D4','degree-4','registre disponible'),('guitar7','B1 F#2 B2 E3 A3 C#4 F#4','tuning','préambule')]:
  c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page,instrument,activity,tuning);page.locator(f'.lesson-row[data-module="{activity}"]').click();dismiss_help(page);assert not page.locator('[data-module="workshop-fsharp"]').count()
  if activity=='tuning':
   for string in range(len(snap(page)['profile']['tuning'])):tap(page,string,0)
   page.locator('[data-pilot-action="practice"]').click();dismiss_help(page);page.wait_for_selector('.startup-ring',state='detached');choices=page.locator('.pilot-wheel button').all_text_contents();assert 'F♯' in choices and 'C♯' in choices
  c.close()
 # The transfer draws equal-fret pairs, and the motif repeats the same frets on the other string.
 c=b.new_context(viewport={'width':844,'height':390},reduced_motion='reduce');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page,'guitar6','transfer-4');enable_fast_clock(page);page.locator('.lesson-row[data-module="transfer-4"]').click();dismiss_help(page);page.clock.run_for(40)
 assert 'Même case, même nom' in page.locator('.pilot-explanation').inner_text();assert not page.locator('.transfer-link').count()
 focus=page.evaluate('''async()=>{const {pilotPlan}=await import('./pilot.js'),{PILOT_KEY}=await import('./release.js');const d=Object.values(JSON.parse(localStorage.getItem(PILOT_KEY)).profiles)[0];return pilotPlan(d.profile).modules.find(m=>m.kind==='transfer').focus[0]}''');tap(page,focus['string'],focus['fret']);assert page.locator('.transfer-link').count()==3;page.screenshot(path=str(OUT/'transfer.png'))
 complete(page);assert snap(page)['attempts'][-1]['passed'];c.close()
 # More than ten percent first errors keeps the next activity locked, even after corrections.
 c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();seed(page);enable_fast_clock(page);page.locator('.lesson-row[data-module="opens"]').click();dismiss_help(page)
 for string in range(6):tap(page,string,0)
 page.locator('[data-pilot-action="practice"]').click();dismiss_help(page);page.clock.run_for(1600)
 while sum(not e['correct'] and not e['retry'] for e in snap(page)['session']['events'])<4:
  s=snap(page)['session'];q=s['queue'][s['index']];bad=next(n for n in [0,2,4,5,7,9,11] if n!=q['target']['midi']%12);page.locator(f'[data-note="{bad}"]').click();wait_advance(page,s['index'])
 complete(page);assert not snap(page)['attempts'][-1]['passed'];assert page.locator('.result-actions>.primary').inner_text()=='Réessayer';page.locator('[data-pilot-action="home"]').click();assert page.locator('[data-module="degree-5"]').is_enabled();c.close()
 # Two short, independent diagnostic modes; no chained family exercise.
 for ident,mode in [('natural-diagnostic','name'),('natural-diagnostic-find','find')]:
  c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page);enable_fast_clock(page);page.locator('[data-module="'+ident+'"]').click();dismiss_help(page);tick(page,1600);session=snap(page)['session'];assert len(session['queue'])==30;assert {q['mode'] for q in session['queue']}=={mode};complete(page);assert snap(page)['diagnostic']['passed'];c.close()
 assert not errors,errors;print(json.dumps({'alternate_tunings':True,'transfer_links':True,'failed_result_retry_without_lock':True,'two_thirty_question_diagnostics':True,'errors':errors}));b.close()
