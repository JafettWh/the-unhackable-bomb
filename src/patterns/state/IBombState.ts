import { BombStatus } from '../../types';
import type { BombContext } from '../../core/BombContext';

/**
 * Patrón de Comportamiento: STATE
 * Interfaz que encapsula los comportamientos dependientes del estado interno de la bomba.
 * Permite que BombContext cambie su comportamiento cuando su estado interno cambia.
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

  /**
   * Manejo de clic en el Botón de Fases (Módulo 1)
   */
  handlePhaseButtonClick(context: BombContext, currentSeconds: number): boolean;
}
