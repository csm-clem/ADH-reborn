import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile} from '../core.js';
import {initialPilotStore,validatePilotStore} from '../pilot.js';
import {resetInstrumentProgress} from '../reset-progress.js';
import {newArcadeRun,resolveArcade} from '../arcade-rules.js';
import {responseTimeColor,responseTimeMap} from '../progress.js';
import {rewardFor} from '../reward-music.js';
import {melodyById} from '../melodies.js';
import {achievementArtwork} from '../achievement-art.js';

const guitar=makeProfile('guitar6'),drop=makeProfile('guitar6','D2 A2 D3 G3 B3 E4'),bass=makeProfile('bass4');
test('Reset deletes all tunings of only the chosen instrument, including its Arcade and earned awards',()=>{
 const store=initialPilotStore();
 for(const p of [guitar,drop,bass])store.profiles[p.key]={profile:p,attempts:[],later:[],courses:{},session:null};
 const r=newArcadeRun('zones-natural');for(let i=0;i<3;i++)resolveArcade(r,{string:0,fret:0,midi:40},'timeout',4000);r.at=100;
 store.profiles[guitar.key].arcade={version:1,records:{'zones-natural':r}};
 store.achievements=[guitar,bass].map(p=>({id:'first-session',scope:p.key,profileKey:p.key,at:100,version:1,proofs:[],evidence:[],zone:{start:0,end:4}}));
 const before=structuredClone(store),next=resetInstrumentProgress(store,'guitar6');
 assert.deepEqual(store,before);
 assert.deepEqual(Object.keys(next.profiles),[bass.key]);
 assert.deepEqual(next.profiles[bass.key],store.profiles[bass.key]);
 assert.deepEqual(next.achievements,[store.achievements[1]]);
 assert.doesNotThrow(()=>validatePilotStore(next));
 assert.throws(()=>resetInstrumentProgress(store,'unknown'));
});
test('Response-time heatmap uses per-position means and leaves legacy/unknown means uncolored',()=>{
 assert.equal(responseTimeColor(100),responseTimeColor(500));
 assert.notEqual(responseTimeColor(500),responseTimeColor(4000));
 const html=responseTimeMap(guitar,{'0:0':{total:3,correct:2,timeSum:2400},'0:1':{total:1,correct:1}},'latin');
 assert.ok(html.includes('1.20 s'));assert.ok(html.includes('progress-map-frame'));assert.ok(html.includes('progress-selection'));
 assert.equal((html.match(/data-progress-fret=/g)||[]).length,150);
 assert.equal((html.match(/style="--response-color:/g)||[]).length,1);
});
test('Immigrant Song follows the six supplied measures, ties and rests, without the final We vocal',()=>{
 const melody=melodyById('immigrant-song'),r=rewardFor(melody),v=r.events.filter(e=>e.voice==='guitar-clean'),g=r.events.filter(e=>e.velocity===1);
 assert.equal(r.totalBeats,24);assert.equal(g.length,72);
 assert.deepEqual(v.map(e=>[e.midi,e.start,e.beats]),[[66,7,.5],[73,7.5,.5],[72,8,4],[73,12,1.5],[66,15,.5],[73,15.5,.5],[72,16,4],[73,20,1.5]]);
 assert.deepEqual(g.slice(0,6).map(e=>[e.midi,e.start,e.beats]),[[42,0,.5],[42,.5,.25],[42,.75,.25],[54,1,.25],[42,1.25,.5],[54,1.75,.25]]);
 assert.equal(Math.max(...g.map(e=>e.start+e.beats)),24);
 assert.ok(v.every(e=>e.start<23.75));
 const svg=achievementArtwork({music:melody});assert.equal((svg.match(/class="midi-event"/g)||[]).length,80);
 assert.ok(r.events.every(e=>e.start+e.beats<=24));
});
