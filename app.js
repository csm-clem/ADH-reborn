import {renderView} from './dom-view.js';
import {noteName,pitchLabel,notationFor} from './core.js';
import {appStore} from './services/app-store.js';
import {storageService} from './services/storage-service.js';
import {audioService} from './services/audio-service.js';
import {platformService} from './services/platform-service.js';
import {APP_NAME,RELEASE} from './release.js';
import {PilotController} from './pilot-ui.js';
import {OnboardingController} from './onboarding.js';
const ROOT=document.querySelector('#app');
appStore.initialize();
audioService.configure({getState:appStore.getState});
const {unlockAudio,stopAudio,playNote,playSequence,playArrangement}=audioService;
let screen='home',installPrompt=null;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={replay:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/>',share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4m-7 7 7 4"/>',fullscreen:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',chart:'<path d="M4 19h17M7 15V9m6 6V5m6 10v-8"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',back:'<path d="m14 6-6 6 6 6"/>',play:'<path d="m9 5 11 7-11 7z"/>',check:'<path d="m5 12 4 4L19 6"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',mute:'<path d="m11 5-6 4H2v6h3l6 4zM16 9l6 6m0-6-6 6"/>',tap:'<path d="M9 12V5a2 2 0 0 1 4 0v7l2-1 5 4-2 6H9l-5-7a2 2 0 0 1 3-2l2 2"/>',sound:'<path d="m11 5-6 4H2v6h3l6 4zM15 8a5 5 0 0 1 0 8m3-11a9 9 0 0 1 0 14"/>',pause:'<path d="M8 5v14M16 5v14"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'};
const icon=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.play}</svg>`;

function toast(message){document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.role='status';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),5000);}
function setScreen(value){if(screen==='pilot')pilot.leave();screen=value;render();window.scrollTo(0,0);}
async function toggleFullscreen(){try{if(!await platformService.toggleFullscreen())toast('Ce navigateur ne propose pas le plein écran. Vous pouvez installer la PWA sur votre écran d’accueil.');}catch{toast('Le plein écran n’est pas disponible dans ce navigateur.');}}
function logo(){return `<a class="brand" href="#" data-action="home"><img src="./icons/icon.svg" alt=""><span>${esc(APP_NAME)}</span></a>`;}
function shell(body){
 const state=appStore.getState(),storageAvailable=storageService.status.settings;
 const instrument=state.profile?`${esc(state.profile.label)}<small>${state.profile.tuning.map(n=>esc(noteName(n,notationFor(state)))).join(' · ')}</small>`:'';
 return `<div class="shell"><aside class="sidebar">${logo()}<p class="nav-label">VOTRE ESPACE</p><nav>${[['home','Mon parcours','home'],['stats','Mes progrès','chart'],['settings','Paramètres','settings']].map(([page,label,i])=>`<button data-action="${page}" class="nav-item ${screen===page?'active':''}">${icon(i)}<span>${label}</span></button>`).join('')}</nav><div class="sidebar-bottom"><div class="instrument-badge"><span class="status-dot"></span><div>${instrument}</div></div><p>Un peu chaque jour.<br>Un manche qui devient familier.</p></div></aside><div class="main-shell"><header class="topbar"><span class="crumb">${screen==='stats'?'Mes progrès':screen==='settings'?'Paramètres':'Mon parcours'} <span>/</span> ${screen==='home'?'Zone 01':esc(APP_NAME)}</span></header><main class="content" id="main-content" tabindex="-1">${!storageAvailable?'<p class="notice" role="alert">La sauvegarde locale est indisponible. Exportez vos progrès avant de fermer.</p>':''}${body}</main></div><nav class="mobile-nav">${[['home','Parcours','home'],['stats','Progrès','chart'],['settings','Réglages','settings']].map(([page,label,i])=>`<button data-action="${page}" class="${screen===page?'active':''}">${icon(i)}${label}</button>`).join('')}</nav></div>`;
}
function settings(){
 const state=appStore.getState();
 return shell(`<div class="page-heading"><div><p class="eyebrow">FAITES COMME CHEZ VOUS</p><h1>Votre façon<br><em>de jouer.</em></h1></div></div><section class="panel"><h2>Votre instrument favori</h2><div class="profile-card"><button class="icon-button accent profile-audio" data-action="preview-tuning" aria-label="Écouter mon accordage" title="Écouter mon accordage" ${!state.sound?'disabled':''}>${icon('sound')}</button><div><strong>${esc(state.profile.label)}</strong><small>${state.profile.tuning.map(n=>esc(pitchLabel(n,notationFor(state)))).join(' · ')}</small></div></div><button class="text-button" data-action="edit-profile">Changer d’instrument ou d’accordage</button><p class="muted">Les résultats restent associés à chaque configuration.</p></section><section class="panel"><h2>Confort de jeu</h2><button class="button secondary" data-action="fullscreen">${icon('fullscreen')} Plein écran</button><div class="setting-row"><label for="setting-notation">Noms des notes<small>Appliqué à tout le parcours et aux résultats.</small></label><select id="setting-notation"><option value="international" ${state.notation==='international'?'selected':''}>C · D · E</option><option value="latin" ${state.notation==='latin'?'selected':''}>Do · Ré · Mi</option></select></div><div class="setting-row"><label for="setting-accidentals">Notes altérées<small>Change les noms affichés, sans changer les sons.</small></label><select id="setting-accidentals"><option value="sharp" ${state.accidentals==='sharp'?'selected':''}>Dièses ♯</option><option value="flat" ${state.accidentals==='flat'?'selected':''}>Bémols ♭</option></select></div><div class="setting-row"><label for="setting-sound">Écouter les notes<small>Le son joue après une bonne réponse.</small></label><input type="checkbox" role="switch" id="setting-sound" ${state.sound?'checked':''}></div><div class="setting-row"><label for="setting-voice">Son de l’instrument<small>Automatique ou choisissez votre timbre préféré.</small></label><div class="voice-controls"><select id="setting-voice">${[['auto','Automatique'],['guitar-acoustic','Guitare acoustique'],['guitar-clean','Guitare électrique clean'],['bass-electric','Basse électrique clean']].map(([value,label])=>`<option value="${value}" ${state.voice===value?'selected':''}>${label}</option>`).join('')}</select><button class="icon-button" data-action="preview-voice" aria-label="Écouter le son sélectionné" title="Écouter le son sélectionné" ${!state.sound?'disabled':''}>${icon('play')}</button></div></div><div class="setting-row"><label for="setting-theme">Apparence</label><select id="setting-theme"><option value="light" ${state.theme==='light'?'selected':''}>Claire</option><option value="dark" ${state.theme==='dark'?'selected':''}>Sombre</option><option value="accessible" ${state.theme==='accessible'?'selected':''}>Contraste renforcé</option><option value="system" ${state.theme==='system'?'selected':''}>Selon l’appareil</option></select></div></section><section class="panel"><h2>Version de test ${RELEASE}</h2><p>En v0, chaque nouvelle version repart avec une progression vide. Votre instrument et vos préférences restent enregistrés. Les sauvegardes concernent uniquement cette version.</p><div class="button-row"><button class="button secondary" data-action="export">${icon('download')} Exporter mes progrès</button><button class="button secondary" data-action="choose-import">Importer une sauvegarde</button><input type="file" id="import-file" accept="application/json,.json" hidden></div></section><section class="panel"><h2>Installer ${esc(APP_NAME)}</h2><p>Lancez le jeu depuis votre écran d’accueil. Après le chargement complet, vous pouvez jouer sans connexion.</p><div id="pwa-state" class="notice">${navigator.serviceWorker?.controller?'Les fichiers du jeu sont disponibles hors ligne.':'Préparation du mode hors ligne… Une connexion est nécessaire au premier chargement.'}</div>${installPrompt?'<button class="button primary" data-action="install">Installer l’application</button>':'<p class="muted">Android : menu du navigateur → Installer l’application. iPhone : Safari → Partager → Sur l’écran d’accueil.</p>'}</section>`);
}
function setSound(sound){appStore.update({sound});if(sound)unlockAudio();}

function render(){const state=appStore.getState();if(!state.profile){renderView(ROOT,onboarding.render(),'setup-'+onboarding.step);requestAnimationFrame(()=>onboarding.layout());return;}if(screen==='pilot'){renderView(ROOT,pilot.render(),'pilot-'+pilot.session?.activity+'-'+(pilot.count?'count':pilot.introduction?'intro-'+pilot.introduction.key:pilot.session?.stage)+'-'+(pilot.resultView||''));requestAnimationFrame(()=>pilot.layout());return;}renderView(ROOT,screen==='stats'?shell(pilot.stats()):screen==='settings'?settings():shell(pilot.home()),screen);}
ROOT.addEventListener('click',e=>{
 const state=appStore.getState(),button=e.target.closest('[data-action]');if(!button)return;e.preventDefault();
 switch(button.dataset.action){
 case 'home':case 'stats':case 'settings':stopAudio();setScreen(button.dataset.action);break;
 case 'fullscreen':toggleFullscreen();break;
 case 'preview-tuning':playSequence(state.profile.tuning,{step:.23});break;
 case 'preview-voice':playSequence(state.profile.tuning,{step:.23});break;
 case 'edit-profile':{onboarding.reset(state.profile,state.notation);pilot.leave();appStore.update({profile:null});render();}break;
 case 'choose-import':document.querySelector('#import-file').click();break;
 case 'export':{const data=storageService.backup(state,pilot.exportData()),url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`${APP_NAME.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}-${RELEASE}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
 case 'install':if(installPrompt){installPrompt.prompt();installPrompt.userChoice.then(()=>{installPrompt=null;render();});}break;
 }
});
ROOT.addEventListener('change',async e=>{
 if(e.target.id==='setting-notation'){appStore.update({notation:e.target.value});render();}
 if(e.target.id==='setting-accidentals'){appStore.update({accidentals:e.target.value});render();}
 if(e.target.id==='setting-sound'){setSound(e.target.checked);document.querySelectorAll('[data-action="preview-voice"],[data-action="preview-tuning"]').forEach(b=>b.disabled=!appStore.getState().sound);}
 if(e.target.id==='setting-voice'){appStore.update({voice:e.target.value});}
 if(e.target.id==='setting-theme'){appStore.update({theme:e.target.value});render();}
 if(e.target.id==='import-file'){
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>10_000_000)throw new Error('Le fichier est trop volumineux.');const raw=JSON.parse(await file.text());storageService.parseBackup(raw);if(!confirm('Remplacer la progression de cette version par cette sauvegarde ?'))return;pilot.leave();const restored=storageService.restoreBackup(raw);appStore.replace(restored.settings,{persist:false});pilot.importData(restored.pilot,{persist:false});setScreen('home');toast('Votre progression est restaurée.');}catch(error){toast(error.message||'Sauvegarde illisible.');}
 }
});
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
const pilot=new PilotController({storage:storageService,setAccidentals:accidentals=>appStore.update({accidentals}),setPositionButtons:value=>appStore.update({positionButtons:value}),getState:appStore.getState,showPilot:()=>{screen='pilot';render();},home:()=>setScreen('home'),stats:()=>setScreen('stats'),icon,playNote,playSequence,playArrangement,stopAudio,unlockAudio,setSound,toggleFullscreen});
const onboarding=new OnboardingController({getState:appStore.getState,render,icon,playNote:midi=>playNote(midi,{instrumentId:onboarding.instrumentId}),playSequence:notes=>playSequence(notes,{step:.23,instrumentId:onboarding.instrumentId}),stopAudio,setSound,complete:(profile,notation)=>{appStore.update({profile,notation});setScreen('home');}});
document.fonts?.ready.then(()=>{if(!appStore.getState().profile)onboarding.layout();});
appStore.subscribe((next,previous)=>{audioService.preferencesChanged(next,previous);platformService.setTheme(next.theme);});
platformService.setTheme(appStore.getState().theme);
platformService.connect({
 onHidden(){if(screen==='pilot')pilot.pause();else stopAudio();},
 onResize(){if(!appStore.getState().profile)requestAnimationFrame(()=>onboarding.layout());else if(screen==='pilot')pilot.clock.stop('layout');},
 onResizeSettled(){if(screen==='pilot'){pilot.layout();pilot.clock.resume('layout');}},
 onFullscreen(active){for(const b of document.querySelectorAll('[data-pilot-action="fullscreen"]'))b.setAttribute('aria-label',active?'Quitter le plein écran':'Passer en plein écran');},
 onInstallPrompt(event){installPrompt=event;if(screen==='settings')render();}
});
onboarding.bind(ROOT);pilot.bind(ROOT);render();
