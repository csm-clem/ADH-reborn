import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,lessons,microCourse,nextMilestone,score} from '../core.js';
test('Micro-lessons have distinct complete sentences throughout the curriculum',()=>{
 const p=makeProfile('guitar8'),seen=new Set();
 for(const l of lessons(p)){
   const course=microCourse(p,l);
   for(const field of ['principle','example','goal'])for(const sentence of course[field].split(/(?<=[.!?])\s+/)){
     assert.ok(!seen.has(sentence),`Repeated sentence in ${l.id}: ${sentence}`);seen.add(sentence);
   }
 }
});
test('Diagram orientation comes first; string tuning is introduced on the next physical string',()=>{
 const p=makeProfile('guitar6'),list=lessons(p);
 const first=microCourse(p,list[0]);assert.equal(first.diagram,true);
 assert.match(first.principle,/épaisse/);assert.match(first.principle,/portrait/);
 assert.doesNotMatch(first.example,/E · A|corde.*E/);
 const second=microCourse(p,list.find(l=>l.id==='s1-first'));
 assert.match(second.principle,/accordage/);assert.match(second.example,/E · A · D · G · B · E/);
 const custom=makeProfile('guitar7','B1 F#2 B2 E3 A3 C#4 F#4');
 assert.match(microCourse(custom,lessons(custom).find(l=>l.id==='s1-first')).example,/B · F♯ · B · E · A · C♯ · F♯/);
});
test('Next milestone uses the actual success threshold and distinguishes mastery from validation',()=>{
 const attempt=(n,correct,ms)=>Array.from({length:n},(_,i)=>({correct:i<correct,ms}));
 let a=attempt(12,10,6000);assert.equal(score(a).stars,2);assert.equal(nextMilestone(a).required,11);
 a=attempt(12,11,6000);assert.equal(nextMilestone(a).stars,4);assert.equal(nextMilestone(a).required,12);
 a=attempt(20,19,2000);assert.equal(nextMilestone(a).stars,5);
 a=attempt(12,12,1400);assert.equal(nextMilestone(a).complete,true);
});
