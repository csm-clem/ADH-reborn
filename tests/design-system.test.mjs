import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {positionProgress} from '../progress.js';
import {makeProfile} from '../core.js';
import {pilotPlan,practiceActivities,questionsFor} from '../pilot.js';
import {PilotController} from '../pilot-ui.js';
test('Page styles cannot repaint shared actions, even inside media queries',async()=>{
 const root=new URL('../',import.meta.url),files=(await readdir(root)).filter(f=>f.endsWith('.css')&&!['tokens.css','components.css','ui.css'].includes(f));
 const shared=/\.(?:button|icon-button|text-button|quiet-button|primary|secondary|result-details-button|result-share|profile-audio|sound-toggle)(?![\w-])/;
 const forbidden=/^(?:background(?:-color|-image)?|border(?:-radius|-color|-width|-style)?|color|box-shadow|font(?:-family|-weight|-size)?|line-height|opacity|cursor|transform|transition|outline(?:-offset)?)$/;
 for(const file of files){const css=(await readFile(new URL(file,root),'utf8')).replace(/\/\*[^]*?\*\//g,'');for(const [,selectors,body]of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
  if(!shared.test(selectors)||/\s(?:svg|small|strong|span)(?:[\s.:>]|$)/.test(selectors))continue;
  for(const d of body.split(';')){const p=d.split(':')[0].trim();assert.ok(!forbidden.test(p),`${file}: ${selectors.trim()} overrides ${p}`);}
 }}
 const entry=await readFile(new URL('ui.css',root),'utf8');assert.match(entry,/@layer tokens, base, components, pages/);
});
test('Progress distinguishes unexplored notes and the latest exact-position response',()=>{
 const event=(correct,mode='name',retry=false)=>({target:{string:0,fret:0},mode,correct,retry,ms:800,aids:[]});
 assert.equal(positionProgress([],0,0).status,'new');assert.equal(positionProgress([event(true),event(false)],0,0).status,'review');assert.equal(positionProgress([event(false),event(true)],0,0).status,'worked');assert.equal(positionProgress([event(false),event(true,'name',true)],0,0).status,'review');assert.equal(positionProgress([event(true)],5,0).status,'new');
});
test('Fast motif input accepts the next note before the 500ms feedback expires',()=>{
 const profile=makeProfile('guitar6'),sounds=[],c=new PilotController({getState:()=>({profile,notation:'international',sound:true}),playNote:n=>sounds.push(n),stopAudio:()=>{},showPilot:()=>{}}),m=practiceActivities(pilotPlan(profile)).find(m=>m.id==='degree-5-find');c.session={id:'rapid',activity:m.id,stage:'motif',queue:questionsFor(m),index:20,events:[],motifIndex:0,motifErrors:0};c.data.seenInstructions=['motif','melody-degree-5'];c.scheduleAdvance=()=>{};
 const [a,b]=c.motif();c.neckTap(a.string,a.fret);assert.equal(c.session.motifIndex,0);c.neckTap(b.string,b.fret);assert.equal(c.session.motifIndex,1);assert.equal(c.feedback.correct,true);assert.deepEqual(sounds,[a.midi,b.midi]);
});
