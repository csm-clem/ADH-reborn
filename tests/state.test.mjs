import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile,score,FIVE_STAR_MEDIAN_MS} from '../core.js';
import {initialState,validateState,loadState} from '../state.js';
import {STATE_KEY,PILOT_KEY,DATA_EPOCH,dataEpoch} from '../release.js';
class Storage{
 constructor(values={}){this.map=new Map(Object.entries(values));}get length(){return this.map.size;}key(i){return [...this.map.keys()][i];}getItem(k){return this.map.get(k)||null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}
}
test('Old v0 histories are removed while preferences, current session and unrelated site data survive',()=>{
 const profile=makeProfile('guitar7'),storage=new Storage({'adh-reborn:state:v1':JSON.stringify({profile,sound:false,notation:'latin',theme:'light',progress:{old:1},stats:[1]}),'adh-reborn:pilot:v1':'old','fretboard-trainer:pilot:0.7.0':'old',[PILOT_KEY]:'current','wordpress:preferences':'safe','fretboard-trainer:pilot:stable':'future-v1-user'});
 const result=loadState(storage);assert.deepEqual(result,{...initialState(),profile,sound:false,notation:'latin'});
 assert.equal(storage.getItem('adh-reborn:state:v1'),null);assert.equal(storage.getItem('adh-reborn:pilot:v1'),null);assert.equal(storage.getItem('fretboard-trainer:pilot:0.7.0'),null);
 assert.equal(storage.getItem(PILOT_KEY),'current');assert.equal(storage.getItem('fretboard-trainer:pilot:stable'),'future-v1-user');assert.equal(storage.getItem('wordpress:preferences'),'safe');assert.equal(JSON.parse(storage.getItem(STATE_KEY)).epoch,DATA_EPOCH);
 assert.deepEqual(loadState(storage),result);
});
test('Each v0 release has its own progress epoch; stable versions share the durable epoch',()=>{
 assert.notEqual(dataEpoch('0.8.0'),dataEpoch('0.8.1'));assert.equal(dataEpoch('1.0.0'),dataEpoch('1.1.0'));assert.equal(dataEpoch('1.1.0'),dataEpoch('2.0.0'));
});
test('Backups restore only this preview epoch, validate profiles and drop historical course fields',()=>{
 const value={...initialState(),profile:makeProfile('bass5'),progress:{old:1},stats:[1]};assert.deepEqual(validateState(value),{...initialState(),profile:value.profile});
 assert.throws(()=>validateState({...value,epoch:'0.7.0'}));assert.throws(()=>validateState({...value,profile:{instrumentId:'guitar6',tuning:[40]}}));assert.throws(()=>validateState({...value,sound:'yes'}));
 const storage=new Storage({[STATE_KEY]:'broken'});assert.deepEqual(loadState(storage),initialState());
});
test('The optional five-star challenge requires at most one second, without changing the pass threshold',()=>{
 assert.equal(FIVE_STAR_MEDIAN_MS,1000);const answers=ms=>Array.from({length:20},()=>({correct:true,ms}));assert.equal(score(answers(1000)).stars,5);assert.equal(score(answers(1001)).stars,4);
});
