/** Per-run Arcade history. Never reconstruct missing runs from personal bests. */
export const HISTORY_LIMIT=1000;
export function historyEntry(run){return {at:run.at,mode:run.mode,rules:run.rules,score:run.score,longest:run.longest,meanMs:run.correct?run.timeSum/run.correct:null};}
export function validateHistory(entries){
 if(!Array.isArray(entries)||entries.length>HISTORY_LIMIT)throw Error('Historique Arcade invalide.');
 for(const e of entries)if(!e||!Number.isSafeInteger(e.at)||e.at<0||!['zones-natural','zones-chromatic','strings-natural','strings-chromatic'].includes(e.mode)||!Number.isSafeInteger(e.rules)||e.rules<1||!Number.isSafeInteger(e.score)||e.score<0||!Number.isSafeInteger(e.longest)||e.longest<0||e.meanMs!==null&&(!Number.isFinite(e.meanMs)||e.meanMs<0))throw Error('Point de trajectoire invalide.');
 return entries;
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=n=>new Date(n).toLocaleString('fr-FR');
function chart(entries,key,label,unit=''){
 const values=entries.filter(e=>e[key]!==null);if(!values.length)return `<article><h3>${label}</h3><p>Pas encore de données pour cette mesure.</p></article>`;
 const times=entries.map(e=>e.at),start=Math.min(...times),span=Math.max(1,Math.max(...times)-start),max=Math.max(1,...values.map(e=>e[key]));
 const x=e=>35+(e.at-start)/span*530,y=e=>170-e[key]/max*140;
 const points=entries.map(e=>e[key]===null?null:`${x(e)},${y(e)}`);
 const lines=[];let segment=[];for(const p of points){if(p)segment.push(p);else{if(segment.length)lines.push(segment.join(' '));segment=[];}}if(segment.length)lines.push(segment.join(' '));
 return `<article class="trajectory-chart"><h3>${label}</h3><svg viewBox="0 0 600 210" role="img" aria-label="${label} dans le temps, ${values.length} parties. Détail dans le tableau."><path d="M35 25V170H565" fill="none" stroke="currentColor" opacity=".4"/>${lines.map(p=>`<polyline points="${p}" fill="none" stroke="var(--brand)" stroke-width="3"/>`).join('')}${values.map(e=>`<circle cx="${x(e)}" cy="${y(e)}" r="5" fill="var(--brand)"><title>${esc(date(e.at))} : ${Math.round(e[key]*100)/100}${unit}</title></circle>`).join('')}<text x="35" y="195" font-size="12" fill="currentColor">${esc(new Date(start).toLocaleDateString('fr-FR'))}</text><text x="565" y="195" text-anchor="end" font-size="12" fill="currentColor">${esc(new Date(Math.max(...times)).toLocaleDateString('fr-FR'))}</text><text x="35" y="18" font-size="12" fill="currentColor">${Math.round(max*100)/100}${unit}</text></svg></article>`;
}
export function trajectoryView(arcade){
 const history=arcade?.history||[];const labels={'zones-natural':'Zones · Naturelles','zones-chromatic':'Zones · Chromatiques','strings-natural':'Cordes · Naturelles','strings-chromatic':'Cordes · Chromatiques'};
 return `<section class="panel trajectory"><h2>Trajectoire</h2><p>Vos parties Arcade au fil du temps, pour cet instrument et cet accordage. Points totaux de chaque partie, meilleure série et temps moyen des bonnes réponses. Un temps plus bas indique une réponse plus rapide.</p>${!history.length?'<p>Terminez une partie Arcade pour tracer votre premier point. Les anciennes parties non enregistrées ne sont pas reconstituées.</p>':Object.entries(labels).map(([mode,label])=>{const list=history.filter(e=>e.mode===mode).sort((a,b)=>a.at-b.at);if(!list.length)return '';return [...new Set(list.map(e=>e.rules))].map(rules=>{const rows=list.filter(e=>e.rules===rules);return `<details><summary>${label} · règles ${rules} · ${rows.length} parties</summary>${chart(rows,'score','Points totaux')}${chart(rows,'longest','Notes d’affilée')}${chart(rows.map(e=>({...e,seconds:e.meanMs===null?null:e.meanMs/1000})),'seconds','Temps moyen',' s')}<details><summary>Les chiffres de mes parties</summary><div style="overflow:auto"><table><thead><tr><th>Date</th><th>Points</th><th>Notes d’affilée</th><th>Temps moyen</th></tr></thead><tbody>${rows.map(e=>`<tr><td>${esc(date(e.at))}</td><td>${e.score}</td><td>${e.longest}</td><td>${e.meanMs===null?'—':(e.meanMs/1000).toFixed(2)+' s'}</td></tr>`).join('')}</tbody></table></div></details></details>`;}).join('');}).join('')}<small>Jusqu’à ${HISTORY_LIMIT} parties conservées par configuration. Aucun point fictif n’est ajouté entre deux parties.</small></section>`;
}
