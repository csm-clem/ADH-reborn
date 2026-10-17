import {DEMO_RULES} from './demo-rules.js';
import {miniatureNeck} from './neck-view.js';
import {noteName,pitchLabel} from './core.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function introductionFor(module,stage,question,seen=[],activity='',melody=null,notation='international',stringCount=6){
 let key,title,text,kind='neck';
 if(stage==='discovery'){
  if(module.kind==='opens'){key='explore';title='Vos cordes à vide';text='Une ligne = une corde. La plus grosse est en bas. Touchez avant le sillet (la barre verticale épaisse).';}
  else{key='family-'+module.pitchClass;const n=noteName(module.pitchClass,notation),registers=[...new Set(module.focus.map(p=>pitchLabel(p.midi,notation)))].join(', ');title='Tous les '+n;text=({4:`${registers} portent le même nom. Le chiffre indique la hauteur : plus il monte, plus le son est aigu.`,9:`Cherchez les ${n} d’une corde à l’autre. Le nom reste le même quand le son monte.`,2:`Retenez les places des ${n}. Touchez-les dans l’ordre que vous voulez.`,7:`Associez chaque ${n} à sa corde. Commencez par le plus grave, puis essayez les autres.`,11:`Observez où se trouvent ${registers}. Essayez de reconnaître leur dessin.`,5:`La famille ${n} rejoint votre carte. Comparez ses emplacements avant de les toucher.`,0:`Tous ces points sont des ${n}. Écoutez-les : un même nom peut sonner à plusieurs hauteurs.`,6:`Découvrez les ${n}. Le signe ${n.includes('♭')?'♭ se lit « bémol »':'♯ se lit « dièse »'}. Retrouvez le nom entier sur le manche.`,1:`Une nouvelle famille : ${n}. Cherchez son dessin parmi les cordes.`,8:`Repérez les ${n}, puis essayez-les dans un autre ordre.`,3:`Reliez le nom ${n} à chacun de ses points. Les chiffres distinguent leurs hauteurs.`,10:`Rassemblez les ${n} : même nom, plusieurs repères à reconnaître.`})[module.pitchClass];kind='family';}
 }else if(stage==='practice'){
  key=question?.mode+(question?.answerKind==='pitch'?'-pitch':'')+(question?.evaluation?'-evaluation':'');
  if(question?.mode==='name'){title='Quelle est cette note ?';text=question?.answerKind==='pitch'?'Regardez le point. Choisissez son nom et son chiffre : plus le chiffre monte, plus le son est aigu.':'Regardez le point. Touchez son nom dans la roue.';kind='name';}
  else{title='Trouvez cette note';text='Lisez le nom et la corde. Touchez la bonne case. Le chiffre après la note indique sa hauteur.';kind='find';}
  if(module.kind==='mix'&&!seen.includes('mix-intro')){key='mix-intro';title='Vos notes se mélangent';text=`Les ${noteName(module.pitchClass,notation)} rejoignent vos anciens repères. Retrouvez-les dans le désordre.`;kind='mix';}
 }else if(stage==='motif'){
  key=melody?'melody-'+module.baseId:'motif';title=melody?'Jouez la mélodie':'Une petite suite';kind='motif';text=melody?'Jouez les notes dans l’ordre. Une erreur ? Reprenez au début. Réussissez pour écouter la suite.':'Touchez les notes dans l’ordre. Si vous vous trompez, la suite repart au début.';
 }
 return key&&!seen.includes(key)?{key,title,text,kind}:null;
}
export function helpGraphic(help,module,profile,notation='international'){
 const points=DEMO_RULES.points(module,{question:module.demoQuestion,kind:help.kind}),target=points[0]||module.pool[0];
 const neck=miniatureNeck(profile,{id:'help-neck',points,showNames:true,notation,lesson:true,label:'Exemple : '+points.map(p=>pitchLabel(p.midi,notation)).join(', ')});
 if(help.kind!=='name')return neck;
 const exact=module.kind==='family',names=exact?[...new Set(module.pool.map(p=>p.midi))]:module.choices||[0,2,4,5,7,9,11];
 return `<div class="help-name-example">${neck}<span aria-hidden="true" class="help-arrow">→</span><div class="help-note-options">${names.map(n=>`<span class="help-note ${n===(exact?target.midi:target.midi%12)?'example-correct':''}">${esc(exact?pitchLabel(n,notation):noteName(n,notation))}</span>`).join('')}</div></div>`;
}
