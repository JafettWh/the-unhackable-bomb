import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent } from '../types';

/**
 * MÓDULO 2: Pantalla Numérica (NumericDisplayModule)
 * UI: Display digital LED mostrando el número fijo 4 y un teclado numérico (1, 2, 3, 4).
 * Mecánica: Evalúa según la estrategia activa (IDefusalStrategy).
 * Validación: En UnlockedState, la regla deductiva requiere presionar la tecla igual a:
 * (Número en Display) - (Strikes Actuales). Como la pantalla indica 4 y hay 0 Strikes,
 * la tecla correcta es la 4. Si se presiona sin estar en UnlockedState, falla inmediatamente.
 */
export class NumericDisplayModule extends BaseModule {
  public readonly id: ModuleId = 'module_2';
  public readonly title: string = 'MÓDULO 02 // MATRIZ NUMÉRICA';
  public readonly subtitle: string = 'ALGORITMO DE VALOR DEDUCTIVO';

  public readonly displayValue: number = 4;
  public readonly availableButtons: number[] = [1, 2, 3, 4];
  private selectedButton: number | null = null;

  public update(event: BombEvent): void {
    if (event.type === 'RESET') {
      this.reset();
    }
  }

  public pressKey(key: number): boolean {
    if (this.isSolved) return true;
    if (!this.context || !this.context.canInteract()) return false;

    this.selectedButton = key;
    const strategy = this.context.getStrategy();
    const currentStrikes = this.context.getStrikes();

    const isValid = strategy.verifyNumericInput(key, this.displayValue, currentStrikes);

    if (isValid) {
      this.markSolved();
      return true;
    } else {
      this.triggerStrike(
        `Valor ${key} incorrecto para matriz activa. (Estrategia: ${strategy.name})`
      );
      return false;
    }
  }

  public reset(): void {
    this.isSolved = false;
    this.selectedButton = null;
  }

  public getSelectedButton(): number | null {
    return this.selectedButton;
  }
}
