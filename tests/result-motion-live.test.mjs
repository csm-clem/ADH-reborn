import test from 'node:test';
import assert from 'node:assert/strict';
import {resultMotionAt} from '../result-motion-live.js';
test('The score builds suspense while result rows arrive at a regular cadence',()=>{
 assert.ok(resultMotionAt(.5).score<.9);
 assert.equal(resultMotionAt(1).score,1);
 for(const [i,p] of [[0,.3],[1,.39],[2,.48]])assert.ok(Math.abs(resultMotionAt(p).rows[i]-resultMotionAt(.3).rows[0])<1e-9);
 assert.deepEqual(resultMotionAt(1).rows,[1,1,1]);
 assert.equal(resultMotionAt(1).celebration,1);
});
