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
  const neckWidth=52+(strings-6)*7,height=neckWidth+24,nut=32;
  const frets=Array.from({length:lastFret+3},(_,i)=>nut+fretDistance(i,scale));
  const centers=Array.from({length:lastFret+1},(_,f)=>f===0?nut-15:(frets[f-1]+frets[f])/2);
  return {width:frets.at(-1),height,nut,frets,centers,ys:Array.from({length:strings},(_,s)=>12+8+(strings-1-s)*(neckWidth-16)/(strings-1)),fadeStart:frets[lastFret]};
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
const COURSE_PRINCIPLES = {
 first:[
  'Le diagramme est un dessin du manche vu de face. La corde la plus épaisse produit les sons graves, c’est-à-dire les plus bas : elle apparaît en bas du dessin, en paysage comme en portrait.',
  'Vous passez à la corde voisine. L’accordage désigne les hauteurs choisies pour les cordes à vide ; leurs noms vous serviront maintenant de points de départ.',
  'Cette nouvelle ligne se reconnaît à sa place parmi les cordes. Gardez les deux premières positions comme repères avant de parcourir le reste.',
  'Le geste de lecture reste le même, mais le point de départ change. Cherchez d’abord la ligne éclairée plutôt que de suivre la précédente par habitude.',
  'Votre regard peut désormais retrouver une corde au milieu du dessin. Appuyez-vous sur ce repère visuel pour découvrir ses deux premières notes.',
  'Les cordes plus fines se trouvent de l’autre côté du manche. Suivez la ligne indiquée sans laisser les notes voisines détourner votre attention.',
  'Vous approchez du bord aigu du diagramme. Une corde fine donne généralement un son plus haut : sa position visuelle reste votre premier indice.',
  'La dernière ligne complète votre lecture de l’instrument. Prenez le temps de distinguer ce bord de celui où vous avez commencé.'
 ],
 grow:[
  'Une case de plus monte le son d’un demi-ton, le plus petit pas entre deux positions voisines. Le signe ♯ se lit « dièse » : il élève une note d’un demi-ton.',
  'Sur cette deuxième corde, la troisième position rejoint les deux que vous connaissez. Écoutez son son, puis associez-le à sa place.',
  'La nouvelle case prolonge vos repères sur cette ligne. Sa hauteur suit immédiatement celle de la case précédente, même si son nom comporte un signe.',
  'Ajouter une position ne change pas les deux premières. Repérez ce qui vient d’apparaître plutôt que de réapprendre tout le groupe.',
  'Trois positions offrent trois points d’appui visuels. Comparez leurs emplacements avant de laisser le nom demandé guider votre réponse.',
  'La note qui arrive est voisine d’un repère déjà acquis. Servez-vous de cette proximité pendant la découverte, puis essayez de la reconnaître seule.',
  'Le groupe s’agrandit sans changer de ligne. Reliez le nouvel emplacement au son entendu pour éviter de mémoriser seulement l’ordre des boutons.',
  'Ce dernier groupe de trois notes reste local au bord du manche. Vous pouvez les observer ensemble avant de les retrouver séparément.'
 ],
 four:[
  'Les noms naturels suivent C, D, E, F, G, A, B. E–F et B–C sont directement voisins ; les autres paires laissent une note intermédiaire.',
  'La quatrième position se distingue des trois précédentes par son emplacement. Son nom n’est pas forcément la lettre qui suit dans l’alphabet.',
  'Les cases avancent toujours d’un demi-ton, tandis que les lettres ne changent pas à chaque pas. Regardez le nom de cette nouvelle position sans sauter les altérations.',
  'Une altération est le signe qui modifie une note, comme ♯. Sur ce groupe, reconnaître la position entière est plus utile que réciter les lettres.',
  'Vous pouvez vous donner une image de chaque emplacement. La quatrième case étudiée ajoute une image au petit groupe déjà connu.',
  'Les notes proches peuvent se confondre quand on répond trop tôt. Identifiez la case éclairée avant de sélectionner son nom complet.',
  'Le dessin vous donne une coordonnée : une corde et une case. Réunissez ces deux indices pour différencier les notes de ce groupe.',
  'À ce stade, une position supplémentaire suffit. Gardez votre attention sur cette seule ligne pour rendre chaque reconnaissance plus sûre.'
 ],
 whole:[
  'La zone va de la corde à vide à la case 4. Les frettes sont les barres qui séparent les cases ; après la limite étudiée, le fondu rappelle que le manche continue.',
  'Les cinq emplacements de cette corde sont maintenant disponibles. Le jeu les présentera dans un ordre mélangé, sans ajouter de nouvelle ligne.',
  'Votre petit territoire est complet sur cette corde. Utilisez les repères déjà solides pour reconnaître aussi celui qui vient de s’ajouter.',
  'L’extrémité de la zone rejoint les autres positions étudiées. Une fois le groupe connu, essayez de nommer la note sans compter depuis le début.',
  'Vous avez cinq choix d’emplacement sur cette ligne. Les reconnaître isolément prépare le mélange avec les autres cordes.',
  'La case 4 ferme cette étape du parcours. Le prolongement est dessiné mais ne contient aucune réponse supplémentaire à chercher.',
  'Toute la zone est réunie sur cette nouvelle corde. Observez les différences de place avant de chercher à accélérer.',
  'Ces cinq positions terminent la découverte de cette ligne. Leurs noms peuvent devenir des repères immédiats, indépendants de la séquence de jeu.'
 ],
 find:[
  'Cette fois, le nom est donné et la position est à trouver. Touchez directement un repère sur la grosse corde éclairée ; une seule réponse suffit.',
  'Le nom demandé doit maintenant vous ramener vers cette corde. Les points orangés sont des réponses tactiles, pas seulement des décorations.',
  'Vous retrouvez une position à partir de son nom. Commencez par la ligne mise en valeur, puis choisissez un de ses emplacements.',
  'Lire le nom et toucher le manche fait travailler le trajet inverse. Les cases voisines sont des choix distincts : visez celle que vous reconnaissez.',
  'La question reste juste sous le diagramme pour accompagner votre recherche. Vous pouvez répondre sur le manche ou ouvrir les boutons de cases.',
  'Chercher une note sur cette ligne consolide les positions apprises. Un toucher bref propose votre réponse ; un glissement déplace seulement la vue.',
  'Les repères tactiles limitent la recherche à cette corde. Il n’est pas demandé de retrouver toutes les occurrences de la note sur l’instrument.',
  'Vous achevez cette ligne avec une recherche volontaire. Le nom donné devient un point d’arrivée concret sur le dessin.'
 ]
};
const MIX_PRINCIPLES=[
 'Deux cordes apparaissent ensemble pour la première fois. Vérifiez laquelle est indiquée avant de reconnaître ou de retrouver la note.',
 'Une troisième ligne rejoint le groupe familier. La question précise toujours la corde concernée : vous n’avez pas à deviner laquelle choisir.',
 'Quatre cordes partagent désormais votre zone. Une même case peut donner plusieurs notes selon la ligne : gardez ces deux coordonnées ensemble.',
 'Le groupe réunit cinq cordes connues. Le mélange sert à déplacer votre attention, sans ajouter de position nouvelle.',
 'Six cordes se rencontrent dans cet exercice. Le nom de note et la place sur le manche deviennent deux façons de retrouver le même repère.',
 'Le mélange gagne une septième ligne. Revenez à la corde éclairée chaque fois que votre regard hésite entre deux emplacements.',
 'Les huit cordes sont maintenant réunies. Votre recherche reste limitée à une seule position sur la corde demandée.'
];
export function microCourse(profile,lesson,notation='international'){
 const fret=lesson.frets.at(-1),open=profile.tuning[lesson.string],name=n=>noteName(n,notation),number=profile.tuning.length-lesson.string;
 if(lesson.mode==='mixed')return {title:`Relier ${lesson.strings.length} cordes`,principle:MIX_PRINCIPLES[lesson.strings.length-2],example:`Dans ce groupe de ${lesson.strings.length} lignes, vous retrouverez notamment ${name(profile.tuning[0])} à vide sur la corde ${profile.tuning.length} et ${name(open)} sur la corde ${number}.`,goal:`Passez d’une ligne à l’autre dans ce groupe de ${lesson.strings.length} cordes, une question à la fois.`,diagram:true};
 const stage=lesson.id.split('-')[1],kind=stage==='first'?'first':stage==='grow'?'grow':stage==='four'?'four':stage==='whole'?'whole':'find';
 let example,goal,title;
 if(stage==='first'&&lesson.string===0){title='Du manche au dessin';example='À vide signifie sans appuyer : c’est la case 0. La case 1 est le premier espace après la barre claire appelée sillet.';goal='Commencez sur la seule grosse corde mise en valeur dans les deux dessins.';}
 else if(stage==='first'&&lesson.string===1){title='Une deuxième corde';example=`Votre accordage, du grave vers l’aigu : ${profile.tuning.map(n=>name(n)).join(' · ')}. La corde ${number} commence sur ${name(open)} ; sa case 1 donne ${name(open+1)}.`;goal=`Sur cette deuxième ligne apprise, différenciez ${name(open)} à vide et ${name(open+1)} en case 1.`;}
 else if(stage==='first'){title=`Un nouveau départ : corde ${number}`;example=`Repère de la corde ${number} : ${name(open)} sans appuyer, puis ${name(open+1)} dans la première case.`;goal=`Construisez les deux premiers automatismes de la corde ${number} avant de l’étendre.`;}
 else if(kind==='find'){title=`Retrouver une position · corde ${number}`;example=`Pour chercher ${name(open+fret)} sur la corde ${number}, choisissez sa case ${fret}.`;goal=`Faites correspondre chaque nom demandé à un emplacement sur la corde ${number}.`;}
 else {title=`${name(open+fret)} rejoint vos repères`;example=`Corde ${number} : la case ${fret-1} donne ${name(open+fret-1)}, puis la case ${fret} donne ${name(open+fret)}.`;goal=`Reconnaissez la case ${fret} et les positions précédentes de la corde ${number}, dans un ordre imprévisible.`;}
 const principle=kind==='four'&&lesson.string===0&&notation==='latin'?COURSE_PRINCIPLES.four[0].replace('C, D, E, F, G, A, B','Do, Ré, Mi, Fa, Sol, La, Si').replace('E–F et B–C','Mi–Fa et Si–Do'):COURSE_PRINCIPLES[kind][lesson.string];
 return {title,principle,example,goal,diagram:true};
}
export function nextMilestone(answers){
 const result=score(answers),total=answers.length;
 if(result.stars<3)return {stars:3,required:Math.ceil(total*.9),total,label:`Au moins ${Math.ceil(total*.9)} bonnes réponses sur ${total} pour continuer.`};
 if(result.stars===3)return {stars:4,required:Math.ceil(total*.95),total,label:`Visez ${Math.ceil(total*.95)}/${total} bonnes réponses, avec un temps médian de 2,5 s ou moins.`};
 if(result.stars===4)return {stars:5,required:total,total,label:'Visez 100 % de bonnes réponses, avec un temps médian de 1 s ou moins.'};
 return {stars:5,required:total,total,label:'100 % de bonnes réponses, avec un temps médian de 1 s ou moins : objectif atteint !',complete:true};
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
  if(accuracy===1&&medianMs<=FIVE_STAR_MEDIAN_MS) stars=5;
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
