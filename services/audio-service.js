import {frequency} from '../core.js';
import {electricString,drivenString,pluckedString,instrumentVoice,voiceCutoff} from '../sound.js';

/** One engine per application. The factory exists for isolated tests, never per question. */
export function createAudioService({getState:initialReader=()=>({sound:true,voice:'auto',profile:null}),createContext=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)(),yieldFrame=()=>new Promise(resolve=>(globalThis.requestAnimationFrame||setTimeout)(resolve))}={}){
 let getState=initialReader,audio=null;
function unlockAudio(){if(!getState().sound)return Promise.resolve();try{
 // Called directly in the trusted gesture, before any await or fetch (Safari).
 try{if(globalThis.navigator?.audioSession)globalThis.navigator.audioSession.type='playback';}catch{}
 if(audio?.state==='closed')audio=null;
 const fresh=!audio;audio||=createContext();
 const resumed=fresh||audio.state!=='running'?audio.resume():Promise.resolve();
 if(fresh&&audio.state!=='running'){const silent=audio.createBufferSource();silent.buffer=audio.createBuffer(1,1,audio.sampleRate);silent.connect(audio.destination);silent.start(0);silent.onended=()=>silent.disconnect();}
 return Promise.resolve(resumed).catch(()=>{});
 }catch{return Promise.resolve();}}
const soundCache=new Map(),activeSounds=new Set();let sequenceEpoch=0;
function stopAudio(){sequenceEpoch++;for(const source of activeSounds){try{source.stop();}catch{}}activeSounds.clear();}
async function playSequence(notes,{step=.42,instrumentId=getState().profile?.instrumentId||'guitar6'}={}){stopAudio();const epoch=sequenceEpoch;await unlockAudio();if(epoch!==sequenceEpoch||!getState().sound||!audio||audio.state!=='running')return;for(let i=0;i<notes.length;i++){const e=typeof notes[i]==='number'?{midi:notes[i]}:notes[i];noteBuffer(e.midi,instrumentVoice(instrumentId,getState().voice),Math.max(.08,step*(e.beats||1)-.025));if(i%4===3)await yieldFrame();if(epoch!==sequenceEpoch||!getState().sound)return;}let when=audio.currentTime+.025;notes.forEach(note=>{const event=typeof note==='number'?{midi:note}:note,span=step*(event.beats||1);createNote(event.midi,when,Math.max(.08,span-.025),instrumentVoice(instrumentId,getState().voice));when+=span+step*(event.restAfter||0);});}
async function playNote(midi,{instrumentId=getState().profile?.instrumentId||'guitar6'}={}){
 if(!getState().sound)return;const epoch=sequenceEpoch;await unlockAudio();if(epoch!==sequenceEpoch||!getState().sound||!audio||audio.state!=='running')return;createNote(midi,audio.currentTime,undefined,instrumentVoice(instrumentId,getState().voice));
}
function noteBuffer(midi,voice,duration=1.8){
 const seconds=Math.max(1.8,Math.ceil(duration*10)/10);
 const hz=frequency(midi),key=`${voice}:${midi}:${audio.sampleRate}`;
 if(!soundCache.has(key)||soundCache.get(key).seconds<seconds){const samples=voice==='guitar-acoustic'?pluckedString(hz,audio.sampleRate,seconds):voice==='guitar-driven'?drivenString(hz,audio.sampleRate,seconds):electricString(hz,audio.sampleRate,seconds,voice),buffer=audio.createBuffer(1,samples.length,audio.sampleRate);buffer.copyToChannel(samples,0);soundCache.set(key,{buffer,seconds});if(soundCache.size>128)soundCache.delete(soundCache.keys().next().value);}
 return soundCache.get(key).buffer;
}
async function playArrangement(arrangement){stopAudio();const epoch=sequenceEpoch;await unlockAudio();if(!getState().sound||!audio||audio.state!=='running'||epoch!==sequenceEpoch)return false;const voice=instrumentVoice(getState().profile.instrumentId,getState().voice),unique=[...new Map(arrangement.events.map(e=>[`${e.voice||voice}:${e.midi}`,e])).values()];for(let i=0;i<unique.length;i++){if(epoch!==sequenceEpoch||!getState().sound)return false;noteBuffer(unique[i].midi,unique[i].voice||voice,Math.max(1.8,...arrangement.events.filter(e=>e.midi===unique[i].midi&&(e.voice||voice)===(unique[i].voice||voice)).map(e=>e.beats*arrangement.step)));if(i%4===3)await yieldFrame();}if(epoch!==sequenceEpoch||!getState().sound)return false;const base=audio.currentTime+.05;for(const e of arrangement.events)createNote(e.midi,base+e.start*arrangement.step,e.beats*arrangement.step,e.voice||voice,e.velocity);return true;}
function createNote(midi,when,duration,voice,velocity=1){
 const hz=frequency(midi);if(hz>audio.sampleRate/4)return;const buffer=noteBuffer(midi,voice,duration),level=.32*velocity;
 const source=audio.createBufferSource(),gain=audio.createGain(),filter=audio.createBiquadFilter();
 source.buffer=buffer;filter.type='lowpass';filter.frequency.value=voiceCutoff(hz,voice);filter.Q.value=.5;gain.gain.value=level;
 source.connect(filter);filter.connect(gain);gain.connect(audio.destination);source.start(when);if(duration){gain.gain.setValueAtTime(level,when);gain.gain.setValueAtTime(level,when+duration-.04);gain.gain.linearRampToValueAtTime(0,when+duration);source.stop(when+duration+.01);}
 activeSounds.add(source);source.onended=()=>{activeSounds.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};
}

 return Object.freeze({configure(options){getState=options.getState;},unlockAudio,stopAudio,playNote,playSequence,playArrangement,
  preferencesChanged(next,previous){if(!next.sound||next.voice!==previous.voice||next.profile?.key!==previous.profile?.key)stopAudio();},
  async dispose(){stopAudio();soundCache.clear();const old=audio;audio=null;await old?.close?.();}
 });
}
export const audioService=createAudioService();
