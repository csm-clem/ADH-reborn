import {loadState,initialState,validateState,preferences} from '../state.js';
import {initialPilotStore,validatePilotStore} from '../pilot.js';
import {STATE_KEY,PILOT_KEY} from '../release.js';

/** Browser storage is accessed only here. Session data stays in each controller. */
export function createStorageService({getStorage=()=>globalThis.localStorage}={}){
 const listeners=new Set(),blocked=new Set();let status={settings:true,pilot:true};
 const report=(kind,ok)=>{if(status[kind]===ok)return;status={...status,[kind]:ok};for(const fn of listeners)fn({...status});};
 const backend=()=>{const s=getStorage();if(!s)throw new Error('Le stockage local est indisponible.');return s;};
 const write=(kind,key,value)=>{try{if(blocked.has(key))throw new Error('La sauvegarde illisible est protégée. Importez une sauvegarde valide pour la remplacer.');backend().setItem(key,JSON.stringify(value));report(kind,true);return {ok:true};}catch(error){report(kind,false);return {ok:false,error};}};
 return Object.freeze({
  get status(){return {...status};},
  subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);},
  readSettings(){try{const value=loadState(backend());report('settings',true);return value;}catch{report('settings',false);try{return preferences(JSON.parse(backend().getItem(STATE_KEY)));}catch{return initialState();}}},
  saveSettings(value){return write('settings',STATE_KEY,value);},
  readPilot(){let raw=null;try{const s=backend();raw=s.getItem(PILOT_KEY);if(!raw){const keys=Array.from({length:s.length},(_,i)=>s.key(i)).filter(k=>/^fretboard-trainer:pilot:0\.\d+\.\d+$/.test(k||'')).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));let protectedRaw=null;for(const key of keys){const legacy=s.getItem(key);try{const valid=validatePilotStore(JSON.parse(legacy));s.setItem(PILOT_KEY,JSON.stringify(valid));raw=JSON.stringify(valid);break;}catch{protectedRaw||=legacy;/* Never remove or overwrite an older backup. */}}if(!raw&&protectedRaw){raw=protectedRaw;throw new Error('Ancienne sauvegarde non lisible : elle est conservée.');}}const value=raw?validatePilotStore(JSON.parse(raw)):initialPilotStore();report('pilot',true);return {value,unreadableRaw:null,ok:true};}catch(error){if(raw)blocked.add(PILOT_KEY);report('pilot',false);return {value:initialPilotStore(),unreadableRaw:raw,error,ok:false};}},
  savePilot(value){return write('pilot',PILOT_KEY,value);},
  replacePilot(value){const valid=validatePilotStore(value),wasBlocked=blocked.delete(PILOT_KEY),result=write('pilot',PILOT_KEY,valid);if(!result.ok&&wasBlocked)blocked.add(PILOT_KEY);return result;},
  backup(settings,pilot){return JSON.stringify({...validateState(settings),pilotBackup:validatePilotStore(pilot)},null,2);},
  parseBackup(raw){return {settings:validateState(raw),pilot:validatePilotStore(raw.pilotBackup)};},
  restoreBackup(raw){
   const parsed=this.parseBackup(raw),s=backend(),oldSettings=s.getItem(STATE_KEY),oldPilot=s.getItem(PILOT_KEY);
   try{s.setItem(STATE_KEY,JSON.stringify(parsed.settings));s.setItem(PILOT_KEY,JSON.stringify(parsed.pilot));}
   catch(error){let rollback=true;for(const [key,value]of [[STATE_KEY,oldSettings],[PILOT_KEY,oldPilot]])try{if(value===null)s.removeItem(key);else s.setItem(key,value);}catch{rollback=false;}report('settings',false);report('pilot',false);throw new Error(rollback?'Import impossible : les données précédentes ont été conservées.':'Import interrompu : le stockage refuse aussi la restauration. Conservez votre fichier de sauvegarde.',{cause:error});}
   blocked.delete(PILOT_KEY);report('settings',true);report('pilot',true);return parsed;
  }
 });
}
export const storageService=createStorageService();
