import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';
import { PanicState } from './PanicState';
import { ExplodedState } from './ExplodedState';

/**
 * Patrón: STATE (Concreto)
 * UnlockedState: Estado desbloqueado con deducción matemática activa.
 * - Sostiene la velocidad normal o sancionada según los strikes.
 */
export class UnlockedState implements IBombState {
  public readonly name: BombStatus = 'UNLOCKED';
  public readonly displayName: string = 'DESBLOQUEADO (DEDUCTIVO)';
  public readonly allowsInteraction: boolean = true;
  private _speedMultiplier: number = 1.0;

  public get speedMultiplier(): number {
    return this._speedMultiplier;
  }

  public onEnter(context: BombContext): void {
    if (context.getStrikes() === 1) {
      this._speedMultiplier = 1.5;
      context.setSpeedMultiplier(1.5);
    } else {
      this._speedMultiplier = 1.0;
      context.setSpeedMultiplier(1.0);
    }
  }

  public handleStrike(context: BombContext): void {
    const currentStrikes = context.getStrikes();
    if (currentStrikes === 1) {
      this._speedMultiplier = 1.5;
      context.deductTime(120); // -2 minutos
      context.setSpeedMultiplier(1.5);
    } else if (currentStrikes === 2) {
      context.deductTime(240); // -4 minutos
      context.setState(new PanicState()); // Transición inmediata a pánico
    } else if (currentStrikes >= 3) {
      context.setState(new ExplodedState()); // Detonación
    }
  }

  public handleTick(context: BombContext): void {
    if (context.getRemainingSeconds() <= 0) {
      context.setState(new ExplodedState());
    }
  }
}
