import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';
import { ExplodedState } from './ExplodedState';

/**
 * Patrón: STATE (Concreto)
 * PanicState: Activado automáticamente al acumular el 2º Strike.
 * - Sanciona severamente la falta de rigor acelerando la velocidad del reloj a 3x.
 * - Descuenta -4 minutos instantáneos al momento de entrar.
 * - Activa el parpadeo crítico de emergencia en la interfaz.
 */
export class PanicState implements IBombState {
  public readonly name: BombStatus = 'PANIC';
  public readonly displayName: string = '¡ESTADO DE PÁNICO!';
  public readonly speedMultiplier: number = 3.0;
  public readonly allowsInteraction: boolean = true;

  public onEnter(context: BombContext): void {
    // Acelera la velocidad del reloj a 3x (descuenta 3 segundos por cada segundo real)
    context.setSpeedMultiplier(3.0);
  }

  public handlePhaseButtonClick(context: BombContext, currentSeconds: number): boolean {
    if (currentSeconds % 2 === 0) {
      return true;
    }
    context.addStrike('Fallo de fase en estado de pánico: Se presionó en segundo impar.');
    return false;
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
