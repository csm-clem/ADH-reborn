import {DEMO_RULES} from './demo-rules.js';
import {miniatureNeck} from './neck-view.js';
import {noteName,pitchLabel} from './core.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function introductionFor(module,stage,question,seen=[],activity='',melody=null,notation='international',stringCount=6){
 let key,title,text,kind='neck';
 if(stage==='discovery'){
  if(module.kind==='opens'){key='explore';title='Vos cordes à vide';text='Touchez chaque corde à vide, avant le sillet (la barre verticale épaisse).';}
  else{key='family-'+module.pitchClass;const n=noteName(module.pitchClass,notation),registers=[...new Set(module.focus.map(p=>pitchLabel(p.midi,notation)))].join(', ');title='Tous les '+n;text=({4:`${registers} : même nom, plusieurs hauteurs. Touchez chaque point.`,9:`Voici les ${n}. Retrouvez-les sur les différentes cordes.`,2:`Cherchez chaque ${n}. Le chiffre distingue les hauteurs.`,7:`Repérez les ${n}, du plus grave au plus aigu.`,11:`Voici ${registers}. Retenez leurs places.`,5:`Découvrez ${n}. Touchez tous ses emplacements.`,0:`Tous ces points sont des ${n}. Même nom, plusieurs sons.`,6:`Voici ${n}. ${n.includes('♭')?'♭ = bémol':'♯ = dièse'}. Touchez chaque point.`,1:`Une nouvelle note : ${n}. Trouvez toutes ses places.`,8:`Voici les ${n}. Essayez-les dans un autre ordre.`,3:`Associez ${n} à chaque point. Le chiffre indique la hauteur.`,10:`Cherchez tous les ${n}. Gardez leurs places en tête.`})[module.pitchClass];kind='family';}
 }else if(stage==='practice'){
  key=question?.mode+(question?.answerKind==='pitch'?'-pitch':'')+(question?.evaluation?'-evaluation':'');
  if(question?.mode==='name'){title='Quelle est cette note ?';text=question?.answerKind==='pitch'?'Regardez le point. Touchez son nom avec le bon chiffre.':'Regardez le point. Touchez son nom dans la roue.';kind='name';}
  else{title='Trouvez cette note';text='Lisez la note et le numéro de corde. Touchez sa place.';kind='find';}
  if(module.kind==='mix'&&!seen.includes('mix-intro')){key='mix-intro';title='Vos notes se mélangent';text=`Les ${noteName(module.pitchClass,notation)} rejoignent vos anciens repères. Retrouvez-les dans le désordre.`;kind='mix';}
 }else if(stage==='motif'){
  key=melody?'melody-'+module.baseId:'motif';title=melody?'Jouez la mélodie':'Une petite suite';kind='motif';text=melody?'Touchez les notes de gauche à droite. Une erreur ? On recommence.':'Touchez les notes dans l’ordre. Si vous vous trompez, la suite repart au début.';
 }
 return key&&!seen.includes(key)?{key,title,text,kind}:null;
}
export function helpGraphic(help,module,profile,notation='international'){
 const all=DEMO_RULES.points(module,{question:module.demoQuestion,kind:help.kind}),points=help.kind==='motif'?(module.demoMelody?.sequence||all).slice(0,3):help.kind==='mix'?all.filter((p,i)=>i===0||p.midi%12===module.pitchClass).slice(0,3):all,target=points[0]||module.pool[0];
 const neck=miniatureNeck(profile,{id:'help-neck',points,showNames:true,notation,lesson:true,label:'Exemple : '+points.map(p=>pitchLabel(p.midi,notation)).join(', ')});
 if(help.kind==='motif'){const sequence=module.demoMelody?.sequence||points;return `<div class="help-sequence">${neck}<div class="help-sequence-notes" aria-label="Touchez les notes dans cet ordre">${sequence.map((p,i)=>`<span><small>${i+1}</small><strong>${esc(pitchLabel(p.midi,notation))}</strong></span>${i<sequence.length-1?'<i aria-hidden="true">→</i>':''}`).join('')}</div></div>`;}
 if(help.kind!=='name')return neck;
 const exact=module.kind==='family',names=exact?[...new Set(module.pool.map(p=>p.midi))]:module.choices||[0,2,4,5,7,9,11];
 return `<div class="help-name-example">${neck}<span aria-hidden="true" class="help-arrow">→</span><div class="help-note-options">${names.map(n=>`<span class="help-note ${n===(exact?target.midi:target.midi%12)?'example-correct':''}">${esc(exact?pitchLabel(n,notation):noteName(n,notation))}</span>`).join('')}</div></div>`;
}
