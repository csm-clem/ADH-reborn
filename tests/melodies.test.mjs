import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,INSTRUMENTS,neckGeometry} from '../core.js';
import {pilotPlan} from '../pilot.js';
import {melodyFor} from '../melodies.js';
import {voiceCutoff} from '../sound.js';
test('Every sourced excerpt uses only exact pitches and positions from its exercise, under the thirty-response cap',()=>{
 for(const instrument of INSTRUMENTS)for(const module of pilotPlan(makeProfile(instrument.id)).modules){const m=melodyFor(module);if(!m)continue;assert.ok(m.sequence.length>=2&&m.sequence.length<=6);for(const p of m.sequence)assert.ok(module.pool.some(q=>q.string===p.string&&q.fret===p.fret&&q.midi===p.midi));assert.equal(m.events.length,m.sequence.length);assert.ok(m.source.startsWith('https://'));}
});
test('Family melodies use their actual available registers and only verified complete rewards',()=>{
 const six=pilotPlan(makeProfile('guitar6'));assert.ok(melodyFor(six.modules.find(m=>m.id==='note-4')));for(const m of six.modules){const melody=melodyFor(m);if(melody)assert.ok(!['maria','jaws','bonnie','saints'].includes(melody.id));}
});

test('Unmatched configurations keep an honest training sequence instead of modifying the source melody',()=>{
 assert.equal(melodyFor({kind:'phrase',pool:[{string:0,fret:0,midi:40}]}),null);
});
test('Inlays use the middle of fret spaces and double dots at octaves, with none on the open string',()=>{
 const g=neckGeometry(6,24);assert.equal(g.inlays.filter(p=>p.fret===12).length,2);assert.equal(g.inlays.filter(p=>p.fret===24).length,2);assert.equal(g.inlays.filter(p=>p.fret===3).length,1);assert.ok(g.inlays.every(p=>p.fret>0&&p.x===(g.frets[p.fret-1]+g.frets[p.fret])/2));
});
test('Acoustic filtering is warmer and clean electric filtering brighter throughout the guitar range',()=>{
 for(const hz of [82.4,110,220,330,660]){assert.ok(voiceCutoff(hz,'guitar-acoustic')<voiceCutoff(hz,'guitar-clean'));assert.ok(voiceCutoff(hz,'guitar-clean')>Math.min(8500,hz*36));assert.ok(voiceCutoff(hz,'guitar-acoustic')<Math.min(8500,hz*36));}
});
