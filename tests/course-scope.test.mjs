import test from 'node:test';
import assert from 'node:assert/strict';
import {INSTRUMENTS,makeProfile} from '../core.js';
import {betaCatalog} from '../beta-catalog.js';
import {CourseController} from '../course-ui.js';
import {initialState} from '../state.js';
import {betaCourses,coursePage} from '../beta-courses.js';

const profiles=[...INSTRUMENTS.map(i=>makeProfile(i.id)),makeProfile('guitar7','B1 F#2 B2 E3 A3 C#4 F#4'),makeProfile('guitar6','E4 A2 D3 G3 B3 E2')];
test('Every course retry stays on its physical strings and within its displayed fret range',()=>{
 for(const profile of profiles){const catalog=betaCatalog(profile,{full:true}),courses=betaCourses(profile,catalog);
  for(const course of courses.values())for(const [index,base] of course.pages.entries())for(const variant of [0,1,2,5,11]){
   const page=coursePage(course,{index,variants:{[base.id]:variant}}),quiz=page.quiz;
   if(quiz?.kind==='position'){
    const zone=page.zone||course.zone,strings=page.strings||course.strings;
    const label=`${profile.key}/${course.id}/${base.id}/retry-${variant}`;
    assert.ok(strings.includes(quiz.target.string),label+' physical string');
    assert.ok(quiz.target.fret>=zone.start&&quiz.target.fret<=zone.end,label+' fret');
    assert.equal(quiz.target.midi,profile.tuning[quiz.target.string]+quiz.target.fret,label+' pitch');
   }
   if(quiz?.kind==='choice'){
    assert.ok(quiz.choices.some(c=>c.value===quiz.answer),`${course.id}/${base.id}: missing correct choice`);
    assert.equal(new Set(quiz.choices.map(c=>c.value)).size,quiz.choices.length);
   }
   for(const point of page.points||[])if(Number.isInteger(point.string)&&Number.isInteger(point.fret))assert.equal(point.midi,profile.tuning[point.string]+point.fret,`${course.id}/${base.id}: displayed pitch`);
  }
 }
});
test('Duo entry teaches its own strings; 24-fret entry explicitly introduces scrolling',()=>{
 const p=makeProfile('guitar6'),catalog=betaCatalog(p,{full:true}),courses=betaCourses(p,catalog);
 const duo=courses.get('duo1-entry');assert.equal(duo.title,'Cordes 6 et 5 : vos repères');
 assert.equal(duo.pages.find(p=>p.id==='address-1').quiz.target.string,1);
 assert.match(courses.get('c24s1-entry').pages.find(p=>p.id==='line').text,/Glissez/);
});

test('Correspondence lessons explain each family/relation once instead of repeating every position',()=>{
 for(const profile of profiles)for(const c of betaCourses(profile,betaCatalog(profile,{full:true})).values()){
  if(!c.pairs)continue;
  const checks=c.pages.filter(p=>p.quiz),relations=checks.map(p=>`${p.points[0].midi%12}:${Math.abs(p.points[1].midi-p.points[0].midi)/12}`);
  assert.equal(new Set(relations).size,relations.length,c.id);
  assert.ok(c.pages.length<=30,`${c.id}: ${c.pages.length} screens`);
  assert.deepEqual(new Set(relations),new Set(c.pairs.map(pair=>`${pair[0].midi%12}:${Math.abs(pair[1].midi-pair[0].midi)/12}`)),c.id+' relation coverage');
 }
});

test('An unfinished older course returns to its missing pages instead of becoming stuck at the new end',()=>{
 const profile=makeProfile('guitar6'),catalog=betaCatalog(profile,{full:true}),courses=betaCourses(profile,catalog),course=courses.get('mix24-co'),last=course.pages.at(-1);
 const record={index:course.pages.length-1,visited:[],correct:last.quiz?[last.id]:[],completed:false};
 let closed=false;const pilot={catalog,data:{courses:{[course.id]:record}},save(){},leave(){},syncAchievements(){}};
 const ui=new CourseController({pilot,getState:()=>({...initialState(),profile}),render(){},home(){closed=true;},icon(){return ''},playSequence(){}});
 ui.active=course.id;ui.next();assert.equal(closed,false);assert.equal(record.completed,false);assert.equal(record.index,0);assert.ok(record.visited.includes(last.id));
});
