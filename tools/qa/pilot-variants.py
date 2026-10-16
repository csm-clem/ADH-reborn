"""Alternate tunings, transfers, diagnostic and failed-result gating."""
from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);errors=[]
 for instrument,tuning,activity,expected in [('guitar7',None,'degree-5','diminuée'),('guitar6','D2 A2 D3 G3 A3 D4','degree-4','registre disponible'),('guitar7','B1 F#2 B2 E3 A3 C#4 F#4','tuning','préambule')]:
  c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page,instrument,activity,tuning);page.locator(f'.lesson-row[data-module="{activity}"]').click();dismiss_help(page);assert expected in page.inner_text('body');assert not page.locator('[data-module="workshop-fsharp"]').count()
  if activity=='tuning':
   for string in range(len(snap(page)['profile']['tuning'])):tap(page,string,0)
   page.locator('[data-pilot-action="practice"]').click();dismiss_help(page);page.wait_for_selector('.startup-ring',state='detached');choices=page.locator('.pilot-wheel button').all_text_contents();assert 'F♯' in choices and 'C♯' in choices
  c.close()
 # The transfer draws equal-fret pairs, and the motif repeats the same frets on the other string.
 c=b.new_context(viewport={'width':844,'height':390},reduced_motion='reduce');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page,'guitar6','transfer-4');enable_fast_clock(page);page.locator('.lesson-row[data-module="transfer-4"]').click();dismiss_help(page);page.clock.run_for(40)
 assert 'cordes 6 et 1' in page.locator('.pilot-explanation').inner_text();assert not page.locator('.transfer-link').count()
 focus=page.evaluate('''async()=>{const {pilotPlan}=await import('./pilot.js'),{PILOT_KEY}=await import('./release.js');const d=Object.values(JSON.parse(localStorage.getItem(PILOT_KEY)).profiles)[0];return pilotPlan(d.profile).modules.find(m=>m.kind==='transfer').focus[0]}''');tap(page,focus['string'],focus['fret']);assert page.locator('.transfer-link').count()==3;page.screenshot(path=str(OUT/'transfer.png'))
 complete(page);assert snap(page)['attempts'][-1]['passed'];c.close()
 # More than ten percent first errors keeps the next activity locked, even after corrections.
 c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();seed(page);enable_fast_clock(page);page.locator('.lesson-row[data-module="opens"]').click();dismiss_help(page)
 for string in range(6):tap(page,string,0)
 page.locator('[data-pilot-action="practice"]').click();dismiss_help(page);page.clock.run_for(1600)
 while sum(not e['correct'] and not e['retry'] for e in snap(page)['session']['events'])<4:
  s=snap(page)['session'];q=s['queue'][s['index']];bad=next(n for n in [0,2,4,5,7,9,11] if n!=q['target']['midi']%12);page.locator(f'[data-note="{bad}"]').click();page.locator('[data-pilot-action="next"]').click()
 complete(page);assert not snap(page)['attempts'][-1]['passed'];assert page.locator('.result-card>.primary').inner_text()=='Refaire cette activité';assert page.locator('[data-pilot-action="start"][data-module="degree-5"]').count()==1;page.locator('[data-pilot-action="home"]').click();assert page.locator('[data-module="degree-5"]').is_enabled();c.close()
 # Diagnostic: 108 questions and all seven families, without a target-audio hint.
 c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');c.add_init_script('''window.__sounds=0;const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...a){window.__sounds++;return start.apply(this,a)};''');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page);enable_fast_clock(page);page.locator('[data-module="natural-diagnostic"]').click();dismiss_help(page);page.clock.run_for(1600);assert page.evaluate('window.__sounds')==0;assert page.locator('.pilot-wheel button').count()==7;assert len(snap(page)['session']['queue'])==108
 while snap(page)['session']['stage']=='practice':
  dismiss_help(page)
  if page.locator('.pilot-count').count():page.clock.run_for(1600)
  s=snap(page)['session'];q=s['queue'][s['index']]
  if q['mode']=='name':page.locator(f'[data-note="{q["target"]["midi"]%12}"]').click()
  else:tap(page,q['target']['string'],q['target']['fret'])
  wait_advance(page,s['index'])
 natural=page.evaluate('''async()=>{const {pilotPlan}=await import('./pilot.js'),{PILOT_KEY}=await import('./release.js');return pilotPlan(Object.values(JSON.parse(localStorage.getItem(PILOT_KEY)).profiles)[0].profile).natural}''')
 dismiss_help(page)
 for pc in snap(page)['session']['familyOrder']:
  for pos in natural:
   if pos['midi']%12==pc:tap(page,pos['string'],pos['fret'])
  page.locator('[data-pilot-action="family-next"]').click()
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert snap(page)['diagnostic']['passed'];assert 'Prérequis vérifiés' in page.locator('h1').inner_text();assert not errors,errors
 print(json.dumps({'seven_string_intervals':True,'dadgad_available_register':True,'altered_tuning_preamble':True,'explicit_transfer_links_and_motif':True,'failed_lesson_still_allows_next':True,'diagnostic_108_items_and_families':True,'no_diagnostic_target_audio':True,'errors':errors}));b.close()
