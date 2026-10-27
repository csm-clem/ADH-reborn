"""Deterministic, isolated sandbox builds and promotion of a previously tested archive."""
from pathlib import Path,PurePosixPath
import argparse,hashlib,json,re,shutil,zipfile,urllib.request,urllib.error,subprocess
ROOT=Path(__file__).resolve().parent.parent
TYPES={'feature','improvement','bug','event'}
BUILD_RE=re.compile(r'b[0-9]{6,}-[a-f0-9]{8,40}')
def semver(v):
 if not re.fullmatch(r'\d+\.\d+\.\d+',v or ''):raise ValueError('Version invalide : trois nombres requis')
 return tuple(map(int,v.split('.')))
def normalize_release(value):
 value=(value or '').removeprefix('v')
 if re.fullmatch(r'\d+\.\d+',value):value+='.0'
 parts=semver(value)
 if parts[2]!=0:raise ValueError('Une release live utilise deux nombres ; le troisième est réservé aux essais')
 return '.'.join(map(str,parts))
def release_name(value):return '.'.join(map(str,semver(normalize_release(value))[:2]))
def lab_version(meta):
 if meta.get('lab_version'):return meta['lab_version']
 target=release_name(meta['version']);update=semver(meta['update_version'])
 # The first archived trial used 0.0.N. Its archive remains unchanged.
 return target+'.'+str(update[2])
def next_iteration(target,history):
 line=release_name(target);numbers=[]
 for item in history.get('builds',[]):
  if release_name(item['version'])==line:numbers.append(semver(lab_version(item))[2])
 return max(numbers,default=0)+1
def remote_iteration(target,number,commit):
 base='https://media.lecompositeur.com/DFT/lab/';build=f'b{number:06d}-{commit[:12]}'
 try:existing=get_json(base+'builds/'+build+'/build.json')
 except urllib.error.HTTPError as e:
  if e.code!=404:raise
 else:
  if existing['source_commit']!=commit or normalize_release(existing['version'])!=normalize_release(target):raise ValueError('Identité d’essai déjà utilisée')
  return semver(lab_version(existing))[2]
 try:history=get_json(base+'versions.json')
 except urllib.error.HTTPError as e:
  if e.code!=404:raise
  history={'builds':[]}
 for item in history.get('builds',[]):
  if item['build_id']==build:
   if item['source_commit']!=commit or normalize_release(item['version'])!=normalize_release(target):raise ValueError('Réservation d’essai incohérente')
   return semver(lab_version(item))[2]
 return next_iteration(target,history)
def digest(value):return hashlib.sha256(json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=True).encode()).hexdigest()
def ledger_valid(x):
 if x.get('schema')!=1:raise ValueError('Format du registre live invalide')
 semver(x['live_version'])
 if not isinstance(x.get('history'),list) or not x['history']:raise ValueError('Historique live manquant')
 if len(set(x['included_change_ids']))!=len(x['included_change_ids']):raise ValueError('Identifiants live dupliqués')
 for e in x['history']:
  if not isinstance(e['version'],str) or not e['title'] or not e['items']:raise ValueError('Entrée live invalide')
  for t,text in e['items']:
   if t not in TYPES or not isinstance(text,str) or not text.strip():raise ValueError('Changement invalide')
 return x

def get_json(url):
 req=urllib.request.Request(url,headers={'Cache-Control':'no-cache'})
 with urllib.request.urlopen(req,timeout=45) as r:return json.load(r)
def current_live():
 base='https://media.lecompositeur.com/DFT/'
 version=get_json(base+'update.json')['version']
 try:value=get_json(base+'release-ledger.json')
 except urllib.error.HTTPError as e:
  if e.code!=404:raise
  value=json.loads((ROOT/'release-ledger.json').read_text())
 value=ledger_valid(value)
 if value['live_version']!=version:raise ValueError('Registre live et version publique différents : arrêt')
 return value

def files_from_zip(archive):
 with zipfile.ZipFile(archive) as z:
  if z.testzip():raise ValueError('Archive corrompue')
  result={}
  for name in z.namelist():
   p=PurePosixPath(name)
   if p.is_absolute() or '..' in p.parts or '\\' in name or not p.parts or name in result:raise ValueError('Chemin d’archive interdit')
   if name.endswith('/'):continue
   if p.parts[0]=='api':continue
   result[name]=z.read(name)
  return result

def set_const(text,name,value):
 text,n=re.subn(r"(\b(?:export )?const "+re.escape(name)+r"=)[^;]+;",lambda m:m[1]+json.dumps(value,ensure_ascii=True)+';',text,count=1)
 if n!=1:raise ValueError('Constante manquante : '+name)
 return text

def environment(files,channel,version,update_version,build_id,history):
 f=dict(files);s=f['release.js'].decode()
 for k,v in {'RELEASE':version,'CHANNEL':channel,'BUILD_ID':build_id,'UPDATE_VERSION':update_version,'STORAGE_PREFIX':'fretboard-trainer:sandbox' if channel=='sandbox' else 'fretboard-trainer'}.items():s=set_const(s,k,v)
 f['release.js']=s.encode()
 sw=set_const(f['sw.js'].decode(),'WORKER_RELEASE',update_version)
 sw=sw.replace('`fretboard-trainer-v${WORKER_RELEASE}:','`fretboard-trainer-sandbox-v${WORKER_RELEASE}:') if channel=='sandbox' else sw.replace('`fretboard-trainer-sandbox-v${WORKER_RELEASE}:','`fretboard-trainer-v${WORKER_RELEASE}:')
 f['sw.js']=sw.encode();f['update.json']=json.dumps({'version':update_version,'channel':channel,'build_id':build_id,'url':'./'}).encode()
 f['release-history.js']=('export const LIVE_RELEASES='+json.dumps(history['history'],ensure_ascii=True)+';\n').encode()
 f['release-ledger.json']=(json.dumps(history,ensure_ascii=True,indent=2)+'\n').encode()
 manifest=json.loads(f['manifest.webmanifest'])
 manifest.update(name='DFT — Bac à sable' if channel=='sandbox' else 'Daily Fretboard Trainer',short_name='DFT Lab' if channel=='sandbox' else 'Daily Fretboard')
 f['manifest.webmanifest']=json.dumps(manifest,ensure_ascii=True,indent=2).encode()
 html=f['index.html'].decode()
 if channel=='sandbox':html=html.replace('<head>','<head>\n<meta name="robots" content="noindex,nofollow">',1)
 else:html=html.replace('<meta name="robots" content="noindex,nofollow">','')
 f['index.html']=html.encode()
 return f

def archive_files(files,path):
 path=Path(path);path.parent.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(path,'w',zipfile.ZIP_DEFLATED) as z:
  for name,data in sorted(files.items()):
   info=zipfile.ZipInfo(name,date_time=(2020,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,data)
 return {'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size}

def make_sandbox(source,number,commit,ledger,pending,output,iteration=None):
 ledger=ledger_valid(ledger);target=normalize_release(pending['target_release'])
 if semver(target)<=semver(ledger['live_version']):raise ValueError('Préparer le prochain numéro candidat après la publication live')
 if not re.fullmatch(r'[a-f0-9]{8,40}',commit) or not isinstance(number,int) or number<1:raise ValueError('Identité d’essai invalide')
 iteration=number if iteration is None else iteration
 if not isinstance(iteration,int) or iteration<1:raise ValueError('Compteur d’essai invalide')
 trial=release_name(target)+'.'+str(iteration)
 build=f'b{number:06d}-{commit[:12]}';changes=[c for c in pending['changes'] if c['id'] not in ledger['included_change_ids']]
 if len({c['id'] for c in changes})!=len(changes):raise ValueError('Changements en double')
 for c in changes:
  if c['type'] not in TYPES or not c['text'].strip() or not re.fullmatch('[a-z0-9-]+',c['id']):raise ValueError('Changement candidat invalide')
 files={p.relative_to(source).as_posix():p.read_bytes() for p in Path(source).rglob('*') if p.is_file() and p.relative_to(source).parts[0]!='api'}
 candidate={'schema':1,'build_id':build,'lab_version':trial,'iteration':iteration,'source_commit':commit,'target_release':target,'title':pending['title'],'base_live_digest':digest(ledger),'base_live_version':ledger['live_version'],'changes':changes}
 files=environment(files,'sandbox',target,trial,build,ledger)
 files['candidate.json']=json.dumps(candidate,ensure_ascii=True,indent=2).encode()
 files['LISEZ-MOI.txt']=f'DFT — Bac à sable v{trial}\nEssai technique : {build}\nProgression indépendante du live.\n'.encode()
 path=Path(output)/(build+'.zip');meta={'schema':1,'channel':'sandbox','build_id':build,'version':target,'lab_version':trial,'iteration':iteration,'update_version':trial,'source_commit':commit,'base_live_version':ledger['live_version'],**archive_files(files,path)}
 path.with_suffix('.json').write_text(json.dumps(meta,indent=2)+'\n')
 return path,meta

def promote(archive,meta,ledger,version,title,confirmation,output):
 ledger=ledger_valid(ledger);version=normalize_release(version)
 if meta.get('channel')!='sandbox' or not BUILD_RE.fullmatch(meta.get('build_id','')):raise ValueError('Essai non valide')
 if confirmation!='PUBLIER '+meta['build_id']:raise ValueError('La publication exige la confirmation de cet essai précis')
 if hashlib.sha256(Path(archive).read_bytes()).hexdigest()!=meta['sha256']:raise ValueError('Empreinte de l’essai incorrecte')
 files=files_from_zip(archive);candidate=json.loads(files['candidate.json'])
 if candidate['build_id']!=meta['build_id'] or digest(ledger)!=candidate['base_live_digest']:raise ValueError('Le live a changé depuis cet essai : reconstruire et vérifier le candidat')
 if semver(version)<=semver(ledger['live_version']):raise ValueError('La version live doit avancer')
 if not title.strip() or not candidate['changes']:raise ValueError('Titre ou changements manquants')
 approved=list(dict.fromkeys(ledger['included_change_ids']+[c['id'] for c in candidate['changes']]))
 if version!=normalize_release(candidate['target_release']):raise ValueError('La release doit correspondre à celle préparée par cet essai')
 entry={'version':release_name(version),'title':title,'items':[[c['type'],c['text']] for c in candidate['changes']]}
 new_ledger={'schema':1,'live_version':version,'history':[entry]+ledger['history'],'included_change_ids':approved}
 files=environment(files,'live',version,version,'live-'+version,new_ledger);files.pop('candidate.json',None)
 receipt={'schema':1,'version':version,'promoted_from':meta['build_id'],'source_commit':meta['source_commit'],'sandbox_sha256':meta['sha256'],'included_change_ids':approved}
 files['promotion-receipt.json']=json.dumps(receipt,indent=2).encode()
 path=Path(output)/('daily-fretboard-trainer-v'+release_name(version)+'.zip')
 result={'schema':1,'channel':'live','version':version,'update_version':version,'promotion':receipt,**archive_files(files,path)}
 path.with_suffix('.json').write_text(json.dumps(result,indent=2)+'\n');return path,result

def main():
 p=argparse.ArgumentParser();p.add_argument('command',choices=['sandbox','promote']);p.add_argument('--number',type=int);p.add_argument('--commit');p.add_argument('--ledger');p.add_argument('--build');p.add_argument('--version');p.add_argument('--title');p.add_argument('--confirmation');p.add_argument('--output',default='downloads/sandbox');a=p.parse_args()
 ledger=json.loads(Path(a.ledger).read_text()) if a.ledger else current_live()
 if a.command=='sandbox':
  commit=a.commit or subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
  pending=json.loads((ROOT/'pending-changes.json').read_text())
  iteration=a.number if a.ledger else remote_iteration(pending['target_release'],a.number,commit)
  path,meta=make_sandbox(ROOT/'dist',a.number,commit,ledger,pending,ROOT/a.output,iteration=iteration)
  destination=ROOT/'dist-sandbox'
  if destination.exists():shutil.rmtree(destination)
  for name,data in files_from_zip(path).items():
   f=destination/name;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(data)
 else:
  if not BUILD_RE.fullmatch(a.build or ''):raise ValueError('Identifiant d’essai invalide')
  base='https://media.lecompositeur.com/DFT/lab/builds/'+a.build+'/'
  meta=get_json(base+'build.json');folder=ROOT/'work/promotion';folder.mkdir(parents=True,exist_ok=True);archive=folder/'tested-sandbox.zip'
  with urllib.request.urlopen(base+'application.zip',timeout=60) as r:archive.write_bytes(r.read())
  path,meta=promote(archive,meta,ledger,a.version,a.title,a.confirmation,ROOT/a.output)
 print(json.dumps({'archive':str(path),'metadata':str(path.with_suffix('.json')),'channel':meta['channel'],'build_id':meta.get('build_id'),'lab_version':meta.get('lab_version'),'version':meta['version']}))
if __name__=='__main__':main()
