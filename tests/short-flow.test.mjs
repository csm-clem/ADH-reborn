import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,neckGeometry} from '../core.js';
import {PilotController} from '../pilot-ui.js';
import {pilotPlan,practiceActivities,questionsFor} from '../pilot.js';
import {electricString,instrumentVoice} from '../sound.js';
test('Dots sit on the right third and labels on the left third of their own fret',()=>{
 const g=neckGeometry(6,4);for(let f=0;f<=4;f++){const a=f?g.frets[f-1]:g.openStart,b=f?g.frets[f]:g.nut;assert.ok(Math.abs(g.centers[f]-(a+(b-a)*2/3))<1e-10);assert.ok(Math.abs(g.labelXs[f]-(a+(b-a)/3))<1e-10);}
});
test('Wrong answers make no sound, add no retry question and keep a real wrong position for correction',()=>{
 const profile=makeProfile('guitar6'),sounds=[],c=new PilotController({getState:()=>({profile,notation:'international',sound:true}),playNote:n=>sounds.push(n),stopAudio:()=>{},showPilot:()=>{}}),module=practiceActivities(pilotPlan(profile))[0];
 c.session={id:'short',activity:module.id,stage:'practice',queue:questionsFor(module),index:0,events:[]};c.data.seenInstructions=['name'];c.scheduleAdvance=()=>{};const count=c.session.queue.length,target=c.question.target.midi%12,bad=[0,2,4,5,7,9,11].find(n=>n!==target);c.answer(bad);assert.equal(sounds.length,0);assert.equal(c.session.queue.length,count);assert.equal(c.session.events.length,1);assert.ok(c.effects[0].position);assert.equal(c.effects[0].position.midi%12,bad);assert.equal(c.session.events[0].automaticAids.length,0);
});
test('Clean guitar is the default and bass automatically chooses a distinct bounded plucked timbre',()=>{
 assert.equal(instrumentVoice('guitar7'),'guitar-clean');assert.equal(instrumentVoice('bass5'),'bass-electric');const a=electricString(110,22050,.8,'guitar-clean',()=>.5),b=electricString(110,22050,.8,'bass-electric',()=>.5);assert.ok(a.every(n=>Number.isFinite(n)&&Math.abs(n)<=.81));assert.ok(b.every(n=>Number.isFinite(n)&&Math.abs(n)<=.81));assert.notDeepEqual(a.slice(300,600),b.slice(300,600));
 const correlation=lag=>{let sum=0;for(let i=2000;i<6000;i++)sum+=a[i]*a[i+lag];return sum;},lags=[198,199,200,201,202],best=lags.reduce((x,y)=>correlation(x)>correlation(y)?x:y);assert.ok(Math.abs(best-22050/110)<2);
});
test('A wrong musical-sequence answer stays silent and advances after its visual correction',()=>{
 const profile=makeProfile('guitar6'),sounds=[],c=new PilotController({getState:()=>({profile,notation:'international',sound:true}),playNote:n=>sounds.push(n),stopAudio:()=>{},showPilot:()=>{}}),module=practiceActivities(pilotPlan(profile)).find(m=>m.id==='opens-find');c.session={id:'motif',activity:module.id,stage:'motif',queue:questionsFor(module),index:20,events:[],motifIndex:0,motifErrors:0};c.data.seenInstructions=['motif','melody-opens'];c.scheduleAdvance=()=>{};const target=c.motif()[0];c.neckTap(target.string,target.fret+1);assert.equal(c.effects[0].correct,false);assert.equal(c.session.motifIndex,1);assert.equal(sounds.length,0);assert.deepEqual(c.effects[0].target,target);assert.equal(c.feedback,null);
});
