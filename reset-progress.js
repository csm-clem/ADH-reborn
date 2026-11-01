import { validatePilotStore } from './pilot.js';
import { INSTRUMENTS } from './core.js';

/** Scope deletion to one instrument, including its alternative tunings and records. */
export function resetInstrumentProgress(store, instrumentId) {
  if (!INSTRUMENTS.some(i => i.id === instrumentId)) throw new Error('Instrument inconnu.');
  const next = validatePilotStore(structuredClone(store));
  for (const [key, data] of Object.entries(next.profiles)) if (data.profile.instrumentId === instrumentId) delete next.profiles[key];
  next.achievements = next.achievements.filter(a => !a.profileKey.startsWith(instrumentId + ':'));
  return next;
}

/** This dialog never clears data before an explicit, informed confirmation. */
export function showResetInstrumentDialog({label, confirm, done}) {
  const dialog = document.createElement('dialog');
  dialog.className = 'guide-dialog reset-progress-dialog';
  dialog.setAttribute('aria-labelledby','reset-progress-title');
  dialog.innerHTML = '<h2 id="reset-progress-title">Réinitialiser cet instrument ?</h2><p class="reset-target"></p><p>Cette action efface définitivement toute sa progression : cours, exercices, historiques, succès et records Arcade, pour tous ses accordages sur cet appareil. Elle est irréversible dans l’application. Les autres instruments et vos réglages sont conservés.</p><p>Vous pouvez annuler et exporter une sauvegarde avant de continuer.</p><label><input type="checkbox" data-reset-ack> Je comprends que cette suppression est irréversible.</label><p role="alert" class="reset-error"></p><div class="guide-navigation"><button class="button secondary" data-reset-cancel>Annuler</button><button class="button primary" data-reset-confirm disabled>Effacer cette progression</button></div>';
  dialog.querySelector('.reset-target').textContent = label + ' · tous les accordages';
  const close = () => { dialog.close(); dialog.remove(); };
  dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });
  dialog.querySelector('[data-reset-cancel]').addEventListener('click',close);
  const checkbox = dialog.querySelector('[data-reset-ack]'), button = dialog.querySelector('[data-reset-confirm]');
  checkbox.addEventListener('change',()=>{ button.disabled=!checkbox.checked; });
  button.addEventListener('click',()=>{
    if (!checkbox.checked || button.disabled) return;
    try { button.disabled=true; confirm(); close(); done(); }
    catch (error) { dialog.querySelector('.reset-error').textContent=error.message||'La suppression a échoué. Vos données sont conservées.'; button.disabled=false; }
  });
  document.body.append(dialog); dialog.showModal(); dialog.querySelector('[data-reset-cancel]').focus();
  return dialog;
}
