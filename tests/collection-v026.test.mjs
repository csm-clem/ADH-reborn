import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {makeProfile,INSTRUMENTS} from '../core.js';
import {betaCatalog} from '../beta-catalog.js';
import {betaCourses} from '../beta-courses.js';
import {questionsFor,initialPilotStore,validatePilotStore} from '../pilot.js';
import {ACHIEVEMENTS,achievementContext,evaluateAchievements} from '../achievement-rules.js';
import {preserveAchievementEvidence} from '../achievement-evidence.js';
import {preserveLearningProofs} from '../learning-evidence.js';
import {simulatedBetaCompletion} from '../debug-mode.js';
import {catalogMelodies} from '../melodies.js';
import {achievementArtwork,musicArtIdentities} from '../achievement-art.js';
import {rewardFor} from '../reward-music.js';
const profile=makeProfile('guitar6'),catalog=betaCatalog(profile);
function attempt(id,{at=100,ms=700,aids=[],accuracy=1,comparisonKey=id}={}){
 const m=catalog.activities.find(m=>m.id===id),qs=questionsFor(m);
 return {id:id+'-'+at,activity:id,comparisonKey,at,finished:true,passed:accuracy>=.9,events:qs.map((q,i)=>({target:q.target,mode:q.mode,answerKind:q.answerKind,aids,correct:i/qs.length<accuracy,ms,at,retry:false,timingInterpretable:true}))};
}
const view=(data,existing=[])=>achievementContext({profile,catalog,data,existing}).definitions;
test('The 42 stable models, distinct artwork and inline SVG timelines are actual production assets',async()=>{
 assert.equal(ACHIEVEMENTS.length,42);assert.equal(new Set(ACHIEVEMENTS.map(d=>d.number)).size,42);
 const images=await readdir(new URL('../achievement-art/',import.meta.url));assert.equal(images.filter(f=>f.endsWith('.svg')).length,46);
 const sources=await Promise.all(ACHIEVEMENTS.map(d=>readFile(new URL('../achievement-art/'+d.id+'.svg',import.meta.url),'utf8')));assert.equal(new Set(sources).size,42);
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');for(const d of ACHIEVEMENTS)assert.ok(sw.includes('./achievement-art/'+d.id+'.svg'));
 for(const name of ['perfect-natural-z2','perfect-natural-z3','perfect-chromatic-z2','perfect-chromatic-z3']){assert.ok(sw.includes('./achievement-art/'+name+'.svg'));assert.ok(!sources.includes(await readFile(new URL('../achievement-art/'+name+'.svg',import.meta.url),'utf8')));}
 for(const d of view({attempts:[]}).filter(d=>d.music)){
  assert.ok(musicArtIdentities[d.music.id]);const svg=achievementArtwork(d),events=rewardFor(d.music).events;
  const parsed=[...svg.matchAll(/data-midi="(\d+)" data-event-index="(\d+)" data-start="([\d.]+)" data-beats="([\d.]+)"/g)].map(m=>({midi:+m[1],start:+m[3],beats:+m[4]}));
  assert.deepEqual(parsed,events.map(({midi,start,beats})=>({midi,start,beats})));
 }
});
test('Opening a card proves nothing; partial challenges route to the missing criterion and progress agrees',()=>{
 const empty=view({attempts:[]});assert.ok(empty.every(d=>d.progress.percent===0&&!d.eligible));
 const data={attempts:[attempt('opens')]},defs=view(data),open=defs.find(d=>d.id==='open-strings');assert.equal(open.progress.percent,50);assert.equal(open.target.id,'opens-find');
 assert.ok(defs.find(d=>d.id==='first-session').eligible);assert.ok(!defs.find(d=>d.id==='first-discovery').eligible);
 const course=defs.find(d=>d.id==='diagram-check');assert.deepEqual(course.target,{kind:'course',id:'gd-02'});
 const firstFamily=defs.find(d=>d.id==='first-family');assert.ok(firstFamily.target.id);
});
test('Durable counters survive a purged journal, retain exact pitch coverage, and process each attempt once',()=>{
 const data={profile,attempts:[attempt('opens'),attempt('opens-find',{at:101})],later:[]};
 preserveLearningProofs(catalog,data);const proof=preserveAchievementEvidence(catalog,data),copy=structuredClone(proof);
 preserveAchievementEvidence(catalog,data);assert.deepEqual(JSON.parse(JSON.stringify(data.collectionEvidence)),copy);
 data.attempts=[];const def=view(data).find(d=>d.id==='open-strings');assert.equal(def.progress.percent,100);assert.ok(def.eligible);
 assert.equal(new Set(proof.coverage.z1.pitch).size,profile.tuning.length);
 const store=initialPilotStore();store.profiles[profile.key]=data;assert.deepEqual(JSON.parse(JSON.stringify(validatePilotStore(store).profiles[profile.key].collectionEvidence)),copy);
 const invalid=structuredClone(store);invalid.profiles[profile.key].collectionEvidence.coverage.z1.name.push('99:99');assert.throws(()=>validatePilotStore(invalid));
});
test('Aids, interrupted timing and changed exercise contracts cannot grant speed or record awards',()=>{
 const aided=attempt('opens',{aids:['open-names']});assert.ok(!view({attempts:[aided]}).find(d=>d.id==='one-second').eligible);
 const unclocked=attempt('opens');unclocked.events[0].timingInterpretable=false;assert.ok(!view({attempts:[unclocked]}).find(d=>d.id==='one-second').eligible);
 const previous=attempt('opens',{ms:1000,at:1}),slight=attempt('opens',{ms:970,at:2}),good=attempt('opens',{ms:900,at:3});
 assert.ok(!view({attempts:[previous,slight]}).find(d=>d.id==='personal-fluidity').eligible);
 assert.ok(view({attempts:[previous,good]}).find(d=>d.id==='personal-fluidity').eligible);
 assert.ok(!view({attempts:[previous,{...good,comparisonKey:'opens:new-contract'}]}).find(d=>d.id==='personal-fluidity').eligible);
 const interrupted={...good,finished:false};assert.ok(!view({attempts:[interrupted]}).find(d=>d.id==='first-session').eligible);
 const oldFormat={...good,events:good.events.map(e=>({...e,answerKind:'class'}))};assert.ok(!view({attempts:[oldFormat]}).find(d=>d.id==='one-second').eligible);
});
test('All available beta cards are demonstrable for each supported instrument, without counting guided activity twice',()=>{
 for(const instrument of INSTRUMENTS){
  const p=makeProfile(instrument.id),c=betaCatalog(p),store=simulatedBetaCompletion(p,c),data=store.profiles[p.key],defs=achievementContext({profile:p,catalog:c,data,existing:store.achievements}).definitions;
  assert.ok(defs.every(d=>d.obtained),instrument.id+': '+defs.filter(d=>!d.obtained).map(d=>d.id));
  assert.equal(new Set(defs.map(d=>d.number)).size,defs.length);
  const before=store.achievements.length;store.achievements.push(...evaluateAchievements({profile:p,catalog:c,data,existing:store.achievements,entry:{at:Date.now()}}));assert.equal(store.achievements.length,before);
  assert.ok(defs.find(d=>d.id==='beta-atlas').obtained);assert.ok(defs.find(d=>d.id==='beta-encore').obtained);
 }
});
test('Every route targets a compatible activity or checked course, and each known work has one beta assignment',()=>{
 for(const p of [profile,makeProfile('bass4'),makeProfile('guitar7','B1 F#2 B2 E3 A3 C#4 F#4'),makeProfile('guitar6','E4 A2 D3 G3 B3 E2')]){
  const c=betaCatalog(p),cs=betaCourses(p,c),defs=achievementContext({profile:p,catalog:c}).definitions;
  for(const d of defs)assert.ok(d.target.kind==='course'?cs.has(d.target.id):[...c.activities,...c.discoveries].some(a=>a.id===d.target.id),p.key+': '+d.id);
  const music=catalogMelodies(c);assert.equal(new Set([...music.values()].map(m=>m.id)).size,music.size);
  for(const [id,m]of music){const a=c.activities.find(a=>a.id===id);assert.ok(m.sequence.every(p=>a.pool.some(q=>q.midi===p.midi&&q.string===p.string&&q.fret===p.fret)));}
 }
});
test('Legacy dates survive stricter new rules, and the musical clean-chain criterion requires actual first-chain evidence',()=>{
 const a=attempt('opens'),unlocks=evaluateAchievements({profile,catalog,data:{attempts:[a]},entry:a}),old=unlocks.find(u=>u.id==='first-session');delete old.ruleVersion;
 const current=view({attempts:[]},[old]);assert.equal(current.find(d=>d.id==='first-session').obtained.at,100);assert.equal(current.find(d=>d.id==='first-session').progress.percent,100);
 const historicalSleeve={...old,id:'music-sweet-dreams',scope:'global',musicId:'sweet-dreams',shift:0,activity:'opens-find',arrangementVersion:1};assert.equal(view({attempts:[]},[historicalSleeve]).find(d=>d.id==='music-sweet-dreams').obtained.at,100);
 const work=[...catalogMelodies(catalog).values()][0],id=[...catalogMelodies(catalog)][0][0],entry={...attempt(id),motifCompleted:true,melodyId:work.id,music:{shift:work.shift}};
 let evidence=preserveAchievementEvidence(catalog,{attempts:[entry]});assert.equal(evidence.music[work.id].clean,false);
 evidence=preserveAchievementEvidence(catalog,{attempts:[{...entry,motifErrors:0}]});assert.equal(evidence.music[work.id].clean,true);
});
