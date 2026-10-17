import {miniatureNeck} from './neck-view.js';
import {intervalName} from './pilot.js';
import {noteName,pitchLabel} from './core.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function intervalSensation(semitones){return {1:'Deux sons très proches : ça frotte.',2:'Un petit pas entre deux sons.',3:'Un petit écart, doux ou sombre.',4:'Un petit écart qui sonne clair.',5:'Un saut ouvert, comme un appel.',6:'Deux sons qui frottent fort.',7:'Un son ouvert et solide, comme dans les riffs de rock.',8:'Un grand saut, doux ou sombre.',9:'Un grand saut qui sonne ouvert.',10:'Presque la même note, plus haut.',11:'Juste avant la même note plus haut : ça tire !',12:'Le même nom, mais plus aigu.'}[semitones]||'Écoutez les deux notes.';}
export function introductionFor(module,stage,question,seen=[],activity='',melody=null,notation='international',stringCount=6){
 let key,title,text,kind='neck';
 if(stage==='discovery'){
  if(module.kind==='interval'){key=`interval-${module.degree}-${module.delta}`;title=`Écouter une ${intervalName(module.degree,module.delta).toLowerCase()}`;text=intervalSensation(module.delta);kind='interval';}
  else if(['opens','tuning'].includes(module.kind)){key=module.kind==='tuning'?'explore-tuning':'explore';title='Touchez les cordes';text='Chaque ligne est une corde. Touchez chaque départ, à gauche de la grosse barre.';}
  else if(module.kind==='transfer'){key='transfer';title='Le même dessin';text=`Les cordes ${(module.equivalentStrings||[]).map(s=>stringCount-s).join(' et ')} portent le même nom à vide. À la même case, elles gardent le même nom. Écoutez la différence de hauteur.`;kind='transfer';}
  else{key='discovery-find';title='Trouvez la note';text='Lisez la note. Touchez sa place sur la corde demandée.';}
 }else if(stage==='practice'&&!question?.retry){
  const evaluation=question?.evaluation;key=`${question?.mode}${evaluation?'-evaluation':''}`;
  if(question?.mode==='name'){title='Quelle est cette note ?';text='Regardez le point. Touchez son nom dans la roue.';kind='name';}
  else{title='Trouvez cette note';text='Lisez la note et le numéro de corde. Touchez la bonne case. E2 est plus grave que E3.';kind='find';}
 }else if(stage==='motif'){
  if(melody){key=`melody-${module.baseId||module.id}`;title='Écoutez cet extrait';text=module.kind==='transfer'?`${melody.title} : mêmes cases, deux cordes.`:`Ses repères : ${[...new Set(melody.sequence.map(p=>pitchLabel(p.midi,notation)))].join(' · ')}.`;kind='motif';}
  else if(activity==='natural-diagnostic'){key='families';title='Retrouver une famille de notes';text='Touchez toutes les notes qui portent ce nom.';kind='families';}
  else{key=module.kind==='transfer'?'motif-transfer':'motif';title=module.kind==='transfer'?'Rejouer le motif sur l’autre corde':'Jouer une suite de notes';text=module.kind==='transfer'?'Jouez les notes dans l’ordre, puis sur l’autre corde.':'Touchez les notes dans l’ordre, de gauche à droite.';kind='motif';}
 }
 return key&&!seen.includes(key)?{key,title,text,kind}:null;
}
export function helpGraphic(help,module,profile,notation='international'){
 const example=help.kind==='motif'?module.pool.slice(0,1):module.kind==='interval'?[module.anchor,module.target]:help.kind==='transfer'?module.transferPairs[0]:module.pool.slice(0,1),all=profile.tuning.flatMap((m,string)=>[0,1,2,3,4].map(fret=>({string,fret,midi:m+fret}))),target=example[0],points=help.kind==='families'?all.filter(p=>p.midi%12===target.midi%12):example;
 const neck=miniatureNeck(profile,{id:'help-neck',points:points.map(p=>({...p,color:'#44516b'})),label:'Exemple sur le manche'}).replace('<svg ','<svg x="0" y="0" width="290" height="110" style="width:290px;height:110px" ');

 let extra='';
 if(help.kind==='name'){const names=module.choices||(module.kind==='tuning'?[...new Set(profile.tuning.map(n=>n%12))].sort((a,b)=>a-b):[0,2,4,5,7,9,11]);extra=`<path d="M300 52h26m-7-6 7 6-7 6" stroke="#44516b" fill="none"/>${names.map((n,i)=>{const a=i*2*Math.PI/names.length-Math.PI/2,cx=377+37*Math.cos(a),cy=54+37*Math.sin(a);return `<circle cx="${cx}" cy="${cy}" r="12" fill="#fff" stroke="#657187"/><text x="${cx}" y="${cy+3}" text-anchor="middle" font-size="10" fill="#44516b">${esc(noteName(n,notation))}</text>`;}).join('')}`;}
 else if(help.kind==='motif'){extra=module.pool.slice(0,3).map((p,i)=>`<g><rect x="${300+i*43}" y="30" width="39" height="44" rx="7" fill="#f0f3f6"/><text x="${319+i*43}" y="48" text-anchor="middle" font-size="12" fill="#44516b">${esc(noteName(p.midi,notation))}</text><text x="${319+i*43}" y="65" text-anchor="middle" font-size="9" fill="#44516b">${i+1}</text></g>`).join('');}
 else{extra=`<text x="306" y="43" font-size="12" fill="#44516b">${esc(pitchLabel(target.midi,notation))}${example.length>1?' → '+esc(pitchLabel(example[1].midi,notation)):''}</text><text x="306" y="66" font-size="10" fill="#44516b">${help.kind==='families'?'Toutes les octaves':help.kind==='interval'?'Deux sons successifs':'Toucher le repère'}</text>`;}
 return `<svg class="instruction-graphic" viewBox="0 0 440 110" role="img" aria-label="${esc(help.title)}. Exemple : ${esc(points.map(p=>`${pitchLabel(p.midi,notation)}, corde ${profile.tuning.length-p.string}, ${p.fret?'case '+p.fret:'à vide'}`).join(' ; '))}">${neck}${extra}</svg>`;
}
