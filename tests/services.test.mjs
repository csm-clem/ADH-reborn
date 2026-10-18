import test from 'node:test';
import assert from 'node:assert/strict';
import {createStorageService} from '../services/storage-service.js';
import {createAppStore} from '../services/app-store.js';
import {createAudioService} from '../services/audio-service.js';
import {createPlatformService} from '../services/platform-service.js';
import {STATE_KEY,PILOT_KEY} from '../release.js';
import {initialState} from '../state.js';
import {initialPilotStore} from '../pilot.js';
import {makeProfile} from '../core.js';
class MemoryStorage{
 constructor(values={}){this.values=new Map(Object.entries(values));this.fail=()=>false;}
 get length(){return this.values.size;}key(i){return [...this.values.keys()][i];}getItem(key){return this.values.get(key)??null;}
 setItem(key,value){if(this.fail(key,value))throw new Error('quota');this.values.set(key,value);}removeItem(key){this.values.delete(key);}
}
const fixture=values=>{const backend=new MemoryStorage(values);return {backend,storage:createStorageService({getStorage:()=>backend})};};
test('Corrupt pilot data stays protected until an explicit validated replacement',()=>{
 const {backend,storage}=fixture({[PILOT_KEY]:'broken'}),r=storage.readPilot();assert.equal(r.ok,false);assert.equal(r.unreadableRaw,'broken');assert.equal(storage.savePilot(initialPilotStore()).ok,false);assert.equal(backend.getItem(PILOT_KEY),'broken');assert.equal(storage.replacePilot(initialPilotStore()).ok,true);assert.equal(storage.status.pilot,true);assert.equal(storage.savePilot(initialPilotStore()).ok,true);
});
test('A failed two-part import rolls back both files; invalid data never starts writing',()=>{
 const {backend,storage}=fixture({[STATE_KEY]:'old-settings',[PILOT_KEY]:'old-pilot'}),backup={...initialState(),notation:'latin',pilotBackup:initialPilotStore()};let once=true;backend.fail=(key)=>key===PILOT_KEY&&once?(once=false,true):false;
 assert.throws(()=>storage.restoreBackup(backup),/conservées/);assert.equal(backend.getItem(STATE_KEY),'old-settings');assert.equal(backend.getItem(PILOT_KEY),'old-pilot');assert.throws(()=>storage.restoreBackup({...backup,epoch:'corrupt'}));assert.equal(backend.getItem(STATE_KEY),'old-settings');storage.restoreBackup(backup);assert.equal(storage.status.pilot,true);assert.equal(JSON.parse(backend.getItem(STATE_KEY)).notation,'latin');
});
test('Read-only storage retains readable preferences and reports persistence failure',()=>{
 const {backend,storage}=fixture({[STATE_KEY]:JSON.stringify({...initialState(),theme:'dark',sound:false})});backend.fail=()=>true;const store=createAppStore({storage});assert.equal(store.initialize().theme,'dark');assert.equal(store.getState().sound,false);assert.equal(storage.status.settings,false);store.update({notation:'latin'});assert.equal(store.getState().notation,'latin');assert.equal(storage.status.settings,false);
});
test('Shared preferences notify subscribers once, cannot mutate in place, and unsubscribe cleanly',()=>{
 const {storage}=fixture(),store=createAppStore({storage});store.initialize();const calls=[],unsub=store.subscribe((next,prev)=>calls.push([next.theme,prev.theme]));store.update({theme:'accessible',profile:makeProfile('guitar7')});assert.deepEqual(calls,[['accessible','light']]);assert.throws(()=>store.getState().profile.tuning.push(99));unsub();store.update({sound:false});assert.equal(calls.length,1);assert.equal(store.getState().profile.tuning.length,7);
});
class Target extends EventTarget{}
const browserFixture=()=>{const win=new Target(),doc=new Target(),media=new Target();doc.documentElement={dataset:{}};media.matches=false;win.matchMedia=()=>media;return {win,doc,media,service:createPlatformService({getWindow:()=>win,getDocument:()=>doc,delay:5})};};
test('Reconnecting platform listeners replaces them, and an old disposer cannot remove the new set',()=>{
 const {win,doc,service}=browserFixture();let n=0;const old=service.connect({onHidden:()=>n++});service.connect({onHidden:()=>n++});old();doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));win.dispatchEvent(new Event('pagehide'));assert.equal(n,2);service.dispose();win.dispatchEvent(new Event('pagehide'));assert.equal(n,2);
});
test('System theme follows the device only while selected; resize settles once',async()=>{
 const {win,doc,media,service}=browserFixture();let immediate=0,settled=0;service.connect({onResize:()=>immediate++,onResizeSettled:()=>settled++});service.setTheme('system');assert.equal(doc.documentElement.dataset.theme,'light');media.matches=true;media.dispatchEvent(new Event('change'));assert.equal(doc.documentElement.dataset.theme,'dark');service.setTheme('accessible');media.matches=false;media.dispatchEvent(new Event('change'));assert.equal(doc.documentElement.dataset.theme,'accessible');win.dispatchEvent(new Event('resize'));win.dispatchEvent(new Event('resize'));await new Promise(r=>setTimeout(r,15));assert.equal(immediate,2);assert.equal(settled,1);service.dispose();
});
function audioFixture(){
 const sources=[];let contexts=0;const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){}}),context={state:'running',sampleRate:8000,currentTime:1,destination:{},resume:async()=>{},close:async()=>{},createBuffer:(_,n)=>({length:n,copyToChannel(){}}),createBufferSource:()=>{const s={connect(){},disconnect(){},start(when){this.when=when;},stop(when){this.stopped=when??true;}};sources.push(s);return s;},createGain:()=>({connect(){},disconnect(){},gain:param()}),createBiquadFilter:()=>({connect(){},disconnect(){},frequency:param(),Q:param()})};
 let prefs={...initialState(),profile:makeProfile('guitar6')};const engine=createAudioService({getState:()=>prefs,createContext:()=>{contexts++;return context;},yieldFrame:()=>Promise.resolve()});return {engine,sources,context,setPrefs:p=>prefs={...prefs,...p},contexts:()=>contexts};
}
test('Audio shares one context and cache while overlapping notes retain their tails',async()=>{
 const {engine,sources,contexts}=audioFixture();await engine.playNote(40);await engine.playNote(40);await engine.playNote(45);assert.equal(contexts(),1);assert.equal(sources[0].buffer,sources[1].buffer);assert.equal(sources[0].stopped,undefined);assert.equal(sources[1].stopped,undefined);engine.stopAudio();assert.ok(sources.every(s=>s.stopped));await engine.dispose();
});
test('Mute cancels notes waiting for audio unlock, not only already sounding notes',async()=>{
 const f=audioFixture();let release;f.context.resume=()=>new Promise(r=>release=r);const pending=f.engine.playNote(40);f.setPrefs({sound:false});f.engine.stopAudio();release();await pending;assert.equal(f.sources.length,0);
});
test('Timed sequences retain rhythm and changing voice cancels previous playback',async()=>{
 const f=audioFixture();await f.engine.playSequence([{midi:40,beats:2},{midi:47,beats:1}],{step:.25});assert.equal(f.sources[1].when-f.sources[0].when,.5);const previous={...initialState(),profile:makeProfile('guitar6')},next={...previous,voice:'bass-electric'};f.engine.preferencesChanged(next,previous);assert.ok(f.sources.every(s=>s.stopped));
});
