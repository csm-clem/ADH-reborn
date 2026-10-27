"""Two sandbox iterations update independently while keeping the candidate release unchanged."""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright
import sys,json,zipfile
ROOT=Path.cwd();sys.path.insert(0,str(ROOT/'tools'))
from environments import make_sandbox,files_from_zip,environment
out=ROOT/'work/sandbox';out.mkdir(parents=True,exist_ok=True)
ledger=json.loads((ROOT/'release-ledger.json').read_text());pending=json.loads((ROOT/'pending-changes.json').read_text());folders=[]
for number in [101,102]:
 archive,meta=make_sandbox(ROOT/'dist',number,'a'*40,ledger,pending,out/'update-artifacts');folder=out/('iteration-'+str(number));folder.mkdir(exist_ok=True)
 files=files_from_zip(archive)
 # Legacy numbering must still upgrade into the release-based trial numbering.
 if number==101:files=environment(files,'sandbox',pending['target_release'],'0.0.101',meta['build_id'],ledger)
 for name,data in files.items():
  f=folder/name;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(data)
 folders.append(folder)
new_version='.'.join(pending['target_release'].split('.')[:2])+'.102'
root=folders[0];requests=[]
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(root),**kw)
 def log_message(self,*a):pass
 def do_GET(self):requests.append(self.path);super().do_GET()
 def end_headers(self):self.send_header('Cache-Control','no-store');super().end_headers()
server=ThreadingHTTPServer(('127.0.0.1',4183),Handler);Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright()as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context();q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.goto('http://127.0.0.1:4183/');q.evaluate('navigator.serviceWorker.ready');q.wait_for_function('navigator.serviceWorker.controller!==null')
 q.evaluate('''async()=>{const {storageService}=await import('./services/storage-service.js'),{initialState}=await import('./state.js'),{makeProfile}=await import('./core.js'),{initialPilotStore}=await import('./pilot.js');const profile=makeProfile('guitar6');storageService.saveSettings({...initialState(),profile,sound:false,beginnerGuide:true});const s=initialPilotStore();s.profiles[profile.key]={profile,attempts:[],later:[],navigation:{branch:'targeted',route:'z1',chapter:null}};storageService.savePilot(s);localStorage.setItem('fretboard-trainer:settings','LIVE-SETTINGS');localStorage.setItem('fretboard-trainer:pilot:stable','LIVE-PROGRESS');}''');q.reload();before=q.evaluate('localStorage.getItem("fretboard-trainer:sandbox:pilot:stable")')
 root=folders[1];q.reload();q.wait_for_selector('.update-dialog[open]');q.locator('[data-update=later]').click();assert q.evaluate('import("./release.js").then(m=>m.UPDATE_VERSION)')=='0.0.101'
 q.close();q=c.new_page();q.goto('http://127.0.0.1:4183/');q.wait_for_selector('.update-dialog[open]');q.locator('[data-update=now]').click();q.wait_for_function('version=>import("./release.js").then(m=>m.UPDATE_VERSION===version)',arg=new_version)
 assert q.evaluate('localStorage.getItem("fretboard-trainer:sandbox:pilot:stable")')==before
 assert q.evaluate('localStorage.getItem("fretboard-trainer:settings")')=='LIVE-SETTINGS';assert q.evaluate('localStorage.getItem("fretboard-trainer:pilot:stable")')=='LIVE-PROGRESS'
 assert q.evaluate('import("./release.js").then(m=>m.RELEASE)')==pending['target_release'];assert not any('/latest.json' in path for path in requests)
 assert not errors,errors
 (out/'sandbox-update.json').write_text(json.dumps({'from':'0.0.101','to':new_version,'same_candidate_release':True,'refusal_and_next_launch':True,'sandbox_progress_preserved':True,'live_settings_and_progress_untouched':True,'no_parent_update_check':True,'errors':errors},indent=2));b.close()
server.shutdown();print('Sandbox iteration update passed without touching live data.')
