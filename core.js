/** Musical and learning rules. No browser dependencies; scientific pitch notation. */
export const VERSION = 1;
export const FIVE_STAR_MEDIAN_MS = 1000;
export const PITCHES = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const LATIN = ['Do','Do♯','Ré','Ré♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];
export const INSTRUMENTS = [
  { id:'guitar6', name:'Guitare', strings:6, tuning:'E2 A2 D3 G3 B3 E4' },
  { id:'guitar7', name:'Guitare', strings:7, tuning:'B1 E2 A2 D3 G3 B3 E4' },
  { id:'guitar8', name:'Guitare', strings:8, tuning:'F♯1 B1 E2 A2 D3 G3 B3 E4' },
  { id:'bass4', name:'Basse', strings:4, tuning:'E1 A1 D2 G2' },
  { id:'bass5', name:'Basse', strings:5, tuning:'B0 E1 A1 D2 G2' },
  { id:'bass6', name:'Basse', strings:6, tuning:'B0 E1 A1 D2 G2 C3' }
];
export function noteName(midi, notation='international') {
  return (notation === 'latin' ? LATIN : PITCHES)[((midi % 12)+12)%12];
}
export function pitchLabel(midi, notation='international') {
  return `${noteName(midi, notation)}${Math.floor(midi/12)-1}`;
}
export function frequency(midi) { return 440 * 2 ** ((midi - 69)/12); }
export function fretDistance(fret,scale=648){return scale*(1-2**(-fret/12));}
export function neckGeometry(strings,lastFret=4,scale=648){
  const neckWidth=52+(strings-6)*7,height=neckWidth+14,nut=32;
  const frets=Array.from({length:lastFret+3},(_,i)=>nut+fretDistance(i,scale));
  const centers=Array.from({length:lastFret+1},(_,f)=>f===0?nut-15:(frets[f-1]+frets[f])/2);
  return {width:frets.at(-1),height,nut,frets,centers,ys:Array.from({length:strings},(_,s)=>5+(strings-1-s)*(neckWidth-3)/(strings-1)),fadeStart:frets[lastFret]};
}
export function parseTuning(raw, count) {
  const bases={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
  const tokens=raw.trim().split(/\s+/);
  if(tokens.length!==count) throw new Error(`Indiquez ${count} notes, du grave vers l’aigu, avec leurs octaves (ex. E2).`);
  return tokens.map(token=>{
    const match=/^([A-Ga-g])([#♯b♭]?)([0-8])$/.exec(token);
    if(!match) throw new Error(`« ${token} » n’est pas une note valide. Exemple : F♯2 ou Bb1.`);
    const delta=match[2]==='#'||match[2]==='♯'?1:match[2]? -1:0;
    const midi=(Number(match[3])+1)*12+bases[match[1].toUpperCase()]+delta;
    if(midi<12||midi>119) throw new Error('Cet accordage sort de la plage disponible.');
    return midi;
  });
}
export function makeProfile(instrumentId, raw) {
  const instrument=INSTRUMENTS.find(i=>i.id===instrumentId);
  if(!instrument) throw new Error('Instrument inconnu.');
  const tuning=parseTuning(raw||instrument.tuning,instrument.strings);
  return { instrumentId, tuning, label:`${instrument.name} ${instrument.strings} cordes`, key:`${instrumentId}:${tuning.join(',')}` };
}
export function positions(profile, strings, frets=[0,1,2,3,4]) {
  return strings.flatMap(string=>frets.map(fret=>({ string, fret, midi:profile.tuning[string]+fret })));
}
export function score(answers) {
  if(!answers.length) return {stars:0,accuracy:0,medianMs:null,correct:0};
  const correctAnswers=answers.filter(a=>a.correct);
  const accuracy=correctAnswers.length/answers.length;
  const times=correctAnswers.map(a=>a.ms).sort((a,b)=>a-b);
  const medianMs=times.length ? (times[Math.floor((times.length-1)/2)]+times[Math.floor(times.length/2)])/2 : null;
  let stars=accuracy>=.9?3:accuracy>=.75?2:accuracy>=.5?1:0;
  if(stars===3&&accuracy>=.95&&medianMs<=2500) stars=4;
  if(accuracy===1&&medianMs<=FIVE_STAR_MEDIAN_MS) stars=5;
  return {stars,accuracy,medianMs,correct:correctAnswers.length};
}

export function fitNeck(g,width,height){const scale=Math.max(.01,Math.min((width-2)/g.width,(height-2)/g.height));return {scale,width:g.width*scale,height:g.height*scale};}
