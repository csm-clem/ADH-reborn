import { betaEvidence } from "./beta-catalog.js";
const esc = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const BEGINNER_CHAPTERS = [
  {
    id: "gd-01",
    courseId: "gd-01",
    kind: "course",
    title: "Votre instrument",
    subtitle: "Reconnaître ses éléments",
    goal: "Manche, corde, case, frette, sillet.",
  },
  {
    id: "gd-02",
    courseId: "gd-02",
    kind: "course",
    title: "Le diagramme du manche",
    subtitle: "Lire les cordes et les cases",
    goal: "Une corde et une case : retrouver une place.",
  },
  {
    id: "gd-03",
    courseId: "gd-03",
    kind: "course",
    title: "Les noms des notes",
    subtitle: "Reconnaître votre notation",
    goal: "Deux écritures ; votre accordage réel.",
  },
  {
    id: "gd-04",
    courseId: "gd-04",
    kind: "course",
    title: "Nom, hauteur et octave",
    subtitle: "Comprendre la note demandée",
    goal: "Même nom, même hauteur ou autre octave ?",
  },
];
export function currentChapter(c) {
  return (
    c.catalog.byChapter.get(c.data.navigation?.chapter) ||
    BEGINNER_CHAPTERS.find((ch) => ch.id === c.data.navigation?.chapter)
  );
}
export function routeChapters(c) {
  const route = c.data.navigation?.route;
  return route === "beginner"
    ? BEGINNER_CHAPTERS
    : route === "guided"
      ? c.catalog.guided.flatMap((s) =>
          s.chapterIds.map((id) => c.catalog.byChapter.get(id)),
        )
      : c.catalog.byScope.get(route)?.chapters || [];
}
export function navigateBeta(c, action, id) {
  c.data.navigation ||= { route: null, chapter: null };
  if (action === "catalog") c.data.navigation = { route: null, chapter: null };
  if (action === "route") c.data.navigation = { route: id, chapter: null };
  if (action === "chapter") c.data.navigation.chapter = id;
  c.save();
  c.host.home();
}
export function chapterNext(c, chapter = currentChapter(c)) {
  if (!chapter) return null;
  if (chapter.kind === "course")
    return { kind: "course", id: chapter.courseId };
  const evidence = betaEvidence(c.catalog, c.data),
    discovered = c.data.discoveredModules || [];
  if (
    chapter.discoveryId &&
    !discovered.includes(
      c.catalog.discoveries.find((d) => d.id === chapter.discoveryId)?.baseId,
    )
  )
    return { kind: "activity", id: chapter.discoveryId };
  const pending = chapter.activityIds.find((id) => !evidence.passed(id));
  if (pending) return { kind: "activity", id: pending };
  const missing = evidence.chapters.get(chapter.id)?.missing || [];
  if (missing.length) {
    const mode = evidence.coverage.name.has(
      missing[0].string + ":" + missing[0].fret,
    )
      ? "find"
      : "name";
    const mixed = chapter.activityIds
      .map((id) => c.resolve(id))
      .find((a) => a.kind === "mix" && a.mode === mode);
    if (mixed) return { kind: "activity", id: mixed.id };
  }
  const following =
    routeChapters(c)[
      routeChapters(c).findIndex((ch) => ch.id === chapter.id) + 1
    ];
  return chapter.activityIds[0]
    ? { kind: "activity", id: chapter.activityIds[0] }
    : following
      ? { kind: "chapter", id: following.id }
      : chapter.discoveryId
        ? { kind: "activity", id: chapter.discoveryId }
        : null;
}
export function startChapter(c, id) {
  const chapter =
    c.catalog.byChapter.get(id) || BEGINNER_CHAPTERS.find((ch) => ch.id === id);
  if (!chapter) return;
  c.data.navigation ||= { route: chapter.scopeId || "beginner" };
  c.data.navigation.chapter = id;
  const next = chapterNext(c, chapter);
  c.save();
  if (next?.kind === "course") c.host.openCourse?.(next.id);
  else if (next?.kind === "chapter") startChapter(c, next.id);
  else if (next) c.start(next.id);
}
export function continueLearning(c) {
  const chapter = currentChapter(c),
    sequence = routeChapters(c),
    i = chapter?.activityIds?.indexOf(c.session?.activity) ?? -1;
  if (i >= 0 && i < chapter.activityIds.length - 1) {
    c.start(chapter.activityIds[i + 1]);
    return;
  }
  const next = sequence[sequence.findIndex((ch) => ch.id === chapter?.id) + 1];
  if (next) startChapter(c, next.id);
  else {
    c.data.navigation.chapter = null;
    c.leave();
    c.host.home();
  }
}
export function betaHome(c) {
  const catalog = c.catalog,
    data = c.data,
    nav = data.navigation || {},
    evidence = betaEvidence(catalog, data),
    chapter = currentChapter(c);
  const status = (ch) =>
    ch.kind === "course"
      ? !!data.courses?.[ch.courseId]?.completed
      : !!evidence.chapters.get(ch.id)?.complete;
  const heading = (title, text) =>
    `<div class="page-heading"><div><h1>${esc(title)}</h1><p>${esc(text)}</p></div></div>`;
  const back = (label, action, id = "") =>
    `<button class="text-button beta-back" data-pilot-action="${action}" data-id="${id}">← ${esc(label)}</button>`;
  const row = (ch) =>
    `<button class="lesson-row ${status(ch) ? "is-complete" : ""}" data-pilot-action="beta-chapter" data-id="${ch.id}"><span class="lesson-symbol ${status(ch) ? "complete" : ""}">${status(ch) ? "✓" : "›"}</span><span class="lesson-copy"><strong>${esc(ch.title)}</strong><small>${esc(ch.subtitle)}</small></span><span class="pilot-status">${status(ch) ? "Validé" : ch.kind === "course" ? "Cours visuel" : "À pratiquer"}</span></button>`;
  const warning = c.storageError
    ? '<p class="notice" role="alert">Sauvegarde indisponible : exportez vos progrès avant de fermer.</p>'
    : "";
  if (chapter) {
    const record = evidence.chapters.get(chapter.id),
      next = chapterNext(c, chapter),
      scope = catalog.byScope.get(chapter.scopeId);
    const labels = {
      family:
        "Apprenez ses places, puis mélangez-les avec les notes déjà rencontrées.",
      opens: "Écoutez les cordes, puis nommez-les et retrouvez-les.",
      course:
        chapter.goal || "Un cours visuel et quelques essais, sans chronomètre.",
    };
    const activities =
      chapter.kind === "course"
        ? `${status(chapter) ? '<button class="button primary" data-pilot-action="beta-next-chapter">Chapitre suivant →</button>' : ""}<button class="button ${status(chapter) ? "quiet-button" : "primary"}" data-pilot-action="beta-course" data-id="${chapter.courseId}">${status(chapter) ? "Revoir le cours" : "Commencer le cours"}</button>`
        : `<div class="chapter-activities">${chapter.discoveryId ? `<button class="lesson-row" data-pilot-action="start" data-module="${chapter.discoveryId}"><span class="lesson-symbol">◉</span><span class="lesson-copy"><strong>Découvrir les positions</strong><small>Cherchez librement, avec les noms.</small></span></button>` : ""}${chapter.activityIds
            .map((id) => {
              const a = c.resolve(id),
                done = evidence.passed(id);
              return `<button class="lesson-row" data-pilot-action="start" data-module="${id}"><span class="lesson-symbol ${done ? "complete" : ""}">${done ? "✓" : "›"}</span><span class="lesson-copy"><strong>${esc(a.subtitle)}</strong><small>${esc(a.kind === "mix" ? (a.naturalEnd ? "Toutes les notes naturelles" : a.fullEnd ? "Toutes les notes" : "Avec vos repères précédents") : "Cette famille, avec les chiffres d’octave")}</small></span><span class="pilot-status">${done ? "Réussi" : "20–24 questions"}</span></button>`;
            })
            .join("")}</div>`;
    const missing = record?.missing?.length || 0;
    return (
      warning +
      back(
        "Les chapitres",
        "beta-route",
        nav.route || scope?.id || "beginner",
      ) +
      heading(chapter.title, labels[chapter.kind]) +
      `<section class="panel chapter-overview"><p class="chapter-context">${esc(scope ? scope.title + " · " + scope.subtitle : "Les bases · facultatif")}</p><h2>${status(chapter) ? "Chapitre validé" : "Votre prochain pas"}</h2><p>${chapter.kind === "course" ? "Comprenez le dessin, puis faites quelques essais." : missing ? `${missing} emplacement${missing > 1 ? "s" : ""} reste${missing > 1 ? "nt" : ""} à confirmer dans les deux sens.` : "Les positions ont été rencontrées. Consolidez-les dans les deux sens."}</p>${chapter.kind !== "course" && next ? `<button class="button primary" data-pilot-action="beta-begin" data-id="${chapter.id}">${status(chapter) ? "Rejouer" : "Continuer"} ${(c.host.icon || (() => ""))("play")}</button>` : ""}</section>${activities}<p class="beta-unlocked">Toutes les activités sont accessibles. La vitesse est un défi facultatif.</p>`
    );
  }
  if (nav.route) {
    const route = nav.route,
      scope = catalog.byScope.get(route),
      chapters = routeChapters(c),
      done = chapters.filter(status).length,
      next =
        chapters.find((ch) =>
          ch.kind === "course"
            ? !status(ch)
            : (ch.discoveryId &&
                !(data.discoveredModules || []).includes(
                  catalog.discoveries.find((d) => d.id === ch.discoveryId)
                    ?.baseId,
                )) ||
              ch.activityIds.some((id) => !evidence.passed(id)),
        ) ||
        chapters.find((ch) => !status(ch)) ||
        chapters[0],
      title =
        route === "beginner"
          ? "Grand Débutant : commencez ici !"
          : route === "guided"
            ? "Niveau 1 : Débutant"
            : scope?.title || "Votre parcours";
    const list =
      route === "guided"
        ? catalog.guided
            .map(
              (stage, i) =>
                `<section class="guided-stage"><h2><small>${i + 1}</small> ${esc(stage.title)}</h2><div class="lesson-list">${stage.chapterIds.map((id) => row(catalog.byChapter.get(id))).join("")}</div>${
                  stage.reviewIds.length
                    ? `<div class="spiral-review"><strong>Retrouver vos repères d’avant</strong><span>Une reprise conseillée, sans nouvelle épreuve obligatoire.</span><div>${stage.reviewIds
                        .map((id) => {
                          const a = c.resolve(id);
                          return `<button class="button secondary compact" data-pilot-action="start" data-module="${id}">${esc(a?.subtitle || "Réviser")}</button>`;
                        })
                        .join("")}</div></div>`
                    : ""
                }</section>`,
            )
            .join("")
        : `<div class="lesson-list">${chapters.map(row).join("")}</div>`;
    return (
      warning +
      back("Tous les parcours", "beta-catalog") +
      heading(
        title,
        route === "guided"
          ? "La Zone I et vos deux premières cordes, avec des reprises pour garder vos repères."
          : route === "beginner"
            ? "Les bases utiles au jeu, en images. Vous pouvez passer chaque chapitre."
            : scope?.subtitle || "",
      ) +
      `<section class="panel route-summary"><div><strong>${done} / ${chapters.length}</strong><span>chapitres validés</span></div><progress value="${done}" max="${chapters.length}" aria-label="${done} chapitres validés sur ${chapters.length}"></progress>${next ? `<button class="button primary" data-pilot-action="beta-begin" data-id="${next.id}">${done === chapters.length ? "Revoir le parcours" : "Prochaine séance"} ${(c.host.icon || (() => ""))("arrow")}</button>` : ""}</section>${list}<p class="beta-unlocked">Toutes les activités sont accessibles. Choisissez librement votre prochain chapitre.</p>`
    );
  }
  const resume = data.session && c.resolve(data.session.activity),
    guidedDone = ["z1", "cs1", "cs2"].reduce(
      (sum, id) => sum + evidence.scopes.get(id).chapters,
      0,
    ),
    guidedTotal = ["z1", "cs1", "cs2"].reduce(
      (sum, id) => sum + evidence.scopes.get(id).total,
      0,
    );
  const card = (id, title, subtitle, done, total) =>
    `<button class="panel route-card" data-pilot-action="beta-route" data-id="${id}"><span class="route-card-icon" aria-hidden="true">${done === total ? "✓" : "›"}</span><strong>${esc(title)}</strong><span>${esc(subtitle)}</span><progress value="${done}" max="${total}" aria-label="${done} chapitres validés sur ${total}"></progress><small>${done} / ${total} chapitres validés</small></button>`;
  return (
    warning +
    heading(
      "Votre manche. Vos parcours.",
      "Choisissez votre chemin. Les acquis restent partagés entre les parcours.",
    ) +
    `<section class="zone-hero beta-featured"><div><span class="tag light">PROGRESSION GUIDÉE</span><h2>Niveau 1 : Débutant</h2><p>La première zone, puis vos deux premières cordes jusqu’à la case 12.</p><button class="button primary" data-pilot-action="beta-route" data-id="guided">${guidedDone ? "Continuer mon parcours" : "Commencer le Niveau 1"} ${(c.host.icon || (() => ""))("arrow")}</button>${resume ? '<button class="button secondary" data-pilot-action="resume">Reprendre ma séance</button>' : ""}</div><div class="beta-featured-progress"><strong>${guidedDone} / ${guidedTotal}</strong><span>chapitres validés</span><progress value="${guidedDone}" max="${guidedTotal}" aria-label="Progression du Niveau 1"></progress></div></section><section class="beta-beginner">${card("beginner", "Grand Débutant : commencez ici !", "Quatre chapitres visuels · facultatif", BEGINNER_CHAPTERS.filter(status).length, 4)}</section><section><div class="section-heading"><div><h2>Pratique ciblée · Zones</h2><p>Apprenez toutes les notes d’une position de main.</p></div></div><div class="route-grid">${catalog.scopes
      .filter((s) => s.kind === "zone")
      .map((s) => {
        const e = evidence.scopes.get(s.id);
        return card(s.id, s.title, s.subtitle, e.chapters, e.total);
      })
      .join(
        "",
      )}</div></section><section><div class="section-heading"><div><h2>Pratique ciblée · Cordes</h2><p>Une corde continue, à vide jusqu’à la case 12.</p></div></div><div class="route-grid">${catalog.scopes
      .filter((s) => s.kind === "string")
      .map((s) => {
        const e = evidence.scopes.get(s.id);
        return card(s.id, s.title, s.subtitle, e.chapters, e.total);
      })
      .join(
        "",
      )}</div></section><p class="beta-unlocked">Toutes les activités sont accessibles. Aucun chapitre ne bloque la suite.</p>`
  );
}
