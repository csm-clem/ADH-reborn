"""Transfer savings, corruption recovery and directory traversal cost."""
import environments_test as fixtures
from environments_test import FTP
from ftps import deploy,upload,transfer_files
import unittest,json,io,ftplib

class MeteredFTP(FTP):
 def __init__(self):super().__init__();self.sent=[];self.cwds=0;self.fail_at=None
 def cwd(self,p):self.cwds+=1;super().cwd(p)
 def size(self,name):
  try:return super().size(name)
  except KeyError:raise ftplib.error_perm('550 Missing')
 def storbinary(self,c,stream):
  data=stream.read();name=(self.folder+'/' if self.folder else '')+c.removeprefix('STOR ')
  if self.fail_at and self.fail_at in name:raise ConnectionError('simulated interruption')
  self.sent.append((name,len(data)));super().storbinary(c,io.BytesIO(data))
class EconomyTests(unittest.TestCase):
 build=fixtures.EnvironmentTests.build
 def setUp(self):
  fixtures.EnvironmentTests.setUp(self);(self.source/'art.webp').write_bytes(b'a'*1_000_000)
 def test_second_trial_reuses_large_asset_but_archive_is_complete(self):
  ftp=MeteredFTP();a,m=self.build();deploy(ftp,a,m,'sandbox');ftp.sent=[]
  from environments import make_sandbox
  (self.source/'app.js').write_text('// only CSS/JS-like change')
  a2,m2=make_sandbox(self.source,2,'b'*40,self.ledger,self.pending,self.root/'next');deploy(ftp,a2,m2,'sandbox')
  names=[n for n,_ in ftp.sent];self.assertNotIn('lab/art.webp.dft-upload',names)
  self.assertIn('lab/builds/'+m2['build_id']+'/art.webp.dft-upload',names)
  self.assertEqual(ftp.files['lab/art.webp'],b'a'*1_000_000)
  self.assertTrue(json.loads(ftp.files['lab/deployment-manifest.json'])['complete'])
 def test_missing_and_truncated_assets_are_repaired(self):
  for content in [None,b'x']:
   ftp=MeteredFTP();a,m=self.build();deploy(ftp,a,m,'sandbox')
   if content is None:del ftp.files['lab/art.webp']
   else:ftp.files['lab/art.webp']=content
   ftp.sent=[];deploy(ftp,a,m,'sandbox');self.assertIn('lab/art.webp.dft-upload',[n for n,_ in ftp.sent]);self.assertEqual(ftp.files['lab/art.webp'],b'a'*1_000_000)
 def test_invalid_and_incomplete_manifests_force_safe_full_transfer(self):
  for value in [b'broken',b'[]',b'{"schema":1,"complete":false}',b'{"schema":1,"complete":true,"archive_sha256":"wrong"}']:
   ftp=MeteredFTP();a,m=self.build();deploy(ftp,a,m,'sandbox');ftp.files['lab/deployment-manifest.json']=value;ftp.sent=[];deploy(ftp,a,m,'sandbox')
   self.assertIn('lab/art.webp.dft-upload',[n for n,_ in ftp.sent])
 def test_interruption_invalidates_previous_manifest_and_retry_recovers(self):
  ftp=MeteredFTP();a,m=self.build();deploy(ftp,a,m,'sandbox');(self.source/'app.js').write_text('// changed')
  from environments import make_sandbox
  a2,m2=make_sandbox(self.source,2,'b'*40,self.ledger,self.pending,self.root/'next');ftp.fail_at='lab/app.js.dft-upload'
  with self.assertRaises(ConnectionError):deploy(ftp,a2,m2,'sandbox')
  self.assertFalse(json.loads(ftp.files['lab/deployment-manifest.json'])['complete'])
  ftp.fail_at=None;deploy(ftp,a2,m2,'sandbox');self.assertEqual(ftp.files['lab/app.js'],b'// changed');self.assertTrue(json.loads(ftp.files['lab/deployment-manifest.json'])['complete'])
 def test_read_only_reuse_verification_sends_nothing_and_detects_damage(self):
  ftp=MeteredFTP();a,m=self.build();deploy(ftp,a,m,'sandbox');before=dict(ftp.files);ftp.sent=[]
  from environments import files_from_zip
  transfer_files(ftp,'lab',files_from_zip(a),m,'sandbox',verify_only=True)
  self.assertEqual(ftp.sent,[]);self.assertEqual(ftp.files,before)
  ftp.files['lab/art.webp']=b'bad'
  with self.assertRaisesRegex(ValueError,'Réutilisation incomplète'):transfer_files(ftp,'lab',files_from_zip(a),m,'sandbox',verify_only=True)
 def test_full_mode_repairs_same_size_external_modification(self):
  ftp=MeteredFTP();a,m=self.build();deploy(ftp,a,m,'sandbox');ftp.files['lab/art.webp']=b'b'*1_000_000
  deploy(ftp,a,m,'sandbox',force_full=True);self.assertEqual(ftp.files['lab/art.webp'],b'a'*1_000_000)
 def test_repeated_folder_uploads_avoid_repeated_cwd_commands(self):
  ftp=MeteredFTP()
  for i in range(100):upload(ftp,'lab','art/raster/'+str(i)+'.webp',b'a')
  self.assertLessEqual(ftp.cwds,4)

if __name__=='__main__':unittest.main()
