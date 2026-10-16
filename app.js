import {noteName,pitchLabel,frequency} from './core.js';
import {initialState,loadState,validateState} from './state.js';
import {APP_NAME,RELEASE,STATE_KEY as KEY} from './release.js';
import {electricString,pluckedString,instrumentVoice,voiceCutoff} from './sound.js';
import {PilotController} from './pilot-ui.js';
import {validatePilotStore} from './pilot.js';
import {OnboardingController} from './onboarding.js';
const ROOT=document.querySelector('#app');
let state=initialState(),storageAvailable=true,screen='home',installPrompt=null,audio=null;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try{state=loadState(localStorage);}catch{storageAvailable=false;}
const icons={replay:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/>',share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4m-7 7 7 4"/>',fullscreen:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',chart:'<path d="M4 19h17M7 15V9m6 6V5m6 10v-8"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',back:'<path d="m14 6-6 6 6 6"/>',play:'<path d="m9 5 11 7-11 7z"/>',check:'<path d="m5 12 4 4L19 6"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',mute:'<path d="m11 5-6 4H2v6h3l6 4zM16 9l6 6m0-6-6 6"/>',tap:'<path d="M9 12V5a2 2 0 0 1 4 0v7l2-1 5 4-2 6H9l-5-7a2 2 0 0 1 3-2l2 2"/>',sound:'<path d="m11 5-6 4H2v6h3l6 4zM15 8a5 5 0 0 1 0 8m3-11a9 9 0 0 1 0 14"/>',pause:'<path d="M8 5v14M16 5v14"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'};
const icon=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.play}</svg>`;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageAvailable=true;}catch{storageAvailable=false;}}
function toast(message){document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.role='status';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),5000);}
function setScreen(value){if(screen==='pilot')pilot.leave();screen=value;render();window.scrollTo(0,0);}
async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Ce navigateur ne propose pas le plein écran. Vous pouvez installer la PWA sur votre écran d’accueil.');}catch{toast('Le plein écran n’est pas disponible dans ce navigateur.');}}
function logo(){return `<a class="brand" href="#" data-action="home"><img src="./icons/icon.svg" alt=""><span>${esc(APP_NAME)}</span></a>`;}
function shell(body){
 const instrument=state.profile?`${esc(state.profile.label)}<small>${state.profile.tuning.map(n=>esc(noteName(n,state.notation))).join(' · ')}</small>`:'';
 return `<div class="shell"><aside class="sidebar">${logo()}<p class="nav-label">VOTRE ESPACE</p><nav>${[['home','Mon parcours','home'],['stats','Mes progrès','chart'],['settings','Paramètres','settings']].map(([page,label,i])=>`<button data-action="${page}" class="nav-item ${screen===page?'active':''}">${icon(i)}<span>${label}</span></button>`).join('')}</nav><div class="sidebar-bottom"><div class="instrument-badge"><span class="status-dot"></span><div>${instrument}</div></div><p>Un peu chaque jour.<br>Un manche qui devient familier.</p></div></aside><div class="main-shell"><header class="topbar"><span class="crumb">${screen==='stats'?'Mes progrès':screen==='settings'?'Paramètres':'Mon parcours'} <span>/</span> ${screen==='home'?'Zone 01':esc(APP_NAME)}</span></header><main class="content" id="main-content" tabindex="-1">${!storageAvailable?'<p class="notice" role="alert">La sauvegarde locale est indisponible. Exportez vos progrès avant de fermer.</p>':''}${body}</main></div><nav class="mobile-nav">${[['home','Parcours','home'],['stats','Progrès','chart'],['settings','Réglages','settings']].map(([page,label,i])=>`<button data-action="${page}" class="${screen===page?'active':''}">${icon(i)}${label}</button>`).join('')}</nav></div>`;
}
function settings(){
 return shell(`<div class="page-heading"><div><p class="eyebrow">FAITES COMME CHEZ VOUS</p><h1>Votre façon<br><em>de jouer.</em></h1></div></div><section class="panel"><h2>Votre instrument favori</h2><div class="profile-card"><button class="icon-button profile-audio" data-action="preview-tuning" aria-label="Écouter mon accordage" title="Écouter mon accordage" ${!state.sound?'disabled':''}>${icon('sound')}</button><div><strong>${esc(state.profile.label)}</strong><small>${state.profile.tuning.map(n=>esc(pitchLabel(n,state.notation))).join(' · ')}</small></div></div><button class="text-button" data-action="edit-profile">Changer d’instrument ou d’accordage</button><p class="muted">Les résultats restent associés à chaque configuration.</p></section><section class="panel"><h2>Confort de jeu</h2><button class="button secondary" data-action="fullscreen">${icon('fullscreen')} Plein écran</button><div class="setting-row"><label for="setting-notation">Noms des notes<small>Appliqué à tout le parcours et aux résultats.</small></label><select id="setting-notation"><option value="international" ${state.notation==='international'?'selected':''}>C · D · E</option><option value="latin" ${state.notation==='latin'?'selected':''}>Do · Ré · Mi</option></select></div><div class="setting-row"><label for="setting-sound">Écouter les notes<small>Le son joue après une bonne réponse.</small></label><input type="checkbox" role="switch" id="setting-sound" ${state.sound?'checked':''}></div><div class="setting-row"><label for="setting-voice">Son de l’instrument<small>Automatique ou choisissez votre timbre préféré.</small></label><div class="voice-controls"><select id="setting-voice">${[['auto','Automatique'],['guitar-acoustic','Guitare acoustique'],['guitar-clean','Guitare électrique clean'],['bass-electric','Basse électrique clean']].map(([value,label])=>`<option value="${value}" ${state.voice===value?'selected':''}>${label}</option>`).join('')}</select><button class="icon-button" data-action="preview-voice" aria-label="Écouter le son sélectionné" title="Écouter le son sélectionné" ${!state.sound?'disabled':''}>${icon('play')}</button></div></div><div class="setting-row"><label for="setting-theme">Apparence</label><select id="setting-theme"><option value="light" ${state.theme==='light'?'selected':''}>Claire</option><option value="dark" ${state.theme==='dark'?'selected':''}>Sombre</option></select></div></section><section class="panel"><h2>Version de test ${RELEASE}</h2><p>En v0, chaque nouvelle version repart avec une progression vide. Votre instrument et vos préférences restent enregistrés. Les sauvegardes concernent uniquement cette version.</p><div class="button-row"><button class="button secondary" data-action="export">${icon('download')} Exporter mes progrès</button><button class="button secondary" data-action="choose-import">Importer une sauvegarde</button><input type="file" id="import-file" accept="application/json,.json" hidden></div></section><section class="panel"><h2>Installer ${esc(APP_NAME)}</h2><p>Lancez le jeu depuis votre écran d’accueil. Après le chargement complet, vous pouvez jouer sans connexion.</p><div id="pwa-state" class="notice">${navigator.serviceWorker?.controller?'Les fichiers du jeu sont disponibles hors ligne.':'Préparation du mode hors ligne… Une connexion est nécessaire au premier chargement.'}</div>${installPrompt?'<button class="button primary" data-action="install">Installer l’application</button>':'<p class="muted">Android : menu du navigateur → Installer l’application. iPhone : Safari → Partager → Sur l’écran d’accueil.</p>'}</section>`);
}
function unlockAudio(){if(!state.sound)return Promise.resolve();try{audio||=new (window.AudioContext||window.webkitAudioContext)();return audio.resume().catch(()=>{});}catch{return Promise.resolve();}}
const soundCache=new Map(),activeSounds=new Set();let sequenceEpoch=0;
function stopAudio(){sequenceEpoch++;for(const source of activeSounds){try{source.stop();}catch{}}activeSounds.clear();}
async function playSequence(notes,{step=.42,instrumentId=state.profile?.instrumentId||'guitar6'}={}){stopAudio();const epoch=sequenceEpoch;await unlockAudio();if(epoch!==sequenceEpoch||!state.sound||!audio||audio.state!=='running')return;let when=audio.currentTime+.025;notes.forEach(note=>{const event=typeof note==='number'?{midi:note}:note,span=step*(event.beats||1);createNote(event.midi,when,Math.max(.08,span-.025),instrumentVoice(instrumentId,state.voice));when+=span+step*(event.restAfter||0);});}
function setSound(enabled){state.sound=enabled;if(!enabled)stopAudio();else unlockAudio();save();}
async function playNote(midi,{instrumentId=state.profile?.instrumentId||'guitar6'}={}){
 stopAudio();if(!state.sound)return;const epoch=sequenceEpoch;await unlockAudio();if(epoch!==sequenceEpoch||!state.sound||!audio||audio.state!=='running')return;createNote(midi,audio.currentTime,undefined,instrumentVoice(instrumentId,state.voice));
}
function createNote(midi,when,duration,voice){
 const hz=frequency(midi);if(hz>audio.sampleRate/4)return;
 const key=`${voice}:${midi}:${audio.sampleRate}`;
 if(!soundCache.has(key)){
   const samples=voice==='guitar-acoustic'?pluckedString(hz,audio.sampleRate):electricString(hz,audio.sampleRate,1.8,voice),buffer=audio.createBuffer(1,samples.length,audio.sampleRate);
   buffer.copyToChannel(samples,0);soundCache.set(key,buffer);
   if(soundCache.size>64)soundCache.delete(soundCache.keys().next().value);
 }
 const source=audio.createBufferSource(),gain=audio.createGain(),filter=audio.createBiquadFilter();
 source.buffer=soundCache.get(key);filter.type='lowpass';filter.frequency.value=voiceCutoff(hz,voice);filter.Q.value=.5;gain.gain.value=.32;
 source.connect(filter);filter.connect(gain);gain.connect(audio.destination);source.start(when);if(duration){gain.gain.setValueAtTime(.32,when);gain.gain.setValueAtTime(.32,when+duration-.04);gain.gain.linearRampToValueAtTime(0,when+duration);source.stop(when+duration+.01);}
 activeSounds.add(source);source.onended=()=>{activeSounds.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};
}

function render(){document.documentElement.dataset.theme=state.theme;if(!state.profile){ROOT.innerHTML=onboarding.render();requestAnimationFrame(()=>onboarding.layout());return;}if(screen==='pilot'){ROOT.innerHTML=pilot.render();requestAnimationFrame(()=>pilot.layout());return;}ROOT.innerHTML=screen==='stats'?shell(pilot.stats()):screen==='settings'?settings():shell(pilot.home());}
ROOT.addEventListener('click',e=>{
 const button=e.target.closest('[data-action]');if(!button)return;e.preventDefault();
 switch(button.dataset.action){
 case 'home':case 'stats':case 'settings':stopAudio();setScreen(button.dataset.action);break;
 case 'fullscreen':toggleFullscreen();break;
 case 'preview-tuning':playSequence(state.profile.tuning,{step:.23});break;
 case 'preview-voice':playSequence([state.profile.tuning[0],state.profile.tuning[0]+7,state.profile.tuning[0]+12],{step:.3});break;
 case 'edit-profile':{onboarding.reset(state.profile,state.notation);pilot.leave();state.profile=null;save();render();}break;
 case 'choose-import':document.querySelector('#import-file').click();break;
 case 'export':{const data={...state,pilotBackup:pilot.exportData()},url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`${APP_NAME.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}-${RELEASE}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
 case 'install':if(installPrompt){installPrompt.prompt();installPrompt.userChoice.then(()=>{installPrompt=null;render();});}break;
 }
});
ROOT.addEventListener('change',async e=>{
 if(e.target.id==='setting-notation'){state.notation=e.target.value;save();render();}
 if(e.target.id==='setting-sound'){setSound(e.target.checked);document.querySelectorAll('[data-action="preview-voice"],[data-action="preview-tuning"]').forEach(b=>b.disabled=!state.sound);}
 if(e.target.id==='setting-voice'){stopAudio();state.voice=e.target.value;save();}
 if(e.target.id==='setting-theme'){state.theme=e.target.value;save();render();}
 if(e.target.id==='import-file'){
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>10_000_000)throw new Error('Le fichier est trop volumineux.');const raw=JSON.parse(await file.text()),imported=validateState(raw);const history=validatePilotStore(raw.pilotBackup);if(!confirm('Remplacer la progression de cette version par cette sauvegarde ?'))return;pilot.leave();state=imported;pilot.importData(history);save();setScreen('home');toast('Votre progression est restaurée.');}catch(error){toast(error.message||'Sauvegarde illisible.');}
 }
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(screen==='pilot')pilot.pause();else stopAudio();}});
let layoutTimer;
window.addEventListener('resize',()=>{if(!state.profile){requestAnimationFrame(()=>onboarding.layout());return;}if(screen==='pilot'){pilot.clock.stop('layout');clearTimeout(layoutTimer);layoutTimer=setTimeout(()=>{pilot.layout();pilot.clock.resume('layout');},180);}});
document.addEventListener('fullscreenchange',()=>{for(const b of document.querySelectorAll('[data-pilot-action="fullscreen"]'))b.setAttribute('aria-label',document.fullscreenElement?'Quitter le plein écran':'Passer en plein écran');});
window.addEventListener('pagehide',()=>{if(screen==='pilot')pilot.pause();else stopAudio();});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;if(screen==='settings')render();});

if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
const pilot=new PilotController({getState:()=>state,showPilot:()=>{screen='pilot';render();},home:()=>setScreen('home'),stats:()=>setScreen('stats'),icon,playNote,playSequence,stopAudio,unlockAudio,setSound,toggleFullscreen});
const onboarding=new OnboardingController({getState:()=>state,render,icon,playNote:midi=>playNote(midi,{instrumentId:onboarding.instrumentId}),playSequence:notes=>playSequence(notes,{step:.23,instrumentId:onboarding.instrumentId}),stopAudio,setSound,complete:(profile,notation)=>{state.profile=profile;state.notation=notation;save();setScreen('home');}});
document.fonts?.ready.then(()=>{if(!state.profile)onboarding.layout();});
onboarding.bind(ROOT);pilot.bind(ROOT);render();
