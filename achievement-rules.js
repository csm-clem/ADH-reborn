/** Pure projection: one set of criteria feeds counters, routing and awards. */
import {ACHIEVEMENTS,RARITIES,MUSIC_CARD_NUMBERS} from './achievement-catalog.js';
import {achievementEvidence} from './achievement-evidence.js';
import {betaCatalog,betaEvidence} from './beta-catalog.js';
import {betaCourses,courseCompleted} from './beta-courses.js';
import {activityContract} from './learning-evidence.js';
import {noteName} from './core.js';
import {catalogMelodies,melodyById} from './melodies.js';
import {musicChecked,MUSIC_ARRANGEMENT_VERSION} from './music-audit.js';
export {ACHIEVEMENTS,RARITIES};
export const ACHIEVEMENT_VERSION=2;
export const collectionScope=(profile,zone={start:0,end:4})=>`${profile.key}@${zone.start}-${zone.end}`;
const key=p=>`${p.string}:${p.fret}`;
const activity=id=>({kind:'activity',id});
const course=id=>({kind:'course',id});
const check=(label,value,max=1,target=null)=>({label,value:Math.min(max,value),max,done:value>=max,target});
const done=(label,yes,target)=>check(label,Number(!!yes),1,target);
const sum=xs=>xs.reduce((v,x)=>v+x.value,0);
const total=xs=>xs.reduce((v,x)=>v+x.max,0);
const defaultCatalogs=new WeakMap();
const defaultCatalog=profile=>{if(!defaultCatalogs.has(profile))defaultCatalogs.set(profile,betaCatalog(profile));return defaultCatalogs.get(profile);};

export function achievementContext({profile,catalog=defaultCatalog(profile),data={attempts:[]},existing=[],notation='international'}){
 const evidence=achievementEvidence(catalog,data),courses=betaCourses(profile,catalog),validatedCourses=Object.fromEntries(Object.entries(data.courses||{}).map(([id,r])=>[id,{...r,completed:!!courses.get(id)&&courseCompleted(courses.get(id),r)}])),beta=betaEvidence(catalog,{...data,courses:validatedCourses}),modules=new Map(catalog.activities.map(m=>[m.id,m])),music=new Map();
 for(const [id,m]of catalogMelodies(catalog))music.set(m.id,{...m,activity:id,scopeId:modules.get(id).scopeId});
 const record=id=>{const r=evidence.activities[id],m=modules.get(id);return m&&r?.contract===activityContract(m)?r:null;};
 const passed=id=>!!record(id)?.passed||beta.passed(id);
 const coverage=(positions,scopeId=null,mode=null)=>{
  const scopes=scopeId?[scopeId]:catalog.scopes.map(s=>s.id),modes=mode?[mode]:['name','find'];
  return positions.reduce((n,p)=>n+modes.filter(m=>scopes.some(id=>evidence.coverage[id]?.[m]?.includes(key(p)))||!scopeId&&m!=='pitch'&&beta.coverage[m].has(key(p))).length,0);
 };
 const coverTarget=(positions,scopeId,mode=null)=>{
  for(const m of mode?[mode]:['name','find'])for(const p of positions)if(!coverage([p],scopeId,m)){
   const found=catalog.activities.find(a=>(!scopeId||a.scopeId===scopeId)&&a.mode===(m==='pitch'?'name':m)&&a.pool.some(q=>key(p)===key(q))&&(m!=='pitch'||['family','opens'].includes(a.kind)));
   if(found)return activity(found.id);
  }
  return null;
 };
 const summaryIds=(id,nat=false)=>{const s=catalog.byScope.get(id),m=s?.plan.modules.find(m=>m.kind==='mix'&&(nat?m.naturalEnd:m.fullEnd));return m?[m.id,m.id+'-find'].filter(id=>modules.has(id)):[];};
 const nextScope=id=>{
  const s=catalog.byScope.get(id);if(!s)return null;
  for(const ch of s.chapters)if(!beta.chapters.get(ch.id)?.complete){
   if(ch.kind==='course')return course(ch.courseId);
   if(ch.discoveryId&&!data.discoveredModules?.includes(catalog.discoveries.find(d=>d.id===ch.discoveryId)?.baseId))return activity(ch.discoveryId);
   const missing=ch.activityIds.find(id=>!passed(id));if(missing)return activity(missing);
   return coverTarget(ch.focus,id)||coverTarget(ch.focus,null)||activity(ch.activityIds[0]||ch.discoveryId);
  }
  return activity(summaryIds(id)[0]||s.activityIds[0]);
 };
 const synthesis=(id,nat=false)=>{
  const s=catalog.byScope.get(id),ids=summaryIds(id,nat),positions=nat?s.plan.natural:s.plan.all;
  return [...ids.map(id=>done((modules.get(id).mode==='name'?'Nommer':'Retrouver')+' · bilan '+(nat?'naturel':'complet'),passed(id),activity(id))),check('Emplacements vérifiés dans les deux sens',coverage(positions),positions.length*2,coverTarget(positions,id))];
 };
 const scopeCheck=id=>{const r=beta.scopes.get(id);return check(catalog.byScope.get(id).title+' · chapitres et couverture',r?.chapters||0,r?.total||1,nextScope(id));};
 const naturalChecks=['z1','z2','z3'].flatMap(id=>synthesis(id,true));
 const families=catalog.chapters.filter(ch=>ch.kind==='family'&&ch.activityIds.length),pairs=catalog.scopes.flatMap(s=>s.plan.modules.filter(m=>m.kind==='mix'&&new Set(m.pool.map(p=>p.midi%12)).size>=2).map(m=>[m.id,m.id+'-find'].filter(id=>modules.has(id)))).filter(ids=>ids.length===2);
 const familyChecks=ch=>[done('Découvrir les positions',!!data.discoveredModules?.includes(catalog.discoveries.find(d=>d.id===ch.discoveryId)?.baseId),activity(ch.discoveryId)),...ch.activityIds.map(id=>done(modules.get(id).subtitle,passed(id),activity(id)))];
 const best=groups=>groups.slice().sort((a,b)=>(sum(b)/Math.max(1,total(b)))-(sum(a)/Math.max(1,total(a))))[0]||[check('Terminer une famille',0,1,nextScope('z1'))];
 const recs=[...modules].map(([id,m])=>({id,m,r:record(id)})).filter(x=>x.r),fallback=activity(catalog.activities[0]?.id||'opens');
 const perfect=(mode=null)=>{const rs=recs.filter(x=>!mode||x.m.mode===mode),p=rs.find(x=>x.r.perfect);return done('100 % sans aide · au moins 20 questions',!!p,activity(p?.id||rs[0]?.id||catalog.activities.find(a=>!mode||a.mode===mode)?.id));};
 const speed=(ms,full)=>{const rs=recs.filter(x=>(full?x.r.perfectMean:x.r.fastMean)!==null).sort((a,b)=>(full?a.r.perfectMean:a.r.fastMean)-(full?b.r.perfectMean:b.r.fastMean)),r=rs[0],mean=r?(full?r.r.perfectMean:r.r.fastMean):null;return check(mean===null?`${full?'100 %':'95 %'} justes · moyenne ≤ ${ms/1000} s`:`Meilleur : ${(mean/1000).toLocaleString('fr-FR',{maximumFractionDigits:2})} s · objectif ${ms/1000} s`,mean===null?0:Math.min(1,ms/Math.max(1,mean)),1,activity(r?.id||catalog.activities[0]?.id));};
 const ownedMusic=new Map(existing.filter(u=>u.musicId&&musicChecked(u.musicId)).map(u=>[u.musicId,{...u,clean:false}]));
 for(const [id,r]of Object.entries(evidence.music))if(musicChecked(id))ownedMusic.set(id,{...ownedMusic.get(id),...r});
 const playableIds=new Set([...music.keys(),...ownedMusic.keys()]);
 const musicTarget=()=>activity([...music.values()].find(m=>!ownedMusic.has(m.id))?.activity||[...music.values()][0]?.activity||catalog.activities.find(a=>a.mode==='find')?.id||fallback.id);
 const checksFor=def=>{
  const s=def.scopeId||'z1',nat=def.modelId==='perfect-natural',positions=nat?catalog.byScope.get(s).plan.natural:catalog.byScope.get(s).plan.all;
  switch(def.modelId||def.id){
   case 'first-session':return [done('Terminer au moins 20 questions',recs.some(x=>x.r.finished),fallback)];
   case 'opens-named':return [done('Nommer votre accordage sans aide',passed('opens'),activity('opens'))];
   case 'open-strings':return ['opens','opens-find'].map(id=>done(modules.get(id)?.subtitle||'Votre accordage',passed(id),activity(id)));
   case 'diagram-check':return [done('Réussir les vérifications du diagramme',validatedCourses['gd-02']?.completed,course('gd-02'))];
   case 'beginner-route':return ['gd-01','gd-02','gd-03','gd-04'].map(id=>done(courses.get(id)?.title||id,validatedCourses[id]?.completed,course(id)));
   case 'first-discovery':return [done('Retrouver tous les emplacements d’une famille',catalog.discoveries.some(m=>data.discoveredModules?.includes(m.baseId)),activity(catalog.discoveries[0]?.id))];
   case 'first-family':return best(families.map(familyChecks));
   case 'first-cumulative':return best(pairs.map(ids=>ids.map(id=>done(modules.get(id).subtitle,passed(id),activity(id)))));
   case 'natural-map':case 'z2-natural':case 'z3-natural':return synthesis(s,true);
   case 'full-map':case 'z2-full':case 'z3-full':case 'first-string-full':case 'second-string-full':case 'third-string-full':return synthesis(s);
   case 'same-pitch-bridges':{
    const byPitch=new Map();for(const p of catalog.allPositions)if(coverage([p],null,'pitch')&&coverage([p],null,'find')){const ss=byPitch.get(p.midi)||new Set();ss.add(p.string);byPitch.set(p.midi,ss);}
    return [check('Trois hauteurs, chacune sur deux cordes',Math.min(3,[...byPitch.values()].filter(s=>s.size>=2).length),3,coverTarget(catalog.allPositions,null,'pitch')||fallback)];
   }
   case 'octave-family':return best(families.filter(ch=>new Set(ch.focus.map(p=>Math.floor(p.midi/12))).size>=2).map(ch=>[...familyChecks(ch),check('Chaque emplacement nommé et retrouvé',coverage(ch.focus),ch.focus.length*2,coverTarget(ch.focus,ch.scopeId))]));
   case 'boundary-four':case 'boundary-eight':{
    const fret=def.id==='boundary-four'?4:8,scopes=fret===4?['z1','z2']:['z2','z3'],points=catalog.allPositions.filter(p=>p.fret===fret);
    return scopes.flatMap(id=>[check(`Case ${fret} · ${catalog.byScope.get(id).title}`,coverage(points,id),points.length*2,coverTarget(points,id)),done('Un bilan validé · '+catalog.byScope.get(id).title,summaryIds(id).some(passed),activity(summaryIds(id).find(id=>!passed(id))||summaryIds(id)[0]))]);
   }
   case 'guided-level-one':return ['z1','cs1','cs2'].map(scopeCheck);
   case 'three-natural-zones':return naturalChecks;
   case 'clean-session':return [check('20 premières réponses justes à la suite',Math.max(0,...recs.map(x=>x.r.cleanRun)),20,fallback)];
   case 'perfect-name':return [perfect('name')];
   case 'perfect-find':return [perfect('find')];
   case 'perfect-natural':case 'perfect-chromatic':{
    const ids=summaryIds(s,nat),success=ids.find(id=>record(id)?.perfect);
    return [done('Un bilan à 100 %, sans aide',!!success,activity(success||ids[0])),check('Chaque emplacement nommé et retrouvé',coverage(positions),positions.length*2,coverTarget(positions,s))];
   }
   case 'repeat-proof':{const r=recs.slice().sort((a,b)=>b.r.perfect-a.r.perfect)[0];return [check('Deux réussites parfaites du même exercice',r?.r.perfect||0,2,activity(r?.id||fallback.id))];}
   case 'personal-fluidity':return [check('Référence puis amélioration de 5 % · précision ≥90 %',recs.some(x=>x.r.recordBeat)?2:recs.some(x=>x.r.best?.accuracy>=.9)?1:0,2,activity(recs.find(x=>x.r.best?.accuracy>=.9)?.id||fallback.id))];
   case 'two-second':return [speed(2000,false)];
   case 'one-second':return [speed(1000,true)];
   case 'three-flashes':{const xs=recs.filter(x=>x.r.perfectMean!==null&&x.r.perfectMean<=1000);return [check('Trois exercices différents à 100 % et ≤1 s',xs.length,3,fallback),done('Au moins une activité Nommer',xs.some(x=>x.m.mode==='name'),activity(catalog.activities.find(m=>m.mode==='name').id)),done('Au moins une activité Retrouver',xs.some(x=>x.m.mode==='find'),activity(catalog.activities.find(m=>m.mode==='find').id))];}
   case 'fluent-zones':return ['z1','z2','z3'].flatMap(id=>[...summaryIds(id).map(a=>done(catalog.byScope.get(id).title+' · '+modules.get(a).subtitle+' · ≥95 % et ≤2 s',record(a)?.fastMean!==null&&record(a)?.fastMean!==undefined&&record(a).fastMean<=2000,activity(a))),check('Couverture complète · '+catalog.byScope.get(id).title,coverage(catalog.byScope.get(id).plan.all),catalog.byScope.get(id).plan.all.length*2,coverTarget(catalog.byScope.get(id).plan.all,id))]);
   case 'first-chain':{const session=data.session,partial=session?.activity?.endsWith('-find')?Math.min(1,(session.events?.length||0)/Math.max(20,session.queue?.length||20)):0;return [check('Questions, puis suite musicale',recs.some(x=>x.r.chain)?2:recs.some(x=>x.m.mode==='find'&&x.r.finished)?1:partial,2,partial?activity(session.activity):musicTarget())];}
   case 'first-sleeve':case 'three-sleeves':case 'seven-sleeves':{const n=def.id==='first-sleeve'?1:def.id==='three-sleeves'?3:7;return [check(`${n} morceau${n>1?'x différents':''} dans la collection`,ownedMusic.size,n,musicTarget())];}
   case 'three-clean-phrases':return [check('Trois suites différentes, sans erreur dès le départ',[...ownedMusic.values()].filter(m=>m.clean).length,3,activity([...music.values()].find(m=>!ownedMusic.get(m.id)?.clean)?.activity||musicTarget().id))];
   case 'three-strings':return ['cs1','cs2','cs3'].flatMap(id=>synthesis(id));
   case 'beta-atlas':return catalog.scopes.map(s=>scopeCheck(s.id));
   case 'beta-encore':return [...catalog.scopes.map(s=>scopeCheck(s.id)),...catalog.scopes.flatMap(s=>summaryIds(s.id).map(id=>done(s.title+' · '+modules.get(id).subtitle+' · 100 %',record(id)?.perfect,activity(id))))];
   default:if(def.music)return [done('Terminer la suite de ce morceau',ownedMusic.has(def.music.id),activity(def.activity))];return [];
  }
 };
 const scopeIds={'natural-map':'z1','full-map':'z1','z2-natural':'z2','z2-full':'z2','z3-natural':'z3','z3-full':'z3','first-string-full':'cs1','second-string-full':'cs2','third-string-full':'cs3'};
 const defs=ACHIEVEMENTS.flatMap(d=>['perfect-natural','perfect-chromatic'].includes(d.id)?['z1','z2','z3'].map((s,i)=>({...d,id:d.id+(i?'-'+s:''),modelId:d.id,scopeId:s,number:d.number+'-'+['I','II','III'][i]})):[{...d,scopeId:scopeIds[d.id]}]);
 for(const def of defs){def.title=def.title.replace('{note}',noteName(profile.tuning[0],notation)).replace('{n}',String(profile.tuning.length));def.context=def.scopeId?catalog.byScope.get(def.scopeId).title+' · '+catalog.byScope.get(def.scopeId).subtitle:'Votre '+profile.label.toLowerCase();}
 const acquiredId=id=>existing.some(u=>u.id===id&&(u.scope==='global'||u.profileKey===profile.key));
 const reachablePitches=new Map();for(const m of catalog.activities.filter(m=>m.mode==='name'&&['family','opens'].includes(m.kind)))for(const p of m.pool){const strings=reachablePitches.get(p.midi)||new Set();strings.add(p.string);reachablePitches.set(p.midi,strings);}
 const available=defs.filter(d=>{
  if(acquiredId(d.id))return true;
  if(['opens-named','open-strings'].includes(d.id)&&!modules.has('opens'))return false;
  if(d.id==='same-pitch-bridges'&&[...reachablePitches.values()].filter(s=>s.size>=2).length<3)return false;
  return !['first-sleeve','three-sleeves','seven-sleeves','three-clean-phrases'].includes(d.id)||playableIds.size>=(d.id==='seven-sleeves'?7:d.id==='first-sleeve'?1:3);
 });
 const allMusic=new Map(music);for(const [id,r]of ownedMusic)if(!allMusic.has(id)){const m=melodyById(id,r.shift);if(m)allMusic.set(id,{...m,activity:r.activity,scopeId:'z1'});}
 for(const u of existing.filter(u=>u.musicId))if(!allMusic.has(u.musicId)){const m=melodyById(u.musicId,u.shift);if(m)allMusic.set(u.musicId,{...m,activity:u.activity,scopeId:'z1'});}
 for(const [id,m]of allMusic){if(!MUSIC_CARD_NUMBERS[id])continue;available.push({id:'music-'+id,modelId:'music',category:'music',scope:'global',scopeId:m.scopeId,title:m.title,context:m.composer,criterion:'Terminer la suite compatible de ce morceau. Une erreur remet la suite à zéro.',rarity:RARITIES[2],level:3,number:MUSIC_CARD_NUMBERS[id],version:2,music:m,activity:m.activity});}
 const scopeFor=d=>d.scope==='global'?'global':collectionScope(profile,d.scopeId?catalog.byScope.get(d.scopeId).zone:undefined);
 const definitions=available.map(def=>{
  const obtained=existing.find(u=>u.id===def.id&&u.scope===scopeFor(def)),checks=checksFor(def),eligible=checks.length>0&&checks.every(c=>c.done),value=sum(checks),max=Math.max(1,total(checks)),ratios=checks.map(c=>c.value/Math.max(1,c.max)),percent=obtained?100:Math.min(eligible?100:99,Math.floor((ratios.length?ratios.reduce((a,b)=>a+b,0)/ratios.length:0)*100));
  let target=checks.find(c=>!c.done&&c.target)?.target||checks.find(c=>c.target)?.target||fallback;
  if(target.kind==='activity'&&!modules.has(target.id)&&!catalog.discoveries.some(a=>a.id===target.id))target=nextScope(def.scopeId||'z1')||fallback;
  return {...def,scopeKey:scopeFor(def),obtained,checks,eligible,target,progress:{value,max,percent,label:checks.length===1?checks[0].label:`${checks.filter(c=>c.done).length} / ${checks.length} critères validés`}};
 });
 return {definitions,evidence,catalog,beta};
}

export function evaluateAchievements({profile,catalog,attempts=[],data,entry,existing=[]}){
 const context=achievementContext({profile,catalog:catalog||defaultCatalog(profile),data:data||{attempts},existing}),at=entry?.at??Math.max(0,...attempts.map(a=>a.at||0)),fresh=[];
 for(const def of context.definitions){if(def.obtained||!def.eligible)continue;
  const proofs=(data?.attempts||attempts).filter(a=>a.finished&&a.events?.length>=20).slice(-10);
  fresh.push({id:def.id,scope:def.scopeKey,profileKey:profile.key,at,version:1,ruleVersion:2,proofs:proofs.map(a=>a.id),evidence:proofs.map(a=>{const es=a.events.filter(e=>!e.retry),cs=es.filter(e=>e.correct),times=cs.filter(e=>!e.aids?.length&&e.timingInterpretable!==false).map(e=>e.ms);return {attempt:a.id,activity:a.activity,at:a.at,total:es.length,correct:cs.length,meanMs:times.length?times.reduce((a,b)=>a+b,0)/times.length:null,aidedResponses:es.filter(e=>e.aids?.length).length,positions:new Set(es.map(e=>key(e.target))).size,motifCompleted:!!a.motifCompleted};}),zone:{...(context.catalog.byScope.get(def.scopeId||'z1')?.zone||{start:0,end:4})},...(def.music?{musicId:def.music.id,shift:context.evidence.music[def.music.id]?.shift??def.music.shift??0,activity:context.evidence.music[def.music.id]?.activity??def.activity,arrangementVersion:MUSIC_ARRANGEMENT_VERSION}:{})});
 }
 return fresh;
}

/** Compatibility for older callers; new UI consumes achievementContext once per render. */
export function achievementProgress(def,attempts,plan,obtained,unlocks=[],session=null){
 if(obtained)return {value:1,max:1,percent:100,label:'Défi accompli'};
 const p=def.progress|| (plan.profile?achievementContext({profile:plan.profile,data:{attempts,session},existing:unlocks}).definitions.find(d=>d.id===def.id)?.progress:null);
 return p?{...p,percent:Math.min(99,p.percent)}:{value:0,max:1,percent:0,label:'Voir les critères du défi'};
}
export function nextAchievementActivity(def,attempts,plan){
 if(def.target)return def.target.id;if(def.activity)return def.activity;
 if(plan.profile)return achievementContext({profile:plan.profile,data:{attempts}}).definitions.find(d=>d.id===def.id)?.target.id;
 const passed=id=>attempts.some(a=>a.activity===id&&a.finished&&a.events?.length>=20&&a.events.filter(e=>e.correct&&!e.retry&&!e.aids?.length).length/a.events.length>=.9);
 if(def.id==='open-strings')return ['opens','opens-find'].find(id=>!passed(id))||'opens';
 return plan.activityIds?.find(id=>!passed(id))||plan.modules[0]?.id||'opens';
}
