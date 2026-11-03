/** Arcade primitives. Session policy is owned by the controller, not this module. */
export const ARCADE_MODES = Object.freeze([
  'zones-natural', 'zones-chromatic', 'strings-natural', 'strings-chromatic',
]);
export const ARCADE_ZONES = Object.freeze([
  [0, 4], [4, 8], [8, 12], [12, 16], [16, 20], [20, 24],
].map(zone => Object.freeze(zone)));

/** The caller supplies the number of elapsed acceleration steps. Integer ms only. */
export function arcadeDuration(steps) {
  if (!Number.isSafeInteger(steps) || steps < 0) throw new RangeError('Invalid timer step');
  return Math.max(500, 4000 - 10 * Math.min(steps, 350));
}

/** A reward is emitted once on reaching an exact streak milestone. */
export function arcadeBonus(streak) {
  if (!Number.isSafeInteger(streak) || streak < 0) throw new RangeError('Invalid streak');
  if (streak === 5) return { points: 50, lives: 0 };
  if (!streak || streak % 10) return { points: 0, lives: 0 };
  if (streak < 50) return { points: streak * 10, lives: 0 };
  if (streak === 50) return { points: 500, lives: 1 };
  if (streak < 100) return { points: 500, lives: 0 };
  return { points: 1000, lives: streak === 100 ? 2 : 0 };
}

/** Each stage adds one string, then one zone; all previous positions remain. */
export function arcadeScope(mode, stringCount, stage) {
  if (!ARCADE_MODES.includes(mode)) throw new RangeError('Invalid Arcade mode');
  if (!Number.isSafeInteger(stringCount) || stringCount < 2) throw new RangeError('Invalid strings');
  if (!Number.isSafeInteger(stage) || stage < 0) throw new RangeError('Invalid stage');
  const zones = mode.startsWith('zones-');
  const strings = Math.min(stringCount, (zones ? 2 : 1) + stage);
  const expansion=Math.max(0,stage-(stringCount-2)),zoneCount=zones?Math.min(6,1+Math.ceil(expansion/3)):null,zonePhase=zones&&expansion>0&&expansion<=15?['discover','bridge','mix'][(expansion-1)%3]:'mix';
  return {
    zonePhase,focusZone:zones&&zonePhase!=='mix'?ARCADE_ZONES[zoneCount-1]:null,
    strings: Array.from({ length: strings }, (_, i) => i),
    start: 0,
    end: zones ? ARCADE_ZONES[zoneCount - 1][1] : stage >= stringCount ? 24 : 12,
    zoneCount,
    chromatic: mode.endsWith('-chromatic'),
  };
}

/** Tuning is stored from the lowest physical string to the highest in DFT. */
export function arcadePool(profile, mode, stage) {
  if (!profile?.tuning?.length || !profile.tuning.every(Number.isInteger)) throw new TypeError('Invalid tuning');
  const scope = arcadeScope(mode, profile.tuning.length, stage);
  const natural = new Set([0, 2, 4, 5, 7, 9, 11]);
  return scope.strings.flatMap(string => Array.from({ length: scope.end + 1 }, (_, fret) => ({
    string, fret, midi: profile.tuning[string] + fret,
  }))).filter(p => scope.chromatic || natural.has(((p.midi % 12) + 12) % 12));
}

export const ARCADE_RULESET = 1;

/** No profile-based adaptation: a small, fixed share introduces the new scope. */
export function arcadeTarget(profile, mode, stage, index, previous, random = Math.random) {
  const pool = arcadePool(profile, mode, stage);
  const old = stage ? arcadePool(profile, mode, stage - 1) : pool;
  const keys = new Set(old.map(p => `${p.string}:${p.fret}`));
  const added = pool.filter(p => !keys.has(`${p.string}:${p.fret}`));
  if(mode.startsWith('zones-')&&stage>=profile.tuning.length-1){const scope=arcadeScope(mode,profile.tuning.length,stage),zone=scope.focusZone;let p=pool;if(zone&&scope.zonePhase==='discover')p=pool.filter(p=>p.fret>=zone[0]&&p.fret<=zone[1]);else if(zone&&scope.zonePhase==='bridge')p=pool.filter(p=>Math.floor(index/3)%2===0?p.fret>=zone[0]:p.fret>=zone[0]-4&&p.fret<zone[0]);if(p.length>1)p=p.filter(p=>p.string!==previous?.string||p.fret!==previous?.fret);return p[Math.min(p.length-1,Math.floor(random()*p.length))];}
  let candidates = stage && added.length ? (index % 5 === 0 ? added : old) : pool;
  if (candidates.length > 1) candidates = candidates.filter(p => p.string !== previous?.string || p.fret !== previous?.fret);
  return candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))];
}

export function newArcadeRun(mode) {
  if (!ARCADE_MODES.includes(mode)) throw new RangeError('Invalid Arcade mode');
  return { rules: ARCADE_RULESET, mode, questions: 0, correct: 0, errors: 0, timeouts: 0,
    score: 0, bonusPoints: 0, lives: 3, earnedLives: 0, streak: 0, longest: 0,
    combos: 0, stage: 0, timeSum: 0, timeMin: null, timeMax: null, positions: {}, finished: false };
}

/** One invocation per question, guarded by the session's question identity. */
export function resolveArcade(run, target, outcome, ms) {
  if (run.finished) return null;
  if (!['correct', 'wrong', 'timeout'].includes(outcome) || !Number.isFinite(ms) || ms < 0) throw new RangeError('Invalid resolution');
  const correct = outcome === 'correct';
  const key = `${target.string}:${target.fret}`;
  const position = run.positions[key] ||= { total: 0, correct: 0, errors: 0, timeouts: 0, timeSum: 0 };
  position.total++;
  run.questions++;
  let bonus = { points: 0, lives: 0 };
  if (correct) {
    position.correct++; position.timeMin = position.timeMin===undefined?ms:Math.min(position.timeMin,ms); position.timeMax = position.timeMax===undefined?ms:Math.max(position.timeMax,ms); position.timeSum = (position.timeSum || 0) + ms; run.correct++; run.streak++;
    run.longest = Math.max(run.longest, run.streak);
    bonus = arcadeBonus(run.streak);
    if (bonus.points) run.combos++;
    run.score += 100 + bonus.points;
    run.bonusPoints += bonus.points;
    run.lives += bonus.lives; run.earnedLives += bonus.lives;
    run.timeSum += ms;
    run.timeMin = run.timeMin === null ? ms : Math.min(run.timeMin, ms);
    run.timeMax = run.timeMax === null ? ms : Math.max(run.timeMax, ms);
  } else {
    position[outcome === 'timeout' ? 'timeouts' : 'errors']=(position[outcome === 'timeout' ? 'timeouts' : 'errors']||0)+1;
    run[outcome === 'timeout' ? 'timeouts' : 'errors']++;
    run.lives--; run.streak = 0;
  }
  run.stage = Math.floor(run.score / 1000);
  run.finished = run.lives === 0;
  return bonus;
}

/** Bounded durable records; Arcade never writes learning evidence or unlocks activities. */
export function validateArcadeRecords(value, profile) {
  if(value?.bests!==undefined){if(!value.bests||typeof value.bests!=='object'||Array.isArray(value.bests)||Object.keys(value.bests).some(k=>!ARCADE_MODES.includes(k)))throw Error('Records invalides');for(const best of Object.values(value.bests))for(const key of ['correct','combos','longest'])if(!Number.isSafeInteger(best?.[key])||best[key]<0)throw Error('Record invalide');}
  if(value?.longest!==undefined&&(!Number.isSafeInteger(value.longest)||value.longest<0))throw new Error('Record de série invalide.');
  if (!value || value.version !== 1 || !value.records || typeof value.records !== 'object' || Array.isArray(value.records) || Object.keys(value.records).length > 4) throw new Error('Records Arcade invalides.');
  for (const [mode, r] of Object.entries(value.records)) {
    const integer = key => Number.isSafeInteger(r?.[key]) && r[key] >= 0;
    if (!ARCADE_MODES.includes(mode) || !r || r.rules !== ARCADE_RULESET || r.mode !== mode || r.finished !== true ||
      !['questions','correct','errors','timeouts','score','bonusPoints','lives','earnedLives','streak','longest','combos','stage','at'].every(integer) ||
      r.questions !== r.correct + r.errors + r.timeouts || r.score !== r.correct * 100 + r.bonusPoints ||
      r.lives !== 0 || r.errors + r.timeouts !== 3 + r.earnedLives || r.longest > r.correct || r.combos > Math.floor(r.correct / 5) ||
      r.stage !== Math.floor(r.score / 1000) || !Number.isFinite(r.timeSum) || r.timeSum < 0 ||
      ![r.timeMin, r.timeMax].every(n => n === null || Number.isFinite(n) && n >= 0) ||
      !r.positions || typeof r.positions !== 'object' || Array.isArray(r.positions) || Object.keys(r.positions).length > profile.tuning.length * 25) throw new Error('Record Arcade invalide.');
    let total = 0, correct = 0;
    for (const [key, p] of Object.entries(r.positions)) {
      const [s, f] = key.split(':').map(Number);
      for(const field of ['errors','timeouts'])if(p?.[field]!==undefined&&(!Number.isSafeInteger(p[field])||p[field]<0||p[field]>p.total-p.correct))throw new Error('Erreur Arcade invalide.');
      for(const field of ['timeMin','timeMax'])if(p?.[field]!==undefined&&(!Number.isFinite(p[field])||p[field]<0))throw new Error('Temps Arcade invalide.');
      if(p?.timeMin!==undefined&&p?.timeMax!==undefined&&p.timeMin>p.timeMax)throw new Error('Temps Arcade incohérents.');
      if (p?.timeSum !== undefined && (!Number.isFinite(p.timeSum) || p.timeSum < 0)) throw new Error('Temps Arcade invalide.');
      if (!/^\d:\d{1,2}$/.test(key) || s >= profile.tuning.length || f > 24 || !p || !Number.isSafeInteger(p.total) || !Number.isSafeInteger(p.correct) || p.correct < 0 || p.total < p.correct) throw new Error('Position Arcade invalide.');
      total += p.total; correct += p.correct;
    }
    if (total !== r.questions || correct !== r.correct) throw new Error('Statistiques Arcade invalides.');
  }
  return value;
}

/** Shared boundaries belong to the lower zone: 0 and 4 share the first frame. */
export function arcadeZoneWindow(fret,current=null){
 if(current&&fret>=current[0]&&fret<=current[1])return current;
 const i=Math.min(5,Math.max(0,Math.ceil(fret/4)-1));return ARCADE_ZONES[i];
}
