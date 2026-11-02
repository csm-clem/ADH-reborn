import test from 'node:test';import assert from 'node:assert/strict';
import {neckGeometry,scrollingNeckGeometry,fretDistance,makeProfile,noteName} from '../core.js';
import {arcadeScope,arcadeTarget,newArcadeRun,resolveArcade,validateArcadeRecords} from '../arcade-rules.js';
import {ArcadeController} from '../arcade-ui.js';import {initialState,validateState} from '../state.js';
const profile=makeProfile('guitar6');
test('Playable frets are fully beyond the preceding faded fragment; end cap is half fret 24',()=>{
 for(const startFret of [4,8,12,20])for(const g of [neckGeometry(6,24,648,{startFret}),scrollingNeckGeometry(6,24,{startFret,realistic:true})]){
  assert.ok(g.boardStart<g.nut);assert.equal(g.bounds(startFret)[0],g.nut);
  assert.ok(Math.abs(g.width-g.frets[24]-(g.bounds(24)[1]-g.bounds(24)[0])*.5)<1e-9);
  assert.ok(g.width-g.endRadius>=g.frets[24]);
 }
});
test('A mixed spelling is deterministic and survives backup validation',()=>{
 const expected=['C','C♯','D','E♭','E','F','F♯','G','G♯','A','B♭','B'];
 for(let n=0;n<12;n++)assert.equal(noteName(n,{system:'international',accidentals:'mixed'}),expected[n]);
 assert.equal(noteName(8,{system:'international',accidentals:'flat'}),'A♭');
 assert.equal(noteName(8,{system:'latin',accidentals:'flat'}),'La♭');
 assert.equal(noteName(8,{system:'latin',accidentals:'mixed'}),'Sol♯');
 assert.equal(validateState({...initialState(),accidentals:'mixed'}).accidentals,'mixed');
});
test('New zones have a solo stage, a three-question bridge, then a cumulative mix',()=>{
 for(const [stage,start] of [[5,4],[8,8],[11,12]]){
  assert.equal(arcadeScope('zones-natural',6,stage).zonePhase,'discover');
  for(let i=0;i<20;i++){const p=arcadeTarget(profile,'zones-natural',stage,i,null,()=>i/20);assert.ok(p.fret>=start&&p.fret<=start+4);}
  assert.equal(arcadeScope('zones-natural',6,stage+1).zonePhase,'bridge');
  for(let i=0;i<6;i++){const p=arcadeTarget(profile,'zones-natural',stage+1,i,null,()=>.5);assert.equal(p.fret>=start,i<3);assert.ok(p.fret>=start-4);}
  assert.equal(arcadeScope('zones-natural',6,stage+2).zonePhase,'mix');
 }
});
test('A streak record is per profile across modes and does not depend on the score record',()=>{
 const data={};const host={getData:()=>data,getState:()=>({profile}),save(){},render(){}};
 const c=new ArcadeController(host),target={string:0,fret:0,midi:40};globalThis.cancelAnimationFrame??=()=>{};
 const finish=(n,mode)=>{c.run=newArcadeRun(mode);for(let i=0;i<n;i++)resolveArcade(c.run,target,'correct',200);while(!c.run.finished)resolveArcade(c.run,target,'wrong',200);c.finish();};
 finish(30,'zones-natural');assert.equal(c.streakRecord,true);finish(20,'strings-natural');assert.equal(c.streakRecord,false);assert.equal(data.arcade.longest,30);
 finish(30,'zones-chromatic');assert.equal(c.streakRecord,false);finish(40,'strings-chromatic');assert.equal(c.streakRecord,true);assert.equal(data.arcade.longest,40);validateArcadeRecords(data.arcade,profile);
});
