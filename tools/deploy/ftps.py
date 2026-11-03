"""FTPS constrained to a sandbox prefix, or an explicitly promoted live archive."""
import argparse,ftplib,os,zipfile,json,hashlib,io,re,sys,html,time
from pathlib import Path,PurePosixPath
from tls_chain import verified_context
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from environments import files_from_zip,BUILD_RE,semver,lab_version,release_name
ALLOWED={'.js','.css','.html','.json','.svg','.png','.webp','.ttf','.woff','.woff2','.webmanifest','.txt'}
def prefixes(meta,channel):
 if meta.get('channel')!=channel:raise ValueError('Canal de l’archive incorrect')
 if channel=='sandbox':
  if not BUILD_RE.fullmatch(meta.get('build_id','')):raise ValueError('Identifiant interdit')
  return ['lab/builds/'+meta['build_id'],'lab']
 promotion=meta.get('promotion')
 if not promotion or not BUILD_RE.fullmatch(promotion.get('promoted_from','')):raise ValueError('Seule la promotion d’un essai est publiable en live')
 if os.environ.get('DFT_CONFIRM_PROMOTION')!='PUBLIER '+promotion['promoted_from']:raise ValueError('Publication live non confirmée')
 return ['']
def root(ftp):
 ftp.cwd('/');ftp._dft_directory=''
def read_remote(ftp,name):
 root(ftp)
 out=io.BytesIO()
 try:ftp.retrbinary('RETR '+name,out.write)
 except ftplib.error_perm as e:
  if str(e).startswith('550'):return None
  raise
 return out.getvalue()
def upload(ftp,prefix,name,data):
 path=PurePosixPath(prefix)/name
 if path.is_absolute() or '..'in path.parts:raise ValueError('Chemin interdit')
 directory=str(path.parent)
 if directory=='.':directory=''
 if getattr(ftp,'_dft_directory',None)!=directory:
  root(ftp)
  for part in path.parent.parts:
   if part=='.':continue
   try:ftp.cwd(part)
   except ftplib.error_perm:ftp.mkd(part);ftp.cwd(part)
  ftp._dft_directory=directory
 temporary=path.name+'.dft-upload';ftp.storbinary('STOR '+temporary,io.BytesIO(data))
 if ftp.size(temporary)!=len(data):raise ValueError('Taille incorrecte : '+name)
 ftp.rename(temporary,path.name)

def transfer_files(ftp,prefix,files,meta,channel,verify_only=False,force_full=False):
 """A successful manifest is invalidated before writes; interrupted retries send all."""
 started=time.monotonic();manifest_name='deployment-manifest.json';previous={}
 # Archived snapshots always remain complete and independently usable.
 if channel=='sandbox' and prefix=='lab' and not force_full:
  raw=read_remote(ftp,prefix+'/'+manifest_name)
  try:
   old=json.loads(raw) if raw else {}
   committed=json.loads(read_remote(ftp,prefix+'/build.json') or b'{}')
   if isinstance(old,dict) and isinstance(committed,dict) and old.get('schema')==1 and old.get('complete') is True and old.get('archive_sha256')==committed.get('sha256'):
    previous=old.get('files',{})
    if not isinstance(previous,dict):previous={}
  except (ValueError,TypeError):previous={}
 hashes={name:{'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)} for name,data in files.items()}
 skip=set();root(ftp)
 for name,item in hashes.items():
  if previous.get(name)!=item:continue
  try:
   if ftp.size(prefix+'/'+name)==item['bytes']:skip.add(name)
  except ftplib.error_perm:pass
 if verify_only:
  if len(skip)!=len(files):raise ValueError('Réutilisation incomplète : '+str(len(skip))+'/'+str(len(files)))
  print('DFT_REUSE_VERIFIED '+json.dumps({'files':len(skip),'bytes':sum(len(files[n]) for n in skip),'uploaded_files':0,'uploaded_bytes':0}),flush=True)
  return
 manifest={'schema':1,'complete':False,'archive_sha256':meta['sha256'],'files':hashes}
 if channel=='sandbox' and prefix=='lab':upload(ftp,prefix,manifest_name,json.dumps(manifest).encode())
 sent=0;sent_bytes=0
 rank={'index.html':1,'update.json':2,'sw.js':3}
 for name,data in sorted(files.items(),key=lambda x:(rank.get(x[0],0),x[0])):
  if name in skip:continue
  upload(ftp,prefix,name,data);sent+=1;sent_bytes+=len(data)
  if sent%20==0:print(f'DFT transfert {prefix}: {sent} fichiers envoyés, {len(skip)} réutilisés.',flush=True)
 report={'prefix':prefix,'uploaded_files':sent,'uploaded_bytes':sent_bytes,'reused_files':len(skip),'reused_bytes':sum(len(files[n]) for n in skip),'seconds':round(time.monotonic()-started,2)}
 print('DFT_TRANSFER '+json.dumps(report),flush=True)
 return manifest,report

def deploy(ftp,archive,meta,channel,force_full=False):
 targets=prefixes(meta,channel)
 if hashlib.sha256(Path(archive).read_bytes()).hexdigest()!=meta['sha256']:raise ValueError('Archive invalide')
 files=files_from_zip(archive)
 if any(PurePosixPath(n).suffix.lower()not in ALLOWED for n in files):raise ValueError('Type de fichier interdit')
 update=json.loads(files['update.json'])
 if update['version']!=meta['update_version'] or update.get('channel')!=channel:raise ValueError('Mise à jour incohérente')
 release=files['release.js'].decode()
 if not re.search(r'const CHANNEL=[\'"]'+channel+r'[\'"]',release):raise ValueError('Environnement incorrect')
 root(ftp);before=read_remote(ftp,'update.json')
 if channel=='sandbox':
  current=read_remote(ftp,'lab/update.json')
  if current and semver(json.loads(current)['version'])>semver(meta['update_version']):raise ValueError('Cet essai est ancien : ouvrir sa copie archivée, sans remplacer le bac à sable courant')
  raw=read_remote(ftp,'lab/versions.json');history=json.loads(raw) if raw else {'schema':1,'builds':[]}
  if history.get('schema')!=1 or not isinstance(history.get('builds'),list):raise ValueError('Historique des essais illisible')
  for item in history['builds']:
   if item['build_id']==meta['build_id']:
    if item['sha256']!=meta['sha256']:raise ValueError('Un essai archivé ne peut pas être modifié')
   elif lab_version(item)==lab_version(meta):raise ValueError('Ce numéro d’essai est déjà réservé')
  # Reserve before transfer so an interrupted job cannot reuse a trial number.
  history['builds']=[{**meta,'status':'preparing'}]+[x for x in history['builds'] if x['build_id']!=meta['build_id']]
  upload(ftp,'lab','versions.json',json.dumps(history,indent=2).encode())
 for prefix in targets:
  if channel=='sandbox' and prefix.startswith('lab/builds/'):
   root(ftp);existing=read_remote(ftp,prefix+'/build.json')
   if existing:
    if json.loads(existing)['sha256']!=meta['sha256']:raise ValueError('Un essai archivé ne peut pas être modifié')
    continue
  manifest,report=transfer_files(ftp,prefix,files,meta,channel,force_full=force_full)
  if channel=='sandbox':
   if prefix.startswith('lab/builds/'):upload(ftp,prefix,'application.zip',Path(archive).read_bytes())
   upload(ftp,prefix,'build.json',json.dumps(meta,indent=2).encode())
   if prefix=='lab':
    manifest['complete']=True
    upload(ftp,prefix,'deployment-manifest.json',json.dumps(manifest).encode())
 if channel=='sandbox':
  root(ftp)
  raw=read_remote(ftp,'lab/versions.json');history=json.loads(raw) if raw else {'schema':1,'builds':[]}
  if history.get('schema')!=1 or not isinstance(history.get('builds'),list):raise ValueError('Historique des essais illisible : arrêt sans remplacement')
  for item in history['builds']:
   if not BUILD_RE.fullmatch(item.get('build_id','')):raise ValueError('Identifiant d’historique invalide')
  history['builds']=[{**meta,'status':'ready'}]+[x for x in history['builds'] if x['build_id']!=meta['build_id']]
  rows=''.join('<li><a class="button secondary" href="./builds/'+item['build_id']+'/">v'+html.escape(lab_version(item))+'</a><p>Prochaine release v'+html.escape(release_name(item['version']))+' · <small>'+html.escape(item['build_id'])+'</small></p></li>' for item in history['builds'] if item.get('status','ready')=='ready')
  page='<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DFT · Historique des essais</title><link rel="stylesheet" href="./tokens.css"><link rel="stylesheet" href="./style.css"><link rel="stylesheet" href="./components.css"></head><body><main class="content" style="max-width:900px;margin:auto"><h1>Historique des essais</h1><p>Chaque lien ouvre une copie conservée du bac à sable. Le live reste indépendant.</p><p><a class="button primary" href="./">Bac à sable courant</a></p><ul style="list-style:none;padding:0;display:grid;gap:16px">'+rows+'</ul></main></body></html>'
  upload(ftp,'lab','versions.json',json.dumps(history,indent=2).encode());upload(ftp,'lab','versions.html',page.encode())
  root(ftp)
  if read_remote(ftp,'update.json')!=before:raise ValueError('Le manifeste live a changé pendant le transfert')
 print(f'DFT {channel} : {len(files)} fichiers statiques par copie, TLS strict. API exclue, aucune suppression. Live inchangé.' if channel=='sandbox' else f'DFT live {meta["version"]} : {len(files)} fichiers statiques promus, TLS strict, aucune suppression.')
def main():
 p=argparse.ArgumentParser();p.add_argument('--channel',choices=['sandbox','live'],required=True);p.add_argument('--archive',required=True);mode=p.add_mutually_exclusive_group();mode.add_argument('--verify-reuse',action='store_true');mode.add_argument('--full',action='store_true');a=p.parse_args();archive=Path(a.archive);meta=json.loads(archive.with_suffix('.json').read_text())
 host=os.environ['DFT_FTP_HOST'];assert host=='gout.o2switch.net','Hôte inattendu';ftp=ftplib.FTP_TLS(context=verified_context(),timeout=60)
 try:
  ftp.connect(host,21);ftp.auth();ftp.login(os.environ['DFT_FTP_USERNAME'],os.environ['DFT_FTP_PASSWORD']);ftp.prot_p();ftp.cwd('/');assert ftp.pwd()=='/'
  assert not any(x.strip('/').lower()in {'wp-admin','wp-content','wp-config.php','public_html','media.lecompositeur.com'}for x in ftp.nlst()),'Racine trop large'
  if a.verify_reuse:
   if a.channel!='sandbox':raise ValueError('Vérification réservée au lab')
   prefixes(meta,a.channel)
   if hashlib.sha256(archive.read_bytes()).hexdigest()!=meta['sha256']:raise ValueError('Archive invalide')
   transfer_files(ftp,'lab',files_from_zip(archive),meta,'sandbox',verify_only=True)
  else:deploy(ftp,archive,meta,a.channel,force_full=a.full)
 finally:
  try:ftp.quit()
  except Exception:ftp.close()
if __name__=='__main__':main()
