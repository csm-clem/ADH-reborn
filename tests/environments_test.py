from pathlib import Path
import sys,tempfile,json,unittest,os,io,ftplib,zipfile
from unittest.mock import patch
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'tools'));sys.path.insert(0,str(ROOT/'tools/deploy'))
from environments import make_sandbox,promote,files_from_zip,archive_files
from ftps import deploy,prefixes
class FTP:
 def __init__(self):self.files={'update.json':b'{"version":"0.37.0"}','index.html':b'LIVE'};self.folder=''
 def cwd(self,path):self.folder='' if path=='/' else '/'.join(filter(None,[self.folder,path]))
 def mkd(self,path):pass
 def retrbinary(self,command,callback):
  key=command.removeprefix('RETR ')
  if key not in self.files:raise ftplib.error_perm('550 Missing')
  callback(self.files[key])
 def storbinary(self,command,stream):self.files[self.folder+'/'+command.removeprefix('STOR ') if self.folder else command.removeprefix('STOR ')]=stream.read()
 def size(self,name):return len(self.files[self.folder+'/'+name if self.folder else name])
 def rename(self,a,b):
  prefix=self.folder+'/' if self.folder else '';self.files[prefix+b]=self.files.pop(prefix+a)
class EnvironmentTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup);self.root=Path(self.temp.name);self.source=self.root/'source';self.source.mkdir()
  files={'release.js':"export const RELEASE='0.38.0';export const CHANNEL='live';export const BUILD_ID='source';export const UPDATE_VERSION='0.38.0';export const STORAGE_PREFIX='fretboard-trainer';",'sw.js':"const WORKER_RELEASE='0.38.0';const CACHE=`fretboard-trainer-v${WORKER_RELEASE}:scope`;",'manifest.webmanifest':'{}','index.html':'<html><head></head><body></body></html>','app.js':'// code from the approved sandbox','release-history.js':'','release-ledger.json':'{}'}
  for name,text in files.items():(self.source/name).write_text(text)
  self.ledger={'schema':1,'live_version':'0.37.0','history':[{'version':'0.37','title':'Live','items':[['bug','Published correction']]}],'included_change_ids':[]}
  self.pending={'target_release':'0.38.0','title':'Next release','changes':[{'id':'one','type':'feature','text':'First intermediate change'},{'id':'two','type':'bug','text':'Second intermediate change'}]}
 def build(self):return make_sandbox(self.source,1,'a'*40,self.ledger,self.pending,self.root/'sandbox')
 def test_reproducible_isolated_build_and_unpublished_history(self):
  archive,meta=self.build();first=archive.read_bytes();self.build();self.assertEqual(first,archive.read_bytes())
  f=files_from_zip(archive);self.assertIn(b'"sandbox"',f['release.js']);self.assertIn(b'fretboard-trainer:sandbox',f['release.js']);self.assertEqual(json.loads(f['update.json'])['version'],'0.0.1');self.assertEqual(json.loads(f['release-ledger.json']),self.ledger);self.assertNotIn(b'First intermediate change',f['release-history.js'])
 def test_promotion_requires_exact_approval_and_fresh_live(self):
  archive,meta=self.build()
  with self.assertRaisesRegex(ValueError,'confirmation'):promote(archive,meta,self.ledger,'0.38.0','Release','',self.root/'live')
  changed={**self.ledger,'live_version':'0.37.1'}
  with self.assertRaisesRegex(ValueError,'live a changé'):promote(archive,meta,changed,'0.38.0','Release','PUBLIER '+meta['build_id'],self.root/'live')
 def test_promotion_uses_tested_code_and_aggregates_intermediate_changes_once(self):
  archive,meta=self.build();(self.source/'app.js').write_text('// later unreviewed code')
  live,result=promote(archive,meta,self.ledger,'0.38.0','Release','PUBLIER '+meta['build_id'],self.root/'live');f=files_from_zip(live)
  self.assertEqual(f['app.js'],b'// code from the approved sandbox');self.assertIn(b'"live"',f['release.js']);self.assertNotIn(b'fretboard-trainer:sandbox',f['release.js']);self.assertEqual(json.loads(f['release-ledger.json'])['history'][0]['items'],[['feature','First intermediate change'],['bug','Second intermediate change']]);self.assertEqual(result['promotion']['sandbox_sha256'],meta['sha256'])
 def test_sandbox_upload_never_writes_live_and_snapshots_are_immutable(self):
  archive,meta=self.build();ftp=FTP();before=dict(ftp.files);deploy(ftp,archive,meta,'sandbox');self.assertTrue(all(k in before or k.startswith('lab/') for k in ftp.files));self.assertTrue(all(ftp.files[k]==v for k,v in before.items()))
  self.assertIn('lab/builds/'+meta['build_id']+'/application.zip',ftp.files)
  self.assertIn('lab/versions.html',ftp.files);self.assertEqual(json.loads(ftp.files['lab/versions.json'])['builds'][0]['build_id'],meta['build_id'])
  (self.source/'app.js').write_text('// changed');other,othermeta=self.build()
  with self.assertRaisesRegex(ValueError,'archivé'):deploy(ftp,other,othermeta,'sandbox')
 def test_live_prefix_is_unavailable_without_promoted_archive_and_confirmation(self):
  _,meta=self.build()
  with self.assertRaises(ValueError):prefixes(meta,'live')
  approved={'channel':'live','promotion':{'promoted_from':meta['build_id']}}
  with patch.dict(os.environ,{},clear=True):
   with self.assertRaises(ValueError):prefixes(approved,'live')
  with patch.dict(os.environ,{'DFT_CONFIRM_PROMOTION':'PUBLIER '+meta['build_id']}):self.assertEqual(prefixes(approved,'live'),[''])
 def test_old_sandbox_job_cannot_roll_back_the_current_sandbox(self):
  first,m1=self.build();ftp=FTP();deploy(ftp,first,m1,'sandbox')
  second,m2=make_sandbox(self.source,2,'b'*40,self.ledger,self.pending,self.root/'sandbox');deploy(ftp,second,m2,'sandbox')
  with self.assertRaisesRegex(ValueError,'ancien'):deploy(ftp,first,m1,'sandbox')
  self.assertEqual(json.loads(ftp.files['lab/update.json'])['version'],'0.0.2')
 def test_paths_and_digests_are_checked(self):
  archive,meta=self.build();archive.write_bytes(b'wrong')
  with self.assertRaisesRegex(ValueError,'Empreinte'):promote(archive,meta,self.ledger,'0.38.0','Release','PUBLIER '+meta['build_id'],self.root/'live')
  bad=self.root/'bad.zip'
  with zipfile.ZipFile(bad,'w')as z:z.writestr('../index.html','bad')
  with self.assertRaises(ValueError):files_from_zip(bad)
 def test_live_workflow_has_no_push_trigger(self):
  text=(ROOT/'.github/workflows/deploy-dft.yml').read_text();self.assertIn('workflow_dispatch:',text);self.assertNotIn('\n  push:',text)
if __name__=='__main__':unittest.main()
