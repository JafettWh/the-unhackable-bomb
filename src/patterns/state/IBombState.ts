import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';

/**
 * Patrón de Comportamiento: STATE
 * Interfaz que encapsula los comportamientos dependientes del estado interno de la bomba.
 * Permite que BombContext cambie su comportamiento y reglas de temporizador dinámicamente.
 */
export interface IBombState {
  readonly name: BombStatus;
  readonly displayName: string;
  readonly speedMultiplier: number;
  readonly allowsInteraction: boolean;

  /**
   * Ejecutado inmediatamente al entrar a este estado
   */
  onEnter(context: BombContext): void;

  /**
   * Manejo de evento al registrar un Strike
   */
  handleStrike(context: BombContext): void;

  /**
   * Manejo de cada tick de temporizador
   */
  handleTick(context: BombContext): void;
}
