"""Theme state colors, stacked feedback, alignment, report draft and collection hierarchy."""
from practice_support import *
def contrast(a,b):
 def lum(s):
  nums=list(map(int,re.findall(r'\d+',s)[:3]));v=[n/255 for n in nums];return sum(w*(x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4) for w,x in zip([.2126,.7152,.0722],v))
 x,y=sorted([lum(a),lum(b)]);return (y+.05)/(x+.05)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox']);page=b.new_page(viewport={'width':375,'height':812});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);page.wait_for_timeout(200)
 aligned=page.evaluate('''()=>{const es=['.setup-landing-copy h1','.landing-description','.landing-neck'].map(s=>document.querySelector(s).getBoundingClientRect());return Math.max(...es.map(r=>r.x))-Math.min(...es.map(r=>r.x))<1}''');assert aligned
 # The graphic's rotated drawing stays inside the fixed-height SVG box.
 for size in [(375,812),(1280,800)]:
  page.set_viewport_size({'width':size[0],'height':size[1]});page.wait_for_timeout(200)
  assert page.evaluate('''()=>{const svg=document.querySelector('.landing-neck svg'),r=svg.getBoundingClientRect(),d=svg.querySelector('.neck-drawing').getBoundingClientRect();return d.left>=r.left-1&&d.right<=r.right+1&&d.top>=r.top-1&&d.bottom<=r.bottom+1}''')
 practice(page,'note-4');page.clock.install();page.clock.pause_at(page.evaluate('new Date().toISOString()'));page.fast_clock=True
 colors={}
 for theme in ['light','dark','accessible','paper']:
  page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme);q=snap(page)['session']['queue'][snap(page)['session']['index']];bad=next(n for n in [40,52,64] if n!=q['target']['midi']);page.locator(f'[data-note="{bad}"]').dispatch_event('click')
  dot=page.locator('.echo-dot').last;fill=dot.evaluate('e=>getComputedStyle(e).fill');expected=dot.evaluate('''e=>{const probe=document.createElementNS('http://www.w3.org/2000/svg','circle');probe.style.fill='var(--note-wrong)';e.parentElement.append(probe);const c=getComputedStyle(probe).fill;probe.remove();return c}''');assert fill==expected
  assert page.locator('#pilot-neck svg').evaluate('e=>e.lastElementChild.classList.contains("answer-echo")')
  if theme=='accessible':assert abs(float(dot.evaluate('e=>getComputedStyle(e).strokeWidth').removesuffix('px'))-4/3)<.001, dot.evaluate('e=>getComputedStyle(e).strokeWidth')
  colors[theme]={'wrong':fill};tick(page,1200)
  q=snap(page)['session']['queue'][snap(page)['session']['index']];page.locator(f'[data-note="{q["target"]["midi"]}"]').dispatch_event('click');dot=page.locator('.tone-correct.echo-dot').last;good=dot.evaluate('e=>getComputedStyle(e).fill');assert good!=fill;colors[theme]['correct']=good
  if theme=='accessible':assert page.locator('.game-progress').evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(229, 239, 255)'
  tick(page,700)
 assert len(set(v['wrong'] for v in colors.values()))==4,colors
 practice(page,'mix-4-find');page.locator('[data-pilot-action="toggle-positions"]').click();assert not page.locator('.position-grid-caption').count();assert 'Corde' not in page.locator('.position-grid-heading').inner_text();assert 'À vide' in page.locator('.position-grid-heading').inner_text();assert page.locator('.position-string').first.evaluate('e=>getComputedStyle(e).backgroundColor')=='rgba(0, 0, 0, 0)'
 page.locator('[data-pilot-action="exit"]').click();page.locator('[data-pilot-action="home"]').click();page.locator('[data-action="settings"]:visible').first.click();page.locator('input[name="theme"][value="accessible"]').check();page.evaluate('window.open=(url,...args)=>window.__bugDraft={url,args}');page.locator('#bug-description').fill('Le manche ne répond pas après une reprise.');page.locator('[data-action="report-bug"]').click();draft=page.evaluate('window.__bugDraft');assert draft['url'].startswith('https://github.com/csm-clem/ADH-reborn/issues/new?');assert 'attempts' not in draft['url'];assert draft['args']==['_blank','noopener,noreferrer']
 page.locator('[data-action="home"]:visible').first.click();assert not page.locator('.pilot-limits').count();assert 'Pour les élèves déjà à l’aise' not in page.locator('#main-content').inner_text();assert page.locator('.lesson-row').filter(has_text='Toutes les notes naturelles').count()>=2
 styles=page.locator('.lesson-symbol.complete').first
 # Complete badges are seeded by practice(); their foreground is checked if present.
 if styles.count():
  cs=styles.evaluate('e=>({fg:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor})');assert contrast(cs['fg'],cs['bg'])>=4.5,cs
 page.locator('[data-action="settings"]:visible').first.click();page.locator('input[name="theme"][value="dark"]').check();page.locator('[data-action="home"]:visible').first.click();page.wait_for_timeout(220);hero=page.locator('.zone-hero');cs=hero.evaluate('e=>({bg:getComputedStyle(e).backgroundColor,fg:getComputedStyle(e.querySelector("p")).color})');assert contrast(cs['fg'],cs['bg'])>=7,cs;page.screenshot(path=str(OUT/'night-course-v020.png'))
 assert not errors,errors;print(json.dumps({'landing_aligned_and_unclipped':True,'state_colors':colors,'correction_on_top':True,'accessible_dot_outline':True,'grid_simplified':True,'report_is_local_draft':True,'removed_panels':True,'night_hero_contrast':True,'errors':errors}));b.close()
