/** Tuning library and semitone edits. Physical order is low edge → high edge. */
import {INSTRUMENTS,makeProfile,pitchLabel} from './core.js';
export const MIN_TUNING_MIDI=12,MAX_TUNING_MIDI=119;
const entry=(id,label,notes)=>({id,label,notes});
const LIBRARY={
 guitar6:[
  entry('standard','Standard — Mi','E2 A2 D3 G3 B3 E4'),
  entry('drop-d','Drop D','D2 A2 D3 G3 B3 E4'),
  entry('eb','Mi♭ standard (−½ ton)','Eb2 Ab2 Db3 Gb3 Bb3 Eb4'),
  entry('d','Ré standard (−1 ton)','D2 G2 C3 F3 A3 D4'),
  entry('drop-c','Drop C','C2 G2 C3 F3 A3 D4'),
  entry('dadgad','DADGAD','D2 A2 D3 G3 A3 D4'),
  entry('open-g','Open G','D2 G2 D3 G3 B3 D4'),
  entry('open-d','Open D','D2 A2 D3 F#3 A3 D4')
 ],
 guitar7:[
  entry('standard','Standard — Si','B1 E2 A2 D3 G3 B3 E4'),
  entry('drop-a','Drop A','A1 E2 A2 D3 G3 B3 E4'),
  entry('a','La standard (−1 ton)','A1 D2 G2 C3 F3 A3 D4'),
  entry('drop-g','Drop G','G1 D2 G2 C3 F3 A3 D4'),
  entry('drop-b','Drop B','B1 F#2 B2 E3 A3 C#4 F#4')
 ],
 guitar8:[
  entry('standard','Standard — Fa♯','F#1 B1 E2 A2 D3 G3 B3 E4'),
  entry('drop-e','Drop E','E1 B1 E2 A2 D3 G3 B3 E4'),
  entry('f','Fa standard (−½ ton)','F1 Bb1 Eb2 Ab2 Db3 Gb3 Bb3 Eb4'),
  entry('e','Mi standard (−1 ton)','E1 A1 D2 G2 C3 F3 A3 D4'),
  entry('drop-d','Drop D','D1 A1 D2 G2 C3 F3 A3 D4')
 ],
 bass4:[
  entry('standard','Standard — Mi','E1 A1 D2 G2'),
  entry('drop-d','Drop D','D1 A1 D2 G2'),
  entry('eb','Mi♭ standard (−½ ton)','Eb1 Ab1 Db2 Gb2'),
  entry('d','Ré standard (−1 ton)','D1 G1 C2 F2'),
  entry('bead','BEAD — Si grave','B0 E1 A1 D2')
 ],
 bass5:[
  entry('standard','Standard — Si','B0 E1 A1 D2 G2'),
  entry('drop-a','Drop A','A0 E1 A1 D2 G2'),
  entry('bb','Si♭ standard (−½ ton)','Bb0 Eb1 Ab1 Db2 Gb2'),
  entry('a','La standard (−1 ton)','A0 D1 G1 C2 F2'),
  entry('tenor','Ténor — Mi à Do','E1 A1 D2 G2 C3')
 ],
 bass6:[
  entry('standard','Standard — Si à Do','B0 E1 A1 D2 G2 C3'),
  entry('drop-a','Drop A','A0 E1 A1 D2 G2 C3'),
  entry('bb','Si♭ standard (−½ ton)','Bb0 Eb1 Ab1 Db2 Gb2 B2'),
  entry('a','La standard (−1 ton)','A0 D1 G1 C2 F2 Bb2')
 ]
};
export function tuningPresets(instrumentId){
 if(!INSTRUMENTS.some(i=>i.id===instrumentId))throw new Error('Instrument inconnu.');
 return LIBRARY[instrumentId].map(p=>({...p,flats:p.notes.includes('b'),tuning:makeProfile(instrumentId,p.notes).tuning}));
}
export function tuningPitchLabel(midi,notation='international',flats=false){
 if(!flats)return pitchLabel(midi,notation);
 const names=notation==='latin'?['Do','Ré♭','Ré','Mi♭','Mi','Fa','Sol♭','Sol','La♭','La','Si♭','Si']:['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
 return `${names[((midi%12)+12)%12]}${Math.floor(midi/12)-1}`;
}
export function tuningText(tuning){return tuning.map(n=>pitchLabel(n)).join(' ');}
export function adjustTuning(tuning,semitones,string=null){
 if(!Array.isArray(tuning)||!tuning.length||tuning.some(n=>!Number.isInteger(n)||n<MIN_TUNING_MIDI||n>MAX_TUNING_MIDI)||![-1,1].includes(semitones)||string!==null&&(!Number.isInteger(string)||string<0||string>=tuning.length))throw new Error('Réglage d’accordage invalide.');
 const next=tuning.map((n,i)=>n+(string===null||i===string?semitones:0));
 return next.some(n=>n<MIN_TUNING_MIDI||n>MAX_TUNING_MIDI)?null:next;
}
export function tuningPages(strings,capacity){
 if(!Number.isInteger(strings)||strings<1||!Number.isInteger(capacity)||capacity<1)throw new Error('Pagination invalide.');
 const order=Array.from({length:strings},(_,i)=>strings-1-i);
 return Array.from({length:Math.ceil(strings/capacity)},(_,page)=>order.slice(page*capacity,(page+1)*capacity));
}
