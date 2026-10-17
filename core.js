/** Musical and learning rules. No browser dependencies; scientific pitch notation. */
export const VERSION = 1;
export const FIVE_STAR_MEAN_MS = 1000;
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
export const NECK_STYLE={openWidth:18,margin:8,fadeFraction:.5,inlayRadius:2.8,nutWidth:2.8,fretWidth:1.1};
export function neckGeometry(strings,lastFret=4,scale=648,{gameplay=false}={}){
  const neckWidth=(52+(strings-6)*7)*(gameplay?1.65:1),height=neckWidth+14,nut=NECK_STYLE.margin+NECK_STYLE.openWidth;
  const frets=Array.from({length:lastFret+2},(_,i)=>nut+fretDistance(i,scale));
  const bounds=f=>f===0?[nut-NECK_STYLE.openWidth,nut]:[frets[f-1],frets[f]];
  const centers=Array.from({length:lastFret+1},(_,f)=>{const [a,b]=bounds(f);return a+(b-a)*2/3;}),labelXs=Array.from({length:lastFret+1},(_,f)=>{const [a,b]=bounds(f);return a+(b-a)/3;});
  const ys=Array.from({length:strings},(_,s)=>5+(strings-1-s)*(neckWidth-3)/(strings-1)),inlays=[];for(let f=1;f<frets.length;f++){const pc=f%12;if(![0,3,5,7,9].includes(pc))continue;const x=(frets[f-1]+frets[f])/2;for(const t of pc===0?[.25,.75]:[.5])inlays.push({fret:f,x,y:Math.min(...ys)+(Math.max(...ys)-Math.min(...ys))*t});}
  const width=frets[lastFret]+(frets[lastFret+1]-frets[lastFret])*NECK_STYLE.fadeFraction;return {width,height,nut,openStart:nut-NECK_STYLE.openWidth,openWidth:NECK_STYLE.openWidth,frets,centers,labelXs,ys,inlays:inlays.filter(p=>p.x<width),fadeStart:frets[lastFret]};
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
  if(!answers.length) return {stars:0,accuracy:0,meanMs:null,correct:0};
  const correctAnswers=answers.filter(a=>a.correct);
  const accuracy=correctAnswers.length/answers.length;
  const times=correctAnswers.filter(a=>!a.aids?.length&&a.timingInterpretable!==false&&Number.isFinite(a.ms)).map(a=>a.ms);
  const meanMs=times.length ? times.reduce((a,b)=>a+b,0)/times.length : null;
  let stars=accuracy>=.9?3:accuracy>=.75?2:accuracy>=.5?1:0;
  if(stars===3&&accuracy>=.95&&meanMs!==null&&meanMs<=2500) stars=4;
  if(accuracy===1&&times.length===answers.length&&meanMs!==null&&meanMs<=FIVE_STAR_MEAN_MS) stars=5;
  return {stars,accuracy,meanMs,correct:correctAnswers.length};
}

export function fitNeck(g,width,height){const scale=Math.max(.01,Math.min((width-2)/g.width,(height-2)/g.height));return {scale,width:g.width*scale,height:g.height*scale};}
