import { branchForRoute, reviewRecommendation } from "./navigation-rules.js";
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
  if (action === "catalog")
    c.data.navigation = { branch: null, route: null, chapter: null };
  if (action === "branch")
    c.data.navigation = { branch: id, route: null, chapter: null };
  if (action === "route")
    c.data.navigation = {
      branch: branchForRoute(id),
      route: id,
      chapter: null,
    };
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
  const saved = c.data.session;
  if (
    saved &&
    !saved.completed &&
    (chapter.activityIds?.includes(saved.activity) ||
      chapter.discoveryId === saved.activity)
  ) {
    c.start(saved.activity, true);
    return;
  }
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
  const { catalog, data } = c,
    nav = data.navigation || {},
    evidence = betaEvidence(catalog, data),
    chapter = currentChapter(c);
  const status = (ch) =>
    ch.kind === "course"
      ? !!data.courses?.[ch.courseId]?.completed
      : !!evidence.chapters.get(ch.id)?.complete;
  const heading = (title, text = "") =>
    `<div class="page-heading"><div><h1>${esc(title)}</h1>${text ? `<p>${esc(text)}</p>` : ""}</div></div>`;
  const back = (text, action, id = "") =>
    `<button class="text-button beta-back" data-pilot-action="${action}" data-id="${id}">← ${esc(text)}</button>`;
  const row = (ch) =>
    `<button class="lesson-row ${status(ch) ? "is-complete" : ""}" data-pilot-action="beta-chapter" data-id="${ch.id}"><span class="lesson-symbol ${status(ch) ? "complete" : ""}">${status(ch) ? "✓" : "›"}</span><span class="lesson-copy"><strong>${esc(ch.title)}</strong><small>${esc(ch.subtitle)}</small></span><span class="pilot-status">${status(ch) ? "Validé" : ch.kind === "course" ? "Cours visuel" : ""}</span></button>`;
  const warning = c.storageError
    ? '<p class="notice" role="alert">Sauvegarde indisponible : exportez vos progrès avant de fermer.</p>'
    : "";
  const saved =
    data.session && !data.session.completed && c.resolve(data.session.activity)
      ? data.session
      : null;
  const tile = (id, title, text, done, total) =>
    `<button class="panel route-card" data-pilot-action="beta-route" data-id="${id}"><span class="route-card-icon" aria-hidden="true">→</span><strong>${esc(title)}</strong><span>${esc(text)}</span><progress value="${done}" max="${total}" aria-label="${done} chapitres validés sur ${total}"></progress><small>${done} / ${total} chapitres validés</small></button>`;
  if (chapter) {
    const scope = catalog.byScope.get(chapter.scopeId),
      record = evidence.chapters.get(chapter.id),
      next = chapterNext(c, chapter);
    const resume =
      saved &&
      (chapter.activityIds?.includes(saved.activity) ||
        chapter.discoveryId === saved.activity);
    const label = resume
      ? `Reprendre · ${Math.min(saved.index + 1, saved.queue.length) || 1}${saved.queue.length ? " / " + saved.queue.length : ""}`
      : status(chapter)
        ? "Rejouer"
        : "Commencer";
    const activityName = resume
      ? c.resolve(saved.activity)?.subtitle
      : next?.kind === "activity"
        ? c.resolve(next.id)?.subtitle
        : null;
    const primary =
      chapter.kind === "course"
        ? `<button class="button primary" data-pilot-action="${status(chapter) ? "beta-next-chapter" : "beta-course"}" data-id="${chapter.courseId}">${status(chapter) ? "Chapitre suivant →" : "Commencer le cours →"}</button>`
        : `<button class="button primary" data-pilot-action="beta-begin" data-id="${chapter.id}">${label} →</button>`;
    const list =
      chapter.kind === "course"
        ? status(chapter)
          ? `<button class="text-button" data-pilot-action="beta-course" data-id="${chapter.courseId}">Revoir le cours</button>`
          : ""
        : `<details class="chapter-options"><summary>Choisir une activité</summary><div class="chapter-activities">${chapter.discoveryId ? `<button class="lesson-row" data-pilot-action="start" data-module="${chapter.discoveryId}"><span class="lesson-symbol">◉</span><span class="lesson-copy"><strong>Découvrir les positions</strong><small>Écouter et chercher librement</small></span></button>` : ""}${chapter.activityIds
            .map((id) => {
              const a = c.resolve(id);
              return `<button class="lesson-row" data-pilot-action="start" data-module="${id}"><span class="lesson-symbol ${evidence.passed(id) ? "complete" : ""}">${evidence.passed(id) ? "✓" : "›"}</span><span class="lesson-copy"><strong>${esc(a.subtitle)}</strong><small>${evidence.passed(id) ? "Réussi · rejouer" : "20–24 questions"}</small></span></button>`;
            })
            .join("")}</div></details>`;
    return (
      warning +
      back(
        "Les chapitres",
        "beta-route",
        nav.route || scope?.id || "beginner",
      ) +
      heading(
        chapter.title,
        chapter.kind === "course"
          ? chapter.goal || "Un repère à la fois."
          : chapter.kind === "opens"
            ? "Reconnaître et retrouver vos cordes."
            : "Apprendre ses places, puis les retrouver parmi vos repères.",
      ) +
      `<section class="panel chapter-overview"><p class="chapter-context">${esc(scope ? scope.title + " · " + scope.subtitle : "Les bases · facultatif")}</p><h2>${resume ? "Votre séance vous attend" : status(chapter) ? "Chapitre validé" : "Votre prochaine activité"}</h2>${activityName ? `<p>${esc(activityName)}</p>` : ""}<p>${chapter.kind === "course" ? "Regardez, puis essayez. Sans chronomètre." : record?.missing?.length ? `${record.missing.length} emplacement${record.missing.length > 1 ? "s" : ""} à confirmer dans les deux sens.` : "Vos positions ont été vérifiées dans les deux sens."}</p>${primary}</section>${list}`
    );
  }
  if (nav.route) {
    const chapters = routeChapters(c),
      done = chapters.filter(status).length,
      scope = catalog.byScope.get(nav.route);
    const next =
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
      chapters[0];
    const belongs =
      saved &&
      (nav.route === "guided"
        ? ["z1", "cs1", "cs2"].includes(c.resolve(saved.activity)?.scopeId)
        : c.resolve(saved.activity)?.scopeId === nav.route);
    const review = !belongs && reviewRecommendation(catalog, data, nav.route);
    const title =
      nav.route === "beginner"
        ? "Les bases du manche"
        : nav.route === "guided"
          ? "Niveau 1 : Débutant"
          : scope?.title || "Votre parcours";
    const list =
      nav.route === "guided"
        ? catalog.guided
            .map(
              (stage, i) =>
                `<details class="guided-stage" ${stage.chapterIds.includes(next?.id) ? "open" : ""}><summary><span class="stage-number">${i + 1}</span><span>${esc(stage.title)}<small>${stage.chapterIds.filter((id) => status(catalog.byChapter.get(id))).length} / ${stage.chapterIds.length} chapitres</small></span></summary><div class="lesson-list">${stage.chapterIds.map((id) => row(catalog.byChapter.get(id))).join("")}</div>${stage.reviewIds.length ? `<div class="spiral-review"><strong>Réviser vos repères précédents</strong><div>${stage.reviewIds.map((id) => `<button class="button secondary compact" data-pilot-action="start" data-module="${id}">${esc(c.resolve(id)?.subtitle || "Réviser")}</button>`).join("")}</div></div>` : ""}</details>`,
            )
            .join("")
        : `<div class="lesson-list">${chapters.map(row).join("")}</div>`;
    const action = belongs
      ? '<button class="button primary" data-pilot-action="resume">Reprendre ma séance →</button>'
      : review
        ? `<p>${esc(review.text)}</p><button class="button primary" data-pilot-action="beta-review" data-id="${review.activity}">${review.kind === "errors" ? "Revoir ces notes" : "Retrouver mes repères"} →</button>`
        : next
          ? `<p>${done === chapters.length ? "Parcours validé" : esc(next.title)}</p><button class="button primary" data-pilot-action="beta-begin" data-id="${next.id}">${done === chapters.length ? "Revoir le parcours" : "Prochaine séance"} →</button>`
          : "";
    return (
      warning +
      back(
        "Les parcours",
        "beta-branch",
        nav.branch || branchForRoute(nav.route),
      ) +
      heading(
        title,
        nav.route === "guided"
          ? "La première zone, puis vos deux premières cordes."
          : scope?.subtitle || "Quatre petits cours · facultatif",
      ) +
      `<section class="panel route-summary"><div><strong>${done} / ${chapters.length}</strong><span>chapitres validés</span></div><progress value="${done}" max="${chapters.length}" aria-label="${done} chapitres validés sur ${chapters.length}"></progress>${action}</section>${nav.route === "guided" ? guidedSummary(c, evidence) : ""}${list}`
    );
  }
  if (nav.branch) {
    let cards, title, text;
    if (nav.branch === "beginner") {
      title = "Grand Débutant";
      text = "Les repères pour jouer sans hésiter.";
      cards = tile(
        "beginner",
        "Les bases du manche",
        "Quatre cours visuels · facultatif",
        BEGINNER_CHAPTERS.filter(status).length,
        4,
      );
    } else if (nav.branch === "guided") {
      title = "Progression guidée";
      text = "Un chemin conseillé, une prochaine étape claire.";
      const ss = ["z1", "cs1", "cs2"].map((id) => evidence.scopes.get(id));
      cards = tile(
        "guided",
        "Niveau 1 : Débutant",
        "Zone I et deux cordes, avec des révisions",
        ss.reduce((s, e) => s + e.chapters, 0),
        ss.reduce((s, e) => s + e.total, 0),
      );
    } else {
      title = "Pratique ciblée";
      text = "Choisissez ce que vous voulez travailler.";
      cards = ["zone", "string", "duo", "mixed"]
        .map(
          (kind) =>
            `<section><h2>${({zone:"Par zone",string:"Par corde",duo:"Par duo de cordes",mixed:"Cordes mélangées"})[kind]}</h2><div class="route-grid">${catalog.scopes
              .filter((s) => s.kind === kind)
              .map((s) => {
                const e = evidence.scopes.get(s.id);
                return tile(s.id, s.title, s.subtitle, e.chapters, e.total);
              })
              .join("")}</div></section>`,
        )
        .join("");
    }
    return (
      warning +
      back("Les branches", "beta-catalog") +
      heading(title, text) +
      `<div class="branch-paths">${cards}</div>`
    );
  }
  const entries = [
    [
      "beginner",
      "Grand Débutant : commencez ici !",
      "Comprendre le manche et les règles du jeu.",
      "Les bases · facultatif",
    ],
    [
      "guided",
      "Progression Guidée",
      "Suivre le chemin conseillé, à votre rythme.",
      "Votre prochaine étape",
    ],
    [
      "targeted",
      "Pratique ciblée",
      "Choisir une zone ou une corde à travailler.",
      "Explorer les parcours",
    ],
  ];
  return (
    warning +
    heading("À vous de jouer.", "Choisissez votre chemin.") +
    `<div class="branch-stack">${entries
      .map(([id, title, text, cta]) => {
        const here =
          saved &&
          branchForRoute(
            saved.originRoute || c.resolve(saved.activity)?.scopeId,
          ) === id;
        return `<button class="branch-jumbo" data-pilot-action="beta-branch" data-id="${id}"><span class="branch-copy"><strong>${title}</strong><span>${text}</span><small>${here ? "Une séance vous attend" : cta}</small></span><span class="branch-arrow" aria-hidden="true">→</span></button>`;
      })
      .join("")}</div>`
  );
}
export function guidedSummary(c, evidence) {
  return `<details class="panel guided-bilan" ${evidence.guidedComplete ? "open" : ""}><summary><strong>${evidence.guidedComplete ? "Niveau 1 validé !" : "Vos repères du Niveau 1"}</strong><span>Voir le bilan</span></summary><p>Une position est vérifiée après une bonne première réponse sans aide, dans les deux sens.</p><div class="bilan-scopes">${[
    "z1",
    "cs1",
    "cs2",
  ]
    .map((id) => {
      const s = c.catalog.byScope.get(id),
        e = evidence.scopes.get(id),
        total = s.plan.all.length;
      return `<div><strong>${esc(s.title)} <span>${e.complete ? "✓" : ""}</span></strong><span>${e.coverage} / ${total} positions vérifiées</span><progress max="${total}" value="${e.coverage}" aria-label="${e.coverage} positions vérifiées sur ${total}"></progress><button class="text-button" data-pilot-action="beta-route" data-id="${id}">${e.complete ? "Consolider" : "Continuer"} →</button></div>`;
    })
    .join("")}</div></details>`;
}
