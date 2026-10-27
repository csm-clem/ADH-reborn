import test from 'node:test';
import assert from 'node:assert/strict';
import {parentNavigation} from '../navigation-rules.js';
import {rewardFor} from '../reward-music.js';
import {melodyById,catalogMelodies} from '../melodies.js';
import {betaCatalog} from '../beta-catalog.js';
import {makeProfile} from '../core.js';
test('Parent navigation retains the chosen branch and never renumbers a route',()=>{
 const chapter={branch:'guided',route:'guided',chapter:'z1-natural'};
 assert.deepEqual(parentNavigation(chapter),{branch:'guided',route:'guided',chapter:null});
 assert.deepEqual(parentNavigation(parentNavigation(chapter)),{branch:'guided',route:null,chapter:null});
 assert.deepEqual(parentNavigation({branch:'targeted'}),{branch:null,route:null,chapter:null});
 assert.equal(parentNavigation({}),null);assert.deepEqual(parentNavigation({route:'z1',chapter:null}),{branch:'targeted',route:null,chapter:null});
});
test('Seven Nation triplet has equal sounding durations and equal silent gaps',()=>{
 const r=rewardFor(melodyById('seven-nation')),triplet=r.events.slice(2,5);
 assert.deepEqual(triplet.map(e=>e.beats),[1/3,1/3,1/3]);
 for(let i=2;i<5;i++)assert.ok(Math.abs(r.events[i+1].start-r.events[i].start-2/3)<1e-10);
 assert.equal(r.totalBeats,8);
});
test('Around the World rises C-D-E over notes 11 to 13',()=>{
 assert.deepEqual(rewardFor(melodyById('around-world')).events.slice(10,13).map(e=>e.midi),[36,38,40]);
});
test('Feel Good Inc. keeps the score rests, tie and staccato in its original recorded key',()=>{
 const r=rewardFor(melodyById('feel-good-inc'));
 assert.deepEqual(r.events.map(e=>e.start),[0,1.5,2,2.5,3.5,4.5,8,9.5,10,10.5,11.5,12.5]);
 assert.equal(r.events[5].beats,3.5);assert.equal(r.totalBeats,16);assert.equal(r.events[0].midi,27);
 assert.equal(r.events[0].beats,.5);assert.equal(r.events[6].beats,.5);
});
test('Immigrant Song is assignable again and its vocal comes after a guitar exposition',()=>{
 const r=rewardFor(melodyById('immigrant-song'));
 assert.ok(r.hasHarmony);assert.equal(r.totalBeats,32);
 const voice=r.events.filter(e=>e.voice==='guitar-clean'),riff=r.events.filter(e=>e.voice==='guitar-driven');
 assert.equal(voice[0].start,15);assert.equal(voice[0].midi,73);assert.ok(riff.some(e=>e.start===16));
 assert.deepEqual([...new Set(riff.map(e=>e.midi))],[42,54]);
 const assigned=[...catalogMelodies(betaCatalog(makeProfile('guitar6'))).values()];
 assert.ok(assigned.some(m=>m.id==='immigrant-song'));
});
