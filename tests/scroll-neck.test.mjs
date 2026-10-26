import test from 'node:test';import assert from 'node:assert/strict';
import {scrollingNeckGeometry,neckGeometry} from '../core.js';
import {PilotController} from '../pilot-ui.js';import {makeProfile} from '../core.js';import {initialState} from '../state.js';
test('Every fret on a scrolling neck keeps a 44px horizontal target at each viewport height',()=>{
 for(const n of [4,5,6,7,8])for(const height of [160,220,320]){const g=scrollingNeckGeometry(n,24,{height});assert.equal(g.visibleStrings.length,n);assert.equal(g.visibleFrets.length,25);for(const f of g.visibleFrets){const [a,b]=g.bounds(f);assert.ok(b-a>=44-1e-8);assert.ok(g.centers[f]>=a&&g.centers[f]<=b);}assert.ok(g.width>1100);assert.ok(Math.max(...g.ys)<height);}
});
test('Scroll mode only applies beyond twelve cases; existing 0–12 geometry stays unchanged',()=>{
 const profile=makeProfile('guitar6'),p=new PilotController({getState:()=>({...initialState(),profile}),fullCurriculum:true});
 p.session={activity:'cs1-note-4-find'};assert.equal(p.scrollNeck,false);assert.deepEqual(JSON.parse(JSON.stringify(p.geometry)),JSON.parse(JSON.stringify(neckGeometry(6,12,648,{gameplay:true,startFret:0}))));
 p.session={activity:'c24s1-note-4-find'};assert.equal(p.scrollNeck,true);assert.ok(p.geometry.width>1100);
});
