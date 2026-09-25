// Web Audio API sci-fi audio synthesizer for RHXVM
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context policy safe ignore
    }
  }

  // Futuristic interaction sounds
  public click() {
    this.playTone(840, 0.04, 'sine', 0.05);
  }

  public tick() {
    this.playTone(1100, 0.02, 'sine', 0.03);
  }

  public lockIn() {
    // 5-second countdown warning pulse
    this.playTone(320, 0.12, 'sawtooth', 0.06);
  }

  public win() {
    // Dual resonant harmonic
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.22, 'sine', 0.08);
      }, idx * 60);
    });
  }

  public jackpot() {
    // Hyper-resonant pair hit
    [587.33, 739.99, 880.0, 1174.66, 1479.98].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.32, 'triangle', 0.1);
      }, idx * 65);
    });
  }

  public miss() {
    // Muted low-frequency tone
    this.playTone(160, 0.16, 'sine', 0.05);
  }

  public levelUp() {
    // Spectral progression chime
    [440, 554.37, 659.25, 880, 1108.73].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.26, 'sine', 0.09);
      }, idx * 75);
    });
  }

  public copy() {
    this.playTone(980, 0.06, 'sine', 0.07);
    setTimeout(() => this.playTone(1320, 0.08, 'sine', 0.07), 70);
  }
}

export const soundService = new SoundEngine();
