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
test('Targeted categories expose only their own real scopes and retain the selected category',()=>{
 const c=controller();c.data.navigation={branch:'targeted',route:null,chapter:null};
 for(const kind of ['zone','string','duo','mixed']){c.data.catalogKind=kind;const html=betaHome(c);assert.equal((html.match(/class="panel route-card"/g)||[]).length,c.catalog.scopes.filter(s=>s.kind===kind).length);assert.match(html,new RegExp(`aria-selected="true"[^>]+data-kind="${kind}"`));}
});
