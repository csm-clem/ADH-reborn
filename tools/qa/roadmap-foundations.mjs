/** Independent musical-coordinate audit for the roadmap foundation gates. */
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {makeProfile,neckGeometry} from '../../core.js';
import {pilotPlan,practiceActivities,questionsFor,pilotCorrect,admissiblePositions} from '../../pilot.js';
import {betaCatalog} from '../../beta-catalog.js';
import {betaCourses} from '../../beta-courses.js';
const configs=[['guitar6',null,[40,45,50,55,59,64]],['guitar7',null,[35,40,45,50,55,59,64]],['guitar8',null,[30,35,40,45,50,55,59,64]],['bass4',null,[28,33,38,43]],['bass5',null,[23,28,33,38,43]],['bass6',null,[23,28,33,38,43,48]],['guitar6','D2 A2 D3 G3 A3 D4',[38,45,50,55,57,62]],['guitar7','B1 F#2 B2 E3 A3 C#4 F#4',[35,42,47,52,57,61,66]],['guitar6','E4 A2 D3 G3 B3 E2',[64,45,50,55,59,40]]];
const zones=[[0,4],[4,8],[8,12],[12,16],[16,20],[20,24],[0,12],[0,24],[24,24]];
let activities=0,questions=0,positions=0;const details=[];
for(const [id,tuning,expected]of configs){
 const profile=makeProfile(id,tuning||undefined);assert.deepEqual(profile.tuning,expected);
 const catalog=betaCatalog(profile),courses=betaCourses(profile,catalog),z2=catalog.byScope.get('z2');
 for(const c of z2.chapters){if(c.kind==='course')assert.ok(courses.has(c.courseId));for(const a of c.activityIds)assert.ok(catalog.activities.some(m=>m.id===a));}
 for(const pair of courses.get('z2-co').pairs){assert.equal((pair[1].midi-pair[0].midi)%12,0);}
 for(const [start,end]of zones)for(const strings of [profile.tuning.map((_,i)=>i),[0],[profile.tuning.length-1]]){
  const zone={start,end},plan=pilotPlan(profile,{zone,strings,prefix:`audit-${start}-${end}-`});
  assert.equal(plan.all.length,strings.length*(end-start+1));
  for(const p of plan.all){assert.equal(p.midi,expected[p.string]+p.fret);assert.ok(p.fret>=start&&p.fret<=end);positions++;}
  const g=neckGeometry(profile.tuning.length,end,648,{startFret:start});
  for(const f of g.visibleFrets){assert.ok(f>=start&&f<=end);assert.ok(Number.isFinite(g.centers[f]));}
  for(const m of practiceActivities(plan)){
   const qs=questionsFor(m,{random:()=>.37});assert.ok(qs.length>=20&&qs.length<=30);activities++;
   for(const q of qs){
    assert.equal(q.target.midi,expected[q.target.string]+q.target.fret);assert.ok(q.target.fret>=start&&q.target.fret<=end);assert.ok(strings.includes(q.target.string));
    const answer=q.mode==='name'?(q.answerKind==='pitch'?q.target.midi:q.target.midi%12):q.target;
    assert.ok(pilotCorrect(profile,q,answer));
    if(q.mode==='name')assert.ok(!pilotCorrect(profile,q,answer+1));
    else for(const p of admissiblePositions(profile,q)){assert.equal(p.midi,q.target.midi);assert.equal(p.string,q.target.string);assert.ok(p.fret>=start&&p.fret<=end);}
    questions++;
   }
  }
 }
 details.push({instrument:id,tuning:profile.tuning,zone2Courses:z2.chapters.filter(c=>c.kind==='course').length});
}
await mkdir('work/roadmap',{recursive:true});await writeFile('work/roadmap/foundations.json',JSON.stringify({configurations:details,zones,activities,questions,positions,errors:[]},null,2));console.log(JSON.stringify({configurations:configs.length,zones:zones.length,activities,questions,positions}));
