"""All target cells, axes and response panels fit across supported instruments."""
from pilot_support import *
def fits(page):
 return page.evaluate('''()=>{const view=document.querySelector('#pilot-neck').getBoundingClientRect(),pane=document.querySelector('.answer-workspace').getBoundingClientRect(),bad=[];if(document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight+1)bad.push('page scroll');if(pane.right>innerWidth+.5||pane.bottom>innerHeight+.5)bad.push('answer pane outside');for(const e of document.querySelectorAll('#pilot-neck .fret-hit rect')){const r=e.getBoundingClientRect();if(r.left<view.left-.5||r.right>view.right+.5||r.top<view.top-.5||r.bottom>view.bottom+.5)bad.push('fret outside');}return bad}''')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,headless=True,args=['--no-sandbox']);errors=[]
 for instrument in ['guitar6','guitar7','guitar8','bass4','bass5','bass6']:
  c=b.new_context(viewport={'width':375,'height':812},reduced_motion='reduce');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));seed(page,instrument,'opens-find');enable_fast_clock(page);page.locator('.lesson-row[data-module="opens-find"]').click();dismiss_help(page);tick(page,1600)
  for w,h in [(320,480),(375,812),(844,390),(568,320),(1280,720)]:
   page.set_viewport_size({'width':w,'height':h});page.evaluate('window.dispatchEvent(new Event("resize"))');tick(page,250);
   if fits(page):
    page.screenshot(path=str(OUT/'layout-failure.png'));print(page.evaluate('''()=>({view:document.querySelector('#pilot-neck').getBoundingClientRect().toJSON(),inner:document.querySelector('#pilot-neck-inner').getBoundingClientRect().toJSON(),cell:document.querySelector('.fret-hit rect').getBoundingClientRect().toJSON()})'''));assert False,(instrument,w,h,fits(page))
   assert page.locator('.pilot-axis-string').first.evaluate('e=>parseFloat(getComputedStyle(e).fontWeight)')>=700
  page.locator('.pilot-position-buttons summary').click();assert [re.match(r'\d+',s).group() for s in page.locator('.position-string').all_text_contents()]==[str(i) for i in range(1,len(snap(page)['profile']['tuning'])+1)]
  q=snap(page)['session']['queue'][0];page.locator(f'[data-pilot-action="position"][data-string="{q["target"]["string"]}"][data-fret="{q["target"]["fret"]}"]').click();assert snap(page)['session']['index']==1
  c.close()
 assert not errors,errors;print(json.dumps({'six_instruments_five_sizes':True,'bold_axes':True,'accessible_buttons_treble_first':True,'errors':errors}));b.close()
