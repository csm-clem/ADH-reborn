/** Karplus–Strong: a short noise excitation travelling along a damped string. */
export function pluckedString(
  hz,
  sampleRate = 44100,
  seconds = 1.6,
  random = Math.random,
) {
  if (!Number.isFinite(hz) || hz <= 0 || hz > sampleRate / 4)
    throw new Error("Pitch outside synthesis range");
  const samples = new Float32Array(Math.ceil(sampleRate * seconds));
  const delay = sampleRate / hz - 0.5,
    excitation = Math.ceil(delay) + 1;
  const read = (index) => {
    const i = Math.floor(index),
      fraction = index - i;
    return (
      (samples[i] || 0) * (1 - fraction) + (samples[i + 1] || 0) * fraction
    );
  };
  // Higher notes cross the loop more often: compensate to retain a musical decay.
  const damping = Math.exp(-3 / (hz * seconds));
  for (let i = 0; i < samples.length; i++) {
    samples[i] =
      i < excitation
        ? (random() * 2 - 1) * 0.65
        : 0.5 * (read(i - delay) + read(i - delay - 1)) * damping;
    if (i < 48) samples[i] *= i / 48;
  }
  const fade = Math.min(512, samples.length);
  for (let i = 0; i < fade; i++) samples[samples.length - 1 - i] *= i / fade;
  return samples;
}

export function instrumentVoice(instrumentId = "guitar6", preference = "auto") {
  if (
    [
      "guitar-acoustic",
      "guitar-clean",
      "guitar-driven",
      "bass-electric",
    ].includes(preference)
  )
    return preference;
  return instrumentId.startsWith("bass") ? "bass-electric" : "guitar-clean";
}
/** Clean magnetic-pickup timbres: pluck attack, harmonic-dependent decay, no distortion. */
export function electricString(
  hz,
  sampleRate = 44100,
  seconds = 1.8,
  voice = "guitar-clean",
  random = Math.random,
) {
  if (!Number.isFinite(hz) || hz <= 0 || hz > sampleRate / 4)
    throw new Error("Pitch outside synthesis range");
  const bass = voice === "bass-electric",
    partials = bass
      ? [1, 0.95, 0.7, 0.48, 0.32, 0.22, 0.14, 0.09]
      : [1, 0.76, 0.54, 0.4, 0.29, 0.21, 0.15, 0.105, 0.072, 0.048, 0.03],
    out = new Float32Array(Math.ceil(sampleRate * seconds));
  let peak = 0;
  // One oscillator recurrence per partial: no sine/exp calls in the sample loop.
  for (let n = 1; n <= partials.length && hz * n < sampleRate * 0.45; n++) {
    const w =
        (2 * Math.PI * hz * n * (1 + (bass ? 0.000008 : 0.00002) * n * n)) /
        sampleRate,
      co = Math.cos(w),
      si = Math.sin(w),
      decay = Math.exp(
        -((bass ? 1.8 : 2.2) + n * (bass ? 0.2 : 0.38)) / sampleRate,
      );
    let x = 0,
      y = partials[n - 1];
    for (let i = 0; i < out.length; i++) {
      out[i] += x;
      const nx = (x * co + y * si) * decay;
      y = (y * co - x * si) * decay;
      x = nx;
    }
  }
  const attackDecay = Math.exp(-(bass ? 650 : 950) / sampleRate),
    noiseDecay = Math.exp(-500 / sampleRate);
  let attack = 1,
    noise = 1;
  for (let i = 0; i < out.length; i++) {
    out[i] = (1 - attack) * out[i] + (random() * 2 - 1) * 0.025 * noise;
    attack *= attackDecay;
    noise *= noiseDecay;
    peak = Math.max(peak, Math.abs(out[i]));
  }
  const fade = Math.min(512, out.length);
  for (let i = 0; i < out.length; i++) out[i] *= 0.8 / (peak || 1);
  for (let i = 0; i < fade; i++) out[out.length - 1 - i] *= i / fade;
  return out;
}

export function voiceCutoff(hz, voice) {
  return voice === "guitar-acoustic"
    ? Math.min(2800, hz * 9)
    : voice === "bass-electric"
      ? Math.min(6500, hz * 60)
      : Math.min(12000, hz * 56);
}

/** Soft-clipped electric string, with a controlled noisy pick attack. */
export function drivenString(
  hz,
  sampleRate = 44100,
  seconds = 1.8,
  random = Math.random,
) {
  const clean = electricString(hz, sampleRate, seconds, "guitar-clean", random),
    out = new Float32Array(clean.length);
  let low = 0;
  const alpha = 1 - Math.exp((-2 * Math.PI * 5800) / sampleRate);
  for (let i = 0; i < clean.length; i++) {
    const drive = Math.tanh(clean[i] * 5.5) * 0.68;
    low += alpha * (drive - low);
    out[i] = low;
  }
  return out;
}

/** Match audible attack/body power after the same low-pass used for playback.
 * Bass is weighted above 120 Hz to retain audibility on small speakers. Not LUFS certification.
 */
export function audiblePower(samples, sampleRate, hz, voice) {
  const cutoff = Math.min(sampleRate * 0.45, voiceCutoff(hz, voice)),
    w = (2 * Math.PI * cutoff) / sampleRate,
    co = Math.cos(w),
    alpha = Math.sin(w),
    a0 = 1 + alpha;
  const b0 = (1 - co) / 2 / a0,
    b1 = (1 - co) / a0,
    b2 = b0,
    a1 = (-2 * co) / a0,
    a2 = (1 - alpha) / a0;
  const hp = Math.exp((-2 * Math.PI * 120) / sampleRate);
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0,
    prev = 0,
    high = 0,
    sum = 0,
    count = 0;
  const end = Math.min(samples.length, Math.floor(sampleRate * 0.6)),
    start = Math.floor(sampleRate * 0.025);
  for (let i = 0; i < end; i++) {
    const x = samples[i],
      y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
    high = hp * (high + y - prev);
    prev = y;
    const weighted = high + 0.25 * y;
    if (i >= start) {
      sum += weighted * weighted;
      count++;
    }
  }
  return Math.sqrt(sum / Math.max(1, count));
}
export function calibrateVoice(samples, sampleRate, hz, voice) {
  const rms = audiblePower(samples, sampleRate, hz, voice),
    factor = Math.min(12, 0.12 / (rms || 1));
  for (let i = 0; i < samples.length; i++) {
    const x = samples[i] * factor,
      a = Math.abs(x);
    samples[i] =
      a <= 0.8
        ? x
        : Math.sign(x) * (0.8 + 0.12 * (1 - Math.exp(-(a - 0.8) / 0.12)));
  }
  return samples;
}
