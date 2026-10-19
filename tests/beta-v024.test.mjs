import test from "node:test";
import assert from "node:assert/strict";
import { INSTRUMENTS, makeProfile, neckGeometry } from "../core.js";
import { betaCatalog, betaEvidence } from "../beta-catalog.js";
import { betaCourses, courseCompleted } from "../beta-courses.js";
import {
  questionsFor,
  pilotCorrect,
  validatePilotStore,
  initialPilotStore,
  isNatural,
} from "../pilot.js";
import { simulatedBetaCompletion } from "../debug-mode.js";
import { CourseController } from "../course-ui.js";
import { continueLearning, routeChapters } from "../beta-home.js";
import { PilotController } from "../pilot-ui.js";
import { initialState } from "../state.js";
import { AchievementsController } from "../achievements-ui.js";
const profile = makeProfile("guitar6");
const rng = (seed) => () =>
  ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

test("The entire beta has three exact zones, three physical strings, four primer chapters and a shared guided path", () => {
  for (const instrument of INSTRUMENTS) {
    const p = makeProfile(instrument.id),
      catalog = betaCatalog(p),
      courses = betaCourses(p, catalog);
    assert.equal(catalog.scopes.length, 6);
    assert.deepEqual(
      catalog.scopes.slice(0, 3).map((s) => s.zone),
      [
        { start: 0, end: 4 },
        { start: 4, end: 8 },
        { start: 8, end: 12 },
      ],
    );
    assert.deepEqual(
      catalog.scopes.slice(3).map((s) => s.plan.strings),
      [[0], [1], [2]],
    );
    assert.equal(catalog.allPositions.length, p.tuning.length * 13);
    assert.equal(
      new Set(catalog.activities.map((a) => a.id)).size,
      catalog.activities.length,
    );
    for (const id of ["gd-01", "gd-02", "gd-03", "gd-04"])
      assert.ok(courses.has(id));
    for (const stage of catalog.guided)
      for (const id of stage.chapterIds) {
        const c = catalog.byChapter.get(id);
        assert.ok(c);
        assert.ok(["z1", "cs1", "cs2"].includes(c.scopeId));
        assert.ok(catalog.byScope.get(c.scopeId).chapters.includes(c));
      }
    for (const a of catalog.activities)
      assert.ok(
        a.pool.every(
          (p) =>
            a.strings.includes(p.string) &&
            p.fret >= a.zone.start &&
            p.fret <= a.zone.end,
        ),
      );
  }
  const c = betaCatalog(profile);
  assert.deepEqual(
    c.byScope.get("z1").plan.order,
    [4, 9, 2, 7, 11, 5, 0, 6, 1, 8, 3, 10],
  );
  assert.deepEqual(
    c.byScope.get("cs2").plan.order.slice(0, 7),
    [9, 11, 0, 2, 4, 5, 7],
  );
});

test("Reentrant profiles keep physical strings and altered open strings stay out of natural mixtures", () => {
  const p = makeProfile("guitar6", "G3 C3 E3 A3 D4 G4"),
    c = betaCatalog(p);
  assert.deepEqual(
    c.scopes.slice(3).map((s) => s.plan.strings),
    [[0], [1], [2]],
  );
  const eight = betaCatalog(makeProfile("guitar8"));
  for (const scope of eight.scopes) {
    let natural = true;
    for (const pc of scope.plan.order) {
      if (!isNatural(pc)) natural = false;
      const mix = scope.plan.modules.find(
        (m) => m.kind === "mix" && m.pitchClass === pc,
      );
      if (natural) assert.ok(mix.pool.every((p) => isNatural(p.midi)));
    }
  }
  assert.equal(eight.byScope.get("cs1").plan.order[0], 7);
  assert.equal(eight.byScope.get("cs1").plan.order[7], 6);
});

test("Every evaluated activity stays short, admits its real answer and gives the new family at least thirty percent", () => {
  for (const instrument of INSTRUMENTS) {
    const p = makeProfile(instrument.id),
      catalog = betaCatalog(p);
    for (const a of catalog.activities)
      for (let seed = 1; seed <= 4; seed++) {
        const queue = questionsFor(a, { random: rng(seed) });
        assert.ok(queue.length >= 20 && queue.length <= 24);
        assert.ok(
          queue.every((q) =>
            pilotCorrect(
              p,
              q,
              q.mode === "name"
                ? q.answerKind === "pitch"
                  ? q.target.midi
                  : q.target.midi % 12
                : q.target,
            ),
          ),
        );
        const fresh = new Set(
          a.newPositions.map((p) => p.string + ":" + p.fret),
        );
        assert.ok(
          queue.filter((q) => fresh.has(q.target.string + ":" + q.target.fret))
            .length >= Math.ceil(queue.length * 0.3),
        );
        const counts = new Map();
        for (const q of queue)
          counts.set(q.target.midi, (counts.get(q.target.midi) || 0) + 1);
        const feasible =
          Math.max(...counts.values()) <=
          2 * (queue.length - Math.max(...counts.values()) + 1);
        if (counts.size > 1 && feasible)
          for (let i = 2; i < queue.length; i++)
            assert.ok(
              !(
                queue[i].target.midi === queue[i - 1].target.midi &&
                queue[i].target.midi === queue[i - 2].target.midi
              ),
              a.id,
            );
        if (a.mode === "name" && a.kind === "family")
          assert.ok(new Set(a.pool.map((p) => p.midi)).size > 1);
        if (a.mode === "name" && a.kind === "mix")
          assert.ok(new Set(a.pool.map((p) => p.midi % 12)).size > 1);
        if (a.kind === "mix")
          for (let i = 2; i < queue.length; i++) {
            assert.ok(
              !(
                queue[i].target.midi % 12 === queue[i - 1].target.midi % 12 &&
                queue[i].target.midi % 12 === queue[i - 2].target.midi % 12
              ),
              a.id + " repeats a name three times",
            );
          }
      }
  }
});

test("A full string never accepts its other octave or a different string for an exact request", () => {
  const c = betaCatalog(profile),
    a = c.activities.find((a) => a.id === "cs1-note-4-find"),
    q = questionsFor(a).find((q) => q.target.fret === 0);
  assert.equal(pilotCorrect(profile, q, { string: 0, fret: 0 }), true);
  assert.equal(pilotCorrect(profile, q, { string: 0, fret: 12 }), false);
  assert.equal(pilotCorrect(profile, q, { string: 2, fret: 2 }), false);
});

test("The new zone diagrams have their actual fret numbers, no false nut, and a sufficiently wide continuous long string", () => {
  for (const startFret of [4, 8]) {
    const g = neckGeometry(7, startFret + 4, 648, { startFret });
    assert.deepEqual(g.visibleFrets, [
      startFret,
      startFret + 1,
      startFret + 2,
      startFret + 3,
      startFret + 4,
    ]);
    assert.equal(g.frets[startFret - 1], g.nut);
    assert.ok(g.centers[startFret] > g.nut);
  }
  const g = neckGeometry(6, 12, 648, {
    gameplay: true,
    stringIndices: [0],
    availableWidth: 720,
  });
  assert.deepEqual(g.visibleStrings, [0]);
  assert.ok(
    g.visibleFrets.every((f) => g.bounds(f)[1] - g.bounds(f)[0] >= 44 - 1e-9),
  );
  for (let f = 1; f <= 12; f++)
    assert.ok(g.bounds(f)[0] >= g.bounds(f - 1)[1] - 1e-9);
});

test("Course validation requires every taught page and every check; ignoring never awards a completion", () => {
  const c = betaCatalog(profile),
    courses = betaCourses(profile, c);
  for (const course of courses.values()) {
    assert.equal(
      new Set(course.pages.map((p) => p.id)).size,
      course.pages.length,
    );
    const correct = course.pages.filter((p) => p.quiz).map((p) => p.id),
      visited = course.pages.map((p) => p.id);
    assert.equal(courseCompleted(course, { correct: [], visited: [] }), false);
    assert.equal(courseCompleted(course, { correct, visited }), true);
    for (const p of course.pages.filter((p) => p.quiz?.kind === "choice"))
      assert.ok(
        p.quiz.choices.some((o) => o.value === p.quiz.answer),
        course.id + ": " + p.id,
      );
  }
  const store = initialPilotStore(),
    pilot = { catalog: c, data: { courses: {} }, save() {}, leave() {} },
    controller = new CourseController({
      pilot,
      getState: () => ({ ...initialState(), profile }),
      render() {},
      home() {},
      icon() {
        return "";
      },
      playSequence() {},
    });
  controller.open("gd-01");
  controller.close();
  assert.equal(pilot.data.courses["gd-01"].completed, false);
});

test("Canonical evidence crosses guided entry points, without treating unseen positions or courses as validated", () => {
  const catalog = betaCatalog(profile),
    store = simulatedBetaCompletion(profile, catalog),
    data = store.profiles[profile.key],
    e = betaEvidence(catalog, data);
  assert.equal(e.guidedComplete, true);
  assert.ok([...e.scopes.values()].every((e) => e.complete));
  const nav = { ...data, navigation: { route: "guided", chapter: "z1-opens" } },
    started = [];
  const c = {
    catalog,
    data: nav,
    session: { activity: "opens" },
    start: (id) => started.push(id),
  };
  assert.ok(routeChapters(c).includes(catalog.byChapter.get("cs1-f04")));
  continueLearning(c);
  assert.deepEqual(started, ["opens-find"]);
  const empty = {
    attempts: data.attempts.filter((a) => !a.activity.startsWith("z2-")),
    discoveredModules: data.discoveredModules,
    courses: data.courses,
  };
  const partial = betaEvidence(catalog, empty);
  assert.equal(partial.scopes.get("z2").complete, false);
  data.courses["cs1-entry"].completed = false;
  assert.equal(betaEvidence(catalog, data).guidedComplete, false);
});

test("Stable v0 backups retain earlier results and safely round-trip beta course, navigation and fret 12 evidence", () => {
  const catalog = betaCatalog(profile),
    store = simulatedBetaCompletion(profile, catalog),
    before = structuredClone(store),
    restored = validatePilotStore(JSON.parse(JSON.stringify(store)));
  assert.deepEqual(restored, before);
  assert.ok(
    restored.profiles[profile.key].attempts.some((a) =>
      a.events.some((e) => e.target.fret === 12),
    ),
  );
  restored.profiles[profile.key].courses["gd-01"].correct = "invalid";
  assert.throws(() => validatePilotStore(restored));
  const invalid = structuredClone(before);
  invalid.profiles[profile.key].attempts[0].events[0].target.fret = 25;
  assert.throws(() => validatePilotStore(invalid));
});

test("Error review preserves the source scope instead of bringing a fret-12 question back into zone 0–4", () => {
  const c = new PilotController({
    getState: () => ({ ...initialState(), profile }),
    storage: {
      readPilot: () => ({ ok: true, value: initialPilotStore() }),
      savePilot: () => ({ ok: true }),
    },
  });
  c.pendingReview = {
    source: "cs1-note-4-find",
    pool: [{ string: 0, fret: 12, midi: 52 }],
  };
  const module = c.reviewModule("find"),
    q = questionsFor(module)[0];
  assert.deepEqual(module.zone, { start: 0, end: 12 });
  assert.deepEqual(module.strings, [0]);
  assert.equal(pilotCorrect(profile, q, { string: 0, fret: 12 }), true);
});

test("Existing achievement actions remain playable when single-option activities are omitted", () => {
  for (const p of [
    profile,
    makeProfile("bass4"),
    makeProfile("guitar6", "E2 E2 E2 E2 E2 E2"),
  ]) {
    const state = { ...initialState(), profile: p };
    const pilot = new PilotController({
      getState: () => state,
      storage: {
        readPilot: () => ({ ok: true, value: initialPilotStore() }),
        savePilot: () => ({ ok: true }),
      },
    });
    const achievements = new AchievementsController({
      pilot,
      getState: () => state,
    });
    for (const def of achievements.catalogue) {
      const target = achievements.target(def);
      assert.ok(target.kind === 'course' ? betaCourses(p,pilot.catalog).has(target.id) : pilot.resolve(target.id), `${p.key}: ${def.id} → ${target.id}`);
    }
  }
});

test("Historical naming results remain stored but cannot silently certify the new octave-specific open-string task", () => {
  const catalog = betaCatalog(profile),
    store = simulatedBetaCompletion(profile, catalog),
    data = store.profiles[profile.key];
  for (const attempt of data.attempts.filter((a) => a.activity === "opens"))
    for (const event of attempt.events) {
      event.answerKind = "class";
      event.firstAnswer = event.target.midi % 12;
    }
  // This case represents an old raw journal, without precomputed v0.26 proofs.
  delete data.evidence;
  delete data.collectionEvidence;
  assert.equal(
    validatePilotStore(store).profiles[profile.key].attempts.length,
    data.attempts.length,
  );
  assert.equal(betaEvidence(catalog, data).passed("opens"), false);
  assert.equal(betaEvidence(catalog, data).passed("opens-find"), true);
});

test("The quota does not make new-note questions occupy predictable places at the start of every mix", () => {
  const module = betaCatalog(profile).activities.find((a) => a.id === "mix-6"),
    patterns = new Set();
  let firstFresh = 0;
  for (let seed = 1; seed <= 30; seed++) {
    const q = questionsFor(module, { random: rng(seed) });
    firstFresh += Number(q[0].target.midi % 12 === 6);
    patterns.add(
      q.map((x, i) => (x.target.midi % 12 === 6 ? i : "")).join(","),
    );
  }
  assert.ok(firstFresh > 0 && firstFresh < 30);
  assert.ok(patterns.size > 20);
  const unison = betaCatalog(makeProfile("guitar6", "E2 E2 E2 E2 E2 E2"));
  assert.ok(!unison.activities.some((a) => a.id === "opens"));
});
