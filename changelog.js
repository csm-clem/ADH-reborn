/** Player-facing history, curated from docs/CHANGES-v*.md. No planned features. */
export const CHANGE_TYPES=Object.freeze({feature:['⭐️','Nouveautés'],improvement:['⚙️','Améliorations'],bug:['🐛','Corrections'],event:['🎉','Événements']});
import {LIVE_RELEASES} from './release-history.js';
export const RELEASE_HISTORY=Object.freeze(LIVE_RELEASES.map(e=>Object.freeze(e)));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderChangelog(release){return `<header class="page-heading"><div><h1>Journal des modifications</h1><p>Les changements des versions publiées en live.</p></div></header><button class="button quiet-button" data-action="settings">← Retour aux paramètres</button><section class="change-controls panel" aria-label="Options du journal"><div class="change-toolbar"><button class="button secondary compact" data-change-action="filters" aria-expanded="false" aria-controls="change-filters">Filtrer les changements</button><button class="button quiet-button compact" data-change-action="expand">Tout déplier</button><button class="button quiet-button compact" data-change-action="collapse">Tout replier</button></div><div id="change-filters" class="change-filters" role="group" aria-label="Type de changement" hidden>${[['all','Tout'],...Object.entries(CHANGE_TYPES).map(([key,[icon,label]])=>[key,icon+' '+label])].map(([type,label])=>`<button class="button quiet-button compact" data-change-filter="${type}" aria-pressed="${type==='all'}">${label}</button>`).join('')}</div><p class="change-count" role="status" aria-live="polite"></p></section><p class="muted">Version installée : ${esc(release)}. Seules les publications live figurent ici.</p><div class="change-history">${RELEASE_HISTORY.map((entry,i)=>`<details class="panel change-release" ${i===0?'open':''}><summary><strong>v${esc(entry.version)}</strong><span>${esc(entry.title)}</span></summary><ul>${entry.items.map(([type,text])=>`<li data-change-type="${type}"><span aria-hidden="true">${CHANGE_TYPES[type][0]}</span><span><span class="visually-hidden">${CHANGE_TYPES[type][1]} : </span>${esc(text)}</span></li>`).join('')}</ul></details>`).join('')}</div>`;}

/** Delegated controls preserve native disclosure state and keyboard operation. */
export function bindChangelog(root){
 root.addEventListener('click',e=>{
  const button=e.target.closest('[data-change-action],[data-change-filter]');if(!button)return;
  const releases=[...root.querySelectorAll('.change-release')],action=button.dataset.changeAction;
  if(action==='filters'){const panel=root.querySelector('#change-filters');panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));return;}
  if(action==='expand'||action==='collapse'){for(const el of releases)if(!el.hidden)el.open=action==='expand';return;}
  const filter=button.dataset.changeFilter;if(!filter)return;
  root.querySelectorAll('[data-change-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.changeFilter===filter)));
  let count=0,versions=0;
  for(const el of releases){let matches=0;for(const item of el.querySelectorAll('[data-change-type]')){item.hidden=filter!=='all'&&item.dataset.changeType!==filter;if(!item.hidden)matches++;}el.hidden=!matches;count+=matches;if(matches)versions++;}
  root.querySelector('.change-count').textContent=`${count} modification${count>1?'s':''} · ${versions} version${versions>1?'s':''}`;
 });
}
