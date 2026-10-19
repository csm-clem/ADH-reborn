import {betaCourses,courseCompleted} from "./beta-courses.js";
import {preserveLearningProofs} from "./learning-evidence.js";
import {betaCatalog} from './beta-catalog.js';
import {betaHome,navigateBeta,startChapter,continueLearning} from './beta-home.js';
import {simulatedBetaCompletion} from './debug-mode.js';
import {notationFor} from './core.js';
import {rewardFor} from './reward-music.js';
import {DEMO_RULES} from './demo-rules.js';
import {neckBase,miniatureNeck,noteTagSVG,layoutNoteTags,layoutMiniature} from './neck-view.js';
import {searchFeedback} from './discovery-feedback.js';
import {progressView} from './progress.js';
import {catalogMelodies} from './melodies.js';
import {evaluateAchievements,achievementContext} from './achievement-rules.js';
import {renderAchievementUnlock} from './achievement-unlock.js';
import {preserveAchievementEvidence} from './achievement-evidence.js';
import {resultMetrics,personalRecord,comparisonKey,mistakeGroups} from './results.js';
import {seconds,chosenLabel,mistakeGraphic,shareResult} from './result-ui.js';
import {introductionFor,helpGraphic} from './learning-help.js';
import {noteName,pitchLabel,neckGeometry,fitNeck,score} from './core.js';
import {NATURAL_PITCHES,positionKey,questionsFor,pilotCorrect,initialPilotStore,validatePilotStore,naturalDiagnostic,activityResult,admissiblePositions} from './pilot.js';
import {ActiveClock} from './clock.js';
import {storageService} from './services/storage-service.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const equal=(a,b)=>a&&b&&a.string===b.string&&a.fret===b.fret;
const spot=(p,profile)=>`corde ${profile.tuning.length-p.string}, ${p.fret?'case '+p.fret:'à vide'}`;
export class PilotController{
 constructor(host){
  this.host=host;this.store=initialPilotStore();this.session=null;this.feedback=null;this.aids=[];this.paused=false;this.count=0;this.countEpoch=0;this.clock=new ActiveClock();this.countClock=new ActiveClock();this.storageError=false;this.effects=[];this.coordinatesOpen=!!host.getState().positionButtons;
  this.storage=host.storage||storageService;const loaded=this.storage.readPilot();this.store=loaded.value;this.unreadableRaw=loaded.unreadableRaw;this.storageError=!loaded.ok;
 }
 get profile(){return this.host.getState().profile;}
 get notation(){return notationFor(this.host.getState());}
 get catalog(){const key=`${this.profile.key}:${JSON.stringify(this.notation)}`;if(this.catalogKey!==key){this.cachedCatalog=betaCatalog(this.profile,{notation:this.notation});this.catalogKey=key;const d=this.store.profiles[this.profile.key];if(d?.courses)for(const [id,course]of betaCourses(this.profile,this.cachedCatalog,this.notation))if(d.courses[id]?.completed&&!courseCompleted(course,d.courses[id])){const r=d.courses[id];r.completed=false;r.index=Math.max(0,course.pages.findIndex(p=>p.quiz?!r.correct.includes(p.id):!r.visited.includes(p.id)));r.extended=true;}}return this.cachedCatalog;}
 get plan(){return this.catalog.byScope.get(this.module?.scopeId||this.data.navigation?.route)?.plan||this.catalog.byScope.get('z1').plan;}
 get data(){const p=this.profile;const d=this.store.profiles[p.key]||={profile:p,attempts:[],later:[],session:null,diagnostic:null};return d;}
 get activities(){return this.catalog.activities;}
 get module(){return this.resolve(this.session?.activity);}
 get familyPitches(){return this.session?.familyOrder||NATURAL_PITCHES.filter(pc=>this.plan.natural.some(p=>p.midi%12===pc));}
 get question(){return this.session?.queue[this.session.index];}
 get stringOrder(){return [...(this.module?.strings||this.profile.tuning.map((_,i)=>i))].reverse();}
 get longString(){return this.module?.strings?.length===1&&this.zone.end-this.zone.start>=8;}
 get positionsVisible(){return this.coordinatesOpen;}
 get zone(){return this.module?.zone||{start:0,end:4};}
 get frets(){return Array.from({length:this.zone.end-this.zone.start+1},(_,i)=>this.zone.start+i);}
 // An exercise restricts the answers, never removes the neighbouring strings.
 get geometry(){return neckGeometry(this.profile.tuning.length,this.zone.end,648,{gameplay:true,startFret:this.zone.start});}
 get introduction(){if(!this.session||this.session.stage==='result')return null;return introductionFor(this.module,this.session.stage,this.question,this.data.seenInstructions||[],this.session.activity,this.session.stage==='motif'?this.melody():null,this.notation,this.profile.tuning.length);}
 accidentalsButton(){const flat=this.host.getState().accidentals==='flat';return `<button class="icon-button accidentals-toggle" data-pilot-action="accidentals" aria-label="${flat?'Afficher les dièses':'Afficher les bémols'}" title="${flat?'Bémols affichés':'Dièses affichés'}" aria-pressed="${flat}">${flat?'♭':'♯'}</button>`;}
 get muted(){return !this.host.getState().sound;}
 name(p){return noteName(p.midi,this.notation);}
 save(){
  if(this.session){this.session.feedback=this.session.stage==='practice'||this.session.stage==='motif'?null:this.feedback;this.session.currentAids=this.aids;this.session.activeMs=this.session.stage==='practice'&&!this.feedback?this.clock.elapsed():0;this.data.session=this.session.completed?null:this.session;}
  if(this.debugActive)return;
  if(this.unreadableRaw){this.storageError=true;return;}
  this.storageError=!this.storage.savePilot(this.store).ok;
 }

 exportData(){if(this.session)this.save();return this.debugActive?this.realStore:this.store;}
 syncAchievements(entry=null){
  preserveLearningProofs(this.catalog,this.data);preserveAchievementEvidence(this.catalog,this.data);
  this.store.achievements||=[];
  const fresh=evaluateAchievements({profile:this.profile,catalog:this.catalog,data:this.data,entry:entry||{at:Date.now()},existing:this.store.achievements});
  this.store.achievements.push(...fresh);return fresh;
 }
 importData(value,{persist=true}={}){if(this.debugActive)throw new Error('Désactivez le mode débug avant d’importer.');const valid=validatePilotStore(value);this.leave();this.store=valid;this.unreadableRaw=null;this.storageError=false;if(persist)this.storageError=!this.storage.replacePilot(valid).ok;}
 setDebug(active){
  if(active===!!this.debugActive)return;
  if(active){const simulation=simulatedBetaCompletion(this.profile,this.catalog);this.leave();this.realStore=this.store;this.realStorageError=this.storageError;this.store=simulation;this.debugActive=true;this.storageError=false;}
  else{this.leave();this.store=this.realStore;this.realStore=null;this.debugActive=false;this.storageError=this.realStorageError;}
 }
 emit(){this.host.showPilot();}
 bind(root){
  root.addEventListener('click',e=>{const b=e.target.closest('[data-pilot-action]');if(!b)return;e.preventDefault();e.stopPropagation();this.action(b.dataset.pilotAction,b);});
  root.addEventListener('pointerdown',e=>{const lesson=e.target.closest('[data-lesson-string]');if(lesson){e.preventDefault();this.lessonTap(Number(lesson.dataset.lessonString),Number(lesson.dataset.lessonFret));return;}if(!e.target.closest('#pilot-neck'))return;if(e.button!==0||this.paused||this.entering||this.count)return;const hit=e.target.closest('[data-pilot-string]');if(!hit)return;e.preventDefault();this.neckTap(Number(hit.dataset.pilotString),Number(hit.dataset.pilotFret));});
  root.addEventListener('keydown',e=>{if(!['Enter',' '].includes(e.key))return;const lesson=e.target.closest('[data-lesson-string]');if(lesson){e.preventDefault();this.lessonTap(Number(lesson.dataset.lessonString),Number(lesson.dataset.lessonFret));return;}const cell=e.target.closest('[data-pilot-string]');if(!cell)return;e.preventDefault();this.neckTap(Number(cell.dataset.pilotString),Number(cell.dataset.pilotFret));});

 }
 home(){return betaHome(this);}
 stats(){return progressView(this.profile,[],this.data.attempts,this.notation,{zone:{start:0,end:24},evidence:this.data.evidence});}
 resolve(id){return this.activities.find(m=>m.id===id)||this.catalog.discoveries.find(m=>m.id===id)||(id?.startsWith('natural-diagnostic')?naturalDiagnostic(this.profile,id.endsWith('-find')?'find':'name'):id?.startsWith('review')?this.reviewModule(id.endsWith('-find')?'find':'name'):null);}
 reviewModule(mode='name'){
  const pool=this.pendingReview?.pool||(this.session?.activity?.startsWith('review')&&this.session.reviewPool?this.session.reviewPool:[...new Map(this.data.later.filter(q=>q.mode===mode).map(q=>[positionKey(q.target),q.target])).values()]);
  const source=this.catalog.activities.find(a=>a.id===(this.pendingReview?.source||this.session?.reviewSource)),strings=source?.strings||[...new Set(pool.map(p=>p.string))],zone=source?.zone||{start:Math.min(0,...pool.map(p=>p.fret)),end:Math.max(4,...pool.map(p=>p.fret))};
  return {id:mode==='name'?'review':'review-find',baseId:'review',mode,kind:'recall',scopeId:source?.scopeId,zone,strings,title:'Les notes à revoir',subtitle:mode==='name'?'Nommer les notes':'Retrouver les notes',choices:pool.some(p=>!NATURAL_PITCHES.includes(p.midi%12))?[...new Set(pool.map(p=>p.midi%12))].sort((a,b)=>a-b):undefined,pool,focus:pool,description:''};
 }
 start(id,resume=false){
  const module=this.resolve(id);if(!module||!module.pool.length)return;
  this.leave();this.returnActivity=id;this.host.onActivityStart?.(id);
  const chapter=this.catalog.chapters.find(c=>c.discoveryId===id||c.activityIds.includes(id));
  if(chapter){const nav=this.data.navigation||={route:chapter.scopeId};if(nav.route!=='guided'&&nav.route!==chapter.scopeId)nav.route=chapter.scopeId;nav.chapter=chapter.id;}
  this.longNeckWidth=0;this.neckCrossHeight=0;
  if(resume&&this.data.session?.activity===id)this.session=this.data.session;
  else this.session={id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,activity:id,originRoute:this.data.navigation?.route,taskContract:module.kind==='opens'&&module.mode==='name'?'register-v1':undefined,index:0,queue:module.discoveryOnly?[]:questionsFor(module,{diagnostic:id.startsWith('natural-diagnostic'),events:this.data.attempts.flatMap(a=>a.events)}),events:[],stage:module.discoveryOnly?'discovery':module.skipDiscovery||module.kind==='recall'||this.data.discoveredModules?.includes(module.baseId)?'practice':'discovery',discoveryDone:false,discoveryTried:false,motifIndex:0,motifErrors:0,flowVersion:2,startedAt:Date.now(),completed:false};
  if(id.startsWith('review')&&!resume){this.session.reviewPool=module.pool;this.session.reviewSource=this.pendingReview?.source||'general';}
  this.feedback=resume?this.session.feedback||null:null;this.aids=resume?this.session.currentAids||[]:[];this.resumeMs=resume?this.session.activeMs||0:0;this.resumeAids=resume?[...this.aids]:null;this.paused=false;this.count=0;this.lessonTrial=null;this.effects=[];this.save();
  if(this.session.stage==='motif'&&this.session.motifCompleted){this.scheduleMotifFinish();this.emit();}else if(this.session.finalCorrection){this.scheduleFinalAdvance();this.emit();}else if(this.introduction){this.clock.reset();this.clock.stop('instruction');this.resumeMs=0;this.save();this.emit();}else if(this.session.stage!=='result'&&!this.feedback)this.startCount();else this.emit();window.scrollTo(0,0);document.querySelector('#main-content')?.focus({preventScroll:true});
 }
 get demonstrationQuestion(){
  const q=this.question;if(!q)return null;
  const target=this.module.pool.find(p=>q.mode==='name'?(q.answerKind==='pitch'?p.midi!==q.target.midi:p.midi%12!==q.target.midi%12):!equal(p,q.target));
  return target?{...q,id:'example-'+q.id,target}:q;
 }
 separateDemonstration(help){
  if(this.session.stage==='practice'&&['name','find'].includes(help.kind)&&this.demonstrationQuestion===this.question){this.aids=[...new Set([...this.aids,'course'])];this.resumeAids=[...this.aids];}
 }
 cancelAdvance(){clearTimeout(this.advanceTimer);this.advanceTimer=null;this.advanceDue=0;}
 leave(){this.cancelEntry();this.cancelAdvance();this.cancelCount();this.clock.stop('leave');this.host.stopAudio();if(this.session){this.save();this.session=null;}this.paused=false;this.feedback=null;this.rewardPlaying=false;this.rewardEpoch=(this.rewardEpoch||0)+1;}
 cancelEntry(){clearTimeout(this.entryTimer);this.entryEpoch=(this.entryEpoch||0)+1;this.entering=false;}
 cancelCount(){clearTimeout(this.timer);this.countEpoch++;this.count=0;}
 startCount(){if(this.session.stage!=='practice'){this.count=0;this.emit();return;}if(this.introduction){this.clock.reset();this.clock.stop('instruction');this.resumeMs=0;this.save();this.emit();return;}this.cancelEntry();this.cancelCount();this.host.unlockAudio();this.count=1;this.countClock.reset();this.clock.reset();this.clock.total=this.resumeMs||0;this.clock.stop('countdown');const epoch=this.countEpoch;this.save();this.emit();this.timer=setTimeout(()=>this.tick(epoch),1000);}
 tick(epoch){if(epoch!==this.countEpoch||this.paused||!this.session)return;const remaining=1000-this.countClock.elapsed();if(remaining>0){this.timer=setTimeout(()=>this.tick(epoch),remaining);return;}this.count=0;this.showQuestion({initial:true});}
 showQuestion({initial=false}={}){
  if(this.introduction){this.clock.reset();this.clock.stop('instruction');this.resumeMs=0;this.save();this.emit();return;}
  this.cancelEntry();this.feedback=null;this.aids=this.resumeAids||[];this.resumeAids=null;this.paused=false;this.firstEntry=initial;
  this.clock.reset();this.clock.total=this.resumeMs||0;this.resumeMs=0;this.save();this.emit();
 }

 pause({keepAudio=false}={}){const stop=()=>{if(!keepAudio)this.host.stopAudio();};if(!this.session||this.paused)return;if(this.introduction){stop();this.save();return;}if(this.session.stage==='result'){if(keepAudio){this.save();return;}stop();this.rewardPlaying=false;this.rewardEpoch=(this.rewardEpoch||0)+1;this.save();this.emit();return;}this.cancelAdvance();this.cancelEntry();this.paused=true;this.clock.resume('appearance');this.clock.stop('pause');this.countClock.stop('pause');clearTimeout(this.timer);stop();this.save();this.emit();}
 scheduleMotifFinish(){this.cancelAdvance();const session=this.session;this.advanceTimer=setTimeout(()=>{if(this.session===session&&!this.paused){this.finish();if(this.melody()&&!this.muted)this.toggleReward();}},300);}
 resumePause(){this.paused=false;if(this.session.stage==='motif'&&this.session.motifCompleted)this.scheduleMotifFinish();if(this.session.finalCorrection)this.scheduleFinalAdvance();this.clock.resume('pause');if(this.count){this.countClock.resume('pause');const epoch=this.countEpoch;this.timer=setTimeout(()=>this.tick(epoch),Math.max(1,1000-this.countClock.elapsed()));}this.emit();}
 scheduleFinalAdvance(){this.cancelAdvance();const session=this.session,last=session.events.at(-1);if(!this.effects.length&&last){const position=last.mode==='find'?{...last.firstAnswer,midi:this.profile.tuning[last.firstAnswer.string]+last.firstAnswer.fret}:this.plan.all.find(p=>p.midi%12===last.firstAnswer);this.addEffect({correct:false,position,target:last.target,value:last.firstAnswer,mode:last.mode});}this.advanceTimer=setTimeout(()=>{if(this.session===session&&!this.paused){this.session.finalCorrection=false;this.prepareNext();}},1060);}
 prepareNext({correct=true}={}){
  this.cancelAdvance();if(this.session.stage==='practice'&&!correct&&this.session.index===this.session.queue.length-1){this.session.finalCorrection=true;this.scheduleFinalAdvance();this.save();this.emit();return;}
  this.session.finalCorrection=false;if(this.session.stage==='motif'){this.session.motifIndex++;this.feedback=null;this.save();this.emit();return;}this.session.index++;this.feedback=null;this.aids=[];this.session.nameDraft='';this.inputError=null;
  if(this.session.index>=this.session.queue.length){if(this.module.mode==='name'||this.module.kind==='recall'){this.finish();return;}this.session.stage='motif';this.session.motifIndex=0;this.session.motifErrors=0;this.save();this.emit();}
  else this.showQuestion();
 }
 addEffect({correct,position,target,value,mode}){
  const effect={id:'echo-'+(this.effectId=(this.effectId||0)+1),at:performance.now(),correct,position,target,value,mode};
  this.effects=this.effects.filter(e=>performance.now()-e.at<this.effectLifetime(e));this.effects.push(effect);
  setTimeout(()=>{this.effects=this.effects.filter(e=>e.id!==effect.id);globalThis.document?.querySelectorAll(`[data-echo-id="${effect.id}"]`).forEach(e=>e.remove());},this.effectLifetime(effect));
 }
 effectLifetime(e){return (e.correct?0:500)+560;}
 effectStyle(e){return `animation-delay:${(e.correct?0:500)-(performance.now()-e.at)}ms`;}
 echoMarkup(g){return this.effects.filter(e=>performance.now()-e.at<this.effectLifetime(e)).map(e=>{const p=e.target;return `<g class="answer-echo" data-echo-id="${e.id}"><circle class="echo-dot ${e.correct?'tone-correct':'tone-wrong'}" data-animation-owned cx="${g.centers[p.fret]}" cy="${g.ys[p.string]}" r="4.3" fill="var(--note-${e.correct?'correct':'wrong'})" style="${this.effectStyle(e)}"/><text class="feedback-symbol echo-symbol" data-animation-owned style="${this.effectStyle(e)}" x="${g.centers[p.fret]}" y="${g.ys[p.string]}" text-anchor="middle" dominant-baseline="central" font-size="5" fill="var(--on-note)">${e.correct?'✓':'×'}</text>${!e.correct?`<g class="echo-label" data-animation-owned style="${this.effectStyle(e)}">${this.noteTag(p,g)}</g>`:''}</g>`;}).join('');}

 answer(value){
  if(!this.session||this.session.stage!=='practice'||this.session.finalCorrection||this.count||this.entering||this.paused)return;
  const q=this.question,correct=pilotCorrect(this.profile,q,value),actual=correct&&q.mode==='find'?{string:value.string,fret:value.fret,midi:this.profile.tuning[value.string]+value.fret}:q.target,event={questionId:q.id,target:{...actual},mode:q.mode,answerKind:q.answerKind||'class',scope:q.scope,zone:q.zone||this.zone,strings:q.strings||this.module.strings,scopeId:q.scopeId,competence:q.mode==='name'?'C03':'C04',format:q.mode==='name'?'choice':'position',aids:[...this.aids],firstAnswer:value,correct,ms:this.clock.elapsed(),at:Date.now(),retry:!!q.retry,evaluation:!!q.evaluation,slipReported:false,automaticAids:[],aidLevel:'A0',timingInterpretable:true};
  this.clock.stop('feedback');this.session.events.push(event);
  const wrongPosition=correct?null:q.mode==='find'?{...value,midi:this.profile.tuning[value.string]+value.fret}:this.plan.all.filter(p=>p.midi%12===value).sort((a,b)=>Math.abs(a.midi-q.target.midi)-Math.abs(b.midi-q.target.midi))[0];
  this.addEffect({correct,value,position:correct?actual:wrongPosition,target:actual,mode:q.mode});
  if(!correct){this.data.later=this.data.later.filter(e=>!(equal(e.target,q.target)&&e.mode===q.mode));this.data.later.push({...q,retry:false});this.data.later=this.data.later.slice(-200);}
  else if(!this.aids.length&&this.session.activity.startsWith('review'))this.data.later=this.data.later.filter(e=>!(equal(e.target,q.target)&&e.mode===q.mode));
  if(correct)this.host.playNote(actual.midi);this.prepareNext({correct});
 }
 melody(){const m=this.module,key=`${this.profile.key}:${m.id}`;if(this.melodyKey!==key){this.melodyKey=key;this.cachedMelody=catalogMelodies(this.catalog).get(m.id)||null;}return this.cachedMelody;}
 motif(){const selected=this.melody();if(selected)return selected.sequence;const sorted=[...this.module.pool].sort((a,b)=>a.midi-b.midi);return [sorted[0],sorted.at(-1),sorted[Math.floor(sorted.length/2)],sorted[0]];}

 greenPositions(){
  if(!this.feedback)return [];
  if(this.session.stage==='practice')return this.question.mode==='name'?this.module.pool.filter(p=>p.midi===this.question.target.midi):admissiblePositions(this.profile,this.question);
  if(this.session.stage==='discovery')return DEMO_RULES.points(this.module,{explored:this.session.explored||[]});
  if(this.session.stage==='motif')return this.feedback.correct?[this.feedback.position].filter(Boolean):[this.feedback.target].filter(Boolean);
  return [];
 }
 neckTap(string,fret){
  if(!this.session||this.paused||this.count)return;if(this.introduction)return this.lessonTap(string,fret);const p={string,fret,midi:this.profile.tuning[string]+fret};
  if(this.session.stage==='discovery'){
   if(this.session.discoveryDone)return;
   const focus=this.module.focus||this.module.pool,correct=focus.some(x=>equal(x,p)),explored=this.session.explored||[];
   this.session.discoveryTried=true;
   if(correct){if(!explored.includes(positionKey(p)))explored.push(positionKey(p));this.session.explored=explored;this.session.discoveryDone=focus.every(x=>explored.includes(positionKey(x)));this.feedback={correct:true,position:p,text:`${explored.length} / ${focus.length} repères trouvés.`};this.host.playNote(p.midi);}
   else{const target=[...focus].sort((a,b)=>Math.abs(a.midi-p.midi)-Math.abs(b.midi-p.midi))[0];this.feedback={correct:false,position:p,text:searchFeedback(target,p,this.session.discoveryAttempts||0)};}
   this.session.discoveryAttempts=(this.session.discoveryAttempts||0)+1;this.save();this.emit();return;
  }
  if(this.session.stage==='practice'){
   if(this.question.mode==='find')this.answer({string,fret});
   return;
  }
  if(this.session.stage==='motif'){
   if(this.session.activity==='natural-diagnostic'){this.familyTap(p);return;}
   if(this.session.motifCompleted)return;const motif=this.motif(),target=motif[this.session.motifIndex];if(!target)return;
   const correct=p.midi===target.midi&&this.module.pool.some(x=>equal(x,p));
   this.addEffect({correct,position:p,target,mode:'find'});
   if(!correct){this.session.motifErrors++;this.session.motifIndex=0;this.session.motifRetries=(this.session.motifRetries||0)+1;this.save();this.emit();return;}
   this.session.motifIndex++;
   if(this.session.motifIndex>=motif.length){this.session.motifCompleted=true;this.host.playNote(p.midi);this.feedback=null;this.save();this.emit();this.scheduleMotifFinish();return;}
   this.host.playNote(p.midi);this.feedback=null;this.save();this.emit();

  }
 }
 lessonTap(string,fret){const help=this.introduction;if(!help||this.paused)return;const p={string,fret,midi:this.profile.tuning[string]+fret},points=DEMO_RULES.points(this.module,{question:this.demonstrationQuestion,kind:help.kind}),target=[...points].sort((a,b)=>Math.abs(a.midi-p.midi)-Math.abs(b.midi-p.midi))[0];if(!target)return;const correct=points.some(x=>equal(x,p)),attempt=(this.lessonTrial?.attempt||0)+1;this.lessonTrial={key:help.key,attempt,position:p,correct,text:correct?'Oui, trouvé !':searchFeedback(target,p,attempt)};if(correct)this.host.playNote(p.midi);this.emit();}

 addAid(aid){if(!this.aids.includes(aid))this.aids.push(aid);this.save();}
 familyTap(p){if(this.session.familyComplete)return;const pcs=this.familyPitches,index=this.session.familyIndex||0,pc=pcs[index],targets=this.plan.natural.filter(p=>p.midi%12===pc),selected=this.session.familySelected||[];
  if(p.midi%12!==pc){this.session.familyErrors++;this.feedback={correct:false,position:p,text:`Ici c’est ${this.name(p)}. Cherchez uniquement les ${noteName(pc,this.notation)}.`};}else{if(!selected.includes(positionKey(p)))selected.push(positionKey(p));this.session.familySelected=selected;this.feedback={correct:true,text:`${selected.length} / ${targets.length} repères trouvés.`};}
  this.session.familyComplete=targets.every(p=>selected.includes(positionKey(p)));this.save();this.emit();
 }
 finish(){
  if(this.session.completed)return;this.session.completed=true;const s=this.session;
  const validation=activityResult(s.events,s.queue.filter(q=>!q.retry).length);
  const entry={passed:validation.passed,id:s.id,activity:s.activity,at:Date.now(),events:s.events,finished:true,motifErrors:s.motifErrors||0,motifCompleted:!!s.motifCompleted,melodyId:s.motifCompleted?this.melody()?.id||null:null,music:s.motifCompleted&&this.melody()?{shift:this.melody().shift}:null,familyErrors:s.familyErrors??null,comparisonKey:comparisonKey(s)};
  if(!this.data.attempts.some(a=>a.id===entry.id))this.data.attempts.push(entry);s.newAchievements=this.syncAchievements(entry);this.unlockIndex=0;this.unlockCache=null;this.data.attempts=this.data.attempts.slice(-250);
  if(s.activity.startsWith('natural-diagnostic'))this.data.diagnostic={passed:validation.passed,mode:this.module.mode,at:Date.now(),attempt:s.id};
  this.resultView='summary';this.resultNotice='';s.stage='result';this.data.session=null;this.save();this.emit();window.scrollTo(0,0);document.querySelector('#main-content')?.focus({preventScroll:true});
 }
 action(action,button){
  if(this.paused&&!['resume-pause','home','mute','fullscreen','accidentals','exit'].includes(action))return;
  if(this.introduction&&!['help-next','help-listen','home','exit','mute','fullscreen','accidentals'].includes(action))return;
  switch(action){
   case 'beta-catalog':navigateBeta(this,'catalog');return;
   case 'beta-branch':navigateBeta(this,'branch',button.dataset.id);return;
   case 'beta-review':{const a=this.data.attempts.filter(a=>a.activity===button.dataset.id).at(-1);if(a?.passed===false){this.pendingReview={pool:[...new Map(a.events.filter(e=>!e.correct).map(e=>[positionKey(e.target),e.target])).values()],source:a.activity};this.start(this.resolve(a.activity)?.mode==='find'?'review-targeted-find':'review-targeted');this.pendingReview=null;}else this.start(button.dataset.id);return;}
   case 'beta-route':navigateBeta(this,'route',button.dataset.id);return;
   case 'beta-chapter':navigateBeta(this,'chapter',button.dataset.id);return;
   case 'beta-begin':startChapter(this,button.dataset.id);return;
   case 'beta-course':this.host.openCourse?.(button.dataset.id);return;
   case 'next-learning':case 'beta-next-chapter':continueLearning(this);return;
   case 'help-next':{this.lessonTrial=null;const help=this.introduction;if(!help)return;this.separateDemonstration(help);this.data.seenInstructions=[...new Set([...(this.data.seenInstructions||[]),help.key])];this.host.stopAudio();this.save();if(this.introduction){this.emit();}else this.startCount();return;}
   case 'help-listen':this.host.playSequence(this.introduction?.kind==='motif'?(this.melody()?.events||this.motif().map(p=>p.midi)):this.module.focus.map(p=>p.midi),{step:this.introduction?.kind==='motif'?rewardFor(this.melody())?.step||.42:.42});return;
   case 'exit':this.leave();this.host.home();return;
   case 'fullscreen':this.host.toggleFullscreen();return;
   case 'accidentals':this.host.setAccidentals?.(this.host.getState().accidentals==='flat'?'sharp':'flat');this.emit();return;
   case 'start':this.start(button.dataset.module);return;
   case 'resume':if(this.data.session)this.start(this.data.session.activity,true);return;
   case 'result-details':this.resultView='details';this.emit();document.querySelector('.result-details-view h1')?.focus({preventScroll:true});return;
   case 'result-summary':this.resultView='summary';this.emit();document.querySelector('.compact-result h1')?.focus({preventScroll:true});return;
   case 'review-errors':this.startErrorReview();return;
   case 'reward':this.toggleReward();return;
   case 'share-result':this.shareCurrentResult();return;
   case 'unlock-previous':this.unlockIndex=Math.max(0,(this.unlockIndex||0)-1);this.emit();return;
   case 'unlock-next':this.unlockIndex=Math.min(this.unlockedCards().length-1,(this.unlockIndex||0)+1);this.emit();return;
   case 'achievements':this.leave();this.host.achievements(button.dataset.id);return;
   case 'stats':this.leave();this.host.stats();return;
   case 'home':this.leave();this.host.home();return;
   case 'pause':this.pause();return;
   case 'resume-pause':this.resumePause();return;
   case 'mute':this.host.setSound(!this.host.getState().sound);this.emit();document.querySelector('[data-pilot-action="mute"]')?.focus({preventScroll:true});return;
   case 'hint':this.addAid('open-names');this.emit();return;
   case 'practice':{if(!this.session.discoveryDone)return;const module=this.module;this.data.discoveredModules=[...new Set([...(this.data.discoveredModules||[]),module.baseId])];this.syncAchievements();this.feedback=null;
    if(module.discoveryOnly){this.session.completed=true;this.data.session=null;this.save();if(module.nextId)this.start(module.nextId);else{this.leave();this.host.home();}return;}
    this.session.stage='practice';this.save();this.startCount();return;}
   case 'note':this.answer(Number(button.dataset.note));return;
   case 'toggle-positions':this.coordinatesOpen=!this.coordinatesOpen;this.host.setPositionButtons?.(this.coordinatesOpen);this.emit();return;
   case 'position':this.neckTap(Number(button.dataset.string),Number(button.dataset.fret));return;
   case 'replay':if(this.session.stage==='practice')return;this.host.playSequence(this.session.stage==='motif'?(this.melody()?.events||this.motif().map(p=>p.midi)):this.module.pool.map(p=>p.midi),{step:this.session.stage==='motif'?rewardFor(this.melody())?.step||.42:.42});return;
   case 'motif-again':this.cancelAdvance();this.session.motifIndex=0;this.feedback=null;this.save();this.emit();return;
   case 'complete':return;
   case 'family-next':if(!this.session.familyComplete)return;if(this.session.familyIndex===this.familyPitches.length-1){this.finish();return;}this.session.familyIndex++;this.session.familySelected=[];this.session.familyComplete=false;this.feedback=null;this.save();this.emit();return;

  }
 }
 render(){
  if(!this.session||!this.module)return '<p>Cette activité n’est plus disponible. Retrouvez votre parcours.</p><button data-pilot-action="home" class="button primary">Mon parcours</button>';
  if(this.count)return this.renderLaunch();
  if(this.introduction)return this.renderIntroduction();
  const s=this.session,m=this.module;if(s.stage==='result')return this.result();

  const practice=s.stage==='practice',q=this.question,discovery=s.stage==='discovery',family=s.stage==='motif'&&s.activity==='natural-diagnostic';
  const target=discovery?(m.focus[0]||m.pool[0]):practice?q?.target:null;
  let title=discovery?(['opens','tuning'].includes(m.kind)?'Explorez vos cordes à vide':`Retrouvez tous les ${noteName(m.pitchClass,this.notation)}`):family?`Retrouvez tous les ${noteName(this.familyPitches[s.familyIndex||0],this.notation)}`:s.stage==='motif'?'À vous de jouer la suite':q?.mode==='name'?(q.answerKind==='pitch'?'Quelle est cette hauteur ?':'Quelle est cette note ?'):`Trouvez ${pitchLabel(q.target.midi,this.notation)}.`;
  let hint=discovery&&['opens','tuning'].includes(m.kind)?'Touchez chaque départ une fois ; le nom accompagne le son.':discovery?'Touchez le manche pour chercher.':family?'Tous les emplacements de la zone ; les notes trouvées restent marquées.':s.stage==='motif'?(m.kind==='transfer'?`Rejouez les mêmes noms sur les cordes ${[...new Set(this.motif().map(p=>this.profile.tuning.length-p.string))].join(' puis ')}. Respectez la corde indiquée.`:'Touchez les notes dans l’ordre. Une autre position de même hauteur convient.'):q?.mode==='name'?spot(q.target,this.profile):q?.scope==='height'?'Trouvez une corde à vide de cette hauteur.':`Sur la corde ${this.profile.tuning.length-q.target.string}.`;
  if(this.count){title='Prêt à jouer ?';hint='La première question arrive…';}
  const reveal=false;
  const body=discovery?`${this.longString?this.longPositionButtons():''}${this.discoveryCounter()}<p class="discovery-direction" aria-live="polite">${this.feedback?esc(this.feedback.correct?'Oui, trouvé !':this.feedback.text):'Essayez librement.'}</p><button class="button primary" data-pilot-action="practice" ${!s.discoveryDone?'disabled':''}>${m.discoveryOnly?'Poursuivre':'J’essaie sans les noms'}</button>`:
  practice?`<div class="pilot-response-stage">${q.mode==='name'?this.wheel():`<p class="touch-prompt">Touchez ${esc(pitchLabel(q.target.midi,this.notation))} sur le manche.</p>${this.longString?this.longPositionButtons():''}`}</div><button class="text-button" data-pilot-action="hint">Afficher les noms ${this.zone.start===0?"des cordes à vide":"de la case "+this.zone.start}</button>`:
  family?`<p class="pilot-task">${s.familySelected?.length||0} repère${(s.familySelected?.length||0)>1?'s':''} trouvé${(s.familySelected?.length||0)>1?'s':''}.</p><button class="button primary" data-pilot-action="family-next" ${!s.familyComplete?'disabled':''}>${s.familyIndex===this.familyPitches.length-1?'Terminer le diagnostic':'Famille suivante'}</button>`:
  `${this.longString?this.longPositionButtons():''}<p class="melody-caption">${esc(this.melody()?this.melody().title+' · extrait':'Suite d’entraînement')}</p><button class="button secondary compact" data-pilot-action="replay" ${this.muted?'disabled':''}>${this.host.icon('play')} Écouter l’exemple en rythme</button><div class="pilot-motif">${this.motif().map((p,i)=>`<span class="${i<s.motifIndex?'done':i===s.motifIndex?'current':''}">${esc(this.name(p))}<small>Corde ${this.profile.tuning.length-p.string}</small></span>`).join('')}</div><p class="pilot-task">${s.motifIndex} / ${this.motif().length} notes jouées dans l’ordre.</p><button class="text-button" data-pilot-action="motif-again">Rejouer la suite</button><button class="button primary" data-pilot-action="complete" ${s.motifIndex<this.motif().length?'disabled':''}>Terminer la séquence</button>`;
  return `<main id="main-content" tabindex="-1" data-layout-owned class="game pilot-game ${this.longString?'is-long-string':''} ${practice&&q?.mode==='name'?'is-name':'is-touch'} ${this.longString&&this.positionsVisible?'uses-position-pad':''} ${practice?'is-practice':''} ${this.paused?'is-paused':''} ${this.entering?'is-entering':''} ${this.firstEntry?'is-first-entry':''} ${this.feedback?(this.feedback.correct?'feedback-correct':'feedback-wrong'):''}"><header class="game-header"><button class="icon-button" data-pilot-action="exit" aria-label="Quitter l’exercice">${this.host.icon('close')}</button><div><strong>${esc(m.title)}</strong><small><span class="game-subtitle">${this.debugActive?'Simulation · ':''}${esc(m.subtitle||'')}</span><span class="game-counter">${practice?(s.index+1)+' / '+s.queue.length:''}</span></small></div><button class="icon-button" data-pilot-action="fullscreen" aria-label="${document.fullscreenElement?'Quitter le plein écran':'Passer en plein écran'}" title="Plein écran">${this.host.icon(document.fullscreenElement?'fullscreen-exit':'fullscreen')}</button>${this.accidentalsButton()}<button class="icon-button" data-pilot-action="${this.paused?'resume-pause':'pause'}" aria-label="${this.paused?'Reprendre':'Mettre en pause'}">${this.host.icon('pause')}</button><button class="icon-button sound-toggle ${this.muted?'is-muted':''}" data-pilot-action="mute" aria-label="${this.muted?'Activer':'Couper'} le son" aria-pressed="${this.muted}">${this.host.icon(this.muted?'mute':'sound')}</button></header>${this.storageError?'<p class="notice" role="alert">Sauvegarde indisponible : résultats en mémoire seulement. Exportez-les avant de fermer.</p>':''}${this.orientationSuggestion()}<div class="game-progress"><i style="transform:scaleX(${practice?s.index/s.queue.length:discovery?0:1})"></i></div><div class="game-body"><section class="neck-panel" ${this.paused||this.count?'inert':''}><div class="neck-viewport" id="pilot-neck" ${this.positionsVisible&&!this.longString?'inert':''}><div data-layout-owned class="neck-inner" id="pilot-neck-inner">${this.diagram({reveal,target,discovery,family})}</div></div>${reveal?`<div class="pilot-legend">${m.pool.map(p=>`<span><strong>${esc(pitchLabel(p.midi,this.notation))}</strong> ${esc(spot(p,this.profile))}</span>`).join('')}</div>`:''}<div class="pilot-position-buttons" role="group" aria-label="Alternative tactile au manche">${this.longString?'':this.positionButtons()}</div></section><section class="answer-workspace" ${this.paused||this.count?'inert':''}><section class="question-copy"><h1>${esc(title)}</h1><p class="${practice&&q?.mode==='find'?'requested-string-label':''}">${esc(hint)}</p></section><section class="answer-area pilot-answer ${discovery?'is-discovery':''}">${body}</section></section></div>${this.paused?`<div class="pilot-pause-layer"><section class="pause-card" role="region" aria-label="Pause"><h2>Pause</h2><p>Vos premières réponses sont conservées.</p><button class="button primary" data-pilot-action="resume-pause">Reprendre</button><button class="button secondary" data-pilot-action="home">Retour au parcours</button></section></div>`:''}</main>`;
 }
 renderLaunch(){const elapsed=Math.min(1000,this.countClock.elapsed());return `<main id="main-content" tabindex="-1" class="launch-screen pilot-count ${this.paused?'is-paused':''}" aria-label="Préparation de l’exercice"><header class="launch-tools"><button class="icon-button on-dark" data-pilot-action="exit" aria-label="Quitter l’exercice">${this.host.icon('close')}</button><span></span><button class="icon-button on-dark" data-pilot-action="${this.paused?'resume-pause':'pause'}" aria-label="${this.paused?'Reprendre':'Mettre en pause'}">${this.host.icon('pause')}</button><button class="icon-button sound-toggle" data-pilot-action="mute" aria-label="${this.muted?'Activer':'Couper'} le son" aria-pressed="${this.muted}">${this.host.icon(this.muted?'mute':'sound')}</button></header><p class="launch-message" role="status" style="animation-delay:-${elapsed}ms;animation-play-state:${this.paused?'paused':'running'}">À vous de jouer !</p>${this.paused?`<div class="pilot-pause-layer"><section class="pause-card"><h2>Pause</h2><button class="button primary" data-pilot-action="resume-pause">Reprendre</button><button class="button secondary" data-pilot-action="home">Retour au parcours</button></section></div>`:''}</main>`;}
 renderIntroduction(){
  const help=this.introduction,points=DEMO_RULES.points(this.module,{question:this.demonstrationQuestion,kind:help.kind}),example=points[0]||this.module.pool[0],visual=['neck','find','family'].includes(help.kind)?miniatureNeck(this.profile,{id:'lesson',interactive:true,points,showNames:true,notation:this.notation,lesson:true,lastFret:this.zone.end,startFret:this.zone.start,activeString:this.module.strings?.length===1?this.module.strings[0]:null,label:'Exemple sur le manche'}):helpGraphic(help,{...this.module,demoQuestion:this.demonstrationQuestion,assessedQuestion:this.question,demoMelody:this.melody()},this.profile,this.notation),listen=['family','motif'].includes(help.kind);
  return `<main id="main-content" tabindex="-1" class="instruction-page"><header class="game-header"><button class="icon-button" data-pilot-action="home" aria-label="Retour au parcours">${this.host.icon('back')}</button><div><strong>${esc(this.module.title)}</strong></div><button class="icon-button sound-toggle" data-pilot-action="mute" aria-label="${this.muted?'Activer':'Couper'} le son" aria-pressed="${this.muted}">${this.host.icon(this.muted?'mute':'sound')}</button></header><section class="instruction-content"><div class="instruction-heading"><p class="new-exercise-label">Nouvel exercice !</p><h1>${esc(help.title)}</h1></div><div class="instruction-visual">${visual}${['neck','find','family'].includes(help.kind)?`<p class="discovery-direction" aria-live="polite">${this.lessonTrial?.key===help.key?esc(this.lessonTrial.text):'Touchez le manche pour essayer.'}</p>`:''}</div><div class="instruction-summary">${help.kind==='find'?`<p class="lesson-target">Exemple : ${esc(pitchLabel(example.midi,this.notation))} · corde ${this.profile.tuning.length-example.string}</p>`:''}${help.kind==='motif'&&this.melody()?`<p class="melody-attribution"><strong>${esc(this.melody().title)}</strong><small class="melody-passage">${esc(this.melody().section)}</small></p>`:''}${this.module.baseId==='opens'?`<div class="lesson-tuning-reminder"><small>Votre accordage · ${this.profile.tuning.every((n,i)=>!i||n>=this.profile.tuning[i-1])?'du grave à l’aigu':'cordes '+this.profile.tuning.length+' → 1'}</small><strong>${this.profile.tuning.map(n=>esc(pitchLabel(n,this.notation))).join(' · ')}</strong></div>`:''}<p>${esc(help.text)}</p></div></section><footer class="lesson-actions">${listen?`<button class="button secondary" data-pilot-action="help-listen" ${this.muted?'disabled':''}>Écouter</button>`:''}<button class="button primary" data-pilot-action="help-next">À moi d’essayer</button></footer></main>`;
 }
 wheel(){const exact=this.question?.answerKind==='pitch',choices=exact?[...new Set(this.module.pool.map(p=>p.midi))].sort((a,b)=>a-b):this.module.choices||NATURAL_PITCHES,altered=exact?[]:(choices.some(n=>!NATURAL_PITCHES.includes(n))||this.module.pool.some(p=>!NATURAL_PITCHES.includes(p.midi%12)))?[1,3,6,8,10]:[],rings=exact?[choices]:[NATURAL_PITCHES,...(altered.length?[altered]:[])],dual=altered.length>0,label=n=>exact?pitchLabel(n,this.notation):noteName(n,this.notation);
  return `<div class="answer-wheel pilot-wheel ${dual?'dual-wheel':''}" role="group" aria-label="${exact?'Choisir la hauteur de la note':'Choisir le nom de la note'}"><div class="wheel-orbit" aria-hidden="true"></div>${dual?'<div class="wheel-orbit outer" aria-hidden="true"></div>':''}${rings.flatMap((notes,ring)=>notes.map((n,i)=>{const order=ring?NATURAL_PITCHES.findIndex(pc=>pc===n-1)+.5:i,a=-Math.PI/2+order*2*Math.PI/(exact?notes.length:7),r=dual?(ring?25:40):38,x=50+r*Math.cos(a),y=50+r*Math.sin(a);return `<button data-pilot-action="note" data-note="${n}" style="left:${x}%;top:${y}%">${esc(label(n))}</button>${this.effects.filter(e=>e.mode==='name'&&performance.now()-e.at<this.effectLifetime(e)&&((exact?e.target.midi:e.target.midi%12)===n||!e.correct&&e.value===n)).map(e=>`<span aria-hidden="true" data-animation-owned class="wheel-echo ${!e.correct&&e.value===n?'wrong':''}" data-echo-id="${e.id}" style="left:${x}%;top:${y}%;${this.effectStyle(e)}">${esc(label(n))}</span>`).join('')}`;})).join('')}</div>`;
 }
 diagram({target=null,discovery=false}={}){
  const profile=this.profile,g=this.geometry,count=profile.tuning.length,q=this.question,demos=discovery?[...DEMO_RULES.points(this.module,{explored:this.session.explored||[]}),...(!this.feedback?.correct&&this.feedback?.position?[{...this.feedback.position,color:'var(--note-wrong)',wrong:true}]:[])]:[];
  return `<svg viewBox="0 0 ${g.width} ${g.height}" role="group" aria-label="Manche de ${count} cordes, ${this.zone.start?'cases '+this.zone.start+' à '+this.zone.end:'à vide jusqu’à la case '+this.zone.end}">${neckBase(profile,{g,id:'pilot',activeString:this.module.strings?.length===1?this.module.strings[0]:this.session.stage==='practice'&&q?.mode==='find'&&q.scope==='string'?q.target.string:null})}${this.session.stage==='practice'&&q?.mode==='find'&&q.scope==='string'?`<g class="requested-string" aria-hidden="true"><rect x="${g.openStart}" y="${g.ys[q.target.string]-6}" width="${g.width-g.openStart}" height="12" rx="4"/></g>`:''}${g.visibleStrings.flatMap(string=>g.visibleFrets.map(fret=>{const y=g.ys[string],x=g.centers[fret];
   const p={string,fret,midi:profile.tuning[string]+fret},demo=demos.find(d=>equal(d,p)),requested=this.session.stage==='practice'&&q?.mode==='name'&&equal(q.target,p),left=fret?g.frets[fret-1]:g.openStart,width=fret?g.frets[fret]-left:g.openWidth;
   return `<g data-view-key="cell-${string}-${fret}" class="fret-hit selectable" role="button" tabindex="${discovery&&this.session.discoveryDone?-1:0}" aria-disabled="${discovery&&this.session.discoveryDone?true:false}" data-pilot-string="${string}" data-pilot-fret="${fret}" aria-label="Corde ${count-string}, ${fret?'case '+fret:'à vide'}"><rect x="${left}" y="${Math.max(0,y-(g.visibleStrings.length===1?32:Math.abs(g.ys[0]-g.ys[1])/2))}" width="${width}" height="${Math.min(g.height-10,y+(g.visibleStrings.length===1?32:Math.abs(g.ys[0]-g.ys[1])/2))-Math.max(0,y-(g.visibleStrings.length===1?32:Math.abs(g.ys[0]-g.ys[1])/2))}" fill="transparent"/><circle class="keyboard-hint" cx="${x}" cy="${y}" r="4.5" fill="none" stroke="var(--neck-ink)" stroke-width="1"/>${demo||requested?`<circle class="pilot-marker ${demo?(demo.wrong?'tone-wrong':'tone-correct'):'tone-neutral'}" data-view-key="${requested?esc(q.id||'question'):'demo-'+string+'-'+fret}" cx="${x}" cy="${y}" r="3.8" fill="${demo?demo.color:'var(--note-neutral)'}"/>${demo&&!demo.wrong?this.noteTag(p,g):''}`:''}</g>`;
  })).join('')}${this.aids.includes('open-names')?this.stringOrder.map(string=>this.noteTag({string,fret:this.zone.start,midi:profile.tuning[string]+this.zone.start},g)).join(''):''}${this.echoMarkup(g)}</svg>`;
 }
 discoveryCounter(){const total=this.module.focus.length,found=this.module.focus.filter(p=>(this.session.explored||[]).includes(positionKey(p))).length;return `<div class="discovery-progress" role="status"><strong>${found}<span> / ${total}</span></strong><span>${found===total?'Tous retrouvés !':'emplacements à retrouver'}</span><progress max="${total}" value="${found}" aria-label="${found} emplacements retrouvés sur ${total}"></progress></div>`;}
 noteTag(p,g,color='var(--neck-ink)'){return noteTagSVG(p,g,this.notation,color);}
 positionButtons(){if(this.session.stage==='practice'&&this.question?.mode==='name')return '';
 const disabled=this.session.stage==='discovery'&&this.session.discoveryDone;
 return `<div class="position-toggle-slot"><button class="text-button" data-pilot-action="toggle-positions" aria-expanded="${this.positionsVisible}" aria-controls="position-grid-panel">${this.positionsVisible?'Masquer les boutons de réponse':'Boutons de réponse'}</button></div><div id="position-grid-panel" class="position-grid-panel" ${this.positionsVisible?'':'hidden'}><div class="position-grid"><div class="position-grid-heading" aria-hidden="true"><span></span>${this.frets.map(f=>`<span>${f||'À vide'}</span>`).join('')}</div>${this.stringOrder.map(string=>`<div class="position-grid-row"><span class="position-string">${this.profile.tuning.length-string}${this.aids.includes('open-names')?`<b>${esc(pitchLabel(this.profile.tuning[string]+this.zone.start,this.notation))}</b>`:''}</span>${this.frets.map(f=>`<button ${disabled?'disabled':''} data-pilot-action="position" data-string="${string}" data-fret="${f}" aria-label="Corde ${this.profile.tuning.length-string}, ${f?'case '+f:'à vide'}">${f||'À vide'}</button>`).join('')}</div>`).join('')}</div></div>`;
 }
 orientationSuggestion(){return this.longString?`<aside class="orientation-suggestion"><span aria-hidden="true">↻</span><span>Touchez le manche, ou ouvrez les boutons. Plus confortable à l’horizontale.</span></aside>`:'';}
 longPositionButtons(){
  const string=this.module.strings[0],disabled=this.session.stage==='discovery'&&this.session.discoveryDone,visible=this.positionsVisible;
  return `<div class="long-position-controls"><button class="text-button" data-pilot-action="toggle-positions" aria-expanded="${visible}" aria-controls="long-position-pad">${visible?'Masquer les boutons de réponse':'Boutons de réponse'}</button><div class="long-position-pad" id="long-position-pad" role="group" aria-label="Choisir une case" ${visible?'':'hidden'}>${this.frets.map(f=>`<button class="position-pad-button" data-pilot-action="position" data-string="${string}" data-fret="${f}" ${disabled?'disabled':''}>${f||'À vide'}</button>`).join('')}</div></div>`;
 }
 async toggleReward(){if(this.rewardPlaying){this.rewardEpoch=(this.rewardEpoch||0)+1;this.host.stopAudio();this.rewardPlaying=false;this.emit();return;}const reward=rewardFor(this.melody());if(!reward||this.muted)return;const epoch=this.rewardEpoch=(this.rewardEpoch||0)+1;this.rewardPlaying=true;this.emit();const started=await this.host.playArrangement(reward);if(epoch!==this.rewardEpoch)return;if(!started){this.rewardPlaying=false;this.emit();return;}setTimeout(()=>{if(epoch===this.rewardEpoch){this.rewardPlaying=false;if(this.session?.stage==='result')this.emit();}},reward.durationMs);}
 startErrorReview(){const s=this.session,pool=[...new Map(s.events.filter(e=>!e.retry&&!e.correct).map(e=>[positionKey(e.target),e.target])).values()];if(!pool.length)return;this.pendingReview={pool,source:s.activity};try{this.start(this.module.mode==='find'?'review-targeted-find':'review-targeted');}finally{this.pendingReview=null;}}
 async shareCurrentResult(){if(this.sharing)return;this.sharing=true;this.resultNotice='';const button=document.querySelector('[data-pilot-action="share-result"]');if(button)button.disabled=true;try{const s=this.session,status=await shareResult({title:this.module.title,subtitle:this.module.subtitle,profileLabel:this.profile.label,metrics:resultMetrics(s.events),stars:score(s.events.filter(e=>!e.retry)).stars});this.resultNotice=status==='downloaded'?'Image du résultat téléchargée.':'';}catch(error){if(error.name!=='AbortError')this.resultNotice=error.message||'Partage indisponible.';}finally{this.sharing=false;const el=document.querySelector('.result-notice');if(el){el.textContent=this.resultNotice;el.classList.toggle('visually-hidden',!this.resultNotice);if(this.resultNotice)setTimeout(()=>{el.textContent='';el.classList.add('visually-hidden');},3500);}const b=document.querySelector('[data-pilot-action="share-result"]');if(b)b.disabled=false;}}
 unlockedCards(){
  const awards=this.session?.newAchievements||[];if(!awards.length)return [];
  const key=this.session.id+':'+JSON.stringify(this.notation);
  if(this.unlockCache?.key!==key){const context=achievementContext({profile:this.profile,catalog:this.catalog,data:this.data,existing:this.store.achievements,notation:this.notation});this.unlockCache={key,cards:awards.map(u=>context.definitions.find(d=>d.id===u.id&&d.scopeKey===u.scope)).filter(Boolean)};}
  return this.unlockCache.cards;
 }
 result(){if(this.resultView==='details')return this.resultDetails();const s=this.session,first=s.events.filter(e=>!e.retry),result=activityResult(first,s.queue.length),metrics=resultMetrics(first),stars=score(first).stars,index=this.activities.findIndex(m=>m.id===s.activity),next=index>=0?this.activities[index+1]:null,record=personalRecord(s,[...this.data.attempts,...Object.values(this.data.evidence?.records||{}).flat()].filter((a,i,all)=>all.findIndex(b=>b.id===a.id)===i)),wrong=metrics.total-metrics.correct,badge=record.kind==='accuracy'?'Nouveau record de précision':record.kind==='speed'?'Nouveau record de fluidité':record.kind==='first'?'Premier essai enregistré':record.previous?`Votre record : ${Math.round(record.previous.accuracy*100)} % · ${seconds(record.previous.meanMs)}`:'',title=metrics.accuracy===1?'Sans faute !':result.passed?'Bien joué !':'Encore un petit effort',primary=result.passed?(next?`<button class="button primary" data-pilot-action="next-learning">Exercice suivant ${this.host.icon('arrow')}</button>`:`<button class="button primary" data-pilot-action="home">Mon parcours ${this.host.icon('arrow')}</button>`):`<button class="button primary" data-pilot-action="start" data-module="${esc(s.activity)}">Réessayer ${this.host.icon('replay')}</button>`;
 return `<main id="main-content" tabindex="-1" class="result-card compact-result redesigned-result result-enter"><header class="result-heading"><div><h1 tabindex="-1">${esc(this.module.title)}</h1><p>${esc(this.module.subtitle||'')}</p></div><button class="icon-button result-share" data-pilot-action="share-result" aria-label="Partager mon résultat" title="Partager mon résultat">${this.host.icon('share')}</button></header><div class="result-layout"><section class="result-summary-panel"><div class="result-status"><span class="result-status-pill ${result.passed?'is-passed':'is-learning'}">${result.passed?'Exercice réussi':'À retravailler'}</span><h2>${title}</h2></div><div class="result-score-block"><div class="score-display"><strong>${metrics.correct}<span> / ${metrics.total}</span></strong><small>bonnes réponses</small></div><div class="score-details"><span class="stars" aria-label="${stars} étoiles sur 5">${Array.from({length:5},(_,i)=>`<span class="${i<stars?'earned':''}">★</span>`).join('')}</span></div></div><div class="result-stat-grid"><div><span class="result-stat-label">Précision</span><strong>${Math.round(metrics.accuracy*100)}<small> %</small></strong></div><div title="Temps moyen des premières réponses correctes"><span class="result-stat-label">Temps moyen</span><strong>${seconds(metrics.meanMs)}</strong></div></div><p class="result-record ${['accuracy','speed'].includes(record.kind)?'is-record':''}">${['accuracy','speed'].includes(record.kind)?'<span aria-hidden="true">🏆</span> ':''}${badge}</p></section><section class="result-action-panel">${renderAchievementUnlock(this.unlockedCards(),this.unlockIndex,this.host.icon)}${this.module.mode==='find'&&rewardFor(this.melody())?`<div class="reward-listen"><span><strong>Votre morceau en musique</strong><small>${esc(this.melody().title)} · tonalité originale</small></span><button class="button quiet-button compact" data-pilot-action="reward" aria-label="${this.rewardPlaying?'Arrêter':'Écouter'} ${esc(this.melody().title)}" title="${this.rewardPlaying?'Arrêter':'Écouter le morceau'}" ${this.muted?'disabled':''}>${this.host.icon(this.rewardPlaying?'pause':'play')}<span class="reward-button-label">${this.rewardPlaying?'Arrêter':'Écouter'}</span></button></div>`:''}<div class="result-actions">${primary}<div class="result-secondary-actions">${result.passed?`<button class="button quiet-button compact" data-pilot-action="start" data-module="${esc(s.activity)}">${this.host.icon('replay')} Refaire</button>`:''}${!result.passed||next?`<button class="button quiet-button compact" data-pilot-action="home">${this.host.icon('home')} Mon parcours</button>`:''}</div></div><button class="button quiet-button result-details-button" data-pilot-action="result-details"><span><strong>${wrong?'Comprendre mes erreurs':'Voir mes réponses'}</strong><small>${wrong?`${wrong} réponse${wrong>1?'s':''} à revoir`:'Tous les repères de cet exercice'}</small></span>${this.host.icon('arrow')}</button><p class="result-notice visually-hidden" role="status">${esc(this.resultNotice||'')}</p></section></div></main>`;}
 resultDetails(){const s=this.session,mistakes=mistakeGroups(s.events),metrics=resultMetrics(s.events);return `<main id="main-content" tabindex="-1" class="result-details-view panel-enter"><header><button class="icon-button" data-pilot-action="result-summary" aria-label="Retour au résultat">${this.host.icon('back')}</button><div><h1 tabindex="-1">${mistakes.length?'Vos notes à revoir':'Toutes les réponses sont justes !'}</h1><p>${esc(this.module.title)} · ${metrics.correct} / ${metrics.total}</p></div></header><section class="result-error-list">${mistakes.length?mistakes.map(e=>`<article class="mistake-card"><h2>${esc(pitchLabel(e.target.midi,this.notation))} <small>· corde ${this.profile.tuning.length-e.target.string}, ${e.target.fret?"case "+e.target.fret:"à vide"}</small></h2>${mistakeGraphic(e,this.profile,this.notation)}<p class="mistake-chosen">Votre réponse : ${esc(chosenLabel(e,this.profile,this.notation))}</p><p class="mistake-expected">À retrouver : ${esc(pitchLabel(e.target.midi,this.notation))}, corde ${this.profile.tuning.length-e.target.string}, ${e.target.fret?"case "+e.target.fret:"à vide"}</p>${e.count>1?`<small>${e.count} erreurs de ce type.</small>`:''}</article>`).join(''):`<p>Vous avez reconnu tous les repères de cet exercice.</p><div class="correct-recap">${[...new Map(s.events.map(e=>[positionKey(e.target),e.target])).values()].map(p=>`<span>${esc(pitchLabel(p.midi,this.notation))} · corde ${this.profile.tuning.length-p.string}, ${p.fret?"case "+p.fret:"à vide"}</span>`).join('')}</div>`}</section><footer>${mistakes.length?'<button class="button primary" data-pilot-action="review-errors">Revoir ces notes</button>':''}<button class="button quiet-button" data-pilot-action="result-summary">Retour au résultat</button></footer></main>`;}
 layout(){
  document.querySelectorAll('.instruction-content .shared-neck,.result-details-view .shared-neck').forEach(svg=>layoutMiniature(svg,this.profile));
  const viewport=document.querySelector('#pilot-neck'),inner=document.querySelector('#pilot-neck-inner');if(!viewport||!inner||!this.session)return;
  const game=document.querySelector('.pilot-game'),body=document.querySelector('.game-body'),stage=document.querySelector('.pilot-response-stage');
  if(game&&body)game.style.setProperty('--pause-top',`${body.offsetTop}px`);
  if(stage){const size=Math.max(window.innerHeight<=360?148:156,Math.min(420,stage.clientWidth-4,stage.clientHeight-4));game.style.setProperty('--wheel-size',`${size}px`);game.style.setProperty('--note-size',`${Math.max(44,Math.min(56,size*.2))}px`);}
  if(Math.abs((this.longNeckWidth||0)-viewport.clientWidth)>2||Math.abs((this.neckCrossHeight||0)-viewport.clientHeight)>2){this.longNeckWidth=viewport.clientWidth;this.neckCrossHeight=viewport.clientHeight;this.emit();return;}
  const g=this.geometry,long=viewport.clientWidth,cross=viewport.clientHeight,fit=fitNeck(g,long,cross),{scale,width,height}=fit;
  inner.style.width=`${width}px`;inner.style.height=`${height}px`;inner.style.transform=`translate(${(long-width)/2}px,${(cross-height)/2}px)`;
  inner.querySelectorAll('.pilot-axis-string,.pilot-axis-fret').forEach(t=>t.style.fontSize=`${14/scale}px`);inner.querySelectorAll('.pilot-axis-string,.pilot-axis-fret').forEach(t=>t.style.fontWeight='750');
  inner.querySelectorAll('.pilot-marker,.echo-dot').forEach(point=>point.setAttribute('r',Math.max(3.8,8/scale)));
  layoutNoteTags(inner.querySelector('svg'),g);viewport.dataset.limit='0';

 }
}
