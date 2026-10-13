import test from 'node:test';
import assert from 'node:assert/strict';
import {FIVE_STAR_MEDIAN_MS,score,nextMilestone,makeProfile,lessons,microCourse} from '../core.js';
test('Five stars require all correct answers and a median no greater than one second',()=>{
 assert.equal(FIVE_STAR_MEDIAN_MS,1000);
 const attempt=ms=>Array.from({length:12},()=>({correct:true,ms}));
 assert.equal(score(attempt(999)).stars,5);
 assert.equal(score(attempt(1000)).stars,5);
 assert.equal(score(attempt(1001)).stars,4);
 assert.equal(score(attempt(1500)).stars,4);
 assert.equal(nextMilestone(attempt(1001)).complete,undefined);
 assert.match(nextMilestone(attempt(1001)).label,/1 s/);
 assert.equal(nextMilestone(attempt(1000)).complete,true);
 assert.equal(score(attempt(1000).map((a,i)=>({...a,correct:i!==0}))).stars,3);
});
test('All micro-lessons illustrate their own neck positions and describe the fixed horizontal orientation',()=>{
 for(const id of ['guitar6','guitar7','guitar8','bass4','bass5','bass6']){
  const p=makeProfile(id);
  for(const l of lessons(p))assert.equal(microCourse(p,l).diagram,true,l.id);
  assert.match(microCourse(p,lessons(p)[0]).principle,/en bas du dessin, en paysage comme en portrait/);
 }
});
