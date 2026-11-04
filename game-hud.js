import {actionButton} from './ui-actions.js';
/** Shared in-game HUD. Mode-specific actions are supplied, appearance is shared. */
export function gameHud({icon,attribute,back,title,subtitle='',muted=false,paused=false,actions,extra='',status='',timer=false}){
 const fullscreen=!!globalThis.document?.fullscreenElement;
 const button=(action,label,glyph,classes='',pressed)=>action==null?'':actionButton({action,attribute,label,body:icon(glyph),iconOnly:true,classes,pressed});
 return `<header class="game-header shared-game-hud">${button(actions.back,back,'back')}<div class="hud-heading"><strong>${title}</strong>${subtitle?`<small>${subtitle}</small>`:''}</div><div class="hud-tools">${button(actions.mute,muted?'Activer le son':'Couper le son',muted?'mute':'sound','sound-toggle',muted)}${button('game-settings','Réglages','gear')}${button(paused?actions.resume:actions.pause,paused?'Continuer':'Pause','pause')}</div></header>${status}${timer?'<div data-arcade-timer class="arcade-timer" role="progressbar" aria-label="Temps restant" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><div data-arcade-fill data-animation-owned style="transform:scaleX(1)"></div></div>':''}`;
}
