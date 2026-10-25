import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesCollectionFilter} from '../achievements-ui.js';
import {preferences} from '../state.js';
import {melodyById,catalogMelodies} from '../melodies.js';
import {rewardFor} from '../reward-music.js';
import {makeProfile} from '../core.js';
import {betaCatalog} from '../beta-catalog.js';
import {achievementContext} from '../achievement-rules.js';
import {MUSIC_CARD_NUMBERS} from '../achievement-catalog.js';
test('Collection separates untouched, underway and earned, including a retained 100% proof',()=>{
 const defs=[{progress:{percent:0}},{progress:{percent:50}},{progress:{percent:100}},{progress:{percent:100},obtained:{at:1}}];
 assert.deepEqual(defs.map(d=>matchesCollectionFilter(d,'missing')),[true,false,false,false]);
 assert.deepEqual(defs.map(d=>matchesCollectionFilter(d,'started')),[false,true,true,false]);
 assert.deepEqual(defs.map(d=>matchesCollectionFilter(d,'earned')),[false,false,false,true]);
 assert.ok(defs.every(d=>matchesCollectionFilter(d,'all')));
 assert.equal(preferences({collection:{filter:'started'}}).collection.filter,'started');
});
test('Supplied Seven Nation rhythm includes dotted eighth, sixteenth and the eighth rest',()=>{
 const r=rewardFor(melodyById('seven-nation'));
 assert.deepEqual(r.events.map(e=>[e.start,e.beats]),[[0,1.5],[1.5,.5],[2,.75],[2.75,.25],[3.5,.5],[4,2],[6,1]]);
 assert.equal(r.totalBeats,8);
});
test('Around the World descent is detached without shifting its onsets',()=>{
 const r=rewardFor(melodyById('around-world'));
 assert.deepEqual(r.events.slice(16).map(e=>e.start),[12,12.5,13,13.5,14,14.5,15]);
 assert.deepEqual(r.events.slice(16).map(e=>e.beats),[.25,.25,.25,.25,.25,.25,.5]);
 assert.equal(r.totalBeats,16);
});
test('Feel Good Inc replaces Cantaloupe in assignments but preserves old acquired cards',()=>{
 const profile=makeProfile('guitar6'),catalog=betaCatalog(profile),assigned=[...catalogMelodies(catalog).values()];
 assert.ok(assigned.some(m=>m.id==='feel-good-inc'));
 assert.ok(!assigned.some(m=>m.id==='cantaloupe-island'));
 assert.equal(MUSIC_CARD_NUMBERS['cantaloupe-island'],'M027');
 assert.equal(MUSIC_CARD_NUMBERS['feel-good-inc'],'M028');
 const r=rewardFor(melodyById('feel-good-inc'));assert.equal(r.step,60/139);assert.equal(r.events[0].midi,27);assert.ok(r.events.every(e=>e.voice==='bass-electric'));
 const old={id:'music-cantaloupe-island',musicId:'cantaloupe-island',scope:'global',profileKey:profile.key,activity:'mix-3-find',shift:0,at:123,version:1};
 const card=achievementContext({profile,catalog,data:{attempts:[]},existing:[old]}).definitions.find(d=>d.music?.id==='cantaloupe-island');assert.equal(card.obtained.at,123);assert.ok(rewardFor(card.music));
});
