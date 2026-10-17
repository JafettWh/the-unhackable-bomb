import { BombEvent } from '../../types';

/**
 * Patrón de Comportamiento: OBSERVER
 * Interfaz para los observadores (Módulos de la Bomba).
 * Todos los 6 módulos implementan esta interfaz para reaccionar de forma sincronizada
 * a los cambios del Sujeto (BombContext).
 */
export interface IBombObserver {
  readonly observerId: string;
  update(event: BombEvent): void;
}
