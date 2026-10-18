import {validateAchievements} from './achievement-data.js';
/** Phase-3 pilot: configuration-derived activities and first-response evidence. */
import {CURRICULUM_RULES} from './curriculum-rules.js';
import {positions,noteName,pitchLabel,makeProfile} from './core.js';
export const PILOT_VERSION=3;
export const PASS_ACCURACY=.9;
export function activityResult(events,expected){const first=events.filter(e=>!e.retry),correct=first.filter(e=>e.correct).length,required=Math.ceil(expected*PASS_ACCURACY);return {correct,total:first.length,required,passed:first.length>=expected&&correct>=required};}
export const NATURAL_PITCHES=CURRICULUM_RULES.naturals;
export const positionKey=p=>`${p.string}:${p.fret}`;
export const isNatural=midi=>NATURAL_PITCHES.includes(midi%12);
const unique=list=>[...new Map(list.map(p=>[positionKey(p),p])).values()];
const at=(profile,string,fret)=>({string,fret,midi:profile.tuning[string]+fret});
export function pilotPlan(profile,{notation='international',zone={start:0,end:4}}={}){
 zone=CURRICULUM_RULES.zone(zone);const frets=Array.from({length:zone.end-zone.start+1},(_,i)=>i+zone.start),all=positions(profile,profile.tuning.map((_,s)=>s),frets),natural=all.filter(p=>isNatural(p.midi)),opens=profile.tuning.map((_,s)=>at(profile,s,0)),altered=opens.filter(p=>!isNatural(p.midi)),root=opens.reduce((a,b)=>b.midi<a.midi?b:a),modules=[];
 const choices=pool=>[...new Set([...NATURAL_PITCHES,...pool.map(p=>p.midi%12)])].sort((a,b)=>a-b);
 let learned=zone.start===0?[...opens]:[];
 if(zone.start===0)modules.push({id:'opens',kind:'opens',subject:'Les cordes à vide',title:'Les cordes à vide',pool:opens,focus:opens,newPositions:opens,choices:choices(opens),description:'Touchez les cordes avant le sillet : ce sont les cordes à vide.',zone});
 const order=CURRICULUM_RULES.familyOrder(profile,all);
 for(const pc of order){
  const family=all.filter(p=>p.midi%12===pc),name=noteName(pc,notation),id='note-'+pc;
  modules.push({id,kind:'family',pitchClass:pc,subject:'La note '+name,title:'La note '+name,pool:family,focus:family,newPositions:family,choices:choices(family),zone,description:`Repérez tous les ${name} dans cette zone. Le chiffre indique la hauteur de la note.`});
  learned=unique([...learned,...family]);
  const naturalEnd=pc===order.filter(n=>NATURAL_PITCHES.includes(n)).at(-1),fullEnd=pc===order.at(-1),subject=fullEnd?'Toutes les notes naturelles et altérées':naturalEnd?'Toutes les notes naturelles':name+' et vos repères';
  modules.push({id:'mix-'+pc,kind:'mix',pitchClass:pc,subject,title:subject,pool:[...learned],focus:family,newPositions:family,choices:choices(learned),zone,skipDiscovery:true,description:`Mélangez les ${name} avec les notes déjà rencontrées.`});
 }
 return {root,opens,natural,all,modules,compatible:true,reason:'',altered,learned,unavailable:[],order,zone};
}
export function shuffled(list,random=Math.random){const out=[...list];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function practiceActivities(plan){return plan.modules.filter(m=>m.pool.length).flatMap(m=>['name','find'].map(mode=>({...m,practicePool:m.pool,newPositions:m.newPositions||m.focus,baseId:m.id,id:mode==='name'?m.id:m.id+'-find',mode,title:m.subject||m.title,subtitle:(mode==='name'?'Nommer':'Retrouver')+(m.kind==='opens'?' les cordes':m.kind==='mix'?' les notes mélangées':' les positions')})));}
export function questionsFor(module,{diagnostic=false,random=Math.random,mode=module.mode||'name'}={}){
 const ordered=unique(module.practicePool||[...module.focus,...module.pool]);if(!ordered.length)return [];
 const count=Math.max(CURRICULUM_RULES.minQuestions,Math.min(module.kind==='recall'?30:CURRICULUM_RULES.maxQuestions,ordered.length*3));
 const fresh=unique(module.newPositions||module.focus).filter(p=>ordered.some(q=>positionKey(p)===positionKey(q))),old=ordered.filter(p=>!fresh.some(q=>positionKey(p)===positionKey(q)));
 const take=(pool,n)=>{const out=[];while(out.length<n)out.push(...shuffled(pool,random).slice(0,n-out.length));return out;};
 // Guarantee coverage before shuffling; a probabilistic weight alone cannot guarantee 20% in one session.
 const freshCount=fresh.length&&old.length?Math.min(count,Math.max(fresh.length,Math.ceil(count*CURRICULUM_RULES.newFamilyShare)+Math.floor(random()*(Math.floor(count*.4)-Math.ceil(count*CURRICULUM_RULES.newFamilyShare)+1)))):fresh.length?count:0;
 const targets=shuffled([...take(fresh,freshCount),...take(old.length?old:ordered,count-freshCount)],random);
 return targets.map((p,i)=>({id:`${module.id}:${positionKey(p)}:${mode}:${i}`,mode,answerKind:mode==='name'&&module.kind==='family'?'pitch':'class',target:p,scope:mode==='find'&&module.kind==='opens'?'height':'string',zone:module.zone||{start:0,end:4},allowedFrets:mode==='find'&&['opens','tuning'].includes(module.kind)?[0]:undefined,evaluation:diagnostic||module.kind==='recall',retry:false}));
}
export function admissiblePositions(profile,question){
 const zone=question.zone||{start:0,end:4},all=positions(profile,profile.tuning.map((_,s)=>s),Array.from({length:zone.end-zone.start+1},(_,i)=>zone.start+i));
 return all.filter(p=>(!question.allowedFrets||question.allowedFrets.includes(p.fret))&&p.midi%12===question.target.midi%12&&(question.scope!=='string'||p.string===question.target.string)&&(question.scope!=='height'||p.midi===question.target.midi));
}
export function pilotCorrect(profile,q,value){
 if(q.mode==='name')return Number.isInteger(value)&&value===(q.answerKind==='pitch'?q.target.midi:q.target.midi%12);
 return value&&admissiblePositions(profile,q).some(p=>p.string===value.string&&p.fret===value.fret);
}
export function correction(profile,q,value,notation='international'){
 const target=q.target,name=noteName(target.midi,notation),spot=`corde ${profile.tuning.length-target.string}, ${target.fret===0?'à vide':`case ${target.fret}`}`;
 if(q.mode==='find'&&value&&Number.isInteger(value.string)&&Number.isInteger(value.fret)){
  const midi=profile.tuning[value.string]+value.fret;
  if(midi%12===target.midi%12&&q.allowedFrets&&!q.allowedFrets.includes(value.fret))return `Le nom est juste, mais cette consigne demande une corde à vide, sans appuyer sur une case.`;
  if(midi%12===target.midi%12)return `C’est bien ${name}, mais la consigne précise ${spot}. Le même nom peut se retrouver ailleurs.`;
  if(value.string!==target.string)return `La corde change le point de départ. Ici ${name} se trouve ${spot} ; votre toucher donne ${noteName(midi,notation)}.`;
  if(Math.abs(value.fret-target.fret)===1)return `${name} se trouve juste à côté, ${spot}.`;
 }
 const pc=Number.isInteger(value)?value:null;
 if(pc!==null&&[1,11].includes((pc-target.midi%12+12)%12))return `${name} se trouve ${spot}. Retrouvez ce repère après d’autres notes.`;
 return `La réponse est ${name}, ${spot}. La corde à vide donne ${noteName(profile.tuning[target.string],notation)} : utilisez ce départ pour reconstruire le repère, puis essayez sans compter.`;
}
export function parseNoteAnswer(text){
 const value=String(text).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'');
 const match=/^(do|re|mi|fa|sol|la|si|[a-g])([#♯b♭]?)$/.exec(value);if(!match)return null;
 const base={c:0,d:2,e:4,f:5,g:7,a:9,b:11,do:0,re:2,mi:4,fa:5,sol:7,la:9,si:11}[match[1]],delta=['#','♯'].includes(match[2])?1:['b','♭'].includes(match[2])?-1:0;
 return (base+delta+12)%12;
}
export function firstSummary(events){
 const first=events.filter(e=>!e.retry);
 return Object.fromEntries(['name','find'].map(mode=>{const list=first.filter(e=>e.mode===mode);return [mode,{total:list.length,correct:list.filter(e=>e.correct).length,unaided:list.filter(e=>e.correct&&!e.aids.length).length}];}));
}
export function naturalDiagnostic(profile,mode='name'){const pool=pilotPlan(profile).natural;return {id:mode==='name'?'natural-diagnostic':'natural-diagnostic-find',mode,baseId:'natural-diagnostic',kind:'recall',title:'Les notes naturelles',subtitle:mode==='name'?'Nommer les notes':'Retrouver les notes',pool,focus:pool,description:'Toutes les positions naturelles sont vérifiées dans les deux sens, sans son ni indice avant la réponse. Le test peut être interrompu et repris.'};}
export function initialPilotStore(){return {version:PILOT_VERSION,profiles:{},achievements:[]};}
const finiteTime=x=>Number.isFinite(x)&&x>=0;
const validPosition=(p,profile)=>p&&Number.isInteger(p.string)&&p.string>=0&&p.string<profile.tuning.length&&Number.isInteger(p.fret)&&p.fret>=0&&p.fret<=4&&p.midi===profile.tuning[p.string]+p.fret;
export function validatePilotStore(value){
 if(!value||value.version!==PILOT_VERSION||!value.profiles||typeof value.profiles!=='object'||Array.isArray(value.profiles)||Object.keys(value.profiles).length>50)throw new Error('Sauvegarde du pilote invalide.');
 const profiles={};
 for(const [key,data] of Object.entries(value.profiles)){
  if(!data||!data.profile)throw new Error('Profil du pilote invalide.');
  const profile=makeProfile(data.profile.instrumentId,data.profile.tuning?.map(n=>{if(!Number.isInteger(n))throw new Error('Accordage invalide.');return `${['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][n%12]}${Math.floor(n/12)-1}`;}).join(' '));
  if(key!==profile.key||!Array.isArray(data.attempts)||data.attempts.length>1000||!Array.isArray(data.later)||data.later.length>200)throw new Error('Historique du pilote invalide.');
  if(data.seenInstructions!==undefined&&(!Array.isArray(data.seenInstructions)||data.seenInstructions.length>300||!data.seenInstructions.every(k=>typeof k==='string'&&/^[a-z0-9-]{1,60}$/.test(k))))throw new Error('Introductions enregistrées invalides.');
  if(data.discoveredModules!==undefined&&(!Array.isArray(data.discoveredModules)||data.discoveredModules.length>100||!data.discoveredModules.every(k=>typeof k==='string'&&/^[a-z0-9-]{1,60}$/.test(k))))throw new Error('Découvertes enregistrées invalides.');
  const validAids=a=>Array.isArray(a)&&a.every(v=>['labels','listen','course','open-names'].includes(v));
  const validEvent=e=>e&&['name','find'].includes(e.mode)&&validPosition(e.target,profile)&&typeof e.correct==='boolean'&&validAids(e.aids)&&finiteTime(e.ms)&&finiteTime(e.at)&&typeof e.retry==='boolean';
  for(const a of data.attempts)if(!a||typeof a.id!=='string'||typeof a.activity!=='string'||!/^[a-z0-9-]{1,100}$/.test(a.activity)||a.comparisonKey!==undefined&&(typeof a.comparisonKey!=='string'||a.comparisonKey.length>2000)||!finiteTime(a.at)||!Array.isArray(a.events)||a.events.length>30||!a.events.every(validEvent))throw new Error('Tentative du pilote invalide.');
  for(const q of data.later)if(!q||!['name','find'].includes(q.mode)||!validPosition(q.target,profile))throw new Error('Révision du pilote invalide.');
  if(data.session){
   const s=data.session;
   if(s.familyOrder!==undefined&&(!Array.isArray(s.familyOrder)||!s.familyOrder.length||s.familyOrder.length>7||new Set(s.familyOrder).size!==s.familyOrder.length||!s.familyOrder.every(pc=>NATURAL_PITCHES.includes(pc))))throw new Error('Ordre des familles invalide.');
   if(s.reviewSource!==undefined&&(typeof s.reviewSource!=='string'||!/^[a-z0-9-]{1,100}$/.test(s.reviewSource)))throw new Error('Source de révision invalide.');
   if(s.currentAids!==undefined&&!validAids(s.currentAids)||s.feedback!==undefined&&s.feedback!==null&&(typeof s.feedback.correct!=='boolean'||typeof s.feedback.text!=='string'||s.feedback.text.length>2000)||s.nameDraft!==undefined&&(typeof s.nameDraft!=='string'||s.nameDraft.length>40)||s.reviewPool!==undefined&&(!Array.isArray(s.reviewPool)||s.reviewPool.length>40||!s.reviewPool.every(p=>validPosition(p,profile))))throw new Error('État de reprise invalide.');
   if(typeof s.id!=='string'||typeof s.activity!=='string'||!Array.isArray(s.queue)||s.queue.length>30||!s.queue.every(q=>q&&['name','find'].includes(q.mode)&&validPosition(q.target,profile)&&['string','any','height'].includes(q.scope)&&(!q.allowedFrets||Array.isArray(q.allowedFrets)&&q.allowedFrets.every(f=>Number.isInteger(f)&&f>=0&&f<=4)))||!Number.isInteger(s.index)||s.index<0||s.index>s.queue.length||!Array.isArray(s.events)||!s.events.every(validEvent)||s.events.length>30||!Number.isInteger(s.motifIndex)||s.motifIndex<0||s.motifIndex>100||s.activeMs!==undefined&&(!finiteTime(s.activeMs)||s.activeMs>86_400_000)||!['discovery','practice','motif','result'].includes(s.stage))throw new Error('Séance du pilote invalide.');
  }
  profiles[key]={...data,profile,attempts:data.attempts.slice(-1000),later:data.later.slice(-200)};
 }
 return {version:PILOT_VERSION,profiles,achievements:validateAchievements(value.achievements)};
}
