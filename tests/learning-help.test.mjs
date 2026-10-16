import test from 'node:test';
import assert from 'node:assert/strict';
import {PilotController} from '../pilot-ui.js';
import {makeProfile} from '../core.js';
import {pilotPlan,questionsFor} from '../pilot.js';
import {introductionFor,helpGraphic,intervalSensation} from '../learning-help.js';
const profile=makeProfile('guitar6');
function controller(activity='opens'){
 const c=new PilotController({getState:()=>({profile,notation:'international',sound:false})}),module=pilotPlan(profile).modules.find(m=>m.id===activity);c.session={activity,stage:'discovery',queue:questionsFor(module),index:0,explored:[]};return c;
}
test('Green corrections distinguish E2 from E4 and include exact-height unisons',()=>{
 const c=controller();c.session.stage='practice';c.session.queue=[{mode:'name',target:{string:0,fret:0,midi:40}}];c.feedback={correct:true};assert.deepEqual(c.greenPositions().map(p=>p.midi),[40]);
 c.session.stage='discovery';c.feedback={correct:true,position:{string:5,fret:0,midi:64}};assert.deepEqual(c.greenPositions().map(p=>p.midi),[64]);
 c.session.stage='practice';c.session.queue=[{mode:'find',target:{string:4,fret:0,midi:59},scope:'height'}];assert.equal(c.greenPositions().length,2);assert.ok(c.greenPositions().every(p=>p.midi===59));
});
test('Every new interval has a listening description and a graphical example only on first encounter',()=>{
 for(const m of pilotPlan(profile).modules.filter(m=>m.kind==='interval')){const help=introductionFor(m,'discovery',null,[]);assert.ok(help);assert.ok(intervalSensation(m.delta).length>80);assert.match(helpGraphic(help,m,profile),/<svg/);assert.equal(introductionFor(m,'discovery',null,[help.key]),null);}
});
test('Every interaction format has an explicit example and respects muted recall differences',()=>{
 const m=pilotPlan(profile).modules[0];for(const [stage,question,activity] of [['discovery',null,'opens'],['practice',{mode:'name'},'opens'],['practice',{mode:'find'},'opens'],['practice',{mode:'name',evaluation:true},'natural-diagnostic'],['motif',null,'opens'],['motif',null,'natural-diagnostic']]){const help=introductionFor(m,stage,question,[],activity);assert.ok(help);assert.match(helpGraphic(help,m,profile),/role="img"/);assert.equal(introductionFor(m,stage,question,[help.key],activity),null);}
});
test('Every lesson is available from the home page even without any passed activity',()=>{
 const c=controller(),html=c.home();assert.doesNotMatch(html,/data-module="degree-5" disabled/);assert.match(html,/Toutes les activités sont accessibles/);assert.doesNotMatch(html,/90 % de premières réponses correctes pour la suite/);
});
test('A demonstration toggles without awarding explored notes or completing the activity',()=>{
 const c=controller();c.data.seenInstructions=['explore'];c.host.stopAudio=()=>{};c.host.playNote=()=>{};c.host.showPilot=()=>{};
 c.action('discovery-reveal',{});assert.equal(c.session.revealed,true);assert.deepEqual(c.session.explored,[]);assert.notEqual(c.session.discoveryDone,true);c.action('discovery-reveal',{});assert.equal(c.session.revealed,false);
});

test('The six-semitone listening cue fits both augmented fourths and diminished fifths',()=>{
 const augmented=pilotPlan(makeProfile('guitar6','F2 A2 D3 G3 B3 E4')).modules.find(m=>m.degree===4),diminished=pilotPlan(makeProfile('guitar7')).modules.find(m=>m.degree===5);
 const fourth=introductionFor(augmented,'discovery',null,[]),fifth=introductionFor(diminished,'discovery',null,[]);assert.match(fourth.title,/quarte augmentée/);assert.match(fifth.title,/quinte diminuée/);assert.match(fourth.text,/triton/);assert.doesNotMatch(fourth.text,/quinte diminuée/);
});
