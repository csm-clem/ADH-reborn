import test from 'node:test';import assert from 'node:assert/strict';
import {scrollingNeckGeometry,neckGeometry} from '../core.js';
import {PilotController} from '../pilot-ui.js';import {makeProfile} from '../core.js';import {initialState} from '../state.js';
test('Every fret on a scrolling neck keeps a 40px horizontal target at each viewport height',()=>{
 for(const n of [4,5,6,7,8])for(const height of [160,220,320]){const g=scrollingNeckGeometry(n,24,{height});assert.equal(g.visibleStrings.length,n);assert.equal(g.visibleFrets.length,25);for(const f of g.visibleFrets){const [a,b]=g.bounds(f);assert.ok(b-a>=40-1e-8);assert.ok(g.centers[f]>=a&&g.centers[f]<=b);}assert.ok(g.width>=1026);assert.ok(Math.max(...g.ys)<height);}
});
test('Scroll mode only applies beyond twelve cases; existing 0–12 geometry stays unchanged',()=>{
 const profile=makeProfile('guitar6'),p=new PilotController({getState:()=>({...initialState(),profile}),fullCurriculum:true});
 p.session={activity:'cs1-note-4-find'};assert.equal(p.scrollNeck,false);assert.deepEqual(JSON.parse(JSON.stringify(p.geometry)),JSON.parse(JSON.stringify(neckGeometry(6,12,648,{gameplay:true,startFret:0}))));
 p.session={activity:'c24s1-note-4-find'};assert.equal(p.scrollNeck,true);assert.ok(p.geometry.width>=1026);
});
import {neckBase} from '../neck-view.js';
test('Every neck uses the same scaled frets, inlays and strings, not only shared colors',()=>{
 for(const n of [4,5,6,7,8]){
  const profile={tuning:Array.from({length:n},(_,i)=>40+i*5)},g=scrollingNeckGeometry(n,24,{height:220}),u=g.visualScale,html=neckBase(profile,{g});
  assert.ok(u>1);assert.ok(html.includes(`r="${2.8*u}"`));assert.ok(html.includes(`stroke-width="${1.1*u}"`));assert.ok(html.includes(`stroke-width="${(.5+(n-1)*.18)*u}"`));
  const short=neckGeometry(n,4,648,{gameplay:true});assert.ok(Math.abs((g.ys[0]-g.ys[1])/u-(short.ys[0]-short.ys[1]))<1e-8);
 }
});
import {neckHitBox} from '../core.js';
test('Every string keeps a positive hit region when a scrolling diagram is reduced in height',()=>{
 for(const count of [4,5,6,7,8])for(const height of [32,40,46,80,104,240]){const g=scrollingNeckGeometry(count,24,{height});for(const string of g.visibleStrings){const box=neckHitBox(g,string);assert.ok(box.height>0);assert.ok(box.y<=g.ys[string]);assert.ok(box.y+box.height>=g.ys[string]-.01);}}
});
test('The physical 24th fret ends without a faded extra cell, in every shared renderer',()=>{
 for(const make of [n=>neckGeometry(n,24),n=>scrollingNeckGeometry(n,24,{height:240})])for(const count of [4,6,8]){
  const g=make(count),html=neckBase({tuning:Array(count).fill(40)},{g,id:'end-test'}),drawing=html.match(/<g class="neck-drawing"[^>]*>/)[0];
  assert.equal(g.terminal,true);assert.equal(g.width-g.frets[24],6);assert.equal(g.fadeStart,g.width);
  assert.match(drawing,/clip-path/);assert.doesNotMatch(drawing,/mask=/);assert.match(html,/<clipPath id="end-test-end">/);
 }
 const g=neckGeometry(6,4),drawing=neckBase({tuning:Array(6).fill(40)},{g}).match(/<g class="neck-drawing"[^>]*>/)[0];
 assert.equal(g.terminal,false);assert.ok(g.fadeStart<g.width);assert.match(drawing,/mask=/);
});
test('Every shared board balances its two outer string margins and fades a non-open left edge',()=>{
 for(const count of [4,6,8])for(const make of [()=>neckGeometry(count,8,648,{gameplay:true,startFret:4}),()=>scrollingNeckGeometry(count,24,{height:240,startFret:4})]){
  const g=make(),u=g.visualScale||1;assert.ok(Math.abs(Math.min(...g.ys)-2*u-(g.height-10*u-Math.max(...g.ys)))<1e-8);
  const html=neckBase({tuning:Array(count).fill(40)},{g,id:'left-test'});assert.match(html,/mask="url\(#left-test-left-mask\)"/);
 }
});
