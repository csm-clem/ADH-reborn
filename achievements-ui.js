import {achievementContext} from './achievement-rules.js';
import {achievementArtwork} from './achievement-art.js';
import {bindAchievementMotion} from './achievement-motion.js';
import {melodyById,catalogMelodies} from './melodies.js';
import {betaCatalog} from './beta-catalog.js';
import {rewardFor} from './reward-music.js';
import {notationFor} from './core.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function matchesCollectionFilter(def,filter){return filter==='all'||(filter==='earned'?!!def.obtained:!def.obtained&&(filter==='started'?def.progress.percent>0:filter==='missing'?def.progress.percent===0:false));}
const categories=[['all','Tout'],['landmarks','Repères'],['fluency','Fluidité'],['music','Musiques']];
export class AchievementsController{
 constructor(host){this.host=host;this.playing=null;this.ready=false;this.epoch=0;this.flipped=new Set();}
 get pilot(){return this.host.pilot;}
 get preferences(){return this.host.getState().collection;}
 get catalogue(){return this.context?.definitions||achievementContext({profile:this.pilot.profile,catalog:this.pilot.catalog,data:this.pilot.data,existing:this.pilot.store.achievements,notation:notationFor(this.host.getState())}).definitions;}
 target(def){return def.target;}
 reveal(id){this.expanded=id;this.revealed=id;this.flipped.delete(id);this.host.setPreferences({...this.preferences,category:'all',filter:'all',sort:'recent'});}
 focusRevealed(root){const card=root.querySelector('.collection-dialog [data-card-id]')||[...root.querySelectorAll('[data-card-id]')].find(c=>c.dataset.cardId===this.revealed);if(!card)return;card.scrollIntoView({block:'center',behavior:'instant'});card.focus({preventScroll:true});}

 stop(){this.epoch++;clearTimeout(this.endTimer);this.host.stopAudio();this.playing=null;this.ready=false;this.motion?.reset();}
 render(){
  this.motion?.reset();this.pilot.syncAchievements();this.pilot.save();
  this.context=achievementContext({profile:this.pilot.profile,catalog:this.pilot.catalog,data:this.pilot.data,existing:this.pilot.store.achievements,notation:notationFor(this.host.getState())});
  const prefs=this.preferences,category=prefs.category,defs=this.catalogue.filter(d=>category==='all'||d.category===category),count=defs.filter(d=>d.obtained).length;
  let visible=defs.filter(d=>matchesCollectionFilter(d,prefs.filter));
  if(prefs.sort==='recent')visible.sort((a,b)=>(b.obtained?.at||0)-(a.obtained?.at||0));
  if(prefs.sort==='rarity')visible.sort((a,b)=>b.level-a.level||a.number.localeCompare(b.number));
  const next=defs.filter(d=>!d.obtained).sort((a,b)=>b.progress.percent-a.progress.percent)[0];
  return `${this.notice?`<p class="notice" role="status">${esc(this.notice)}</p>`:''}<div class="page-heading collection-heading"><div><h1>Mes succès.</h1><p>${esc(this.pilot.profile.label)} · vos réussites en collection.</p></div></div><section class="collection-overview panel"><div class="collection-tabs" role="group" aria-label="Collections">${categories.map(([id,title])=>{const all=this.catalogue.filter(d=>id==='all'||d.category===id),n=all.filter(d=>d.obtained).length;return `<button class="button ${category===id?'primary':'quiet-button'}" data-success-action="category" data-value="${id}" aria-pressed="${category===id}">${title}<span class="button-count">${n}/${all.length}</span></button>`;}).join('')}</div><div class="collection-count"><strong>${count}<small>/ ${defs.length}</small></strong><span>cartes collectionnées</span></div><progress max="${defs.length||1}" value="${count}" aria-label="${count} succès sur ${defs.length}"></progress></section>${next?`<section class="collection-next"><div><small>Votre prochain défi</small><strong>${esc(next.title)}</strong></div><button class="button quiet-button compact" data-success-action="try" data-id="${next.id}">Essayer ${this.host.icon('arrow')}</button></section>`:''}<section class="collection-toolbar" aria-label="Présentation de la collection"><label>Afficher<select data-success-pref="filter">${[['all','Tous'],['missing','À faire'],['started','En cours'],['earned','Acquis']].map(([v,t])=>`<option value="${v}" ${prefs.filter===v?'selected':''}>${t}</option>`).join('')}</select></label><label>Trier<select data-success-pref="sort">${[['path','Parcours'],['rarity','Rareté'],['recent','Récents']].map(([v,t])=>`<option value="${v}" ${prefs.sort===v?'selected':''}>${t}</option>`).join('')}</select></label><button class="button quiet-button compact" data-success-action="layout" aria-pressed="${prefs.layout==='album'}">${prefs.layout==='album'?'Vue détaillée':'Vue Album'}</button></section><section class="stage collection-stage" aria-label="Album de cartes"><div class="achievement-grid ${prefs.layout==='album'?'is-album':''}">${visible.length?visible.map(d=>prefs.layout==='album'?this.thumbnail(d):this.card(d)).join(''):'<p class="collection-empty">Aucune carte dans ce filtre. Choisissez « Tous » pour retrouver les défis.</p>'}</div></section><p class="collection-motion-help">${prefs.layout==='album'?'Touchez une carte pour l’ouvrir en grand.':'Glissez de côté sur une carte pour ses reflets ; glissez verticalement pour faire défiler.'}</p>${this.expandedCard()}`;
 }
 thumbnail(def){return `<button class="album-thumbnail rarity-${def.rarity.id} ${def.obtained?'is-earned':'is-missing'}" data-success-action="expand" data-id="${def.id}" aria-label="Ouvrir ${esc(def.title)}, ${def.progress.percent} %"><span class="achievement-art" aria-hidden="true">${achievementArtwork(def,'album-')}</span><span class="album-title">${esc(def.title)}</span><span class="album-percent">${def.obtained?'✓ · ':''}${def.progress.percent} %</span><progress max="100" value="${def.progress.percent}" aria-label="${esc(def.title)} : ${def.progress.percent} %"></progress></button>`;}
 expandedCard(){const def=this.catalogue.find(d=>d.id===this.expanded);if(!def)return '';queueMicrotask(()=>{const dialog=document.querySelector('.collection-dialog');if(dialog&&!dialog.open)dialog.showModal();});return `<dialog class="collection-dialog" data-dialog-owned aria-label="${esc(def.title)}"><button class="button secondary compact album-close" data-success-action="collapse" autofocus>Fermer</button>${this.card(def,'expanded-')}</dialog>`;}
 rarity(def){return `<span class="achievement-rarity" aria-label="Rareté : ${def.rarity.label}, ${def.level} sur 5"><span aria-hidden="true" class="rarity-stars">${'★'.repeat(def.level)}</span><span>${def.rarity.label}</span></span>`;}
 card(def,namespace=''){
  const u=def.obtained,p=def.progress,playing=this.playing===def.id,canPlay=!!u&&!!rewardFor(def.music),flip=this.flipped.has(def.id),id='success-'+namespace+def.id;
  const date=u?`<time class="achievement-stamp" datetime="${new Date(u.at).toISOString()}" title="Débloqué le ${new Date(u.at).toLocaleDateString('fr-FR')}" aria-label="Débloqué le ${new Date(u.at).toLocaleDateString('fr-FR')}">${new Date(u.at).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'2-digit'})}</time>`:'';
  const criteriaButton=`<button class="button quiet-button card-action criteria-action" data-success-action="flip" data-id="${def.id}" aria-controls="${id}-back" aria-label="Voir les critères de ${esc(def.title)}">Critères</button>`;
  return `<article class="achievement-card rarity-${def.rarity.id} ${u?'is-earned':'is-missing'} ${flip?'is-flipped':''} ${this.revealed===def.id?'is-revealed':''} ${playing&&this.ready?'is-playing':''}" aria-label="${esc(def.title)}${u?' — succès débloqué':''}" data-view-key="${def.id}" data-card-id="${def.id}" tabindex="-1" data-rarity="${def.rarity.id}"><div class="achievement-tilt" data-layout-owned><div class="achievement-flipper"><section class="achievement-front" ${flip?'inert':''} aria-labelledby="${id}-title"><header class="achievement-card-header"><span class="achievement-signature" aria-hidden="true">DFT</span>${this.rarity(def)}${u?`<span class="achievement-seal" role="img" aria-label="Succès débloqué">${this.host.icon('check')}</span>`:''}</header><div class="achievement-art" aria-hidden="true">${achievementArtwork(def,namespace)}<span class="card-reflection"></span><span class="card-foil"></span></div><div class="achievement-copy"><p class="achievement-material">${def.rarity.material}</p><h2 id="${id}-title">${esc(def.title)}</h2><p class="achievement-context">${esc(def.context)}</p><button class="achievement-progress" data-success-action="flip" data-id="${def.id}" aria-label="Progression : ${p.percent} %. ${esc(p.label)}. Voir les critères de ${esc(def.title)}" aria-controls="${id}-back"><span class="achievement-progress-heading"><span>Progression</span><strong>${p.percent} %</strong></span><progress max="100" value="${p.percent}" aria-label="${esc(def.title)} : ${p.percent} %"></progress><small>${esc(p.label)}</small></button><div class="achievement-actions ${canPlay?'has-music':''} ${u?'has-date':''}"><button class="button ${u?'quiet-button':'primary'} card-action challenge-action" data-success-action="try" data-id="${def.id}">${u?'Rejouer le défi':'Essayer'}</button>${date}${canPlay?`<button class="button quiet-button card-action listen-action" data-success-action="listen" data-id="${def.id}" aria-pressed="${playing}" ${!this.host.getState().sound?'disabled title="Activez le son dans les paramètres"':''}>${this.host.icon(playing?'pause':'play')}${playing?(this.ready?'Arrêter':'Préparation…'):'Écouter'}</button>`:''}${criteriaButton}</div><span class="achievement-number">N° ${def.number}</span></div></section><section id="${id}-back" class="achievement-back" ${flip?'':'inert'} aria-label="Critères de ${esc(def.title)}"><header><p class="eyebrow">LE DÉFI</p>${this.rarity(def)}</header><h2>${esc(def.title)}</h2><div class="achievement-criteria-body">${u&&u.ruleVersion!==2?'<p class="achievement-legacy">Succès conservé depuis une version précédente.</p>':''}<ul class="achievement-criteria">${def.checks.map(c=>`<li class="${c.done?'is-complete':''}"><span class="criterion-marker" aria-hidden="true">${c.done?'✓':'•'}</span><span>${esc(c.label)}${c.max>1?`<small>${c.value} / ${c.max}</small>`:''}</span></li>`).join('')}</ul></div><div class="achievement-back-actions"><button class="button quiet-button compact" data-success-action="try" data-id="${def.id}">${u?'Rejouer le défi':'Essayer'}</button><button class="button quiet-button compact" data-success-action="flip" data-id="${def.id}">Retour à la carte</button></div><span class="achievement-number">N° ${def.number}</span></section></div></div></article>`;
 }
 update(patch){this.revealed=null;this.stop();this.flipped.clear();this.host.setPreferences({...this.preferences,...patch});this.host.render();}
 flip(button){
  const card=button.closest('.achievement-card'),id=card.dataset.cardId,on=!card.classList.contains('is-flipped');this.motion?.reset();
  if(on)this.flipped.add(id);else this.flipped.delete(id);
  card.classList.toggle('is-flipped',on);const front=card.querySelector('.achievement-front'),back=card.querySelector('.achievement-back');front.inert=on;back.inert=!on;
  (on?back:front).querySelector('[data-success-action="flip"]').focus({preventScroll:true});
 }
 closeExpanded(){const id=this.expanded;this.expanded=null;this.stop();this.host.render();[...document.querySelectorAll('[data-success-action=expand]')].find(b=>b.dataset.id===id)?.focus({preventScroll:true});}
 bind(root){
  root.addEventListener('cancel',e=>{if(e.target.matches('.collection-dialog')){e.preventDefault();this.closeExpanded();}},true);
  this.motion=bindAchievementMotion(root);
  root.addEventListener('click',e=>{const b=e.target.closest('[data-success-action]');if(!b)return;e.preventDefault();const action=b.dataset.successAction;
   if(action==='layout'){this.expanded=null;this.update({layout:this.preferences.layout==='album'?'list':'album'});return;}
   if(action==='expand'){this.expanded=b.dataset.id;this.flipped.delete(this.expanded);this.host.render();return;}
   if(action==='collapse'){this.closeExpanded();return;}
   if(action==='flip'){this.flip(b);return;}
   if(action==='category'){this.update({category:b.dataset.value});return;}
   const def=this.catalogue.find(d=>d.id===b.dataset.id);if(!def)return;
   if(action==='try'){
    this.stop();let target=def.target,profile=null;
    if(def.music&&def.obtained){
     const u=def.obtained,record=this.pilot.store.profiles[u.profileKey],source=record?.profile||this.pilot.profile,catalog=source.key===this.pilot.profile.key?this.pilot.catalog:betaCatalog(source,{full:!!this.pilot.host.fullCurriculum}),assigned=[...catalogMelodies(catalog)].find(([,m])=>m.id===def.music.id);
     if(!assigned){this.notice='Ce défi musical n’est plus proposé sur l’accordage d’origine. Votre carte reste conservée.';this.host.render();return;}
     target={kind:'activity',id:assigned[0]};if(source.key!==this.pilot.profile.key)profile=source;
    }
    if(target.kind==='course'){
     const chapter=this.pilot.catalog.chapters.find(c=>c.courseId===target.id);
     this.pilot.data.navigation={branch:chapter?'targeted':'beginner',route:chapter?.scopeId||'beginner',chapter:chapter?.id||target.id};this.pilot.save();this.host.openCourse(target.id);
    }else this.host.start(target.id,profile);
   }
   if(action==='listen')this.listen(def);
  });
  root.addEventListener('change',e=>{if(e.target.dataset.successPref)this.update({[e.target.dataset.successPref]:e.target.value});});
 }
 async listen(def){
  if(this.playing===def.id){this.stop();this.host.render();return;}
  if(!def.obtained?.musicId||!this.host.getState().sound)return;
  this.stop();const reward=rewardFor(melodyById(def.obtained.musicId,def.obtained.shift));if(!reward)return;
  const epoch=++this.epoch;this.playing=def.id;this.ready=false;this.host.render();
  const start=()=>{if(epoch===this.epoch){this.ready=true;this.host.render();}};
  const ok=await this.host.playArrangement(reward,{onStart:start});if(epoch!==this.epoch)return;
  if(!ok){this.playing=null;this.ready=false;this.host.render();return;}
  if(!this.ready)start();
  this.endTimer=setTimeout(()=>{if(epoch===this.epoch){this.playing=null;this.ready=false;this.host.render();}},reward.durationMs);
 }
}
