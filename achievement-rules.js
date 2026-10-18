/** Immutable catalogue + pure evidence evaluator. No clock, DOM, audio or storage access. */
import {MUSIC_ARRANGEMENT_VERSION,musicChecked} from './music-audit.js';
import {activityResult} from './pilot.js';
import {resultMetrics,personalRecord} from './results.js';
export const ACHIEVEMENT_VERSION=1;
export const ACHIEVEMENTS=Object.freeze([
 {id:'open-strings',category:'landmarks',title:'Mes premières cordes',criterion:'Réussir « Nommer les cordes » et « Retrouver les cordes » à 90 % ou plus.',symbol:'≋'},
 {id:'first-family',category:'landmarks',title:'Une famille bien repérée',criterion:'Réussir une famille seule et son mélange, en nommant et en retrouvant les positions.',symbol:'◉'},
 {id:'natural-map',category:'landmarks',title:'Mes notes naturelles',criterion:'Réussir le dernier mélange naturel dans les deux sens, sans aide, avec au moins 10 positions différentes par activité.',symbol:'♮'},
 {id:'full-map',category:'landmarks',title:'Ma première carte complète',criterion:'Réussir le dernier mélange de la zone dans les deux sens, sans aide, avec au moins 10 positions différentes par activité.',symbol:'▦'},
 {id:'clean-session',category:'landmarks',title:'Sans faute, sans aide',criterion:'Réussir au moins 20 premières réponses consécutives sans erreur ni indice dans un exercice.',symbol:'✓'},
 {id:'first-chain',category:'landmarks',title:'Une suite d’un trait',criterion:'Terminer une suite musicale. Une erreur remet la suite à zéro ; les essais précédents restent permis.',symbol:'♪'},
 {id:'personal-fluidity',category:'fluency',title:'Plus fluide, ici',criterion:'Battre son temps moyen, à précision au moins égale, sur ce même exercice et ce même instrument, sans aide.',symbol:'↗'},
 {id:'one-second',category:'fluency',title:'Du regard au réflexe',criterion:'Au moins 20 réponses, 100 % justes, sans aide, en 1 seconde de moyenne ou moins.',symbol:'ϟ'},
 {id:'first-sleeve',category:'music',title:'Ma première pochette',criterion:'Terminer la suite d’un morceau pour ajouter sa phrase accompagnée à la collection.',symbol:'♫',scope:'global'},
 {id:'three-sleeves',category:'music',title:'Une petite discothèque',criterion:'Collectionner trois phrases de morceaux différents.',symbol:'▣',scope:'global'}
].map(d=>Object.freeze({...d,version:1,scope:d.scope||'profile'})));
export const collectionScope=(profile,zone={start:0,end:4})=>`${profile.key}@${zone.start}-${zone.end}`;
const unaided=a=>a.events.length>=20&&a.events.every(e=>!e.retry&&!e.aids?.length);
const passed=a=>a.finished===true&&a.events.length>=20&&activityResult(a.events,a.events.length).passed;
const coverage=a=>new Set(a.events.map(e=>`${e.target.string}:${e.target.fret}`)).size>=10;
export function evaluateAchievements({profile,plan,attempts,entry,existing=[]}){
 const scope=collectionScope(profile,plan.zone),fresh=[],known=new Set(existing.map(u=>`${u.scope}:${u.id}`));
 function award(id,proofs,extra={},global=false){const key=global?'global':scope;if(known.has(`${key}:${id}`))return;known.add(`${key}:${id}`);fresh.push({id,scope:key,version:1,at:entry.at,profileKey:profile.key,zone:{...plan.zone},proofs:proofs.map(p=>p.id),evidence:proofs.map(p=>{const m=resultMetrics(p.events);return {attempt:p.id,activity:p.activity,at:p.at,total:m.total,correct:m.correct,meanMs:m.meanMs,aidedResponses:p.events.filter(e=>e.aids?.length).length,positions:new Set(p.events.map(e=>`${e.target.string}:${e.target.fret}`)).size,motifCompleted:!!p.motifCompleted};}),...extra});}
 const successes=attempts.filter(passed);
 const pair=(base,strict=false)=>[base,base+'-find'].map(id=>successes.find(a=>a.activity===id&&(!strict||unaided(a)&&coverage(a))));
 const opens=pair('opens');if(opens.every(Boolean))award('open-strings',opens);
 for(const pc of plan.order){const set=[...pair('note-'+pc),...pair('mix-'+pc)];if(set.every(Boolean)){award('first-family',set);break;}}
 const lastNatural=plan.order.filter(pc=>[0,2,4,5,7,9,11].includes(pc)).at(-1);
 for(const [id,pc]of [['natural-map',lastNatural],['full-map',plan.order.at(-1)]]){const set=pair('mix-'+pc,true);if(set.every(Boolean))award(id,set);}
 if(passed(entry)&&unaided(entry)&&entry.events.every(e=>e.correct))award('clean-session',[entry]);
 if(entry.finished===true&&entry.events.length>=20&&entry.motifCompleted)award('first-chain',[entry]);
 if(passed(entry)&&unaided(entry)){
  const comparable=attempts.filter(a=>a.id!==entry.id&&unaided(a));
  if(personalRecord(entry,comparable).kind==='speed')award('personal-fluidity',[entry]);
  const m=resultMetrics(entry.events);if(m.accuracy===1&&m.meanMs!==null&&m.meanMs<=1000)award('one-second',[entry]);
 }
 if(entry.finished===true&&entry.events.length>=20&&entry.motifCompleted&&entry.melodyId&&musicChecked(entry.melodyId)&&entry.music&&Number.isFinite(entry.music.shift)){
  award('music-'+entry.melodyId,[entry],{musicId:entry.melodyId,shift:entry.music.shift,activity:entry.activity,arrangementVersion:MUSIC_ARRANGEMENT_VERSION},true);
  award('first-sleeve',[entry],{},true);
 }
 const records=[...existing,...fresh].filter(u=>u.scope==='global'&&u.musicId);
 if(new Set(records.map(u=>u.musicId)).size>=3)award('three-sleeves',[entry],{},true);
 return fresh;
}
export function achievementProgress(def,attempts,plan,obtained,unlocks=[]){
 if(obtained)return {value:1,max:1,label:'Obtenu'};
 const success=attempts.filter(passed),ids=new Set(success.map(a=>a.activity));
 if(def.id==='open-strings'){const n=['opens','opens-find'].filter(id=>ids.has(id)).length;return {value:n,max:2,label:`${n} / 2 activités`};}
 if(def.id==='first-family'){const n=Math.max(0,...plan.order.map(pc=>['note-'+pc,'note-'+pc+'-find','mix-'+pc,'mix-'+pc+'-find'].filter(id=>ids.has(id)).length));return {value:n,max:4,label:`${n} / 4 activités pour une famille`};}
 if(['natural-map','full-map'].includes(def.id)){const pc=def.id==='natural-map'?plan.order.filter(pc=>[0,2,4,5,7,9,11].includes(pc)).at(-1):plan.order.at(-1),n=['mix-'+pc,'mix-'+pc+'-find'].filter(id=>success.some(a=>a.activity===id&&unaided(a)&&coverage(a))).length;return {value:n,max:2,label:`${n} / 2 validations sans aide`};}
 if(def.id==='three-sleeves'){const n=new Set(unlocks.filter(u=>u.musicId).map(u=>u.musicId)).size;return {value:Math.min(3,n),max:3,label:`${n} / 3 phrases différentes`};}
 return {value:0,max:1,label:'À découvrir'};
}
