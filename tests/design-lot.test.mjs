import test from 'node:test';
import assert from 'node:assert/strict';
import {score,makeProfile,ascendingTuning,standardGuitar} from '../core.js';
import {historyEntry,validateHistory,trajectoryView} from '../trajectory.js';
import {newArcadeRun,resolveArcade,validateArcadeRecords} from '../arcade-rules.js';
import {ArcadeController} from '../arcade-ui.js';
import {betaCatalog} from '../beta-catalog.js';
import {betaCourses} from '../beta-courses.js';
import {PilotController} from '../pilot-ui.js';
import {masteryMetrics} from '../mastery.js';
const profile=makeProfile('guitar6'),target={string:0,fret:0,midi:40};
const events=(errors,ms=2000,n=24)=>Array.from({length:n},(_,i)=>({correct:i>=errors,ms,aids:[],target,mode:'name'}));
test('new star boundaries are absolute error counts, independently of question count',()=>{
 for(const n of [20,24,30])for(const [e,s]of [[0,4],[1,4],[2,3],[3,2],[5,2],[6,1],[10,1],[11,0]])assert.equal(score(events(e,2000,n)).stars,s);
 assert.equal(score([]).stars,0);assert.equal(score(events(0,1000)).stars,5);assert.equal(score(events(0,1001)).stars,4);
 assert.equal(score(events(1,2500)).stars,4);assert.equal(score(events(1,2501)).stars,3);
 for(const patch of [{aids:['listen']},{timingInterpretable:false},{ms:NaN},{ms:-1}]){
  const es=events(1);Object.assign(es[0],patch);assert.equal(score(es).stars,3);
 }
 assert.equal(score([...events(0,1000),{correct:false,retry:true}]).stars,5);
});
test('history keeps a non-record finished run and validates imports',()=>{
 const run=newArcadeRun('zones-natural');resolveArcade(run,target,'correct',600);for(let i=0;i<3;i++)resolveArcade(run,target,'wrong',100);
 const data={arcade:{version:1,records:{},history:[]}};
 const c=Object.create(ArcadeController.prototype);Object.assign(c,{run,frame:0,host:{getData:()=>data,save(){},getState:()=>({profile})},show(){}});
 const old=globalThis.cancelAnimationFrame;globalThis.cancelAnimationFrame=()=>{};
 try{c.finish();c.run=structuredClone(run);c.run.score=0;c.run.correct=0;c.run.timeSum=0;c.finish();assert.equal(data.arcade.history.length,2);assert.equal(data.arcade.history[1].meanMs,null);}finally{globalThis.cancelAnimationFrame=old;}
 const e=historyEntry({...run,at:1});assert.equal(validateHistory([e])[0].meanMs,600);
 assert.throws(()=>validateHistory([{...e,meanMs:-1}]));assert.throws(()=>validateHistory([{...e,mode:'unknown'}]));
 assert.match(trajectoryView({history:[e]}),/circle/);assert.match(trajectoryView({}),/premier point/);
 assert.doesNotThrow(()=>validateArcadeRecords({version:1,records:{}},profile));
});
test('height lessons hide between-string rule for reentrant or equal tuning; standard exception is scoped',()=>{
 for(const p of [profile,makeProfile('guitar6','E2 A2 D3 G3 B3 D3'),makeProfile('guitar6','E2 E2 D3 G3 B3 E4')]){
  const pages=betaCourses(p,betaCatalog(p)).get('gd-04').pages;
  assert.equal(pages.some(x=>x.id==='height-strings'),ascendingTuning(p));
  assert.equal(pages.some(x=>x.id==='g-b-interval'),standardGuitar(p));
  assert.deepEqual(pages.find(x=>x.id==='height-frets').listen,[p.tuning[0],p.tuning[0]+2,p.tuning[0]+4]);
 }
});
test('discovery names only the selected wrong position without recording evaluated answers',()=>{
 const c=Object.create(PilotController.prototype);const session={stage:'discovery',explored:[]};
 Object.defineProperties(c,{introduction:{value:null},profile:{value:profile},module:{value:{focus:[target]}},notation:{value:'international'}});
 Object.assign(c,{session,save(){},emit(){},host:{playNote(){}}});c.neckTap(0,1);
 assert.equal(c.feedback.position.midi,41);assert.match(c.feedback.text,/F2/);assert.deepEqual(session.explored,[]);assert.equal(session.events,undefined);
});
test('mastery excludes aided timings and never infers data from a single position',()=>{
 const es=events(0,800);es[0].aids=['listen'];const m=masteryMetrics(es);assert.equal(m.count,23);assert.equal(m.rows.length,1);assert.equal(m.mean,800);
 assert.equal(masteryMetrics([]).mean,null);
});
