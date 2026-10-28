import test from 'node:test';import assert from 'node:assert/strict';
import {makeProfile} from '../core.js';import {betaCatalog} from '../beta-catalog.js';import {learningProofs} from '../learning-evidence.js';import {positionProgress,progressView} from '../progress.js';import {validatePilotStore,initialPilotStore} from '../pilot.js';
const profile=makeProfile('guitar6'),catalog=betaCatalog(profile),target={string:0,fret:0,midi:40};
const event=(correct,mode='name')=>({target,mode,correct,retry:false,ms:700,aids:[]});
test('Twenty recent first answers can recover from early mistakes, with both exercise directions',()=>{
 const events=[...Array.from({length:12},()=>event(false)),...Array.from({length:20},(_,i)=>event(true,i%2?'name':'find'))];
 assert.equal(positionProgress(events,0,0).accuracy,1);assert.equal(positionProgress(events,0,0).total,20);assert.equal(positionProgress(events,0,0).status,'perfect');
 assert.equal(positionProgress([...events,{...event(false),retry:true}],0,0).accuracy,1);
});
test('The recent window survives detailed history pruning and does not count an attempt twice',()=>{
 const data={attempts:[{id:'old',activity:'opens',at:1,events:Array.from({length:20},()=>event(false))}]};data.evidence=learningProofs(catalog,data);
 data.attempts=[{id:'new',activity:'opens',at:2,events:Array.from({length:20},(_,i)=>event(true,i%2?'name':'find'))}];data.evidence=learningProofs(catalog,data);const once=JSON.stringify(data.evidence);data.evidence=learningProofs(catalog,data);assert.equal(JSON.stringify(data.evidence),once);assert.equal(data.evidence.recent['0:0'].length,20);assert.ok(data.evidence.recent['0:0'].every(e=>e.correct));
 const html=progressView(profile,[],[],undefined,{evidence:data.evidence});assert.match(html,/100%/);
 const store=initialPilotStore();store.profiles[profile.key]={profile,...data,attempts:[],later:[],session:null};assert.doesNotThrow(()=>validatePilotStore(store));store.profiles[profile.key].evidence.recent['0:0'].push({mode:'find',correct:true});assert.throws(()=>validatePilotStore(store));
});
test('Every note chapter has discovery followed by precisely two cumulative activities',()=>{
 for(const scope of catalog.scopes)for(const ch of scope.chapters.filter(c=>c.kind==='family')){assert.ok(ch.discoveryId);assert.equal(ch.activityIds.length,2);assert.deepEqual(ch.activityIds.map(id=>catalog.activities.find(a=>a.id===id).mode),['name','find']);assert.ok(ch.activityIds.every(id=>catalog.activities.find(a=>a.id===id).kind==='mix'));}
 assert.ok(catalog.legacyActivities.length);assert.ok(!catalog.activities.some(a=>a.kind==='family'));
});
