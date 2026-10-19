import test from 'node:test';
import assert from 'node:assert/strict';
import {PilotController} from '../pilot-ui.js';
import {makeProfile} from '../core.js';
import {initialState} from '../state.js';
import {initialPilotStore,questionsFor,pilotCorrect} from '../pilot.js';
function pilot(instrument='guitar6',id='cs1-note-4-find'){
 const profile=makeProfile(instrument),c=new PilotController({getState:()=>({...initialState(),profile}),icon:()=>'',storage:{readPilot:()=>({ok:true,value:initialPilotStore()}),savePilot:()=>({ok:true})}}),m=c.resolve(id)||c.catalog.activities.find(m=>m.scopeId==='cs1'&&m.mode==='find');
 c.session={activity:m.id,stage:'practice',queue:questionsFor(m),index:0};return c;
}
test('Whole-string gameplay keeps the physical instrument and its numbering for every profile',()=>{
 for(const id of ['guitar6','guitar7','guitar8','bass4','bass5','bass6']){
  const c=pilot(id),g=c.geometry;assert.equal(g.visibleStrings.length,c.profile.tuning.length);assert.equal(g.visibleFrets.length,13);
  const svg=c.diagram();assert.equal((svg.match(/class="neck-string/g)||[]).length,c.profile.tuning.length);assert.equal((svg.match(/data-pilot-string=/g)||[]).length,c.profile.tuning.length*13);
  const q=c.question;assert.ok(pilotCorrect(c.profile,q,{string:q.target.string,fret:q.target.fret}));assert.equal(pilotCorrect(c.profile,q,{string:(q.target.string+1)%c.profile.tuning.length,fret:q.target.fret}),false);
 }
});
test('Answer pad is opt-in, keeps the toggle, and does not change the assessed string',()=>{
 const c=pilot();assert.equal(c.positionsVisible,false);assert.match(c.longPositionButtons(),/id="long-position-pad"[^>]* hidden/);assert.match(c.longPositionButtons(),/aria-expanded="false"/);
 c.coordinatesOpen=true;assert.equal(c.positionsVisible,true);const markup=c.longPositionButtons();assert.match(markup,/Masquer les boutons de réponse/);assert.ok(!/id="long-position-pad"[^>]* hidden/.test(markup));assert.ok(!markup.includes('data-string="1"'));
});
test('A zone assessment restricted to one string still shows its neighbours',()=>{
 const c=pilot();c.session.activity='review-targeted-find';c.session.reviewPool=[{string:2,fret:3,midi:53}];c.session.reviewSource='z1-note-5-find';assert.equal(c.geometry.visibleStrings.length,6);
});

test('The entry course for a whole string also keeps the complete instrument in view',async()=>{
 const {CourseController}=await import('../course-ui.js'),p=pilot(),course=new CourseController({pilot:p,getState:()=>p.host.getState()});course.active='cs1-entry';
 const page=course.courses.get('cs1-entry').pages.find(p=>p.id==='line'),svg=course.visual(page);
 assert.match(svg,/data-neck-strings="0,1,2,3,4,5"/);assert.equal((svg.match(/class="neck-string/g)||[]).length,6);
});
