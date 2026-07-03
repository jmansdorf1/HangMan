// Web Audio API context - created lazily to avoid issues before user interaction
let audioContext: AudioContext | null = null;
let isUnlocked = false;

// Pre-loaded audio buffers for low-latency playback
let noiseBuffer: AudioBuffer | null = null;

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

// Pre-create the noise buffer for the crunch sound (reused for each play)
function preloadBuffers(): void {
  const ctx = getAudioContext();
  if (!ctx || noiseBuffer) return;

  // Create noise buffer for the crisp "crunch" - 80ms
  const bufferSize = Math.floor(ctx.sampleRate * 0.08);
  noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }
}

// Unlock audio for mobile browsers - must be called after user interaction
export function unlockAudio(): void {
  if (isUnlocked) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Check if context is suspended (mobile browsers start suspended)
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      isUnlocked = true;
      preloadBuffers();
    }).catch(() => {
      // Resume failed, will try again on next interaction
    });
  } else {
    // Context is already running (desktop or already unlocked)
    isUnlocked = true;
    preloadBuffers();
  }
}

// Check if audio is ready to play
export function isAudioReady(): boolean {
  const ctx = getAudioContext();
  return isUnlocked && ctx !== null && ctx.state === 'running';
}

export function playChomp() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Try to unlock if needed (backup for cases where unlock wasn't called)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const now = ctx.currentTime;

    // Ensure buffers are loaded
    if (!noiseBuffer) {
      preloadBuffers();
    }

    // Use pre-loaded buffer if available, otherwise create on-the-fly
    if (noiseBuffer) {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2500, now);
      noiseFilter.Q.setValueAtTime(0.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.08);
    }

    // Low "bite" oscillator - the hollow chocolate snap
    const biteOsc = ctx.createOscillator();
    biteOsc.type = 'triangle';
    const biteGain = ctx.createGain();

    biteOsc.frequency.setValueAtTime(180, now);
    biteOsc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    biteGain.gain.setValueAtTime(0.15, now);
    biteGain.gain.setValueAtTime(0.18, now + 0.015);
    biteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    biteOsc.connect(biteGain);
    biteGain.connect(ctx.destination);

    biteOsc.start(now);
    biteOsc.stop(now + 0.12);

    // Tiny mid-range click for the initial tooth meeting
    const clickOsc = ctx.createOscillator();
    clickOsc.type = 'sine';
    const clickGain = ctx.createGain();

    clickOsc.frequency.setValueAtTime(800, now);
    clickOsc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    clickGain.gain.setValueAtTime(0.12, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.03);
  } catch {
    // Silently fail if audio isn't available
  }
}
