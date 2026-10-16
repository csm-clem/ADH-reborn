import {INSTRUMENTS,PITCHES,makeProfile,noteName,pitchLabel,frequency,lessons,isUnlocked,nextLesson,score,question,checkAnswer,initialState,validateState,validAnswers,neckGeometry,microCourse,nextMilestone} from './core.js';

import {ActiveClock} from './clock.js';
import {pluckedString} from './sound.js';
import {PilotController} from './pilot-ui.js';
import {validatePilotStore} from './pilot.js';
const responseClock=new ActiveClock(),countdownClock=new ActiveClock();
const ROOT=document.querySelector('#app'),KEY='adh-reborn:state:v1';
let state=initialState(),storageAvailable=true,screen='home',game=null,q=null,feedback=null,paused=false,pan=0,installPrompt=null,audio=null,autoTimer=null,fretAlternative=false,countdown=0,countdownTimer=null,countdownEpoch=0;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try { const saved=localStorage.getItem(KEY);if(saved){const parsed=JSON.parse(saved);state=validateState(parsed);const session=parsed.session;if(session&&state.profile&&session.key===state.profile.key&&lessons(state.profile).some(l=>l.id===session.lesson)&&validAnswers(session.answers)&&Number.isFinite(session.startedAt))state.session=session;} }catch { storageAvailable=false; }
const icons={home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',chart:'<path d="M4 19h17M7 15V9m6 6V5m6 10v-8"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',back:'<path d="m14 6-6 6 6 6"/>',play:'<path d="m9 5 11 7-11 7z"/>',check:'<path d="m5 12 4 4L19 6"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',mute:'<path d="m11 5-6 4H2v6h3l6 4zM16 9l6 6m0-6-6 6"/>',tap:'<path d="M9 12V5a2 2 0 0 1 4 0v7l2-1 5 4-2 6H9l-5-7a2 2 0 0 1 3-2l2 2"/>',sound:'<path d="m11 5-6 4H2v6h3l6 4zM15 8a5 5 0 0 1 0 8m3-11a9 9 0 0 1 0 14"/>',pause:'<path d="M8 5v14M16 5v14"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'};
const icon=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.play}</svg>`;
const stars=n=>`<span class="stars" aria-label="${n} étoiles sur 5">${Array.from({length:5},(_,i)=>`<span class="${i<n?'earned':''}">★</span>`).join('')}</span>`;
const records=()=>state.profile?(state.progress[state.profile.key]||{}):{};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageAvailable=true;}catch{storageAvailable=false;}}
function toast(message){document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.role='status';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),5000);}
function setScreen(value){if(screen==='pilot')pilot.leave();clearTimeout(autoTimer);cancelCountdown();screen=value;feedback=null;paused=false;render();window.scrollTo(0,0);}
function logo(){return `<a class="brand" href="#" data-action="home"><img src="./icons/icon.svg" alt=""><span>ADH<span class="brand-sub">reborn</span></span></a>`;}
function shell(body){
 const instrument=state.profile?`${esc(state.profile.label)}<small>${state.profile.tuning.map(n=>esc(noteName(n,state.notation))).join(' · ')}</small>`:'';
 return `<div class="shell"><aside class="sidebar">${logo()}<p class="nav-label">VOTRE ESPACE</p><nav>${[['home','Mon parcours','home'],['stats','Mes progrès','chart'],['settings','Paramètres','settings']].map(([page,label,i])=>`<button data-action="${page}" class="nav-item ${screen===page?'active':''}">${icon(i)}<span>${label}</span></button>`).join('')}</nav><div class="sidebar-bottom"><div class="instrument-badge"><span class="status-dot"></span><div>${instrument}</div></div><p>Un peu chaque jour.<br>Un manche qui devient familier.</p></div></aside><div class="main-shell"><header class="topbar"><span class="crumb">${screen==='stats'?'Mes progrès':screen==='settings'?'Paramètres':'Mon parcours'} <span>/</span> ${screen==='home'?'Zone 01':'ADH Reborn'}</span><span class="top-tag">${icon('sound')} 5 min pour vous</span></header><main class="content" id="main-content" tabindex="-1">${!storageAvailable?'<p class="notice" role="alert">La sauvegarde locale est indisponible. Exportez vos progrès avant de fermer.</p>':''}${body}</main><footer class="footer"><span>À votre rythme, note après note.</span><span id="offline-status">${navigator.onLine?'Prêt à jouer':'Vous êtes hors ligne'}</span></footer></div><nav class="mobile-nav">${[['home','Parcours','home'],['stats','Progrès','chart'],['settings','Réglages','settings']].map(([page,label,i])=>`<button data-action="${page}" class="${screen===page?'active':''}">${icon(i)}${label}</button>`).join('')}</nav></div>`;
}
function setup(){
 return `<main id="main-content" tabindex="-1" class="welcome">${logo()}<div class="welcome-grid"><section><span class="eyebrow">VOTRE MANCHE. VOTRE TERRAIN DE JEU.</span><h1>Les notes,<br><em>au bout des doigts.</em></h1><p class="lead">Cinq minutes pour passer de « je cherche » à « je sais ». Commencez par les cordes à vide, puis reliez les notes avec des intervalles musicaux.</p><div class="welcome-art">${miniNeck(6)}</div><div class="feature-row"><span>✦ Progression douce</span><span>◉ Jouez hors ligne</span><span>↗ Vos progrès visibles</span></div></section><form id="setup-form" class="setup-card"><span class="eyebrow">01 / VOTRE INSTRUMENT</span><h2>Faisons connaissance.</h2><p>Choisissez votre configuration favorite. La première zone, cases 0 à 4, est gratuite.</p><label for="instrument">Instrument et nombre de cordes</label><select id="instrument" name="instrument">${INSTRUMENTS.map(i=>`<option value="${i.id}">${i.name} ${i.strings} cordes</option>`).join('')}</select><label for="tuning">Accordage, dans l’ordre physique des cordes</label><input id="tuning" name="tuning" value="${INSTRUMENTS[0].tuning}" autocomplete="off" spellcheck="false"><small>Du bord grave vers le bord aigu habituel, avec les octaves : E2 A2 D3 G3 B3 E4. Vous pouvez choisir un accordage personnalisé.</small><div id="tuning-preview" class="tuning-preview">${INSTRUMENTS[0].tuning}</div><label for="notation">Noms des notes</label><select id="notation" name="notation"><option value="international">C · D · E (international)</option><option value="latin">Do · Ré · Mi</option></select><p class="setup-disclosure">Votre premier instrument est gratuit. Ajouter une autre configuration et explorer les autres zones fera partie de la version complète, à venir.</p><p id="form-error" class="form-error" role="alert"></p><button class="button primary wide" type="submit">C’est parti ${icon('arrow')}</button><small>Sans compte, sans abonnement. Vous pourrez corriger votre choix avant le premier exercice.</small></form></div></main>`;
}
function miniNeck(strings=6){
 const g=neckGeometry(strings,4),profile=state.profile||makeProfile('guitar6'),markers=[{s:0,f:1},{s:strings-2,f:2}];
 return `<svg class="mini-neck" viewBox="0 0 ${g.width} ${g.height}" role="img" aria-label="Manche stylisé, frettes aux proportions réelles"><defs><linearGradient id="hero-fade"><stop offset="70%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient><mask id="hero-mask"><rect width="${g.width}" height="${g.height}" fill="url(#hero-fade)"/></mask></defs><g mask="url(#hero-mask)"><rect x="${g.nut}" y="12" width="${g.width-g.nut}" height="${g.height-24}" rx="2" fill="#e7cba4"/>${g.frets.map((x,f)=>`<path d="M${x} 12v${g.height-24}" stroke="${f===0?'#626b77':'#8a919b'}" stroke-width="${f===0?1.6:.65}"/>`).join('')}${g.ys.map((y,i)=>`<path d="M${g.nut-4} ${y}H${g.width}" stroke="#44516b" stroke-width="${.22+(strings-1-i)*.07}"/>`).join('')}<circle cx="${g.centers[3]}" cy="${g.height/2}" r="1.5" fill="#91837a"/></g>${markers.map(m=>`<circle cx="${g.centers[m.f]}" cy="${g.ys[m.s]}" r="4.5" fill="#b64024"/><text x="${g.centers[m.f]}" y="${g.ys[m.s]+1.3}" text-anchor="middle" font-size="3.5" font-family="Open Sans" font-weight="700" fill="#333c4e">${esc(noteName(profile.tuning[m.s]+m.f,state.notation))}</text>`).join('')}</svg>`;
}
function legacyHome(){
 const list=lessons(state.profile),r=records(),done=list.filter(l=>(r[l.id]?.stars||0)>=3).length;
 const next=nextLesson(list,r),current=list[next<0?list.length-1:next];
 const progress=Math.round(done/list.length*100);
 const today=new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
 return shell(`<div class="page-heading"><div><p class="eyebrow">${esc(today)}</p><h1>Votre manche,<br><em>un peu plus familier.</em></h1><p>Une corde à la fois. Les automatismes viennent en jouant.</p></div><div class="daily-pill"><span>✦</span><div>Votre rendez-vous<small>5 minutes de jeu</small></div></div></div><section class="zone-hero"><div class="hero-copy"><div class="tag light">ZONE 01 <span>·</span> GRATUITE</div><h2>Les premiers repères.</h2><p>Cases 0 à 4 · ${state.profile.tuning.length} cordes<br>Découvrez, retrouvez, puis reliez les notes.</p><div class="hero-progress"><span>${done} / ${list.length} exercices validés</span><strong>${progress}%</strong></div><div class="progress-track"><i style="width:${progress}%"></i></div><button class="button lime" data-action="${state.session?'resume':'start'}" ${state.session?'':`data-lesson="${current.id}"`}>${icon('play')}${state.session?'Reprendre ma séance':done===0?'Commencer à jouer':next<0?'Perfectionner ma zone':'Continuer mon parcours'}</button></div><div class="hero-art">${miniNeck(state.profile.tuning.length)}<span class="art-caption">DE LA CONNAISSANCE À L’AUTOMATISME</span></div></section><div class="section-heading"><div><h2>Votre parcours</h2><p>Les petits pas font les bons réflexes.</p></div><button class="text-button" data-action="rules">Comment gagner les étoiles ? ${icon('arrow')}</button></div><div class="lesson-list">${list.map((l,i)=>{
 const unlocked=isUnlocked(list,i,r),record=r[l.id],isNext=i===next;
 const chapterStart=i===0||list[i-1].chapter!==l.chapter||list[i-1].string!==l.string;
 return `${chapterStart?`<div class="chapter-heading"><span>${l.chapter==='Relier les cordes'?'↔':String(l.string+1).padStart(2,'0')}</span><div><h3>${l.chapter==='Relier les cordes'?l.chapter:`${esc(l.chapter)} · ${esc(noteName(state.profile.tuning[l.string],state.notation))}`}</h3><small>${l.chapter==='Relier les cordes'?'Consolidez les notes déjà apprises.':'Découvrez les notes, puis retrouvez-les vous-même.'}</small></div></div>`:''}<button class="lesson-row ${isNext?'next':''}" data-action="start" data-lesson="${l.id}" ${unlocked?'':'disabled'}><span class="lesson-symbol ${record?.stars>=3?'complete':''}">${record?.stars>=3?icon('check'):unlocked?icon('play'):icon('lock')}</span><span class="lesson-copy"><strong>${esc(l.title)}</strong><small>${l.mode==='find'?'Nom → position':l.mode==='mixed'?'Les deux sens':'Position → nom'} · ${l.count} questions</small></span>${isNext?'<span class="next-tag">À VOUS</span>':''}${stars(record?.stars||0)}${icon('arrow')}</button>`;
 }).join('')}</div><section class="future-zones"><div><span class="zone-index">02</span><h3>Étendre vos repères</h3><p>Cases 5–9</p><span>${icon('lock')} À venir · version complète</span></div><div><span class="zone-index">03</span><h3>Relier le manche</h3><p>Cases 8–12</p><span>${icon('lock')} À venir · version complète</span></div></section>`);
}
function home(){return shell(pilot.home());}
function legacyStats(){
 const r=records(),list=lessons(state.profile),attempts=state.stats.filter(s=>s.key===state.profile.key);
 const all=attempts.flatMap(s=>s.answers||[]),summary=score(all);
 return shell(`<div class="page-heading"><div><p class="eyebrow">LES PROGRÈS QUI COMPTENT</p><h1>Vos notes.<br><em>Vos automatismes.</em></h1><p>La précision d’abord. La fluidité ensuite.</p></div></div><div class="stat-grid"><div><small>Exercices validés</small><strong>${list.filter(l=>(r[l.id]?.stars||0)>=3).length}<span> / ${list.length}</span></strong></div><div><small>Premières réponses correctes</small><strong>${all.length?Math.round(summary.accuracy*100)+'%':'—'}</strong></div><div><small>Temps médian · réponses correctes</small><strong>${summary.medianMs===null?'—':(summary.medianMs/1000).toFixed(1)+' s'}</strong></div></div><section class="panel"><h2>Votre zone, corde par corde</h2><p>Chaque case indique votre précision sur les premières réponses. Une case vide reste à découvrir.</p><div class="heatmap">${state.profile.tuning.map((midi,string)=>`<div class="heat-row"><strong>${esc(noteName(midi,state.notation))}<small>Corde ${state.profile.tuning.length-string}</small></strong>${[0,1,2,3,4].map(fret=>{const a=all.filter(a=>a.target.string===string&&a.target.fret===fret),pct=a.length?Math.round(a.filter(a=>a.correct).length/a.length*100):null;return `<div class="heat-cell ${pct===null?'empty':pct>=90?'good':pct>=60?'medium':'review'}"><small>${fret===0?'À vide':`Case ${fret}`}</small><b>${esc(noteName(midi+fret,state.notation))}</b><span>${pct===null?'—':pct+'%'}</span></div>`;}).join('')}</div>`).join('')}</div></section><section class="panel"><h2>Vos dernières séances</h2>${attempts.length?attempts.slice(-8).reverse().map(a=>`<div class="history-row"><div><strong>${esc(list.find(l=>l.id===a.lesson)?.title||'Exercice')}</strong><small>${new Date(a.at).toLocaleDateString('fr-FR')} · ${Math.round(score(a.answers).accuracy*100)}% de précision</small></div>${stars(score(a.answers).stars)}</div>`).join(''):'<p>Votre premier exercice fera apparaître vos résultats ici. Pas besoin de battre un record pour progresser.</p><button class="button primary" data-action="home">Découvrir mon parcours</button>'}</section>`);
}
function stats(){return shell(pilot.stats());}
function settings(){
 const played=state.stats.some(s=>s.key===state.profile.key)||!!pilot.data.attempts.length;
 return shell(`<div class="page-heading"><div><p class="eyebrow">FAITES COMME CHEZ VOUS</p><h1>Votre façon<br><em>de jouer.</em></h1></div></div><section class="panel"><h2>Votre instrument favori</h2><div class="profile-card">${icon('sound')}<div><strong>${esc(state.profile.label)}</strong><small>${state.profile.tuning.map(n=>esc(pitchLabel(n,state.notation))).join(' · ')}</small></div></div>${!played?'<button class="text-button" data-action="edit-profile">Corriger mon choix initial</button>':'<p class="muted">L’ajout d’autres instruments et accordages sera proposé avec la version complète. Aucun achat n’est disponible dans ce MVP.</p>'}</section><section class="panel"><h2>Confort de jeu</h2><div class="setting-row"><label for="setting-notation">Noms des notes<small>Appliqué à tout le parcours et aux résultats.</small></label><select id="setting-notation"><option value="international" ${state.notation==='international'?'selected':''}>C · D · E</option><option value="latin" ${state.notation==='latin'?'selected':''}>Do · Ré · Mi</option></select></div><div class="setting-row"><label for="setting-sound">Écouter les notes<small>Un son doux après chaque réponse.</small></label><input type="checkbox" role="switch" id="setting-sound" ${state.sound?'checked':''}></div><div class="setting-row"><label for="setting-theme">Apparence</label><select id="setting-theme"><option value="light" ${state.theme==='light'?'selected':''}>Claire</option><option value="dark" ${state.theme==='dark'?'selected':''}>Sombre</option></select></div></section><section class="panel"><h2>Vos progrès restent à vous</h2><p>Ils sont enregistrés sur cet appareil, dans ce navigateur. Exportez une copie avant de changer d’appareil ou d’effacer les données du navigateur.</p><div class="button-row"><button class="button secondary" data-action="export">${icon('download')} Exporter mes progrès</button><button class="button secondary" data-action="choose-import">Importer une sauvegarde</button><input type="file" id="import-file" accept="application/json,.json" hidden></div></section><section class="panel"><h2>Installer ADH Reborn</h2><p>Lancez le jeu depuis votre écran d’accueil. Après le chargement complet, vous pouvez jouer sans connexion.</p><div id="pwa-state" class="notice">${navigator.serviceWorker?.controller?'Les fichiers du jeu sont disponibles hors ligne.':'Préparation du mode hors ligne… Une connexion est nécessaire au premier chargement.'}</div>${installPrompt?'<button class="button primary" data-action="install">Installer l’application</button>':'<p class="muted">Android : menu du navigateur → Installer l’application. iPhone : Safari → Partager → Sur l’écran d’accueil.</p>'}</section>`);
}
function startLesson(id,resume=false){
 clearTimeout(autoTimer);cancelCountdown();const list=lessons(state.profile),index=list.findIndex(l=>l.id===id);
 if(index<0||!isUnlocked(list,index,records()))return;
 const previous=resume?state.session:null;
 game={lesson:list[index],answers:previous?.answers||[],startedAt:previous?.startedAt||Date.now()};
 if(game.answers.length>=game.lesson.count){finish();return;}
 state.session={key:state.profile.key,lesson:id,answers:game.answers,startedAt:game.startedAt};save();
 screen='game';pan=0;paused=false;feedback=null;unlockAudio();
 if(!resume){screen='brief';render();}else startCountdown();
}
function diagramLesson(showNames=false){
 const count=state.profile.tuning.length;
 const strings=(x1,x2)=>Array.from({length:count},(_,i)=>`<path d="M${x1} ${64+i*48/(count-1)}H${x2}" stroke="${i===count-1?'#f46b48':'#677287'}" stroke-width="${.7+i*2.5/(count-1)}"/>`).join('');
 return `<figure class="diagram-lesson"><svg viewBox="0 0 620 170" role="img" aria-label="Comparaison du manche réel vu de face et de son diagramme : la corde la plus épaisse est en bas"><text x="142" y="25" text-anchor="middle" class="diagram-title">Sur l’instrument</text><path d="M30 51 50 45 50 120 30 127Z" fill="#d6c3a7"/><rect x="50" y="53" width="215" height="70" rx="3" fill="#e5d7c2"/><path d="M265 50Q294 62 287 86Q300 114 265 128" fill="#d6c3a7"/>${[65,109,150,189,226].map(x=>`<path d="M${x} 55v65" stroke="#a49280"/>`).join('')}${strings(35,275)}<path d="M305 86h27m-6-6 6 6-6 6" fill="none" stroke="#f46b48" stroke-width="2"/><text x="471" y="25" text-anchor="middle" class="diagram-title">Sur le diagramme</text><rect x="353" y="53" width="240" height="70" rx="3" fill="var(--surface)" stroke="#b6bcc6"/>${[353,413,473,533,593].map(x=>`<path d="M${x} 53v70" stroke="#a3acba" stroke-width="${x===353?3:1}"/>`).join('')}${strings(353,593)}<text x="142" y="149" text-anchor="middle" class="diagram-caption">${showNames?'Repérez la nouvelle corde':'La grosse corde : son grave'}</text><text x="471" y="149" text-anchor="middle" class="diagram-caption">${showNames?'Même place, mêmes repères':'La même corde, en bas du dessin'}</text></svg><figcaption>La grosse corde reste en bas du dessin, quelle que soit l’orientation de l’écran.</figcaption></figure>`;
}
function lessonDiagram(l){
 const profile=state.profile,count=profile.tuning.length,g=neckGeometry(count,l.frets.at(-1)),known=l.string>0||l.mode==='mixed';
 const circles=l.strings.flatMap(string=>l.frets.map(fret=>{
  const current=fret===l.frets.at(-1),name=noteName(profile.tuning[string]+fret,state.notation);
  return `<circle cx="${g.centers[fret]}" cy="${g.ys[string]}" r="3.6" fill="${current?'#b64024':'#fff'}" stroke="#b64024" stroke-width=".4"/><text x="${g.centers[fret]}" y="${g.ys[string]+1.2}" text-anchor="middle" font-size="2.7" fill="${current?'#fff':'#44516b'}" font-family="Open Sans">${esc(name)}</text>`;
 })).join('');
 return `<figure class="lesson-diagram"><svg viewBox="0 0 ${g.width} ${g.height}" role="img" aria-label="Exemple : ${esc(l.chapter)}, cases 0 à ${l.frets.at(-1)}"><rect x="${g.nut}" y="12" width="${g.width-g.nut}" height="${g.height-24}" fill="#e7cba4" rx="2"/>${g.frets.map((x,f)=>`<path d="M${x} 12v${g.height-24}" stroke="${f===0?'#6e7580':'#9298a1'}" stroke-width="${f===0?1.6:.7}"/>`).join('')}${g.ys.map((y,string)=>`<path d="M${g.nut-24} ${y}H${g.width}" stroke="${l.strings.includes(string)?'#44516b':'#9e9385'}" stroke-width="${.2+(count-1-string)*.07}"/>${known?`<text x="4" y="${y+1.2}" font-size="3" fill="var(--ink)">${esc(noteName(profile.tuning[string],state.notation))}</text>`:''}`).join('')}${circles}${g.centers.map((x,f)=>`<text x="${x}" y="${g.height-2}" text-anchor="middle" font-size="3.5" fill="var(--ink)">${f}</text>`).join('')}</svg><figcaption>${l.mode==='mixed'?`${l.strings.length} cordes réunies dans les cases 0 à 4.`:l.mode==='find'?`Le nom demandé vous ramène à un repère sur la corde ${count-l.string}.`:`${l.string===0?'La grosse corde':`Corde ${count-l.string}`} : ${l.frets.map(f=>`${f===0?'à vide':'case '+f} → ${noteName(profile.tuning[l.string]+f,state.notation)}`).join(' · ')}.`}</figcaption></figure>`;
}
function briefScreen(){
 const l=game.lesson,course=microCourse(state.profile,l,state.notation);
 return shell(`<section class="result-card briefing"><span class="eyebrow">${esc(l.title)}</span><h1>${esc(course.title)}</h1><div class="micro-course"><p>${esc(course.principle)}</p>${l.id==='s0-first'?diagramLesson():lessonDiagram(l)}<div class="course-example">${esc(course.example)}</div></div>${l.mode==='mixed'?'':`<div class="discovery-notes">${l.frets.map(f=>`<button data-action="preview-note" data-midi="${state.profile.tuning[l.string]+f}" aria-label="Écouter ${esc(noteName(state.profile.tuning[l.string]+f,state.notation))}, ${f===0?'à vide':'case '+f}"><small>${f===0?'À vide':`Case ${f}`}</small><strong>${esc(noteName(state.profile.tuning[l.string]+f,state.notation))}</strong>${icon('sound')}</button>`).join('')}</div>`}<p class="course-goal">${esc(course.goal)}</p><button class="button primary" data-action="begin">À moi de jouer ${icon('play')}</button><br><button class="text-button" data-action="home">Retour au parcours</button></section>`);
}
function cancelCountdown(){clearTimeout(countdownTimer);countdownTimer=null;countdown=0;countdownEpoch++;}
function startCountdown(){
 cancelCountdown();unlockAudio();screen='game';paused=false;feedback=null;fretAlternative=false;
 q=question(state.profile,game.lesson,game.answers);countdown=3;countdownClock.reset();responseClock.reset();responseClock.stop('countdown');
 const epoch=countdownEpoch;render();window.scrollTo(0,0);countdownTimer=setTimeout(()=>tickCountdown(epoch),100);
}
async function tickCountdown(epoch){
 if(epoch!==countdownEpoch||screen!=='game'||paused)return;
 const remaining=3000-countdownClock.elapsed();
 if(remaining>0){countdown=Math.ceil(remaining/1000);const number=document.querySelector('.countdown-number');if(number&&number.textContent!==String(countdown))number.textContent=countdown;countdownTimer=setTimeout(()=>tickCountdown(epoch),100);return;}
 await unlockAudio();if(epoch!==countdownEpoch||screen!=='game'||paused)return;
 countdown=0;render();requestAnimationFrame(()=>{if(epoch!==countdownEpoch||screen!=='game'||paused)return;responseClock.reset();playNote(q.target.midi);});
}
function nextQuestion(){
 cancelCountdown();feedback=null;fretAlternative=false;q=question(state.profile,game.lesson,game.answers);const epoch=countdownEpoch;
 render();requestAnimationFrame(()=>{if(epoch!==countdownEpoch||screen!=='game')return;responseClock.reset();if(paused)responseClock.stop('pause');else if(q.mode==='name')playNote(q.target.midi);});
}
function pauseGame(){if(paused)return;clearTimeout(autoTimer);responseClock.stop('pause');if(countdown){countdownClock.stop('pause');clearTimeout(countdownTimer);}paused=true;render();}
function neckSVG(interactive=true){
 const count=state.profile.tuning.length,g=neckGeometry(count,game.lesson.frets.at(-1),state.profile.instrumentId.startsWith('bass')?864:648),isFind=q?.mode==='find';
 const accessible=game.lesson.strings,last=game.lesson.frets.at(-1),fade=Math.round(g.fadeStart/g.width*100);
 const drawing=`<rect x="${g.nut}" y="12" width="${g.width-g.nut}" height="${g.height-24}" rx="1" fill="var(--wood)"/>${g.frets.map((x,f)=>`<path d="M${x} 12v${g.height-24}" stroke="${f===0?'#626b77':'#8a919b'}" stroke-width="${f===0?1.6:.65}"/>`).join('')}${last>=3?`<circle cx="${g.centers[3]}" cy="${g.height/2}" r="1.6" fill="#8c8284"/>`:''}${g.ys.map((y,s)=>`<path d="M${g.nut-4} ${y}H${g.width}" stroke="${accessible.includes(s)?'#44516b':'#a49b8f'}" stroke-width="${.22+(count-1-s)*.07}"/>`).join('')}`;
 return `<svg id="fretboard" viewBox="0 0 ${g.width} ${g.height}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Manche, cases 0 à ${last}"><defs><linearGradient id="neck-fade"><stop offset="0%" stop-color="white"/><stop offset="${fade}%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient><mask id="neck-mask"><rect width="${g.width}" height="${g.height}" fill="url(#neck-fade)"/></mask></defs><g mask="url(#neck-mask)">${drawing}</g>${g.centers.map((x,f)=>`<text x="${x}" y="${g.height-2}" text-anchor="middle" fill="var(--neck-ink)" font-size="3.4" font-family="Open Sans">${f}</text>`).join('')}${(game.lesson.string>0||records()['s1-first']?.stars)?g.ys.map((y,s)=>`<text x="5" y="${y+1.3}" fill="${accessible.includes(s)?'#44516b':'#6c7480'}" font-size="3.5" font-family="Open Sans" text-anchor="middle">${esc(noteName(state.profile.tuning[s],state.notation))}</text>`).join(''):''}${g.ys.flatMap((y,string)=>g.centers.map((x,fret)=>{
 const available=!countdown&&(isFind?string===q.target.string:accessible.includes(string))&&game.lesson.frets.includes(fret),target=q.target.string===string&&q.target.fret===fret;
 const highlight=!countdown&&target&&(!isFind||feedback),selection=feedback?.selected?.string===string&&feedback?.selected?.fret===fret;
 const label=`Corde ${count-string}, ${fret===0?'à vide':`case ${fret}`}`;
 const left=fret===0?g.nut-24:g.frets[fret-1],width=fret===0?24:g.frets[fret]-left;
 const listen=interactive&&!countdown&&!isFind&&target;
 return `<g class="fret-hit ${listen?'audible ':''}${available&&interactive&&isFind&&!feedback?'selectable':''}" ${listen?`role="button" tabindex="0" data-action="listen-target" aria-label="Réécouter la note demandée, ${label}"`:available&&interactive&&isFind&&!feedback?`role="button" tabindex="0" data-string="${string}" data-fret="${fret}" aria-label="${label}"`:''}><rect x="${left}" y="${y-4}" width="${width}" height="8" fill="transparent"/>${highlight?`<circle class="target-marker" cx="${x}" cy="${y}" r="3.4" fill="${feedback?'#44516b':'#b64024'}"/><circle cx="${x}" cy="${y}" r="4.8" fill="none" stroke="${feedback?'#44516b':'#b64024'}" stroke-width=".3" opacity=".4"/>`:''}${selection&&!feedback.correct&&!target?`<circle cx="${x}" cy="${y}" r="3.4" fill="#f29989"/>`:''}${isFind&&available&&!feedback?`<circle class="touch-node" cx="${x}" cy="${y}" r="2.6" fill="#b64024"/><circle cx="${x}" cy="${y}" r="3.9" fill="none" stroke="#b64024" stroke-width=".3"/>`:''}</g>`;
 })).join('')}</svg>`;
}
function answerWheel(mode){
 const choices=mode==='name'?PITCHES.map((_,i)=>i):game.lesson.frets;
 return `<div class="answer-wheel ${mode==='find'?'case-wheel':''}" role="group" aria-label="${mode==='name'?'Choisir le nom de la note':'Choisir une case'}"><div class="wheel-center" aria-hidden="true"><span>Votre<br>réponse</span></div>${choices.map((value,index)=>{
 const angle=-Math.PI/2+index*Math.PI*2/choices.length,x=50+40*Math.cos(angle),y=50+40*Math.sin(angle);
 const correct=feedback&&(mode==='name'?value===q.target.midi%12:value===q.target.fret);
 const wrong=feedback&&!feedback.correct&&(mode==='name'?feedback.selected===value:feedback.selected?.fret===value);
 const label=mode==='name'?noteName(value,state.notation):value===0?'À vide':`Case ${value}`;
 return `<button style="left:${x}%;top:${y}%" data-action="${mode==='name'?'answer-note':'answer-fret'}" ${mode==='name'?`data-note="${value}"`:`data-fret="${value}"`} ${feedback||countdown?'disabled':''} class="${correct?'answer-correct':''} ${wrong?'answer-wrong':''}" aria-label="${esc(label)}">${esc(label)}</button>`;
 }).join('')}</div>`;
}
function gameScreen(){
 const count=state.profile.tuning.length,target=q.target;
 const knownNames=game.lesson.string>0||records()['s1-first']?.stars;
 const stringHint=game.lesson.string===0&&!knownNames?'La grosse corde':`Corde ${count-target.string} (${noteName(state.profile.tuning[target.string],state.notation)})`;
 const questionTitle=countdown?'Prêt à jouer ?':q.mode==='name'?'Quelle est cette note ?':`Trouvez ${noteName(target.midi,state.notation)}.`;
 const hint=countdown?'La première question arrive…':q.mode==='name'?`${stringHint} · ${target.fret===0?'à vide':`case ${target.fret}`}`:`${stringHint} · cases ${game.lesson.frets[0]} à ${game.lesson.frets.at(-1)}`;
 return `<main id="main-content" tabindex="-1" class="game ${paused?'is-paused':''} ${q.mode==='find'?'find-game':''}"><header class="game-header"><button class="icon-button" data-action="exit-game" aria-label="Quitter l’exercice">${icon('close')}</button><div><strong>${esc(game.lesson.title)}</strong><small>ZONE 01 · ${esc(game.lesson.chapter)} <span class="game-counter">${game.answers.length} / ${game.lesson.count}</span></small></div><button class="icon-button" data-action="review-course" aria-label="Revoir le micro-cours">?</button><button class="icon-button" data-action="pause" aria-label="Mettre en pause">${icon('pause')}</button><button class="icon-button sound-toggle ${state.sound?'':'is-muted'}" data-action="toggle-sound" aria-label="${state.sound?'Couper le son':'Activer le son'}" aria-pressed="${!state.sound}" title="${state.sound?'Couper le son':'Activer le son'}">${icon(state.sound?'sound':'mute')}</button></header><div class="game-progress"><i style="transform:scaleX(${game.answers.length/game.lesson.count})"></i></div><div class="game-body"><section class="neck-panel" aria-label="Le manche"><div class="neck-viewport" id="neck-viewport"><div class="neck-inner" id="neck-inner">${neckSVG()}</div><span class="swipe-hint">Glissez pour parcourir le manche</span></div><div class="neck-controls"><button class="icon-button" data-action="pan-neck" data-direction="-1" aria-label="Vers le sillet">${icon('back')}</button><span>Le manche continue après le fondu</span><button class="icon-button" data-action="pan-neck" data-direction="1" aria-label="Vers les cases suivantes">${icon('arrow')}</button></div></section><section class="answer-workspace"><section class="question-copy"><h1>${esc(questionTitle)}</h1><p>${esc(hint)}</p>${q.mode==='find'&&!feedback&&!countdown?`<div class="touch-prompt">${icon('tap')}<span>Touchez un repère orangé directement sur le manche.</span></div><button class="text-button" data-action="toggle-case-buttons" aria-expanded="${fretAlternative}">${fretAlternative?'Masquer les boutons':'Répondre avec les boutons de cases'}</button>`:''}</section><section class="answer-area">${q.mode==='name'&&!countdown?answerWheel('name'):fretAlternative&&!countdown?answerWheel('find'):''}<div class="feedback ${feedback?feedback.correct?'correct':'incorrect':''}" role="status" aria-live="polite">${feedback?`${icon(feedback.correct?'check':'arrow')}<div><strong>${feedback.correct?'Bien joué !':`C’est ${esc(noteName(target.midi,state.notation))}.`}</strong><small>${feedback.correct?'':`${target.fret===0?'À vide':'Case '+target.fret} · le repère bleu-gris indique la réponse.`}</small></div><button class="button ${feedback.correct?'secondary':'primary'}" data-action="next">${game.answers.length>=game.lesson.count?'Voir mon résultat':'Continuer'} ${icon('arrow')}</button>`:`<span>${q.mode==='name'?'Touchez le repère pour réécouter la note.':'Prenez le temps de reconnaître.'}</span>`}</div></section></section>${countdown?`<div class="countdown-overlay" role="status" aria-live="polite" aria-label="Décompte avant l’exercice"><span>À vous de jouer dans</span><strong class="countdown-number">${countdown}</strong></div>`:''}</div>${paused?`<div class="pause-overlay"><section class="pause-card"><h2>À votre rythme.</h2><p>Votre séance est conservée.</p><button class="button primary" data-action="unpause">Reprendre ${icon('play')}</button><button class="text-button" data-action="leave-paused">Retour au parcours</button></section></div>`:''}</main>`;
}
function resultScreen(){
 const summary=score(game.answers),r=records(),list=lessons(state.profile),index=list.findIndex(l=>l.id===game.lesson.id),next=list[index+1],milestone=nextMilestone(game.answers);
 const missed=game.answers.filter(a=>!a.correct),unique=[...new Map(missed.map(a=>[`${a.target.string}:${a.target.fret}`,a.target])).values()];
 return shell(`<section class="result-card score-card"><h1>${summary.stars>=3?'Palier validé !':'Vous avancez.'}</h1><div class="score-display"><strong>${summary.correct}<span>/${game.answers.length}</span></strong><p>bonnes réponses</p></div><div class="score-strip" aria-label="${summary.correct} réponses correctes sur ${game.answers.length}">${game.answers.map(a=>`<i class="${a.correct?'hit':'miss'}" aria-hidden="true"></i>`).join('')}</div><div class="score-details">${stars(summary.stars)}<span>${summary.medianMs===null?'':`${(summary.medianMs/1000).toFixed(1)} s · temps médian correct`}</span></div><div class="next-milestone"><span>${milestone.complete?'OBJECTIF ATTEINT':'PROCHAIN PALIER'} ${stars(milestone.stars)}</span><p>${esc(milestone.label)} ${summary.stars<3?'Continuez !':''}</p></div>${unique.length?`<details class="review-notes"><summary>${unique.length} repère${unique.length>1?'s':''} à revoir</summary>${unique.map(p=>`<span>${esc(noteName(p.midi,state.notation))} · corde ${state.profile.tuning.length-p.string}, ${p.fret===0?'à vide':'case '+p.fret}</span>`).join('')}</details>`:''}<div class="button-row centered">${next&&isUnlocked(list,index+1,r)?`<button class="button primary" data-action="start" data-lesson="${next.id}">La suite ${icon('arrow')}</button>`:''}<button class="button ${summary.stars<3?'primary':'secondary'}" data-action="start" data-lesson="${game.lesson.id}">Rejouer</button></div><button class="text-button" data-action="home">Retour à mon parcours</button></section>`);
}
function finish(){
 const summary=score(game.answers),key=state.profile.key;
 state.progress[key]||={};const previous=state.progress[key][game.lesson.id];
 state.progress[key][game.lesson.id]={stars:Math.max(previous?.stars||0,summary.stars),bestAccuracy:Math.max(previous?.bestAccuracy||0,summary.accuracy),attempts:(previous?.attempts||0)+1};
 state.stats.push({key,lesson:game.lesson.id,at:Date.now(),answers:game.answers});state.stats=state.stats.slice(-5000);state.session=null;save();screen='result';render();
}
function answer(value){
 if(feedback||paused||countdown||screen!=='game'||!q)return;
 const correct=checkAnswer(q,value),ms=responseClock.elapsed();
 game.answers.push({target:{...q.target},mode:q.mode,correct,ms});
 state.session={key:state.profile.key,lesson:game.lesson.id,answers:game.answers,startedAt:game.startedAt};save();
 feedback={correct,selected:value};playNote(q.target.midi);render();
 if(correct&&!matchMedia('(prefers-reduced-motion: reduce)').matches)autoTimer=setTimeout(()=>advance(),850);
}
function advance(){clearTimeout(autoTimer);if(!feedback)return;if(game.answers.length>=game.lesson.count)finish();else nextQuestion();}
function unlockAudio(){if(!state.sound)return Promise.resolve();try{audio||=new (window.AudioContext||window.webkitAudioContext)();return audio.resume().catch(()=>{});}catch{return Promise.resolve();}}
const soundCache=new Map(),activeSounds=new Set();let sequenceEpoch=0;
function stopAudio(){sequenceEpoch++;for(const source of activeSounds){try{source.stop();}catch{}}activeSounds.clear();}
async function playSequence(notes){stopAudio();const epoch=sequenceEpoch;await unlockAudio();if(epoch!==sequenceEpoch||!state.sound||!audio||audio.state!=='running')return;const start=audio.currentTime+.025;notes.forEach((midi,i)=>createNote(midi,start+i*.65,.6));}
function setSound(enabled){state.sound=enabled;if(!enabled)stopAudio();else unlockAudio();save();}
async function playNote(midi){
 if(!state.sound)return;const epoch=sequenceEpoch;await unlockAudio();if(epoch!==sequenceEpoch||!state.sound||!audio||audio.state!=='running')return;createNote(midi,audio.currentTime);
}
function createNote(midi,when,duration){
 const hz=frequency(midi);if(hz>audio.sampleRate/4)return;
 const key=`${midi}:${audio.sampleRate}`;
 if(!soundCache.has(key)){
   const samples=pluckedString(hz,audio.sampleRate),buffer=audio.createBuffer(1,samples.length,audio.sampleRate);
   buffer.copyToChannel(samples,0);soundCache.set(key,buffer);
   if(soundCache.size>64)soundCache.delete(soundCache.keys().next().value);
 }
 const source=audio.createBufferSource(),gain=audio.createGain(),filter=audio.createBiquadFilter();
 source.buffer=soundCache.get(key);filter.type='lowpass';filter.frequency.value=Math.min(6500,hz*18);filter.Q.value=.5;gain.gain.value=.32;
 source.connect(filter);filter.connect(gain);gain.connect(audio.destination);source.start(when);if(duration){gain.gain.setValueAtTime(.32,when);gain.gain.setValueAtTime(.32,when+duration-.04);gain.gain.linearRampToValueAtTime(0,when+duration);source.stop(when+duration+.01);}
 activeSounds.add(source);source.onended=()=>{activeSounds.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};
}
function layoutNeck(){
 const viewport=document.querySelector('#neck-viewport'),inner=document.querySelector('#neck-inner');if(!viewport||!inner)return;
 const long=viewport.clientWidth,cross=viewport.clientHeight;
 const g=neckGeometry(state.profile.tuning.length,game.lesson.frets.at(-1),state.profile.instrumentId.startsWith('bass')?864:648);
 const scale=Math.min(cross/g.height,Math.max(long/g.width,1.45)),length=g.width*scale,height=g.height*scale,yOffset=(cross-height)/2,offset=Math.max(0,(long-length)/2),limit=Math.max(0,length-long);
 pan=Math.max(0,Math.min(limit,pan));
 inner.style.width=`${length}px`;inner.style.height=`${height}px`;
 const position=()=>inner.style.transform=`translate(${offset-pan}px,${yOffset}px)`;
 position();let down=null,dragged=false,frame=null;
 viewport.onpointerdown=e=>{if(e.button&&e.button!==0||paused||countdown)return;down={x:e.clientX,y:e.clientY,pan};dragged=false;};
 viewport.onpointermove=e=>{if(!down||paused)return;const delta=down.x-e.clientX;if(Math.abs(delta)>8&&!dragged){dragged=true;responseClock.stop('gesture');viewport.setPointerCapture(e.pointerId);}if(dragged){pan=Math.max(0,Math.min(limit,down.pan+delta));if(!frame)frame=requestAnimationFrame(()=>{position();frame=null;});}};
 viewport.onclick=e=>{if(dragged){e.preventDefault();e.stopPropagation();}};
 const end=()=>{responseClock.resume('gesture');down=null;};
 viewport.onpointerup=e=>{if(down&&!dragged){const cell=e.target.closest('[data-string]');if(cell)answer({string:Number(cell.dataset.string),fret:Number(cell.dataset.fret)});}end();};
 viewport.onpointercancel=end;
 if(q&&!feedback&&q.mode==='name'){const x=g.centers[q.target.fret]*scale;if(x-pan<24||x-pan>long-24){pan=Math.max(0,Math.min(limit,x-long/2));position();}}
 viewport.dataset.limit=String(limit);
 viewport.querySelector('.swipe-hint').hidden=limit===0;
 document.querySelectorAll('[data-action="pan-neck"]').forEach(b=>{b.disabled=limit===0;});
}
function render(){document.documentElement.dataset.theme=state.theme;if(screen==='pilot'){ROOT.innerHTML=pilot.render();requestAnimationFrame(()=>pilot.layout());return;}ROOT.innerHTML=!state.profile?setup():screen==='game'?gameScreen():screen==='brief'?briefScreen():screen==='result'?resultScreen():screen==='stats'?stats():screen==='settings'?settings():screen==='legacy'?legacyHome():screen==='legacy-stats'?legacyStats():home();if(screen==='game')requestAnimationFrame(layoutNeck);}
function rules(){const d=document.createElement('dialog');d.className='rules-dialog';d.innerHTML=`<button class="icon-button dialog-close" aria-label="Fermer">${icon('close')}</button><span class="eyebrow">APPRENDRE, PUIS AUTOMATISER</span><h2>Vos étoiles ont un sens.</h2><p>Les premières réponses comptent. Une erreur reste une erreur même après la correction.</p><ul><li><strong>3 étoiles</strong> : au moins 90 % de réponses correctes. Vous pouvez avancer.</li><li><strong>4 étoiles</strong> : au moins 95 %, avec un temps médian de 2,5 secondes ou moins.</li><li><strong>5 étoiles</strong> : aucune erreur, avec un temps médian de 1 seconde ou moins.</li></ul><p>Les seuils de vitesse sont des objectifs de jeu, pas une garantie de maîtrise sur une vraie guitare. Les pauses ne sont pas comptées.</p><p>Chaque corde commence par deux notes. Les suivantes arrivent progressivement, puis vous mélangez les cordes déjà étudiées.</p>`;document.body.append(d);d.querySelector('button').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());d.showModal();}
ROOT.addEventListener('click',e=>{
 const button=e.target.closest('[data-action]');if(!button)return;e.preventDefault();
 switch(button.dataset.action){
 case 'legacy':setScreen('legacy');break;
 case 'legacy-stats':setScreen('legacy-stats');break;
 case 'home':case 'stats':case 'settings':setScreen(button.dataset.action);break;
 case 'rules':rules();break;
 case 'start':startLesson(button.dataset.lesson);break;
 case 'begin':if(game.answers.length>=game.lesson.count)finish();else startCountdown();break;
 case 'review-course':cancelCountdown();responseClock.stop('brief');screen='brief';render();break;
 case 'listen-target':if(screen==='game'&&!paused&&!countdown&&q?.mode==='name')playNote(q.target.midi);break;
 case 'preview-note':playNote(Number(button.dataset.midi));break;
 case 'resume':if(state.session?.key===state.profile.key)startLesson(state.session.lesson,true);else{state.session=null;save();render();}break;
 case 'toggle-sound':setSound(!state.sound);render();document.querySelector('[data-action="toggle-sound"]')?.focus({preventScroll:true});break;
 case 'toggle-case-buttons':fretAlternative=!fretAlternative;render();break;
 case 'answer-note':answer(Number(button.dataset.note));break;
 case 'answer-fret':answer({string:q.target.string,fret:Number(button.dataset.fret)});break;
 case 'pan-neck':pan+=Number(button.dataset.direction)*180;layoutNeck();break;
 case 'next':advance();break;
 case 'pause':case 'exit-game':pauseGame();break;
 case 'unpause':paused=false;render();requestAnimationFrame(()=>responseClock.resume('pause'));if(countdown){countdownClock.resume('pause');countdownTimer=setTimeout(()=>tickCountdown(countdownEpoch),100);}break;
 case 'leave-paused':setScreen('home');break;
 case 'edit-profile':if(!state.stats.some(s=>s.key===state.profile.key)&&!pilot.data.attempts.length){pilot.leave();state.profile=null;state.session=null;save();render();}break;
 case 'choose-import':document.querySelector('#import-file').click();break;
 case 'export':{const data={...state,session:null,pilotBackup:pilot.exportData()};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`adh-reborn-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
 case 'install':if(installPrompt){installPrompt.prompt();installPrompt.userChoice.then(()=>{installPrompt=null;render();});}break;
 }
});
ROOT.addEventListener('submit',e=>{
 if(e.target.id!=='setup-form')return;e.preventDefault();const data=new FormData(e.target);
 try{state.profile=makeProfile(data.get('instrument'),data.get('tuning'));state.notation=data.get('notation');state.session=null;save();setScreen('home');}catch(error){document.querySelector('#form-error').textContent=error.message;}
});
ROOT.addEventListener('change',async e=>{
 if(e.target.id==='instrument'){const value=INSTRUMENTS.find(i=>i.id===e.target.value).tuning;document.querySelector('#tuning').value=value;document.querySelector('#tuning-preview').textContent=value;}
 if(e.target.id==='setting-notation'){state.notation=e.target.value;save();render();}
 if(e.target.id==='setting-sound'){setSound(e.target.checked);}
 if(e.target.id==='setting-theme'){state.theme=e.target.value;save();render();}
 if(e.target.id==='import-file'){
 const file=e.target.files[0];if(!file)return;
 try{if(file.size>5_000_000)throw new Error('Le fichier est trop volumineux.');const raw=JSON.parse(await file.text()),imported=validateState(raw);if(raw.pilotBackup)validatePilotStore(raw.pilotBackup);if(!confirm('Remplacer les progrès de cet appareil par cette sauvegarde ?'))return;pilot.leave();state=imported;delete state.pilotBackup;if(raw.pilotBackup)pilot.importData(raw.pilotBackup);save();setScreen('home');toast('Vos progrès sont restaurés.');}catch(error){toast(error.message||'Impossible de lire la sauvegarde.');}
 }
});
ROOT.addEventListener('input',e=>{if(e.target.id==='tuning')document.querySelector('#tuning-preview').textContent=e.target.value;});
ROOT.addEventListener('keydown',e=>{if(screen!=='game')return;if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-string], [data-action="listen-target"]')){e.preventDefault();if(e.target.dataset.action==='listen-target'){if(!paused&&!countdown)playNote(q.target.midi);}else answer({string:Number(e.target.dataset.string),fret:Number(e.target.dataset.fret)});}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&screen==='game')pauseGame();if(document.hidden&&screen==='pilot')pilot.pause();});
let layoutTimer;
window.addEventListener('resize',()=>{if(screen==='pilot'){pilot.clock.stop('layout');clearTimeout(layoutTimer);layoutTimer=setTimeout(()=>{pilot.layout();pilot.clock.resume('layout');},180);return;}if(screen!=='game')return;responseClock.stop('layout');clearTimeout(layoutTimer);layoutTimer=setTimeout(()=>{layoutNeck();responseClock.resume('layout');},180);});
window.addEventListener('pagehide',()=>{if(screen==='pilot')pilot.pause();});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;if(screen==='settings')render();});
window.addEventListener('online',()=>{const el=document.querySelector('#offline-status');if(el)el.textContent='Prêt à jouer';});
window.addEventListener('offline',()=>{const el=document.querySelector('#offline-status');if(el)el.textContent='Vous êtes hors ligne';});
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{const el=document.querySelector('#pwa-state');if(el)el.textContent='Les fichiers du jeu sont disponibles hors ligne.';}).catch(()=>{const el=document.querySelector('#pwa-state');if(el)el.textContent='Le mode hors ligne n’est pas disponible. Utilisez HTTPS ou localhost.';});}
const pilot=new PilotController({getState:()=>state,showPilot:()=>{clearTimeout(autoTimer);cancelCountdown();screen='pilot';render();},home:()=>setScreen('home'),icon,playNote,playSequence,stopAudio,unlockAudio,setSound});
pilot.bind(ROOT);
render();
