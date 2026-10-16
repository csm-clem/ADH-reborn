"""Viewport, timing, feedback, accessible alternatives and discovery contracts."""
from pilot_support import *
import time

def session(page):return snap(page)['session']
def correct(page):
 s=session(page);q=s['queue'][s['index']]
 if q['mode']=='name':page.locator(f'[data-note="{q["target"]["midi"]%12}"]').click()
 else:tap(page,q['target']['string'],q['target']['fret'])
 wait_advance(page,s['index'])

def fits(page):
 return page.evaluate('''()=>{const view=document.querySelector('#pilot-neck').getBoundingClientRect(),pane=document.querySelector('.answer-workspace').getBoundingClientRect(),bad=[];if(document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight+1)bad.push('page scroll');if(pane.right>innerWidth+.5||pane.bottom>innerHeight+.5)bad.push('answer pane outside');for(const e of document.querySelectorAll('#pilot-neck .fret-hit rect')){const r=e.getBoundingClientRect();if(r.left<view.left-.5||r.right>view.right+.5||r.top<view.top-.5||r.bottom>view.bottom+.5)bad.push('fret outside');}return bad}''')

with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);setup_standard(page);page.locator('.lesson-row[data-module="opens"]').click();practice=page.locator('[data-pilot-action="practice"]');assert practice.is_disabled();assert not page.locator('.pilot-discovery-legend').count()
 tap(page,0,0);assert page.locator('.pilot-marker[fill="#267342"]').count()==6
 for string in range(1,6):tap(page,string,0)
 assert practice.is_enabled()
 start=time.monotonic();practice.click();assert page.locator('.startup-ring circle').count()==2;assert page.locator('.countdown-overlay').inner_text()=='À vous de jouer'
 page.wait_for_timeout(450);offset=page.locator('.ring-progress').evaluate('e=>Number(getComputedStyle(e).strokeDashoffset.replace("px",""))');assert 40<offset<90,offset
 page.wait_for_selector('.pilot-count',state='detached',timeout=2500);elapsed=time.monotonic()-start;assert 1.3<elapsed<2.1,elapsed
 assert page.locator('.pilot-wheel button').count()==7
 for w,h in [(320,568),(375,812),(768,1024),(844,390),(568,320),(1280,720),(240,320)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(230);assert not fits(page),(w,h,fits(page))
 page.set_viewport_size({'width':375,'height':812});page.wait_for_timeout(230)
 before=page.locator('.pilot-wheel').bounding_box();q=session(page)['queue'][0];bad=next(n for n in [0,2,4,5,7,9,11] if n!=q['target']['midi']%12)
 page.locator(f'[data-note="{bad}"]').click();assert page.locator('.pilot-wheel').bounding_box()==before
 assert page.locator('.pilot-wheel .answer-wrong').count()==1 and page.locator('.pilot-wheel .answer-correct').count()==1
 page.screenshot(path=str(OUT/'correction.png'));page.wait_for_timeout(650);assert session(page)['index']==0
 page.locator('[data-pilot-action="next"]').click();s=session(page);q=s['queue'][s['index']];page.locator(f'[data-note="{q["target"]["midi"]%12}"]').click();page.wait_for_timeout(120);assert session(page)['index']==s['index']
 page.locator('[data-pilot-action="pause"]').last.click();page.wait_for_timeout(650);assert session(page)['index']==s['index'];assert page.locator('.game-body>.answer-workspace').evaluate('e=>getComputedStyle(e).filter')=='blur(16px) saturate(0)'
 page.locator('[data-pilot-action="mute"]').click();assert page.locator('[data-pilot-action="mute"]').get_attribute('aria-pressed')=='true';page.screenshot(path=str(OUT/'pause.png'))
 page.locator('[data-pilot-action="fullscreen"]').click();page.wait_for_function('!!document.fullscreenElement');page.locator('[data-pilot-action="fullscreen"]').click();page.wait_for_function('!document.fullscreenElement')
 page.locator('.pilot-pause-layer [data-pilot-action="resume-pause"]').click();wait_advance(page,s['index']);enable_fast_clock(page)
 while session(page)['queue'][session(page)['index']]['mode']=='name':correct(page)
 assert page.locator('.pilot-marker').count()==0;assert re.search(r'Trouvez [A-G][0-8]',page.locator('h1').inner_text());assert 'cases' not in page.locator('.question-copy').inner_text()
 page.locator('.pilot-position-buttons summary').click();assert page.locator('.pilot-coordinate-grid>div>span').all_text_contents()==['Corde '+str(i) for i in range(1,7)]
 q=session(page)['queue'][session(page)['index']];page.locator(f'[data-pilot-action="position"][data-string="{q["target"]["string"]}"][data-fret="1"]').click();assert page.locator('.pilot-coordinate-grid .answer-wrong').count()==1 and page.locator('.pilot-coordinate-grid .answer-correct').count()==1
 c.close()
 # Every fret target is visible for every supported string count, on both sides of orientation changes.
 c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 for instrument in ['guitar6','guitar7','guitar8','bass4','bass5','bass6']:
  seed(page,instrument,'degree-5' if instrument!='guitar8' else 'tuning');activity='degree-5' if instrument!='guitar8' else 'tuning';page.locator(f'.lesson-row[data-module="{activity}"]').click()
  for w,h in [(320,480),(375,812),(844,390),(568,320),(1280,720)]:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(230);assert not fits(page),(instrument,w,h,fits(page))
  if instrument=='guitar6':
   assert not page.locator('.pilot-discovery-legend').count();tap(page,1,2);assert page.locator('.pilot-discovery-legend span').count()==2;assert 'D3' not in page.locator('.pilot-discovery-legend').inner_text();page.screenshot(path=str(OUT/'fifth-landscape.png'))
 c.close();assert not errors,errors
 print(json.dumps({'spinner_1_5_seconds':True,'all_correct_open_alternatives_green':True,'stable_wheel':True,'all_fret_cells_visible_6_instruments_5_sizes':True,'pause_blur_mute_and_fullscreen':True,'height_in_find_prompt':True,'accessible_alternatives':True,'discovery_legend_after_response':True,'fifth_only_two_pitches':True,'errors':errors}));b.close()
