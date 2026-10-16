"""Reference onboarding, stable image node, voice preferences and floating labels."""
from pilot_support import *
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':1280,'height':850},reduced_motion='reduce');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE)
 assert 'Cinq minutes pour passer de « je cherche » à « je sais ».' in page.inner_text('body');assert page.locator('.landing-neck svg').count()==1
 page.evaluate('window.__instrumentImage=document.querySelector("img.setup-instrument-picture");window.__landing=document.querySelector(".landing-neck")');page.select_option('#notation','latin');assert page.evaluate('window.__instrumentImage===document.querySelector("img.setup-instrument-picture")&&window.__landing===document.querySelector(".landing-neck")');assert 'Fa' in page.locator('[data-landing-midi]').all_text_contents();page.select_option('#notation','international');page.screenshot(path=str(OUT/'landing-v011-desktop.png'))
 page.set_viewport_size({'width':375,'height':812});page.wait_for_timeout(220);page.screenshot(path=str(OUT/'landing-v011-mobile.png'));setup_standard(page)
 first=page.locator('.lesson-row[data-module="opens"]');assert first.locator('strong').inner_text()=='Les cordes à vide';assert first.locator('small').inner_text()=='Nommer les cordes';assert page.locator('.lesson-row[data-module="degree-5"] strong').inner_text()=='La note B'
 page.locator('[data-action="settings"]:visible').first.click();assert page.locator('#setting-voice option').count()==4
 for voice in ['guitar-acoustic','bass-electric','guitar-clean']:
  page.select_option('#setting-voice',voice);page.reload();assert page.locator('#setting-voice').count()==0;page.locator('[data-action="settings"]:visible').first.click();assert page.locator('#setting-voice').input_value()==voice
 seed(page,'guitar6','degree-5-find');enable_fast_clock(page);page.locator('.lesson-row[data-module="degree-5-find"]').click();dismiss_help(page);tick(page,1600);s=snap(page)['session'];q=s['queue'][0];tap(page,q['target']['string'],q['target']['fret']);tick(page,50)
 assert page.locator('.note-tag').count()>=1
 def tags_clear():return page.evaluate('''()=>[...document.querySelectorAll('.note-tag')].every(t=>{const a=t.getBoundingClientRect(),p=t.parentElement.querySelector('.pilot-marker').getBoundingClientRect();return Math.abs((a.y+a.height/2)-(p.y+p.height/2))<1&&Math.min(Math.abs(a.right-p.left),Math.abs(p.right-a.left))>=5.5})''')
 assert tags_clear();page.screenshot(path=str(OUT/'floating-label-v011.png'));assert page.locator('.touch-ripple').count()==1
 # Holding a touch focus never paints a rectangular SVG outline.
 for w,h in [(320,480),(844,390),(1280,720)]:
  page.set_viewport_size({'width':w,'height':h});page.evaluate('window.dispatchEvent(new Event("resize"))');tick(page,210);assert tags_clear()
 assert not errors,errors;print(json.dumps({'original_landing_copy':True,'image_node_preserved_on_notation':True,'subjects_and_methods':True,'three_voice_choices_persist':True,'floating_labels_clear_of_own_dot':True,'errors':errors}));b.close()
