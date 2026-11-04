"""Real component gallery, behavioural contracts and tolerant visual references.
Use --update explicitly to generate candidate baselines for human review.
"""
from pathlib import Path
import os,json,sys
from PIL import Image,ImageChops,ImageFilter
from playwright.sync_api import sync_playwright
BASE=os.environ.get('ADH_BASE_URL','http://localhost:4173/')
OUT=Path('work/ui-consistency');OUT.mkdir(parents=True,exist_ok=True)
REF=Path('tests/visual/ui-consistency');REF.mkdir(parents=True,exist_ok=True)
update='--update' in sys.argv

def changed_ratio(a,b,soften=True):
 a=Image.open(a).convert('RGB');b=Image.open(b).convert('RGB')
 if a.size!=b.size:return 1
 if soften:a=a.filter(ImageFilter.GaussianBlur(.7));b=b.filter(ImageFilter.GaussianBlur(.7))
 diff=ImageChops.difference(a,b);pixels=diff.get_flattened_data() if hasattr(diff,'get_flattened_data') else diff.getdata()
 return sum(max(p)>45 for p in pixels)/(a.width*a.height)

cases=[]
for theme in ['light','dark']:
 for width,height,label in [(390,844,'portrait'),(844,390,'landscape'),(1366,768,'desktop')]:
  for mode in ['arcade','course']:
   cases.append(('hud',mode,'muted' if label=='landscape' else 'long',theme,width,height,label))
   cases.append(('result',mode,'record',theme,width,height,label))
  if label!='landscape':
   for specimen in ['actions','neck']:cases.append((specimen,'course','normal',theme,width,height,label))
report=[];differences=[];failures=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 c=b.new_context(service_workers='block',reduced_motion='reduce',device_scale_factor=1);q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 q.goto(BASE+'component-gallery.html');assert q.locator('iframe').count()==1
 q.locator('select[name=theme]').select_option('dark');frame=q.frame_locator('iframe');frame.locator('.shared-game-hud').wait_for()
 assert frame.locator('html').get_attribute('data-theme')=='dark'
 for specimen,mode,state,theme,w,h,label in cases:
  q.set_viewport_size({'width':w,'height':h});name=f'{specimen}-{mode}-{state}-{theme}-{label}.png'
  q.goto(BASE+f'component-gallery.html?specimen={specimen}&mode={mode}&theme={theme}&state={state}')
  q.evaluate('document.fonts.ready');q.wait_for_timeout(80)
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),name
  assert q.evaluate('localStorage.length')==0,name
  if specimen=='result':
   assert q.locator('[data-component=result] [data-result-summary]').count()==1
   assert q.locator('[data-result-actions]').count()==1
  if specimen=='hud':
   assert q.locator('.sound-toggle').get_attribute('aria-pressed')==str(state=='muted').lower()
   for box in q.locator('.icon-button').all():
    r=box.bounding_box();assert r['width']>=44 and r['height']>=44,(name,r)
  actual=OUT/name;(q.locator('.shared-game-hud') if specimen=='hud' else q.locator('#gallery')).screenshot(path=str(actual),animations='disabled')
  if update:(REF/name).write_bytes(actual.read_bytes())
  else:
   assert (REF/name).exists(),f'Missing baseline {name}; use --update for review'
   ratio=changed_ratio(REF/name,actual);raw=changed_ratio(REF/name,actual,False);differences.append({'name':name,'ratio':ratio,'raw_ratio':raw});print(f'{name}: raw={raw:.4%}, softened={ratio:.4%}',flush=True)
   if ratio>=.025:failures.append((name,ratio))
  report.append(name)
 # The comparator must detect a meaningful visual regression.
 q.goto(BASE+'component-gallery.html?specimen=hud&mode=arcade&theme=light&state=long');q.evaluate('document.fonts.ready');q.locator('.shared-game-hud').screenshot(path=str(OUT/'before.png'));q.add_style_tag(content='.shared-game-hud{opacity:.15}');q.locator('.shared-game-hud').screenshot(path=str(OUT/'broken.png'));assert changed_ratio(OUT/'before.png',OUT/'broken.png')>.025
 q.goto(BASE+'component-gallery.html?specimen=hud&mode=arcade');q.locator('[data-demo=pause]').click();assert 'Pause' in q.locator('[role=status]').inner_text();q.locator('[data-demo=resume]').click();q.locator('[data-demo=mute]').click();assert q.locator('.sound-toggle').get_attribute('aria-pressed')=='true';assert q.locator('[data-demo=restart]').count()==0;assert q.locator('.hud-tools button').count()==3
 q.goto(BASE+'component-gallery.html?specimen=actions');q.keyboard.press('Tab');assert q.evaluate('document.documentElement.dataset.keyboard')=='true';assert q.locator(':focus').count()==1;assert q.locator(':focus').evaluate('e=>parseFloat(getComputedStyle(e).outlineWidth)')>=3
 q.screenshot(path=str(OUT/'keyboard-focus.png'))
 assert not errors,errors
 (OUT/'report.json').write_text(json.dumps({'references':report,'candidate_generation':update,'pixel_threshold':45,'max_changed_ratio':.025,'errors':errors,'differences':differences,'failures':failures,'antialias_blur_radius':.7},indent=2))
 b.close()
 assert not failures,failures
print(f'UI consistency: {len(report)} visual cases, shared controls, touch sizes, overflow and storage isolation passed.')
