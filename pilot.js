/** Phase-3 pilot: configuration-derived activities and first-response evidence. */
import {positions,noteName,pitchLabel,makeProfile} from './core.js';
export const PILOT_VERSION=2;
export const PASS_ACCURACY=.9;
export function activityResult(events,expected){const first=events.filter(e=>!e.retry),correct=first.filter(e=>e.correct).length,required=Math.ceil(expected*PASS_ACCURACY);return {correct,total:first.length,required,passed:first.length>=expected&&correct>=required};}
export const NATURAL_PITCHES=[0,2,4,5,7,9,11];
export const positionKey=p=>`${p.string}:${p.fret}`;
export const isNatural=midi=>NATURAL_PITCHES.includes(midi%12);
const unique=list=>[...new Map(list.map(p=>[positionKey(p),p])).values()];
const at=(profile,string,fret)=>({string,fret,midi:profile.tuning[string]+fret});
export function pilotPlan(profile,{allowAlteredOpens=true,notation='international'}={}){
 const name=n=>noteName(n,notation);
 const all=positions(profile,profile.tuning.map((_,s)=>s)),natural=all.filter(p=>isNatural(p.midi));
 const opens=profile.tuning.map((_,s)=>at(profile,s,0)),root=opens.reduce((a,b)=>b.midi<a.midi?b:a),rootPC=root.midi%12;
 const altered=opens.filter(p=>!isNatural(p.midi));
 const compatible=isNatural(root.midi)&&(!altered.length||allowAlteredOpens);
 const reason=!isNatural(root.midi)?`La corde la plus grave est ${name(root.midi)}. Une tonique altérée demande une variante diatonique spécifique ; le pilote naturel ne la remplace pas par une autre note.`:altered.length&&!allowAlteredOpens?'Cet accordage comporte des altérations à vide ; le préambule d’accordage est nécessaire avant le pilote naturel.':'';
 const modules=[],unavailable=[];
 const add=(id,title,kind,pool,focus,description,extra={})=>{const subject=kind==='opens'?'Les cordes à vide':kind==='tuning'?'L’accordage':kind==='interval'?`La note ${name(extra.target.midi)}`:kind==='transfer'?`Les cordes en ${name(extra.pitchClass)}`:kind==='recall'?'Les notes graves':kind==='phrase'?'La phrase musicale':title;const m={id,title,subject,kind,pool:unique(pool),focus:unique(focus),description,...extra};modules.push(m);return m;};
 if(altered.length)add('tuning','Les noms de votre accordage','tuning',opens,opens,`Les cordes à vide ${[...new Set(altered.map(p=>name(p.midi)))].join(', ')} comportent une altération dans votre accordage. Ce préambule apprend seulement ces vrais départs ; ensuite la roue revient aux sept notes naturelles.`);
 add('opens','Reconnaître vos cordes à vide','opens',opens.filter(p=>isNatural(p.midi)),opens.filter(p=>isNatural(p.midi)),'Chaque ligne est une corde et les barres grises sont les frettes. La case 0 est avant la barre de départ, le sillet : on joue sans appuyer. Explorez les départs, puis nommez et retrouvez les cordes dans un ordre mélangé.');
 if(!compatible)return {root,opens,natural,all,modules,compatible,reason,altered};
 const rootIndex=NATURAL_PITCHES.indexOf(rootPC);let learned=unique(opens.filter(p=>isNatural(p.midi)));
 for(const degree of [5,4,3,2,8,7,6]){
  const pc=NATURAL_PITCHES[(rootIndex+degree-1)%7],delta=degree===8?12:(pc-rootPC+12)%12,desired=root.midi+delta;
  let options=natural.filter(p=>p.midi===desired);
  if(!options.length){const candidates=natural.filter(p=>p.midi%12===pc&&p.midi>root.midi);const min=Math.min(...candidates.map(p=>p.midi));options=candidates.filter(p=>p.midi===min);}
  if(!options.length){unavailable.push({degree,note:name(pc),interval:intervalName(degree,delta)});continue;}
  options.sort((a,b)=>a.fret-b.fret||Math.abs(a.string-root.string)-Math.abs(b.string-root.string)||a.string-b.string);
  const target=options[0],tonics=natural.filter(p=>p.midi%12===rootPC);
  const anchor=tonics.find(p=>p.midi===target.midi-delta)||root;
  const quality=intervalName(degree,delta);
  const pool=unique([anchor,target]);
  const moved=target.midi!==desired;
  const explanation=`${degree===5?'Deux notes forment un intervalle : c’est leur écart en hauteur. ':''}Reliez ${pitchLabel(anchor.midi,notation)} (corde ${profile.tuning.length-anchor.string}) à ${pitchLabel(target.midi,notation)} (corde ${profile.tuning.length-target.string}). Vous entendrez une ${quality.toLowerCase()}. ${degree===5&&delta===6?'Avec cette tonique et les notes naturelles, la quinte est diminuée : six demi-tons. ':''}${degree===8?'Les deux notes portent le même nom, mais la seconde sonne une octave plus haut. ':''}${moved?'Ce lien utilise le registre disponible sur cette position. ':''}Essayez la nouvelle note ; nous afficherons ensuite les deux repères.`;
  add(`degree-${degree}`,`${quality} · ${name(target.midi)}`,'interval',pool,[target],explanation,{degree,delta,target,anchor,moved});
  learned=unique([...learned,anchor,target]);
 }
 const groups=new Map();opens.forEach(p=>{const pc=p.midi%12;if(!groups.has(pc))groups.set(pc,[]);groups.get(pc).push(p);});
 for(const [pc,strings] of [...groups].filter(([,s])=>s.length>1).sort((a,b)=>Math.max(...b[1].map(p=>p.midi))-Math.max(...a[1].map(p=>p.midi)))){
  const pool=natural.filter(p=>strings.some(s=>s.string===p.string)),focus=pool.filter(p=>!learned.some(k=>positionKey(k)===positionKey(p)));
  if(!focus.length)continue;
  const registers=[...new Set(strings.map(p=>p.midi))].sort((a,b)=>a-b),registerText=registers.length===1?'Ces départs ont la même hauteur : un unisson.':`${registers.map(n=>pitchLabel(n,notation)).join(' et ')} : ${registers.slice(1).map((n,i)=>(n-registers[i])/12).join(' puis ')} octave(s) d’écart.`;
  const numbers=strings.map(p=>profile.tuning.length-p.string),fretGroups=[...new Set(pool.map(p=>p.fret))].sort((a,b)=>a-b),transferPairs=fretGroups.map(fret=>strings.map(p=>pool.find(x=>x.string===p.string&&x.fret===fret)).filter(Boolean)).filter(p=>p.length>1);
  add(`transfer-${pc}`,`La carte de ${name(pc)}, d’une corde à l’autre`,'transfer',pool,focus,`Les cordes ${numbers.join(' et ')} sont toutes accordées en ${name(pc)} à vide. ${registerText} À la même case, elles donnent donc le même nom de note. Après votre essai, des lignes relieront ces correspondances. Vous jouerez ensuite le même petit motif sur chacune de ces cordes.`,{pitchClass:pc,equivalentStrings:strings.map(p=>p.string),transferPairs});
  learned=unique([...learned,...pool]);
 }
 const bass=unique(modules.filter(m=>m.kind==='interval').flatMap(m=>[m.anchor,m.target]));
 if(bass.length>=3)add('recall','Retrouver vos repères sans indice','recall',bass,bass,'Retrouvez vos notes, une question à la fois.');
 if(bass.length>=3)add('phrase','Une phrase depuis les noms','phrase',bass,bass,'Jouez une courte suite de noms, puis comparez avec le modèle. Le jeu vérifie les positions choisies sur le manche tactile. Vous pouvez aussi reprendre ce motif sur votre instrument, librement.');
 return {root,opens,natural,all,modules,compatible,reason,altered,learned,unavailable};
}
export function intervalName(degree,semitones){
 if(degree===8)return 'Octave';
 const names={2:'Seconde',3:'Tierce',4:'Quarte',5:'Quinte',6:'Sixte',7:'Septième'},ordinary={2:2,3:4,4:5,5:7,6:9,7:11};
 const quality=[4,5].includes(degree)?semitones===ordinary[degree]?'juste':semitones<ordinary[degree]?'diminuée':'augmentée':semitones===ordinary[degree]?'majeure':'mineure';
 return `${names[degree]} ${quality}`;
}
export function shuffled(list,random=Math.random){const out=[...list];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function practiceActivities(plan){return plan.modules.filter(m=>m.pool.length).flatMap(m=>['name','find'].map(mode=>{
 const title=m.subject||m.title;
 const subtitle=(mode==='name'?'Nommer':'Retrouver')+(['opens','tuning'].includes(m.kind)?' les cordes':' les notes');
 return {...m,baseId:m.id,id:mode==='name'?m.id:m.id+'-find',mode,title,subtitle};
}));}
export function questionsFor(module,{diagnostic=false,random=Math.random,mode=module.mode||'name'}={}){
 const ordered=unique([...module.focus,...module.pool]);if(!ordered.length)return [];
 const count=Math.max(20,Math.min(module.kind==='recall'?30:24,ordered.length*3)),queue=[];let round=0;
 while(queue.length<count){const batch=shuffled(ordered,random);if(batch.length>2&&positionKey(queue.at(-1)?.target||{})===positionKey(batch[0]))[batch[0],batch[1]]=[batch[1],batch[0]];
  for(const p of batch){if(queue.length===count)break;queue.push({id:`${module.id}:${positionKey(p)}:${mode}:${round}`,mode,target:p,scope:mode==='find'&&['opens','tuning'].includes(module.kind)?'height':'string',allowedFrets:mode==='find'&&['opens','tuning'].includes(module.kind)?[0]:undefined,evaluation:diagnostic||module.kind==='recall',retry:false});}round++;
 }
 return queue;
}
export function admissiblePositions(profile,question){
 const all=positions(profile,profile.tuning.map((_,s)=>s));
 return all.filter(p=>(!question.allowedFrets||question.allowedFrets.includes(p.fret))&&p.midi%12===question.target.midi%12&&(question.scope!=='string'||p.string===question.target.string)&&(question.scope!=='height'||p.midi===question.target.midi));
}
export function pilotCorrect(profile,q,value){
 if(q.mode==='name')return Number.isInteger(value)&&value===q.target.midi%12;
 return value&&admissiblePositions(profile,q).some(p=>p.string===value.string&&p.fret===value.fret);
}
export function correction(profile,q,value,notation='international'){
 const target=q.target,name=noteName(target.midi,notation),spot=`corde ${profile.tuning.length-target.string}, ${target.fret===0?'à vide':`case ${target.fret}`}`;
 if(q.mode==='find'&&value&&Number.isInteger(value.string)&&Number.isInteger(value.fret)){
  const midi=profile.tuning[value.string]+value.fret;
  if(midi%12===target.midi%12&&q.allowedFrets&&!q.allowedFrets.includes(value.fret))return `Le nom est juste, mais cette consigne demande une corde à vide, donc la case 0.`;
  if(midi%12===target.midi%12)return `C’est bien ${name}, mais la consigne précise ${spot}. Le même nom peut se retrouver ailleurs.`;
  if(value.string!==target.string)return `La corde change le point de départ. Ici ${name} se trouve ${spot} ; votre toucher donne ${noteName(midi,notation)}.`;
  if(Math.abs(value.fret-target.fret)===1)return `Vous êtes à une case de ${name}. Une case fait un demi-ton ; le repère correct est ${spot}.`;
 }
 const pc=Number.isInteger(value)?value:null;
 if(pc!==null&&[1,11].includes((pc-target.midi%12+12)%12))return `${name} est voisin d’un demi-ton de votre réponse. Retrouvez le repère ${spot}, puis réessayez après d’autres notes.`;
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
export function initialPilotStore(){return {version:PILOT_VERSION,profiles:{}};}
const finiteTime=x=>Number.isFinite(x)&&x>=0;
const validPosition=(p,profile)=>p&&Number.isInteger(p.string)&&p.string>=0&&p.string<profile.tuning.length&&Number.isInteger(p.fret)&&p.fret>=0&&p.fret<=4&&p.midi===profile.tuning[p.string]+p.fret;
export function validatePilotStore(value){
 if(!value||value.version!==PILOT_VERSION||!value.profiles||typeof value.profiles!=='object'||Array.isArray(value.profiles)||Object.keys(value.profiles).length>50)throw new Error('Sauvegarde du pilote invalide.');
 const profiles={};
 for(const [key,data] of Object.entries(value.profiles)){
  if(!data||!data.profile)throw new Error('Profil du pilote invalide.');
  const profile=makeProfile(data.profile.instrumentId,data.profile.tuning?.map(n=>{if(!Number.isInteger(n))throw new Error('Accordage invalide.');return `${['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][n%12]}${Math.floor(n/12)-1}`;}).join(' '));
  if(key!==profile.key||!Array.isArray(data.attempts)||data.attempts.length>1000||!Array.isArray(data.later)||data.later.length>200)throw new Error('Historique du pilote invalide.');
  if(data.seenInstructions!==undefined&&(!Array.isArray(data.seenInstructions)||data.seenInstructions.length>64||!data.seenInstructions.every(k=>typeof k==='string'&&/^[a-z0-9-]{1,60}$/.test(k))))throw new Error('Introductions enregistrées invalides.');
  if(data.discoveredModules!==undefined&&(!Array.isArray(data.discoveredModules)||data.discoveredModules.length>100||!data.discoveredModules.every(k=>typeof k==='string'&&/^[a-z0-9-]{1,60}$/.test(k))))throw new Error('Découvertes enregistrées invalides.');
  const validAids=a=>Array.isArray(a)&&a.every(v=>['labels','listen','course'].includes(v));
  const validEvent=e=>e&&['name','find'].includes(e.mode)&&validPosition(e.target,profile)&&typeof e.correct==='boolean'&&validAids(e.aids)&&finiteTime(e.ms)&&finiteTime(e.at)&&typeof e.retry==='boolean';
  for(const a of data.attempts)if(!a||typeof a.id!=='string'||!finiteTime(a.at)||!Array.isArray(a.events)||a.events.length>30||!a.events.every(validEvent))throw new Error('Tentative du pilote invalide.');
  for(const q of data.later)if(!q||!['name','find'].includes(q.mode)||!validPosition(q.target,profile))throw new Error('Révision du pilote invalide.');
  if(data.session){
   const s=data.session;
   if(s.familyOrder!==undefined&&(!Array.isArray(s.familyOrder)||!s.familyOrder.length||s.familyOrder.length>7||new Set(s.familyOrder).size!==s.familyOrder.length||!s.familyOrder.every(pc=>NATURAL_PITCHES.includes(pc))))throw new Error('Ordre des familles invalide.');
   if(s.currentAids!==undefined&&!validAids(s.currentAids)||s.feedback!==undefined&&s.feedback!==null&&(typeof s.feedback.correct!=='boolean'||typeof s.feedback.text!=='string'||s.feedback.text.length>2000)||s.nameDraft!==undefined&&(typeof s.nameDraft!=='string'||s.nameDraft.length>40)||s.reviewPool!==undefined&&(!Array.isArray(s.reviewPool)||s.reviewPool.length>40||!s.reviewPool.every(p=>validPosition(p,profile))))throw new Error('État de reprise invalide.');
   if(typeof s.id!=='string'||typeof s.activity!=='string'||!Array.isArray(s.queue)||s.queue.length>30||!s.queue.every(q=>q&&['name','find'].includes(q.mode)&&validPosition(q.target,profile)&&['string','any','height'].includes(q.scope)&&(!q.allowedFrets||Array.isArray(q.allowedFrets)&&q.allowedFrets.every(f=>Number.isInteger(f)&&f>=0&&f<=4)))||!Number.isInteger(s.index)||s.index<0||s.index>s.queue.length||!Array.isArray(s.events)||!s.events.every(validEvent)||s.events.length>30||!Number.isInteger(s.motifIndex)||s.motifIndex<0||s.motifIndex>100||s.activeMs!==undefined&&(!finiteTime(s.activeMs)||s.activeMs>86_400_000)||!['discovery','practice','motif','result'].includes(s.stage))throw new Error('Séance du pilote invalide.');
  }
  profiles[key]={...data,profile,attempts:data.attempts.slice(-1000),later:data.later.slice(-200)};
 }
 return {version:PILOT_VERSION,profiles};
}
