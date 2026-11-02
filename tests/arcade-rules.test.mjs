import test from 'node:test';
import assert from 'node:assert/strict';
import { arcadeDuration, arcadeBonus, arcadeScope, arcadePool, ARCADE_MODES } from '../arcade-rules.js';
import { arcadeTarget, newArcadeRun, resolveArcade, validateArcadeRecords } from '../arcade-rules.js';
import { ArcadeController } from '../arcade-ui.js';
import { makeProfile } from '../core.js';
import { initialPilotStore, validatePilotStore } from '../pilot.js';

const profile = makeProfile('guitar6');
const target = { string: 0, fret: 0, midi: 40 };

test('Arcade timer decreases in exact 10ms steps and stops at 500ms', () => {
  assert.equal(arcadeDuration(0), 4000);
  for (let i = 1; i <= 350; i++) assert.equal(arcadeDuration(i - 1) - arcadeDuration(i), 10);
  assert.equal(arcadeDuration(351), 500);
  assert.equal(arcadeDuration(Number.MAX_SAFE_INTEGER), 500);
  assert.throws(() => arcadeDuration(-1));
});

test('Bonus points advance difficulty, while timer counts every resolved question', () => {
  const r = newArcadeRun('zones-natural');
  for (let i = 0; i < 100; i++) resolveArcade(r, target, 'correct', 200);
  assert.equal(r.score, 14550); assert.equal(r.stage, 14);
  assert.equal(r.lives, 6); assert.equal(r.combos, 11); assert.equal(r.longest, 100);
  resolveArcade(r, target, 'wrong', 100);
  assert.equal(r.streak, 0); assert.equal(r.lives, 5);
  resolveArcade(r, target, 'correct', 200);
  resolveArcade(r, target, 'timeout', 2980);
  assert.equal(r.streak, 0); assert.equal(r.lives, 4);
  assert.equal(arcadeDuration(r.questions), 2970);
  assert.equal(r.timeSum, 20200);
});

test('A failed combo can be earned again, with lives beyond the initial three', () => {
  const r = newArcadeRun('zones-natural');
  for (let round = 0; round < 3; round++) {
    for (let i = 0; i < 50; i++) resolveArcade(r, target, 'correct', 100);
    assert.equal(r.lives, 4); resolveArcade(r, target, 'wrong', 100);
  }
  assert.equal(r.combos, 18); assert.equal(r.earnedLives, 3); assert.equal(r.longest, 50);
});

test('Completed records survive backup validation without changing learning evidence', () => {
  const r = newArcadeRun('zones-natural');
  for (let i = 0; i < 100; i++) resolveArcade(r, target, 'correct', 123);
  while (!r.finished) resolveArcade(r, target, 'wrong', 200);
  r.at = Date.now();
  const data = { version: 1, records: { [r.mode]: r } };
  assert.equal(validateArcadeRecords(data, profile), data);
  const store = initialPilotStore();
  store.profiles[profile.key] = {profile, attempts: [], later: [], arcade: data};
  const restored = validatePilotStore(JSON.parse(JSON.stringify(store)));
  assert.deepEqual(restored.profiles[profile.key].arcade, data);
  assert.equal(restored.profiles[profile.key].evidence, undefined);
  assert.deepEqual(restored.achievements, []);
  const bad = structuredClone(data); bad.records[r.mode].score++;
  assert.throws(() => validateArcadeRecords(bad, profile));
});

test('New scopes enter with one question in five and do not immediately repeat a position', () => {
  const old = new Set(arcadePool(profile, 'zones-natural', 0).map(p => `${p.string}:${p.fret}`));
  for (let i = 0; i < 25; i++) {
    const p = arcadeTarget(profile, 'zones-natural', 1, i, null, () => 0);
    assert.equal(old.has(`${p.string}:${p.fret}`), i % 5 !== 0);
  }
  const a = arcadeTarget(profile, 'zones-natural', 0, 0, null, () => 0);
  const b = arcadeTarget(profile, 'zones-natural', 0, 1, a, () => 0);
  assert.notDeepEqual(a,b);
});

test('Question identity, expiry races, corrections, transitions and pauses use active time', () => {
  let now = 0;
  const previousRAF = globalThis.requestAnimationFrame, previousCancel = globalThis.cancelAnimationFrame;
  globalThis.requestAnimationFrame = () => 1; globalThis.cancelAnimationFrame = () => {};
  try {
    const c = new ArcadeController({getState: () => ({profile}),root: {querySelector:()=>null,querySelectorAll:()=>[]},render(){},playNote(){},playBonus(){},stopAudio(){}}, {now:()=>now, random:()=>0});
    c.start('zones-natural');assert.equal(c.phase,'ready');now=1000;c.tick(); const first = c.serial;
    now = 1070; c.answer(c.target.midi % 12, first); assert.equal(c.run.questions, 0);
    now = 1090; c.tick(); c.answer(c.target.midi % 12, first);
    assert.equal(c.run.correct, 1); assert.equal(c.run.timeMin, 90);
    c.answer(c.target.midi % 12, first); assert.equal(c.run.questions,1);
    now = 6000; c.answer(c.target.midi % 12, c.serial);
    assert.equal(c.run.timeouts,1); assert.equal(c.run.streak,0); assert.equal(c.run.lives,2);
    assert.equal(c.phase,'correction'); assert.equal(c.duration,3980);
    now += 599; c.tick(); assert.equal(c.phase,'correction');
    now++; c.tick(); assert.equal(c.phase,'transition'); assert.equal(c.clock.elapsed(),0);
    now += 100; c.tick(); c.pause(); now += 10000; c.tick();
    assert.equal(c.clock.elapsed(),100); c.resume(); assert.equal(c.clock.elapsed(),100);
  } finally { globalThis.requestAnimationFrame = previousRAF; globalThis.cancelAnimationFrame = previousCancel; }
});

test('All requested combo milestones award their exact points and lives', () => {
  const points = [100, 200, 300, 400, 500, 500, 500, 500, 500, 1000, 1000, 1000];
  points.forEach((value, i) => assert.deepEqual(arcadeBonus((i + 1) * 10), {
    points: value, lives: i === 4 ? 1 : i === 9 ? 2 : 0,
  }));
  for (const streak of [0, 1, 9, 11, 99, 101, 119]) assert.deepEqual(arcadeBonus(streak), { points: 0, lives: 0 });
  assert.deepEqual(arcadeBonus(5), {points:50,lives:0});
  assert.deepEqual(arcadeBonus(200), { points: 1000, lives: 0 });
});

test('Zone expansion adds individual strings then the six cumulative zones', () => {
  assert.deepEqual(arcadeScope('zones-natural', 6, 0).strings, [0, 1]);
  assert.equal(arcadeScope('zones-natural', 6, 4).end, 4);
  assert.equal(arcadeScope('zones-natural', 6, 5).end, 8);
  assert.equal(arcadeScope('zones-natural', 6, 19).end, 24);
});

test('String expansion finishes 12 frets before extending to 24 on every instrument', () => {
  for (const count of [4, 5, 6, 7, 8]) {
    assert.deepEqual(arcadeScope('strings-natural', count, 0).strings, [0]);
    assert.equal(arcadeScope('strings-natural', count, count - 1).strings.length, count);
    assert.equal(arcadeScope('strings-natural', count, count - 1).end, 12);
    assert.equal(arcadeScope('strings-natural', count, count).end, 24);
  }
});

test('Four modes preserve prior positions, deduplicate boundaries and respect actual tuning', () => {
  for (const tuning of [[40,45,50,55,59,64], [30,35,40,45], [39,44,49,54,58,63,68]]) {
    for (const mode of ARCADE_MODES) {
      let previous = new Set();
      for (let stage = 0; stage < 15; stage++) {
        const pool = arcadePool({ tuning }, mode, stage);
        const keys = new Set(pool.map(p => `${p.string}:${p.fret}`));
        assert.equal(keys.size, pool.length);
        for (const key of previous) assert.ok(keys.has(key));
        for (const p of pool) {
          assert.equal(p.midi, tuning[p.string] + p.fret);
          if (mode.endsWith('-natural')) assert.ok([0,2,4,5,7,9,11].includes(p.midi % 12));
        }
        previous = keys;
      }
    }
  }
});
