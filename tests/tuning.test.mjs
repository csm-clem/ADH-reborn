import test from 'node:test';
import assert from 'node:assert/strict';
import {INSTRUMENTS,makeProfile} from '../core.js';
import {tuningPresets,tuningText,tuningPitchLabel,adjustTuning,tuningPages,MIN_TUNING_MIDI,MAX_TUNING_MIDI} from '../tuning.js';
test('Every instrument has correctly sized presets and its actual standard tuning first',()=>{
 for(const instrument of INSTRUMENTS){const library=tuningPresets(instrument.id);assert.ok(library.length>=4);assert.equal(new Set(library.map(p=>p.id)).size,library.length);assert.deepEqual(library[0].tuning,makeProfile(instrument.id).tuning);for(const p of library){assert.equal(p.tuning.length,instrument.strings);assert.deepEqual(makeProfile(instrument.id,tuningText(p.tuning)).tuning,p.tuning);}}
 assert.throws(()=>tuningPresets('unknown'));
});
test('DADGAD, low BEAD bass and seven-string Drop B preserve the intended registers',()=>{
 const preset=(id,name)=>tuningPresets(id).find(p=>p.id===name).tuning;
 assert.deepEqual(preset('guitar6','dadgad'),[38,45,50,55,57,62]);
 assert.deepEqual(preset('guitar7','drop-b'),[35,42,47,52,57,61,66]);
 assert.deepEqual(preset('bass4','bead'),[23,28,33,38]);
 assert.deepEqual(preset('guitar8','drop-e'),[28,35,40,45,50,55,59,64]);
});
test('Per-string arrows change precisely one semitone and support reentrant configurations',()=>{
 const before=[55,40,45,50,59,64],next=adjustTuning(before,1,1);
 assert.deepEqual(next,[55,41,45,50,59,64]);assert.deepEqual(before,[55,40,45,50,59,64]);assert.deepEqual(adjustTuning(next,-1,1),before);
});
test('Global transposition preserves all intervals and never mutates the original tuning',()=>{
 const before=makeProfile('guitar7').tuning,next=adjustTuning(before,-1);assert.notEqual(next,before);
 assert.deepEqual(next.map((n,i)=>n-before[i]),Array(7).fill(-1));assert.deepEqual(adjustTuning(next,1),before);
});
test('At a pitch boundary all-string transposition is refused as a whole, without partial clamping',()=>{
 const notes=[MIN_TUNING_MIDI,40,MAX_TUNING_MIDI];assert.equal(adjustTuning(notes,-1),null);assert.equal(adjustTuning(notes,1),null);
 assert.deepEqual(adjustTuning(notes,1,0),[MIN_TUNING_MIDI+1,40,MAX_TUNING_MIDI]);assert.equal(adjustTuning(notes,1,2),null);
 for(const args of [[[40],2],[[NaN],1],[[40],1,-1],[[40],1,1]])assert.throws(()=>adjustTuning(...args));
});
test('Paginated string controls cover every physical string once, starting with string 1',()=>{
 for(let strings=4;strings<=8;strings++)for(let capacity=1;capacity<=8;capacity++){
  const pages=tuningPages(strings,capacity);assert.deepEqual(pages.flat(),Array.from({length:strings},(_,i)=>strings-1-i));assert.ok(pages.every(p=>p.length>0&&p.length<=capacity));
 }
 assert.throws(()=>tuningPages(6,0));
});
test('Preset data is returned independently for each draft',()=>{
 const library=tuningPresets('guitar6');library[0].tuning[0]=12;library[0].label='Changed';assert.equal(tuningPresets('guitar6')[0].tuning[0],40);assert.equal(tuningPresets('guitar6')[0].label,'Standard — Mi');
});

test('Flat presets keep their written note names without changing pitch or scientific octaves',()=>{
 assert.equal(tuningPresets('guitar6').find(p=>p.id==='eb').flats,true);assert.equal(tuningPitchLabel(39,'international',true),'E♭2');assert.equal(tuningPitchLabel(39,'latin',true),'Mi♭2');assert.equal(tuningPitchLabel(39),'D♯2');assert.equal(tuningPitchLabel(48,'latin',true),'Do3');
});
