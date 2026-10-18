"""Run against a local PHP server configured with a capture sendmail_path, never the live mailbox."""
import urllib.request,urllib.error,http.cookiejar,json,hashlib
from pathlib import Path
from email import policy
from email.parser import BytesParser
BASE='http://127.0.0.1:4174/api/bug-report.php'
rate=Path('/tmp')/('dft-report-'+hashlib.sha256(str(Path('api').resolve()).encode()).hexdigest()[:16])/(hashlib.sha256(b'127.0.0.1').hexdigest()+'.json')
rate.unlink(missing_ok=True)
client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
def request(data=None,token=None,origin='http://127.0.0.1:4174'):
 headers={'Origin':origin}
 if token:headers['X-DFT-Token']=token
 if data is not None:headers['Content-Type']='application/json'
 req=urllib.request.Request(BASE,data=json.dumps(data).encode() if data is not None else None,headers=headers)
 try:r=client.open(req)
 except urllib.error.HTTPError as e:r=e
 raw=r.read().decode();assert 'clement@' not in raw
 return r.status,json.loads(raw),r.headers
status,auth,headers=request();assert status==200 and len(auth['token'])==64;assert 'HttpOnly' in headers['Set-Cookie'] and 'SameSite=Strict' in headers['Set-Cookie'];assert headers['Cache-Control'].startswith('no-store')
payload={'description':'Test local : le bouton ne répond pas après une rotation.','replyTo':'test@example.org','website':'','configuration':{'release':'0.22.0','instrument':'Guitare 6 cordes','tuning':'40,45,50,55,59,64','theme':'accessible','viewport':'375 × 812','standalone':'non'}}
assert request(payload)[0]==403
assert request(payload,auth['token'],origin='https://autre.example')[0]==403
assert request({**payload,'description':'court'},auth['token'])[0]==422
assert request({**payload,'replyTo':'test@example.org\r\nBcc:attacker@example.org'},auth['token'])[0]==422
assert request({**payload,'website':'bot.example'},auth['token'])[0]==422
for i in range(3):assert request({**payload,'to':'attacker@example.org','subject':'autre objet'},auth['token'])[0]==200
assert request(payload,auth['token'])[0]==429
mail=Path('work/v022/captured-mail.txt').read_text();assert 'To: clement@lecompositeur.com' in mail;assert str(BytesParser(policy=policy.default).parsebytes(Path('work/v022/captured-mail.txt').read_bytes())['Subject'])=='DFT : bug signalé';assert 'Reply-To: test@example.org' in mail;assert 'le bouton ne répond pas' in mail;assert 'attacker@' not in mail
rate.unlink(missing_ok=True)
print(json.dumps({'csrf_and_origin':True,'validation_and_header_injection':True,'recipient_and_subject_server_only':True,'mail_captured_without_real_send':True,'rate_limit':True,'no_cache_or_public_recipient':True}))
