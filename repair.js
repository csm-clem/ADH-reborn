/* Standalone recovery: no imports from the possibly stale application cache. */
const statusLine=document.querySelector('#status'),retry=document.querySelector('#retry');
async function repair(){
 retry.hidden=true;
 try{
  if(!('serviceWorker' in navigator))throw new Error('Ce navigateur ne permet pas cette mise à jour.');
  const response=await fetch('./update.json',{cache:'no-store'});if(!response.ok)throw new Error('Connexion impossible.');
  const metadata=await response.json();if(!/^\d+\.\d+\.\d+$/.test(metadata.version)||metadata.channel!=='sandbox')throw new Error('Ce lien est réservé au bac à sable.');
  statusLine.textContent='Téléchargement de v'+metadata.version+'…';
  const registration=await navigator.serviceWorker.register('./sw.js?release='+metadata.version+'&repair='+Date.now(),{updateViaCache:'none'});
  await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>finish(new Error('Téléchargement interrompu. Réessayez avec une connexion stable.')),60000);
   const finish=error=>{clearTimeout(timer);navigator.serviceWorker.removeEventListener('controllerchange',activated);error?reject(error):resolve();};
   const activated=()=>finish();navigator.serviceWorker.addEventListener('controllerchange',activated);
   const worker=registration.installing||registration.waiting;
   if(!worker){finish(new Error('Installation non démarrée. Réessayez.'));return;}
   const check=()=>{if(worker.state==='installed')worker.postMessage({type:'ACTIVATE_UPDATE'});if(worker.state==='redundant')finish(new Error('Les fichiers ne sont pas encore tous disponibles. Réessayez dans un instant.'));};
   worker.addEventListener('statechange',check);check();
  });
  location.replace('./');
 }catch(error){statusLine.textContent=error.message+' Aucun progrès n’a été effacé.';retry.hidden=false;}
}
retry.addEventListener('click',repair);repair();
