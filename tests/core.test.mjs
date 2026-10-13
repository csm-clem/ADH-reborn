import test from 'node:test';
import assert from 'node:assert/strict';
import {INSTRUMENTS,parseTuning,makeProfile,frequency,noteName,pitchLabel,positions,lessons,isUnlocked,nextLesson,question,checkAnswer,score,initialState,validateState} from '../core.js';

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
test('Curriculum introduces one string at a time and uses only cases 0 through 4',()=>{
  for(const i of INSTRUMENTS){
    const p=makeProfile(i.id),list=lessons(p);
    assert.equal(list.length,i.strings*5+i.strings-1);
    assert.equal(new Set(list.map(l=>l.id)).size,list.length);
    assert.deepEqual(list[0].frets,[0,1]);
    for(const l of list){assert.ok(l.frets.every(f=>f>=0&&f<=4));assert.ok(l.strings.every(s=>s<i.strings));}
    assert.equal(list.at(-1).strings.length,i.strings);
    assert.equal(list.at(-1).mode,'mixed');
    assert.equal(nextLesson(list,{}),0);
    assert.equal(isUnlocked(list,1,{}),false);
    assert.equal(isUnlocked(list,1,{[list[0].id]:{stars:2}}),false);
    assert.equal(isUnlocked(list,1,{[list[0].id]:{stars:3}}),true);
    assert.equal(nextLesson(list,Object.fromEntries(list.map(l=>[l.id,{stars:3}]))),-1);
  }
});
test('Every target in a lesson is covered before repeats; answer keys work in both directions',()=>{
  const p=makeProfile('guitar6'),l=lessons(p).find(l=>l.id==='s0-whole'),history=[];
  for(let n=0;n<5;n++){const q=question(p,l,history,()=>.31);assert.equal(checkAnswer(q,q.target.midi%12),true);assert.equal(checkAnswer(q,(q.target.midi+1)%12),false);history.push({target:q.target,correct:true});}
  assert.equal(new Set(history.map(a=>a.target.fret)).size,5);
  const find=question(p,{...l,mode:'find'},[],()=>0);
  assert.equal(checkAnswer(find,find.target),true);
  assert.equal(checkAnswer(find,{string:1,fret:find.target.fret}),false);
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
test('Backup roundtrip retains separate profiles, and rejects malformed history',()=>{
  const p=makeProfile('bass5'),state={...initialState(),profile:p,progress:{[p.key]:{'s0-first':{stars:3}}}};
  const result=validateState(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(result.profile,p);
  assert.equal(result.progress[p.key]['s0-first'].stars,3);
  assert.throws(()=>validateState({...state,version:99}));
  assert.throws(()=>validateState({...state,profile:{...p,tuning:[23]}}));
  assert.throws(()=>validateState({...state,stats:[{answers:'bad'}]}));
  assert.throws(()=>validateState({...state,progress:{bad:{bad:{stars:6}}}}));
});
