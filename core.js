/** Musical and learning rules. No browser dependencies; scientific pitch notation. */
export const VERSION = 1;
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
  const neckWidth=52+(strings-6)*7,height=neckWidth+24,nut=32;
  const frets=Array.from({length:lastFret+3},(_,i)=>nut+fretDistance(i,scale));
  const centers=Array.from({length:lastFret+1},(_,f)=>f===0?nut-15:(frets[f-1]+frets[f])/2);
  return {width:frets.at(-1)+10,height,nut,frets,centers,ys:Array.from({length:strings},(_,s)=>12+8+(strings-1-s)*(neckWidth-16)/(strings-1)),fadeStart:frets[lastFret]+2};
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
export function lessons(profile) {
  const list=[];
  // Physical order: thickest displayed string first. Each new string is followed by cumulative revision.
  for(let string=0;string<profile.tuning.length;string++) {
    const number=profile.tuning.length-string;
    const chapter=`Corde ${number}`;
    for(const [slug,count,mode,title] of [
      ['first',2,'name','Premiers repères'],
      ['grow',3,'name','Une note de plus'],
      ['four',4,'name','Un nouveau repère'],
      ['whole',5,'name','Toute la zone'],
      ['find',5,'find','À vous de trouver']
    ]) list.push({id:`s${string}-${slug}`,chapter,string,strings:[string],frets:Array.from({length:count},(_,i)=>i),mode,title,count:count===2?12:20});
    if(string>0) list.push({id:`mix-${string}`,chapter:'Relier les cordes',string,strings:Array.from({length:string+1},(_,i)=>i),frets:[0,1,2,3,4],mode:'mixed',title:string===profile.tuning.length-1?'Toute votre zone':`${string+1} cordes ensemble`,count:24});
  }
  return list;
}
export function microCourse(profile,lesson,notation='international'){
  const fret=lesson.frets.at(-1),open=profile.tuning[lesson.string],name=n=>noteName(n,notation),number=profile.tuning.length-lesson.string;
  if(lesson.mode==='mixed')return {title:'Changer de corde, garder ses repères',principle:'Une même case ne donne pas forcément la même note sur deux cordes. Repérez d’abord la corde indiquée, puis sa case.',example:`${name(profile.tuning[lesson.strings[0]])} et ${name(profile.tuning[lesson.strings.at(-1)])} sont les notes à vide des deux cordes aux extrémités de ce groupe.`,goal:'Alternez reconnaissance et recherche sur les cordes déjà étudiées.'};
  if(lesson.mode==='find')return {title:'Du nom à la position',principle:'Faites le chemin inverse : lisez le nom demandé, repérez la corde, puis retrouvez sa position dans cette zone.',example:`Sur la corde ${number}, ${name(open+fret)} se trouve en case ${fret}. Les boutons de cases sont une alternative au toucher du manche.`,goal:'Une seule position sur la corde demandée suffit. La vitesse viendra ensuite.'};
  if(fret===1)return {title:'À vide, puis une case',principle:'La case 0 est la corde à vide : aucun doigt n’appuie sur le manche. Avancer d’une case fait monter la note d’un demi-ton.',example:`Corde ${number} : à vide = ${name(open)} ; case 1 = ${name(open+1)}. Écoutez les deux sons pour associer chaque position à sa note.`,goal:'Reconnaissez ces deux positions. Vous pouvez réfléchir sans perdre votre chance de valider.'};
  return {title:'Un nouveau demi-ton',principle:`Chaque nouvelle case ajoute un demi-ton. ${name(4)}–${name(5)} et ${name(11)}–${name(0)} se suivent directement ; entre les autres notes naturelles, il existe une note intermédiaire.`,example:`Sur cette corde, la case ${fret-1} donne ${name(open+fret-1)} et la case ${fret} donne ${name(open+fret)}. Le signe ♯ signifie « un demi-ton plus haut ».`,goal:`Ajoutez la case ${fret} aux repères déjà connus, puis reconnaissez-les dans un ordre mélangé.`};
}
export function isUnlocked(list,index,records) { return index===0 || (records[list[index-1].id]?.stars||0)>=3; }
export function nextLesson(list,records) { return list.findIndex((l,i)=>isUnlocked(list,i,records)&&(records[l.id]?.stars||0)<3); }
export function score(answers) {
  if(!answers.length) return {stars:0,accuracy:0,medianMs:null,correct:0};
  const correctAnswers=answers.filter(a=>a.correct);
  const accuracy=correctAnswers.length/answers.length;
  const times=correctAnswers.map(a=>a.ms).sort((a,b)=>a-b);
  const medianMs=times.length ? (times[Math.floor((times.length-1)/2)]+times[Math.floor(times.length/2)])/2 : null;
  let stars=accuracy>=.9?3:accuracy>=.75?2:accuracy>=.5?1:0;
  if(stars===3&&accuracy>=.95&&medianMs<=2500) stars=4;
  if(accuracy===1&&medianMs<=1500) stars=5;
  return {stars,accuracy,medianMs,correct:correctAnswers.length};
}
export function question(profile,lesson,history=[],random=Math.random) {
  let pool=positions(profile,lesson.strings,lesson.frets);
  const last=history.at(-1)?.target,previous=history.at(-2)?.target;
  if(pool.length>1&&last&&previous&&last.string===previous.string&&last.fret===previous.fret) pool=pool.filter(p=>p.string!==last.string||p.fret!==last.fret);
  // Deliberately balanced coverage. Mistakes have extra weight, but never exclude the rest of the zone.
  const counts=new Map();
  history.forEach(h=>counts.set(`${h.target.string}:${h.target.fret}`,(counts.get(`${h.target.string}:${h.target.fret}`)||0)+1));
  const unseen=pool.filter(p=>!counts.has(`${p.string}:${p.fret}`));
  if(unseen.length)pool=unseen;
  const weights=pool.map(p=>{
    const key=`${p.string}:${p.fret}`;
    const missed=history.some(h=>h.target.string===p.string&&h.target.fret===p.fret&&!h.correct);
    return (missed?1.5:1)/(1+(counts.get(key)||0));
  });
  let pick=random()*weights.reduce((a,b)=>a+b,0),index=0;
  while(index<weights.length-1&&pick>=weights[index])pick-=weights[index++];
  const target=pool[index];
  const mode=lesson.mode==='mixed'?(history.length%2===0?'name':'find'):lesson.mode;
  return {target,mode};
}
export function checkAnswer(q,value) {
  return q.mode==='name' ? Number(value)===q.target.midi%12 : value.string===q.target.string&&value.fret===q.target.fret;
}
export function initialState() { return {version:VERSION,profile:null,notation:'international',sound:true,theme:'light',progress:{},stats:[],session:null}; }
export function validateState(value) {
  if(!value||value.version!==VERSION||!['international','latin'].includes(value.notation)||typeof value.sound!=='boolean'||!['light','dark'].includes(value.theme))throw new Error('Sauvegarde incompatible ou invalide.');
  if(value.profile){
    const instrument=INSTRUMENTS.find(i=>i.id===value.profile.instrumentId);
    if(!instrument||!Array.isArray(value.profile.tuning)||value.profile.tuning.length!==instrument.strings||value.profile.tuning.some(n=>!Number.isInteger(n)||n<12||n>119))throw new Error('Instrument invalide dans la sauvegarde.');
    const rebuilt=makeProfile(instrument.id,value.profile.tuning.map(n=>pitchLabel(n)).join(' '));
    value={...value,profile:rebuilt};
  }
  if(!value.progress||typeof value.progress!=='object'||Array.isArray(value.progress)||!Array.isArray(value.stats)||value.stats.length>5000)throw new Error('Progression invalide.');
  for(const records of Object.values(value.progress)){
    if(!records||typeof records!=='object'||Array.isArray(records))throw new Error('Progression invalide.');
    for(const record of Object.values(records))if(!record||!Number.isInteger(record.stars)||record.stars<0||record.stars>5)throw new Error('Résultat invalide.');
  }
  for(const attempt of value.stats){
    if(!attempt||typeof attempt.key!=='string'||typeof attempt.lesson!=='string'||!Number.isFinite(attempt.at)||!validAnswers(attempt.answers))throw new Error('Historique invalide.');
  }
  // Sessions aren't imported: monotonic clocks cannot be restored across browsers.
  return {...initialState(),...value,stats:value.stats.slice(-5000),session:null};
}
export function validAnswers(answers) {
  return Array.isArray(answers)&&answers.length<=100&&answers.every(a=>a&&typeof a.correct==='boolean'&&Number.isFinite(a.ms)&&a.ms>=0&&a.ms<=86_400_000&&['name','find'].includes(a.mode)&&a.target&&Number.isInteger(a.target.string)&&a.target.string>=0&&a.target.string<8&&Number.isInteger(a.target.fret)&&a.target.fret>=0&&a.target.fret<=4&&Number.isInteger(a.target.midi)&&a.target.midi>=12&&a.target.midi<=123);
}
