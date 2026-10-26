/** Disposable v0 fixture. It is evaluated through the real achievement rules, never persisted. */
import {introductionFor} from './learning-help.js';
import {RELEASE} from './release.js';
import {initialPilotStore,practiceActivities,validatePilotStore} from './pilot.js';
import {melodiesForPlan,catalogMelodies} from './melodies.js';
import {evaluateAchievements} from './achievement-rules.js';
import {betaCourses} from './beta-courses.js';
import {preserveLearningProofs} from './learning-evidence.js';
import {preserveAchievementEvidence} from './achievement-evidence.js';
export const debugAvailable=version=>version.startsWith('0.');
export function simulatedCompletion(profile,plan,{version=RELEASE,now=Date.now()}={}){
 if(!debugAvailable(version))throw new Error('Le mode débug est réservé aux versions v0.');
 const seen=[];
 const store=initialPilotStore(),activities=practiceActivities(plan),music=melodiesForPlan(plan),attempts=[];
 for(const [index,activity] of activities.entries())for(let pass=0;pass<2;pass++){
  const count=24,at=now-(activities.length*2-index*2-pass)*60_000,melody=activity.mode==='find'?music.get(activity.id):null;
  const events=Array.from({length:count},(_,i)=>{const target=activity.pool[(i+pass*count)%activity.pool.length],answerKind=['family','opens'].includes(activity.kind)?'pitch':'class';return {mode:activity.mode,answerKind,target:{...target},correct:true,ms:pass?500:1500,at:at+i,retry:false,aids:[],firstAnswer:activity.mode==='find'?{...target}:answerKind==='pitch'?target.midi:target.midi%12};});
  const entry={id:`debug-${activity.id}-${pass}`,activity:activity.id,comparisonKey:activity.id,at,finished:true,passed:true,events,motifErrors:0,motifCompleted:activity.mode==='find',melodyId:melody?.id||null,music:melody?{shift:melody.shift}:null};
  attempts.push(entry);store.achievements.push(...evaluateAchievements({profile,plan,attempts,entry,existing:store.achievements}));
 }
 for(const activity of activities)for(const stage of ['discovery','practice','motif'])for(let i=0;i<3;i++){const q={mode:activity.mode,answerKind:['family','opens'].includes(activity.kind)?'pitch':'class'},help=introductionFor(activity,stage,q,seen,activity.id,music.get(activity.id));if(help)seen.push(help.key);}
 store.profiles[profile.key]={profile,attempts,later:[],session:null,diagnostic:null,discoveredModules:[...new Set(activities.map(a=>a.baseId))],seenInstructions:seen};
 for(const record of Object.values(store.profiles))record.attempts=record.attempts.slice(-1000);
 return validatePilotStore(store);
}

/** Full beta fixture remains disposable; real attempts and courses are never replaced on disk. */
export function simulatedBetaCompletion(profile,catalog,{now=Date.now()}={}){
 const store=simulatedCompletion(profile,catalog.byScope.get('z1').plan,{now}),data=store.profiles[profile.key];
 const existing=new Set(data.attempts.map(a=>a.activity));
 for(const activity of catalog.activities.filter(a=>!existing.has(a.id)))for(let pass=0;pass<2;pass++){
  const melody=catalogMelodies(catalog).get(activity.id);
  const events=Array.from({length:24},(_,i)=>{const target=activity.pool[(i+24*pass)%activity.pool.length],exact=activity.kind==='family'||activity.kind==='opens';return {target:{...target},mode:activity.mode,answerKind:exact?'pitch':'class',correct:true,ms:500,at:now,retry:false,aids:[],firstAnswer:activity.mode==='find'?{string:target.string,fret:target.fret}:exact?target.midi:target.midi%12};});
  data.attempts.push({id:'debug-beta-'+activity.id+'-'+pass,activity:activity.id,at:now,finished:true,passed:true,events,motifCompleted:activity.mode==='find',motifErrors:0,melodyId:melody?.id||null,music:melody?{shift:melody.shift}:null});
 }
 data.discoveredModules=[...new Set([...data.discoveredModules,...catalog.discoveries.map(a=>a.baseId)])];
 data.courses=Object.fromEntries([...betaCourses(profile,catalog)].map(([id,c])=>[id,{index:0,visited:c.pages.map(p=>p.id),correct:c.pages.filter(p=>p.quiz).map(p=>p.id),completed:true,at:now}]));
 data.seenInstructions=[...new Set([...data.seenInstructions,'name-pitch',...catalog.discoveries.map(a=>'family-'+(a.scopeId!=='z1'?a.scopeId+'-':'')+a.pitchClass)])];
 preserveLearningProofs(catalog,data);preserveAchievementEvidence(catalog,data);
 store.achievements.push(...evaluateAchievements({profile,catalog,data,existing:store.achievements,entry:{at:now}}));
 for(const record of Object.values(store.profiles))record.attempts=record.attempts.slice(-1000);
 return validatePilotStore(store);
}
