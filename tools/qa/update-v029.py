"""Actual v0.28 ZIP -> current dist, same stable URL, reject then accept."""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright
import zipfile,json
base=Path.cwd();old=base/'work/v029/previous';old.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(base/'downloads/daily-fretboard-trainer-v0.28.zip') as z:z.extractall(old)
root=old
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(root),**kw)
 def log_message(self,*a):pass
 def end_headers(self):self.send_header('Cache-Control','no-store');super().end_headers()
server=ThreadingHTTPServer(('127.0.0.1',4182),Handler);Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context();page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:4182/');page.evaluate('navigator.serviceWorker.ready');page.wait_for_function('navigator.serviceWorker.controller!==null')
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{betaCatalog}=await import('./beta-catalog.js'),{simulatedBetaCompletion}=await import('./debug-mode.js');const profile=makeProfile('guitar6'),store=simulatedBetaCompletion(profile,betaCatalog(profile));localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(store));}''');page.reload();before=page.evaluate('localStorage.getItem("fretboard-trainer:pilot:stable")');assert page.evaluate('import("./release.js").then(m=>m.RELEASE)')=='0.28.0'
 root=base/'dist';page.reload();page.wait_for_selector('.update-dialog[open]');page.locator('[data-update=later]').click();assert page.evaluate('import("./release.js").then(m=>m.RELEASE)')=='0.28.0'
 page.close();page=ctx.new_page();page.goto('http://127.0.0.1:4182/');page.wait_for_selector('.update-dialog[open]');assert page.evaluate('import("./release.js").then(m=>m.RELEASE)')=='0.28.0'
 page.locator('[data-update=now]').click();page.wait_for_function('navigator.serviceWorker.controller?.scriptURL.includes("release=0.29.0")');page.wait_for_function('import("./release.js").then(m=>m.RELEASE==="0.29.0")');assert page.evaluate('localStorage.getItem("fretboard-trainer:pilot:stable")')==before
 assert not errors,errors
 result={'actual_previous_zip':'v0.28','target':'0.29.0','refusal_keeps_old_version':True,'prompt_returns_next_launch':True,'accept_activates_new_worker':True,'progress_identical':True,'errors':errors};Path('docs/v0.29/verification-mise-a-jour.json').write_text(json.dumps(result,indent=2));print(json.dumps(result));b.close()
server.shutdown()
