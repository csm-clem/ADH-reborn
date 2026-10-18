from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread
import json,time
root=Path(__file__).resolve().parents[2]/'dist';version='0.23.0'
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(root),**kw)
 def log_message(self,*a):pass
 def do_GET(self):
  path=self.path.split('?')[0]
  if path in ['/sw.js','/release.js','/update.json']:
   text=(root/path[1:]).read_text().replace('0.23.0',version);self.send_response(200);self.send_header('Content-Type','application/json' if path.endswith('json') else 'text/javascript');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(text.encode())
  else:super().do_GET()
server=ThreadingHTTPServer(('127.0.0.1',4181),Handler);Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context();page=ctx.new_page();page.set_default_timeout(10000);page.goto('http://127.0.0.1:4181/');page.evaluate('navigator.serviceWorker.ready');page.wait_for_function('navigator.serviceWorker.controller!==null')
 page.evaluate('''async()=>{const {initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{pilotPlan}=await import('./pilot.js'),{simulatedCompletion}=await import('./debug-mode.js');const profile=makeProfile('guitar6'),store=simulatedCompletion(profile,pilotPlan(profile));localStorage.setItem('fretboard-trainer:settings',JSON.stringify({...initialState(),profile,beginnerGuide:true}));localStorage.setItem('fretboard-trainer:pilot:stable',JSON.stringify(store));}''');page.reload();before=page.evaluate('localStorage.getItem("fretboard-trainer:pilot:stable")');print('installed23',flush=True)
 version='0.24.0'
 page.evaluate('navigator.serviceWorker.getRegistration().then(r=>r.update()).catch(()=>{})');page.wait_for_timeout(1500)
 page.reload();page.wait_for_selector('.update-dialog[open]');assert page.evaluate('import("./release.js").then(m=>m.RELEASE)')=='0.23.0';page.locator('[data-update=later]').click();page.close();page=ctx.new_page();page.goto('http://127.0.0.1:4181/');page.wait_for_selector('.update-dialog[open]');assert page.evaluate('import("./release.js").then(m=>m.RELEASE)')=='0.23.0';print('declined survives all tabs closed',flush=True)
 page.locator('[data-update=now]').click();page.wait_for_function('navigator.serviceWorker.controller?.scriptURL.includes("release=0.24.0")');page.wait_for_function('import("./release.js").then(m=>m.RELEASE==="0.24.0")');assert page.evaluate('localStorage.getItem("fretboard-trainer:pilot:stable")')==before;print(json.dumps({'refusal_survives_browser_tabs_close':True,'same_path_update_activated_after_acceptance':True,'all_progress_preserved':True}),flush=True);b.close()
server.shutdown()
