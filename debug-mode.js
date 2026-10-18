/** Disposable v0 fixture. It is evaluated through the real achievement rules, never persisted. */
import {introductionFor} from './learning-help.js';
import {RELEASE} from './release.js';
import {initialPilotStore,practiceActivities,validatePilotStore} from './pilot.js';
import {melodiesForPlan} from './melodies.js';
import {evaluateAchievements} from './achievement-rules.js';
export const debugAvailable=version=>version.startsWith('0.');
export function simulatedCompletion(profile,plan,{version=RELEASE,now=Date.now()}={}){
 if(!debugAvailable(version))throw new Error('Le mode débug est réservé aux versions v0.');
 const seen=[];
 const store=initialPilotStore(),activities=practiceActivities(plan),music=melodiesForPlan(plan),attempts=[];
 for(const [index,activity] of activities.entries())for(let pass=0;pass<2;pass++){
  const count=24,at=now-(activities.length*2-index*2-pass)*60_000,melody=activity.mode==='find'?music.get(activity.id):null;
  const events=Array.from({length:count},(_,i)=>{const target=activity.pool[(i+pass*count)%activity.pool.length],answerKind=activity.kind==='family'?'pitch':'class';return {mode:activity.mode,answerKind,target:{...target},correct:true,ms:pass?500:1500,at:at+i,retry:false,aids:[],firstAnswer:activity.mode==='find'?{...target}:answerKind==='pitch'?target.midi:target.midi%12};});
  const entry={id:`debug-${activity.id}-${pass}`,activity:activity.id,comparisonKey:activity.id,at,finished:true,passed:true,events,motifErrors:0,motifCompleted:activity.mode==='find',melodyId:melody?.id||null,music:melody?{shift:melody.shift}:null};
  attempts.push(entry);store.achievements.push(...evaluateAchievements({profile,plan,attempts,entry,existing:store.achievements}));
 }
 for(const activity of activities)for(const stage of ['discovery','practice','motif'])for(let i=0;i<3;i++){const q={mode:activity.mode,answerKind:activity.kind==='family'?'pitch':'class'},help=introductionFor(activity,stage,q,seen,activity.id,music.get(activity.id));if(help)seen.push(help.key);}
 store.profiles[profile.key]={profile,attempts,later:[],session:null,diagnostic:null,discoveredModules:[...new Set(activities.map(a=>a.baseId))],seenInstructions:seen};
 return validatePilotStore(store);
}
