import test from 'node:test';
import assert from 'node:assert/strict';
import {score,makeProfile,neckGeometry} from '../core.js';
import {pilotPlan} from '../pilot.js';
import {resultMetrics} from '../results.js';
import {DEMO_RULES} from '../demo-rules.js';
import {rewardFor} from '../reward-music.js';
test('An outlier changes the mean and prevents five stars despite a fast median',()=>{const events=[100,100,100,100,6000].map(ms=>({correct:true,ms}));assert.equal(score(events).meanMs,1280);assert.equal(score(events).stars,4);assert.equal(resultMetrics(events).meanMs,1280);});
test('The family curriculum never changes an altered open string to invent a tonic',()=>{for(const note of ['C#2','D#2','F#2','G#2','A#2']){const p=makeProfile('guitar6',`${note} E3 A3 D4 G4 B4`),t=[...p.tuning],plan=pilotPlan(p);assert.equal(plan.opens[0].midi,t[0]);assert.ok(plan.order.indexOf(t[0]%12)>=7);assert.deepEqual(p.tuning,t);}});

test('Only gameplay geometry widens string spacing',()=>{const mini=neckGeometry(6),game=neckGeometry(6,4,648,{gameplay:true});assert.equal(mini.width,game.width);assert.ok(Math.abs(game.ys[0]-game.ys[1])>Math.abs(mini.ys[0]-mini.ys[1]));});
test('The demo policy names examples and only selected discoveries, never unrelated points',()=>{assert.ok(Object.isFrozen(DEMO_RULES));const m=pilotPlan(makeProfile('guitar6')).modules.find(m=>m.id==='note-4');assert.deepEqual(DEMO_RULES.points(m).map(p=>p.midi),[40,52,64]);assert.deepEqual(DEMO_RULES.points(m,{explored:[]}),[]);assert.deepEqual(DEMO_RULES.points(m,{explored:['2:2']}).map(p=>p.midi),[52]);assert.equal(DEMO_RULES.showNames,true);});

test('Musical rewards use their sourced voice without invented accompaniment',()=>{for(const id of ['billie-jean','bites-dust','bride','entertainer','rainbow','trek']){const r=rewardFor({id,title:id,shift:-12});assert.ok(r.durationMs>3000);assert.ok(r.events.every(e=>Number.isFinite(e.start)&&e.start>=0&&e.beats>0&&e.midi>=12&&e.midi<=119));assert.equal(r.hasHarmony,false);assert.ok(r.events.every(e=>e.velocity===1));}for(const id of ['twinkle','cuckoo','frere'])assert.equal(rewardFor({id}),null);assert.equal(rewardFor(null),null);});
