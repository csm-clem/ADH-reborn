import {introductionFor,helpGraphic} from './learning-help.js';
import {noteName,pitchLabel,neckGeometry,fitNeck,score} from './core.js';
import {pilotPlan,NATURAL_PITCHES,positionKey,questionsFor,pilotCorrect,firstSummary,initialPilotStore,validatePilotStore,naturalDiagnostic,practiceActivities,activityResult,admissiblePositions} from './pilot.js';
import {ActiveClock} from './clock.js';
import {PILOT_KEY as KEY} from './release.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const equal=(a,b)=>a&&b&&a.string===b.string&&a.fret===b.fret;
const spot=(p,profile)=>`corde ${profile.tuning.length-p.string}, ${p.fret?'case '+p.fret:'à vide'}`;
export class PilotController{
 constructor(host){
  this.host=host;this.store=initialPilotStore();this.session=null;this.feedback=null;this.aids=[];this.paused=false;this.count=0;this.countEpoch=0;this.clock=new ActiveClock();this.countClock=new ActiveClock();this.storageError=false;
  try{const raw=localStorage.getItem(KEY);if(raw)this.store=validatePilotStore(JSON.parse(raw));}catch{this.storageError=true;try{this.unreadableRaw=localStorage.getItem(KEY);}catch{}}
 }
 get profile(){return this.host.getState().profile;}
 get notation(){return this.host.getState().notation;}
 get plan(){const key=`${this.profile.key}:${this.notation}`;if(this.cachedPlanKey!==key){this.cachedPlan=pilotPlan(this.profile,{notation:this.notation});this.cachedPlanKey=key;}return this.cachedPlan;}
 get data(){const p=this.profile;return this.store.profiles[p.key]||={profile:p,attempts:[],later:[],session:null,diagnostic:null};}
 get activities(){return practiceActivities(this.plan);}
 get module(){return this.resolve(this.session?.activity);}
 get familyPitches(){return this.session?.familyOrder||NATURAL_PITCHES.filter(pc=>this.plan.natural.some(p=>p.midi%12===pc));}
 get question(){return this.session?.queue[this.session.index];}
 get stringOrder(){return this.profile.tuning.map((_,i)=>i).reverse();}
 get geometry(){const last=['practice','motif'].includes(this.session?.stage)?4:Math.max(0,...this.module.pool.map(p=>p.fret));return neckGeometry(this.profile.tuning.length,last);}
 get introduction(){if(!this.session||this.feedback||this.session.stage==='result')return null;return introductionFor(this.module,this.session.stage,this.question,this.data.seenInstructions||[],this.session.activity);}
 get muted(){return !this.host.getState().sound;}
 name(p){return noteName(p.midi,this.notation);}
 save(){
  if(this.session){this.session.feedback=this.feedback;this.session.currentAids=this.aids;this.session.activeMs=this.session.stage==='practice'&&!this.feedback?this.clock.elapsed():0;this.data.session=this.session.completed?null:this.session;}
  if(this.unreadableRaw){this.storageError=true;return;}
  try{localStorage.setItem(KEY,JSON.stringify(this.store));this.storageError=false;}catch{this.storageError=true;}
 }

 exportData(){if(this.session)this.save();return this.store;}
 importData(value){const valid=validatePilotStore(value);this.leave();this.store=valid;this.unreadableRaw=null;this.storageError=false;this.save();}
 emit(){this.host.showPilot();}
 bind(root){
  root.addEventListener('click',e=>{const b=e.target.closest('[data-pilot-action]');if(!b)return;e.preventDefault();e.stopPropagation();this.action(b.dataset.pilotAction,b);});
  root.addEventListener('toggle',e=>{if(e.target.matches('.pilot-position-buttons details'))this.coordinatesOpen=e.target.open;},true);
  root.addEventListener('keydown',e=>{if(!['Enter',' '].includes(e.key))return;const cell=e.target.closest('[data-pilot-string]');if(!cell)return;e.preventDefault();this.neckTap(Number(cell.dataset.pilotString),Number(cell.dataset.pilotFret));});

 }
 home(){
  const plan=this.plan,data=this.data;const completed=new Set(data.attempts.filter(a=>a.passed===true).map(a=>a.activity)),next=this.activities.find(m=>!completed.has(m.id))||this.activities[0];
  const resume=data.session&&this.resolve(data.session.activity);
  return `<div class="page-heading"><div><p class="eyebrow">PILOTE · VOTRE ACCORDAGE</p><h1>Des notes.<br><em>Des liens musicaux.</em></h1><p>Les cordes à vide, les intervalles, puis le passage vers l’aigu. Cases 0 à 4.</p></div></div>${this.storageError?'<p class="notice" role="alert">La sauvegarde du pilote est indisponible ou non lisible. Elle ne sera pas remplacée ; exportez vos résultats avant de fermer.</p>':''}<section class="zone-hero pilot-hero"><div><span class="tag light">EXPÉRIENCE PILOTE</span><h2>${esc(this.profile.label)}</h2><p>${this.profile.tuning.map(n=>esc(pitchLabel(n,this.notation))).join(' · ')}<br>Point d’appui : ${esc(pitchLabel(plan.root.midi,this.notation))}.</p><button class="button primary" data-pilot-action="${resume?'resume':'start'}" data-module="${esc(next?.id||'opens')}">${resume?'Reprendre le pilote':completed.size?'Continuer la découverte':'Découvrir mes cordes'}</button></div><div class="pilot-intro"><p>Sur téléphone, vous entraînez la carte du manche. Vous pouvez aussi reprendre librement les motifs sur votre guitare.</p><p>Aucune partition ni connaissance des accords n’est nécessaire. Choisissez, écoutez, puis poursuivez la partie.</p></div></section>${plan.altered.length?`<p class="notice">Cet accordage contient ${[...new Set(plan.altered.map(p=>this.name(p)))].map(esc).join(', ')} à vide. Un bref préambule nomme ces départs réels ; la roue naturelle gardera ensuite sept notes.</p>`:''}${plan.unavailable?.length?`<p class="notice">Certains liens ne sont pas réalisables dans cette zone : ${plan.unavailable.map(x=>esc(x.interval.toLowerCase()+' vers '+x.note)).join(', ')}. Le pilote couvre les repères disponibles ; aucune case supplémentaire n’est ajoutée en silence.</p>`:''}${!plan.compatible?`<p class="notice">${esc(plan.reason)} Vous pouvez découvrir les cordes à vide.</p>`:''}<div class="section-heading"><div><h2>Votre parcours pilote</h2><p>Le nombre de découvertes suit votre instrument. Toutes les activités sont accessibles. Suivez le parcours conseillé ou choisissez librement ; la vitesse reste un défi facultatif.</p></div></div><div class="lesson-list">${this.activities.map((m,i)=>{
   const ready=true,done=completed.has(m.id);
   return `<button class="lesson-row ${m.id===next.id&&!done?'next':''}" data-pilot-action="start" data-module="${m.id}" ${!ready||!m.pool.length?'disabled':''}><span class="lesson-symbol ${done?'complete':''}">${done?'✓':ready?'›':'·'}</span><span class="lesson-copy"><strong>${esc(m.title)}</strong><small>${m.kind==='recall'?'Bilan sans aide':m.kind==='phrase'?'Application musicale':m.kind==='transfer'?'Une équivalence, plusieurs cordes':m.kind==='tuning'?'Noms réels de l’accordage':'Découvrir · retrouver · jouer'}</small></span><span class="pilot-status">${done?'Travaillé':ready?'À explorer':'À venir dans ce pilote'}</span></button>`;
  }).join('')}</div><section class="panel pilot-limits"><h2>Ce que ce pilote vérifie</h2><p>Les deux sens de réponse, les intervalles graves, les transferts entre cordes équivalentes et une phrase courte. Le reste de la carte naturelle et les familles complètes seront produits après les retours du pilote.</p><p>Une activité est validée à 90 % de premières réponses correctes. La consolidation différée et sa planification ne sont pas encore automatisées.</p>${['name','find'].filter(mode=>data.later.some(q=>q.mode===mode)).map(mode=>`<button class="button secondary" data-pilot-action="start" data-module="${mode==='name'?'review':'review-find'}">${mode==='name'?'Revoir les noms':'Revoir les positions'}</button>`).join('')}</section><section class="panel"><h2>Pour les élèves déjà à l’aise</h2><p>Choisissez un bilan court : nommer les notes ou les retrouver.</p><button class="button secondary" data-pilot-action="start" data-module="natural-diagnostic">Bilan : nommer</button><button class="button secondary" data-pilot-action="start" data-module="natural-diagnostic-find">Bilan : retrouver</button></section>`;
 }
 stats(){
 const events=this.data.attempts.flatMap(a=>a.events),summary=firstSummary(events),natural=this.plan.natural;
 return `<div class="page-heading"><div><p class="eyebrow">PILOTE · PROGRÈS OBSERVÉS</p><h1>Nommer.<br><em>Retrouver.</em></h1><p>Les deux sens restent distincts. Les reprises et les aides sont identifiées.</p></div></div><div class="pilot-results">${[['name','Nommer une position'],['find','Retrouver une position']].map(([mode,label])=>`<div><strong>${label}</strong><span>${summary[mode].correct} / ${summary[mode].total}</span><small>${summary[mode].unaided} correctes sans aide demandée ; premières réponses uniquement.</small></div>`).join('')}</div><section class="panel"><h2>Votre carte naturelle</h2><p>Une position travaillée n’est pas encore une position consolidée après délai. Les cases altérées restent hors du parcours naturel.</p><div class="heatmap"><table class="pilot-grid"><thead><tr><th>Corde</th>${[0,1,2,3,4].map(f=>`<th>${f?'Case '+f:'À vide'}</th>`).join('')}</tr></thead><tbody>${this.stringOrder.map(string=>`<tr><th>${this.profile.tuning.length-string}</th>${[0,1,2,3,4].map(fret=>{const p=natural.find(p=>p.string===string&&p.fret===fret),list=events.filter(e=>!e.retry&&equal(e.target,{string,fret}));return `<td>${p?esc(this.name(p)):'—'}${p?`<small>${list.length?list.at(-1).correct?'Travaillé':'À revoir':'À découvrir'}</small><small>Nommer : ${list.filter(e=>e.mode==='name'&&e.correct).length}/${list.filter(e=>e.mode==='name').length}</small><small>Retrouver : ${list.filter(e=>e.mode==='find'&&e.correct).length}/${list.filter(e=>e.mode==='find').length}</small>`:''}</td>`;}).join('')}</tr>`).join('')}</tbody></table></div></section>`;
 }
 resolve(id){return this.activities.find(m=>m.id===id)||(id?.startsWith('natural-diagnostic')?naturalDiagnostic(this.profile,id.endsWith('-find')?'find':'name'):id?.startsWith('review')?this.reviewModule(id.endsWith('-find')?'find':'name'):null);}
 reviewModule(mode='name'){const pool=this.session?.activity?.startsWith('review')&&this.session.reviewPool?this.session.reviewPool:[...new Map(this.data.later.filter(q=>q.mode===mode).map(q=>[positionKey(q.target),q.target])).values()];return {id:mode==='name'?'review':'review-find',baseId:'review',mode,kind:'recall',title:mode==='name'?'Revoir les noms':'Revoir les positions',pool,focus:pool,description:''};}
 start(id,resume=false){
  const module=this.resolve(id);if(!module||!module.pool.length)return;
  this.leave();
  if(resume&&this.data.session?.activity===id)this.session=this.data.session;
  else this.session={id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,activity:id,index:0,queue:questionsFor(module,{diagnostic:id.startsWith('natural-diagnostic')}),events:[],stage:module.kind==='recall'||this.data.discoveredModules?.includes(module.baseId)?'practice':'discovery',discoveryDone:false,discoveryTried:false,motifIndex:0,motifErrors:0,flowVersion:2,startedAt:Date.now(),completed:false};
  if(id.startsWith('review')&&!resume)this.session.reviewPool=module.pool;
  this.feedback=resume?this.session.feedback||null:null;this.aids=resume?this.session.currentAids||[]:[];this.resumeMs=resume?this.session.activeMs||0:0;this.resumeAids=resume?[...this.aids]:null;this.paused=false;this.count=0;this.coordinatesOpen=false;this.save();
  if(this.introduction){this.clock.reset();this.clock.stop('instruction');this.resumeMs=0;this.save();this.emit();}else if(['practice','motif'].includes(this.session.stage)&&!this.feedback)this.startCount();else {this.emit();if(this.feedback)this.scheduleAdvance();}window.scrollTo(0,0);document.querySelector('#main-content')?.focus({preventScroll:true});
 }
 cancelAdvance(){clearTimeout(this.advanceTimer);this.advanceTimer=null;this.advanceDue=0;}
 scheduleAdvance(delay=this.feedback?.correct?500:1000){this.cancelAdvance();if(!this.feedback||this.paused||!['practice','motif'].includes(this.session?.stage))return;this.advanceDue=performance.now()+delay;this.advanceTimer=setTimeout(()=>{this.advanceTimer=null;if(!this.paused&&this.feedback)this.prepareNext();},delay);}
 leave(){this.cancelAdvance();this.cancelCount();this.clock.stop('leave');this.host.stopAudio();if(this.session){this.save();this.session=null;}this.paused=false;this.feedback=null;}
 cancelCount(){clearTimeout(this.timer);this.countEpoch++;this.count=0;}
 startCount(){if(this.introduction){this.clock.reset();this.clock.stop('instruction');this.resumeMs=0;this.save();this.emit();return;}this.cancelCount();this.host.unlockAudio();this.count=1;this.countClock.reset();this.clock.reset();this.clock.total=this.resumeMs||0;this.clock.stop('countdown');const epoch=this.countEpoch;this.emit();this.timer=setTimeout(()=>this.tick(epoch),80);}
 tick(epoch){if(epoch!==this.countEpoch||this.paused||!this.session)return;const elapsed=this.countClock.elapsed();if(elapsed<1500){const progress=document.querySelector('.startup-ring .ring-progress');progress?.style.setProperty('stroke-dashoffset',String(100-Math.min(100,elapsed/15)));this.timer=setTimeout(()=>this.tick(epoch),30);return;}this.count=0;this.showQuestion();}
 showQuestion(){
  if(this.introduction){this.clock.reset();this.clock.stop('instruction');this.resumeMs=0;this.save();this.emit();return;}
  this.coordinatesOpen=false;this.feedback=null;this.aids=this.resumeAids||[];this.resumeAids=null;this.paused=false;this.host.stopAudio();
  this.clock.reset();this.clock.total=this.resumeMs||0;this.resumeMs=0;this.save();this.emit();
  if(this.session.stage==='practice'){const selector=this.question.mode==='name'?('.pilot-wheel button'):`#pilot-neck [data-pilot-string="${this.question.scope==='string'?this.question.target.string:0}"]`;if(this.question.mode==='name')document.querySelector(selector)?.focus({preventScroll:true});else document.querySelector('#main-content')?.focus({preventScroll:true});}
 }

 pause(){if(!this.session||this.paused)return;if(this.introduction){this.host.stopAudio();this.save();return;}if(this.session.stage==='result'){this.host.stopAudio();this.save();return;}this.advanceRemaining=this.advanceDue?Math.max(0,this.advanceDue-performance.now()):500;this.cancelAdvance();this.paused=true;this.clock.stop('pause');this.countClock.stop('pause');clearTimeout(this.timer);this.host.stopAudio();this.save();this.emit();}
 resumePause(){this.paused=false;this.clock.resume('pause');if(this.count){this.countClock.resume('pause');const epoch=this.countEpoch;this.timer=setTimeout(()=>this.tick(epoch),80);}this.emit();if(this.feedback)this.scheduleAdvance(this.advanceRemaining??(this.feedback.correct?500:1000));}
 prepareNext(){
  this.cancelAdvance();if(this.session.stage==='motif'){this.session.motifIndex++;this.feedback=null;this.save();this.emit();return;}this.session.index++;this.feedback=null;this.aids=[];this.session.nameDraft='';this.inputError=null;
  if(this.session.index>=this.session.queue.length){if(this.module.mode==='name'||this.module.kind==='recall'){this.finish();return;}this.session.stage='motif';this.session.motifIndex=0;this.session.motifErrors=0;this.save();this.emit();}
  else this.showQuestion();
 }
 answer(value){
  if(!this.session||this.session.stage!=='practice'||this.count||this.paused||this.feedback)return;
  const q=this.question,correct=pilotCorrect(this.profile,q,value),actual=correct&&q.mode==='find'?{string:value.string,fret:value.fret,midi:this.profile.tuning[value.string]+value.fret}:q.target,event={questionId:q.id,target:{...actual},mode:q.mode,scope:q.scope,competence:q.mode==='name'?'C03':'C04',format:q.mode==='name'?'choice':'position',aids:[...this.aids],firstAnswer:value,correct,ms:this.clock.elapsed(),at:Date.now(),retry:!!q.retry,evaluation:!!q.evaluation,slipReported:false,automaticAids:[],aidLevel:'A0',timingInterpretable:true};
  this.clock.stop('feedback');this.session.events.push(event);
  const wrongPosition=correct?null:q.mode==='find'?{...value,midi:this.profile.tuning[value.string]+value.fret}:this.plan.all.filter(p=>p.midi%12===value).sort((a,b)=>Math.abs(a.midi-q.target.midi)-Math.abs(b.midi-q.target.midi))[0];
  this.feedback={correct,value,position:correct?actual:wrongPosition,text:''};
  if(!correct){this.data.later=this.data.later.filter(e=>!(equal(e.target,q.target)&&e.mode===q.mode));this.data.later.push({...q,retry:false});this.data.later=this.data.later.slice(-200);}
  else if(!this.aids.length&&this.session.activity.startsWith('review'))this.data.later=this.data.later.filter(e=>!(equal(e.target,q.target)&&e.mode===q.mode));
  this.save();if(correct)this.host.playNote(actual.midi);else this.host.stopAudio();this.emit();this.scheduleAdvance();
 }
 motif(){const m=this.module,p=m.pool,root=this.plan.root;
  if(m.kind==='interval')return [m.anchor,m.target,m.anchor,m.target,m.anchor];
  if(m.kind==='phrase'){const t=this.plan.modules.find(x=>x.id==='degree-3')?.target,f=this.plan.modules.find(x=>x.id==='degree-5')?.target,q=this.plan.modules.find(x=>x.id==='degree-4')?.target;return [root,t||p[1],f||p[2],q||p[1],root];}
  if(m.kind==='transfer'){const frets=m.transferPairs.slice(0,3).map(group=>group[0].fret),strings=[...m.equivalentStrings].sort((a,b)=>this.profile.tuning[a]-this.profile.tuning[b]||a-b);return [strings[0],strings.at(-1)].flatMap(string=>frets.map(fret=>p.find(x=>x.string===string&&x.fret===fret)));}
  const sorted=[...p].sort((a,b)=>a.midi-b.midi);return [sorted[0],sorted.at(-1),sorted[Math.floor(sorted.length/2)],sorted[0]];
 }
 greenPositions(){
  if(!this.feedback)return [];
  if(this.session.stage==='practice')return this.question.mode==='name'?this.module.pool.filter(p=>p.midi===this.question.target.midi):admissiblePositions(this.profile,this.question);
  if(this.session.stage==='discovery')return ['opens','tuning'].includes(this.module.kind)?this.feedback.correct?this.module.pool.filter(p=>p.midi===this.feedback.position?.midi):[]:[this.module.focus[0]||this.module.pool[0]];
  if(this.session.stage==='motif')return this.feedback.correct?[this.feedback.position].filter(Boolean):[this.feedback.target].filter(Boolean);
  return [];
 }
 neckTap(string,fret){
  if(!this.session||this.paused||this.count||this.introduction)return;const p={string,fret,midi:this.profile.tuning[string]+fret};
  if(this.session.stage==='discovery'){
   this.session.discoveryTried=true;
   if(['opens','tuning'].includes(this.module.kind)){
    const explored=this.session.explored||[];
    if(this.module.pool.some(x=>equal(x,p))){if(!explored.includes(positionKey(p)))explored.push(positionKey(p));this.session.explored=explored;this.session.discoveryDone=this.module.pool.every(x=>explored.includes(positionKey(x)));this.feedback={correct:true,position:p,text:`${pitchLabel(p.midi,this.notation)}, ${spot(p,this.profile)}. ${explored.length} / ${this.module.pool.length} départs explorés.`};}
    else this.feedback={correct:false,position:p,text:'Pour cette découverte, touchez une corde à vide : la case 0, avant le sillet.'};
   }else if(equal(p,this.module.focus[0]||this.module.pool[0])){this.session.discoveryDone=true;this.feedback={correct:true,position:p,text:'Repère trouvé. Écoutez-le, puis essayez sans les noms.'};}
   else this.feedback={correct:false,position:p,text:`Ici c’est ${this.name(p)}. La consigne vise ${spot(this.module.focus[0]||this.module.pool[0],this.profile)}.`};
   if(this.feedback?.correct)this.host.playNote(p.midi);else this.host.stopAudio();this.save();this.emit();return;
  }
  if(this.session.stage==='practice'){
   if(this.feedback)return;
   if(this.question.mode==='find')this.answer({string,fret});
   return;
  }
  if(this.session.stage==='motif'){
   if(this.session.activity==='natural-diagnostic'){this.familyTap(p);return;}
   const motif=this.motif(),target=motif[this.session.motifIndex];if(!target)return;
   if(this.feedback)return;if(this.module.kind==='transfer'?equal(p,target):p.midi===target.midi){this.feedback={correct:true,position:p,text:''};}else{this.session.motifErrors++;this.feedback={correct:false,position:p,target,text:''};}
   if(this.feedback?.correct)this.host.playNote(p.midi);else this.host.stopAudio();this.save();this.emit();this.scheduleAdvance();
  }
 }
 addAid(aid){if(!this.aids.includes(aid))this.aids.push(aid);this.save();}
 familyTap(p){const pcs=this.familyPitches,index=this.session.familyIndex||0,pc=pcs[index],targets=this.plan.natural.filter(p=>p.midi%12===pc),selected=this.session.familySelected||[];
  if(p.midi%12!==pc){this.session.familyErrors++;this.feedback={correct:false,position:p,text:`Ici c’est ${this.name(p)}. Cherchez uniquement les ${noteName(pc,this.notation)}.`};}else{if(!selected.includes(positionKey(p)))selected.push(positionKey(p));this.session.familySelected=selected;this.feedback={correct:true,text:`${selected.length} / ${targets.length} repères trouvés.`};}
  this.session.familyComplete=targets.every(p=>selected.includes(positionKey(p)));this.save();this.emit();
 }
 finish(){
  if(this.session.completed)return;this.session.completed=true;const s=this.session;
  const validation=activityResult(s.events,s.queue.filter(q=>!q.retry).length);
  const entry={passed:validation.passed,id:s.id,activity:s.activity,at:Date.now(),events:s.events,finished:true,motifErrors:s.motifErrors||0,familyErrors:s.familyErrors??null};
  if(!this.data.attempts.some(a=>a.id===entry.id))this.data.attempts.push(entry);this.data.attempts=this.data.attempts.slice(-1000);
  if(s.activity.startsWith('natural-diagnostic'))this.data.diagnostic={passed:validation.passed,mode:this.module.mode,at:Date.now(),attempt:s.id};
  s.stage='result';this.data.session=null;this.save();this.emit();window.scrollTo(0,0);document.querySelector('#main-content')?.focus({preventScroll:true});
 }
 action(action,button){
  if(this.paused&&!['resume-pause','home','mute','fullscreen','exit'].includes(action))return;
  if(this.introduction&&!['help-next','help-listen','home','exit','mute','fullscreen'].includes(action))return;
  switch(action){
   case 'help-next':{const help=this.introduction;if(!help)return;this.data.seenInstructions=[...new Set([...(this.data.seenInstructions||[]),help.key])];this.host.stopAudio();this.save();if(this.introduction||this.session.stage==='discovery'){this.emit();}else if(this.session.stage==='practice'){this.startCount();}else this.showQuestion();return;}
   case 'help-listen':{const help=this.introduction,notes=this.module.kind==='interval'?[this.module.anchor.midi,this.module.target.midi]:help?.kind==='transfer'?this.module.transferPairs[0].map(p=>p.midi):help?.kind==='motif'?this.module.pool.slice(0,3).map(p=>p.midi):[this.module.pool[0].midi];this.host.playSequence(notes);return;}
   case 'exit':if(this.introduction){this.leave();this.host.home();return;}if(this.paused){this.leave();this.host.home();}else this.pause();return;
   case 'fullscreen':this.host.toggleFullscreen();return;
   case 'start':this.start(button.dataset.module);return;
   case 'resume':if(this.data.session)this.start(this.data.session.activity,true);return;
   case 'stats':this.leave();this.host.stats();return;
   case 'home':this.leave();this.host.home();return;
   case 'pause':this.pause();return;
   case 'resume-pause':this.resumePause();return;
   case 'mute':this.host.setSound(!this.host.getState().sound);this.emit();document.querySelector('[data-pilot-action="mute"]')?.focus({preventScroll:true});return;
   case 'discovery-reveal':this.session.revealed=!this.session.revealed;this.host.stopAudio();this.save();this.emit();return;
   case 'practice':if(!this.session.discoveryDone)return;this.data.discoveredModules=[...new Set([...(this.data.discoveredModules||[]),this.module.baseId])];this.feedback=null;this.session.stage='practice';this.save();this.startCount();return;
   case 'note':this.answer(Number(button.dataset.note));return;
   case 'position':this.neckTap(Number(button.dataset.string),Number(button.dataset.fret));return;
   case 'replay':if(this.session.stage==='practice')return;this.host.playSequence(this.session.stage==='motif'&&this.session.activity!=='natural-diagnostic'?this.motif().map(p=>p.midi):this.module.kind==='interval'?[this.module.anchor.midi,this.module.target.midi]:this.module.kind==='transfer'?this.motif().map(p=>p.midi):this.module.pool.map(p=>p.midi));return;
   case 'motif-again':this.cancelAdvance();this.session.motifIndex=0;this.feedback=null;this.save();this.emit();return;
   case 'complete':if(this.session.motifIndex>=this.motif().length)this.finish();return;
   case 'family-next':if(!this.session.familyComplete)return;if(this.session.familyIndex===this.familyPitches.length-1){this.finish();return;}this.session.familyIndex++;this.session.familySelected=[];this.session.familyComplete=false;this.feedback=null;this.save();this.emit();return;

  }
 }
 render(){
  if(!this.session||!this.module)return '<p>Cette activité n’est plus disponible. Retrouvez votre parcours.</p><button data-pilot-action="home" class="button primary">Mon parcours</button>';
  if(this.introduction)return this.renderIntroduction();
  const s=this.session,m=this.module;if(s.stage==='result')return this.result();

  const practice=s.stage==='practice',q=this.question,discovery=s.stage==='discovery',family=s.stage==='motif'&&s.activity==='natural-diagnostic';
  const target=discovery?(m.focus[0]||m.pool[0]):practice?q?.target:null;
  let title=discovery?(['opens','tuning'].includes(m.kind)?'Explorez vos cordes à vide':`Où se trouve ${pitchLabel(target.midi,this.notation)} ?`):family?`Retrouvez tous les ${noteName(this.familyPitches[s.familyIndex||0],this.notation)}`:s.stage==='motif'?'À vous de jouer la suite':q?.mode==='name'?'Quelle est cette note ?':`Trouvez ${pitchLabel(q.target.midi,this.notation)}.`;
  let hint=discovery&&['opens','tuning'].includes(m.kind)?'Touchez chaque départ une fois ; le nom accompagne le son.':discovery?`Sur la corde ${this.profile.tuning.length-target.string}.`:family?'Tous les emplacements de la zone ; les notes trouvées restent marquées.':s.stage==='motif'?(m.kind==='transfer'?`Rejouez les mêmes noms sur les cordes ${[...new Set(this.motif().map(p=>this.profile.tuning.length-p.string))].join(' puis ')}. Respectez la corde indiquée.`:'Touchez les notes dans l’ordre. Une autre position de même hauteur convient.'):q?.mode==='name'?spot(q.target,this.profile):q?.scope==='height'?'Trouvez une corde à vide de cette hauteur.':`Sur la corde ${this.profile.tuning.length-q.target.string}.`;
  if(this.count){title='Prêt à jouer ?';hint='La première question arrive…';}
  const reveal=discovery&&s.discoveryTried||practice&&this.aids.includes('labels');
  const body=discovery?`<p class="pilot-explanation">${['opens','tuning'].includes(m.kind)?'Touchez chaque départ, à gauche de la grosse barre.':m.kind==='interval'?`${pitchLabel(m.anchor.midi,this.notation)} puis ${pitchLabel(m.target.midi,this.notation)}. Trouvez la seconde note.`:m.kind==='transfer'?'Même case, même nom. Comparez les cordes.':'Trouvez le point demandé.'}</p>${s.discoveryTried?`<div class="pilot-discovery-legend">${m.pool.map(p=>`<span><strong>${esc(pitchLabel(p.midi,this.notation))}</strong> · ${esc(spot(p,this.profile))}</span>`).join('')}</div>`:''}<p class="pilot-task">${['opens','tuning'].includes(m.kind)?'Explorez chaque corde à vide pour continuer.':'Touchez le repère demandé, puis essayez sans les noms.'}</p><button class="text-button" data-pilot-action="discovery-reveal">${s.revealed?'Masquer la démonstration':'Voir la démonstration'}</button>${s.revealed?`<div class="discovery-demo">${helpGraphic({kind:'find',title:'Démonstration'}, {...m,pool:[m.focus[0]||m.pool[0]]},this.profile,this.notation)}<p>Exemple : ${esc(pitchLabel((m.focus[0]||m.pool[0]).midi,this.notation))}, ${esc(spot(m.focus[0]||m.pool[0],this.profile))}. Touchez ce départ sur le manche. La démonstration ne compte pas comme un essai.</p></div>`:''}<button class="button primary" data-pilot-action="practice" ${!s.discoveryDone?'disabled':''}>J’essaie sans les noms</button>`:
  practice?`<div class="pilot-response-stage">${q.mode==='name'?this.wheel():`<p class="touch-prompt">Touchez ${esc(pitchLabel(q.target.midi,this.notation))} sur le manche.</p>`}</div><div class="pilot-feedback-slot" aria-live="polite"><span class="visually-hidden">${this.feedback?(this.feedback.correct?'Réponse correcte':'Réponse incorrecte'):''}</span></div>`:
  family?`<p class="pilot-task">${s.familySelected?.length||0} repère${(s.familySelected?.length||0)>1?'s':''} trouvé${(s.familySelected?.length||0)>1?'s':''}.</p><button class="button primary" data-pilot-action="family-next" ${!s.familyComplete?'disabled':''}>${s.familyIndex===this.familyPitches.length-1?'Terminer le diagnostic':'Famille suivante'}</button>`:
  `<div class="pilot-motif">${this.motif().map((p,i)=>`<span class="${i<s.motifIndex?'done':i===s.motifIndex?'current':''}">${esc(this.name(p))}<small>Corde ${this.profile.tuning.length-p.string}</small></span>`).join('')}</div><p class="pilot-task">${s.motifIndex} / ${this.motif().length} notes jouées dans l’ordre.</p><button class="text-button" data-pilot-action="motif-again">Rejouer la suite</button><button class="button primary" data-pilot-action="complete" ${s.motifIndex<this.motif().length?'disabled':''}>Terminer la séquence</button>`;
  return `<main id="main-content" tabindex="-1" class="game pilot-game ${practice?'is-practice':''} ${this.paused?'is-paused':''}"><header class="game-header"><button class="icon-button" data-pilot-action="exit" aria-label="Quitter l’exercice">${this.host.icon('close')}</button><div><strong>${esc(m.title)}</strong><small>${discovery?'DÉCOUVERTE ACTIVE':practice?'PREMIÈRES RÉPONSES':family?'CORRESPONDANCES':'APPLICATION'} <span class="game-counter">${practice?(q.mode==='name'?'Nommer · ':'Retrouver · ')+(s.index+1)+' / '+s.queue.length:''}</span></small></div><button class="icon-button" data-pilot-action="fullscreen" aria-label="${document.fullscreenElement?'Quitter le plein écran':'Passer en plein écran'}" title="Plein écran">${this.host.icon('fullscreen')}</button><button class="icon-button" data-pilot-action="${this.paused?'resume-pause':'pause'}" aria-label="${this.paused?'Reprendre':'Mettre en pause'}">${this.host.icon('pause')}</button><button class="icon-button sound-toggle ${this.muted?'is-muted':''}" data-pilot-action="mute" aria-label="${this.muted?'Activer':'Couper'} le son" aria-pressed="${this.muted}">${this.host.icon(this.muted?'mute':'sound')}</button></header>${this.storageError?'<p class="notice" role="alert">Sauvegarde indisponible : résultats en mémoire seulement. Exportez-les avant de fermer.</p>':''}<div class="game-progress"><i style="transform:scaleX(${practice?s.index/s.queue.length:discovery?0:1})"></i></div><div class="game-body"><section class="neck-panel" ${this.paused||this.count?'inert':''}><div class="neck-viewport" id="pilot-neck"><div class="neck-inner" id="pilot-neck-inner">${this.diagram({reveal,target,discovery,family})}</div></div><div class="neck-controls"><span>Position 0–4</span></div>${reveal?`<div class="pilot-legend">${m.pool.map(p=>`<span><strong>${esc(pitchLabel(p.midi,this.notation))}</strong> ${esc(spot(p,this.profile))}</span>`).join('')}</div>`:''}<div class="pilot-position-buttons" aria-label="Alternative tactile au manche">${this.positionButtons()}</div></section><section class="answer-workspace" ${this.paused||this.count?'inert':''}><section class="question-copy"><h1>${esc(title)}</h1><p>${esc(hint)}</p></section><section class="answer-area pilot-answer">${body}</section></section>${this.count?`<div class="countdown-overlay" role="status" aria-live="polite"><span>À vous de jouer</span><svg class="startup-ring pilot-count" viewBox="0 0 100 100" aria-label="Préparation pendant une seconde et demie"><circle class="ring-track" cx="50" cy="50" r="43"/><circle class="ring-progress" pathLength="100" cx="50" cy="50" r="43"/></svg></div>`:''}</div>${this.muted?'<p class="pilot-muted">Son coupé : les exercices visuels restent disponibles.</p>':''}${this.paused?`<div class="pilot-pause-layer"><section class="pause-card" role="region" aria-label="Pause"><h2>Pause</h2><p>Vos premières réponses sont conservées.</p><button class="button primary" data-pilot-action="resume-pause">Reprendre</button><button class="text-button" data-pilot-action="home">Retour au parcours</button></section></div>`:''}</main>`;
 }
 renderIntroduction(){const help=this.introduction;return `<main id="main-content" tabindex="-1" class="instruction-page"><header class="game-header"><button class="icon-button" data-pilot-action="home" aria-label="Retour au parcours">${this.host.icon('back')}</button><div><strong>${esc(this.module.title)}</strong><small>Nouvel exercice !</small></div><button class="icon-button sound-toggle" data-pilot-action="mute" aria-label="${this.muted?'Activer':'Couper'} le son" aria-pressed="${this.muted}">${this.host.icon(this.muted?'mute':'sound')}</button></header><section class="instruction-content"><h1>${esc(help.title)}</h1>${helpGraphic(help,this.module,this.profile,this.notation)}<p>${esc(help.text)}</p>${help.kind==='interval'?`<p class="instruction-pitches">${pitchLabel(this.module.anchor.midi,this.notation)} → ${pitchLabel(this.module.target.midi,this.notation)} · ${this.module.delta} demi-ton${this.module.delta>1?'s':''}<br><small>Une case sur une même corde = un demi-ton.</small></p>`:''}${['interval','transfer'].includes(help.kind)?`<button class="button secondary" data-pilot-action="help-listen" ${this.muted?'disabled':''}>Écouter</button>`:''}</section><footer><button class="button primary" data-pilot-action="help-next">À moi d’essayer</button></footer></main>`;}
 wheel(){const choices=this.module.kind==='tuning'?[...new Set(this.profile.tuning.map(n=>n%12))].sort((a,b)=>a-b):NATURAL_PITCHES;
  return `<div class="answer-wheel pilot-wheel" role="group" aria-label="Choisir le nom de la note"><div class="wheel-center" aria-hidden="true">Votre<br>réponse</div>${choices.map((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/choices.length,correct=this.feedback&&n===this.question.target.midi%12,wrong=this.feedback&&!this.feedback.correct&&n===this.feedback.value;return `<button data-pilot-action="note" data-note="${n}" style="left:${50+37*Math.cos(a)}%;top:${50+37*Math.sin(a)}%" ${this.feedback||this.count?'disabled':''} class="${correct?'answer-correct':wrong?'answer-wrong':''}">${esc(noteName(n,this.notation))}</button>`;}).join('')}</div>`;
 }
 diagram({reveal=false,target=null,discovery=false,family=false}={}){
  const profile=this.profile,count=profile.tuning.length,g=this.geometry,m=this.module,q=this.question;
  const marked=family?this.session.familySelected||[]:discovery?this.session.explored||[]:[],feedback=this.feedback;
  const visible=m.pool;const selectedTarget=this.count||discovery&&!this.session.revealed&&!this.session.discoveryDone?null:this.session.stage==='practice'&&q?.mode==='find'&&!feedback?null:target;
  const effectiveTarget=this.session.stage==='practice'&&feedback?.correct&&feedback.position?feedback.position:selectedTarget;
  return `<svg viewBox="0 0 ${g.width} ${g.height}" role="group" aria-label="Manche de ${count} cordes, cases 0 à 4"><defs><linearGradient id="pilot-fade"><stop offset="${g.fadeStart/g.width*100}%" stop-color="white"/><stop offset="100%" stop-color="black"/></linearGradient><mask id="pilot-mask"><rect width="${g.width}" height="${g.height}" fill="url(#pilot-fade)"/></mask></defs><g mask="url(#pilot-mask)"><rect x="${g.nut}" y="2" width="${g.width-g.nut}" height="${g.height-10}" fill="#e7cba4"/>${g.frets.map((x,f)=>`<path d="M${x} 2v${g.height-10}" stroke="${f===0?'#626b77':'#8a919b'}" stroke-width="${f===0?2.8:1.1}"/>`).join('')}${g.ys.map((y,s)=>`<path d="M${g.nut-36} ${y}H${g.width}" stroke="#59647a" stroke-width="${.5+(count-1-s)*.10}"/>`).join('')}</g>${g.ys.map((y,s)=>`<text class="pilot-axis-string" x="3" y="${y}" dominant-baseline="middle" font-size="3.3" fill="#44516b">${count-s}</text>`).join('')}${g.centers.map((x,f)=>`<text class="pilot-axis-fret" x="${x}" y="${g.height-2}" text-anchor="middle" font-size="3.5" fill="#44516b">${f}</text>`).join('')}${m.kind==='transfer'&&discovery&&this.session.discoveryTried?this.transferLinks(g):''}${g.ys.flatMap((y,string)=>g.centers.map((x,fret)=>{
   const p={string,fret,midi:profile.tuning[string]+fret},inPool=visible.some(v=>equal(v,p)),hit=equal(effectiveTarget,p)||feedback&&!feedback.correct&&this.session.stage==='practice'&&equal(q?.target,p),found=marked.includes(positionKey(p)),green=this.greenPositions().some(x=>equal(x,p));
   const wrong=feedback&&!feedback.correct&&(this.session.stage==='practice'&&equal(feedback.position,p)||(discovery||this.session.stage==='motif')&&equal(feedback.position,p));
   const interactive=!this.count&&!this.paused&&(this.session.stage!=='practice'||q?.mode==='find'&&!feedback);
   const showDot=!this.count&&(green||hit||wrong||found||reveal&&inPool),left=fret===0?g.nut-36:g.frets[fret-1],width=fret===0?36:g.frets[fret]-left;
   return `<g class="fret-hit ${interactive?'selectable':''}" ${interactive?`role="button" tabindex="0" data-pilot-string="${string}" data-pilot-fret="${fret}" aria-label="Corde ${count-string}, ${fret?'case '+fret:'à vide'}"`:''}><rect x="${left}" y="${y-5}" width="${width}" height="10" fill="transparent"/><circle class="keyboard-hint" cx="${x}" cy="${y}" r="4.5" fill="none" stroke="#44516b" stroke-width="1"/>${showDot?`<circle class="pilot-marker" cx="${x}" cy="${y}" r="3.5" fill="${wrong?'#c13232':green?'#267342':'#44516b'}"/>${feedback||reveal||discovery&&this.session.revealed?this.noteTag(p,g,wrong?'#c13232':green?'#267342':'#44516b'):''}`:''}</g>`;
  })).join('')}</svg>`;
 }
 noteTag(p,g,color){const text=pitchLabel(p.midi,this.notation);return `<g class="note-tag" data-length="${text.length}" data-fret="${p.fret}" transform="translate(${g.labelXs[p.fret]} ${g.ys[p.string]})"><rect x="-7" y="-3" width="14" height="6" rx="2" fill="white" fill-opacity=".94"/><text text-anchor="middle" dominant-baseline="central" font-size="4" font-weight="650" fill="${color}">${esc(text)}</text></g>`;}
 transferLinks(g){return this.module.transferPairs.map(group=>{const fret=group[0].fret,x=g.centers[fret],ys=group.map(p=>g.ys[p.string]);return `<g class="transfer-link" data-transfer-fret="${fret}"><path d="M${x} ${Math.min(...ys)}V${Math.max(...ys)}" stroke="#267342" stroke-width=".8" stroke-dasharray="2 1"/></g>`;}).join('');}
 positionButtons(){if(this.session.stage==='practice'&&this.question?.mode==='name')return '';const feedback=this.feedback,locked=this.session.stage==='practice'&&feedback;
  return `<details ${this.coordinatesOpen?'open':''}><summary>Boutons de réponse</summary><div class="pilot-coordinate-grid">${this.stringOrder.map(string=>`<div><span>Corde ${this.profile.tuning.length-string}</span>${[0,1,2,3,4].map(f=>{const p={string,fret:f},right=feedback&&this.greenPositions().some(x=>equal(x,p)),wrong=feedback&&!feedback.correct&&equal(p,feedback.value||feedback.position);return `<button class="${right?'answer-correct':wrong?'answer-wrong':''}" data-pilot-action="position" data-string="${string}" data-fret="${f}" ${this.count||locked?'disabled':''}>${f===0?'À vide':f}</button>`;}).join('')}</div>`).join('')}</div></details>`;
 }
 result(){const s=this.session,first=s.events.filter(e=>!e.retry),result=activityResult(first,s.queue.length),stars=score(first).stars,index=this.activities.findIndex(m=>m.id===s.activity),next=index>=0?this.activities[index+1]:null;return `<main id="main-content" tabindex="-1" class="pilot-sheet result-card score-card compact-result"><p class="eyebrow">${this.module.mode==='find'?'RETROUVER':'NOMMER'}</p><h1>${result.passed?'Exercice réussi !':'Encore un essai ?'}</h1><div class="score-display"><strong>${result.correct}<span>/${result.total}</span></strong></div><div class="score-details"><span class="stars" aria-label="${stars} étoiles sur 5">${Array.from({length:5},(_,i)=>`<span class="${i<stars?'earned':''}">★</span>`).join('')}</span></div><div class="result-actions">${result.passed&&next?`<button class="button primary" data-pilot-action="start" data-module="${next.id}">Exercice suivant</button>`:`<button class="button primary" data-pilot-action="start" data-module="${esc(s.activity)}">Réessayer</button>`}<div class="result-secondary-actions"><button class="button quiet-button" data-pilot-action="start" data-module="${esc(s.activity)}">Refaire</button><button class="button quiet-button" data-pilot-action="home">Mon parcours</button></div></div><div class="score-strip" aria-hidden="true">${first.map(e=>`<i class="${e.correct?'hit':'miss'}"></i>`).join('')}</div><span class="visually-hidden">${result.correct} bonnes réponses sur ${result.total}.</span></main>`;}
 layout(){
  const viewport=document.querySelector('#pilot-neck'),inner=document.querySelector('#pilot-neck-inner');if(!viewport||!inner||!this.session)return;
  const game=document.querySelector('.pilot-game'),body=document.querySelector('.game-body'),stage=document.querySelector('.pilot-response-stage');
  if(game&&body)game.style.setProperty('--pause-top',`${body.offsetTop}px`);
  if(stage){const size=Math.max(window.innerHeight<=360?148:156,Math.min(310,stage.clientWidth-4,stage.clientHeight-4));game.style.setProperty('--wheel-size',`${size}px`);game.style.setProperty('--note-size',`${Math.max(44,Math.min(56,size*.2))}px`);}
  const g=this.geometry,long=viewport.clientWidth,cross=viewport.clientHeight,fit=fitNeck(g,long,cross),{scale,width,height}=fit;
  inner.style.width=`${width}px`;inner.style.height=`${height}px`;inner.style.transform=`translate(${(long-width)/2}px,${(cross-height)/2}px)`;
  inner.querySelectorAll('.pilot-axis-string,.pilot-axis-fret').forEach(t=>t.style.fontSize=`${14/scale}px`);inner.querySelectorAll('.pilot-axis-string,.pilot-axis-fret').forEach(t=>t.style.fontWeight='750');
  inner.querySelectorAll('.note-tag').forEach(tag=>{const chars=Number(tag.dataset.length),fret=Number(tag.dataset.fret),gap=g.centers[fret]-g.labelXs[fret],row=Math.abs(g.ys[0]-g.ys[1]),f=Math.min(13/scale,2*(gap-4)/(chars*.6+.6),row*.75),w=(chars*.6+.6)*f;tag.querySelector('text').style.fontSize=`${f}px`;const rect=tag.querySelector('rect');rect.setAttribute('width',w);rect.setAttribute('x',-w/2);rect.setAttribute('height',f*1.2);rect.setAttribute('y',-f*.6);});viewport.dataset.limit='0';
  let down=null;viewport.onpointerdown=e=>{down={x:e.clientX,y:e.clientY};};
  viewport.onpointerup=e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<8){const hit=e.target.closest('[data-pilot-string]');if(hit){this.neckTap(Number(hit.dataset.pilotString),Number(hit.dataset.pilotFret));const current=document.querySelector('#pilot-neck');if(current){const r=current.getBoundingClientRect(),dot=document.createElement('span');dot.className='touch-ripple';dot.style.left=`${e.clientX-r.left}px`;dot.style.top=`${e.clientY-r.top}px`;current.append(dot);setTimeout(()=>dot.remove(),360);}}}down=null;};viewport.onpointercancel=()=>down=null;
 }
}
