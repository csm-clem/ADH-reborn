import {NavigationController} from './services/navigation-service.js';
import {navigationTrail,branchLabel,routeLabel} from './beta-home.js';
import {bindParentSwipe,parentNavigation} from './navigation-rules.js';
import {renderChangelog,bindChangelog} from './changelog.js';
import {bindNeckKeyboard} from './neck-view.js';
import {bindProgress} from "./progress.js";
import {CourseController} from './course-ui.js';
import {BeginnerGuide,installGuide} from './beginner-guide.js';
import {UpdateController} from './services/update-service.js';
import {debugAvailable} from './debug-mode.js';
import {bugReportPanel,BugReportController,bugConfiguration} from './bug-report.js';
import {AchievementsController} from './achievements-ui.js';
import {themeChoices} from './themes.js';
import {renderView} from './dom-view.js';
import {noteName,pitchLabel,notationFor} from './core.js';
import {appStore} from './services/app-store.js';
import {storageService} from './services/storage-service.js';
import {audioService} from './services/audio-service.js';
import {platformService} from './services/platform-service.js';
import {APP_NAME,RELEASE,CHANNEL,BUILD_ID,DISPLAY_VERSION,releaseLabel} from './release.js';
import {PilotController} from './pilot-ui.js';
import {OnboardingController} from './onboarding.js';
const ROOT=document.querySelector('#app');
bindChangelog(ROOT);
if(CHANNEL==='sandbox')document.title='DFT · Bac à sable · '+DISPLAY_VERSION;
appStore.initialize();
audioService.configure({getState:appStore.getState});
const {unlockAudio,stopAudio,playNote,playSequence,playArrangement}=audioService;
let screen='home',installPrompt=null,updates=null,navigation=null;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={replay:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/>',share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4m-7 7 7 4"/>','fullscreen-exit':'<path d="M3 3l5 5M3 8h5V3m13 0-5 5m0-5v5h5M3 21l5-5m-5 0h5v5m13 0-5-5m0 5v-5h5"/>',fullscreen:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',chart:'<path d="M4 19h17M7 15V9m6 6V5m6 10v-8"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',back:'<path d="m14 6-6 6 6 6"/>',play:'<path d="m9 5 11 7-11 7z"/>',check:'<path d="m5 12 4 4L19 6"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',mute:'<path d="m11 5-6 4H2v6h3l6 4zM16 9l6 6m0-6-6 6"/>',tap:'<path d="M9 12V5a2 2 0 0 1 4 0v7l2-1 5 4-2 6H9l-5-7a2 2 0 0 1 3-2l2 2"/>',sound:'<path d="m11 5-6 4H2v6h3l6 4zM15 8a5 5 0 0 1 0 8m3-11a9 9 0 0 1 0 14"/>',pause:'<path d="M8 5v14M16 5v14"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'};
const icon=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.play}</svg>`;

function toast(message){document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.role='status';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),5000);}
function setScreen(value){if(screen==='pilot')pilot.leave();if(screen==='achievements')achievements.stop();screen=value;render();document.querySelector('#main-content')?.focus({preventScroll:true});}
function fullscreenContent(active=!!document.fullscreenElement){return `${icon(active?'fullscreen-exit':'fullscreen')}<span>${active?'Quitter le plein écran':'Plein écran'}</span>`;}
function syncFullscreen(active){for(const b of document.querySelectorAll('[data-action="fullscreen"],[data-pilot-action="fullscreen"]')){b.innerHTML=b.dataset.action?fullscreenContent(active):icon(active?'fullscreen-exit':'fullscreen');b.setAttribute('aria-label',active?'Quitter le plein écran':'Passer en plein écran');b.setAttribute('title',active?'Quitter le plein écran':'Passer en plein écran');b.setAttribute('aria-pressed',String(active));}}
function debugPanel(){if(!debugAvailable(RELEASE))return '';return `<section class="panel debug-panel"><h2>Mode débug <small>· réservé à la v0</small></h2><p>${pilot.debugActive?'Simulation active : tous les exercices sont réussis à 100 % et tous les succès disponibles sont débloqués.':'Testez un parcours terminé et sa collection complète, pour cet instrument.'} Vos vrais résultats restent conservés. La simulation disparaît aussi au rechargement.</p><button class="button ${pilot.debugActive?'secondary':'quiet-button'}" data-action="debug" aria-pressed="${!!pilot.debugActive}">${pilot.debugActive?'Retrouver mes vrais résultats':'Simuler un parcours à 100 %'}</button></section>`;}
async function toggleFullscreen(){try{if(!await platformService.toggleFullscreen())toast('Ce navigateur ne propose pas le plein écran. Vous pouvez installer la PWA sur votre écran d’accueil.');}catch{toast('Le plein écran n’est pas disponible dans ce navigateur.');}}
function logo(){return `<a class="brand" href="#" data-action="home"><img src="./icons/icon.svg" alt=""><span>${esc(APP_NAME)}</span></a>`;}
function shell(body){
 const state=appStore.getState(),storageAvailable=storageService.status.settings;
 const instrument=state.profile?`${esc(state.profile.label)}<small>${state.profile.tuning.map(n=>esc(noteName(n,notationFor(state)))).join(' · ')}</small>`:'';
 return `<div class="shell"><aside class="sidebar">${logo()}<p class="nav-label">VOTRE ESPACE</p><nav>${[['home','Parcours','home'],['stats','Progrès','chart'],['achievements','Succès','check'],['settings','Réglages','settings']].map(([page,label,i])=>`<button data-action="${page}" class="nav-item ${(screen===page||page==='settings'&&screen==='changelog')?'active':''}" aria-current="${(screen===page||page==='settings'&&screen==='changelog')?'page':'false'}">${icon(i)}<span>${label}</span></button>`).join('')}</nav><div class="sidebar-bottom"><div class="instrument-badge"><span class="status-dot"></span><div>${instrument}</div></div><p>Un peu chaque jour.<br>Un manche qui devient familier.</p></div></aside><div class="main-shell"><header class="topbar">${navigationHeader()}</header><main class="content ${screen==='settings'?'settings-content':''}" id="main-content" tabindex="-1">${pilot.debugActive?'<p class="notice debug-notice" role="status"><strong>Simulation débug</strong> · vos vrais résultats sont conservés.</p>':''}${!storageAvailable?'<p class="notice" role="alert">La sauvegarde locale est indisponible. Exportez vos progrès avant de fermer.</p>':''}${body}</main></div><nav class="mobile-nav">${[['home','Parcours','home'],['stats','Progrès','chart'],['achievements','Succès','check'],['settings','Réglages','settings']].map(([page,label,i])=>`<button data-action="${page}" class="${(screen===page||page==='settings'&&screen==='changelog')?'active':''}" aria-current="${(screen===page||page==='settings'&&screen==='changelog')?'page':'false'}">${icon(i)}${label}</button>`).join('')}</nav></div>`;
}
function navigationHeader(){
 const version=CHANNEL==='sandbox'?`<strong class="sandbox-label">Lab ${esc(DISPLAY_VERSION)}</strong>`:'';
 if(screen!=='home')return `${version}<span class="current-section">${({stats:'Progrès',achievements:'Succès',settings:'Réglages',changelog:'Journal des modifications'})[screen]||'Parcours'}</span>`;
 const trail=navigationTrail(pilot),parent=trail.at(-2);
 return `${version}<nav class="breadcrumbs" aria-label="Fil d’Ariane"><ol>${trail.map((item,i)=>`<li>${i===trail.length-1?`<span aria-current="page">${esc(item.label)}</span>`:`<button class="text-button" data-pilot-action="${item.action}" data-id="${esc(item.id||'')}">${esc(item.label)}</button>`}</li>`).join('')}</ol></nav><span class="mobile-location">${parent?`<button class="text-button" data-pilot-action="${parent.action}" data-id="${esc(parent.id||'')}">← ${esc(parent.label)}</button>`:'Parcours'}</span>`;
}
function sandboxHistoryURL(){return new URL(location.pathname.includes('/builds/')?'../../versions.html':'./versions.html',location.href).href;}
function settings(){
 const state=appStore.getState();
 return shell(`<div class="page-heading"><div><h1>Réglages</h1><p>Votre instrument, votre jeu, votre confort.</p></div></div>${debugPanel()}<section class="panel"><h2>Instrument</h2><div class="profile-card"><button class="icon-button accent profile-audio" data-action="preview-tuning" aria-label="Écouter mon accordage" title="Écouter mon accordage" ${!state.sound?'disabled':''}>${icon('play')}</button><div><strong>${esc(state.profile.label)}</strong><small>${state.profile.tuning.map(n=>esc(pitchLabel(n,notationFor(state)))).join(' · ')}</small></div></div><button class="text-button" data-action="edit-profile">Changer d’instrument ou d’accordage</button><p class="muted">Les résultats restent associés à chaque configuration.</p><div class="setting-row"><label for="setting-notation">Noms des notes<small>Appliqué à tout le parcours et aux résultats.</small></label><select id="setting-notation"><option value="international" ${state.notation==='international'?'selected':''}>C · D · E</option><option value="latin" ${state.notation==='latin'?'selected':''}>Do · Ré · Mi</option></select></div><div class="setting-row"><label for="setting-accidentals">Notes altérées<small>Change les noms affichés, sans changer les sons.</small></label><select id="setting-accidentals"><option value="sharp" ${state.accidentals==='sharp'?'selected':''}>Dièses ♯</option><option value="flat" ${state.accidentals==='flat'?'selected':''}>Bémols ♭</option></select></div></section><section class="panel"><h2>Jeu et son</h2><button class="button secondary" data-action="fullscreen" aria-pressed="${!!document.fullscreenElement}">${fullscreenContent()}</button><div class="setting-row"><label for="setting-sound">Son de toute l’application<small>${state.sound?'Activé':'Coupé'} · notes, démonstrations et mélodies.</small></label><button id="setting-sound" class="icon-button sound-toggle ${state.sound?'':'is-muted'}" data-action="mute-global" aria-label="${state.sound?'Couper':'Activer'} tous les sons" aria-pressed="${!state.sound}">${icon(state.sound?'sound':'mute')}</button></div><div class="setting-row"><label for="setting-voice">Son de l’instrument<small>Automatique ou choisissez votre timbre préféré.</small></label><div class="voice-controls"><select id="setting-voice">${[['auto','Automatique'],['guitar-acoustic','Guitare acoustique'],['guitar-clean','Guitare électrique clean'],['guitar-driven','Guitare électrique saturée'],['bass-electric','Basse électrique clean']].map(([value,label])=>`<option value="${value}" ${state.voice===value?'selected':''}>${label}</option>`).join('')}</select><button class="icon-button" data-action="preview-voice" aria-label="Écouter le son sélectionné" title="Écouter le son sélectionné" ${!state.sound?'disabled':''}>${icon('play')}</button></div></div></section><section class="panel appearance-panel" aria-label="Apparence">${themeChoices(state.theme)}</section><section class="panel"><h2>Sauvegardes et mises à jour</h2><p class="version-label">${CHANNEL==='sandbox'?'Bac à sable · '+esc(DISPLAY_VERSION):'Version '+releaseLabel(RELEASE)}</p>${CHANNEL==='sandbox'?`<p>Copie expérimentale : ses réglages et sa progression sont séparés du live.</p><details><summary>Informations techniques</summary><p>${esc(BUILD_ID)} : numéro d’archive puis empreinte du code. La version de cet essai est ${esc(DISPLAY_VERSION)}.</p></details><p><a class="button secondary" href="${esc(sandboxHistoryURL())}">Historique des essais</a></p>`:''}<p><button class="text-button" data-action="changelog">Journal des modifications →</button></p><p>Vos progrès restent enregistrés sur cet appareil entre les mises à jour, même sans compte. Exportez une sauvegarde pour les garder aussi ailleurs.</p><div class="button-row"><button class="button secondary" data-action="export">${icon('download')} Exporter mes progrès</button><button class="button secondary" data-action="choose-import">Importer une sauvegarde</button><input type="file" id="import-file" accept="application/json,.json" hidden></div></section><section class="panel help-panel"><h2>Aide</h2><details class="keyboard-help"><summary>Utiliser le clavier</summary><p>Tab et Maj + Tab : passer d’un bouton à l’autre. Entrée ou Espace : choisir.</p><p>Sur le manche : flèches pour changer de corde ou de case ; Début et Fin pour les extrémités. Entrée ou Espace pour jouer.</p><p>Échap : mettre en pause ou reprendre. Dans une fenêtre : Échap pour fermer.</p></details><button class="button secondary" data-action="beginner-guide">Comprendre le manche et le jeu</button>${bugReportPanel().replace('<section class="panel bug-report-entry">','<div class="bug-report-entry">').replace('<h2>Un problème ?</h2>','<h3>Un problème ?</h3>').replace('</section>','</div>')}<h3>Installer ${esc(APP_NAME)}</h3><p>Lancez le jeu depuis votre écran d’accueil. Après le chargement complet, vous pouvez jouer sans connexion.</p><div id="pwa-state" class="notice">${navigator.serviceWorker?.controller?'Les fichiers du jeu sont disponibles hors ligne.':'Préparation du mode hors ligne… Une connexion est nécessaire au premier chargement.'}</div>${installPrompt?'<button class="button primary" data-action="install">Installer l’application</button>':'<button class="button secondary" data-action="install-help">Installer sur iPhone · Comment faire ?</button>'}</section>`);
}
function setSound(sound){appStore.update({sound});if(sound)unlockAudio();}

function render(){navigation?.beforeRender();try{renderPage();}finally{navigation?.afterRender();}}
function renderPage(){ROOT.dataset.view=screen;queueMicrotask(()=>updates?.offer());const state=appStore.getState();if(!state.profile){renderView(ROOT,onboarding.render(),'setup-'+onboarding.step);requestAnimationFrame(()=>onboarding.layout());return;}if(screen==='course'){renderView(ROOT,courses.render(),'course-'+courses.active+'-'+courses.record.index);requestAnimationFrame(()=>courses.layout());return;}if(screen==='pilot'){renderView(ROOT,pilot.render(),'pilot-'+pilot.session?.activity+'-'+(pilot.count?'count':pilot.introduction?'intro-'+pilot.introduction.key:pilot.session?.stage)+'-'+(pilot.resultView||''));requestAnimationFrame(()=>pilot.layout());return;}renderView(ROOT,screen==='changelog'?shell(renderChangelog(CHANNEL==='sandbox'?`Bac à sable ${DISPLAY_VERSION} · prochaine release ${releaseLabel(RELEASE)}`:releaseLabel(RELEASE))):screen==='stats'?shell(pilot.stats()):screen==='settings'?settings():screen==='achievements'?shell(achievements.render()):shell(pilot.home()),screen);}
ROOT.addEventListener('click',e=>{
 const state=appStore.getState(),button=e.target.closest('[data-action]');if(!button)return;e.preventDefault();
 switch(button.dataset.action){
 case 'mute-global':setSound(!state.sound);render();document.querySelector('#setting-sound')?.focus({preventScroll:true});break;
 case 'debug':if(debugAvailable(RELEASE)){pilot.setDebug(!pilot.debugActive);render();}break;
 case 'home':stopAudio();if(screen==='home'){pilot.data.navigation={branch:null,route:null,chapter:null};pilot.save();}setScreen('home');break;
 case 'stats':case 'settings':case 'achievements':case 'changelog':stopAudio();setScreen(button.dataset.action);break;
 case 'fullscreen':toggleFullscreen();break;
 case 'beginner-guide':beginner.open();break;
 case 'install-help':installGuide();break;
 case 'report-bug':bugReports.open();break;
 case 'preview-tuning':playSequence(state.profile.tuning,{step:.23});break;
 case 'preview-voice':playSequence(state.profile.tuning,{step:.23});break;
 case 'edit-profile':{if(pilot.debugActive)pilot.setDebug(false);onboarding.reset(state.profile,state.notation);pilot.leave();appStore.update({profile:null});render();}break;
 case 'choose-import':if(pilot.debugActive){toast('Désactivez le mode débug avant d’importer.');break;}document.querySelector('#import-file').click();break;
 case 'export':{const data=storageService.backup(state,pilot.exportData()),url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`${APP_NAME.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}-${RELEASE}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
 case 'install':if(installPrompt){installPrompt.prompt();installPrompt.userChoice.then(()=>{installPrompt=null;render();});}break;
 }
});
ROOT.addEventListener('change',async e=>{
 if(e.target.id==='setting-notation'){appStore.update({notation:e.target.value});render();}
 if(e.target.id==='setting-accidentals'){appStore.update({accidentals:e.target.value});render();}

 if(e.target.id==='setting-voice'){appStore.update({voice:e.target.value});}
 if(e.target.name==='theme'){appStore.update({theme:e.target.value});render();}
 if(e.target.id==='import-file'){
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>10_000_000)throw new Error('Le fichier est trop volumineux.');const raw=JSON.parse(await file.text());storageService.parseBackup(raw);if(!confirm('Remplacer la progression de cette version par cette sauvegarde ?'))return;pilot.leave();const restored=storageService.restoreBackup(raw);appStore.replace(restored.settings,{persist:false});pilot.importData(restored.pilot,{persist:false});setScreen('home');toast('Votre progression est restaurée.');}catch(error){toast(error.message||'Sauvegarde illisible.');}
 }
});

const pilot=new PilotController({storage:storageService,setAccidentals:accidentals=>appStore.update({accidentals}),setPositionButtons:value=>appStore.update({positionButtons:value}),getState:appStore.getState,showPilot:()=>{screen='pilot';render();},openCourse:id=>{screen='course';courses.open(id);},onActivityStart:()=>{},home:()=>setScreen('home'),stats:()=>setScreen('stats'),achievements:id=>{if(id)achievements.reveal(id);setScreen('achievements');if(id)requestAnimationFrame(()=>achievements.focusRevealed(ROOT));},icon,playNote,playSequence,playArrangement,stopAudio,unlockAudio,setSound,toggleFullscreen});
const courses=new CourseController({pilot,getState:appStore.getState,render:()=>{screen='course';render();},home:()=>setScreen('home'),playSequence,icon});
const bugReports=new BugReportController({getConfiguration:()=>bugConfiguration({release:RELEASE,profile:appStore.getState().profile,theme:document.documentElement.dataset.theme,viewport:[innerWidth,innerHeight],standalone:matchMedia('(display-mode: standalone)').matches})});
const stateProfileKey=()=>appStore.getState().profile?.key;
const achievements=new AchievementsController({pilot,getState:appStore.getState,setPreferences:collection=>appStore.update({collection}),render,icon,playArrangement,stopAudio,openCourse:id=>{screen='course';courses.open(id);},start:(id,profile)=>{if(profile){if(pilot.debugActive&&profile.key!==stateProfileKey())pilot.setDebug(false);appStore.update({profile});}pilot.start(id);}});
const onboarding=new OnboardingController({getState:appStore.getState,render,icon,playNote:midi=>playNote(midi,{instrumentId:onboarding.instrumentId}),playSequence:notes=>playSequence(notes,{step:.23,instrumentId:onboarding.instrumentId}),stopAudio,setSound,complete:(profile,notation)=>{appStore.update({profile,notation});setScreen('home');if(!appStore.getState().beginnerGuide)beginner.open();}});
document.fonts?.ready.then(()=>{if(!appStore.getState().profile)onboarding.layout();});
appStore.subscribe((next,previous)=>{audioService.preferencesChanged(next,previous);platformService.setTheme(next.theme);});
platformService.setTheme(appStore.getState().theme);
platformService.connect({
 onHidden(){audioService.setForeground(false);if(screen==='pilot')pilot.pause({keepAudio:true});},
 onVisible(){audioService.setForeground(true);},
 onResize(){if(!appStore.getState().profile)requestAnimationFrame(()=>onboarding.layout());else if(screen==='pilot')pilot.clock.stop('layout');},
 onResizeSettled(){if(screen==='pilot'){render();pilot.clock.resume('layout');}if(screen==='course')courses.layout();},
 onFullscreen:syncFullscreen,
 onInstallPrompt(event){installPrompt=event;if(screen==='settings')render();}
});
navigation=new NavigationController({root:ROOT,read:()=>appStore.getState().profile?({profile:appStore.getState().profile.key,screen,nav:structuredClone(pilot.data.navigation||{}),course:screen==='course'?courses.active:null,activity:screen==='pilot'?pilot.session?.activity:null}):({profile:null,screen:'setup'}),restore:s=>{
 stopAudio();if(screen==='pilot')pilot.leave();if(screen==='course'){courses.save();courses.active=null;}if(screen==='achievements')achievements.stop();
 if(s.profile!==appStore.getState().profile?.key){setScreen('home');return;}
 pilot.data.navigation=structuredClone(s.nav||{});pilot.save();
 if(s.screen==='course'&&s.course){screen='course';courses.open(s.course);return;}
 if(s.screen==='pilot'&&pilot.data.session?.activity===s.activity&&!pilot.data.session.completed){pilot.start(s.activity,true);return;}
 screen=s.screen==='pilot'?'home':['home','stats','achievements','settings','changelog'].includes(s.screen)?s.screen:'home';render();
}});
bindParentSwipe(ROOT,{enabled:()=>['home','course','pilot'].includes(screen)&&!!appStore.getState().profile,forward:()=>navigation.forward(),back:()=>{
 if(navigation.back())return;
 if(screen==='course'){courses.close();return;}
 if(screen==='pilot'){pilot.action('exit');return;}
 const parent=parentNavigation(pilot.data.navigation);if(!parent)return;pilot.data.navigation=parent;pilot.save();setScreen('home');
}});
ROOT.addEventListener('keydown',e=>{
 if(e.key==='Tab'&&screen==='pilot'&&pilot.paused){const items=[...ROOT.querySelectorAll('.game-header button,.launch-tools button,.pause-card button')].filter(b=>!b.disabled&&b.getClientRects().length);const i=items.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();items.at(-1)?.focus();}else if(!e.shiftKey&&i===items.length-1){e.preventDefault();items[0]?.focus();}}
 if(e.key!=='Escape'||e.target.closest('input,textarea,select')||document.querySelector('dialog[open]'))return;
 if(screen==='pilot'&&pilot.session&&!pilot.introduction&&pilot.session.stage!=='result'){e.preventDefault();pilot.action(pilot.paused?'resume-pause':'pause');}
});
bindNeckKeyboard(ROOT);bindProgress(ROOT);onboarding.bind(ROOT);pilot.bind(ROOT);courses.bind(ROOT);achievements.bind(ROOT);render();

const beginner=new BeginnerGuide({getState:appStore.getState,onDone:()=>{appStore.update({beginnerGuide:true});updates.offer();}});
updates=new UpdateController({beforeUpdate:()=>{if(pilot.session)pilot.save();return storageService.saveSettings(appStore.getState()).ok&&storageService.savePilot(pilot.exportData()).ok;},canPrompt:()=>!document.querySelector('dialog[open]')&&screen!=='pilot'&&screen!=='course'});
// Unlock on an explicit tap/keyboard action, never after a delayed transition.
for(const event of ['pointerdown','keydown'])document.addEventListener(event,e=>{if(e.isTrusted)unlockAudio();},{capture:true});
updates.start();
