from playwright.sync_api import sync_playwright
from pathlib import Path
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},service_workers='block');page.goto('http://localhost:4173/')
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6'),s=initialPilotStore();s.profiles[profile.key]={profile,attempts:[],later:[],session:null};localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(s));}''');page.reload();page.locator('[data-action=settings]:visible').first.click();page.locator('[data-action=debug]').click();page.locator('[data-action=achievements]:visible').first.click();result=[]
 results=[]
 for w,h in [(320,760),(390,844),(844,390),(1440,1050)]:
  page.set_viewport_size({'width':w,'height':h})
  for theme in ['light','dark','accessible','paper']:
   page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
   bad=page.locator('.achievement-card').evaluate_all('''es=>es.flatMap(e=>{const f=e.querySelector('.achievement-front').getBoundingClientRect();return [...e.querySelectorAll('.achievement-front button,.achievement-front .achievement-number')].filter(b=>{let q=b.getBoundingClientRect();return q.bottom>f.bottom-3||q.left<f.left||q.right>f.right}).map(b=>({id:e.dataset.cardId,part:b.className,bottom:b.getBoundingClientRect().bottom-f.bottom}))})''')
   assert not bad,(w,theme,bad)
   results.append((w,theme,page.locator('.achievement-card').count()))
 print('Every card fits:',results)
 b.close()
