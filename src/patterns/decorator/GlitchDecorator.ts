import { ModuleDecorator } from './ModuleDecorator';
import { BaseModule } from '../../modules/BaseModule';
import { BombEvent } from '../../types';

/**
 * Patrón Estructural: DECORATOR (Concreto)
 * GlitchDecorator: Envuelve al Módulo 4 (VisualRoutingModule).
 * Añade interferencia visual severa, distorsión cromática, scanlines
 * y jitter perceptual retro-futurista para dificultar la lectura directa
 * de las direcciones sin alterar la lógica de validación interna.
 */
export class GlitchDecorator extends ModuleDecorator {
  private glitchActive: boolean = true;
  private glitchIntensity: 'low' | 'medium' | 'high' = 'medium';
  private flickerCounter: number = 0;

  constructor(module: BaseModule) {
    super(module);
  }

  public update(event: BombEvent): void {
    super.update(event);

    if (event.type === 'TICK') {
      this.flickerCounter++;
      if (event.status === 'PANIC') {
        this.glitchIntensity = 'high';
      } else if (event.strikes >= 1) {
        this.glitchIntensity = 'medium';
      } else {
        this.glitchIntensity = 'low';
      }
    } else if (event.type === 'STRIKE') {
      this.glitchIntensity = 'high';
    } else if (event.type === 'RESET') {
      this.glitchActive = true;
      this.glitchIntensity = 'medium';
    }
  }

  public getVisualEffectsClass(): string {
    if (this.getSolved()) {
      return 'border-[#00ff66]/50 bg-[#00ff66]/5 shadow-[0_0_20px_rgba(0,255,102,0.2)]';
    }

    switch (this.glitchIntensity) {
      case 'high':
        return 'symbol-glitch border-red-500/80 shadow-[0_0_25px_rgba(255,0,85,0.6)] animate-pulse';
      case 'medium':
        return 'symbol-glitch border-cyan-500/60 shadow-[0_0_15px_rgba(0,255,255,0.35)]';
      case 'low':
      default:
        return 'border-cyan-500/40 shadow-[0_0_8px_rgba(0,255,255,0.2)] hover:symbol-glitch';
    }
  }

  public isGlitching(): boolean {
    return this.glitchActive && !this.getSolved();
  }

  public getGlitchIntensity(): 'low' | 'medium' | 'high' {
    return this.glitchIntensity;
  }
}
