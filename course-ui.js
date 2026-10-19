import { instrumentDiagram } from "./instrument-diagram.js";
import { betaCourses, courseCompleted, coursePage } from "./beta-courses.js";
import { miniatureNeck, neckBase, layoutMiniature } from "./neck-view.js";
import { neckGeometry, noteName, pitchLabel, notationFor } from "./core.js";
import { INSTRUMENT_IMAGES } from "./instrument-art.js";
const esc = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

export class CourseController {
  constructor({ pilot, getState, render, home, playSequence, icon }) {
    Object.assign(this, {
      pilot,
      getState,
      renderApp: render,
      home,
      playSequence,
      icon,
    });
    this.active = null;
  }
  get profile() {
    return this.getState().profile;
  }
  get notation() {
    return notationFor(this.getState());
  }
  get courses() {
    const key = `${this.profile.key}:${JSON.stringify(this.notation)}`;
    if (this.cachedCoursesKey !== key) {
      this.cachedCourses = betaCourses(
        this.profile,
        this.pilot.catalog,
        this.notation,
      );
      this.cachedCoursesKey = key;
    }
    return this.cachedCourses;
  }
  get course() {
    return this.courses.get(this.active);
  }
  get record() {
    this.pilot.data.courses ||= {};
    return (this.pilot.data.courses[this.active] ||= {
      index: 0,
      visited: [],
      correct: [],
      completed: false,
    });
  }
  get page() {
    return this.course ? coursePage(this.course, this.record) : null;
  }
  open(id) {
    if (!this.courses.has(id)) return;
    this.pilot.leave();
    this.active = id;
    this.message = "";
    if (this.record.completed) {
      this.record.completed = courseCompleted(this.course, this.record);
      this.record.index = this.record.completed
        ? 0
        : Math.max(
            0,
            this.course.pages.findIndex((p) =>
              p.quiz
                ? !this.record.correct.includes(p.id)
                : !this.record.visited.includes(p.id),
            ),
          );
    }
    this.record.variants ||= {};
    this.record.index = Math.min(
      this.record.index,
      this.course.pages.length - 1,
    );
    this.renderApp();
    globalThis.document
      ?.querySelector(".course-page h1")
      ?.focus({ preventScroll: true });
  }
  save() {
    this.pilot.save();
  }
  close() {
    this.save();
    this.active = null;
    this.home();
  }
  bind(root) {
    root.addEventListener(
      "toggle",
      (e) => {
        if (e.target.matches?.(".course-position-options"))
          this.coordinatesOpen = e.target.open;
      },
      true,
    );
    root.addEventListener("click", (e) => {
      if (!this.active) return;
      const button = e.target.closest("[data-course-action]");
      if (!button) return;
      e.preventDefault();
      const action = button.dataset.courseAction;
      if (action === "skip" || action === "close") return this.close();
      if (action === "answer") return this.answer(button.dataset.value);
      if (action === "position")
        return this.answer({
          string: Number(button.dataset.string),
          fret: Number(button.dataset.fret),
        });
      if (action === "listen") {
        this.playSequence(this.page.listen || [], { step: 0.3 });
        return;
      }
      if (action === "back") {
        this.record.index = Math.max(0, this.record.index - 1);
        this.message = "";
        this.save();
        this.renderApp();
        return;
      }
      if (action === "next") this.next();
    });
    const tap = (e) => {
      if (!this.active || this.page?.quiz?.kind !== "position") return;
      const hit = e.target.closest("[data-lesson-string]");
      if (!hit) return;
      e.preventDefault();
      this.answer({
        string: Number(hit.dataset.lessonString),
        fret: Number(hit.dataset.lessonFret),
      });
    };
    root.addEventListener("pointerdown", tap);
    root.addEventListener("keydown", (e) => {
      if (["Enter", " "].includes(e.key)) tap(e);
    });
  }
  answer(value) {
    const page = this.page,
      q = page?.quiz;
    if (!q || this.record.correct.includes(page.id)) return;
    const correct =
      q.kind === "position"
        ? value?.string === q.target.string && value?.fret === q.target.fret
        : value === q.answer;
    this.message = correct
      ? "Bien repéré !"
      : "Regardez encore. Vous pouvez réessayer.";
    this.lastCorrect = correct;
    if (!correct) {
      this.record.variants ||= {};
      this.record.variants[page.id] = (this.record.variants[page.id] || 0) + 1;
      this.message = "Essayez sur ce nouvel exemple.";
      this.save();
    }
    if (correct) {
      this.record.correct = [...new Set([...this.record.correct, page.id])];
      this.save();
    }
    this.renderApp();
  }
  next() {
    const page = this.page;
    if (page.quiz && !this.record.correct.includes(page.id)) return;
    this.record.visited = [...new Set([...this.record.visited, page.id])];
    this.message = "";
    if (this.record.index === this.course.pages.length - 1) {
      this.record.completed = courseCompleted(this.course, this.record);
      this.record.at = Date.now();
      this.pilot.syncAchievements();
      this.close();
      return;
    }
    this.record.index++;
    this.save();
    this.renderApp();
    globalThis.document
      ?.querySelector(".course-page h1")
      ?.focus({ preventScroll: true });
  }
  visual(page) {
    const scope = this.pilot.catalog.byScope.get(this.course.scopeId),
      zone = page.zone || scope?.zone || { start: 0, end: 4 },
      strings = page.strings || scope?.plan.strings;
    const neck = (points = page.points || [], opts = {}) =>
      miniatureNeck(this.profile, {
        id: "course-" + page.id,
        lastFret: zone.end,
        startFret: zone.start,
        strings,
        points,
        notation: this.notation,
        showNames: !!page.showNames,
        lesson: true,
        interactive: page.quiz?.kind === "position",
        activeString: page.id === "link" ? page.points?.[0]?.string : null,
        ...opts,
      });
    const photo = page.photo
      ? `<img class="course-instrument" src="./instruments/${INSTRUMENT_IMAGES[this.profile.instrumentId]}" alt="Votre ${esc(this.profile.label.toLowerCase())}">`
      : "";
    switch (page.visual) {
      case "instrument-link":
        return (
          instrumentDiagram(this.profile, {
            feature: "string",
            activeString: page.points[0].string,
          }) +
          `<p class="instrument-to-neck" aria-hidden="true">↓ Même corde, en dessin ↓</p>` +
          neck()
        );
      case "feature": {
        const g = neckGeometry(
            this.profile.tuning.length,
            page.variant % 2 ? 3 : 4,
            648,
            {
              lesson: true,
            },
          ),
          feature = page.feature,
          exampleFret = page.variant % 2 ? 3 : 2;
        const shape =
          feature === "neck"
            ? `<rect x="${g.nut}" y="2" width="${g.width - g.nut}" height="${g.height - 10}"/>`
            : feature === "cell"
              ? `<rect x="${g.frets[exampleFret - 1]}" y="2" width="${g.frets[exampleFret] - g.frets[exampleFret - 1]}" height="${g.height - 10}"/>`
              : feature === "string"
                ? `<path d="M${g.openStart} ${g.ys[page.variant % 2 ? this.profile.tuning.length - 1 : 0]}H${g.width}"/>`
                : `<path d="M${feature === "nut" ? g.nut : g.frets[exampleFret]} 2V${g.height - 8}"/>`;
        return (
          photo +
          instrumentDiagram(this.profile, {
            feature,
            variant: page.variant || 0,
          }) +
          `<svg class="course-feature shared-neck" viewBox="0 0 ${g.width} ${g.height}" role="img" aria-label="Un élément du manche est mis en évidence">${neckBase(this.profile, { g, id: "feature" })}<g class="course-highlight ${["cell", "neck"].includes(feature) ? "is-area" : ""}">${shape}</g></svg>`
        );
      }
      case "open-comparison":
      case "open-choice":
        return `<div class="course-pair">${page.points.map((p, i) => `<div>${neck([p], { showNames: false, lastFret: 4, startFret: 0, strings: null, interactive: false })}<span>${page.visual === "open-choice" ? (i ? "À droite" : "À gauche") : p.fret ? "Un doigt appuie" : "Sans appuyer"}</span></div>`).join("")}</div>`;
      case "notation":
        return `<div class="notation-pairs">${[0, 2, 4, 5, 7, 9, 11].map((pc) => `<div><strong>${noteName(pc, "latin")}</strong><span aria-hidden="true">↔</span><strong>${noteName(pc, "international")}</strong></div>`).join("")}</div>`;
      case "note-cycle":
        return `<div class="note-cycle" aria-label="Le cycle des notes"><span aria-hidden="true">↻</span>${(() => {
          const ns = [0, 2, 4, 5, 7, 9, 11],
            i = (page.cycleOffset || 0) % 7;
          return [...ns.slice(i), ...ns.slice(0, i)];
        })()
          .map(
            (pc) =>
              `<b class="${pc === page.missing ? "is-missing" : ""}">${pc === page.missing ? "?" : noteName(pc, this.notation)}</b>`,
          )
          .join("")}</div>`;
      case "tuning":
        return `<div class="course-tuning">${this.profile.tuning
          .map((midi, string) => ({ midi, string }))
          .reverse()
          .map(
            (p) =>
              `<div class="${p.midi % 12 === page.highlight ? "is-highlighted" : ""}"><span>Corde ${this.profile.tuning.length - p.string}</span><strong>${esc(pitchLabel(p.midi, this.notation))}</strong></div>`,
          )
          .join("")}</div>`;
      case "pitch-cards":
      case "single-note":
        return `<div class="course-pitches">${page.points.map((p) => `<span>${esc(pitchLabel(p.midi, this.notation))}</span>`).join('<i aria-hidden="true">↔</i>')}</div>`;
      case "boundary": {
        const prev = { start: zone.start - 4, end: zone.start };
        return `<div class="course-pair">${[prev, zone].map((z, i) => `<div>${neck(page.points, { id: "boundary-" + i, startFret: z.start, lastFret: z.end })}<span>${z.start === 0 ? "À vide" : z.start} → ${z.end}</span></div>`).join("")}</div>`;
      }
      case "octave-ends":
        return `<div class="course-pair">${page.points.map((p, i) => `<div>${neck([p], { id: "end-" + i, startFret: p.fret === 0 ? 0 : 8, lastFret: p.fret === 0 ? 4 : 12, showNames: true })}<span>${p.fret === 0 ? "À vide" : "Case 12"}</span></div>`).join("")}</div>`;
      case "markers":
        return (
          neck() +
          `<div class="course-symbols"><span><i class="inlay-symbol"></i>Repère fixe</span><span><i class="note-symbol"></i>Pastille de jeu</span></div>`
        );
      case "direction":
        return (
          neck() +
          `<p class="course-direction" aria-hidden="true">Plus grave ← <span>Même corde</span> → Plus aigu</p>`
        );
      default:
        return photo + neck();
    }
  }
  render() {
    const c = this.course,
      p = this.page;
    if (!c || !p) return "";
    const passed = this.record.correct.includes(p.id),
      scope = this.pilot.catalog.byScope.get(c.scopeId),
      strings =
        p.strings ||
        scope?.plan.strings ||
        this.profile.tuning.map((_, s) => s),
      zone = p.zone || scope?.zone || { start: 0, end: 4 };
    const choices =
      p.quiz?.kind === "choice"
        ? `<div class="course-choices">${p.quiz.choices.map((o) => `<button class="button quiet-button ${passed && o.value === p.quiz.answer ? "is-answer-correct" : ""}" data-course-action="answer" data-value="${esc(o.value)}" ${passed ? "disabled" : ""}>${esc(o.label)}</button>`).join("")}</div>`
        : p.quiz?.kind === "position"
          ? `<details class="course-position-options" ${this.coordinatesOpen ? "open" : ""}><summary>Boutons de réponse</summary><div class="course-coordinate-buttons" aria-label="Boutons de réponse">${strings
              .slice()
              .reverse()
              .map(
                (s) =>
                  `<div><span>Corde ${this.profile.tuning.length - s}</span><div>${Array.from(
                    { length: zone.end - zone.start + 1 },
                    (_, i) => zone.start + i,
                  )
                    .map(
                      (f) =>
                        `<button class="position-pad-button" data-course-action="position" data-string="${s}" data-fret="${f}" ${passed ? "disabled" : ""}>${f || "À vide"}</button>`,
                    )
                    .join("")}</div></div>`,
              )
              .join("")}</div></details>`
          : "";
    return `<main id="main-content" tabindex="-1" class="course-page"><header class="game-header"><button class="icon-button" data-course-action="close" aria-label="Retour au chapitre">${this.icon("back")}</button><div><strong>${esc(c.title)}</strong><small>${this.record.index + 1} / ${c.pages.length}</small></div><button class="text-button" data-course-action="skip">Ignorer</button></header><section class="course-content"><p class="eyebrow">${p.quiz ? "À vous de repérer" : "Un repère à la fois"}</p><h1 tabindex="-1">${esc(p.title)}</h1><p>${esc(p.text)}</p><div class="course-visual">${this.visual(p)}</div>${choices}<p class="course-feedback ${this.lastCorrect ? "is-correct" : ""}" role="status">${esc(this.message || "")}</p></section><nav class="course-navigation">${this.record.index ? '<button class="button secondary" data-course-action="back">Précédent</button>' : "<span></span>"}${p.listen ? `<button class="icon-button" data-course-action="listen" aria-label="Écouter cet exemple" ${this.getState().sound ? "" : "disabled"}>${this.icon("play")}</button>` : ""}<button class="button primary" data-course-action="next" ${p.quiz && !passed ? "disabled" : ""}>${this.record.index === c.pages.length - 1 ? "Terminer" : "Suivant →"}</button></nav></main>`;
  }
  layout() {
    document
      .querySelectorAll(".course-page .shared-neck[data-neck-start]")
      .forEach((svg) => layoutMiniature(svg, this.profile));
  }
}
