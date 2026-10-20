import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';
import { ExplodedState } from './ExplodedState';

/**
 * Patrón: STATE (Concreto)
 * PanicState: Activado automáticamente al acumular el 2º Strike.
 * - Sanciona severamente la falta de rigor acelerando la velocidad del reloj a 3x.
 * - Activa el parpadeo crítico de emergencia en la interfaz.
 * - Un próximo error (3er strike) detona la bomba inmediatamente.
 */
export class PanicState implements IBombState {
  public readonly name: BombStatus = 'PANIC';
  public readonly displayName: string = '¡ESTADO DE PÁNICO!';
  public readonly speedMultiplier: number = 3.0;
  public readonly allowsInteraction: boolean = true;

  public onEnter(context: BombContext): void {
    context.setSpeedMultiplier(3.0);
  }

  public handleStrike(context: BombContext): void {
    const currentStrikes = context.getStrikes();
    if (currentStrikes >= 3) {
      context.setState(new ExplodedState());
    }
  }

  public handleTick(context: BombContext): void {
    if (context.getRemainingSeconds() <= 0) {
      context.setState(new ExplodedState());
    }
  }
}
