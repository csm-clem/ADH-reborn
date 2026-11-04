/** Approved launch: one active-time timeline shared by Arcade and Parcours. */
export const LAUNCH_DURATION = 2350;
const clamp = x => Math.max(0, Math.min(1, x));
const easeOut = x => 1 - (1 - clamp(x)) ** 3;
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export function launchFrame(ms, reduced = false) {
  const leave = easeOut(ms / 300), arrival = easeOut((ms - 150) / 150), exit = smooth((ms - 1900) / 450);
  return {
    previousOpacity: 1 - smooth(ms / 300),
    previousScale: reduced ? 1 : 1 + leave * .65,
    rotation: reduced ? 0 : -5 * leave,
    warp: reduced ? 0 : leave * 120,
    blur: reduced ? 0 : leave * 1.2,
    panelOpacity: easeOut(ms / 300) * (reduced ? 1 - exit : 1),
    panelY: reduced ? 0 : exit * 100,
    titleScale: reduced ? 1 : ms < 300 ? .7 + .15 * arrival : .85 + .4 * clamp((ms - 300) / 1600),
    titleOpacity: (reduced ? 1 : arrival) * (1 - smooth((ms - 1100) / 1100)),
  };
}
// Snapshot only the previous page's appearance, never its controls or DOM identities.
export function captureLaunchPage(root) {
  if (!root?.cloneNode) return '';
  const copy = root.cloneNode(true), ids = new Map();
  copy.querySelectorAll('[id]').forEach(n => { const old = n.id; n.id = `launch-old-${old}`; ids.set(old, n.id); });
  copy.querySelectorAll('*').forEach(n => {
    for (const a of [...n.attributes]) {
      if (a.name.startsWith('data-') || /^on/i.test(a.name) || ['tabindex','autofocus'].includes(a.name)) n.removeAttribute(a.name);
      else if (a.name !== 'id') n.setAttribute(a.name, a.value.replace(/url\(#([^)]*)\)/g, (m, id) => ids.has(id) ? `url(#${ids.get(id)})` : m));
    }
    // A frozen snapshot must not participate in real-game layout selectors.
    n.classList.remove('shared-neck');
  });
  return copy.innerHTML;
}
let radialMap;
function displacementMap() {
  if (radialMap) return radialMap;
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 192;
  const ctx = canvas.getContext('2d'), pixels = ctx.createImageData(192, 192);
  for (let y = 0; y < 192; y++) for (let x = 0; x < 192; x++) {
    const dx = (x - 95.5) / 95.5, dy = (y - 95.5) / 95.5, r = (dx * dx + dy * dy) / 2, i = (y * 192 + x) * 4;
    pixels.data[i] = 128 + dx * r * 100; pixels.data[i + 1] = 128 + dy * r * 100; pixels.data[i + 2] = 128; pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0); return radialMap = canvas.toDataURL();
}
export function launchMarkup({mode, previous, next, controls, pause = ''}) {
  return `<div class="launch-screen ${mode === 'arcade' ? 'arcade-ready' : 'pilot-count'} approved-launch" aria-label="Préparation ${mode === 'arcade' ? 'de l’Arcade' : 'de l’exercice'}"><div class="launch-next" inert aria-hidden="true">${next}</div><div class="launch-before" data-animation-owned inert aria-hidden="true">${previous}</div><div class="launch-panel" data-animation-owned aria-hidden="true"><p class="launch-message" data-animation-owned>À vous de jouer !</p></div><span class="sr-only" role="status">À vous de jouer !</span>${pause}<svg class="launch-filter" aria-hidden="true"><defs><filter id="launch-warp" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feImage result="map" preserveAspectRatio="none"/><feDisplacementMap in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" result="warped"/><feGaussianBlur in="warped" stdDeviation="0"/></filter></defs></svg></div>`;
}
export function paintLaunch(root, ms) {
  const scene = root?.querySelector?.('.approved-launch'); if (!scene) return;
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false, f = launchFrame(ms, reduced);
  const before = scene.querySelector('.launch-before'), panel = scene.querySelector('.launch-panel'), title = scene.querySelector('.launch-message');
  before.style.opacity = String(f.previousOpacity);
  before.style.transform = `scale(${f.previousScale}) perspective(900px) rotateY(${f.rotation}deg)`;
  before.style.filter = reduced ? 'none' : 'url(#launch-warp)';
  const map = scene.querySelector('feImage'); if (!map.hasAttribute('href') && !reduced) map.setAttribute('href', displacementMap());
  scene.querySelector('feDisplacementMap').setAttribute('scale', f.warp);
  scene.querySelector('feGaussianBlur').setAttribute('stdDeviation', f.blur);
  panel.style.opacity = String(f.panelOpacity); panel.style.transform = `translateY(${f.panelY}%)`;
  title.style.opacity = String(f.titleOpacity); title.style.transform = `scale(${f.titleScale})`;
}
