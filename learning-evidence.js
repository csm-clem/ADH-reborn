/** Durable learning proofs outlive the bounded, detailed attempt journal. */
const key = (p) => `${p.string}:${p.fret}`;
export const autonomousAnswer = (e) => e.correct && !e.retry && !e.aids?.length;
export function activityContract(module) {
  const exact =
    module.mode === "name" && ["family", "opens"].includes(module.kind);
  return `v1|${module.mode}|${exact ? "pitch" : "class"}|${module.pool.map(key).sort().join(",")}`;
}
export function successfulAttempt(a, module) {
  return (
    !!module &&
    a.finished === true &&
    a.passed === true &&
    a.events?.length >= 20 &&
    a.events.every(
      (e) =>
        !e.retry &&
        !e.aids?.length &&
        e.mode === module.mode &&
        module.pool.some((p) => key(p) === key(e.target)) &&
        (module.mode !== "name" ||
          !["family", "opens"].includes(module.kind) ||
          e.answerKind === "pitch"),
    )
  );
}
export function learningProofs(catalog, data) {
  const previous = data.evidence || {},
    activities = Object.assign(Object.create(null), previous.activities);
  const coverage = {
    name: new Set(previous.coverage?.name || []),
    find: new Set(previous.coverage?.find || []),
  };
  const records = Object.assign(Object.create(null), previous.records),
    stats = structuredClone(previous.stats || {}),
    processed = new Set(previous.processed || []),
    modules = new Map(catalog.activities.map((a) => [a.id, a]));
  for (const a of data.attempts || []) {
    if (processed.has(a.id)) continue;
    processed.add(a.id);
    for (const e of a.events || []) {
      if (coverage[e.mode] && autonomousAnswer(e))
        coverage[e.mode].add(key(e.target));
      if (!e.retry && coverage[e.mode]) {
        const cell = (stats[key(e.target)] ||= {
          name: { total: 0, correct: 0 },
          find: { total: 0, correct: 0 },
        });
        cell[e.mode].total++;
        cell[e.mode].correct += Number(e.correct);
      }
    }
    const module = modules.get(a.activity);
    if (successfulAttempt(a, module))
      activities[a.activity] = {
        contract: activityContract(module),
        at: Math.max(a.at || 0, activities[a.activity]?.at || 0),
      };
    if (a.finished && a.events?.some((e) => !e.retry)) {
      const es = a.events.filter((e) => !e.retry),
        cs = es.filter((e) => e.correct),
        times = cs
          .filter((e) => !e.aids?.length && e.timingInterpretable !== false)
          .map((e) => e.ms);
      const metrics = {
        total: es.length,
        correct: cs.length,
        accuracy: cs.length / es.length,
        meanMs: times.length
          ? times.reduce((s, t) => s + t, 0) / times.length
          : null,
      };
      const context = a.comparisonKey || a.activity,
        entry = {
          id: a.id,
          activity: a.activity,
          comparisonKey: context,
          finished: true,
          at: a.at,
          metrics,
        };
      records[context] = [...(records[context] || []), entry]
        .filter((r, i, all) => all.findIndex((x) => x.id === r.id) === i)
        .sort(
          (a, b) =>
            b.metrics.accuracy - a.metrics.accuracy ||
            (a.metrics.meanMs ?? Infinity) - (b.metrics.meanMs ?? Infinity),
        )
        .slice(0, 2);
    }
  }
  return {
    version: 1,
    activities,
    coverage: { name: [...coverage.name], find: [...coverage.find] },
    records,
    stats,
    processed: [...processed].slice(-1000),
  };
}
export function preserveLearningProofs(catalog, data) {
  data.evidence = learningProofs(catalog, data);
  return data.evidence;
}
