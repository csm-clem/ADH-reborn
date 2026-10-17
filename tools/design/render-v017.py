from playwright.sync_api import sync_playwright
from pathlib import Path
BASE='http://localhost:4173/docs/v0.17/'
OUT=Path('docs/v0.17')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1700,'height':1000},device_scale_factor=1)
 for name in ['manches','themes']:
  page.goto(BASE+name+'.html');page.screenshot(path=str(OUT/(name+'.png')),full_page=True)
  h=page.evaluate('document.documentElement.scrollHeight');page.pdf(path=str(OUT/(name+'.pdf')),width='1700px',height=str(h)+'px',print_background=True,margin={'top':'0','right':'0','bottom':'0','left':'0'})
  for i,card in enumerate(page.locator('.card').all()):card.screenshot(path=str(OUT/(name+'-'+str(i+1)+'.png')))
 b.close()
