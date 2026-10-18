<?php
/* PHP 8.1+ / o2switch. Recipient and subject are exclusively server-side. */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
function respond(int $status, array $data): never { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if (!in_array($method, ['GET', 'POST'], true)) { header('Allow: GET, POST'); respond(405, ['error'=>'Méthode non autorisée.']); }
// No cross-origin form submission or CORS permission. Cookies are private to this app path.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$expected = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? '');
if ($origin !== '' && $origin !== $expected) respond(403, ['error'=>'Ouvrez le formulaire depuis l’application.']);
if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') respond(403, ['error'=>'Origine non autorisée.']);
session_name('dft_bug_report');
$cookiePath = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/api/bug-report.php')), '/') . '/';
session_start(['use_strict_mode'=>1, 'cookie_httponly'=>true, 'cookie_samesite'=>'Strict', 'cookie_secure'=>str_starts_with($expected,'https:'), 'cookie_path'=>$cookiePath]);
if (!isset($_SESSION['csrf']) || ($_SESSION['expires'] ?? 0) < time()) { $_SESSION['csrf']=bin2hex(random_bytes(32)); $_SESSION['expires']=time()+1800; }
if ($method === 'GET') respond(200, ['token'=>$_SESSION['csrf']]);
if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) respond(415, ['error'=>'Format non pris en charge.']);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0)>16000) respond(413, ['error'=>'Le message est trop long.']);
$raw = file_get_contents('php://input', false, null, 0, 16001);
if ($raw === false || strlen($raw)>16000) respond(413, ['error'=>'Le message est trop long.']);
$data = json_decode($raw, true);
if (!is_array($data)) respond(400, ['error'=>'Message illisible.']);
if (!hash_equals($_SESSION['csrf'], (string)($_SERVER['HTTP_X_DFT_TOKEN'] ?? ''))) respond(403, ['error'=>'Le formulaire a expiré. Fermez-le puis réessayez.']);
function field(array $data, string $key, int $max): string {
 $value=$data[$key] ?? ''; if (!is_string($value) || strlen($value)>$max || str_contains($value,"\0")) respond(422,['error'=>'Un champ du message est invalide.']); return trim($value);
}
$message=field($data,'description',10000); $reply=field($data,'replyTo',254); $website=field($data,'website',200);
if (strlen($message)<10 || preg_match('//u',$message)!==1) respond(422, ['error'=>'Décrivez le problème en au moins 10 caractères.']);
if ($reply!=='' && (!filter_var($reply,FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/',$reply))) respond(422, ['error'=>'Vérifiez votre adresse e-mail.']);
if ($website!=='') respond(422, ['error'=>'Le message n’a pas pu être envoyé.']);
$config=$data['configuration'] ?? [];
if (!is_array($config)) respond(422, ['error'=>'Configuration invalide.']);
$lines=[];
foreach (['release'=>'Version','instrument'=>'Instrument','tuning'=>'Accordage','theme'=>'Thème','viewport'=>'Écran','standalone'=>'PWA installée'] as $key=>$label) $lines[]=$label.' : '.str_replace(["\r","\n"], ' ', field($config,$key,300));
// Limit attempts per IP, outside the web root, without saving messages or plain IP addresses.
$directory=sys_get_temp_dir().'/dft-report-'.substr(hash('sha256',__DIR__),0,16);
if (!is_dir($directory) && !@mkdir($directory,0700,true) && !is_dir($directory)) respond(503,['error'=>'L’envoi est temporairement indisponible. Votre texte est conservé.']);
$path=$directory.'/'.hash('sha256',$_SERVER['REMOTE_ADDR'] ?? 'unknown').'.json';
$lock=@fopen($path,'c+');
if (!$lock || !flock($lock,LOCK_EX)) respond(503,['error'=>'Réessayez dans un instant. Votre texte est conservé.']);
@chmod($path,0600); $timestamps=json_decode(stream_get_contents($lock),true); if (!is_array($timestamps)) $timestamps=[];
$timestamps=array_values(array_filter($timestamps,fn($t)=>is_int($t)&&$t>time()-900));
if (count($timestamps)>=3) { flock($lock,LOCK_UN);fclose($lock);header('Retry-After: 900');respond(429,['error'=>'Trois essais en 15 minutes maximum. Réessayez plus tard ; votre texte est conservé.']); }
$timestamps[]=time();ftruncate($lock,0);rewind($lock);fwrite($lock,json_encode($timestamps));fflush($lock);flock($lock,LOCK_UN);fclose($lock);
session_write_close();
$body="Signalement depuis Daily Fretboard Trainer\n\n".$message."\n\nConfiguration jointe :\n".implode("\n",$lines)."\n\nAucune sauvegarde ni historique de jeu n’est joint.\n";
$headers=['From'=>'Daily Fretboard Trainer <noreply@lecompositeur.com>', 'Content-Type'=>'text/plain; charset=UTF-8', 'MIME-Version'=>'1.0'];
if ($reply!=='') $headers['Reply-To']=$reply;
try { $sent=mail('clement@lecompositeur.com','=?UTF-8?B?'.base64_encode('DFT : bug signalé').'?=',$body,$headers); } catch (Throwable $e) { $sent=false; }
if (!$sent) respond(503,['error'=>'Le serveur n’a pas accepté le message. Réessayez plus tard ; votre texte est conservé.']);
respond(200,['ok'=>true]);
