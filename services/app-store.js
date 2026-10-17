import {initialState,validateState} from '../state.js';
import {storageService} from './storage-service.js';
const snapshot=value=>Object.freeze({...value,profile:value.profile?Object.freeze({...value.profile,tuning:Object.freeze([...value.profile.tuning])}):null});
/** Sole source for shared preferences; immutable snapshots, explicit subscriptions. */
export function createAppStore({storage=storageService}={}){
 let state=snapshot(initialState());const listeners=new Set();
 function replace(value,{persist=true}={}){const next=snapshot(validateState(value)),previous=state;state=next;if(persist)storage.saveSettings(next);for(const fn of listeners)fn(next,previous);return next;}
 return Object.freeze({initialize(){state=snapshot(storage.readSettings());return state;},getState:()=>state,
  update(patch){return replace({...state,...patch});},replace,
  subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);}
 });
}
export const appStore=createAppStore();
