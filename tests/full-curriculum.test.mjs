import test from 'node:test';import assert from 'node:assert/strict';
import{PilotController}from'../pilot-ui.js';import{initialState}from'../state.js';
import{makeProfile,INSTRUMENTS}from'../core.js';import{betaCatalog}from'../beta-catalog.js';import{betaCourses}from'../beta-courses.js';import{initialPilotStore,validatePilotStore,questionsFor,positionKey}from'../pilot.js';import{simulatedBetaCompletion}from'../debug-mode.js';
test('Full curriculum covers 0–24, every physical string, adjacent duo, and both mixed ranges',()=>{
 for(const i of INSTRUMENTS){const p=makeProfile(i.id),c=betaCatalog(p),courses=betaCourses(p,c);
  assert.equal(c.scopes.filter(s=>s.kind==='zone').length,6);assert.equal(c.scopes.filter(s=>s.kind==='string').length,p.tuning.length*2);assert.equal(c.scopes.filter(s=>s.kind==='duo').length,p.tuning.length-1);assert.equal(c.allPositions.length,p.tuning.length*25);
  assert.equal(new Set(c.activities.map(a=>a.id)).size,c.activities.length);
  for(const s of c.scopes){assert.equal(s.plan.all.length,(s.zone.end-s.zone.start+1)*(s.strings?.length||p.tuning.length));const end=s.plan.modules.find(m=>m.fullEnd);assert.deepEqual(new Set(end.pool.map(positionKey)),new Set(s.plan.all.map(positionKey)));
   for(const ch of s.chapters)if(ch.courseId){const course=courses.get(ch.courseId);assert.ok(course);for(const page of course.pages)if(page.quiz?.target){assert.equal(page.quiz.target.midi,p.tuning[page.quiz.target.string]+page.quiz.target.fret);assert.ok(page.quiz.target.fret>=s.zone.start&&page.quiz.target.fret<=s.zone.end);}}
   for(const id of s.activityIds){const a=c.activities.find(a=>a.id===id),qs=questionsFor(a,{random:()=>.32});assert.ok(qs.length>=20&&qs.length<=30);assert.ok(qs.every(q=>q.target.fret>=s.zone.start&&q.target.fret<=s.zone.end));}
  }
 }
});
test('New navigation routes and discoveries round-trip; historical beta remains unchanged',()=>{
 const p=makeProfile('guitar8'),c=betaCatalog(p,{full:true}),store=initialPilotStore();store.profiles[p.key]={profile:p,attempts:[],later:[],navigation:{branch:'targeted',route:'c24s8',chapter:'c24s8-entry'},discoveredModules:c.discoveries.map(d=>d.baseId)};assert.equal(validatePilotStore(store).profiles[p.key].navigation.route,'c24s8');assert.equal(betaCatalog(p,{full:false}).scopes.length,6);assert.equal(betaCatalog(p).scopes.length,c.scopes.length);
});

test('Normal gameplay exposes the complete catalogue without a URL preview flag',()=>{
 const profile=makeProfile('guitar6'),p=new PilotController({getState:()=>({...initialState(),profile})});
 assert.equal(p.catalog.scopes.length,25);
 for(const id of ['z6','cs6','c24s6','duo5','mix12','mix24'])assert.ok(p.catalog.byScope.has(id),id);
});
