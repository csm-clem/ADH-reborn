import test from 'node:test';
import assert from 'node:assert/strict';
import {PilotController} from '../pilot-ui.js';
import {makeProfile} from '../core.js';
import {pilotPlan,questionsFor} from '../pilot.js';
import {introductionFor,helpGraphic} from '../learning-help.js';
const profile=makeProfile('guitar6');
function controller(activity='opens'){
 const c=new PilotController({getState:()=>({profile,notation:'international',sound:false})}),module=pilotPlan(profile).modules.find(m=>m.id===activity);c.session={activity,stage:'discovery',queue:questionsFor(module),index:0,explored:[]};return c;
}
test('Green corrections distinguish E2 from E4 and include exact-height unisons',()=>{
 const c=controller();c.session.stage='practice';c.session.queue=[{mode:'name',target:{string:0,fret:0,midi:40}}];c.feedback={correct:true};assert.deepEqual(c.greenPositions().map(p=>p.midi),[40]);
 c.session.stage='discovery';c.session.explored=['5:0'];c.feedback={correct:true,position:{string:5,fret:0,midi:64}};assert.deepEqual(c.greenPositions().map(p=>p.midi),[64]);
 c.session.stage='practice';c.session.queue=[{mode:'find',target:{string:4,fret:0,midi:59},scope:'height'}];assert.equal(c.greenPositions().length,2);assert.ok(c.greenPositions().every(p=>p.midi===59));
});
test('Every family has a named visual lesson without intervals or half-step explanations',()=>{
 for(const m of pilotPlan(profile).modules.filter(m=>m.kind==='family')){const help=introductionFor(m,'discovery',null,[]);assert.ok(help);assert.doesNotMatch(help.title+' '+help.text,/intervalle|demi-ton/i);const html=helpGraphic(help,m,profile);assert.equal((html.match(/class="neck-point"/g)||[]).length,m.pool.length);assert.equal((html.match(/class="note-tag"/g)||[]).length,m.pool.length);assert.equal(introductionFor(m,'discovery',null,[help.key]),null);}
});

test('Every interaction format has an explicit example and respects muted recall differences',()=>{
 const m=pilotPlan(profile).modules[0];for(const [stage,question,activity] of [['discovery',null,'opens'],['practice',{mode:'name'},'opens'],['practice',{mode:'find'},'opens'],['practice',{mode:'name',evaluation:true},'natural-diagnostic'],['motif',null,'opens'],['motif',null,'natural-diagnostic']]){const help=introductionFor(m,stage,question,[],activity);assert.ok(help);assert.match(helpGraphic(help,m,profile),/role="img"/);assert.equal(introductionFor(m,stage,question,[help.key],activity),null);}
});
test('Every lesson is available from the home page even without any passed activity',()=>{
 const c=controller(),html=c.home();assert.doesNotMatch(html,/data-module="degree-5" disabled/);assert.equal((html.match(/class="branch-jumbo"/g)||[]).length,3);assert.doesNotMatch(html,/class="route-card"[^]*disabled/);assert.doesNotMatch(html,/90 % de premières réponses correctes pour la suite/);
});
test('Lesson search is unlimited, never reveals the target after a wrong try and remains unscored',()=>{
 const c=controller('note-11');c.host.playNote=()=>{};c.host.showPilot=()=>{};
 c.lessonTap(0,0);assert.equal(c.lessonTrial.correct,false);assert.equal(c.session.discoveryDone,undefined);assert.ok(c.lessonTrial.text.length);const target=c.module.focus[0];c.lessonTap(target.string,target.fret);assert.equal(c.lessonTrial.correct,true);assert.equal(c.session.discoveryDone,undefined);
});

test('The naming example explicitly includes the target in its answer choices',()=>{
 const m=pilotPlan(profile).modules.find(m=>m.id==='note-4'),q={mode:'name',target:m.pool[0]},help=introductionFor(m,'practice',q);assert.match(helpGraphic(help,{...m,demoQuestion:q},profile),/example-correct[^>]*>E2</);});
