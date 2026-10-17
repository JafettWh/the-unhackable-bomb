import { StrategyType } from '../../types';

/**
 * Patrón de Comportamiento: STRATEGY
 * Define la familia de algoritmos intercambiables para la validación de módulos.
 * Permite cambiar dinámicamente la lógica de verificación en tiempo de ejecución
 * cuando la bomba cambia de estado (de NormalState a UnlockedState).
 */
export interface IDefusalStrategy {
  readonly type: StrategyType;
  readonly name: string;
  readonly description: string;

  /**
   * Validación para Módulo 1 (Botón de Fases)
   */
  verifyPhaseButton(currentSeconds: number): boolean;

  /**
   * Validación para Módulo 2 (Pantalla Numérica)
   * Regla deductiva: Tecla = Display - Strikes
   */
  verifyNumericInput(inputNumber: number, displayValue: number, currentStrikes: number): boolean;

  /**
   * Validación para Módulo 3 (Cables de Colores)
   * Regla deductiva: Depende del color del Módulo 1 (Azul)
   */
  verifyWireCut(cutColor: string, targetColor: string): boolean;

  /**
   * Validación para Módulo 4 (Teclado de Símbolos)
   * Regla deductiva: Secuencia estricta λ -> Δ
   */
  verifySymbolStep(pressedSymbol: string, currentStepIndex: number, targetSequence: string[]): boolean;

  /**
   * Validación para Módulo 5 (Dial de Frecuencia)
   * Regla deductiva: Frecuencia = Minutos restantes * 10
   */
  verifyFrequency(selectedHz: number, remainingMinutes: number): boolean;
}
