import {APP_NAME} from './release.js';
import {instrumentPicture} from './instrument-art.js';
import {INSTRUMENTS,makeProfile} from './core.js';
import {tuningPresets,tuningText,adjustTuning,tuningPages,tuningPitchLabel} from './tuning.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class OnboardingController{
 constructor(host){this.host=host;this.reset();}
 reset(profile=null,notation=this.host.getState().notation){
  this.step=1;this.instrumentId=profile?.instrumentId||'guitar6';this.notation=notation;this.drafts=new Map();this.page=0;this.capacity=this.compactMode?1:8;this.message='';this.editorOpen=false;
  this.draft=this.defaultDraft(this.instrumentId);
  if(profile){const matched=tuningPresets(this.instrumentId).find(p=>p.tuning.every((n,i)=>n===profile.tuning[i]));this.draft={preset:matched?.id||'custom',flats:matched?.flats||false,tuning:[...profile.tuning]};}
 }
 defaultDraft(id){const p=tuningPresets(id)[0];return {preset:p.id,flats:p.flats,tuning:[...p.tuning]};}
 label(midi){return tuningPitchLabel(midi,this.notation,this.draft.flats);}
 get instrument(){return INSTRUMENTS.find(i=>i.id===this.instrumentId);}
 get custom(){return this.draft.preset==='custom';}
 get editing(){return this.custom&&this.editorOpen;}
 get pages(){const pages=tuningPages(this.instrument.strings,this.capacity);return this.compactMode?[...pages,[]]:pages;}
 get allStrings(){return this.compactMode&&this.pages[this.page].length===0;}
 get muted(){return !this.host.getState().sound;}
 emit(focus=null){this.host.render();if(focus)document.querySelector(focus)?.focus({preventScroll:true});}
 bind(root){
  root.addEventListener('click',e=>{const b=e.target.closest('[data-setup-action]');if(!b)return;e.preventDefault();this.action(b.dataset.setupAction,b);});
  root.addEventListener('change',e=>{
   if(e.target.id==='instrument'){this.drafts.set(this.instrumentId,this.draft);this.instrumentId=e.target.value;this.draft=this.drafts.get(this.instrumentId)||this.defaultDraft(this.instrumentId);this.page=0;this.message='';this.emit('#instrument');}
   if(e.target.id==='notation'){this.notation=e.target.value;this.emit('#notation');}
   if(e.target.id==='tuning-preset'){
    const id=e.target.value;
    if(id==='custom'){this.draft={...this.draft,preset:'custom',tuning:[...this.draft.tuning]};this.editorOpen=true;}
    else {this.editorOpen=false;const preset=tuningPresets(this.instrumentId).find(p=>p.id===id);if(!preset)return;this.draft={preset:id,flats:preset.flats,tuning:[...preset.tuning]};}
    this.page=0;this.message='';this.host.stopAudio();this.emit(this.editing?'.setup-heading':'#tuning-preset');
   }
  });
  root.addEventListener('submit',e=>{if(e.target.id!=='setup-form')return;e.preventDefault();this.action(this.step===1?'next':'finish');});
 }
 action(action,button){
  switch(action){
   case 'next':this.step=2;this.page=0;this.emit('#tuning-preset');return;
   case 'back':this.host.stopAudio();if(this.editing){this.editorOpen=false;this.emit('#tuning-preset');}else{this.step=1;this.emit('#instrument');}return;
   case 'edit':this.editorOpen=true;this.page=0;this.emit('.setup-heading');return;
   case 'mute':this.host.setSound(!this.host.getState().sound);this.emit('[data-setup-action="mute"]');return;
   case 'listen':this.host.stopAudio();this.host.playSequence(this.draft.tuning);return;
   case 'listen-string':this.host.stopAudio();this.host.playNote(this.draft.tuning[Number(button.dataset.string)]);return;
   case 'adjust':{
    const string=button.dataset.string===undefined?null:Number(button.dataset.string),delta=Number(button.dataset.delta),next=adjustTuning(this.draft.tuning,delta,string);if(!next)return;
    this.draft={...this.draft,preset:'custom',tuning:next};this.message=string===null?`Toutes les cordes : ${delta>0?'plus aigu':'plus grave'} d’un demi-ton.`:`Corde ${this.instrument.strings-string} : ${this.label(next[string])}.`;
    this.host.stopAudio();if(string===null)this.host.playSequence(next);else this.host.playNote(next[string]);
    this.emit(`[data-setup-action="adjust"][data-delta="${delta}"]${string===null?':not([data-string])':`[data-string="${string}"]`}`);return;
   }
   case 'page':this.page=Math.max(0,Math.min(this.pages.length-1,this.page+Number(button.dataset.delta)));this.emit('.tuning-page-label');return;
   case 'reset':this.draft={...this.defaultDraft(this.instrumentId),preset:'custom'};this.message='Accordage standard rétabli.';this.host.stopAudio();this.emit('[data-setup-action="reset"]');return;
   case 'finish':{
    try{const profile=makeProfile(this.instrumentId,tuningText(this.draft.tuning));this.host.stopAudio();this.host.complete(profile,this.notation);}catch(error){this.message=error.message;this.emit();}return;
   }
  }
 }
 instrumentPicture(){return instrumentPicture(this.instrument);}
 pagination(){
  const pages=this.pages,group=pages[this.page],number=i=>this.instrument.strings-i,label=group.length?(group.length===1?`Corde ${number(group[0])}`:`Cordes ${number(group[0])}–${number(group.at(-1))}`):'Toutes';
  return `<nav class="tuning-pagination" aria-label="Cordes à régler" ${pages.length===1?'hidden':''}><button type="button" class="icon-button" data-setup-action="page" data-delta="-1" aria-label="Cordes précédentes" ${this.page===0?'disabled':''}>‹</button><span class="tuning-page-label" tabindex="-1">${label}<small>${this.page+1} / ${pages.length}</small></span><button type="button" class="icon-button" data-setup-action="page" data-delta="1" aria-label="Cordes suivantes" ${this.page===pages.length-1?'disabled':''}>›</button></nav>`;
 }
 tools(){
  if(this.compactMode)return `<aside class="tuner-tools compact-tuner-tools"><p class="tuner-instruction">↓ / ↑ : un demi-ton · note = écouter.<br>Dernière vue : toutes les cordes.</p>${this.pagination()}</aside>`;
  return `<aside class="tuner-tools"><p class="tuner-instruction">↓ plus grave · ↑ plus aigu<br>Un clic = un demi-ton. Touchez une note pour l’écouter.</p><div class="tuning-all"><span>Toutes les cordes</span><button type="button" class="tuning-arrow" data-setup-action="adjust" data-delta="-1" aria-label="Toutes les cordes : un demi-ton plus grave" ${adjustTuning(this.draft.tuning,-1)?'':'disabled'}>↓</button><button type="button" class="tuning-arrow" data-setup-action="adjust" data-delta="1" aria-label="Toutes les cordes : un demi-ton plus aigu" ${adjustTuning(this.draft.tuning,1)?'':'disabled'}>↑</button></div><div class="tuner-extra"><button type="button" class="text-button" data-setup-action="listen" ${this.muted?'disabled':''}>${this.host.icon('sound')} Tout écouter</button><button type="button" class="text-button" data-setup-action="reset">Standard</button></div>${this.pagination()}</aside>`;
 }
 globalRow(){return `<div class="tuning-rows"><div class="tuning-string-row"><span class="tuning-string-number" aria-hidden="true">∞</span><button class="tuning-arrow" type="button" data-setup-action="adjust" data-delta="-1" aria-label="Toutes les cordes : un demi-ton plus grave" ${adjustTuning(this.draft.tuning,-1)?'':'disabled'}>↓</button><button class="tuning-note tuning-listen-all" type="button" data-setup-action="listen" aria-label="Écouter toutes les cordes" ${this.muted?'disabled':''}>${this.host.icon('sound')}</button><button class="tuning-arrow" type="button" data-setup-action="adjust" data-delta="1" aria-label="Toutes les cordes : un demi-ton plus aigu" ${adjustTuning(this.draft.tuning,1)?'':'disabled'}>↑</button><span class="tuning-string-track" aria-hidden="true"><i></i></span></div></div>`;}
 rows(){
  if(this.allStrings)return this.globalRow();
  const count=this.instrument.strings;
  return `<div class="tuning-rows" role="group" aria-label="Réglage par corde, de la corde 1 vers la corde ${count}">${this.pages[this.page].map(string=>{
   const midi=this.draft.tuning[string],number=count-string,label=this.label(midi);
   return `<div class="tuning-string-row" data-row-string="${string}"><span class="tuning-string-number" title="Corde ${number}">${number}</span><button class="tuning-arrow" type="button" data-setup-action="adjust" data-string="${string}" data-delta="-1" aria-label="Corde ${number} : un demi-ton plus grave" ${adjustTuning(this.draft.tuning,-1,string)?'':'disabled'}>↓</button><button class="tuning-note" type="button" data-setup-action="listen-string" data-string="${string}" aria-label="Écouter la corde ${number}, ${esc(label)}" ${this.muted?'disabled':''}>${esc(label)}</button><button class="tuning-arrow" type="button" data-setup-action="adjust" data-string="${string}" data-delta="1" aria-label="Corde ${number} : un demi-ton plus aigu" ${adjustTuning(this.draft.tuning,1,string)?'':'disabled'}>↑</button><span class="tuning-string-track" style="--string-weight:${.7+string*.2}px" aria-hidden="true"><i></i></span></div>`;
  }).join('')}</div>`;
 }
 render(){
  const instrument=this.instrument,presets=tuningPresets(this.instrumentId),pages=this.pages,alteredRoot=![0,2,4,5,7,9,11].includes(Math.min(...this.draft.tuning)%12);
  this.page=Math.min(this.page,pages.length-1);
  const summary=`${instrument.name} · ${instrument.strings} cordes`;
  return `<main class="setup-wizard" id="main-content" tabindex="-1"><header class="setup-header"><span class="brand"><img src="./icons/icon.svg" alt=""><span>${esc(APP_NAME)}</span></span><span class="setup-step">${this.step} / 2</span><button type="button" class="icon-button sound-toggle ${this.muted?'is-muted':''}" data-setup-action="mute" aria-label="${this.muted?'Activer':'Couper'} le son" aria-pressed="${this.muted}">${this.host.icon(this.muted?'mute':'sound')}</button></header><form id="setup-form" class="setup-flow ${this.compactMode?'is-compact':''} ${this.step===1?'setup-identity':this.editing?'setup-custom':'setup-presets'}">${this.step===1?`<section class="setup-heading setup-landing-copy"><p class="eyebrow">VOTRE MANCHE. VOTRE TERRAIN DE JEU.</p><h1><span class="landing-long">Les notes,<br>au bout des doigts.</span><span class="landing-short">Jouez les notes.</span></h1><p class="landing-description">Un petit jeu pour apprendre les notes.<br>Regardez, touchez, puis retrouvez-les.</p><div class="landing-features"><span>20 à 30 questions</span><span>À votre rythme</span><span>Hors connexion</span></div></section>`:`<div class="setup-heading" tabindex="-1"><h1>${this.editing?'Personnalisé.':'Votre accordage.'}</h1><p>${summary}</p></div>`}${this.step===1?`<section class="setup-identity-fields"><div><label for="instrument">Instrument et nombre de cordes</label><select id="instrument" name="instrument">${INSTRUMENTS.map(i=>`<option value="${i.id}" ${i.id===this.instrumentId?'selected':''}>${i.name} ${i.strings} cordes</option>`).join('')}</select></div><div><label for="notation">Noms des notes</label><select id="notation" name="notation"><option value="international" ${this.notation==='international'?'selected':''}>C · D · E</option><option value="latin" ${this.notation==='latin'?'selected':''}>Do · Ré · Mi</option></select></div></section><figure class="setup-preview">${this.instrumentPicture()}</figure>`:`<div class="setup-preset-field" ${this.editing?'hidden':''}><label for="tuning-preset">Accordage</label><select id="tuning-preset">${presets.map(p=>`<option value="${p.id}" ${p.id===this.draft.preset?'selected':''}>${esc(p.label)}</option>`).join('')}<option value="custom" ${this.custom?'selected':''}>Personnalisé…</option></select></div>${this.editing?`<section class="setup-tuner" aria-label="Accordage personnalisé"><div class="tuner-strings">${this.rows()}</div>${this.tools()}</section>`:`<figure class="setup-preview">${this.instrumentPicture()}<div class="setup-note-strip" aria-label="Accordage du grave vers l’aigu, de la corde ${instrument.strings} à la corde 1">${this.draft.tuning.map((n,i)=>`<span><small>${instrument.strings-i}</small>${esc(this.label(n))}</span>`).join('')}</div><button type="button" class="text-button" data-setup-action="listen" ${this.muted?'disabled':''}>${this.host.icon('sound')} Écouter l’accordage</button>${this.custom?'<button type="button" class="text-button" data-setup-action="edit">Modifier l’accordage</button>':''}</figure>`}`}
 <footer class="setup-bottom"><div class="setup-status" role="status" aria-live="polite">${this.step===1?'Toutes les activités disponibles sont accessibles.':this.message?esc(this.message):alteredRoot?'Cet accordage : cordes à vide seulement dans le pilote actuel.':this.custom?'Les chiffres indiquent l’octave : E2 est plus grave que E3.':'Votre instrument et son accordage restent modifiables dans les paramètres.'}</div><div class="setup-navigation">${this.step===2?`<button type="button" class="button secondary" data-setup-action="back">${this.editing?'Accordages':'Précédent'}</button>`:'<span class="setup-promise">Choisissez librement votre instrument.</span>'}<button class="button primary" type="submit">${this.step===1?'Continuer':'C’est parti'} ${this.host.icon('arrow')}</button></div></footer></form></main>`;
 }
 layout(){
  const root=document.querySelector('.setup-wizard');if(!root)return;
  const compact=window.innerWidth<500&&window.innerHeight<450;
  if(compact!==!!this.compactMode){this.compactMode=compact;this.capacity=compact?1:8;this.page=0;this.emit();return;}
  const tuner=root.querySelector('.tuner-strings'),rows=root.querySelector('.tuning-rows');
  if(!tuner||!rows)return;
  const available=tuner.clientHeight;
  const capacity=this.compactMode?1:Math.max(1,Math.min(this.instrument.strings,Math.floor(available/46)));
  if(capacity!==this.capacity){const first=this.pages[this.page]?.[0]??this.instrument.strings-1;this.capacity=capacity;this.page=Math.floor((this.instrument.strings-1-first)/capacity);this.emit();}
 }
}
