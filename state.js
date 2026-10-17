import {makeProfile,pitchLabel} from './core.js';
import {DATA_EPOCH,STATE_KEY,PILOT_KEY} from './release.js';
export function initialState(){return {version:1,epoch:DATA_EPOCH,profile:null,notation:'international',accidentals:'sharp',sound:true,voice:'auto',theme:'light',positionButtons:false};}
export function preferences(value){
 const state=initialState();if(!value||typeof value!=='object')return state;
 if(['international','latin'].includes(value.notation))state.notation=value.notation;
 if(['light','dark','system','accessible'].includes(value.theme))state.theme=value.theme;
 if(['sharp','flat'].includes(value.accidentals))state.accidentals=value.accidentals;
 if(typeof value.positionButtons==='boolean')state.positionButtons=value.positionButtons;
 if(typeof value.sound==='boolean')state.sound=value.sound;
 if(['auto','guitar-acoustic','guitar-clean','bass-electric'].includes(value.voice))state.voice=value.voice;
 if(value.profile){try{state.profile=makeProfile(value.profile.instrumentId,value.profile.tuning.map(n=>{if(!Number.isInteger(n)||n<12||n>119)throw new Error();return pitchLabel(n);}).join(' '));}catch{}}
 return state;
}
export function validateState(value){
 if(!value||value.version!==1||value.epoch!==DATA_EPOCH||!['international','latin'].includes(value.notation)||!['light','dark','system','accessible'].includes(value.theme)||typeof value.sound!=='boolean')throw new Error('Cette sauvegarde ne correspond pas à la version de test actuelle.');
 if(value.voice!==undefined&&!['auto','guitar-acoustic','guitar-clean','bass-electric'].includes(value.voice))throw new Error('Son invalide dans la sauvegarde.');
 if(value.accidentals!==undefined&&!['sharp','flat'].includes(value.accidentals))throw new Error('Choix dièses/bémols invalide.');
 const valid=preferences(value);if(value.profile&&!valid.profile)throw new Error('Instrument invalide dans la sauvegarde.');return valid;
}
export function loadState(storage){
 let raw=storage.getItem(STATE_KEY)||storage.getItem('adh-reborn:state:v1'),state;
 try{state=preferences(JSON.parse(raw));}catch{state=initialState();}
 const keys=Array.from({length:storage.length},(_,i)=>storage.key(i));
 for(const key of keys)if(key?.startsWith('adh-reborn:')||/^fretboard-trainer:pilot:0\./.test(key)&&key!==PILOT_KEY)storage.removeItem(key);
 storage.setItem(STATE_KEY,JSON.stringify(state));return state;
}
