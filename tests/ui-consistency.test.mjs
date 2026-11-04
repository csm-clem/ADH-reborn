import test from 'node:test';
import assert from 'node:assert/strict';
import {actionButton,dispatchGameControl} from '../ui-actions.js';
import {resultFrame} from '../result-frame.js';
import {launchFrame} from '../launch-transition.js';
test('Commands obey the same pause/introduction contract and invoke a single adapter',()=>{
 const calls=[],actions={pause:'pause',resume:'resume',mute:'mute',replay:'restart'},handlers=Object.fromEntries(Object.keys(actions).map(k=>[k,()=>calls.push(k)]));
 for(const action of ['pause','resume','mute','restart'])assert.equal(dispatchGameControl(action,{actions,handlers}),true);
 assert.deepEqual(calls,['pause','resume','mute','replay']);calls.length=0;
 dispatchGameControl('restart',{actions,handlers,paused:true});dispatchGameControl('pause',{actions,handlers,introduction:true});assert.deepEqual(calls,['replay']);calls.length=0;
 assert.equal(dispatchGameControl('answer',{actions,handlers}),false);
 dispatchGameControl('mute',{actions,handlers,paused:true});assert.deepEqual(calls,['mute']);
});
test('Action primitive retains accessible names, native disabled state and escaped text',()=>{
 const html=actionButton({action:'a"b',label:'Son <coupé>',body:'Son',iconOnly:true,pressed:true,disabled:true});
 assert.ok(html.includes('aria-pressed="true"'));assert.ok(html.includes(' disabled'));assert.ok(html.includes('Son &lt;coupé&gt;'));assert.ok(html.includes('a&quot;b'));
 assert.throws(()=>actionButton({attribute:'onclick',body:''}));
});
test('Both result modes retain the same anatomical slots and mode-specific detail content',()=>{
 const html=resultFrame({classes:'arcade-results',header:'HEADER',summary:'SUMMARY',actions:'ACTIONS',details:'DETAILS'});
 assert.ok(html.indexOf('SUMMARY')<html.indexOf('ACTIONS'));assert.ok(html.indexOf('ACTIONS')<html.indexOf('DETAILS'));assert.ok(html.includes('data-result-summary'));assert.ok(html.includes('data-result-actions'));
});
test('Previous-page zoom and fade keep moving up to the same disappearance boundary',()=>{
 for(const t of [0,100,150,240,290]){assert.ok(launchFrame(t+5).previousScale>launchFrame(t).previousScale);assert.ok(launchFrame(t+5).previousOpacity<launchFrame(t).previousOpacity);}
 assert.equal(launchFrame(300).previousOpacity,0);assert.equal(launchFrame(300).previousScale,1.65);
});
import {gameKeyboard} from '../ui-actions.js';
test('Shared keyboard contract ignores editing, toggles pause and contains focus only when paused',()=>{
 let pauses=0,resumes=0,prevented=0;const root={ownerDocument:{querySelector:()=>null,activeElement:null},querySelectorAll:()=>[]},options={root,active:true,paused:false,pause:()=>pauses++,resume:()=>resumes++},event={key:'Escape',target:{closest:()=>null},preventDefault(){prevented++;}};
 assert.equal(gameKeyboard(event,options),true);assert.equal(pauses,1);
 gameKeyboard(event,{...options,paused:true});assert.equal(resumes,1);assert.equal(prevented,2);
 assert.equal(gameKeyboard({...event,target:{closest:()=>({})}},options),false);
 assert.equal(gameKeyboard({...event,defaultPrevented:true},options),false);
 assert.equal(gameKeyboard({...event,key:'Tab'},options),false);
});
import {gameHud} from '../game-hud.js';
test('Mode adapters can omit irrelevant controls instead of duplicating HUD templates',()=>{
 const html=gameHud({icon:()=>'',attribute:'data-test',title:'Titre',actions:{pause:'pause'}});
 assert.ok(html.includes('data-test="pause"'));assert.ok(!html.includes('undefined'));assert.ok(!html.includes('Recommencer'));
});
