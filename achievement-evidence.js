import {activityContract,successfulAttempt} from './learning-evidence.js';
/** Bounded, durable aggregates; detailed attempts may be pruned without losing a challenge. */
export function achievementEvidence(catalog,data){
 const previous=data.collectionEvidence||{},activities=Object.assign(Object.create(null),structuredClone(previous.activities||{})),coverage=Object.assign(Object.create(null),structuredClone(previous.coverage||{})),music=Object.assign(Object.create(null),structuredClone(previous.music||{})),processed=new Set(previous.processed||[]),modules=new Map(catalog.activities.map(m=>[m.id,m]));
 for(const a of data.attempts||[]){
  if(processed.has(a.id))continue;
  processed.add(a.id);const m=modules.get(a.activity);if(!m||!a.finished)continue;
  const es=(a.events||[]).filter(e=>!e.retry);if(es.length<20||es.length>30)continue;
  const contract=activityContract(m),comparisonKey=a.comparisonKey||a.activity;
  let rec=activities[a.activity];
  if(!rec||rec.contract!==contract)rec=activities[a.activity]={contract,comparisonKey,finished:0,passed:false,perfect:0,perfectMean:null,fastMean:null,best:null,cleanRun:0,recordBeat:false,chain:false,at:a.at};
  rec.finished++;rec.at=Math.max(rec.at,a.at);rec.passed||=successfulAttempt(a,m);
  const scope=(coverage[m.scopeId]||={name:[],find:[],pitch:[]}),seen={name:new Set(scope.name),find:new Set(scope.find),pitch:new Set(scope.pitch||[])};
  for(const e of es)if(e.correct&&!e.aids?.length&&e.mode===m.mode&&m.pool.some(p=>p.string===e.target.string&&p.fret===e.target.fret)&&(m.mode!=='name'||!['family','opens'].includes(m.kind)||e.answerKind==='pitch')){seen[e.mode].add(`${e.target.string}:${e.target.fret}`);if(e.mode==='name'&&e.answerKind==='pitch')seen.pitch.add(`${e.target.string}:${e.target.fret}`);}
  scope.name=[...seen.name];scope.find=[...seen.find];scope.pitch=[...seen.pitch];
  const compatible=es.every(e=>e.mode===m.mode&&m.pool.some(p=>p.string===e.target.string&&p.fret===e.target.fret)&&(m.mode!=='name'||!['family','opens'].includes(m.kind)||e.answerKind==='pitch'));
  const unaided=compatible&&es.every(e=>!e.aids?.length),correct=es.filter(e=>e.correct).length,accuracy=correct/es.length;
  let run=0;for(const e of es){run=compatible&&e.correct&&!e.aids?.length?run+1:0;rec.cleanRun=Math.max(rec.cleanRun,run);}
  if(unaided){
   if(accuracy===1)rec.perfect=Math.min(2,rec.perfect+1);
   const timed=es.every(e=>e.timingInterpretable!==false&&Number.isFinite(e.ms)&&e.ms>=0);
   const meanMs=timed?es.filter(e=>e.correct).reduce((sum,e)=>sum+e.ms,0)/Math.max(1,correct):null;
   if(meanMs!==null&&correct){
    if(rec.comparisonKey!==comparisonKey){rec.best=null;rec.comparisonKey=comparisonKey;}
    if(accuracy===1)rec.perfectMean=rec.perfectMean===null?meanMs:Math.min(rec.perfectMean,meanMs);
    if(accuracy>=.95)rec.fastMean=rec.fastMean===null?meanMs:Math.min(rec.fastMean,meanMs);
    const best=rec.best;
    if(best&&rec.comparisonKey===comparisonKey&&accuracy>=.9&&accuracy>=best.accuracy&&meanMs<=best.meanMs*.95)rec.recordBeat=true;
    if(!best||accuracy>best.accuracy||accuracy===best.accuracy&&meanMs<best.meanMs){rec.best={accuracy,meanMs};rec.comparisonKey=comparisonKey;}
   }
  }
  rec.chain||=!!a.motifCompleted;
  if(a.motifCompleted&&a.melodyId&&a.music&&Number.isInteger(a.music.shift)){
   const old=music[a.melodyId];
   music[a.melodyId]={at:old?.at??a.at,activity:old?.activity??a.activity,shift:old?.shift??a.music.shift,clean:!!old?.clean||a.motifErrors===0};
  }
 }
 return {version:1,activities,coverage,music,processed:[...processed].slice(-1000)};
}
export function preserveAchievementEvidence(catalog,data){return data.collectionEvidence=achievementEvidence(catalog,data);}

/** Import validation lives separately from the DOM/rule engine to avoid cyclic services. */
export function validateAchievementEvidence(e,profile){
 const record=v=>v&&typeof v==='object'&&!Array.isArray(v),id=s=>typeof s==='string'&&/^[-a-z0-9]{1,100}$/.test(s),time=x=>Number.isFinite(x)&&x>=0,
  position=s=>/^\d{1,2}:\d{1,2}$/.test(s)&&+s.split(':')[0]<profile.tuning.length&&+s.split(':')[1]<=24;
 if(!record(e)||e.version!==1||!record(e.activities)||!record(e.coverage)||!record(e.music)||!Array.isArray(e.processed)||e.processed.length>1000||!e.processed.every(s=>typeof s==='string'&&s.length<=150)||Object.keys(e.activities).length>4096||Object.keys(e.coverage).length>64||Object.keys(e.music).length>100)throw new Error('Preuves de collection invalides.');
 for(const [key,r]of Object.entries(e.activities))if(!id(key)||!record(r)||typeof r.contract!=='string'||r.contract.length>12000||typeof r.comparisonKey!=='string'||r.comparisonKey.length>12000||!Number.isSafeInteger(r.finished)||r.finished<1||typeof r.passed!=='boolean'||![0,1,2].includes(r.perfect)||!Number.isInteger(r.cleanRun)||r.cleanRun<0||r.cleanRun>30||typeof r.chain!=='boolean'||typeof r.recordBeat!=='boolean'||!time(r.at)||[r.perfectMean,r.fastMean].some(v=>v!==null&&!time(v))||r.best!==null&&(!record(r.best)||!time(r.best.meanMs)||!Number.isFinite(r.best.accuracy)||r.best.accuracy<0||r.best.accuracy>1))throw new Error('Compteur de succès invalide.');
 for(const [key,r]of Object.entries(e.coverage)){if(!id(key)||!record(r))throw new Error('Périmètre de collection invalide.');for(const mode of ['name','find','pitch'])if(!Array.isArray(r[mode])||r[mode].length>300||!r[mode].every(position)||new Set(r[mode]).size!==r[mode].length)throw new Error('Couverture de collection invalide.');}
 for(const [key,r]of Object.entries(e.music))if(!id(key)||!record(r)||!id(r.activity)||!time(r.at)||!Number.isInteger(r.shift)||Math.abs(r.shift)>100||typeof r.clean!=='boolean')throw new Error('Phrase collectionnée invalide.');
 return e;
}
