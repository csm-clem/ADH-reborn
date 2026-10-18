import test from 'node:test';
import assert from 'node:assert/strict';
import {CURRICULUM_RULES} from '../curriculum-rules.js';
import {makeProfile,noteName,pitchLabel} from '../core.js';
import {pilotPlan,practiceActivities,questionsFor} from '../pilot.js';
import {PilotController} from '../pilot-ui.js';
test('All four future zones apply the same policy and cover each real fret without crossing zone limits',()=>{
 assert.ok(Object.isFrozen(CURRICULUM_RULES));for(const zone of CURRICULUM_RULES.zones){const plan=pilotPlan(makeProfile('guitar7'),{zone});assert.equal(plan.all.length,35);assert.equal(plan.learned.length,35);for(const m of practiceActivities(plan)){assert.ok(m.pool.every(p=>p.fret>=zone.start&&p.fret<=zone.end));assert.ok(questionsFor(m).every(q=>q.zone.start===zone.start));}}
});
test('Isolated exercises never contain previous families while mixtures include every learned position',()=>{
 for(const profile of [makeProfile('guitar6'),makeProfile('guitar8'),makeProfile('bass4'),makeProfile('guitar6','D2 A2 D3 G3 A3 D4')]){const plan=pilotPlan(profile);let learned=plan.opens.filter(p=>CURRICULUM_RULES.naturals.includes(p.midi%12));for(const pc of plan.order){const isolate=plan.modules.find(m=>m.id==='note-'+pc),mix=plan.modules.find(m=>m.id==='mix-'+pc);assert.ok(questionsFor(isolate).every(q=>q.target.midi%12===pc));for(const p of learned)assert.ok(mix.pool.some(q=>q.string===p.string&&q.fret===p.fret));const qs=questionsFor(mix);assert.ok(qs.filter(q=>q.target.midi%12===pc).length>=Math.ceil(qs.length*.2));learned=mix.pool;}}
});
test('Enharmonic spelling changes labels without changing pitch or octave',()=>{
 assert.equal(noteName(61,'international','flat'),'D♭');assert.equal(noteName(66,{system:'latin',accidentals:'flat'}),'Sol♭');assert.equal(pitchLabel(58,{system:'international',accidentals:'flat'}),'B♭3');assert.equal(noteName(64,'international','flat'),'E');
});
test('Errors hold their label for 500 ms, fade over 560 ms, and never block the next answer',()=>{
 const profile=makeProfile('guitar6'),c=new PilotController({getState:()=>({profile,notation:'international',sound:false}),showPilot(){},playNote(){}}),m=practiceActivities(pilotPlan(profile))[0];c.session={activity:m.id,stage:'practice',queue:questionsFor(m),index:0,events:[]};c.data.seenInstructions=['name','name-pitch'];c.answer((c.question.target.midi+1)%12);assert.equal(c.session.index,1);assert.equal(c.effectLifetime(c.effects[0]),1060);assert.ok(parseFloat(c.effectStyle(c.effects[0]).split(':')[1])>450);c.answer(c.question.answerKind==='pitch'?c.question.target.midi:c.question.target.midi%12);assert.equal(c.session.index,2);assert.equal(c.effectLifetime(c.effects[1]),560);
});
test('A melody must be played as an uninterrupted chain and the last correct note automatically starts its full reward after the last note has sounded',async(t)=>{
 t.mock.timers.enable({apis:['setTimeout']});
 const profile=makeProfile('guitar6'),sounds=[],arrangements=[],c=new PilotController({getState:()=>({profile,notation:'international',sound:true}),showPilot(){},playNote:n=>sounds.push(n),playArrangement:r=>{arrangements.push(r);return Promise.resolve(true);},stopAudio(){}}),m=practiceActivities(pilotPlan(profile)).find(m=>m.id==='note-4-find');c.session={id:'musical',activity:m.id,stage:'motif',queue:questionsFor(m),index:20,events:[],motifIndex:0,motifErrors:0};c.data.seenInstructions=['motif','melody-note-4'];c.finish=function(){this.session.stage='result';};const sequence=c.motif();c.neckTap(sequence[0].string,sequence[0].fret);assert.equal(c.session.motifIndex,1);c.neckTap(sequence[1].string,sequence[1].fret+1);assert.equal(c.session.motifIndex,0);assert.equal(c.session.motifErrors,1);assert.equal(arrangements.length,0);for(const p of sequence)c.neckTap(p.string,p.fret);assert.equal(arrangements.length,0);assert.equal(sounds.at(-1),sequence.at(-1).midi);t.mock.timers.tick(299);assert.equal(arrangements.length,0);t.mock.timers.tick(1);await Promise.resolve();assert.equal(arrangements.length,1);assert.equal(arrangements[0].completePhrase,true);assert.ok(arrangements[0].events.length>sequence.length);assert.equal(c.session.motifCompleted,true);c.rewardEpoch++;
});
