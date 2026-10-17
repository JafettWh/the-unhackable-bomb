import { IDefusalStrategy } from './IDefusalStrategy';
import { StrategyType } from '../../types';

/**
 * Patrón: STRATEGY (Concreta)
 * StandardStrategy: Estrategia por defecto en NormalState.
 * Diseñada para la Fase de Caja Negra: rechaza los intentos directos e intuitivos
 * ("las trampas" que intentarán los evaluadores o compañeros sin haber desbloqueado la bomba).
 */
export class StandardStrategy implements IDefusalStrategy {
  public readonly type: StrategyType = 'STANDARD';
  public readonly name: string = 'Estrategia Estándar (Bloqueada / Distractora)';
  public readonly description: string =
    'El sistema se encuentra en modo protegido. Cualquier resolución directa sin sincronización deductiva es rechazada.';

  /**
   * En modo estándar, el botón de fases solo puede ser activado si el segundo es PAR.
   * Si es par, la validación se aprueba para permitir la transición a UnlockedState.
   */
  public verifyPhaseButton(currentSeconds: number): boolean {
    return currentSeconds % 2 === 0;
  }

  /**
   * En modo estándar, el Módulo 2 rechaza cualquier intento directo (incluso presionar 4),
   * obligando a que primero se conmute a UnlockedState.
   */
  public verifyNumericInput(_inputNumber: number, _displayValue: number, _currentStrikes: number): boolean {
    return false;
  }

  /**
   * En modo estándar, cortar cables sin haber desbloqueado el núcleo deductivo
   * causa strike inmediato.
   */
  public verifyWireCut(_cutColor: string, _targetColor: string): boolean {
    return false;
  }

  /**
   * En modo estándar, la secuencia de símbolos no es aceptada.
   */
  public verifySymbolStep(_pressedSymbol: string, _currentStepIndex: number, _targetSequence: string[]): boolean {
    return false;
  }

  /**
   * En modo estándar, la calibración de frecuencia está bloqueada.
   */
  public verifyFrequency(_selectedHz: number, _remainingMinutes: number): boolean {
    return false;
  }
}
