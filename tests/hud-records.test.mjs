import test from 'node:test';
import assert from 'node:assert/strict';
import {ArcadeController} from '../arcade-ui.js';
import {makeProfile} from '../core.js';
import {newArcadeRun,resolveArcade,validateArcadeRecords} from '../arcade-rules.js';
import {gameHud} from '../game-hud.js';
test('A lower score can improve the answer record without losing the previous streak record',()=>{
 const data={},profile=makeProfile('guitar6'),c=new ArcadeController({getState:()=>({profile}),getData:()=>data,save(){},render(){}}),p={string:0,fret:0,midi:40};
 const finish=groups=>{c.run=newArcadeRun('strings-natural');groups.forEach((n,i)=>{if(i)resolveArcade(c.run,p,'wrong',100);for(let j=0;j<n;j++)resolveArcade(c.run,p,'correct',100);});while(!c.run.finished)resolveArcade(c.run,p,'wrong',100);c.finish();};
 const previous=globalThis.cancelAnimationFrame;globalThis.cancelAnimationFrame=()=>{};
 try{finish([20]);const score=data.arcade.records['strings-natural'].score;finish([7,7,7]);assert.ok(c.run.score<score);assert.equal(c.newBests.correct,true);assert.equal(c.newBests.longest,false);assert.equal(c.previousBest.longest,20);assert.equal(data.arcade.bests['strings-natural'].correct,21);assert.equal(data.arcade.bests['strings-natural'].longest,20);validateArcadeRecords(data.arcade,profile);const copy=structuredClone(data.arcade);copy.bests['strings-natural'].combos=-1;assert.throws(()=>validateArcadeRecords(copy,profile));}finally{globalThis.cancelAnimationFrame=previous;}
});
test('Shared HUD exposes the same accessible sound and replay controls with optional time bar',()=>{
 const options={icon:()=>'',attribute:'data-action',title:'Test',back:'Retour',muted:true,actions:{back:'back',replay:'restart',fullscreen:'full',pause:'pause',resume:'resume',mute:'mute'}};
 const normal=gameHud(options),timed=gameHud({...options,timer:true});assert.ok(normal.includes('aria-label="Réglages"'));assert.ok(!normal.includes('aria-label="Recommencer l’activité"'));assert.ok(normal.includes('aria-label="Activer le son" aria-pressed="true"'));assert.ok(!normal.includes('data-arcade-timer'));assert.ok(timed.includes('data-arcade-timer'));
});
