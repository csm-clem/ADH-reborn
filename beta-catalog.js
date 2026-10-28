import { learningProofs, activityContract } from "./learning-evidence.js";
import {
  pilotPlan,
  practiceActivities,
  isNatural,
  positionKey,
} from "./pilot.js";

/** Canonical targeted chapters. Guided stages only refer to these same objects. */
export function betaCatalog(profile, { notation = "international", full = true } = {}) {
  const scopes = [
    {
      id: "z1",
      title: "Zone I",
      subtitle: "À vide → case 4",
      zone: { start: 0, end: 4 },
      prefix: "",
      kind: "zone",
    },
    {
      id: "z2",
      title: "Zone II",
      subtitle: "Cases 4 → 8",
      zone: { start: 4, end: 8 },
      prefix: "z2-",
      kind: "zone",
    },
    {
      id: "z3",
      title: "Zone III",
      subtitle: "Cases 8 → 12",
      zone: { start: 8, end: 12 },
      prefix: "z3-",
      kind: "zone",
    },
    ...profile.tuning.slice(0, 3).map((_, string) => ({
      id: "cs" + (string + 1),
      title: "Corde " + (profile.tuning.length - string),
      subtitle: "À vide → case 12",
      zone: { start: 0, end: 12 },
      prefix: "cs" + (string + 1) + "-",
      strings: [string],
      kind: "string",
    })),
  ];
  if(full){
    for(const [i,start] of [12,16,20].entries())scopes.push({id:'z'+(i+4),title:'Zone '+['IV','V','VI'][i],subtitle:`Cases ${start} → ${start+4}`,zone:{start,end:start+4},prefix:'z'+(i+4)+'-',kind:'zone'});
    for(let string=3;string<profile.tuning.length;string++)scopes.push({id:'cs'+(string+1),title:'Corde '+(profile.tuning.length-string),subtitle:'À vide → case 12',zone:{start:0,end:12},prefix:'cs'+(string+1)+'-',strings:[string],kind:'string'});
    for(let string=0;string<profile.tuning.length;string++)scopes.push({id:'c24s'+(string+1),title:'Corde '+(profile.tuning.length-string),subtitle:'À vide → case 24',zone:{start:0,end:24},prefix:'c24s'+(string+1)+'-',strings:[string],kind:'string'});
    for(let string=0;string<profile.tuning.length-1;string++)scopes.push({id:'duo'+(string+1),title:`Cordes ${profile.tuning.length-string} et ${profile.tuning.length-string-1}`,subtitle:'À vide → case 12',zone:{start:0,end:12},prefix:'duo'+(string+1)+'-',strings:[string,string+1],kind:'duo'});
    for(const end of [12,24])scopes.push({id:'mix'+end,title:'Toutes les cordes',subtitle:`À vide → case ${end}`,zone:{start:0,end},prefix:'mix'+end+'-',kind:'mixed'});
  }
  const chapters = [],
    activities = [],
    discoveries = [], legacyActivities=[];
  for (const scope of scopes) {
    const plan = pilotPlan(profile, {
      notation,
      zone: scope.zone,
      strings: scope.strings,
      prefix: scope.prefix,
      scopeId: scope.id,
    });
    scope.plan = plan;
    scope.chapters = [];
    const add = (chapter) => {
      chapter.scopeId = scope.id;
      scope.chapters.push(chapter);
      chapters.push(chapter);
      return chapter;
    };
    if (scope.id !== "z1")
      add({
        id: scope.id + "-entry",
        kind: "course",
        courseId: scope.id + "-entry",
        title:
          scope.kind === "string"
            ? scope.title + " : vos repères"
            : scope.kind === "zone" ? "Votre nouvelle zone" : scope.title + " : vos repères",
        subtitle: scope.subtitle,
        phase: "natural",
        activityIds: [],
      });
    const opens = plan.modules.find((m) => m.kind === "opens");
    if (opens) {
      const openActivities = practiceActivities({ modules: [opens] })
        .filter(
          (a) =>
            a.mode !== "name" ||
            new Set(opens.pool.map((p) => p.midi)).size > 1,
        )
        .map((a) => ({ ...a, strictString: true }));
      // A single open string is an entry explanation, not twenty identical questions.
      if (scope.kind === "zone") {
        activities.push(...openActivities);
        add({
          id: scope.id + "-opens",
          kind: "opens",
          title: "Les cordes à vide",
          subtitle: "Nommer · Retrouver",
          phase: "natural",
          activityIds: openActivities.map((a) => a.id),
          focus: opens.pool,
        });
      }
    }
    const naturalEnd = plan.order.filter(isNatural).at(-1);
    for (const pc of plan.order) {
      const family = plan.modules.find(
          (m) => m.kind === "family" && m.pitchClass === pc,
        ),
        mix = plan.modules.find((m) => m.kind === "mix" && m.pitchClass === pc);
      legacyActivities.push(...practiceActivities({modules:[family]}));
      const graded=practiceActivities({modules:[mix]});
      const discovery = {
        ...family,
        id: family.id + "-discover",
        baseId: family.id,
        mode: "find",
        discoveryOnly: true,
        nextId: graded[0]?.id,
      };
      discoveries.push(discovery);
      activities.push(...graded);
      add({
        id: scope.id + "-f" + String(pc).padStart(2, "0"),
        kind: "family",
        title: family.title,
        subtitle: "Découvrir · Nommer · Retrouver",
        phase: isNatural(pc) ? "natural" : "altered",
        pitchClass: pc,
        focus: family.pool,
        activityIds: graded.map((a) => a.id),
        discoveryId: discovery.id,
        naturalEnd: pc === naturalEnd,
        fullEnd: pc === plan.order.at(-1),
      });
      if (pc === naturalEnd)
        add({
          id: scope.id + "-co",
          kind: "course",
          courseId: scope.id + "-co",
          title:
            scope.id === "z3"
              ? "La douzième case"
              : "Un même nom, plusieurs places",
          subtitle: "Relier les notes naturelles",
          phase: "natural",
          activityIds: [],
        });
    }
    // Altered open strings meet their octave only after the natural families.
    if (scope.zone.end === 12 && plan.altered.length)
      add({
        id: scope.id + "-altered-octaves",
        kind: "course",
        courseId: scope.id + "-altered-octaves",
        title: "Vos cordes à la douzième case",
        subtitle: "Relier aussi les notes altérées",
        phase: "altered",
        activityIds: [],
      });
    scope.activityIds = scope.chapters.flatMap((c) => c.activityIds);
    scope.plan.activityIds = scope.activityIds;
    scope.naturalIds = scope.chapters
      .filter((c) => c.phase === "natural")
      .map((c) => c.id);
    scope.alteredIds = scope.chapters
      .filter((c) => c.phase === "altered")
      .map((c) => c.id);
  }
  const byScope = new Map(scopes.map((s) => [s.id, s])),
    byChapter = new Map(chapters.map((c) => [c.id, c]));
  const subset = (id, phase) =>
    byScope
      .get(id)
      .chapters.filter((c) => c.phase === phase)
      .map((c) => c.id);
  const lastMix = (id, natural) => {
    const s = byScope.get(id),
      m = s.plan.modules.find(
        (m) => m.kind === "mix" && (natural ? m.naturalEnd : m.fullEnd),
      );
    return m ? [m.id, m.id + "-find"] : [];
  };
  const guided = [
    {
      id: "g1-a",
      title: "Vos premiers repères",
      chapterIds: subset("z1", "natural"),
      reviewIds: [],
    },
    {
      id: "g1-b",
      title: "Le long de votre première corde",
      chapterIds: subset("cs1", "natural"),
      reviewIds: lastMix("z1", true),
    },
    {
      id: "g1-c",
      title: "Une deuxième corde, les mêmes noms",
      chapterIds: subset("cs2", "natural"),
      reviewIds: lastMix("cs1", true),
    },
    {
      id: "g1-d",
      title: "Compléter votre première zone",
      chapterIds: subset("z1", "altered"),
      reviewIds: lastMix("cs2", true),
    },
    {
      id: "g1-e",
      title: "Toutes les notes de votre première corde",
      chapterIds: subset("cs1", "altered"),
      reviewIds: lastMix("z1", false),
    },
    {
      id: "g1-f",
      title: "Toutes les notes de votre deuxième corde",
      chapterIds: subset("cs2", "altered"),
      reviewIds: [],
    },
  ];
  return {
    scopes,
    chapters,
    activities,
    discoveries,
    legacyActivities,
    guided,
    byScope,
    byChapter,
    allPositions: [
      ...new Map(
        scopes.flatMap((s) => s.plan.all).map((p) => [positionKey(p), p]),
      ).values(),
    ],
  };
}

/** Contextual results remain contextual; physical coverage is reusable across paths. */
export function betaEvidence(catalog, data) {
  const proof = learningProofs(catalog, data),
    courses = data.courses || {};
  const coverage = {
    name: new Set(proof.coverage.name),
    find: new Set(proof.coverage.find),
  };
  const modules = new Map(catalog.activities.map((a) => [a.id, a]));
  const passed = (id) =>
    !!modules.get(id) &&
    proof.activities[id]?.contract === activityContract(modules.get(id));
  const chapters = new Map();
  for (const chapter of catalog.chapters) {
    if (chapter.kind === "course") {
      const c = courses[chapter.courseId];
      chapters.set(chapter.id, {
        complete: !!c?.completed,
        progress: c?.completed ? 1 : c?.visited?.length ? 0.5 : 0,
      });
      continue;
    }
    const positions = chapter.focus || [],
      seen =
        chapter.kind === "opens"
          ? data.discoveredModules?.includes("opens")
          : data.discoveredModules?.includes(
              catalog.discoveries.find((d) => d.id === chapter.discoveryId)
                ?.baseId,
            );
    const missing = positions.filter(
      (p) =>
        !coverage.name.has(positionKey(p)) ||
        !coverage.find.has(positionKey(p)),
    );
    const successful = chapter.activityIds.filter(passed).length;
    chapters.set(chapter.id, {
      complete:
        !!seen && successful === chapter.activityIds.length && !missing.length,
      progress:
        (Number(!!seen) +
          successful +
          (positions.length - missing.length) / Math.max(1, positions.length)) /
        (chapter.activityIds.length + 2),
      missing,
      successful,
    });
  }
  const scopes = new Map(
    catalog.scopes.map((s) => [
      s.id,
      {
        complete: s.chapters.every((c) => chapters.get(c.id).complete),
        chapters: s.chapters.filter((c) => chapters.get(c.id).complete).length,
        total: s.chapters.length,
        coverage: s.plan.all.filter(
          (p) =>
            coverage.name.has(positionKey(p)) &&
            coverage.find.has(positionKey(p)),
        ).length,
      },
    ]),
  );
  return {
    chapters,
    scopes,
    coverage,
    passed,
    guidedComplete: ["z1", "cs1", "cs2"].every((id) => scopes.get(id).complete),
  };
}
