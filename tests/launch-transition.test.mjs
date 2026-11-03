import test from 'node:test';
import assert from 'node:assert/strict';
import {LAUNCH_DURATION,launchFrame} from '../launch-transition.js';
test('Approved timing: fade from zero, original page zoom, continuous title growth and overlapping long fade',()=>{
 assert.equal(LAUNCH_DURATION,2350);
 assert.equal(launchFrame(0).panelOpacity,0);
 assert.ok(launchFrame(100).panelOpacity>0);
 assert.equal(launchFrame(150).previousScale,1.65);
 assert.equal(launchFrame(300).previousOpacity,0);
 assert.equal(launchFrame(300).titleScale,.85);
 assert.equal(launchFrame(1100).titleOpacity,1);
 assert.ok(launchFrame(1600).titleOpacity<1);
 assert.ok(launchFrame(1900).titleScale>launchFrame(1100).titleScale);
 assert.equal(launchFrame(1900).panelY,0);
 assert.ok(launchFrame(2000).panelY>0);
 assert.ok(launchFrame(2000).titleOpacity>0);
 assert.equal(launchFrame(2200).titleOpacity,0);
 assert.equal(launchFrame(2350).panelY,100);
});
test('Reduced motion keeps white-title fade timing without spatial movement or warping',()=>{
 for(const ms of [0,150,300,1100,1900,2200,2350]){
  const f=launchFrame(ms,true);assert.equal(f.previousScale,1);assert.equal(f.titleScale,1);assert.equal(f.panelY,0);assert.equal(f.warp,0);
 }
 assert.equal(launchFrame(2350,true).panelOpacity,0);
});
