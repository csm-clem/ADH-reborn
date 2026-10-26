import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {makeProfile,neckGeometry} from '../core.js';
import {neckBase} from '../neck-view.js';
import {PilotController} from '../pilot-ui.js';
import {AchievementsController} from '../achievements-ui.js';
import {initialState} from '../state.js';
import {questionsFor} from '../pilot.js';
import {renderAchievementUnlock} from '../achievement-unlock.js';
import {collectJavaScriptFiles} from '../tools/check-syntax.mjs';
const profile=makeProfile('guitar6');
function pilot(){return new PilotController({getState:()=>({...initialState(),profile}),icon:()=>'',showPilot(){}});}
test('An actual finished activity exposes only its newly earned cards, with real titles and real destinations',()=>{
 const c=pilot(),m=c.catalog.activities.find(a=>a.id==='opens'),events=questionsFor(m).map(q=>({...q,correct:true,aids:[],ms:750,retry:false})),entry={id:'real-proof',activity:m.id,at:123,finished:true,passed:true,events};
 c.data.attempts=[entry];const awards=c.syncAchievements(entry);c.session={id:'session',newAchievements:awards};const cards=c.unlockedCards();
 assert.ok(cards.length>=2);assert.ok(cards.every(d=>d.obtained&&awards.some(u=>u.id===d.id&&u.scope===d.scopeKey)));
 const first=renderAchievementUnlock(cards,0,()=>''),second=renderAchievementUnlock(cards,1,()=> '');
 assert.match(first,/Succès débloqué/);assert.match(first,/Ajouté à votre collection\./);assert.ok(first.includes(cards[0].title));assert.ok(first.includes(`data-id="${cards[0].id}"`));assert.ok(second.includes(cards[1].title));assert.ok(second.includes(`data-id="${cards[1].id}"`));assert.notEqual(first,second);
 assert.match(first,/data-pilot-action="unlock-previous"[^>]+disabled/);
 assert.equal(renderAchievementUnlock([],0), '');
 c.session={id:'empty',newAchievements:[]};assert.deepEqual(c.unlockedCards(),[]);
});
test('Opening the specific card clears incompatible filters but never changes a proof',()=>{
 const c=pilot();let state={...initialState(),profile,collection:{category:'music',filter:'missing',sort:'rarity'}};
 const a=new AchievementsController({pilot:c,getState:()=>state,setPreferences:collection=>state={...state,collection}}),before=JSON.stringify(c.store);
 a.reveal('opens-named');assert.equal(a.revealed,'opens-named');assert.equal(state.collection.category,'all');assert.equal(state.collection.filter,'all');assert.equal(state.collection.sort,'recent');assert.equal(JSON.stringify(c.store),before);
});
test('Wood decoration is shared vector markup below the strings, without expensive filter primitives or hit targets',()=>{
 const svg=neckBase(profile,{g:neckGeometry(6),id:'test'});assert.ok(svg.indexOf('class="neck-grain"')<svg.indexOf('class="neck-string'));
 assert.match(svg,/<pattern id="test-grain"/);assert.ok(!svg.includes('feTurbulence'));assert.ok(!svg.includes('<image'));assert.ok(!svg.includes('data-pilot-string'));
});
test('New celebration module is syntax checked, packaged and precached',async()=>{
 assert.ok((await collectJavaScriptFiles()).includes('achievement-unlock.js'));
 for(const f of ['sw.js','tools/package.mjs'])assert.ok((await readFile(new URL('../'+f,import.meta.url),'utf8')).includes('achievement-unlock.js'),f);
});
