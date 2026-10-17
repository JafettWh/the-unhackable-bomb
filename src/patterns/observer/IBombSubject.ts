import { IBombObserver } from './IBombObserver';
import { BombEvent } from '../../types';

/**
 * Patrón de Comportamiento: OBSERVER
 * Interfaz para el sujeto observable (BombContext).
 * Administra el registro y notificación reactiva a los observadores suscritos.
 */
export interface IBombSubject {
  attach(observer: IBombObserver): void;
  detach(observer: IBombObserver): void;
  notify(event: BombEvent): void;
}
