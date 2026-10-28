from pathlib import Path
from playwright.sync_api import sync_playwright
import json
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
out=Path('work/round-wheel-v039');out.mkdir(exist_ok=True)
checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);q=b.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 for w,ht in [(390,844),(844,390),(1024,480),(1920,1080)]:
  q.set_viewport_size({'width':w,'height':ht});h['launch'](q,'c24s1-mix-6');q.wait_for_timeout(1500)
  metrics=q.evaluate('''()=>{const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom}},wheel=document.querySelector('.pilot-wheel');return {wheel:box(wheel),buttons:[...wheel.querySelectorAll('button')].map(box),neck:box(document.querySelector('#pilot-neck')),overflow:document.querySelector('#pilot-neck').dataset.overflow,body:[document.documentElement.scrollWidth,innerWidth]}}''')
  assert metrics['neck']['h']>=100,(w,metrics)
  checks.append({'width':w,'height':ht,'round_wheel':metrics['wheel'],'neck':metrics['neck'],'overflow':metrics['overflow']})
  q.screenshot(path=str(out/f'chromatic-{w}.png'),full_page=True)
  assert abs(metrics['wheel']['w']-metrics['wheel']['h'])<1
  for i,a in enumerate(metrics['buttons']):
   for d in metrics['buttons'][i+1:]:assert ((a['x']+a['w']/2-d['x']-d['w']/2)**2+(a['y']+a['h']/2-d['y']-d['h']/2)**2)**.5>=min(a['w'],d['w'])-1,(w,a,d)
  assert metrics['body'][0]<=w+1
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'checks':checks,'errors':errors,'real_devices':False},indent=2))
 b.close()
print('Round chromatic wheels, non-overlapping targets and neck minimum heights passed.')
