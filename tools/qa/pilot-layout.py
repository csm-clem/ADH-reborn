"""v0.6 interaction contracts: stable wheel, viewport, timing, pause, fullscreen, string order."""
from pilot_support import *
import time

def session(page):return snap(page)['session']
def correct(page):
 s=session(page);q=s['queue'][s['index']]
 if q['mode']=='name':page.locator(f'[data-note="{q["target"]["midi"]%12}"]').click()
 else:tap(page,q['target']['string'],q['target']['fret'])
 wait_advance(page,s['index'])

with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox'])
 c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);page.get_by_role('button',name='C’est parti').click();page.locator('.lesson-row[data-module="opens"]').click()
 practice=page.locator('[data-pilot-action="practice"]');assert practice.is_disabled()
 gray=practice.evaluate('e=>getComputedStyle(e).backgroundColor');assert gray=='rgb(228, 231, 235)',gray
 for string in range(6):tap(page,string,0)
 assert practice.is_enabled();assert practice.evaluate('e=>getComputedStyle(e).backgroundImage')!='none'
 page.evaluate('''window.__counts=[];window.__countTimer=setInterval(()=>{const n=document.querySelector('.pilot-count')?.textContent;if(n&&window.__counts.at(-1)?.n!==n)window.__counts.push({n,t:performance.now()})},20)''')
 start=time.monotonic();practice.click();page.wait_for_selector('.pilot-count',state='detached',timeout=3000);elapsed=time.monotonic()-start
 assert 1.3<elapsed<2.1,elapsed
 counts=page.evaluate('window.__counts');assert [x['n'] for x in counts]==['3','2','1'],counts
 assert all(380<counts[i+1]['t']-counts[i]['t']<650 for i in range(2)),counts
 assert page.locator('.pilot-wheel button').count()==7
 for w,h in [(320,568),(375,812),(768,1024),(844,390),(568,320),(1280,720),(240,320)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(220)
  pane=page.locator('.answer-workspace').bounding_box();assert pane['x']>=0 and pane['y']>=0 and pane['x']+pane['width']<=w+.5 and pane['y']+pane['height']<=h+.5,(w,h,pane)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.set_viewport_size({'width':375,'height':812});page.wait_for_timeout(220)
 before=page.locator('.pilot-wheel').bounding_box();q=session(page)['queue'][0];bad=next(n for n in [0,2,4,5,7,9,11] if n!=q['target']['midi']%12)
 page.locator(f'[data-note="{bad}"]').click();assert page.locator('.pilot-wheel').bounding_box()==before
 assert page.locator('.answer-wrong').count()==1 and page.locator('.answer-correct').count()==1
 page.screenshot(path=str(OUT/'v06-correction.png'));page.wait_for_timeout(650);assert session(page)['index']==0
 page.locator('[data-pilot-action="next"]').click();s=session(page);q=s['queue'][s['index']]
 page.locator(f'[data-note="{q["target"]["midi"]%12}"]').click();page.wait_for_timeout(150);assert session(page)['index']==s['index']
 page.locator('[data-pilot-action="pause"]').last.click();page.wait_for_timeout(650);assert session(page)['index']==s['index']
 assert page.locator('.game-body>.answer-workspace').evaluate('e=>getComputedStyle(e).filter')=='blur(5px) saturate(0)'
 page.locator('[data-pilot-action="mute"]').click();assert page.locator('[data-pilot-action="mute"]').get_attribute('aria-pressed')=='true'
 page.screenshot(path=str(OUT/'v06-pause.png'))
 page.locator('[data-pilot-action="fullscreen"]').click();page.wait_for_function('!!document.fullscreenElement');page.locator('[data-pilot-action="fullscreen"]').click();page.wait_for_function('!document.fullscreenElement')
 page.locator('.pilot-pause-layer [data-pilot-action="resume-pause"]').click();wait_advance(page,s['index'])
 while session(page)['queue'][session(page)['index']]['mode']=='name':correct(page)
 assert page.locator('.pilot-marker').count()==0
 assert page.evaluate('!document.activeElement.matches("[data-pilot-string]")')
 page.locator('.pilot-position-buttons summary').click()
 rows=page.locator('.pilot-coordinate-grid>div>span').all_text_contents();assert rows==['Corde 1','Corde 2','Corde 3','Corde 4','Corde 5','Corde 6'],rows
 q=session(page)['queue'][session(page)['index']];string=q['target']['string'];page.locator(f'[data-pilot-action="position"][data-string="{string}"][data-fret="1"]').click()
 assert page.locator('.pilot-coordinate-grid .answer-wrong').count()==1 and page.locator('.pilot-coordinate-grid .answer-correct').count()==1
 page.locator('[data-pilot-action="pause"]').last.click();page.locator('[data-pilot-action="exit"]').click();page.locator('[data-action="stats"]:visible').first.click()
 assert page.locator('.pilot-grid tbody th').all_text_contents()==['1','2','3','4','5','6']
 assert 'autoévaluation' not in page.inner_text('body').lower()
 assert not errors,errors
 print(json.dumps({'stable_wheel':True,'bounded_answers_7_sizes':True,'half_second_countdown':True,'correct_auto_advance':True,'pause_stops_auto_advance':True,'mute_while_paused':True,'fullscreen':True,'no_prefilled_neck_cell':True,'accessible_buttons_red_green':True,'high_string_first':True,'errors':errors}));b.close()
