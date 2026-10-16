import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,INSTRUMENTS,neckGeometry} from '../core.js';
import {pilotPlan} from '../pilot.js';
import {melodyFor} from '../melodies.js';
import {voiceCutoff} from '../sound.js';
test('Every sourced excerpt uses only exact pitches and positions from its exercise, under the thirty-response cap',()=>{
 for(const instrument of INSTRUMENTS)for(const module of pilotPlan(makeProfile(instrument.id)).modules){const m=melodyFor(module);if(!m)continue;assert.ok(m.sequence.length>=2&&m.sequence.length<=6);for(const p of m.sequence)assert.ok(module.pool.some(q=>q.string===p.string&&q.fret===p.fret&&q.midi===p.midi));assert.equal(m.events.length,m.sequence.length);assert.ok(m.source.startsWith('https://github.com/'));}
});
test('Verified themes adapt to the actual interval instead of assuming a standard six-string guitar',()=>{
 const six=pilotPlan(makeProfile('guitar6')),seven=pilotPlan(makeProfile('guitar7'));
 assert.equal(melodyFor(six.modules.find(m=>m.degree===5)).id,'twinkle');assert.equal(melodyFor(seven.modules.find(m=>m.degree===5)).id,'maria');assert.equal(melodyFor(six.modules.find(m=>m.degree===6)).id,'entertainer');assert.equal(melodyFor(six.modules.find(m=>m.degree===2)).id,'jaws');
 const transfer=melodyFor(six.modules.find(m=>m.kind==='transfer'));assert.equal(transfer.sequence.length,4);assert.deepEqual(transfer.sequence.slice(0,2).map(p=>p.fret),transfer.sequence.slice(2).map(p=>p.fret));assert.notEqual(transfer.sequence[0].string,transfer.sequence[2].string);
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
