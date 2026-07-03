const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

export function playChomp() {
  try {
    const now = audioContext.currentTime;

    // Create noise buffer for the crisp "crunch"
    const bufferSize = audioContext.sampleRate * 0.08;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Filter the noise to make it more "chocolate-like" - less harsh
    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2500, now);
    noiseFilter.Q.setValueAtTime(0.8, now);

    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.08);

    // Low "bite" oscillator - the hollow chocolate snap
    const biteOsc = audioContext.createOscillator();
    biteOsc.type = 'triangle';
    const biteGain = audioContext.createGain();

    biteOsc.frequency.setValueAtTime(180, now);
    biteOsc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    biteGain.gain.setValueAtTime(0.15, now);
    biteGain.gain.setValueAtTime(0.18, now + 0.015);
    biteGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    biteOsc.connect(biteGain);
    biteGain.connect(audioContext.destination);

    biteOsc.start(now);
    biteOsc.stop(now + 0.12);

    // Tiny mid-range click for the initial tooth meeting
    const clickOsc = audioContext.createOscillator();
    clickOsc.type = 'sine';
    const clickGain = audioContext.createGain();

    clickOsc.frequency.setValueAtTime(800, now);
    clickOsc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    clickGain.gain.setValueAtTime(0.12, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    clickOsc.connect(clickGain);
    clickGain.connect(audioContext.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.03);
  } catch {
  }
}
