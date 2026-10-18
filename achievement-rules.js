/** Immutable catalogue + pure evidence evaluator. No clock, DOM, audio or storage access. */
import {MUSIC_ARRANGEMENT_VERSION,musicChecked} from './music-audit.js';
import {activityResult} from './pilot.js';
import {resultMetrics,personalRecord} from './results.js';
export const ACHIEVEMENT_VERSION=1;
export const ACHIEVEMENTS=Object.freeze([
 {id:'open-strings',category:'landmarks',title:'Les présentations sont faites',criterion:'Réussir « Nommer les cordes » et « Retrouver les cordes » à 90 % ou plus.',symbol:'≋'},
 {id:'first-family',category:'landmarks',title:'Réunion de famille',criterion:'Réussir les activités de nomination et de recherche d’une famille, avec son mélange aux repères précédents.',symbol:'◉'},
 {id:'natural-map',category:'landmarks',title:'Le naturel revient au galop',criterion:'Réussir le dernier mélange naturel dans les deux sens, sans aide, avec au moins 10 positions différentes par activité.',symbol:'♮'},
 {id:'full-map',category:'landmarks',title:'Le manche dans la poche',criterion:'Réussir le dernier mélange de la zone dans les deux sens, sans aide, avec au moins 10 positions différentes par activité.',symbol:'▦'},
 {id:'clean-session',category:'landmarks',title:'Zéro accroc',criterion:'Réussir au moins 20 premières réponses consécutives sans erreur ni indice dans un exercice.',symbol:'✓'},
 {id:'first-chain',category:'landmarks',title:'Le fil du riff',criterion:'Terminer une suite musicale. Une erreur remet la suite à zéro ; les essais précédents restent permis.',symbol:'♪'},
 {id:'personal-fluidity',category:'fluency',title:'Mon record prend la fuite',criterion:'Battre son temps moyen, à précision au moins égale, sur ce même exercice et ce même instrument, sans aide.',symbol:'↗'},
 {id:'one-second',category:'fluency',title:'Éclair de manche',criterion:'Au moins 20 réponses, 100 % justes, sans aide, en 1 seconde de moyenne ou moins.',symbol:'ϟ'},
 {id:'first-sleeve',category:'music',title:'Premier pressage',criterion:'Terminer la suite d’un morceau pour ajouter le morceau à la collection.',symbol:'♫',scope:'global'},
 {id:'three-sleeves',category:'music',title:'Le club des vinyles',criterion:'Collectionner trois phrases de morceaux différents.',symbol:'▣',scope:'global'}
].map(d=>Object.freeze({...d,version:1,scope:d.scope||'profile'})));
export const collectionScope=(profile,zone={start:0,end:4})=>`${profile.key}@${zone.start}-${zone.end}`;
const familyActivities=(plan,pc)=>['note-'+pc,'note-'+pc+'-find','mix-'+pc,'mix-'+pc+'-find'].filter(id=>!plan.activityIds||plan.activityIds.includes(id));
const unaided=a=>a.events.length>=20&&a.events.every(e=>!e.retry&&!e.aids?.length);
const passed=a=>a.finished===true&&a.events.length>=20&&activityResult(a.events,a.events.length).passed;
function openEvidence(plan,attempts){
 const successes=attempts.filter(passed),find=successes.find(a=>a.activity==='opens-find');
 if(!plan.activityIds||plan.activityIds.includes('opens')){const name=successes.find(a=>a.activity==='opens');return {name:!!name,find:!!find,proofs:[name,find].filter(Boolean)};}
 const naming=successes.filter(a=>plan.activityIds.includes(a.activity)&&a.events.some(e=>e.mode==='name'));
 const complete=plan.opens.every(p=>naming.some(a=>a.events.some(e=>e.mode==='name'&&e.correct&&!e.retry&&!e.aids?.length&&e.target.string===p.string&&e.target.fret===p.fret)));
 return {name:complete,find:!!find,proofs:[...(complete?naming:[]),find].filter(Boolean)};
}

const coverage=a=>new Set(a.events.map(e=>`${e.target.string}:${e.target.fret}`)).size>=10;
export function evaluateAchievements({profile,plan,attempts,entry,existing=[]}){
 const scope=collectionScope(profile,plan.zone),fresh=[],known=new Set(existing.map(u=>`${u.scope}:${u.id}`));
 function award(id,proofs,extra={},global=false){const key=global?'global':scope;if(known.has(`${key}:${id}`))return;known.add(`${key}:${id}`);fresh.push({id,scope:key,version:1,at:entry.at,profileKey:profile.key,zone:{...plan.zone},proofs:proofs.map(p=>p.id),evidence:proofs.map(p=>{const m=resultMetrics(p.events);return {attempt:p.id,activity:p.activity,at:p.at,total:m.total,correct:m.correct,meanMs:m.meanMs,aidedResponses:p.events.filter(e=>e.aids?.length).length,positions:new Set(p.events.map(e=>`${e.target.string}:${e.target.fret}`)).size,motifCompleted:!!p.motifCompleted};}),...extra});}
 const successes=attempts.filter(passed);
 const pair=(base,strict=false)=>[base,base+'-find'].map(id=>successes.find(a=>a.activity===id&&(!strict||unaided(a)&&coverage(a))));
 const opens=openEvidence(plan,attempts);if(opens.name&&opens.find)award('open-strings',opens.proofs);
 for(const pc of plan.order){const set=familyActivities(plan,pc).map(id=>successes.find(a=>a.activity===id));if(set.length>=2&&set.every(Boolean)){award('first-family',set);break;}}
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
/** Progress uses the same qualifying evidence as awards; a pending card never claims 100%. */
export function achievementProgress(def,attempts,plan,obtained,unlocks=[],session=null){
 const result=(value,max,label)=>({value,max,label,percent:obtained?100:Math.min(99,Math.max(0,Math.floor(value/Math.max(1,max)*100)))});
 if(obtained)return result(1,1,'Défi accompli');
 const success=attempts.filter(passed),ids=new Set(success.map(a=>a.activity)),eligible=attempts.filter(a=>a.finished===true&&unaided(a));
 if(def.id==='open-strings'){const evidence=openEvidence(plan,attempts),n=Number(evidence.name)+Number(evidence.find);return result(n,2,`${n} / 2 compétences vérifiées`);}
 if(def.id==='first-family'){const candidates=plan.order.map(pc=>familyActivities(plan,pc)).filter(ids=>ids.length>=2).map(group=>({value:group.filter(id=>ids.has(id)).length,max:group.length})).sort((a,b)=>b.value/b.max-a.value/a.max),best=candidates[0]||{value:0,max:4};return result(best.value,best.max,`${best.value} / ${best.max} activités pour une famille`);}
 if(['natural-map','full-map'].includes(def.id)){const pc=def.id==='natural-map'?plan.order.filter(pc=>[0,2,4,5,7,9,11].includes(pc)).at(-1):plan.order.at(-1),n=['mix-'+pc,'mix-'+pc+'-find'].filter(id=>success.some(a=>a.activity===id&&unaided(a)&&coverage(a))).length;return result(n,2,`${n} / 2 validations sans aide`);}
 if(def.id==='clean-session'){const best=eligible.map(a=>resultMetrics(a.events)).sort((a,b)=>b.accuracy-a.accuracy)[0];return result(best?.correct||0,best?.total||20,best?`Meilleure séance sans aide : ${best.correct} / ${best.total}`:'Terminez une séance sans aide');}
 if(def.id==='personal-fluidity'){const n=eligible.some(passed)?1:0;return result(n,2,n?'Temps de référence enregistré · battez-le sur ce même exercice':'Enregistrez un premier temps sans aide');}
 if(def.id==='one-second'){const best=eligible.map(a=>resultMetrics(a.events)).filter(m=>m.accuracy===1&&m.meanMs!==null).sort((a,b)=>a.meanMs-b.meanMs)[0];return result(best?1000:0,best?Math.max(1000,best.meanMs):1000,best?`Meilleur temps sans faute : ${(best.meanMs/1000).toLocaleString('fr-FR',{maximumFractionDigits:2})} s · objectif 1 s`:'Terminez une séance sans faute ni aide');}
 if(def.id==='three-sleeves'||def.id==='first-sleeve'){const max=def.id==='three-sleeves'?3:1,n=new Set(unlocks.filter(u=>u.scope==='global'&&u.musicId).map(u=>u.musicId)).size;return result(Math.min(max,n),max,`${Math.min(max,n)} / ${max} phrase${max>1?'s différentes':''} collectionnée${max>1?'s':''}`);}
 if(def.id==='first-chain'||def.music){const finished=attempts.some(a=>a.activity.endsWith('-find')&&a.finished===true&&a.events.length>=20&&(!def.activity||a.activity===def.activity)),matching=session?.activity.endsWith('-find')&&(!def.activity||session.activity===def.activity),questions=matching?Math.min(1,(session.events?.length||0)/Math.max(20,session.queue?.length||20)):0,value=finished?1:questions;return result(value,2,value===1?'Questions terminées · reste la suite musicale':value>0?'Questions en cours · puis la suite musicale':'Terminez les questions, puis la suite musicale');}
 return result(0,1,'Prêt à relever le défi');
}
/** Resume the missing criterion, rather than restarting the first completed activity. */
export function nextAchievementActivity(def,attempts,plan){
 if(def.activity)return def.activity;
 const complete=(id,strict=false)=>attempts.some(a=>a.activity===id&&passed(a)&&(!strict||unaided(a)&&coverage(a)));
 let ids,strict=false;
 if(def.id==='open-strings'){const evidence=openEvidence(plan,attempts);ids=plan.activityIds&&!plan.activityIds.includes('opens')?[(plan.activityIds.find(id=>id.startsWith('mix-')&&!id.endsWith('-find'))||'opens-find'),'opens-find']:['opens','opens-find'];if(!evidence.find&&evidence.name)return 'opens-find';}
 else if(def.id==='first-family')ids=plan.order.map(pc=>familyActivities(plan,pc)).filter(ids=>ids.length>=2).sort((a,b)=>b.filter(id=>complete(id)).length/b.length-a.filter(id=>complete(id)).length/a.length)[0];
 else if(['natural-map','full-map'].includes(def.id)){const pc=def.id==='natural-map'?plan.order.filter(pc=>[0,2,4,5,7,9,11].includes(pc)).at(-1):plan.order.at(-1);ids=['mix-'+pc,'mix-'+pc+'-find'];strict=true;}
 else ids=plan.modules.flatMap(m=>[m.id,m.id+'-find']);
 return ids.find(id=>!complete(id,strict))||ids[0]||'opens';
}
