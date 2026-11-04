import {pitchLabel} from './core.js';
export function masteryMetrics(events){
 const es=events.filter(e=>!e.retry&&e.correct&&!e.aids?.length&&e.timingInterpretable!==false&&Number.isFinite(e.ms)&&e.ms>=0);
 const positions=new Map();for(const e of es){const key=`${e.target.string}:${e.target.fret}`;const p=positions.get(key)||{target:e.target,total:0,time:0};p.total++;p.time+=e.ms;positions.set(key,p);}
 const rows=[...positions.values()].map(p=>({...p,mean:p.time/p.total})).sort((a,b)=>a.mean-b.mean);
 const mean=es.length?es.reduce((s,e)=>s+e.ms,0)/es.length:null;
 const spread=es.length>=4?Math.sqrt(es.reduce((s,e)=>s+(e.ms-mean)**2,0)/es.length):null;
 return {rows,mean,spread,count:es.length};
}
export function masteryView(events,profile,notation){
 const m=masteryMetrics(events),label=p=>`${pitchLabel(p.target.midi,notation)} · corde ${profile.tuning.length-p.target.string}, case ${p.target.fret}`;
 return `<section><h2>Vos repères, en détail</h2><p>Temps moyen sans aide : ${m.mean===null?'indisponible':(m.mean/1000).toFixed(2)+' s'} (${m.count} réponses chronométrées).</p>${m.rows.length>1?`<p>Position la plus rapide de cette séance : ${label(m.rows[0])}, ${(m.rows[0].mean/1000).toFixed(2)} s (${m.rows[0].total} essais).</p><p>Position ayant demandé le plus de temps : ${label(m.rows.at(-1))}, ${(m.rows.at(-1).mean/1000).toFixed(2)} s (${m.rows.at(-1).total} essais). Ce constat ne suffit pas à établir une lacune.</p>`:'<p>Pas assez de positions chronométrées pour comparer les repères.</p>'}${m.spread===null?'<p>Pas assez de réponses chronométrées pour décrire la régularité.</p>':`<p>Dispersion des temps (écart-type) : ${(m.spread/1000).toFixed(2)} s. Cette variation peut aussi venir des différentes questions.</p>`}<p>Pour consolider : retrouvez ces notes lors d’une prochaine séance, ou poursuivez vers le chapitre suivant. Aucun manque n’est déduit de votre sans-faute.</p></section>`;
}
