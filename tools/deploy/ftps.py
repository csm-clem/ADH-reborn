"""FTPS constrained to a sandbox prefix, or an explicitly promoted live archive."""
import argparse,ftplib,os,zipfile,json,hashlib,io,re,sys,html
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
def read_remote(ftp,name):
 out=io.BytesIO()
 try:ftp.retrbinary('RETR '+name,out.write)
 except ftplib.error_perm as e:
  if str(e).startswith('550'):return None
  raise
 return out.getvalue()
def upload(ftp,prefix,name,data):
 path=PurePosixPath(prefix)/name
 if path.is_absolute() or '..'in path.parts:raise ValueError('Chemin interdit')
 ftp.cwd('/')
 for part in path.parent.parts:
  try:ftp.cwd(part)
  except ftplib.error_perm:ftp.mkd(part);ftp.cwd(part)
 temporary=path.name+'.dft-upload';ftp.storbinary('STOR '+temporary,io.BytesIO(data));assert ftp.size(temporary)==len(data),'Taille incorrecte';ftp.rename(temporary,path.name)
def deploy(ftp,archive,meta,channel):
 targets=prefixes(meta,channel)
 if hashlib.sha256(Path(archive).read_bytes()).hexdigest()!=meta['sha256']:raise ValueError('Archive invalide')
 files=files_from_zip(archive)
 if any(PurePosixPath(n).suffix.lower()not in ALLOWED for n in files):raise ValueError('Type de fichier interdit')
 update=json.loads(files['update.json'])
 if update['version']!=meta['update_version'] or update.get('channel')!=channel:raise ValueError('Mise à jour incohérente')
 release=files['release.js'].decode()
 if not re.search(r'const CHANNEL=[\'"]'+channel+r'[\'"]',release):raise ValueError('Environnement incorrect')
 rank={'index.html':1,'update.json':2,'sw.js':3}
 ftp.cwd('/');before=read_remote(ftp,'update.json')
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
   ftp.cwd('/');existing=read_remote(ftp,prefix+'/build.json')
   if existing:
    if json.loads(existing)['sha256']!=meta['sha256']:raise ValueError('Un essai archivé ne peut pas être modifié')
    continue
  for name,data in sorted(files.items(),key=lambda x:(rank.get(x[0],0),x[0])):upload(ftp,prefix,name,data)
  if channel=='sandbox':
   if prefix.startswith('lab/builds/'):upload(ftp,prefix,'application.zip',Path(archive).read_bytes())
   upload(ftp,prefix,'build.json',json.dumps(meta,indent=2).encode())
 if channel=='sandbox':
  ftp.cwd('/')
  raw=read_remote(ftp,'lab/versions.json');history=json.loads(raw) if raw else {'schema':1,'builds':[]}
  if history.get('schema')!=1 or not isinstance(history.get('builds'),list):raise ValueError('Historique des essais illisible : arrêt sans remplacement')
  for item in history['builds']:
   if not BUILD_RE.fullmatch(item.get('build_id','')):raise ValueError('Identifiant d’historique invalide')
  history['builds']=[{**meta,'status':'ready'}]+[x for x in history['builds'] if x['build_id']!=meta['build_id']]
  rows=''.join('<li><a class="button secondary" href="./builds/'+item['build_id']+'/">v'+html.escape(lab_version(item))+'</a><p>Prochaine release v'+html.escape(release_name(item['version']))+' · <small>'+html.escape(item['build_id'])+'</small></p></li>' for item in history['builds'] if item.get('status','ready')=='ready')
  page='<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DFT · Historique des essais</title><link rel="stylesheet" href="./tokens.css"><link rel="stylesheet" href="./style.css"><link rel="stylesheet" href="./components.css"></head><body><main class="content" style="max-width:900px;margin:auto"><h1>Historique des essais</h1><p>Chaque lien ouvre une copie conservée du bac à sable. Le live reste indépendant.</p><p><a class="button primary" href="./">Bac à sable courant</a></p><ul style="list-style:none;padding:0;display:grid;gap:16px">'+rows+'</ul></main></body></html>'
  upload(ftp,'lab','versions.json',json.dumps(history,indent=2).encode());upload(ftp,'lab','versions.html',page.encode())
  ftp.cwd('/')
  if read_remote(ftp,'update.json')!=before:raise ValueError('Le manifeste live a changé pendant le transfert')
 print(f'DFT {channel} : {len(files)} fichiers statiques par copie, TLS strict. API exclue, aucune suppression. Live inchangé.' if channel=='sandbox' else f'DFT live {meta["version"]} : {len(files)} fichiers statiques promus, TLS strict, aucune suppression.')
def main():
 p=argparse.ArgumentParser();p.add_argument('--channel',choices=['sandbox','live'],required=True);p.add_argument('--archive',required=True);a=p.parse_args();archive=Path(a.archive);meta=json.loads(archive.with_suffix('.json').read_text())
 host=os.environ['DFT_FTP_HOST'];assert host=='gout.o2switch.net','Hôte inattendu';ftp=ftplib.FTP_TLS(context=verified_context(),timeout=60)
 try:
  ftp.connect(host,21);ftp.auth();ftp.login(os.environ['DFT_FTP_USERNAME'],os.environ['DFT_FTP_PASSWORD']);ftp.prot_p();ftp.cwd('/');assert ftp.pwd()=='/'
  assert not any(x.strip('/').lower()in {'wp-admin','wp-content','wp-config.php','public_html','media.lecompositeur.com'}for x in ftp.nlst()),'Racine trop large'
  deploy(ftp,archive,meta,a.channel)
 finally:
  try:ftp.quit()
  except Exception:ftp.close()
if __name__=='__main__':main()
