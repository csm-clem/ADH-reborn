import test from 'node:test';
import assert from 'node:assert/strict';
import {neckGeometry,scrollingNeckGeometry,makeProfile,fretDistance} from '../core.js';
import {neckBase} from '../neck-view.js';
import {arcadeZoneWindow,arcadeBonus,newArcadeRun,resolveArcade} from '../arcade-rules.js';
import {resetInstrumentProgress} from '../reset-progress.js';
import {initialPilotStore} from '../pilot.js';

test('Arcade frets follow luthier spacing and never stretch to fill a laptop viewport',()=>{
 const g=scrollingNeckGeometry(6,24,{realistic:true,availableWidth:1920});
 const small=scrollingNeckGeometry(6,24,{realistic:true,availableWidth:320});
 assert.deepEqual(g.frets,small.frets);
 for(let f=1;f<=24;f++)assert.ok(Math.abs(g.bounds(f)[1]-g.bounds(f)[0]-(fretDistance(f,1200)-fretDistance(f-1,1200)))<1e-9);
 assert.ok(g.bounds(1)[1]-g.bounds(1)[0]>3.7*(g.bounds(24)[1]-g.bounds(24)[0]));
 assert.equal(g.openWidth,18);
});
test('Open strings have a narrow visual slot and the strings begin at the nut',()=>{
 for(const g of [neckGeometry(6,4),scrollingNeckGeometry(6,24),scrollingNeckGeometry(6,24,{realistic:true})]){
  assert.ok(g.openWidth<=18);
  const svg=neckBase(makeProfile('guitar6'),{g});
  for(const p of svg.matchAll(/class="neck-string[^\"]*" d="M([^ ]+)/g))assert.equal(Number(p[1]),g.nut);
 }
});
test('Shared-boundary notes 0 to 4 have one fixed Arcade window',()=>{
 for(let f=0;f<=4;f++)assert.deepEqual(arcadeZoneWindow(f),[0,4]);
 assert.deepEqual(arcadeZoneWindow(5),[4,8]);
 assert.deepEqual(arcadeZoneWindow(4,[4,8]),[4,8]);
 assert.deepEqual(arcadeZoneWindow(24),[20,24]);
});
test('The 5-note combo adds 50 points once, alongside the existing 10-note reward',()=>{
 const r=newArcadeRun('zones-natural'),p={string:0,fret:0,midi:40};
 for(let i=0;i<10;i++)resolveArcade(r,p,'correct',500);
 assert.equal(r.score,1150);assert.equal(r.combos,2);
 assert.deepEqual(arcadeBonus(15),{points:0,lives:0});
 assert.deepEqual(r.positions['0:0'].timeMin,500);
 resolveArcade(r,p,'wrong',800);assert.equal(r.positions['0:0'].errors,1);
 resolveArcade(r,p,'timeout',3800);assert.equal(r.positions['0:0'].timeouts,1);
});
test('Resetting one tuning preserves the other tuning of the same instrument',()=>{
 const standard=makeProfile('guitar6'),drop=makeProfile('guitar6','D2 A2 D3 G3 B3 E4'),store=initialPilotStore();
 for(const p of [standard,drop])store.profiles[p.key]={profile:p,attempts:[],later:[],session:null};
 const before=structuredClone(store),next=resetInstrumentProgress(store,'guitar6',drop.key);
 assert.ok(next.profiles[standard.key]);assert.equal(next.profiles[drop.key],undefined);
 assert.deepEqual(store,before);
 assert.throws(()=>resetInstrumentProgress(store,'guitar6',makeProfile('bass4').key));
});
