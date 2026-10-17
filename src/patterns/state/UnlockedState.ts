import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';
import { DeductiveStrategy } from '../strategy/DeductiveStrategy';
import { PanicState } from './PanicState';
import { ExplodedState } from './ExplodedState';

/**
 * Patrón: STATE (Concreto)
 * UnlockedState: Activado exitosamente por el Módulo 1 en un segundo PAR.
 * - Cambia la estrategia de validación global a DeductiveStrategy.
 * - Habilita la resolución lógica de los Módulos 2, 3, 4 y 5.
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
    // Intercambia la estrategia global a DeductiveStrategy
    context.setStrategy(new DeductiveStrategy());
    // Mantiene la velocidad actual acorde a los strikes
    if (context.getStrikes() === 1) {
      this._speedMultiplier = 1.5;
      context.setSpeedMultiplier(1.5);
    } else {
      this._speedMultiplier = 1.0;
      context.setSpeedMultiplier(1.0);
    }
  }

  public handlePhaseButtonClick(context: BombContext, currentSeconds: number): boolean {
    // El núcleo ya se encuentra en estado desbloqueado
    return true;
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
