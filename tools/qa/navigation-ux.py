"""Approved UX 01–16 subset: real history, memory, tabs, surfaces and contrast."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
h={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],h)
out=Path('work/navigation-ux');out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',viewport={'width':390,'height':844},has_touch=True);q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)))
 # A cold PWA entry into a saved chapter must go to its parents before leaving.
 fresh=b.new_context(service_workers='block',viewport={'width':390,'height':844});deep=fresh.new_page();deep.on('pageerror',lambda e:errors.append(str(e)))
 h['seed'](deep,'guitar6','note-4-find');assert deep.locator('.chapter-overview').count()==1
 deep.go_back();deep.wait_for_selector('.lesson-row');assert h['snap'](deep)['navigation']['chapter'] is None
 deep.go_back();deep.wait_for_selector('.catalogue-section');assert h['snap'](deep)['navigation']['route'] is None
 deep.go_back();deep.wait_for_selector('.branch-jumbo');assert h['snap'](deep)['navigation']=={'branch':None,'route':None,'chapter':None}
 fresh.close();checks.append('cold reopened chapter returns through its real parents')
 h['seed'](q);assert q.locator('.branch-jumbo').count()==3;assert q.locator('[data-pilot-action=study-next]').count()==1
 q.locator('[data-pilot-action=beta-branch][data-id=targeted]').click();assert q.locator('.route-card').count()==25
 q.locator('.route-card[data-id=c24s6]').click();q.locator('.lesson-row').last.scroll_into_view_if_needed();q.locator('.lesson-row').last.focus();q.wait_for_timeout(180);scroll=q.evaluate('scrollY');q.locator('.lesson-row').last.click();title=q.locator('h1').inner_text();q.go_back();q.wait_for_selector('.lesson-row');q.wait_for_timeout(200);assert abs(q.evaluate('scrollY')-min(scroll,q.evaluate('document.documentElement.scrollHeight-innerHeight')))<5,(scroll,q.evaluate('scrollY'));checks.append('browser back restores route scroll')
 q.go_forward();q.wait_for_selector('.chapter-overview');assert q.locator('h1').inner_text()==title;checks.append('browser forward restores chapter')
 q.locator('[data-action=home]:visible').first.click();q.locator('[data-pilot-action=beta-branch][data-id=guided]').click();q.locator('.route-card[data-id=guided]').click()
 stage=q.locator('.guided-stage').last
 if stage.get_attribute('open') is None:stage.locator('summary').click()
 stage.locator('.lesson-row').first.scroll_into_view_if_needed();stage.locator('.lesson-row').first.focus();q.wait_for_timeout(160);scroll=q.evaluate('scrollY');stage.locator('.lesson-row').first.click();q.go_back();q.wait_for_selector('.guided-stage');q.wait_for_timeout(180);assert q.locator('.guided-stage').last.get_attribute('open') is not None;assert abs(q.evaluate('scrollY')-scroll)<5;checks.append('guided accordion and scroll restored')
 q.locator('[data-action=stats]:visible').first.click();assert q.locator('.study-card').count()==1;assert q.locator('h1').count()==1;assert q.locator('.study-card').bounding_box()['y']<q.locator('.progress-overview').bounding_box()['y'];checks.append('progress begins with next useful step after title')
 q.locator('[data-action=settings]:visible').first.click();assert q.locator('.content > .panel').first.get_attribute('class')=='panel debug-panel'
 assert q.locator('h2').all_text_contents()==['Mode débug · réservé à la v0','Instrument','Jeu et son','Sauvegardes et mises à jour','Aide'];assert q.locator('.appearance-panel legend').inner_text()=='Apparence';checks.append('settings grouped, debug still first')
 for theme in ['light','dark','accessible','paper']:
  q.locator(f'input[name=theme][value={theme}]').check();q.wait_for_timeout(200)
  for width,height in [(320,568),(390,844),(844,390),(1024,768),(1366,768),(1440,900)]:
   q.set_viewport_size({'width':width,'height':height});q.wait_for_timeout(200)
   assert q.evaluate('document.documentElement.scrollWidth<=innerWidth'),(theme,width,'overflow')
   # Measure actual rendered theme tokens. White labels must remain readable even
   # at the lightest endpoint of each shared action gradient.
   ratios=q.evaluate('''()=>{const s=getComputedStyle(document.documentElement),rgb=c=>{const x=document.createElement('span');x.style.color=c;document.body.append(x);const values=getComputedStyle(x).color.match(/[0-9.]+/g).slice(0,3).map(Number);x.remove();return values;},l=c=>rgb(c).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0),ratio=(a,b)=>{const x=l(a),y=l(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)},v=n=>s.getPropertyValue(n).trim(),day=['light','dark'].includes(document.documentElement.dataset.theme);return {body:ratio(v('--ink'),v('--surface')),muted:ratio(v('--muted'),v('--surface')),mutedOnBackground:ratio(v('--muted'),v('--bg')),primary:day?Math.min(ratio('#fff',v('--button_gradient_top_color')),ratio('#fff',v('--button_gradient_bottom_color'))):ratio('#fff',v('--action-fill')),hover:day?Math.min(ratio('#fff',v('--button-hover-top')),ratio('#fff',v('--button-hover-bottom'))):ratio('#fff',v('--action-fill'))}}''')
   assert min(ratios.values())>=4.5,(theme,width,ratios)
   checks.append({'theme':theme,'viewport':[width,height],'minimum_text_contrast':round(min(ratios.values()),2)})
   if width in [390,1366]:q.screenshot(path=str(out/f'settings-{theme}-{width}.png'),full_page=True)
 q.set_viewport_size({'width':1366,'height':768});q.locator('[data-action=home]:visible').first.click();q.locator('[data-action=home]:visible').first.click();q.locator('[data-pilot-action=beta-branch][data-id=targeted]').click();q.locator('.route-card[data-id=cs1]').click();assert 'Pratique ciblée' in q.locator('.breadcrumbs').inner_text();assert 'Corde 6' in q.locator('.breadcrumbs').inner_text();q.screenshot(path=str(out/'route-desktop.png'),full_page=True);checks.append('full directory and real clickable breadcrumb')
 q.locator('.breadcrumbs [data-pilot-action=beta-branch]').click();assert q.locator('.route-card').count()==25;checks.append('full directory visible after parent return')
 q.locator('[data-action=home]:visible').first.click();q.locator('[data-pilot-action=study-next]').click();assert q.locator('.pilot-game,.pilot-count,.instruction-page,.course-page').count()>0;checks.append('home shortcut launches existing activity')
 assert not errors,errors
 (out/'verification.json').write_text(json.dumps({'checks':checks,'errors':errors,'real_phones_tested':False},ensure_ascii=False,indent=2));b.close()
print('Approved navigation UX passed.')
