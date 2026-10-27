import { noteName, pitchLabel } from "./core.js";
import { resultMetrics } from "./results.js";
const esc = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function positionProgress(events, string, fret, aggregate = null) {
  const first = events.filter(
      (e) => !e.retry && e.target.string === string && e.target.fret === fret,
    ),
    metrics = resultMetrics(first);
  const part = (mode) =>
    aggregate
      ? { ...aggregate[mode] }
      : resultMetrics(first.filter((e) => e.mode === mode));
  const name = part("name"),
    find = part("find"),
    total = aggregate ? name.total + find.total : metrics.total,
    correct = aggregate ? name.correct + find.correct : metrics.correct;
  const accuracy = total ? correct / total : null;
  return {
    accuracy,
    total,
    status: !total ? "new" : accuracy === 1 && name.correct >= 3 && find.correct >= 3 ? "perfect" : accuracy > 0.85 ? "worked" : "review",
    name,
    find,
  };
}
export function progressView(
  profile,
  natural,
  attempts,
  notation = "international",
  {
    zone = { start: 0, end: 24 },
    strings = profile.tuning.map((_, s) => s),
    evidence = null,
    summaryHTML = "",
  } = {},
) {
  const frets = Array.from(
      { length: zone.end - zone.start + 1 },
      (_, i) => zone.start + i,
    ),
    raw = attempts.flatMap((a) => a.events),
    processed = new Set(evidence?.processed || []);
  const pending = attempts
    .filter((a) => !processed.has(a.id))
    .flatMap((a) => a.events);
  const cumulative = (string, fret) => {
    if (!evidence?.stats) return null;
    const base = structuredClone(
      evidence.stats[`${string}:${fret}`] || {
        name: { total: 0, correct: 0 },
        find: { total: 0, correct: 0 },
      },
    );
    for (const e of pending)
      if (!e.retry && e.target.string === string && e.target.fret === fret) {
        base[e.mode].total++;
        base[e.mode].correct += Number(e.correct);
      }
    return base;
  };
  const cells = strings
    .flatMap((string) =>
      frets.map((fret) => ({
        string,
        fret,
        midi: profile.tuning[string] + fret,
      })),
    )
    .map((p) => ({
      ...p,
      ...positionProgress(raw, p.string, p.fret, cumulative(p.string, p.fret)),
    }));
  const counts = { new: 0, worked: 0, review: 0, perfect: 0 };
  cells.forEach((p) => counts[p.status]++);
  const label = {
      new: "À découvrir",
      perfect: "Parfait",
      worked: "Travaillée",
      review: "À revoir",
    },
    symbol = { new: "·", worked: "✓", review: "!", perfect: '<span class="double-check">✓✓</span>' };
  const totals = (mode) =>
    cells.reduce(
      (m, p) => ({
        total: m.total + p[mode].total,
        correct: m.correct + p[mode].correct,
      }),
      { total: 0, correct: 0 },
    );
  return `<div class="page-heading"><div><h1>Votre manche,<br><em>vos repères.</em></h1><p>Toutes les cordes · à vide jusqu’à la case 24</p></div></div>${summaryHTML}<section class="panel progress-overview"><h2>Votre carte du manche</h2><div class="progress-counts">${["perfect", "worked", "review", "new"].map((status) => `<div class="progress-count ${status}"><strong>${counts[status]}</strong><span>${label[status]}${status === "worked" ? "s" : ""}</span></div>`).join("")}</div><div class="progress-track">${["perfect", "worked", "review", "new"].map((s) => `<i class="${s}" style="width:${(counts[s] / cells.length) * 100}%"></i>`).join("")}</div><p class="progress-instruction">Touchez une note pour voir vos résultats. Faites glisser pour explorer le manche →</p><div class="progress-map-frame"><div class="progress-map" role="region" aria-label="Carte du manche, défilement horizontal" tabindex="0"><table><caption class="visually-hidden">Toutes les notes, corde 1 en haut, à vide jusqu’à la case 24.</caption><thead><tr><th scope="col">Corde</th>${frets.map((f) => `<th scope="col">${f || "À vide"}</th>`).join("")}</tr></thead><tbody>${strings
    .slice()
    .reverse()
    .map(
      (string) =>
        `<tr><th scope="row"><span class="progress-string-label">${profile.tuning.length - string}</span></th>${frets
          .map((fret) => {
            const p = cells.find((p) => p.string === string && p.fret === fret);
            return `<td class="progress-fret-${fret}"><details name="progress-position" class="progress-cell ${p.status}" data-progress-string="${string}" data-progress-fret="${fret}"><summary aria-label="${esc(pitchLabel(p.midi, notation))}, corde ${profile.tuning.length - string}, ${fret ? "case " + fret : "à vide"} : ${label[p.status]}"><strong>${esc(noteName(p.midi, notation))}</strong><span>${p.accuracy === null ? symbol[p.status] : Math.round(p.accuracy * 100) + "% " + symbol[p.status]}</span></summary></details></td>`;
          })
          .join("")}</tr>`,
    )
    .join(
      "",
    )}</tbody></table></div><span class="progress-edge-fade" aria-hidden="true"></span></div><label class="visually-hidden" for="progress-scroll">Faire défiler le manche</label><input id="progress-scroll" class="progress-scrollbar" type="range" min="0" max="1000" step="1" value="0" aria-label="Faire défiler le manche de l’à-vide à la case 24"><div class="progress-selection" role="status" aria-live="polite">Choisissez une note sur la carte.</div><script type="application/json" class="progress-cell-data">${JSON.stringify(cells.map((p) => ({ ...p, label: pitchLabel(p.midi, notation) }))).replace(/</g, "\\u003c")}</script><div class="progress-key">${["perfect", "worked", "review", "new"].map((s) => `<span class="${s}"><b aria-hidden="true">${symbol[s]}</b> ${label[s]}</span>`).join("")}</div><p class="progress-footnote">Travaillée : plus de 85 % de bonnes réponses. Parfait : 100 %, avec au moins 3 réponses dans chaque sens à cet emplacement. Ce repère ne remplace pas la validation d’un chapitre.</p></section><section class="progress-skills">${[
    ["name", "Nommer les notes"],
    ["find", "Retrouver les positions"],
  ]
    .map(([mode, title]) => {
      const m = totals(mode);
      return `<article class="panel"><h2>${title}</h2><strong>${m.total ? Math.round((m.correct / m.total) * 100) + " %" : "—"}</strong><p>${m.total ? `${m.correct} bonnes réponses sur ${m.total}` : "Votre progression apparaîtra ici."}</p></article>`;
    })
    .join("")}</section>`;
}
export function scrollbarThumb(trackWidth,viewportWidth,contentWidth){
  return Math.min(trackWidth,Math.max(24,trackWidth*viewportWidth/Math.max(1,contentWidth)));
}
/** Details live outside the scroll viewport, so the selected note never opens a clipped popover. */
export function bindProgress(root) {
  root.addEventListener('keydown',e=>{
    const summary=e.target.closest('.progress-cell>summary');if(!summary||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
    const cell=summary.parentElement,map=cell.closest('.progress-map'),s=Number(cell.dataset.progressString),f=Number(cell.dataset.progressFret),cells=[...map.querySelectorAll('.progress-cell')];
    const row=cells.filter(c=>Number(c.dataset.progressString)===s).sort((a,b)=>Number(a.dataset.progressFret)-Number(b.dataset.progressFret));
    const next=e.key==='Home'?row[0]:e.key==='End'?row.at(-1):cells.find(c=>Number(c.dataset.progressString)===s+(e.key==='ArrowUp'?1:e.key==='ArrowDown'?-1:0)&&Number(c.dataset.progressFret)===f+(e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0));
    e.preventDefault();next?.querySelector('summary')?.focus({preventScroll:true});next?.scrollIntoView({block:'nearest',inline:'nearest'});
  });
  // Desktop grab-to-scroll: a click still opens a note; only a deliberate drag
  // captures the pointer. Touch keeps native scrolling and the slider is retained.
  let drag=null,suppressClick=null;
  const release=()=>{
    if(!drag)return;
    const {map,id,claimed}=drag;drag=null;
    if(claimed)suppressClick={map,until:performance.now()+300};
    map.classList.remove('is-grabbing');
    if(map.hasPointerCapture(id))map.releasePointerCapture(id);
  };
  root.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse'||e.button!==0||!e.isPrimary)return;
    const map=e.target.closest('.progress-map');
    if(!map||map.scrollWidth<=map.clientWidth)return;
    release();suppressClick=null;
    drag={map,id:e.pointerId,x:e.clientX,y:e.clientY,left:map.scrollLeft,claimed:false};
  });
  root.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.claimed){
      if(Math.abs(dy)>6&&Math.abs(dy)>Math.abs(dx)){release();return;}
      if(Math.abs(dx)<6)return;
      drag.claimed=true;drag.map.setPointerCapture(e.pointerId);drag.map.classList.add('is-grabbing');
    }
    e.preventDefault();drag.map.scrollLeft=drag.left-dx;
  });
  root.addEventListener('click',e=>{
    if(suppressClick&&performance.now()<suppressClick.until&&suppressClick.map.contains(e.target)){
      e.preventDefault();e.stopImmediatePropagation();
    }
    suppressClick=null;
  },true);
  root.addEventListener('pointerup',release);
  root.addEventListener('pointercancel',release);
  root.addEventListener('lostpointercapture',release);
  window.addEventListener('pointerup',release);
  window.addEventListener('blur',release);
  root.addEventListener(
    "toggle",
    (e) => {
      const cell = e.target;
      if (!cell.matches?.(".progress-cell[open]")) return;
      const panel = cell.closest(".progress-overview"),
        data = JSON.parse(
          panel.querySelector(".progress-cell-data").textContent,
        ),
        p = data.find(
          (p) =>
            p.string === Number(cell.dataset.progressString) &&
            p.fret === Number(cell.dataset.progressFret),
        );
      if (!p) return;
      panel.querySelector(".progress-selection").innerHTML =
        `<strong>${esc(p.label)} · corde ${data.reduce((n, p) => Math.max(n, p.string + 1), 0) - p.string} · ${p.fret ? "case " + p.fret : "à vide"}</strong><span>Nommer : ${p.name.total ? p.name.correct + "/" + p.name.total : "pas encore essayé"}</span><span>Retrouver : ${p.find.total ? p.find.correct + "/" + p.find.total : "pas encore essayé"}</span>`;
    },
    true,
  );
  const sync = (el) => {
    if (!el.matches?.(".progress-map")) return;
    el.closest(".progress-map-frame").classList.toggle(
      "is-at-end",
      el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    );
    const bar = el
      .closest(".progress-overview")
      .querySelector(".progress-scrollbar");
    if (bar) {
      bar.style.setProperty('--scroll-thumb', `${scrollbarThumb(bar.clientWidth,el.clientWidth,el.scrollWidth)}px`);
      bar.disabled=el.scrollWidth<=el.clientWidth;
      bar.value = String(
        Math.round(
          (el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth)) * 1000,
        ),
      );
    }
  };
  root.addEventListener("input", (e) => {
    if (!e.target.matches?.(".progress-scrollbar")) return;
    const map = e.target
      .closest(".progress-overview")
      .querySelector(".progress-map");
    map.scrollLeft =
      (Number(e.target.value) / 1000) * (map.scrollWidth - map.clientWidth);
  });
  root.addEventListener("scroll", (e) => sync(e.target), true);
  // The app binds once, then swaps pages. Follow the mounted map and actual size.
  let current=null;
  const resize=new ResizeObserver(()=>{if(current)sync(current);});
  const mount=()=>{
    const map=root.querySelector('.progress-map');
    if(map===current)return;
    release();resize.disconnect();current=map;
    if(map){resize.observe(map);resize.observe(map.querySelector('table'));sync(map);}
  };
  new MutationObserver(mount).observe(root,{childList:true,subtree:true});mount();
}
