import test from "node:test";
import assert from "node:assert/strict";
import { makeProfile } from "../core.js";
import { initialState } from "../state.js";
import { betaCatalog, betaEvidence } from "../beta-catalog.js";
import { betaCourses, coursePage } from "../beta-courses.js";
import { CourseController } from "../course-ui.js";
import { PilotController } from "../pilot-ui.js";
import { startChapter, betaHome } from "../beta-home.js";
import { preserveLearningProofs } from "../learning-evidence.js";
import { simulatedBetaCompletion } from "../debug-mode.js";
import {
  initialPilotStore,
  validatePilotStore,
  questionsFor,
} from "../pilot.js";
import { personalRecord } from "../results.js";
import { reviewRecommendation } from "../navigation-rules.js";
import { progressView } from "../progress.js";
import {
  electricString,
  pluckedString,
  drivenString,
  calibrateVoice,
  audiblePower,
} from "../sound.js";
import { createAudioService } from "../services/audio-service.js";
const profile = makeProfile("guitar6"),
  catalog = betaCatalog(profile);
const controller = () =>
  new PilotController({
    storage: {
      readPilot: () => ({ value: initialPilotStore(), ok: true }),
      savePilot: () => ({ ok: true }),
    },
    getState: () => ({ ...initialState(), profile }),
    showPilot() {},
    stopAudio() {},
    unlockAudio() {},
    icon() {
      return "";
    },
  });
test("Chapter primary action resumes the exact saved session instead of starting a replacement", () => {
  const data = {
    navigation: { route: "z1" },
    session: { activity: "opens", index: 3, id: "saved", completed: false },
  };
  const started = [];
  startChapter(
    {
      catalog,
      data,
      save() {},
      start(...args) {
        started.push(args);
      },
    },
    "z1-opens",
  );
  assert.deepEqual(started, [["opens", true]]);
  assert.equal(data.session.index, 3);
});
test("Solved examples are distinct from first evaluated answers without disturbing quotas or queue order", () => {
  const c = controller();
  for (const id of ["opens", "opens-find", "note-4", "mix-4-find"]) {
    const a = c.resolve(id);
    const queue = questionsFor(a);
    c.session = { activity: id, stage: "practice", queue, index: 0 };
    const example = c.demonstrationQuestion;
    assert.notDeepEqual(example.target, queue[0].target, id);
    if (queue[0].mode === "name")
      assert.notEqual(example.target.midi, queue[0].target.midi);
    const before = JSON.stringify(queue);
    c.separateDemonstration({ kind: queue[0].mode });
    assert.equal(JSON.stringify(queue), before);
  }
});
test("Durable chapter proofs, statistics and same-exercise records survive journal rotation and backup restore", () => {
  const store = simulatedBetaCompletion(profile, catalog),
    data = store.profiles[profile.key];
  preserveLearningProofs(catalog, data);
  const before = betaEvidence(catalog, data);
  assert.ok(before.guidedComplete);
  const stats = JSON.stringify(data.evidence.stats);
  preserveLearningProofs(catalog, data);
  assert.equal(
    JSON.stringify(data.evidence.stats),
    stats,
    "must not double-count old attempts",
  );
  // The extended debug journal has rotated its earliest legacy attempts.
  const original = simulatedBetaCompletion(profile, betaCatalog(profile, {full:false})).profiles[profile.key].attempts.find((a) => a.activity === "opens");
  assert.ok(original);
  for (let i = 0; i < 1100; i++) {
    data.attempts.push({ ...original, id: "new-" + i, at: Date.now() + i });
    preserveLearningProofs(catalog, data);
    data.attempts = data.attempts.slice(-250);
  }
  assert.ok(betaEvidence(catalog, data).guidedComplete);
  assert.equal(betaEvidence(catalog, data).scopes.get("z1").chapters, 14);
  const restored = validatePilotStore(JSON.parse(JSON.stringify(store)))
    .profiles[profile.key];
  assert.ok(betaEvidence(catalog, restored).guidedComplete);
  const records = Object.values(restored.evidence.records).flat();
  assert.ok(records.some((a) => a.activity === "z3-mix-10-find"));
  const session = {
    id: "future",
    activity: "z3-mix-10-find",
    events: catalog.activities
      .find((a) => a.id === "z3-mix-10-find")
      .pool.map((target) => ({
        target,
        mode: "find",
        correct: true,
        retry: false,
        aids: [],
        ms: 100,
      })),
  };
  assert.notEqual(personalRecord(session, records).kind, "first");
});
test("All GD-04 profiles require naming a shown point and locating a requested pitch", () => {
  for (const p of [profile, makeProfile("guitar6", "C1 C2 C3 C4 C5 C6")]) {
    const c = betaCourses(p, betaCatalog(p)).get("gd-04");
    assert.ok(
      c.pages.find((p) => p.id === "name-point" && p.quiz.kind === "choice"),
    );
    assert.ok(
      c.pages.find((p) => p.id === "find-point" && p.quiz.kind === "position"),
    );
  }
});
test("Wrong course answers produce another figure and retain a valid reachable target", () => {
  const courses = betaCourses(profile, catalog),
    pilot = { catalog, data: { courses: {} }, save() {}, leave() {} };
  const c = new CourseController({
    pilot,
    getState: () => ({ ...initialState(), profile }),
    render() {},
    home() {},
    playSequence() {},
    icon() {
      return "";
    },
  });
  c.open("gd-01");
  c.record.index = 7;
  const before = c.page;
  c.answer("neck");
  assert.equal(c.page.variant, before.variant + 1);
  assert.notEqual(c.page.variant, before.variant);
  assert.ok(!c.record.correct.includes(before.id));
  for (const co of courses.values())
    for (const p of co.pages.filter((p) => p.quiz?.kind === "position")) {
      const changed = coursePage(co, {
        index: co.pages.indexOf(p),
        variants: { [p.id]: 1 },
      });
      const scope = catalog.byScope.get(co.scopeId);
      assert.ok(
        changed.quiz.target.fret >= scope.zone.start &&
          changed.quiz.target.fret <= scope.zone.end,
      );
      if (co.id.startsWith("cs"))
        assert.equal(changed.quiz.target.string, scope.plan.strings[0]);
    }
});
test("Only three branch tiles appear at root; every path is nested and the guided synthesis is visible", () => {
  const c = controller();
  const root = betaHome(c);
  assert.equal((root.match(/class="branch-jumbo"/g) || []).length, 3);
  assert.doesNotMatch(root, /class="panel route-card"/);
  c.data.navigation = { branch: "targeted" };
  assert.equal(
    (betaHome(c).match(/class="panel route-card"/g) || []).length,
    25,
  );
  c.data.navigation = { branch: "guided", route: "guided" };
  const route = betaHome(c);
  assert.match(route, /Vos repères du Niveau 1/);
  assert.match(route, /positions vérifiées/);
});
test("Return recommendations react to a real delay or a failed attempt, without locking chapters", () => {
  const a = catalog.activities[0],
    events = questionsFor(a).map((q) => ({
      ...q,
      correct: true,
      aids: [],
      ms: 500,
    })),
    old = { activity: a.id, finished: true, passed: true, at: 100, events };
  assert.equal(
    reviewRecommendation(catalog, { attempts: [old] }, "z1", 200),
    null,
  );
  assert.equal(
    reviewRecommendation(catalog, { attempts: [old] }, "z1", 100 + 86400000)
      .kind,
    "return",
  );
  assert.equal(
    reviewRecommendation(
      catalog,
      {
        attempts: [
          { ...old, passed: false, events: [{ ...events[0], correct: false }] },
        ],
      },
      "z1",
      200,
    ).kind,
    "errors",
  );
});
test("The full progress board has 25 positions per string and no scope selector", () => {
  const html = progressView(profile, [], []);
  assert.equal((html.match(/class="progress-cell /g) || []).length, 150);
  assert.match(html, /case 24/);
  assert.match(html, /progress-edge-fade/);
  assert.doesNotMatch(html, /beta-stats/);
});
test("Playback calibration brings different timbres close in audible attack power without clipping", () => {
  let seed = 23;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (const hz of [30.9, 41.2, 82.4, 164.8, 329.6]) {
    const dB = [];
    for (const voice of [
      "guitar-acoustic",
      "guitar-clean",
      "guitar-driven",
      "bass-electric",
    ]) {
      const raw =
        voice === "guitar-acoustic"
          ? pluckedString(hz, 22050, 1.8, rand)
          : voice === "guitar-driven"
            ? drivenString(hz, 22050, 1.8, rand)
            : electricString(hz, 22050, 1.8, voice, rand);
      const pcm = calibrateVoice(raw, 22050, hz, voice);
      assert.ok(pcm.every((x) => Number.isFinite(x) && Math.abs(x) <= 0.921));
      dB.push(20 * Math.log10(audiblePower(pcm, 22050, hz, voice)));
    }
    assert.ok(
      Math.max(...dB) - Math.min(...dB) < 4,
      JSON.stringify({ hz, dB }),
    );
  }
});
test("Foreground unmuted audio remains warm; mute, background and disposal disconnect warmth", async () => {
  let pref = { sound: true, voice: "auto", profile: null },
    stops = 0,
    starts = 0;
  const param = () => ({
    value: 0,
    setValueAtTime() {},
    linearRampToValueAtTime() {},
  });
  const ctx = {
    state: "running",
    sampleRate: 8000,
    currentTime: 0,
    destination: {},
    resume: async () => {},
    close: async () => {},
    createOscillator: () => ({
      frequency: param(),
      connect() {},
      disconnect() {},
      start() {
        starts++;
      },
      stop() {
        stops++;
      },
    }),
    createGain: () => ({ gain: param(), connect() {}, disconnect() {} }),
  };
  const engine = createAudioService({
    getState: () => pref,
    createContext: () => ctx,
  });
  await engine.unlockAudio();
  await engine.unlockAudio();
  assert.equal(starts, 1);
  engine.setForeground(false);
  assert.equal(stops, 1);
  engine.setForeground(true);
  assert.equal(starts, 2);
  pref = { ...pref, sound: false };
  engine.preferencesChanged(pref, { ...pref, sound: true });
  assert.equal(stops, 2);
  await engine.dispose();
});

test("Older completed beginner courses reopen at the first newly required step without erasing old answers", () => {
  const c = controller();
  c.data.courses = {
    "gd-04": {
      index: 4,
      visited: [
        "octave",
        "same-name",
        "higher-pitch",
        "same-height",
        "same-height-check",
      ],
      correct: ["same-name", "higher-pitch", "same-height-check"],
      completed: true,
    },
  };
  const course = betaCourses(profile, c.catalog).get("gd-04"),
    r = c.data.courses["gd-04"];
  assert.equal(r.completed, false);
  assert.equal(course.pages[r.index].id, "actions-example");
  assert.ok(r.correct.includes("same-name"));
});

test("Repeated wrong answers keep changing the coordinate example rather than looping on the first correction", () => {
  const courses = betaCourses(profile, catalog);
  for (const co of courses.values())
    for (const p of co.pages.filter((p) => p.quiz?.kind === "position")) {
      const index = co.pages.indexOf(p),
        a = coursePage(co, { index, variants: { [p.id]: 1 } }),
        b = coursePage(co, { index, variants: { [p.id]: 2 } });
      assert.notDeepEqual(a.quiz.target, b.quiz.target, co.id + ":" + p.id);
    }
});
