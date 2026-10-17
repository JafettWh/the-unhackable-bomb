import { IDefusalStrategy } from './IDefusalStrategy';
import { StrategyType } from '../../types';

/**
 * Patrón: STRATEGY (Concreta)
 * DeductiveStrategy: Estrategia activa en UnlockedState.
 * Aplica con rigor matemático las interconexiones deterministas de la semilla BOMB-882:
 * 1. Módulo 2: Tecla = (Display - Strikes)
 * 2. Módulo 3: Cable = Color del Módulo 1 (Azul)
 * 3. Módulo 4: Secuencia = λ -> Δ
 * 4. Módulo 5: Frecuencia = Minutos restantes * 10
 */
export class DeductiveStrategy implements IDefusalStrategy {
  public readonly type: StrategyType = 'DEDUCTIVE';
  public readonly name: string = 'Estrategia Deductiva (Núcleo Sincronizado)';
  public readonly description: string =
    'El núcleo de la bomba ha sido desbloqueado. Las relaciones matemáticas entre módulos son ahora operativas.';

  public verifyPhaseButton(currentSeconds: number): boolean {
    return currentSeconds % 2 === 0;
  }

  public verifyNumericInput(inputNumber: number, displayValue: number, currentStrikes: number): boolean {
    const expected = displayValue - currentStrikes;
    return inputNumber === expected;
  }

  public verifyWireCut(cutColor: string, targetColor: string): boolean {
    return cutColor.trim().toLowerCase() === targetColor.trim().toLowerCase();
  }

  public verifySymbolStep(pressedSymbol: string, currentStepIndex: number, targetSequence: string[]): boolean {
    if (currentStepIndex < 0 || currentStepIndex >= targetSequence.length) {
      return false;
    }
    return pressedSymbol === targetSequence[currentStepIndex];
  }

  public verifyFrequency(selectedHz: number, remainingMinutes: number): boolean {
    // Tolerancia cero: exactamente minutos restantes * 10
    const expectedHz = Math.floor(remainingMinutes) * 10;
    return selectedHz === expectedHz;
  }
}
