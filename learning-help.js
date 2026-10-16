import {noteName,pitchLabel,neckGeometry} from './core.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function intervalSensation(semitones){return {
 1:'Les deux sons sont très proches. Ce petit écart peut donner une impression de frottement et de tension : écoutez comme la seconde note reste voisine de la première.',
 2:'Vous entendez un petit pas mélodique. Les sons restent proches, mais l’écart respire davantage qu’un demi-ton.',
 3:'Cet écart resserré apporte la couleur d’une tierce mineure. Il peut évoquer une nuance sombre ou douce, selon la phrase qui l’entoure.',
 4:'La tierce majeure peut donner une impression claire et ouverte. Comparez le départ et l’arrivée : cette couleur tient à leur relation, pas au nom de la note seule.',
 5:'La quarte sonne comme un appel assez ouvert. Elle peut donner envie de poursuivre la phrase : repérez le mouvement entre l’appui et la nouvelle note.',
 6:'Cet écart de six demi-tons forme un triton. Il peut paraître tendu et instable : écoutez le frottement entre les deux appuis, qui donne envie de poursuivre la phrase.',
 7:'La quinte juste sonne ouverte et solide. C’est l’écart caractéristique des power chords (accords de rock construits sur ces deux notes) : ici, les deux notes sont jouées successivement pour entendre le lien.',
 8:'La sixte mineure est un saut large, avec une couleur souvent perçue comme douce ou sombre. Écoutez l’espace parcouru sans confondre largeur et volume sonore.',
 9:'La sixte majeure ouvre largement la mélodie. Elle peut paraître ample et chantante ; cherchez à reconnaître cette ouverture entre les deux hauteurs.',
 10:'La septième mineure est proche de l’octave sans l’atteindre. Elle peut donner une impression d’élan encore inachevé, qui appelle une suite.',
 11:'La septième majeure se tient juste sous l’octave. Ce voisinage crée souvent une tension dirigée vers la note située un demi-ton plus haut.',
 12:'À l’octave, vous retrouvez une même identité de note dans un registre plus aigu. Écoutez le retour du même nom malgré le saut de hauteur.'
}[semitones]||'Écoutez le point de départ puis l’arrivée, et comparez leurs hauteurs.';}
export function introductionFor(module,stage,question,seen=[],activity=''){
 let key,title,text,kind='neck';
 if(stage==='discovery'){
  if(module.kind==='interval'){key=`interval-${module.degree}-${module.delta}`;title=`Écouter une ${module.title.split(' · ')[0].toLowerCase()}`;text=intervalSensation(module.delta);kind='interval';}
  else if(['opens','tuning'].includes(module.kind)){key=module.kind==='tuning'?'explore-tuning':'explore';title='Explorer les cordes à vide';text='Chaque ligne représente une corde. Touchez son départ, dans la case 0 avant le sillet, pour entendre et nommer la corde sans appuyer sur une case. Explorez chaque départ ; la démonstration montre un exemple et ne le valide pas à votre place.';}
  else if(module.kind==='transfer'){key='transfer';title='Un dessin qui se retrouve sur plusieurs cordes';text=module.description;kind='transfer';}
  else{key='discovery-find';title='Découvrir un nouveau repère';text='Lisez la hauteur et la corde demandées, puis essayez un emplacement. Après votre essai, le diagramme montre les repères et vous pouvez écouter leur relation.';}
 }else if(stage==='practice'&&!question?.retry){
  const evaluation=question?.evaluation;key=`${question?.mode}${evaluation?'-evaluation':''}`;
  if(question?.mode==='name'){title='Nommer la note montrée';text=`Repérez le point sur le manche, puis touchez le nom correspondant dans la roue. Le chiffre après le nom indique le registre, c’est-à-dire la hauteur grave ou aiguë ; la roue demande seulement le nom.${evaluation?' Ce bilan ne joue pas le son cible et ne donne pas d’indice avant votre réponse.':' Vous pouvez toucher le point pour réécouter.'}`;kind='name';}
  else{title='Retrouver une hauteur sur le manche';text='Lisez le nom avec son octave et la restriction de corde, lorsqu’elle est indiquée. Touchez un seul emplacement qui respecte toute la consigne. Un même nom dans une autre octave ne convient pas. Les boutons de réponse offrent une autre façon de choisir corde et case.';kind='find';}
 }else if(stage==='motif'){
  if(activity==='natural-diagnostic'){key='families';title='Retrouver une famille de notes';text='Cette fois, cherchez toutes les notes du même nom dans la position, dans toutes les octaves. Les emplacements déjà trouvés restent marqués. Passez à la famille suivante quand ils sont tous trouvés.';kind='families';}
  else{key=module.kind==='transfer'?'motif-transfer':'motif';title=module.kind==='transfer'?'Rejouer le motif sur l’autre corde':'Jouer une suite de notes';text=module.kind==='transfer'?'Jouez les noms dans l’ordre sur la corde indiquée, puis reprenez le même dessin sur la corde correspondante. Respectez les numéros de corde pour comparer les registres.':'Suivez les notes de gauche à droite. La carte active indique le prochain nom et une corde de référence ; jouez la hauteur attendue. Vous pouvez écouter le modèle avant de commencer.';kind='motif';}
 }
 return key&&!seen.includes(key)?{key,title,text,kind}:null;
}
export function helpGraphic(help,module,profile,notation='international'){
 const example=module.kind==='interval'?[module.anchor,module.target]:help.kind==='transfer'?module.transferPairs[0]:module.pool.slice(0,1),all=profile.tuning.flatMap((m,string)=>[0,1,2,3,4].map(fret=>({string,fret,midi:m+fret}))),target=example[0],points=help.kind==='families'?all.filter(p=>p.midi%12===target.midi%12):example,g=neckGeometry(profile.tuning.length,4),bottom=96;
 const x=p=>24+g.centers[p.fret]/g.width*260,y=p=>18+g.ys[p.string]/g.height*75;
 const neck=`<g>${profile.tuning.map((_,s)=>`<path d="M30 ${18+g.ys[s]/g.height*75}H290" stroke="#657187" stroke-width="${s===0?2:1}"/>`).join('')}${g.frets.slice(0,5).map((f,i)=>`<path d="M${24+f/g.width*260} 18V85" stroke="#939aa4" stroke-width="${i?1:3}"/>`).join('')}${points.map(p=>`<circle cx="${x(p)}" cy="${y(p)}" r="5" fill="#267342"/><text x="${x(p)}" y="${Math.max(12,y(p)-9)}" text-anchor="middle" font-size="10" fill="#44516b">${esc(pitchLabel(p.midi,notation))}</text>`).join('')}<text x="30" y="${bottom}" font-size="10" fill="#44516b">0</text><text x="124" y="${bottom}" font-size="10" fill="#44516b">Manche · exemple</text></g>`;
 let extra='';
 if(help.kind==='name'){const names=module.kind==='tuning'?[...new Set(profile.tuning.map(n=>n%12))].sort((a,b)=>a-b):[0,2,4,5,7,9,11];extra=`<path d="M300 52h26m-7-6 7 6-7 6" stroke="#44516b" fill="none"/>${names.map((n,i)=>{const a=i*2*Math.PI/names.length-Math.PI/2,cx=377+37*Math.cos(a),cy=54+37*Math.sin(a);return `<circle cx="${cx}" cy="${cy}" r="12" fill="${n===target.midi%12?'#d7efdd':'#fff'}" stroke="#657187"/><text x="${cx}" y="${cy+3}" text-anchor="middle" font-size="10" fill="#44516b">${esc(noteName(n,notation))}</text>`;}).join('')}`;}
 else if(help.kind==='motif'){extra=module.pool.slice(0,3).map((p,i)=>`<g><rect x="${300+i*43}" y="30" width="39" height="44" rx="7" fill="#f0f3f6"/><text x="${319+i*43}" y="48" text-anchor="middle" font-size="12" fill="#44516b">${esc(noteName(p.midi,notation))}</text><text x="${319+i*43}" y="65" text-anchor="middle" font-size="9" fill="#44516b">${i+1}</text></g>`).join('');}
 else{extra=`<text x="306" y="43" font-size="12" fill="#44516b">${esc(pitchLabel(target.midi,notation))}${example.length>1?' → '+esc(pitchLabel(example[1].midi,notation)):''}</text><text x="306" y="66" font-size="10" fill="#44516b">${help.kind==='families'?'Toutes les octaves':help.kind==='interval'?'Deux sons successifs':'Toucher le repère'}</text>`;}
 return `<svg class="instruction-graphic" viewBox="0 0 440 110" role="img" aria-label="${esc(help.title)}. Exemple : ${esc(points.map(p=>`${pitchLabel(p.midi,notation)}, corde ${profile.tuning.length-p.string}, ${p.fret?'case '+p.fret:'à vide'}`).join(' ; '))}">${neck}${extra}</svg>`;
}
