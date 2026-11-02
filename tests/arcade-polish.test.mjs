import test from 'node:test';
import assert from 'node:assert/strict';
import {neckGeometry,scrollingNeckGeometry,makeProfile,fretDistance} from '../core.js';
import {neckBase,miniatureNeck} from '../neck-view.js';
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

test('A neck starting beyond the nut fades only on the lower, unplayable fragment',()=>{
 const g=neckGeometry(6,8,648,{lesson:true,startFret:4});
 const svg=neckBase(makeProfile('guitar6'),{g,id:'zone'});
 assert.ok(svg.includes(`gradientUnits="userSpaceOnUse" x1="${g.boardStart}" x2="${g.nut}"`));
 assert.ok(svg.includes('mask="url(#zone-left-mask)"'));
 assert.ok(!svg.includes('neck-fret neck-nut'));
});
test('String mini-lessons fit twelve frets or keep touch-sized twenty-four fret widths',()=>{
 for(const end of [12,24]){
  const svg=miniatureNeck(makeProfile('guitar6'),{lesson:true,lastFret:end});
  const width=Number(svg.match(/viewBox="0 0 ([\d.]+)/)[1]);
  assert.ok(end===12?width>300&&width<700:width>2000);
  assert.ok(svg.includes('data-neck-realistic="true"'));
  assert.ok(svg.includes(end===12?'data-neck-fit="true"':'data-neck-scroll="true"'));
  assert.ok(Number(svg.match(/data-neck-height="([\d.]+)/)[1])>=(end===12?240:320));
  assert.ok(svg.includes('data-neck-available="0"'));
 }
});

test('The compact first-use layout does not shrink preparatory course necks',()=>{
 const svg=miniatureNeck(makeProfile('guitar6'),{lesson:true,lastFret:24,scrollable:true,scrollFrame:false});
 assert.ok(Number(svg.match(/viewBox="0 0 ([\d.]+)/)[1])>1000);
 assert.ok(svg.includes('data-neck-height="240"'));
});
