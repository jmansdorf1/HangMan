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

// Pre-create noise buffers for crunch sounds (reused for each play)
function preloadBuffers(): void {
  const ctx = getAudioContext();
  if (!ctx || noiseBuffers.length > 0) return;

  for (let i = 0; i < 5; i++) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) {
      const decay = Math.exp(-j / (bufferSize * (0.15 + i * 0.08)));
      data[j] = (Math.random() * 2 - 1) * decay;
    }
    noiseBuffers.push(buffer);
  }
}

// Unlock audio for mobile browsers - must be called after user interaction
export function unlockAudio(): void {
  if (isUnlocked) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      isUnlocked = true;
      preloadBuffers();
    }).catch(() => {});
  } else {
    isUnlocked = true;
    preloadBuffers();
  }
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// A crisp, short crunch — the thin chocolate shell cracking.
// High-frequency bandpass noise burst with very fast decay.
function createCrunch(
  ctx: AudioContext,
  now: number,
  volume: number,
  filterFreq: number,
  destination: AudioNode
): void {
  if (noiseBuffers.length === 0) preloadBuffers();
  if (noiseBuffers.length === 0) return;

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = pickRandom(noiseBuffers);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(filterFreq, now);
  filter.Q.setValueAtTime(2.5, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  noiseSource.start(now);
  noiseSource.stop(now + 0.08);
}

// A soft bite — teeth sinking into hollow chocolate.
// A short, mid-frequency pluck with a quick decay; never a low thump.
function createSoftBite(
  ctx: AudioContext,
  now: number,
  baseFreq: number,
  volume: number,
  destination: AudioNode
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.06);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(now);
  osc.stop(now + 0.11);
}

// A tiny crumb tick — a couple of small high sine pips for playful texture.
function createCrumbTick(
  ctx: AudioContext,
  now: number,
  destination: AudioNode
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(now);
  osc.stop(now + 0.035);
}

// Main entry: one crisp chocolate chomp per body part removed.
// Shape: short shell crunch -> soft bite -> optional crumb tick.
// Total under 500ms, moderate volume, playful not violent.
export function playChomp(_wrongGuess: number = 1): void {
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

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.5, now);
    masterGain.connect(ctx.destination);

    const variant = Math.floor(Math.random() * 3);
    const crunchFreq = 4200 + variant * 250;
    const biteFreq = variant === 0 ? 520 : variant === 1 ? 560 : 480;

    // 1. Crisp shell crunch (the "snap" of biting into hollow chocolate)
    createCrunch(ctx, now, 0.14, crunchFreq, masterGain);

    // 2. Soft bite immediately after the crunch
    createSoftBite(ctx, now + 0.05, biteFreq, 0.09, masterGain);

    // 3. Playful crumb tick in some variants
    if (variant !== 0) {
      createCrumbTick(ctx, now + 0.09, masterGain);
    }
  } catch {
    // Silently fail if audio isn't available
  }
}
