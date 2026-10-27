import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,neckGeometry,fitNeck} from '../core.js';
import {positionProgress,scrollbarThumb,progressView} from '../progress.js';
import {PilotController} from '../pilot-ui.js';
import {initialState,preferences} from '../state.js';
import {acousticString,drivenString,pluckedString,calibrateVoice,audiblePower} from '../sound.js';
import {catalogMelodies,melodyById} from '../melodies.js';
import {betaCatalog} from '../beta-catalog.js';
import {rewardFor} from '../reward-music.js';
import {MUSIC_CARD_NUMBERS} from '../achievement-catalog.js';
import {achievementContext} from '../achievement-rules.js';
import {AchievementsController} from '../achievements-ui.js';
const profile=makeProfile('guitar6');
function wheel(id){const c=new PilotController({getState:()=>({...initialState(),profile})});const m=c.catalog.activities.find(m=>m.id===id);c.session={activity:id,stage:'practice',queue:[{mode:'name',answerKind:'class',target:m.pool[0]}],index:0};return c.wheel();}
test('Naming wheels contain all seven natural names or all twelve pitches; octave wheels stay explicit',()=>{
 const natural=wheel('mix-4'),chromatic=wheel('mix-6');
 for(const n of [0,2,4,5,7,9,11])assert.match(natural,new RegExp(`data-note="${n}"`));
 assert.equal((natural.match(/data-note=/g)||[]).length,7);
 assert.equal((chromatic.match(/data-note=/g)||[]).length,12);
 const c=new PilotController({getState:()=>({...initialState(),profile})});c.session={activity:'note-4',stage:'practice',queue:[{mode:'name',answerKind:'pitch',target:{midi:40}}],index:0};assert.match(c.wheel(),/E2/);assert.match(c.wheel(),/E3/);assert.match(c.wheel(),/E4/);
});
test('Perfect requires six observations in both directions, durable counts agree with raw events',()=>{
 const events=Array.from({length:6},(_,i)=>({target:{string:0,fret:0,midi:40},mode:i<3?'name':'find',correct:true,ms:1000}));
 assert.equal(positionProgress(events.slice(0,1),0,0).status,'worked');assert.equal(positionProgress(events,0,0).status,'perfect');
 assert.equal(positionProgress([],0,0,{name:{total:3,correct:3},find:{total:3,correct:3}}).status,'perfect');
 events[5].correct=false;assert.equal(positionProgress(events,0,0).status,'review');
 const html=progressView(profile,[],events.length?[{events:events.map(e=>({...e,correct:true}))}]:[]);assert.match(html,/100% <span class="double-check">✓✓<\/span>/);assert.match(html,/Parfait/);
});
test('Scroll thumb faithfully represents visible content, independently of scroll position',()=>{
 assert.equal(scrollbarThumb(1000,800,1600),500);assert.equal(scrollbarThumb(300,300,1500),60);assert.equal(scrollbarThumb(300,600,400),300);
});
test('Gameplay preserves v0.23 proportions rather than filling the viewport height',()=>{
 for(const n of [4,6,7,8]){
  const expected=(52+(n-6)*7)*1.65;
  for(const [w,h]of [[340,240],[620,650],[480,150]]){
   const g=neckGeometry(n,4,648,{gameplay:true,availableWidth:w,availableHeight:h}),fit=fitNeck(g,w,h);
   assert.equal(g.height,expected+14);assert.equal(g.ys.at(-1),5);assert.ok(Math.abs(g.ys[0]-expected-2)<1e-10);assert.ok(fit.width<=w&&fit.height<=h);
  }
 }
 assert.equal(neckGeometry(6).height,66);
});
test('Collection defaults to all, retains old preferences, and provides an album overview and detail switch',()=>{
 assert.equal(initialState().collection.category,'all');assert.equal(preferences({collection:{category:'all'}}).collection.category,'all');
 assert.equal(preferences({collection:{category:'music',layout:'list'}}).collection.category,'music');
 const pilot=new PilotController({getState:()=>({...initialState(),profile})});pilot.syncAchievements=()=>{};pilot.save=()=>{};
 const c=new AchievementsController({pilot,getState:()=>({...initialState(),profile}),icon:()=>''});const html=c.render();assert.match(html,/data-value="all"/);assert.ok(html.includes('data-success-action="layout"'));assert.ok(!html.includes('is-list'));
});
test('Retired Christmas sleeve never gets assigned again; new island has a distinct stable number, preserved old proof',()=>{
 const catalog=betaCatalog(profile),assigned=[...catalogMelodies(catalog).values()];assert.ok(assigned.some(m=>m.id==='feel-good-inc'));assert.ok(!assigned.some(m=>m.id==='christmas-song'||m.id==='cantaloupe-island'));
 assert.equal(MUSIC_CARD_NUMBERS['christmas-song'],'M009');assert.equal(MUSIC_CARD_NUMBERS['cantaloupe-island'],'M027');
 const old={id:'music-christmas-song',musicId:'christmas-song',scope:'global',profileKey:profile.key,activity:'note-3-find',shift:0,at:123,version:1};
 const card=achievementContext({profile,catalog,data:{attempts:[]},existing:[old]}).definitions.find(d=>d.music?.id==='christmas-song');assert.equal(card.obtained.at,123);
 assert.ok(rewardFor(melodyById('immigrant-song')).hasHarmony);
});
test('Revised musical timelines retain exact bar totals, register and requested tempo',()=>{
 const seven=rewardFor(melodyById('seven-nation'));seven.events.forEach((e,i)=>assert.ok(Math.abs(e.start-[0,1.5,2,2+2/3,2+4/3,4,6][i])<1e-10));assert.equal(seven.totalBeats,8);
 const around=rewardFor(melodyById('around-world'));assert.equal(around.totalBeats,16);assert.equal(around.events[0].midi,33);assert.equal(around.events[6].start,4);assert.equal(around.events[12].start,8);assert.equal(around.events[16].start,12);
 const island=rewardFor(melodyById('cantaloupe-island'));assert.equal(island.totalBeats,13);assert.deepEqual(island.events.slice(0,5).map(e=>e.start),[0,.5,3,3.5,4]);assert.equal(rewardFor(melodyById('rainbow')).step,60/156);
});
test('Warm acoustic and cabinet distortion produce finite calibrated voices across the instrument range',()=>{
 const rng=()=>{let n=1;return()=>((n=n*16807%2147483647)/2147483647);};
 for(const hz of [65.406,110,329.628]){
  const powers=[];
  for(const [voice,synth]of [['guitar-acoustic',acousticString],['guitar-driven',drivenString]]){
   const pcm=calibrateVoice(synth(hz,22050,1.8,rng()),22050,hz,voice);assert.equal(pcm.length,39690);assert.ok(pcm.every(v=>Number.isFinite(v)&&Math.abs(v)<1));powers.push(audiblePower(pcm,22050,hz,voice));
  }
  assert.ok(Math.abs(20*Math.log10(powers[0]/powers[1]))<1);
 }
 const a=acousticString(110,22050,1,rng()),wire=pluckedString(110,22050,1,rng());
 const harmonic=(pcm,n)=>{let x=0,y=0;for(let i=2205;i<11025;i++){const w=2*Math.PI*110*n*i/22050;x+=pcm[i]*Math.cos(w);y+=pcm[i]*Math.sin(w);}return Math.hypot(x,y);};
 assert.ok(harmonic(a,1)/harmonic(a,5)>harmonic(wire,1)/harmonic(wire,5));
});
