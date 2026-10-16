import test from 'node:test';
import assert from 'node:assert/strict';
import {PilotController} from '../pilot-ui.js';
import {makeProfile} from '../core.js';
import {pilotPlan,practiceActivities,questionsFor} from '../pilot.js';
test('Compact results put navigation directly after stars and keep the other direction a separate activity',()=>{
 const profile=makeProfile('guitar6'),c=new PilotController({getState:()=>({profile,notation:'international',sound:false}),icon:()=>''}),module=practiceActivities(pilotPlan(profile))[0],queue=questionsFor(module);
 c.session={id:'result',activity:module.id,queue,events:queue.map(q=>({...q,correct:true,aids:[],ms:3000})),stage:'result'};const html=c.result();assert.match(html,/compact-result/);assert.ok(html.indexOf('result-actions')>html.indexOf('score-details'));assert.ok(html.indexOf('result-actions')<html.indexOf('score-strip'));assert.match(html,/data-module="opens-find"/);assert.doesNotMatch(html,/pilot-results|premières réponses correctes|validation-target/);
});
