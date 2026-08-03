// Web Audio API context - created lazily to avoid issues before user interaction
let audioContext: AudioContext | null = null;
let isUnlocked = false;

// Pre-loaded audio buffers for low-latency playback
let noiseBuffers: AudioBuffer[] = [];

// Get or create the AudioContext
function getAudioContext(): AudioContext | null {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioContext;
}

// Pre-create noise buffers for crunch sounds (reused for each play).
// Multiple buffers with varying decay rates give natural variation.
function preloadBuffers(): void {
  const ctx = getAudioContext();
  if (!ctx || noiseBuffers.length > 0) return;

  for (let i = 0; i < 8; i++) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) {
      const decay = Math.exp(-j / (bufferSize * (0.12 + i * 0.06)));
      data[j] = (Math.random() * 2 - 1) * decay;
    }
    noiseBuffers.push(buffer);
  }
}

// Unlock audio for mobile browsers - must be called after user interaction.
// On iOS Safari, resume() alone resolves after the gesture handler returns,
// so we also play a silent buffer synchronously within the gesture to unlock.
// The context can be re-suspended when a mobile tab returns from background,
// so we resume on every call — not just the first.
export function unlockAudio(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  if (!isUnlocked) {
    try {
      const silentBuffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      const source = ctx.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(ctx.destination);
      source.start(0);
      isUnlocked = true;
    } catch {
      // ignore — will retry on next interaction
    }
  }

  preloadBuffers();
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Sound-synthesis primitives
// ---------------------------------------------------------------------------

// A "nom" — the soft, warm mouth closure that starts a bite.
// Two low triangle oscillators sliding downward, shaped by a gentle envelope.
function createNom(
  ctx: AudioContext,
  now: number,
  startFreq: number,
  endFreqRatio: number,
  volume: number,
  duration: number,
  destination: AudioNode
): void {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'triangle';
  osc2.type = 'sine';
  osc2.detune.setValueAtTime(-8, now);

  osc1.frequency.setValueAtTime(startFreq, now);
  osc1.frequency.exponentialRampToValueAtTime(startFreq * endFreqRatio, now + duration);
  osc2.frequency.setValueAtTime(startFreq * 0.5, now);
  osc2.frequency.exponentialRampToValueAtTime(startFreq * 0.5 * endFreqRatio, now + duration);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(900, now);
  filter.Q.setValueAtTime(0.7, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + duration * 0.25);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration + 0.02);
  osc2.stop(now + duration + 0.02);
}

// A chocolate crunch — the thin shell cracking between teeth.
// Bandpass-filtered noise burst; freq/Q control the "crispness" character.
function createCrunch(
  ctx: AudioContext,
  now: number,
  volume: number,
  filterFreq: number,
  filterQ: number,
  duration: number,
  destination: AudioNode
): void {
  if (noiseBuffers.length === 0) preloadBuffers();
  if (noiseBuffers.length === 0) return;

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = pickRandom(noiseBuffers);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(filterFreq, now);
  filter.Q.setValueAtTime(filterQ, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  noiseSource.start(now);
  noiseSource.stop(now + duration + 0.01);
}

// A tiny crumb tick — a short high sine pip for playful crumb texture.
function createCrumbTick(
  ctx: AudioContext,
  now: number,
  freq: number,
  volume: number,
  destination: AudioNode
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.04);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

// ---------------------------------------------------------------------------
// Bite tiers — each produces a slightly different variant on every call
// ---------------------------------------------------------------------------

type BiteParams = {
  nomFreq: number;
  nomEndRatio: number;
  nomVolume: number;
  nomDuration: number;
  crunchFreq: number;
  crunchQ: number;
  crunchVolume: number;
  crunchDuration: number;
  crunchDelay: number;
  crumbFreq: number;
  crumbVolume: number;
  crumbDelay: number;
  masterVolume: number;
};

// Helper: jitter a numeric parameter by ±percent for natural variation
function jitter(value: number, percent: number): number {
  const range = value * percent;
  return value + (Math.random() * 2 - 1) * range;
}

// Tier 1 — small nibble (ears): quiet nom, light crunch, no crumb.
function playNibble(ctx: AudioContext, now: number, dest: AudioNode): void {
  const v = Math.floor(Math.random() * 3);
  const params: BiteParams = {
    nomFreq: jitter(v === 0 ? 280 : v === 1 ? 300 : 260, 0.05),
    nomEndRatio: 0.55,
    nomVolume: jitter(0.05, 0.15),
    nomDuration: jitter(0.08, 0.1),
    crunchFreq: jitter(v === 0 ? 3200 : v === 1 ? 3600 : 3000, 0.05),
    crunchQ: 2.2,
    crunchVolume: jitter(0.06, 0.15),
    crunchDuration: jitter(0.05, 0.1),
    crunchDelay: 0.04,
    crumbFreq: 0,
    crumbVolume: 0,
    crumbDelay: 0,
    masterVolume: 0.42,
  };

  const master = ctx.createGain();
  master.gain.setValueAtTime(params.masterVolume, now);
  master.connect(dest);

  createNom(ctx, now, params.nomFreq, params.nomEndRatio, params.nomVolume, params.nomDuration, master);
  createCrunch(ctx, now + params.crunchDelay, params.crunchVolume, params.crunchFreq, params.crunchQ, params.crunchDuration, master);
}

// Tier 2 — medium chocolate bite (arms/legs): fuller nom, satisfying crunch.
function playMediumBite(ctx: AudioContext, now: number, dest: AudioNode): void {
  const v = Math.floor(Math.random() * 3);
  const params: BiteParams = {
    nomFreq: jitter(v === 0 ? 240 : v === 1 ? 220 : 260, 0.05),
    nomEndRatio: 0.5,
    nomVolume: jitter(0.07, 0.12),
    nomDuration: jitter(0.1, 0.1),
    crunchFreq: jitter(v === 0 ? 3000 : v === 1 ? 3400 : 2800, 0.05),
    crunchQ: 2.0,
    crunchVolume: jitter(0.09, 0.12),
    crunchDuration: jitter(0.07, 0.1),
    crunchDelay: 0.05,
    crumbFreq: jitter(v === 0 ? 1200 : v === 1 ? 1000 : 1400, 0.05),
    crumbVolume: jitter(0.025, 0.15),
    crumbDelay: 0.11,
    masterVolume: 0.48,
  };

  const master = ctx.createGain();
  master.gain.setValueAtTime(params.masterVolume, now);
  master.connect(dest);

  createNom(ctx, now, params.nomFreq, params.nomEndRatio, params.nomVolume, params.nomDuration, master);
  createCrunch(ctx, now + params.crunchDelay, params.crunchVolume, params.crunchFreq, params.crunchQ, params.crunchDuration, master);
  createCrumbTick(ctx, now + params.crumbDelay, params.crumbFreq, params.crumbVolume, master);
}

// Tier 3 — large bite (body): big nom, hollow crunch, crumb.
function playLargeBite(ctx: AudioContext, now: number, dest: AudioNode): void {
  const v = Math.floor(Math.random() * 3);
  const params: BiteParams = {
    nomFreq: jitter(v === 0 ? 200 : v === 1 ? 180 : 220, 0.05),
    nomEndRatio: 0.45,
    nomVolume: jitter(0.09, 0.1),
    nomDuration: jitter(0.12, 0.08),
    crunchFreq: jitter(v === 0 ? 2600 : v === 1 ? 2400 : 2800, 0.05),
    crunchQ: 1.8,
    crunchVolume: jitter(0.12, 0.1),
    crunchDuration: jitter(0.09, 0.08),
    crunchDelay: 0.06,
    crumbFreq: jitter(v === 0 ? 1000 : v === 1 ? 900 : 1100, 0.05),
    crumbVolume: jitter(0.035, 0.12),
    crumbDelay: 0.14,
    masterVolume: 0.52,
  };

  const master = ctx.createGain();
  master.gain.setValueAtTime(params.masterVolume, now);
  master.connect(dest);

  createNom(ctx, now, params.nomFreq, params.nomEndRatio, params.nomVolume, params.nomDuration, master);
  createCrunch(ctx, now + params.crunchDelay, params.crunchVolume, params.crunchFreq, params.crunchQ, params.crunchDuration, master);
  createCrumbTick(ctx, now + params.crumbDelay, params.crumbFreq, params.crumbVolume, master);
}

// Tier 4 — biggest bite (head): rich nom, deep hollow crunch, crumb, slight pause.
function playBiggestBite(ctx: AudioContext, now: number, dest: AudioNode): void {
  const v = Math.floor(Math.random() * 3);
  const params: BiteParams = {
    nomFreq: jitter(v === 0 ? 170 : v === 1 ? 160 : 185, 0.05),
    nomEndRatio: 0.4,
    nomVolume: jitter(0.11, 0.08),
    nomDuration: jitter(0.14, 0.08),
    crunchFreq: jitter(v === 0 ? 2200 : v === 1 ? 2000 : 2400, 0.05),
    crunchQ: 1.6,
    crunchVolume: jitter(0.14, 0.08),
    crunchDuration: jitter(0.11, 0.08),
    crunchDelay: 0.07,
    crumbFreq: jitter(v === 0 ? 900 : v === 1 ? 800 : 1000, 0.05),
    crumbVolume: jitter(0.04, 0.1),
    crumbDelay: 0.17,
    masterVolume: 0.55,
  };

  const master = ctx.createGain();
  master.gain.setValueAtTime(params.masterVolume, now);
  master.connect(dest);

  createNom(ctx, now, params.nomFreq, params.nomEndRatio, params.nomVolume, params.nomDuration, master);
  createCrunch(ctx, now + params.crunchDelay, params.crunchVolume, params.crunchFreq, params.crunchQ, params.crunchDuration, master);
  createCrumbTick(ctx, now + params.crumbDelay, params.crumbFreq, params.crumbVolume, master);

  // A second, softer crumb slightly later to convey the "slight pause" feel
  createCrumbTick(ctx, now + params.crumbDelay + 0.06, params.crumbFreq * 0.7, params.crumbVolume * 0.6, master);
}

// ---------------------------------------------------------------------------
// Main entry — called with the 1-based wrong-guess count.
// Picks the appropriate tier and a random variant within it.
// ---------------------------------------------------------------------------

export function playChomp(wrongGuess: number = 1): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const now = ctx.currentTime;

    if (noiseBuffers.length === 0) {
      preloadBuffers();
    }

    if (wrongGuess <= 2) {
      playNibble(ctx, now, ctx.destination);
    } else if (wrongGuess <= 6) {
      playMediumBite(ctx, now, ctx.destination);
    } else if (wrongGuess === 7) {
      playLargeBite(ctx, now, ctx.destination);
    } else {
      playBiggestBite(ctx, now, ctx.destination);
    }
  } catch {
    // Silently fail if audio isn't available
  }
}
