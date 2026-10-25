import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,neckGeometry} from '../core.js';
import {pilotPlan,practiceActivities} from '../pilot.js';
import {bugConfiguration} from '../bug-report.js';
import {PilotController} from '../pilot-ui.js';

test('Cumulative capstone titles follow natural completion for each actual tuning',()=>{
 for(const p of [makeProfile('guitar6'),makeProfile('guitar7'),makeProfile('bass4'),makeProfile('guitar6','D2 A2 D3 G3 A3 D4'),makeProfile('guitar6','D#2 G#2 C#3 F#3 A#3 D#4')]){
  const plan=pilotPlan(p),acts=practiceActivities(plan);const naturalEnd=plan.order.filter(n=>[0,2,4,5,7,9,11].includes(n)).at(-1),last=plan.order.at(-1);
  assert.equal(acts.find(m=>m.id==='mix-'+naturalEnd).title,'Toutes les notes naturelles');
  assert.equal(acts.find(m=>m.id==='mix-'+last).title,'Toutes les notes');
  assert.ok(plan.natural.every(p=>acts.find(m=>m.id==='mix-'+naturalEnd).pool.some(q=>q.midi===p.midi&&q.string===p.string&&q.fret===p.fret)));
 }
});
test('Only new-exercise diagrams shorten the open-string slot by a third',()=>{
 for(const n of [4,5,6,7,8]){assert.equal(neckGeometry(n,4,648,{lesson:true}).openWidth,38*2/3);assert.equal(neckGeometry(n,4).openWidth,18);assert.equal(neckGeometry(n,4,648,{gameplay:true}).openWidth,18);}
});
test('Bug configuration excludes destination, history and browser fingerprint',()=>{
 const c=bugConfiguration({release:'0.22.0',profile:makeProfile('guitar6'),theme:'dark',viewport:[375,812],standalone:true});assert.equal(c.release,'0.22.0');assert.equal(c.viewport,'375 × 812');assert.equal(c.standalone,'oui');assert.deepEqual(Object.keys(c).sort(),['instrument','release','standalone','theme','tuning','viewport']);
});
test('Incorrect neck feedback draws only the requested pitch, independently of wheel feedback',()=>{
 const profile=makeProfile('guitar6'),c=new PilotController({getState:()=>({profile,notation:'international',sound:false})});c.session={activity:'note-4',stage:'practice',queue:[{mode:'name',answerKind:'pitch',target:{string:0,fret:0,midi:40}}],index:0};c.addEffect({correct:false,target:{string:0,fret:0,midi:40},value:52,mode:'name'});
 const neck=c.echoMarkup(c.geometry),wheel=c.wheel();assert.equal((neck.match(/class="echo-dot /g)||[]).length,1);assert.match(neck,/tone-wrong/);assert.match(neck,/E2/);assert.ok(!neck.includes('E3'));
 assert.match(wheel,/wheel-echo wrong[^>]+>E3/);assert.match(wheel,/wheel-echo [^>]+>E2/);
});

// These checks compare the exercise to the phrase actually played, including silence.
import {MELODIES,melodyById,melodiesForPlan} from '../melodies.js';
import {rewardFor,isCompletePhrase} from '../reward-music.js';
import {MUSIC_AUDIT} from '../music-audit.js';
import {evaluateAchievements} from '../achievement-rules.js';
test('No uncertain passage is assigned or played, even through a saved collection',()=>{
 for(const id of Object.keys(MUSIC_AUDIT.pending)){assert.equal(isCompletePhrase(id),false);assert.equal(rewardFor(melodyById(id)),null);const profile=makeProfile('guitar6'),entry={id:'audit',activity:'note-4-find',at:1,finished:true,passed:true,motifCompleted:true,melodyId:id,music:{shift:0},events:Array.from({length:20},()=>({mode:'find',target:{string:0,fret:0,midi:40},correct:true,ms:800,aids:[]}))};assert.ok(!evaluateAchievements({profile,plan:pilotPlan(profile),entry,attempts:[entry],existing:[]}).some(u=>u.musicId===id));}
 for(const m of melodiesForPlan(pilotPlan(makeProfile('guitar6'))).values())assert.ok(MUSIC_AUDIT.checked.includes(m.id));
});
test('Every audible exercise prefix matches the corresponding full listening phrase exactly',()=>{
 for(const m of MELODIES.filter(m=>isCompletePhrase(m.id))){const r=rewardFor(m),lead=r.events.filter(e=>e.velocity===1);let beat=0;
  for(let i=0;i<m.notes.length;i++){assert.equal(lead[i].midi-r.registerShift,m.notes[i],m.id+' pitch '+i);assert.equal(lead[i].beats,m.beats[i],m.id+' duration '+i);assert.ok(Math.abs(lead[i].start-beat)<1e-8,m.id+' silence '+i);beat+=m.beats[i]+(m.rests?.[i]||0);}
 }
});
test('Source-checked riffs respect their bar lengths and explicit rests',()=>{
 for(const [id,duration] of [['higher-ground',8],['my-sharona',16],['around-world',16],['smoke-water',16],['iron-man',8],['seven-nation',8]]){
  const r=rewardFor(melodyById(id)),lead=r.events.filter(e=>e.velocity===1);const actual=Math.max(...lead.map(e=>e.start+e.beats));assert.ok(Math.abs(r.totalBeats-duration)<1e-9,id);assert.ok(Math.abs(actual-(id==='smoke-water'?15:id==='around-world'?15.5:id==='seven-nation'?7:duration))<1e-9,id);
 }
});
