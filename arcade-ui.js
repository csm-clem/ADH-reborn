import { ARCADE_MODES, arcadeZoneWindow, arcadeScope, arcadeDuration, arcadeTarget, newArcadeRun, resolveArcade } from './arcade-rules.js';
import { wheelChoices } from './answer-wheel.js';
import { noteName, notationFor, scrollingNeckGeometry } from './core.js';
import { miniatureNeck, layoutMiniature } from './neck-view.js';
import { ActiveClock } from './clock.js';
import { responseTimeMap } from './progress.js';

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = {
  'zones-natural': 'Zones · Notes naturelles', 'zones-chromatic': 'Zones · Notes chromatiques',
  'strings-natural': 'Cordes · Notes naturelles', 'strings-chromatic': 'Cordes · Notes chromatiques',
};
const seconds = n => n === null ? '—' : `${(n / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 3 })} s`;

export class ArcadeController {
  constructor(host, { now = () => performance.now(), random = Math.random } = {}) {
    this.host = host; this.random = random; this.clock = new ActiveClock(now);
    this.run = null; this.phase = 'menu'; this.serial = 0; this.frame = 0; this.paused = false;
  }
  get state() { return this.host.getState(); }
  get profile() { return this.state.profile; }
  get notation() { return notationFor(this.state); }
  get duration() { return arcadeDuration(this.run?.questions || 0); }
  get playing() { return !!this.run && this.phase !== 'result' && this.phase !== 'menu'; }
  get records() { return this.host.getData().arcade?.records || {}; }
  show() { this.host.render(); }
  open() { this.leave(); this.run = null; this.phase = 'menu'; this.show(); }
  start(mode) {
    if (!ARCADE_MODES.includes(mode)) return;
    this.leave(); this.run = newArcadeRun(mode); this.record = false; this.details = false; this.popup = null;
    this.phase = 'ready'; this.clock.reset(); this.show(); this.schedule();
  }
  next() {
    this.serial++; this.target = arcadeTarget(this.profile, this.run.mode, this.run.stage, this.run.questions, this.target, this.random);
    this.phase = 'transition'; this.clock.reset(); this.show();
    // Rendering, layout and the entrance transition are part of the new question's time.
  }
  schedule() {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => { this.tick(); if (this.playing) this.schedule(); });
  }
  tick() {
    if (!this.playing || this.paused) return;
    const elapsed = this.clock.elapsed();
    if (this.phase === 'ready') { if (elapsed >= 1000) this.next(); return; }
    if (this.phase === 'correction') {
      if (elapsed >= 600) { if (this.run.finished) this.finish(); else this.next(); }
      return;
    }
    if (elapsed >= this.duration) { this.answer(null, this.serial); return; }
    if (this.phase === 'transition' && elapsed >= 80) this.phase = 'question';
    const fraction = Math.max(0, 1 - elapsed / this.duration);
    const bar = this.host.root.querySelector('[data-arcade-fill]');
    if (bar) bar.style.transform = `scaleX(${fraction})`;
    const meter = this.host.root.querySelector('[data-arcade-timer]');
    if (meter) { meter.setAttribute('aria-valuenow', String(Math.round(fraction * 100))); meter.dataset.urgent = String(fraction < .25); }
    // Keep response buttons stable; only their availability changes after the transition.
    if (this.phase === 'question') for (const b of this.host.root.querySelectorAll('[data-arcade-answer]')) b.disabled = false;
  }
  answer(value, serial) {
    if (!this.playing || this.paused || Number(serial) !== this.serial || !['question','transition'].includes(this.phase)) return;
    const ms = this.clock.elapsed();
    const timeout = ms >= this.duration;
    if (!timeout && (value === null || this.phase !== 'question')) return;
    const correct = !timeout && Number(value) === this.target.midi % 12;
    const outcome = timeout ? 'timeout' : correct ? 'correct' : 'wrong';
    // Lock this question synchronously before updating counters or rendering another one.
    this.phase = 'resolved';
    const bonus = resolveArcade(this.run, this.target, outcome, Math.min(ms, this.duration));
    if (correct) this.host.playNote(this.target.midi);
    if (bonus.points) {
      this.popup = { id: this.serial, points: bonus.points, lives: bonus.lives };
      this.host.playBonus(bonus.lives);
    }
    if (correct) this.next();
    else {
      this.feedback = timeout ? 'Temps écoulé' : 'Réponse incorrecte';
      this.phase = 'correction'; this.clock.reset(); this.show();
    }
  }
  finish() {
    this.phase = 'result'; cancelAnimationFrame(this.frame);
    this.run.at = Date.now();
    const old = this.records[this.run.mode];
    this.record = !old || this.run.score > old.score;
    if (this.record) {
      const data = this.host.getData();
      data.arcade ||= { version: 1, records: {} };
      data.arcade.records[this.run.mode] = structuredClone(this.run);
      this.host.save();
    }
    this.show();
  }
  pause() {
    if (!this.playing || this.paused) return;
    this.paused = true; this.clock.stop('pause'); this.host.stopAudio(); this.show();
    queueMicrotask(() => this.host.root.querySelector('[data-arcade-action="resume"]')?.focus());
  }
  resume() {
    if (!this.playing || !this.paused) return;
    this.paused = false; this.clock.resume('pause'); this.show();
  }
  leave() { cancelAnimationFrame(this.frame);cancelAnimationFrame(this.scrollFrame); this.phase = 'menu'; this.paused = false; this.serial++; }
  bind(root) {
    root.addEventListener('click', e => {
      const button = e.target.closest('[data-arcade-action],[data-arcade-answer]');
      if (!button) return; e.preventDefault();
      if (button.hasAttribute('data-arcade-answer')) { this.answer(Number(button.dataset.arcadeAnswer), button.dataset.question); return; }
      switch (button.dataset.arcadeAction) {
        case 'start': this.start(button.dataset.mode); break;
        case 'menu': this.open(); break;
        case 'home': this.leave(); this.host.home(); break;
        case 'pause': this.pause(); break;
        case 'resume': this.resume(); break;
        case 'replay': this.start(this.run.mode); break;
        case 'details': this.details = !this.details; this.show(); break;
        case 'mute': this.host.mute(); this.show(); break;
        case 'fullscreen': this.host.fullscreen(); break;
      }
    });
    root.addEventListener('keydown', e => {
      if (!this.host.active()) return;
      if (e.key === 'Escape' && this.playing) { e.preventDefault(); this.paused ? this.resume() : this.pause(); }
      if (e.key === 'Tab' && this.paused) {
        const buttons = [...root.querySelectorAll('.arcade-pause button')];
        if (e.shiftKey && document.activeElement === buttons[0]) { e.preventDefault(); buttons.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === buttons.at(-1)) { e.preventDefault(); buttons[0].focus(); }
      }
    });
  }
  menu() {
    return `<div class="page-heading"><div><h1>Arcade</h1><p>Un manche, trois vies. Jusqu’où irez-vous ?</p></div></div><p>Choisissez le nom de la note indiquée. Chaque bonne réponse vaut 100 points ; les séries sans erreur rapportent des bonus et des vies. Une erreur ou un temps écoulé retire une vie et remet la série à zéro.</p><div class="arcade-modes">${ARCADE_MODES.map(mode => `<section class="panel"><h2>${labels[mode]}</h2><p>${mode.startsWith('zones') ? 'Deux cordes en zone I, puis toutes les cordes et les six zones cumulées.' : 'Une corde grave jusqu’à la case 12, puis les autres cordes et enfin les 24 cases.'}</p><p>${mode.endsWith('chromatic') ? 'Naturelles et altérées dès le départ.' : 'Notes naturelles uniquement.'}</p><p>Record : <strong>${this.records[mode]?.score?.toLocaleString('fr-FR') || '—'}</strong></p><button class="button primary" data-arcade-action="start" data-mode="${mode}">Jouer</button></section>`).join('')}</div>`;
  }
  render() {
    if (this.phase === 'result') return this.result();
    if (this.phase === 'ready') return `<main id="main-content" tabindex="-1" class="launch-screen arcade-ready ${this.paused?'is-paused':''}" aria-label="Préparation de l’Arcade"><header class="launch-tools"><button class="icon-button on-dark" data-arcade-action="menu" aria-label="Retour à Arcade">${this.host.icon('back')}</button><span></span><button class="icon-button on-dark" data-arcade-action="${this.paused?'resume':'pause'}" aria-label="${this.paused?'Reprendre':'Pause'}">${this.host.icon('pause')}</button><button class="icon-button on-dark" data-arcade-action="mute" aria-label="${this.state.sound?'Couper':'Activer'} le son">${this.host.icon(this.state.sound?'sound':'mute')}</button></header><p class="launch-message" role="status" style="animation-delay:-${Math.min(1000,this.clock.elapsed())}ms;animation-play-state:${this.paused?'paused':'running'}">À vous de jouer !</p>${this.paused?'<div class="pilot-pause-layer"><section class="pause-card"><h2>Pause</h2><button class="button primary" data-arcade-action="resume">Reprendre</button><button class="button secondary" data-arcade-action="menu">Retour à Arcade</button></section></div>':''}</main>`;
    const r = this.run, scope = arcadeScope(r.mode, this.profile.tuning.length, r.stage);
    const correcting = this.phase === 'correction';
    const rings = [[0,2,4,5,7,9,11], ...(scope.chromatic ? [[1,3,6,8,10]] : [])];
    const controls = `<button class="icon-button" data-arcade-action="mute" aria-label="${this.state.sound?'Couper':'Activer'} le son" aria-pressed="${!this.state.sound}">${this.host.icon(this.state.sound?'sound':'mute')}</button><button class="icon-button" data-arcade-action="fullscreen" aria-label="Plein écran">${this.host.icon('fullscreen')}</button><button class="icon-button" data-arcade-action="pause" aria-label="Pause">${this.host.icon('pause')}</button>`;
    // A single complete neck stays mounted; only its viewport scrolls between questions.
    const height=globalThis.innerWidth>globalThis.innerHeight&&globalThis.innerHeight<=550?70:Math.min(180,Math.max(85,(globalThis.innerHeight||844)*.19));
    const minFretWidth=40;
    const neck = miniatureNeck(this.profile, { height,minFretWidth,realistic:true,id: 'arcade-neck', points: [{...this.target, color: correcting?'var(--note-correct)':'var(--brand)'}], startFret: 0, lastFret: 24, scrollable: true, scrollFrame: false, label: 'Note à nommer', showNames: correcting, notation: this.notation });
    return `<main id="main-content" tabindex="-1" class="arcade-game"><header class="game-header"><button class="icon-button" data-arcade-action="menu" aria-label="Retour à Arcade">${this.host.icon('back')}</button><strong>${labels[r.mode]}</strong><div class="arcade-tools">${controls}</div></header><div class="arcade-hud"><div><strong>${r.correct}</strong><span> bonnes réponses</span></div><div><strong>${r.score.toLocaleString('fr-FR')}</strong> points</div><div aria-label="${r.lives} vies">${r.lives <= 5 ? '♥'.repeat(r.lives) : `♥ × ${r.lives}`}</div><div>Série <strong>${r.streak}</strong></div></div><div data-arcade-timer class="arcade-timer" role="progressbar" aria-label="Temps restant" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><div data-arcade-fill data-animation-owned style="transform:scaleX(1)"></div></div><p class="arcade-scope">Palier ${r.stage + 1} · ${scope.zoneCount ? `Zones I${scope.zoneCount > 1 ? ' à '+['I','II','III','IV','V','VI'][scope.zoneCount-1] : ''}` : `Cases 0–${scope.end}`} · ${scope.strings.length} corde${scope.strings.length>1?'s':''}</p><div class="arcade-playfield ${this.paused?'is-paused':''}" ${this.paused?'inert':''}><div class="arcade-neck-frame"><div class="arcade-neck" data-view-key="arcade-neck" data-layout-owned>${neck}</div><span class="arcade-neck-fade" aria-hidden="true"></span></div><p class="arcade-feedback" role="status">${correcting ? `${this.feedback} · ${esc(noteName(this.target.midi, this.notation))}` : 'Quelle est cette note ?'}</p><div class="arcade-response"><div class="answer-wheel ${scope.chromatic?'dual-wheel':''}" role="group" aria-label="Choisir le nom de la note"><div class="wheel-orbit" aria-hidden="true"></div>${scope.chromatic?'<div class="wheel-orbit outer" aria-hidden="true"></div>':''}${wheelChoices(rings, {dual: scope.chromatic}).map(({n,x,y}) => `<button data-arcade-answer="${n}" data-note="${n}" data-question="${this.serial}" style="left:${x}%;top:${y}%" ${correcting||this.paused||this.phase==='transition'?'disabled':''}>${esc(noteName(n,this.notation))}</button>`).join('')}</div></div></div>${this.popup && !this.paused ? `<div data-view-key="bonus-${this.popup.id}" class="arcade-bonus" role="status"><strong>+${this.popup.points.toLocaleString('fr-FR')}</strong>${this.popup.lives ? `<span>+${this.popup.lives} UP</span>` : '<span>COMBO !</span>'}</div>` : ''}${this.paused ? `<div class="arcade-pause" role="dialog" aria-modal="true" aria-label="Partie en pause"><div class="panel"><h1>Pause</h1><button class="button primary" data-arcade-action="resume">Reprendre</button><button class="button secondary" data-arcade-action="mute">${this.state.sound?'Couper':'Activer'} le son</button><button class="button quiet-button" data-arcade-action="menu">Quitter la partie</button></div></div>` : ''}</main>`;
  }
  layout() {
    const viewport=this.host.root.querySelector('.arcade-neck');
    if(!viewport||!this.target)return;
    const svg=viewport.querySelector('svg');layoutMiniature(svg,this.profile);
    const point=svg.querySelector('.neck-point');if(!point)return;
    const edges=()=>{viewport.parentElement.dataset.atStart=String(viewport.scrollLeft<=1);viewport.parentElement.dataset.atEnd=String(viewport.scrollLeft+viewport.clientWidth>=viewport.scrollWidth-1);};edges();
    const zone=arcadeZoneWindow(this.target.fret,this.neckViewport===viewport?this.neckZone?.split(':').map(Number):null),zoneKey=zone.join(':'),frame=viewport.getBoundingClientRect();
    if(this.neckViewport===viewport&&this.neckZone===zoneKey&&this.neckWidth===frame.width)return;
    this.neckZone=zoneKey;this.neckWidth=frame.width;
    const {centers,frets}=this.neckGeometryFor(svg);
    const left=Math.max(0,Math.min(viewport.scrollWidth-viewport.clientWidth,(centers[zone[0]]+frets[zone[1]])/2-frame.width/2));
    const animate=this.neckViewport===viewport&&this.neckSerial!==this.serial&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.neckViewport=viewport;this.neckSerial=this.serial;
    if(Math.abs(viewport.scrollLeft-left)<1)return;
    if(this.neckAnimation){this.neckAnimation.cancel();this.neckAnimation=null;}
    if(animate){
      const from=viewport.scrollLeft,started=performance.now();
      const move=()=>{const t=Math.min(1,(performance.now()-started)/80),e=t*t*(3-2*t);viewport.scrollLeft=from+(left-from)*e;edges();if(t<1)this.scrollFrame=requestAnimationFrame(move);};
      cancelAnimationFrame(this.scrollFrame);this.scrollFrame=requestAnimationFrame(move);
    }else{viewport.scrollLeft=left;edges();}
  }
  neckGeometryFor(svg){return scrollingNeckGeometry(this.profile.tuning.length,24,{height:Number(svg.dataset.neckHeight),realistic:true});}
  result() {
    const r = this.run;
    const detail = `<section id="arcade-statistics" class="panel"><h2>Statistiques avancées</h2><dl class="arcade-stats"><div><dt>Précision</dt><dd>${r.correct} / ${r.questions} (${Math.round(r.correct/r.questions*100)} %)</dd></div><div><dt>Erreurs</dt><dd>${r.errors}</dd></div><div><dt>Temps écoulés</dt><dd>${r.timeouts}</dd></div><div><dt>Temps minimum</dt><dd>${seconds(r.timeMin)}</dd></div><div><dt>Temps maximum</dt><dd>${seconds(r.timeMax)}</dd></div><div><dt>Temps moyen</dt><dd>${seconds(r.correct ? r.timeSum/r.correct : null)}</dd></div><div><dt>Points des réponses</dt><dd>${r.correct*100}</dd></div><div><dt>Bonus de combo</dt><dd>${r.bonusPoints}</dd></div><div><dt>Vies gagnées</dt><dd>${r.earnedLives}</dd></div><div><dt>Palier atteint</dt><dd>${r.stage+1}</dd></div></dl>${responseTimeMap(this.profile,r.positions,this.notation,{meanMs:r.correct?r.timeSum/r.correct:null})}</section>`;
    return `<main id="main-content" tabindex="-1" class="arcade-results"><section class="panel"><p>Partie terminée · ${labels[r.mode]}</p><h1>${r.score.toLocaleString('fr-FR')} <small>points</small></h1>${this.record?'<p class="arcade-record">Nouveau record personnel !</p>':''}<dl class="arcade-stats"><div><dt>Bonnes réponses</dt><dd>${r.correct}</dd></div><div><dt>Combos</dt><dd>${r.combos}</dd></div><div><dt>Note${r.longest===1?'':'s'} d’affilée (record)</dt><dd>${r.longest}</dd></div></dl>${this.host.storageError()?'<p role="alert">Sauvegarde indisponible : ce record n’a pas pu être enregistré.</p>':''}<div class="button-row"><button class="button primary" data-arcade-action="replay">Rejouer</button><button class="button secondary" data-arcade-action="details" aria-expanded="${!!this.details}" aria-controls="arcade-statistics">${this.details?'Masquer':'Voir'} les statistiques</button><button class="button quiet-button" data-arcade-action="menu">Retour à Arcade</button></div></section>${this.details?detail:''}</main>`;
  }
}
