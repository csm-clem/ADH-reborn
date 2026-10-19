"""Automated WCAG scan. Results are findings, not a conformance certificate."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
helpers={};exec(Path('tools/qa/beta-browser.py').read_text().split('with sync_playwright()')[0],helpers)
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',viewport={'width':390,'height':844},has_touch=True,is_mobile=True);page=c.new_page()
 def scan(name):
  page.evaluate('document.fonts.ready');page.wait_for_timeout(650)
  page.add_script_tag(path='work/v029/axe.min.js')
  r=page.evaluate('''async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {version:axe.version,violations:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,count:v.nodes.length})),passes:r.passes.length}}''');results.append({'screen':name,**r});print(name,[(v['id'],len(v['nodes']))for v in r['violations']],flush=True)
 page.goto('http://localhost:4173/');scan('onboarding-instrument');page.locator('#setup-form button[type=submit]').click();scan('onboarding-notation');page.locator('#setup-form button[type=submit]').click();scan('onboarding-accordage')
 helpers['seed'](page);scan('parcours-branches')
 for theme in ['light','dark','accessible','paper']:
  page.locator('[data-action=settings]:visible').first.click();page.locator(f'input[name=theme][value={theme}]').check();scan('parametres-'+theme)
  page.locator('[data-action=stats]:visible').first.click();scan('progres-'+theme)
  page.locator('[data-action=achievements]:visible').first.click();scan('collection-'+theme)
 helpers['launch'](page,'cs1-note-4-find');scan('exercice-corde-portrait');page.locator('[data-pilot-action=toggle-positions]').click();scan('exercice-corde-boutons')
 page.locator('[data-pilot-action=exit]').click();helpers['launch'](page,'mix-4');scan('exercice-nommer');page.locator('[data-pilot-action=pause]').click();scan('pause')
 Path('docs/v0.29/audit-accessibilite.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));b.close()
