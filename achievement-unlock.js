import {achievementArtwork} from './achievement-art.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/** A real earned card, never a second source of unlock rules. No timer or forced navigation. */
export function renderAchievementUnlock(cards,index=0,icon=()=> ''){
 if(!cards.length)return '';
 const selected=Math.max(0,Math.min(cards.length-1,index)),card=cards[selected];
 return `<section class="achievement-celebration achievement-unlock rarity-${card.rarity.id}" data-view-key="unlock-${card.id}" aria-label="Succès débloqué : ${esc(card.title)}">
  <div class="unlock-thumbnail" aria-hidden="true">${achievementArtwork(card)}<span class="unlock-halo"></span></div>
  <div class="unlock-copy" role="status" aria-live="polite"><p class="unlock-event">Succès débloqué${cards.length>1?` <span>${selected+1} / ${cards.length}</span>`:''}</p><h3>${esc(card.title)}</h3><p class="unlock-description">Ajouté à votre collection.</p></div>
  <div class="unlock-actions"><button class="button quiet-button compact" data-pilot-action="achievements" data-id="${card.id}" aria-label="Voir le succès ${esc(card.title)} dans ma collection">Voir le succès ${icon('arrow')}</button>${cards.length>1?`<div class="unlock-navigation" role="group" aria-label="Parcourir les nouveaux succès"><button class="icon-button" data-pilot-action="unlock-previous" aria-label="Succès précédent" ${selected===0?'disabled':''}>${icon('back')}</button><button class="icon-button" data-pilot-action="unlock-next" aria-label="Succès suivant" ${selected===cards.length-1?'disabled':''}>${icon('arrow')}</button></div>`:''}</div>
 </section>`;
}
