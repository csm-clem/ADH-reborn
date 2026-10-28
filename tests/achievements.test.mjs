import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,INSTRUMENTS} from '../core.js';
import {pilotPlan,practiceActivities,questionsFor,pilotCorrect,validatePilotStore,initialPilotStore} from '../pilot.js';
import {evaluateAchievements,collectionScope} from '../achievement-rules.js';
import {validateAchievements} from '../achievement-data.js';
import {betaCatalog} from '../beta-catalog.js';
import {melodiesForPlan,catalogMelodies} from '../melodies.js';
import {rewardFor} from '../reward-music.js';
import {createStorageService} from '../services/storage-service.js';
import {initialState} from '../state.js';
const profile=makeProfile('guitar6'),plan=pilotPlan(profile),activities=practiceActivities(plan);
function attempt(id,{correct=true,ms=800,aids=[],at=100,music=null}={}){const activity=activities.find(m=>m.id===id),queue=questionsFor(activity);return {id:id+'-'+at,activity:id,at,finished:true,passed:correct,events:queue.map(q=>({mode:q.mode,answerKind:q.answerKind,target:q.target,correct,ms,aids,at,retry:false,firstAnswer:q.mode==='name'?(q.answerKind==='pitch'?q.target.midi:q.target.midi%12):q.target})),motifCompleted:!!music,melodyId:music?.id||null,music:music?{shift:music.shift}:null};}
const evaluate=(entry,attempts=[entry],existing=[])=>evaluateAchievements({profile,plan,entry,attempts,existing});
test('Exact pitch questions distinguish E2 from E3; mixed exercises keep pitch-class answers',()=>{
 const qs=questionsFor(activities.find(m=>m.id==='note-4'));for(const q of qs){assert.equal(q.answerKind,'pitch');assert.ok(pilotCorrect(profile,q,q.target.midi));assert.ok(!pilotCorrect(profile,q,q.target.midi+12));assert.ok(!pilotCorrect(profile,q,4));}
 const mixed=questionsFor(activities.find(m=>m.id==='mix-4'));assert.ok(mixed.every(q=>q.answerKind==='class'&&pilotCorrect(profile,q,q.target.midi%12)));
});
test('Every instrument assigns a work at most once per zone, using only the exact exercise pitches',()=>{
 for(const inst of INSTRUMENTS)for(const zone of [{start:0,end:4},{start:4,end:8}]){const p=pilotPlan(makeProfile(inst.id),{zone}),assigned=melodiesForPlan(p);assert.equal(new Set([...assigned.values()].map(m=>m.id)).size,assigned.size);for(const [id,m]of assigned){const activity=practiceActivities(p).find(a=>a.id===id);assert.ok(m.sequence.every(n=>activity.pool.some(p=>p.midi===n.midi&&p.string===n.string&&p.fret===n.fret)));assert.ok(rewardFor(m)?.completePhrase);}}
});
test('Open strings require both exercise directions; deterministic awards never duplicate',()=>{
 const a=attempt('opens'),b=attempt('opens-find');assert.ok(!evaluate(a).some(u=>u.id==='open-strings'));const unlocked=evaluate(b,[a,b]);assert.ok(unlocked.some(u=>u.id==='open-strings'));assert.deepEqual(evaluate(b,[a,b],unlocked),[]);assert.ok(unlocked.filter(u=>u.scope!=='global').every(u=>u.scope===collectionScope(profile)));
});
test('A family requires discovery and the two cumulative exercise directions',()=>{
 const set=['mix-4','mix-4-find'].map(id=>attempt(id));assert.ok(!evaluate(set[1],set).some(u=>u.id==='first-family'));assert.ok(evaluateAchievements({profile,data:{attempts:set,discoveredModules:['note-4']},entry:set[1]}).some(u=>u.id==='first-family'));
});
test('Fluidity compares the same exercise, without aids, at an equal or higher precision',()=>{
 const old=attempt('opens',{ms:1200,at:1}),newer=attempt('opens',{ms:900,at:2});assert.ok(evaluate(newer,[old,newer]).some(u=>u.id==='personal-fluidity'));assert.ok(!evaluate(newer,[attempt('mix-4',{ms:1500,at:1}),newer]).some(u=>u.id==='personal-fluidity'));const aided=attempt('opens',{ms:500,aids:['open-names'],at:3});assert.ok(!evaluate(aided,[old,aided]).some(u=>u.category==='fluency'||u.id==='personal-fluidity'||u.id==='one-second'));
});
test('Incomplete music never unlocks a sleeve; a completed chain keeps its own arrangement proof',()=>{
 const [activity,music]=[...catalogMelodies(betaCatalog(profile))][0],entry=attempt(activity,{music}),incomplete={...entry,motifCompleted:false};assert.ok(!evaluate(incomplete).some(u=>u.musicId));const first=evaluate(entry),sleeve=first.find(u=>u.musicId);assert.equal(sleeve.musicId,music.id);assert.equal(sleeve.shift,music.shift);assert.equal(sleeve.scope,'global');assert.ok(!evaluate({...entry,id:'another-transposition',music:{shift:12}},[entry],first).some(u=>u.musicId));
});
test('Success collection survives validation, export/import, and rejects malformed or duplicated evidence',()=>{
 const [activity,music]=[...catalogMelodies(betaCatalog(profile))][0],entry=attempt(activity,{music}),store=initialPilotStore();store.profiles[profile.key]={profile,attempts:[entry],later:[],session:null};store.achievements=evaluate(entry);
 const data=new Map(),backend={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},storage=createStorageService({getStorage:()=>backend});const backup=JSON.parse(storage.backup({...initialState(),profile},store));const restored=storage.restoreBackup(backup);assert.deepEqual(restored.pilot.achievements,store.achievements);assert.deepEqual(validatePilotStore(restored.pilot).achievements,store.achievements);assert.throws(()=>validateAchievements([...store.achievements,store.achievements[0]]));assert.throws(()=>validateAchievements([{...store.achievements[0],at:-1}]));assert.throws(()=>validateAchievements([{...store.achievements[0],at:1e99}]));
});
test('A different instrument has no inherited landmark awards; music remains a global collection',()=>{
 const a=attempt('opens'),b=attempt('opens-find'),existing=evaluate(b,[a,b]),other=makeProfile('bass4');assert.ok(existing.some(u=>u.scope===collectionScope(profile)));assert.ok(!existing.some(u=>u.scope===collectionScope(other)));assert.deepEqual(evaluateAchievements({profile:other,plan:pilotPlan(other),attempts:[],entry:{at:200,events:[],id:'none'},existing}),[]);
});

test('The audited catalogue stays unique and never invents an unavailable known passage',()=>{const assignments=melodiesForPlan(plan);assert.ok(assignments.size>=12);assert.equal(new Set([...assignments.values()].map(m=>m.id)).size,assignments.size);for(const [id,music] of assignments){const module=activities.find(m=>m.id===id);assert.ok(music.sequence.every(p=>module.pool.some(q=>q.midi===p.midi)));if(module.kind==='family')assert.ok(music.sequence.every(p=>p.midi%12===module.pitchClass));}});
