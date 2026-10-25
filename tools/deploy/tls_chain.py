"""Supply missing public intermediates; retain system roots and hostname checks."""
import ssl,urllib.request,subprocess,tempfile
from pathlib import Path
URLS=('https://letsencrypt.org/certs/gen-y/int-yr1.pem','https://letsencrypt.org/certs/gen-y/root-yr-by-x1.pem')
def verified_context():
 context=ssl.create_default_context()
 with tempfile.TemporaryDirectory()as temp:
  paths=[]
  for i,url in enumerate(URLS):
   with urllib.request.urlopen(url,timeout=30)as response:
    if not response.url.startswith('https://letsencrypt.org/'):raise RuntimeError('Origine de certificat inattendue')
    data=response.read(65537)
   if len(data)>65536 or data.count(b'-----BEGIN CERTIFICATE-----')!=1:raise RuntimeError('Certificat intermédiaire invalide')
   path=Path(temp)/f'intermediate-{i}.pem';path.write_bytes(data);paths.append(path)
  chain=Path(temp)/'chain.pem';chain.write_bytes(b'\n'.join(p.read_bytes()for p in paths))
  # No partial-chain flag: each addition must chain to an existing system root.
  for path in paths:
   subprocess.run(['openssl','verify','-CAfile','/etc/ssl/certs/ca-certificates.crt','-untrusted',str(chain),str(path)],check=True,capture_output=True)
  context.load_verify_locations(cafile=str(chain))
 if not context.check_hostname or context.verify_mode!=ssl.CERT_REQUIRED:raise RuntimeError('Vérification TLS désactivée')
 print('Intermédiaires officiels vérifiés contre les racines système ; validation TLS stricte conservée.')
 return context
