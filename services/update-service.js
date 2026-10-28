import {UPDATE_VERSION,CHANNEL} from '../release.js';
export function newerVersion(candidate,current=UPDATE_VERSION){if(!/^\d+\.\d+\.\d+$/.test(candidate||''))return false;const a=candidate.split('.').map(Number),b=current.split('.').map(Number);for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]>b[i];}return false;}
export function updateTarget(data,manifestURL,currentURL,currentVersion=UPDATE_VERSION){if((CHANNEL==='sandbox'&&data?.channel!=='sandbox')||(CHANNEL==='live'&&data?.channel==='sandbox')||!newerVersion(data?.version,currentVersion))return null;const current=new URL(currentURL),url=new URL(data.url||'./',manifestURL);if(url.origin!==current.origin||url.username||url.password||!['http:','https:'].includes(url.protocol))return null;return {version:data.version,url:url.href};}
/** Waiting downloads stay inactive until the player accepts. No duplicate repair installs. */
export class UpdateController{
 constructor({beforeUpdate,canPrompt=()=>true}){this.beforeUpdate=beforeUpdate;this.canPrompt=canPrompt;this.deferred=false;this.registration=null;this.progress=null;}
 async start(){if(!('serviceWorker' in navigator))return;try{
  const r=this.registration=await navigator.serviceWorker.register('./sw.js?release='+UPDATE_VERSION,{updateViaCache:'none'});
  r.addEventListener('updatefound',()=>{const w=r.installing;w?.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)this.offerWorker();});});
  navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='UPDATE_PROGRESS'){this.progress=e.data;this.paintProgress();}});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(this.accepted&&!this.reloading){this.reloading=true;location.reload();}});
  if(r.waiting)this.offerWorker();await r.update();
 }catch{}await this.checkRelease();}
 async checkRelease(){for(const path of(CHANNEL==='sandbox'?['./update.json']:['./update.json','../latest.json']))try{const manifestURL=new URL(path,location.href),res=await fetch(manifestURL,{cache:'no-store'});if(!res.ok)continue;const target=updateTarget(await res.json(),manifestURL,location.href);if(target){this.pending=target;this.offer();return;}}catch{}}
 workerVersion(worker){return new Promise(resolve=>{if(!worker)return resolve(null);const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();resolve(null);},1500);channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data?.version||null);};worker.postMessage({type:'GET_VERSION'},[channel.port2]);});}
 async prepareVersion(version){
  if(this.preparingVersion===version&&this.preparation)return this.preparation;
  this.preparingVersion=version;
  this.preparation=(async()=>{
   let r=this.registration;
   if(r?.waiting&&await this.workerVersion(r.waiting)===version)return r.waiting;
   r=this.registration=await navigator.serviceWorker.register('./sw.js?release='+encodeURIComponent(version),{updateViaCache:'none'});
   if(r.waiting&&await this.workerVersion(r.waiting)===version)return r.waiting;
   const worker=r.installing;
   if(!worker){if(await this.workerVersion(r.active)===version)return r.active;throw new Error('La mise à jour n’a pas pu démarrer. Vos progrès sont conservés.');}
   return await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{worker.removeEventListener('statechange',check);reject(new Error('Téléchargement interrompu. Vos progrès sont conservés ; réessayez.'));},60000);const check=()=>{if(worker.state==='installed'){clearTimeout(timer);worker.removeEventListener('statechange',check);resolve(worker);}else if(worker.state==='redundant'){clearTimeout(timer);worker.removeEventListener('statechange',check);reject(new Error('La nouvelle version n’est pas encore complète. Réessayez plus tard.'));}};worker.addEventListener('statechange',check);check();});
  })().catch(error=>{this.preparingVersion=null;this.preparation=null;throw error;});
  return this.preparation;
 }
 async installVersion(version){const worker=await this.prepareVersion(version);if(await this.workerVersion(this.registration?.active)===version){location.reload();return;}worker.postMessage({type:'ACTIVATE_UPDATE'});}
 paintProgress(){const p=this.dialog?.querySelector('.update-progress');if(!p)return;const v=this.progress;p.textContent=this.workerPending?'Téléchargement terminé. Prête à installer.':v?`Préparation : ${Math.round(v.loaded/v.total*100)} %`:'Le téléchargement démarrera avec votre accord.';}
 offerWorker(){this.workerPending=true;this.paintProgress();this.offer();}
 offer(){if(this.accepted||this.deferred||this.dialog||!this.canPrompt()||!(this.pending||this.workerPending))return;
  const d=this.dialog=document.createElement('dialog');d.className='guide-dialog update-dialog';d.innerHTML='<h1>Une mise à jour est disponible</h1><p>Vos progrès et vos réglages seront conservés sur cet appareil.</p><p class="update-progress" role="status"></p><div class="guide-navigation"><button class="button secondary" data-update="later">Plus tard</button><button class="button primary" data-update="now">Mettre à jour</button></div><p class="update-error" role="alert"></p>';
  const later=()=>{if(this.accepted)return;this.deferred=true;d.close();d.remove();this.dialog=null;};d.addEventListener('cancel',e=>{e.preventDefault();later();});d.addEventListener('click',async e=>{const button=e.target.closest('[data-update]'),action=button?.dataset.update;if(action==='later')later();if(action==='now'&&!this.accepted)try{
   if(this.beforeUpdate()===false)throw new Error('Sauvegarde impossible. Exportez vos progrès avant de mettre à jour.');this.accepted=true;for(const b of d.querySelectorAll('button'))b.disabled=true;button.textContent='Installation…';
   if(this.pending&&new URL(this.pending.url).pathname!==location.pathname){location.assign(this.pending.url);return;}
   if(this.pending)await this.installVersion(this.pending.version);else if(this.registration?.waiting)this.registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});else location.reload();
  }catch(error){this.accepted=false;for(const b of d.querySelectorAll('button'))b.disabled=false;button.textContent='Réessayer';d.querySelector('.update-error').textContent=error.message;}});document.body.append(d);this.paintProgress();d.showModal();}
}
