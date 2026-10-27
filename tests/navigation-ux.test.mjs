import {initialHistoryStates} from '../services/navigation-service.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {PilotController} from '../pilot-ui.js';
import {makeProfile} from '../core.js';
import {initialState} from '../state.js';
import {nextStudy,resumeStudy,chapterState,navigationTrail,betaHome} from '../beta-home.js';
const profile=makeProfile('guitar6');
function controller(){const c=new PilotController({getState:()=>({...initialState(),profile})});c.save=()=>{};return c;}
test('Home shortcut retains all three branches and enters the actual recommended chapter',()=>{
 const c=controller(),html=betaHome(c),next=nextStudy(c);assert.ok(next.chapter.id);assert.match(html,/data-pilot-action="study-next"/);assert.equal((html.match(/class="branch-jumbo"/g)||[]).length,3);
 let started;c.start=id=>{started=id;};c.host.openCourse=id=>{started=id;};resumeStudy(c);assert.equal(c.data.navigation.chapter,next.chapter.id);assert.equal(started,next.next.id);
});
test('Chapter states distinguish a visit from evidence of completion',()=>{
 const c=controller(),ch=c.catalog.chapters.find(ch=>ch.activityIds?.length),e={chapters:new Map([[ch.id,{complete:false}]])};
 assert.equal(chapterState(c,ch,e).key,'new');c.data.session={activity:ch.activityIds[0]};assert.equal(chapterState(c,ch,e).key,'started');
 e.chapters.get(ch.id).complete=true;assert.equal(chapterState(c,ch,e).key,'complete');
});
test('Trail uses the chosen guided or targeted parents and actual chapter title',()=>{
 const c=controller(),ch=c.catalog.byScope.get('z1').chapters[0];c.data.navigation={branch:'guided',route:'guided',chapter:ch.id};
 assert.deepEqual(navigationTrail(c).map(t=>t.label),['Parcours','Progression guidée','Niveau 1 : Débutant',ch.title]);
 c.data.navigation={branch:'targeted',route:'z1',chapter:ch.id};assert.equal(navigationTrail(c)[1].label,'Pratique ciblée');
});
test('The full directory shows every category and every scope at once',()=>{
 const c=controller();c.data.navigation={branch:'targeted',route:null,chapter:null};
 const html=betaHome(c);assert.equal((html.match(/class="panel route-card"/g)||[]).length,c.catalog.scopes.length);assert.equal((html.match(/class="catalogue-section"/g)||[]).length,4);assert.doesNotMatch(html,/role="tablist"/);
});

test('Revision shortcut describes the activity actually being revised',()=>{
 const c=controller(),activity=c.catalog.activities.find(a=>a.id==='opens-find');c.data.studyRoute='guided';
 c.data.attempts=[{id:'failed-for-review',activity:activity.id,finished:true,passed:false,at:Date.now(),events:[{mode:'find',target:activity.pool[0],correct:false,ms:1000,at:Date.now(),aids:[],retry:false}]}];
 const next=nextStudy(c);assert.equal(next.review.kind,'errors');assert.equal(next.next.id,activity.id);assert.equal(next.activity.subtitle,activity.subtitle);
 let chosen;c.action=(action,button)=>chosen=[action,button.dataset.id];resumeStudy(c);assert.deepEqual(chosen,['beta-review',activity.id]);
});

test('A fresh chapter entry has real parents, without trapping root or duplicating refresh history',()=>{
 const state={profile:'guitar6',screen:'home',nav:{branch:'targeted',route:'z1',chapter:'opens'},course:null,activity:null};
 const chain=initialHistoryStates(state,null);
 assert.deepEqual(chain.map(s=>s.nav),[{branch:null,route:null,chapter:null},{branch:'targeted',route:null,chapter:null},{branch:'targeted',route:'z1',chapter:null},state.nav]);
 assert.ok(chain.every(s=>s.profile===state.profile));
 assert.equal(initialHistoryStates(state,{...state}).length,4,'Older history entries also gain their missing parents once');
 assert.equal(initialHistoryStates(state,{...state,screen:'settings',historyVersion:1}).length,1);
 assert.equal(initialHistoryStates({...state,nav:{branch:null,route:null,chapter:null}},null).length,1);
 assert.equal(initialHistoryStates({...state,screen:'stats'},null).length,1);
});
import {interactionCue} from '../learning-help.js';
import {NavigationController} from '../services/navigation-service.js';
test('First-use cues name the actual interaction surface and the melody order',()=>{
 assert.match(interactionCue({kind:'name'},{}),/roue/);
 assert.match(interactionCue({kind:'mix'},{mode:'find'}),/manche/);
 assert.match(interactionCue({kind:'motif'},{}),/1 → 2 → 3/);
});
test('History gestures only follow existing entries and never fabricate a next lesson',()=>{
 const calls=[],c=Object.create(NavigationController.prototype);c.win={history:{back:()=>calls.push('back'),forward:()=>calls.push('forward')}};c.index=0;c.maximum=0;
 assert.equal(c.back(),false);assert.equal(c.forward(),false);c.index=2;c.maximum=3;assert.equal(c.back(),true);assert.equal(c.forward(),true);assert.deepEqual(calls,['back','forward']);c.index=3;assert.equal(c.forward(),false);
});
