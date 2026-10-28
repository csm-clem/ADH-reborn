"""Visible layout contracts: centred instruments, conditional overflow and grouped settings."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
out=Path('work/neck-settings-v039');out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',viewport={'width':2560,'height':1080});q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)))
 h['launch'](q,'c24s1-mix-4')
 for _ in range(12):
  s=h['snap'](q)['session'];question=s['queue'][s['index']]
  if question['target']['fret']>=12:break
  q.locator(f'.pilot-wheel [data-note="{question["target"]["midi"]%12}"]').click();q.wait_for_timeout(80)
 for w,height in [(2560,1080),(390,844),(844,390),(2560,1080)]:
  q.set_viewport_size({'width':w,'height':height});q.wait_for_timeout(250)
  metrics=q.evaluate('''()=>{const v=document.querySelector('#pilot-neck'),svg=v.querySelector('svg'),r=v.getBoundingClientRect(),s=svg.getBoundingClientRect(),dot=v.querySelector('.pilot-marker').getBoundingClientRect();return {overflow:v.dataset.overflow,scrollable:v.scrollWidth>v.clientWidth+1,overflowX:getComputedStyle(v).overflowX,centre:s.x+s.width/2,viewportCentre:r.x+r.width/2,pointVisible:dot.x+dot.width/2>=r.x&&dot.x+dot.width/2<=r.right}}''')
  assert metrics['overflowX']=='auto',metrics
  assert metrics['pointVisible'],(w,metrics)
  assert (metrics['overflow']=='true')==metrics['scrollable'],(w,metrics)
  if w==2560:assert not metrics['scrollable'] and abs(metrics['centre']-metrics['viewportCentre'])<2,(w,metrics)
  if w==390:assert metrics['scrollable'],metrics
  checks.append({'neck':w,**metrics});q.screenshot(path=str(out/f'neck-{w}.png'))
 q.locator('[data-pilot-action=exit]').click();q.locator('[data-action=settings]:visible').first.click()
 sections=q.locator('.settings-separated')
 assert sections.count()==2
 for section in sections.all():
  rows=section.locator(':scope > .settings-item');assert rows.count()>=3
  assert rows.first.evaluate('e=>getComputedStyle(e).borderTopStyle')=='none'
  for row in rows.all()[1:]:assert row.evaluate('e=>getComputedStyle(e).borderTopStyle')=='solid'
 checks.append('separators between setting groups, never under headings')
 button=q.locator('[data-action=fullscreen]');button.hover()
 fill=button.evaluate('e=>getComputedStyle(e).backgroundImage')
 # Secondary appearance stays shared. Check the primary gradient on the help install action.
 colors=q.evaluate('''()=>{const s=getComputedStyle(document.documentElement);return ['--button_gradient_top_color','--button_gradient_bottom_color','--button-hover-top','--button-hover-bottom'].map(k=>s.getPropertyValue(k).trim())}''')
 assert colors==['#f8a744','#e94647','#f8a744','#202980'],colors
 q.screenshot(path=str(out/'settings.png'));checks.append({'shared_button_palette':colors})
 for activity in ['cs1-note-9-discover','c24s1-note-9-discover']:
  h['seed'](q,'guitar6',activity);q.evaluate('''()=>{const k='fretboard-trainer:pilot:stable',s=JSON.parse(localStorage.getItem(k));Object.values(s.profiles)[0].seenInstructions=[];localStorage.setItem(k,JSON.stringify(s));}''');q.reload();q.locator('.chapter-options summary').click();q.locator(f'[data-module="{activity}"]').click();q.wait_for_timeout(150)
  svg=q.locator('svg[data-neck-scroll=true]');content=q.locator('.instruction-content')
  assert svg.bounding_box()['height']>=239
  assert content.bounding_box()['width']>=2400,content.bounding_box()
  for selector in ['.new-exercise-label','.discovery-direction']:
   box=q.locator(selector).bounding_box();assert abs(box['x']+box['width']/2-1280)<2,(selector,box)
  reason=q.locator('.lesson-actions .disabled-reason').bounding_box();action=q.locator('[data-pilot-action=help-next]').bounding_box()
  assert reason['y']>=action['y']+action['height']-1,(reason,action)
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  q.screenshot(path=str(out/(activity+'.png')));checks.append({'wide_intro':activity,'height':svg.bounding_box()['height'],'width':content.bounding_box()['width']})
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'checks':checks,'errors':errors},indent=2));b.close()
print('Centred necks, resize overflow, long introductions and settings passed.')
