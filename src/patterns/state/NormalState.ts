import { IBombState } from './IBombState';
import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';
import { StandardStrategy } from '../strategy/StandardStrategy';
import { UnlockedState } from './UnlockedState';
import { PanicState } from './PanicState';
import { ExplodedState } from './ExplodedState';

/**
 * Patrón: STATE (Concreto)
 * NormalState: Estado inicial de la bomba.
 * - Opera con StandardStrategy (distractora).
 * - Velocidad 1.0x (o 1.5x si ya hubo 1 error).
 * - El Módulo 1 permite conmutar a UnlockedState solo si el segundero es PAR.
 */
export class NormalState implements IBombState {
  public readonly name: BombStatus = 'NORMAL';
  public readonly displayName: string = 'NORMAL / PROTEGIDO';
  public readonly allowsInteraction: boolean = true;
  private _speedMultiplier: number = 1.0;

  public get speedMultiplier(): number {
    return this._speedMultiplier;
  }

  public onEnter(context: BombContext): void {
    // Restaurar o fijar la estrategia a Standard
    context.setStrategy(new StandardStrategy());
    // Ajustar velocidad según strikes acumulados
    if (context.getStrikes() === 1) {
      this._speedMultiplier = 1.5;
      context.setSpeedMultiplier(1.5);
    } else {
      this._speedMultiplier = 1.0;
      context.setSpeedMultiplier(1.0);
    }
  }

  public handlePhaseButtonClick(context: BombContext, currentSeconds: number): boolean {
    // Regla determinista BOMB-882: Válido solo en segundo PAR
    if (currentSeconds % 2 === 0) {
      context.setState(new UnlockedState());
      return true;
    } else {
      // Intento en segundo impar genera Strike
      context.addStrike('Fallo de fase: Se presionó el botón en un segundo impar.');
      return false;
    }
  }

  public handleStrike(context: BombContext): void {
    const currentStrikes = context.getStrikes();
    if (currentStrikes === 1) {
      this._speedMultiplier = 1.5;
      context.deductTime(120); // -2 minutos instantáneos (-120 segundos)
      context.setSpeedMultiplier(1.5); // 1.5x de velocidad
    } else if (currentStrikes === 2) {
      context.deductTime(240); // -4 minutos instantáneos (-240 segundos)
      context.setState(new PanicState()); // Conmuta a estado de pánico
    } else if (currentStrikes >= 3) {
      context.setState(new ExplodedState()); // Detonación instantánea
    }
  }

  public handleTick(context: BombContext): void {
    // Comportamiento regular durante el tick
    if (context.getRemainingSeconds() <= 0) {
      context.setState(new ExplodedState());
    }
  }
}
