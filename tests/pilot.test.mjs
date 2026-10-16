import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,INSTRUMENTS} from '../core.js';
import {pilotPlan,NATURAL_PITCHES,questionsFor,positionKey,pilotCorrect,admissiblePositions,correction,firstSummary,initialPilotStore,validatePilotStore,naturalDiagnostic} from '../pilot.js';
test('Standard pilot starts on all open strings and derives the requested intervals from actual pitches',()=>{
 const p=makeProfile('guitar6'),plan=pilotPlan(p);assert.equal(plan.root.midi,40);assert.equal(plan.modules[0].kind,'opens');assert.equal(plan.modules[0].pool.length,6);
 assert.deepEqual(plan.modules.filter(m=>m.kind==='interval').map(m=>[m.degree,m.target.string,m.target.fret,m.target.midi-m.anchor.midi]),[[5,1,2,7],[4,1,0,5],[3,0,3,3],[2,0,1,1],[8,2,2,12],[7,2,0,10],[6,1,3,8]]);
 assert.equal(plan.modules.filter(m=>m.kind==='transfer').length,1);assert.equal(plan.natural.length,18);
});
test('Seven-string fifth is diminished; DADGAD and Drop B use available registers without inventing a fret',()=>{
 let plan=pilotPlan(makeProfile('guitar7')),fifth=plan.modules.find(m=>m.degree===5);assert.match(fifth.title,/diminuée/);assert.equal(fifth.target.midi-fifth.anchor.midi,6);
 plan=pilotPlan(makeProfile('guitar6','D2 A2 D3 G3 A3 D4'));const fourth=plan.modules.find(m=>m.degree===4);assert.equal(fourth.moved,true);assert.equal(fourth.anchor.midi,50);assert.equal(fourth.target.midi,55);assert.equal(fourth.target.fret,0);assert.equal(plan.modules.filter(m=>m.kind==='transfer').length,2);
 plan=pilotPlan(makeProfile('guitar7','B1 F#2 B2 E3 A3 C#4 F#4'));assert.equal(plan.modules[0].kind,'tuning');assert.equal(plan.modules.find(m=>m.degree===4).anchor.midi,47);assert.ok(plan.modules.every(m=>m.pool.every(p=>p.fret<=4)));
});
test('Reentrant tuning uses the real lowest pitch, and altered tonics are explicitly incompatible',()=>{
 let plan=pilotPlan(makeProfile('guitar6','G3 E2 A2 D3 B3 E4'));assert.equal(plan.root.string,1);assert.equal(plan.root.midi,40);
 plan=pilotPlan(makeProfile('guitar8'));assert.equal(plan.compatible,false);assert.match(plan.reason,/tonique altérée/);assert.equal(plan.modules.some(m=>m.kind==='interval'),false);
});
test('Every teaching position is covered in both directions; natural wheel and diagnostic pools stay natural',()=>{
 for(const i of INSTRUMENTS){const profile=makeProfile(i.id),plan=pilotPlan(profile);for(const m of plan.modules){const queue=questionsFor(m);assert.equal(new Set(queue.map(q=>q.id)).size,queue.length);for(const p of m.pool)for(const mode of ['name','find'])assert.ok(queue.some(q=>positionKey(q.target)===positionKey(p)&&q.mode===mode));if(m.kind!=='tuning')assert.ok(m.pool.every(p=>NATURAL_PITCHES.includes(p.midi%12)));assert.equal(queue.every(q=>pilotCorrect(profile,q,q.mode==='name'?q.target.midi%12:q.target)),true);for(let n=1;n<queue.length;n++)if(m.pool.length>1)assert.notEqual(positionKey(queue[n-1].target),positionKey(queue[n].target));}
 const diagnostic=naturalDiagnostic(profile);assert.equal(questionsFor(diagnostic).length,plan.natural.length*2);assert.ok(questionsFor(diagnostic).every(q=>q.evaluation));}
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
 assert.match(correction(p,q,{string:5,fret:0}),/bien E/);assert.match(correction(p,q,{string:0,fret:1}),/demi-ton/);
 const e=[{mode:'name',correct:false,retry:false,aids:[]},{mode:'name',correct:true,retry:true,aids:[]},{mode:'find',correct:true,retry:false,aids:['labels']}];
 assert.deepEqual(firstSummary(e),{name:{total:1,correct:0,unaided:0},find:{total:1,correct:1,unaided:0}});
});
test('Pilot backups preserve separate legacy-independent evidence and reject mismatched positions',()=>{
 const p=makeProfile('guitar6'),store=initialPilotStore(),target={string:0,fret:0,midi:40};store.profiles[p.key]={profile:p,attempts:[{id:'attempt',at:1,events:[{mode:'name',target,correct:true,aids:[],ms:100,at:1,retry:false}]}],later:[],session:null};
 const restored=validatePilotStore(JSON.parse(JSON.stringify(store)));assert.equal(restored.profiles[p.key].attempts.length,1);
 restored.profiles[p.key].attempts[0].events[0].target.midi=41;assert.throws(()=>validatePilotStore(restored));assert.throws(()=>validatePilotStore({version:99,profiles:{}}));
});
test('Natural route follows notation and name production accepts accents without reducing to a multiple choice',async()=>{
 const {parseNoteAnswer}=await import('../pilot.js');
 assert.equal(parseNoteAnswer('Ré'),2);assert.equal(parseNoteAnswer(' re '),2);assert.equal(parseNoteAnswer('Mi'),4);assert.equal(parseNoteAnswer('B'),11);assert.equal(parseNoteAnswer('Si'),11);assert.equal(parseNoteAnswer('Fa♯'),6);assert.equal(parseNoteAnswer('F#'),6);assert.equal(parseNoteAnswer('Solb'),6);assert.equal(parseNoteAnswer('H'),null);assert.equal(parseNoteAnswer(''),null);
 const plan=pilotPlan(makeProfile('guitar6'),{notation:'latin'});assert.match(plan.modules.find(m=>m.degree===5).title,/Si/);assert.match(plan.modules.find(m=>m.degree===5).description,/Mi → Si/);
});
test('Open-string free searches accept both E strings but exclude fretted E positions',()=>{
 const p=makeProfile('guitar6'),m=pilotPlan(p).modules[0],q=questionsFor(m).find(q=>q.scope==='any'&&q.target.midi%12===4);
 assert.ok(q);assert.equal(pilotCorrect(p,q,{string:5,fret:0}),true);assert.equal(pilotCorrect(p,q,{string:2,fret:2}),false);
});
test('Unavailable degrees are reported and interval qualities follow the natural tonic, not a standard pattern',()=>{
 const limited=pilotPlan(makeProfile('guitar6','E2 E2 E2 E2 E2 E2'));assert.deepEqual(limited.unavailable.map(x=>x.note).sort(),['A','B','C','D','E']);assert.ok(limited.modules.filter(m=>m.kind==='interval').every(m=>[2,3].includes(m.degree)));
 const lydian=pilotPlan(makeProfile('guitar6','F2 A2 D3 G3 B3 E4'));assert.match(lydian.modules.find(m=>m.degree===4).title,/augmentée/);
 assert.match(pilotPlan(makeProfile('guitar6')).modules.find(m=>m.kind==='transfer').description,/2 octave/);
});
