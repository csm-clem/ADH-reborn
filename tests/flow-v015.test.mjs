import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,NECK_STYLE,neckGeometry} from '../core.js';
import {pilotPlan,practiceActivities,questionsFor,positionKey} from '../pilot.js';
import {PilotController} from '../pilot-ui.js';
import {positionProgress,progressView} from '../progress.js';
import {initialState,validateState} from '../state.js';
import {searchFeedback} from '../discovery-feedback.js';
import {miniatureNeck} from '../neck-view.js';
test('Every cumulative series guarantees 20% new positions and retains earlier lessons across tunings',()=>{
 for(const profile of [makeProfile('guitar6'),makeProfile('guitar7'),makeProfile('bass5'),makeProfile('guitar6','D2 A2 D3 G3 A3 D4')]){
  let previous=[];for(const m of practiceActivities(pilotPlan(profile)).filter(m=>m.mode==='name')){
   assert.ok(previous.every(p=>m.practicePool.some(q=>positionKey(p)===positionKey(q))));
   for(let seed=1;seed<=50;seed++){let n=seed;const random=()=>((n=n*16807%2147483647)-1)/2147483646,qs=questionsFor(m,{random});assert.ok(qs.length>=20&&qs.length<=30);assert.ok(qs.filter(q=>m.newPositions.some(p=>positionKey(p)===positionKey(q.target))).length>=Math.ceil(qs.length*.2));assert.ok(qs.every(q=>m.practicePool.some(p=>positionKey(p)===positionKey(q.target))));}
   previous=m.practicePool.filter(p=>[0,2,4,5,7,9,11].includes(p.midi%12));
  }
 }
});
test('Rapid correct and incorrect responses advance immediately while several effects coexist',()=>{
 const profile=makeProfile('guitar6'),sounds=[],c=new PilotController({getState:()=>({profile,notation:'international',sound:true}),playNote:n=>sounds.push(n),stopAudio:()=>{},showPilot:()=>{}}),m=practiceActivities(pilotPlan(profile))[0];c.session={activity:m.id,stage:'practice',queue:questionsFor(m),index:0,events:[]};c.data.seenInstructions=['name'];c.answer(c.question.target.midi%12);c.answer((c.question.target.midi+1)%12);c.answer(c.question.target.midi%12);
 assert.equal(c.session.index,3);assert.equal(c.session.events.length,3);assert.equal(c.effects.length,3);assert.equal(sounds.length,2);assert.equal(c.feedback,null);assert.equal(c.entering,false);
});
test('A hint marks the attempt as aided, and disappears after one answer',()=>{
 const profile=makeProfile('guitar6'),c=new PilotController({getState:()=>({profile,notation:'international',sound:false}),playNote:()=>{},showPilot:()=>{}}),m=practiceActivities(pilotPlan(profile))[0];c.session={activity:m.id,stage:'practice',queue:questionsFor(m),index:0,events:[]};c.data.seenInstructions=['name'];c.action('hint',{});assert.ok(c.aids.includes('open-names'));c.answer(c.question.target.midi%12);assert.ok(c.session.events[0].aids.includes('open-names'));assert.equal(c.aids.length,0);
});
test('85% remains to review, 90% is worked; every chromatic position appears in the map',()=>{
 const events=Array.from({length:20},(_,i)=>({target:{string:0,fret:0,midi:40},mode:'name',correct:i<17,ms:100,aids:[]}));assert.equal(positionProgress(events,0,0).status,'review');events[17].correct=true;assert.equal(positionProgress(events,0,0).status,'worked');assert.equal((progressView(makeProfile('guitar6'),[],[]).match(/class="progress-cell /g)||[]).length,30);
});
test('System theme round-trips, and all small necks use the common geometry and inlays',()=>{
 assert.equal(validateState({...initialState(),theme:'system'}).theme,'system');const profile=makeProfile('guitar6'),g=neckGeometry(6,4);assert.equal(g.openWidth,18);assert.equal((g.width-g.fadeStart)/(g.frets[5]-g.frets[4]),.5);assert.ok(miniatureNeck(profile).includes('r="'+NECK_STYLE.inlayRadius+'"'));assert.match(searchFeedback({midi:41},{midi:40},0),/aigu/);assert.match(searchFeedback({midi:40},{midi:41},1),/grave/);
});
