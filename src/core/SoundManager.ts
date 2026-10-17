/**
 * SoundManager: Sintetizador de audio retro-futurista vía Web Audio API.
 * Genera efectos cibernéticos puros (ticks, alarmas de pánico, clics mecánicos,
 * cortes de cable, estática glitch, explosión y fanfarria de victoria)
 * sin requerir dependencias ni archivos de audio externos.
 */
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private alarmOscillator: OscillatorNode | null = null;
  private alarmGain: GainNode | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopPanicAlarm();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playTick(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  }

  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  }

  public playWireCut(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Sonido de tijeras / chasquido metálico
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  public playGlitch(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150 + Math.random() * 800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80 + Math.random() * 300, ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  public playSuccess(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.22);
    });
  }

  public playStrike(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Buzzer estridente de error
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  }

  public startPanicAlarm(): void {
    if (this.isMuted || this.alarmOscillator) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      this.alarmOscillator = ctx.createOscillator();
      this.alarmGain = ctx.createGain();

      this.alarmOscillator.type = 'sawtooth';
      this.alarmOscillator.frequency.setValueAtTime(440, ctx.currentTime);

      // LFO para oscilar entre 440 Hz y 880 Hz
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 2.5; // 2.5 pulsos por segundo
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 220;

      lfo.connect(this.alarmOscillator.frequency);
      lfo.start();

      this.alarmGain.gain.setValueAtTime(0.12, ctx.currentTime);

      this.alarmOscillator.connect(this.alarmGain);
      this.alarmGain.connect(ctx.destination);

      this.alarmOscillator.start();
    } catch {
      // Ignorar si el usuario aún no interactuó con el DOM
    }
  }

  public stopPanicAlarm(): void {
    if (this.alarmOscillator) {
      try {
        this.alarmOscillator.stop();
        this.alarmOscillator.disconnect();
      } catch {
        // Ignorar
      }
      this.alarmOscillator = null;
      this.alarmGain = null;
    }
  }

  public playExplosion(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.stopPanicAlarm();

    // Síntesis de ruido blanco + bajo profundo
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 1.5);
  }

  public playDefusedVictory(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.stopPanicAlarm();

    // Fanfarria cibernética
    const arpeggio = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    arpeggio.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
    });
  }
}

export const soundManager = new SoundManager();
