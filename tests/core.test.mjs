import test from 'node:test';
import assert from 'node:assert/strict';
import {INSTRUMENTS,parseTuning,makeProfile,frequency,noteName,pitchLabel,positions,score} from '../core.js';

test('Scientific pitch is correct for low B, open E, A440 and enharmonics crossing octaves',()=>{
  assert.deepEqual(parseTuning('B0 E1 A1 D2 G2',5),[23,28,33,38,43]);
  assert.ok(Math.abs(frequency(23)-30.867706)<1e-5);
  assert.ok(Math.abs(frequency(40)-82.406889)<1e-5);
  assert.equal(frequency(69),440);
  assert.deepEqual(parseTuning('B#3 Cb4',2),[60,59]);
  assert.equal(pitchLabel(23),'B0');
  assert.equal(noteName(61,'latin'),'Do♯');
});
test('All offered instruments and custom tunings produce the right number of strings',()=>{
  for(const i of INSTRUMENTS){const p=makeProfile(i.id);assert.equal(p.tuning.length,i.strings);assert.equal(positions(p,p.tuning.map((_,n)=>n)).length,i.strings*5);}
  assert.deepEqual(makeProfile('guitar7','B1 F#2 B2 E3 A3 C#4 F#4').tuning,[35,42,47,52,57,61,66]);
  assert.throws(()=>parseTuning('E2 A2',6));
  assert.throws(()=>parseTuning('H2',1));
  assert.throws(()=>parseTuning('E10',1));
  assert.throws(()=>makeProfile('guitar12'));
});
test('Accuracy unlocks progression independently of speed, errors cannot count as first correct answers',()=>{
  const answers=Array.from({length:20},(_,i)=>({correct:i<18,ms:10_000}));
  assert.equal(score(answers).stars,3);
  answers[17].correct=false;assert.equal(score(answers).stars,2);
  assert.equal(score(Array.from({length:20},()=>({correct:true,ms:1000}))).stars,5);
  assert.equal(score(Array.from({length:20},(_,i)=>({correct:i<19,ms:2000}))).stars,4);
  assert.equal(score([{correct:false,ms:100}]).medianMs,null);
  assert.equal(score([]).stars,0);
});
