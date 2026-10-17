import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,INSTRUMENTS} from '../core.js';
import {pilotPlan,NATURAL_PITCHES,questionsFor,positionKey,pilotCorrect,admissiblePositions,correction,firstSummary,initialPilotStore,validatePilotStore,naturalDiagnostic,practiceActivities,activityResult} from '../pilot.js';
test('The standard route follows E A D G B F C then F# C# G# D# A#, each isolated and mixed',()=>{
 const plan=pilotPlan(makeProfile('guitar6'));assert.deepEqual(plan.order,[4,9,2,7,11,5,0,6,1,8,3,10]);assert.equal(practiceActivities(plan).length,50);assert.equal(plan.modules[0].pool.length,6);assert.equal(plan.natural.length,18);
 for(let i=1;i<plan.modules.length;i+=2){assert.equal(plan.modules[i].kind,'family');assert.equal(plan.modules[i+1].kind,'mix');assert.ok(plan.modules[i].pool.every(p=>p.midi%12===plan.modules[i].pitchClass));}
});

test('Custom and seven-string tunings derive their families from the real open strings',()=>{
 assert.deepEqual(pilotPlan(makeProfile('guitar7')).order.slice(0,5),[11,4,9,2,7]);
 const dad=pilotPlan(makeProfile('guitar6','D2 A2 D3 G3 A3 D4'));assert.deepEqual(dad.order.slice(0,3),[2,9,7]);
 const drop=pilotPlan(makeProfile('guitar7','B1 F#2 B2 E3 A3 C#4 F#4'));assert.deepEqual(drop.order.slice(0,3),[11,4,9]);assert.deepEqual(drop.order.slice(7,9),[6,1]);assert.equal(drop.modules[0].pool.length,7);
});

test('Altered open strings keep their real pitches and their full families follow the seven naturals',()=>{
 const profile=makeProfile('guitar8'),before=[...profile.tuning],plan=pilotPlan(profile);assert.equal(plan.modules[0].pool[0].midi,30);assert.equal(plan.order[7],6);assert.deepEqual(profile.tuning,before);assert.ok(plan.modules.find(m=>m.id==='note-6').pool.some(p=>p.fret>0));
});

test('Each concept exposes separate, bounded name and find exercises with complete position coverage',()=>{
 for(const i of INSTRUMENTS){const profile=makeProfile(i.id),plan=pilotPlan(profile),activities=practiceActivities(plan);assert.equal(activities.length,plan.modules.filter(m=>m.pool.length).length*2);
  for(const m of activities){const queue=questionsFor(m);assert.ok(queue.length>=20&&queue.length<=30);assert.equal(new Set(queue.map(q=>q.id)).size,queue.length);assert.ok(queue.every(q=>q.mode===m.mode));for(const p of m.newPositions)assert.ok(queue.some(q=>positionKey(q.target)===positionKey(p)));assert.ok(queue.filter(q=>m.newPositions.some(p=>positionKey(p)===positionKey(q.target))).length>=Math.ceil(queue.length*.2));if(m.kind==='family')assert.ok(m.pool.every(p=>p.midi%12===m.pitchClass));assert.ok(queue.every(q=>pilotCorrect(profile,q,q.mode==='name'?q.target.midi%12:q.target)));}
  for(const mode of ['name','find']){const diagnostic=naturalDiagnostic(profile,mode),queue=questionsFor(diagnostic);assert.ok(queue.length<=30);assert.ok(queue.every(q=>q.mode===mode&&q.evaluation));}
 }
});
test('Find tasks accept every admissible occurrence, and distinguish string and height restrictions',()=>{
 const p=makeProfile('guitar6'),q={mode:'find',target:{string:0,fret:0,midi:40},scope:'any'};
 assert.equal(admissiblePositions(p,q).length,3);assert.equal(pilotCorrect(p,q,{string:5,fret:0}),true);
 assert.equal(pilotCorrect(p,{...q,scope:'string'},{string:5,fret:0}),false);
 const unison={...q,scope:'height',target:{string:3,fret:4,midi:59}};assert.equal(admissiblePositions(p,unison).length,2);assert.equal(pilotCorrect(p,unison,{string:4,fret:0}),true);
 assert.equal(pilotCorrect(p,{...q,mode:'name'},NaN),false);
});
test('Corrections distinguish a correct name on the wrong string, a neighbouring fret and recall directions',()=>{
 const p=makeProfile('guitar6'),q={mode:'find',target:{string:0,fret:0,midi:40},scope:'string'};
 assert.match(correction(p,q,{string:5,fret:0}),/bien E/);assert.match(correction(p,q,{string:0,fret:1}),/juste à côté/);
 const e=[{mode:'name',correct:false,retry:false,aids:[]},{mode:'name',correct:true,retry:true,aids:[]},{mode:'find',correct:true,retry:false,aids:['labels']}];
 assert.deepEqual(firstSummary(e),{name:{total:1,correct:0,unaided:0},find:{total:1,correct:1,unaided:0}});
});
test('Pilot backups preserve separate legacy-independent evidence and reject mismatched positions',()=>{
 const p=makeProfile('guitar6'),store=initialPilotStore(),target={string:0,fret:0,midi:40};store.profiles[p.key]={profile:p,attempts:[{id:'attempt',activity:'opens',at:1,events:[{mode:'name',target,correct:true,aids:[],ms:100,at:1,retry:false}]}],later:[],session:null};
 const restored=validatePilotStore(JSON.parse(JSON.stringify(store)));assert.equal(restored.profiles[p.key].attempts.length,1);
 restored.profiles[p.key].attempts[0].events[0].target.midi=41;assert.throws(()=>validatePilotStore(restored));assert.throws(()=>validatePilotStore({version:99,profiles:{}}));
});
test('Natural route follows notation and the note parser retains international and Latin aliases',async()=>{
 const {parseNoteAnswer}=await import('../pilot.js');
 assert.equal(parseNoteAnswer('Ré'),2);assert.equal(parseNoteAnswer(' re '),2);assert.equal(parseNoteAnswer('Mi'),4);assert.equal(parseNoteAnswer('B'),11);assert.equal(parseNoteAnswer('Si'),11);assert.equal(parseNoteAnswer('Fa♯'),6);assert.equal(parseNoteAnswer('F#'),6);assert.equal(parseNoteAnswer('Solb'),6);assert.equal(parseNoteAnswer('H'),null);assert.equal(parseNoteAnswer(''),null);
 const plan=pilotPlan(makeProfile('guitar6'),{notation:'latin'});assert.match(plan.modules.find(m=>m.id==='note-11').title,/Si/);assert.match(plan.modules.find(m=>m.id==='note-11').description,/Si/);
});
test('Open-string searches name an exact register and exclude the other octave and fretted E',()=>{
 const p=makeProfile('guitar6'),m=pilotPlan(p).modules[0],q=questionsFor(m,{mode:'find'}).find(q=>q.scope==='height'&&q.target.midi===40);
 assert.ok(q);assert.equal(pilotCorrect(p,q,{string:0,fret:0}),true);assert.equal(pilotCorrect(p,q,{string:5,fret:0}),false);assert.equal(pilotCorrect(p,q,{string:2,fret:2}),false);
});
test('An exotic unison tuning learns only pitch classes actually present in the zone',()=>{
 const plan=pilotPlan(makeProfile('guitar6','E2 E2 E2 E2 E2 E2'));assert.deepEqual(plan.order,[4,5,7,6,8]);assert.equal(plan.learned.length,30);assert.equal(new Set(plan.order).size,5);
});

test('Each diagnostic is shuffled and covers all natural positions in one direction only',()=>{
 const profile=makeProfile('guitar6');for(const mode of ['name','find']){const module=naturalDiagnostic(profile,mode),queue=questionsFor(module,{random:()=>.25});assert.equal(queue.length,30);assert.ok(queue.every(q=>q.mode===mode));for(const p of module.pool)assert.ok(queue.some(q=>positionKey(q.target)===positionKey(p)));assert.notDeepEqual(queue.map(q=>q.id),questionsFor(module,{random:()=>.75}).map(q=>q.id));}
});
test('Every position of a family is learned before its mix expands the accumulated pool',()=>{
 const plan=pilotPlan(makeProfile('guitar6'));let learned=plan.opens;
 for(const pc of plan.order){const family=plan.modules.find(m=>m.id==='note-'+pc),mix=plan.modules.find(m=>m.id==='mix-'+pc);assert.deepEqual(family.pool,plan.all.filter(p=>p.midi%12===pc));for(const p of [...learned,...family.pool])assert.ok(mix.pool.some(q=>positionKey(q)===positionKey(p)));learned=mix.pool;}
 assert.equal(learned.length,30);
});

test('Passing needs the entire first-response sample and ninety percent; corrections cannot replace errors',()=>{
 const event=correct=>({correct,retry:false}),first=Array.from({length:20},(_,i)=>event(i<18));
 assert.equal(activityResult(first,20).passed,true);assert.equal(activityResult(first.slice(0,19),20).passed,false);
 first[17].correct=false;assert.equal(activityResult([...first,{correct:true,retry:true}],20).passed,false);assert.equal(activityResult(first,20).required,18);
});

test('Family questions are random rather than a predictable traversal of the strings',()=>{
 const module=pilotPlan(makeProfile('guitar6')).modules.find(m=>m.id==='note-4');let n=0;const queue=questionsFor(module,{random:()=>n++%2?.9:.1});assert.ok(queue.some((q,i)=>i&&positionKey(q.target)===positionKey(queue[i-1].target)));assert.equal(new Set(queue.map(q=>positionKey(q.target))).size,3);
});
