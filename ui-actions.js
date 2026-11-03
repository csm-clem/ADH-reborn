const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/** Labels and action names are text; body is trusted component markup. */
export function actionButton({action,attribute='data-action',label,body,variant='quiet-button',iconOnly=false,classes='',disabled=false,pressed}){
 if(!/^data-[a-z-]+$/.test(attribute))throw new TypeError('Invalid action attribute');
 return `<button class="${iconOnly?'icon-button':`button ${variant}`} ${classes}" ${attribute}="${esc(action)}"${label?` aria-label="${esc(label)}"`:''}${pressed===undefined?'':` aria-pressed="${!!pressed}"`}${disabled?' disabled':''}>${body}</button>`;
}
/** A single dispatch contract, with adapters for mode-specific state machines. */
export function dispatchGameControl(action,{actions,paused=false,introduction=false,handlers}){
 const key=Object.keys(actions).find(k=>actions[k]===action);if(!key)return false;
 if((paused&&key==='replay')||(introduction&&['replay','pause','resume'].includes(key)))return true;
 handlers[key]?.();return true;
}
export function focusGameControl(root,attribute,action){
 const buttons=[...(root?.querySelectorAll?.(`[${attribute}="${action}"]`)||[])];
 buttons.find(b=>!b.closest('[inert]')&&b.getClientRects().length)?.focus({preventScroll:true});
}
/** Escape and focus containment obey one contract in both game modes. */
export function gameKeyboard(event,{root,active,paused,pause,resume}){
 if(!active||event.defaultPrevented)return false;
 if(event.key==='Escape'){
  if(event.target?.closest?.('input,textarea,select')||root?.ownerDocument?.querySelector('dialog[open]'))return false;
  event.preventDefault();(paused?resume:pause)();return true;
 }
 if(event.key==='Tab'&&paused){
  const items=[...(root?.querySelectorAll('.game-header button,.launch-tools button,.pause-card button,.arcade-pause button')||[])].filter(b=>!b.disabled&&!b.closest('[inert]')&&b.getClientRects().length);
  if(!items.length)return false;
  const current=items.indexOf(root.ownerDocument.activeElement);
  if(event.shiftKey&&current<=0){event.preventDefault();items.at(-1).focus();return true;}
  if(!event.shiftKey&&(current===-1||current===items.length-1)){event.preventDefault();items[0].focus();return true;}
 }
 return false;
}
/** Focus rings follow keyboard navigation consistently, including in the gallery. */
export function bindInputModality(doc=globalThis.document){
 doc.documentElement.dataset.keyboard='false';
 const keyboard=e=>{if(e.key==='Tab')doc.documentElement.dataset.keyboard='true';};
 const pointer=()=>doc.documentElement.dataset.keyboard='false';
 doc.addEventListener('keydown',keyboard,true);doc.addEventListener('pointerdown',pointer,true);
 return ()=>{doc.removeEventListener('keydown',keyboard,true);doc.removeEventListener('pointerdown',pointer,true);};
}
