"""Upload only the verified v0.34 static archive to a dedicated FTPS account root."""
import ftplib,ssl,os,zipfile,json,hashlib,io
from pathlib import PurePosixPath,Path
from tls_chain import verified_context
archive=Path('downloads/daily-fretboard-trainer-v0.34.zip');meta=json.loads(archive.with_suffix('.json').read_text())
assert meta['version']=='0.34.0' and hashlib.sha256(archive.read_bytes()).hexdigest()==meta['sha256'],'Archive invalide'
allowed={'.js','.css','.html','.json','.svg','.png','.webp','.ttf','.woff','.woff2','.webmanifest','.txt'}
files=[]
with zipfile.ZipFile(archive)as z:
 assert z.testzip() is None
 for name in z.namelist():
  p=PurePosixPath(name)
  assert not p.is_absolute() and '..'not in p.parts
  if p.parts[0]=='api':continue
  assert p.suffix.lower()in allowed, 'Type interdit'
  files.append((name,z.read(name)))
 assert json.loads(z.read('update.json'))['version']=='0.34.0'
host=os.environ['DFT_FTP_HOST'];assert host=='gout.o2switch.net','Hôte inattendu'
ftp=ftplib.FTP_TLS(context=verified_context(),timeout=60)
try:
 ftp.connect(host,21);ftp.auth();ftp.login(os.environ['DFT_FTP_USERNAME'],os.environ['DFT_FTP_PASSWORD']);ftp.prot_p();ftp.cwd('/')
 assert ftp.pwd()=='/','Compte non limité à sa racine'
 existing=set(ftp.nlst())
 assert not any(x.strip('/').lower()in {'wp-admin','wp-content','wp-config.php','public_html','media.lecompositeur.com'}for x in existing),'Racine trop large'
 # Assets first; entrypoints last. No deletion or directory traversal.
 rank={'index.html':1,'update.json':2,'sw.js':3}
 for name,data in sorted(files,key=lambda x:(rank.get(x[0],0),x[0])):
  parent=PurePosixPath(name).parent
  ftp.cwd('/')
  for part in parent.parts:
   try:ftp.cwd(part)
   except ftplib.error_perm:ftp.mkd(part);ftp.cwd(part)
  filename=PurePosixPath(name).name;temporary=filename+'.dft-upload'
  ftp.storbinary('STOR '+temporary,io.BytesIO(data))
  assert ftp.size(temporary)==len(data),'Taille incorrecte'
  ftp.rename(temporary,filename)
 print(f'DFT 0.34.0 : {len(files)} fichiers statiques transférés. API exclue. Aucune suppression.')
finally:
 try:ftp.quit()
 except Exception:ftp.close()
