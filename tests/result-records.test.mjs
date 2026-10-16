import test from 'node:test';
import assert from 'node:assert/strict';
import {resultMetrics,personalRecord,comparisonKey,mistakeGroups} from '../results.js';
const events=(correct,ms=1000,total=20)=>Array.from({length:total},(_,i)=>({correct:i<correct,ms,aids:[],retry:false,mode:'name',target:{string:0,fret:0,midi:40},firstAnswer:i<correct?4:2}));
const attempt=(id,activity,correct,ms)=>({id,activity,finished:true,events:events(correct,ms)});
test('Personal records only compare this exact exercise, never the other response direction',()=>{
 const s=attempt('new','opens',18,1200);assert.equal(personalRecord(s,[attempt('other','opens-find',20,200)]).kind,'first');assert.equal(personalRecord(s,[attempt('other','degree-5',20,200),attempt('old','opens',17,200)]).kind,'accuracy');assert.equal(personalRecord(s,[s]).kind,'first');
});
test('Precision takes precedence over speed, and equal-precision records compare correct-answer medians',()=>{
 const s=attempt('new','opens',19,900),old=attempt('old','opens',19,1000);assert.equal(personalRecord(s,[old]).kind,'speed');assert.equal(personalRecord(attempt('new','opens',18,100),[old]).kind,'none');assert.equal(personalRecord(attempt('new','opens',19,1100),[old]).kind,'none');assert.equal(personalRecord(attempt('new','opens',20,4000),[old]).kind,'accuracy');
});
test('Wrong answers, retries and aided timings cannot inflate result speed or precision',()=>{
 const e=events(2,1000,4);e[0].ms=500;e[1].ms=1500;e[2].ms=1;e[3].ms=1;e.push({...e[0],retry:true,ms:1});assert.deepEqual(resultMetrics(e),{total:4,correct:2,accuracy:.5,medianMs:1000});assert.equal(resultMetrics(events(0)).medianMs,null);assert.equal(resultMetrics([{correct:true,ms:100,aids:['listen'],retry:false}]).medianMs,null);
});
test('Targeted review records stay scoped to the source exercise and the selected note positions',()=>{
 const s={...attempt('new','review-targeted',20,500),reviewSource:'opens',reviewPool:[{string:0,fret:0}]},old={...attempt('old','review-targeted',20,200),comparisonKey:'review-targeted:degree-5:0:0'};assert.equal(comparisonKey(s),'review-targeted:opens:0:0');assert.equal(personalRecord(s,[old]).kind,'first');
});
test('Repeated mistakes are grouped without losing their count or first response',()=>{
 const a=events(0,1000,3);a[2].firstAnswer=5;const groups=mistakeGroups(a);assert.equal(groups.length,2);assert.equal(groups[0].count,2);assert.equal(groups[0].firstAnswer,2);
});
