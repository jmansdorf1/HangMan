// Web Audio API context - created lazily to avoid issues before user interaction
let audioContext: AudioContext | null = null;
let isUnlocked = false;

// Pre-loaded audio buffers for low-latency playback
let noiseBuffers: AudioBuffer[] = [];

// Bite size tiers based on wrong guess count
type BiteSize = 'nibble' | 'bite' | 'chomp' | 'crunch';

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

  // Create several noise buffers with different characteristics
  for (let i = 0; i < 5; i++) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.06);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) {
      // Decay envelope built into the noise
      const decay = Math.exp(-j / (bufferSize * (0.2 + i * 0.1)));
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

// Determine bite size based on wrong guess count (1-indexed from gameplay)
function getBiteSize(wrongGuess: number): BiteSize {
  if (wrongGuess <= 2) return 'nibble';      // Ears - small nibble
  if (wrongGuess <= 6) return 'bite';        // Arms/legs - medium bite
  if (wrongGuess === 7) return 'chomp';      // Body - large bite
  return 'crunch';                          // Head - biggest bite
}

// Pick a random element from array
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Create a soft "chomp" oscillator - the mouth closing on chocolate
function createChompOsc(
  ctx: AudioContext,
  now: number,
  baseFreq: number,
  duration: number,
  volume: number,
  destination: AudioNode
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Use soft triangle wave for mouth feel
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(baseFreq * 1.3, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + duration);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + duration * 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(now);
  osc.stop(now + duration);
}

// Create a soft crunch noise burst
function createCrunchNoise(
  ctx: AudioContext,
  now: number,
  duration: number,
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
  filter.Q.setValueAtTime(1.2, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + duration * 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  noiseSource.start(now);
  noiseSource.stop(now + duration);
}

// Create a tiny crumb/particle sound
function createCrumbSound(
  ctx: AudioContext,
  now: number,
  destination: AudioNode
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(now);
  osc.stop(now + 0.04);
}

// Play a nibble sound (wrong guesses 1-2: ears)
function playNibble(ctx: AudioContext, now: number, destination: AudioNode): void {
  // Variant selection
  const variant = Math.floor(Math.random() * 3);

  const baseFreq = variant === 0 ? 350 : variant === 1 ? 380 : 320;
  const duration = variant === 0 ? 0.08 : variant === 1 ? 0.07 : 0.09;
  const volume = 0.06;

  // Very soft chomp
  createChompOsc(ctx, now, baseFreq, duration, volume, destination);

  // Light tick-like crunch
  createCrunchNoise(ctx, now + duration * 0.1, 0.04, 0.04, 4000 + variant * 200, destination);
}

// Play a medium bite sound (wrong guesses 3-6: arms/legs)
function playBite(ctx: AudioContext, now: number, destination: AudioNode): void {
  // Variant selection
  const variant = Math.floor(Math.random() * 3);

  const baseFreq = variant === 0 ? 200 : variant === 1 ? 220 : 180;
  const duration = variant === 0 ? 0.12 : variant === 1 ? 0.1 : 0.14;
  const volume = 0.1;

  // Soft satisfying chomp
  createChompOsc(ctx, now, baseFreq, duration, volume, destination);

  // Medium crunch
  createCrunchNoise(ctx, now + duration * 0.15, 0.05, 0.06, 3000 + variant * 300, destination);

  // Tiny crumb (only in some variants)
  if (variant === 1) {
    createCrumbSound(ctx, now + duration * 0.6, destination);
  }
}

// Play a large chomp sound (wrong guess 7: body)
function playChompSound(ctx: AudioContext, now: number, destination: AudioNode): void {
  // Variant selection
  const variant = Math.floor(Math.random() * 3);

  const baseFreq = variant === 0 ? 140 : variant === 1 ? 160 : 120;
  const duration = variant === 0 ? 0.16 : variant === 1 ? 0.14 : 0.18;
  const volume = 0.14;

  // Big hollow chocolate bite
  createChompOsc(ctx, now, baseFreq, duration, volume, destination);

  // Rich crunch
  createCrunchNoise(ctx, now + duration * 0.1, 0.08, 0.08, 2500 + variant * 200, destination);

  // Crumb particles
  createCrumbSound(ctx, now + duration * 0.5, destination);
  if (variant !== 0) {
    createCrumbSound(ctx, now + duration * 0.65, destination);
  }
}

// Play the biggest crunch sound (wrong guess 8: head)
function playCrunch(ctx: AudioContext, now: number, destination: AudioNode): void {
  // Variant selection
  const variant = Math.floor(Math.random() * 3);

  const baseFreq = variant === 0 ? 100 : variant === 1 ? 110 : 90;
  const duration = variant === 0 ? 0.2 : variant === 1 ? 0.18 : 0.22;
  const volume = 0.16;

  // Big hollow bite with slight pause
  createChompOsc(ctx, now, baseFreq, duration, volume, destination);

  // Full chocolate crunch
  createCrunchNoise(ctx, now + duration * 0.08, 0.1, 0.1, 2000 + variant * 150, destination);

  // Multiple crumb sounds
  createCrumbSound(ctx, now + duration * 0.4, destination);
  createCrumbSound(ctx, now + duration * 0.55, destination);
  if (variant === 2) {
    createCrumbSound(ctx, now + duration * 0.7, destination);
  }

  // Slight trailing crunch
  createCrunchNoise(ctx, now + duration * 0.6, 0.06, 0.04, 1800, destination);
}

// Main playChomp function with progressive bite sizes
export function playChomp(wrongGuess: number = 1): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Try to unlock if needed
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const now = ctx.currentTime;

    // Ensure buffers are loaded
    if (noiseBuffers.length === 0) {
      preloadBuffers();
    }

    // Master gain for overall volume control
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.9, now);
    masterGain.connect(ctx.destination);

    // Play appropriate sound based on bite size
    const biteSize = getBiteSize(wrongGuess);

    switch (biteSize) {
      case 'nibble':
        playNibble(ctx, now, masterGain);
        break;
      case 'bite':
        playBite(ctx, now, masterGain);
        break;
      case 'chomp':
        playChompSound(ctx, now, masterGain);
        break;
      case 'crunch':
        playCrunch(ctx, now, masterGain);
        break;
    }
  } catch {
    // Silently fail if audio isn't available
  }
}
