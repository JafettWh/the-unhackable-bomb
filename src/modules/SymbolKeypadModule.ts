import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent, SymbolChar, SymbolButtonState } from '../types';

/**
 * MÓDULO 4: Teclado de Símbolos (SymbolKeypadModule)
 * UI: 4 botones con símbolos griegos (Ω, λ, Δ, Ψ).
 * Decorado estructuralmente por SymbolDecorator para simular fallas visuales de CRT y flicker.
 * Mecánica: Entrada de secuencia ordenada.
 * Validación: Requiere presionar los botones en el orden estricto: Lambda (λ) -> Delta (Δ).
 */
export class SymbolKeypadModule extends BaseModule {
  public readonly id: ModuleId = 'module_4';
  public readonly title: string = 'MÓDULO 04 // MATRIZ DE GLIFOS';
  public readonly subtitle: string = 'SECUENCIA HELÉNICA DETERMINISTA';

  public readonly targetSequence: SymbolChar[] = ['λ', 'Δ'];
  private currentStepIndex: number = 0;
  private buttons: SymbolButtonState[] = [
    { id: 'sym_omega', symbol: 'Ω', label: 'Omega', isPressed: false },
    { id: 'sym_lambda', symbol: 'λ', label: 'Lambda', isPressed: false },
    { id: 'sym_delta', symbol: 'Δ', label: 'Delta', isPressed: false },
    { id: 'sym_psi', symbol: 'Ψ', label: 'Psi', isPressed: false },
  ];

  public update(event: BombEvent): void {
    if (event.type === 'RESET') {
      this.reset();
    }
  }

  public pressSymbol(symbol: SymbolChar): boolean {
    if (this.isSolved) return true;
    if (!this.context || !this.context.canInteract()) return false;

    const strategy = this.context.getStrategy();
    const isValid = strategy.verifySymbolStep(
      symbol,
      this.currentStepIndex,
      this.targetSequence
    );

    if (isValid) {
      // Marcar botón como activado en este paso
      const btn = this.buttons.find((b) => b.symbol === symbol);
      if (btn) btn.isPressed = true;

      this.currentStepIndex++;
      if (this.currentStepIndex >= this.targetSequence.length) {
        this.markSolved();
      }
      return true;
    } else {
      // Secuencia fallida: reiniciar progreso del módulo y registrar strike
      this.currentStepIndex = 0;
      this.buttons.forEach((b) => (b.isPressed = false));
      this.triggerStrike(`Glifo '${symbol}' no corresponde a la secuencia esperada.`);
      return false;
    }
  }

  public getButtons(): SymbolButtonState[] {
    return [...this.buttons];
  }

  public getCurrentStep(): number {
    return this.currentStepIndex;
  }

  public reset(): void {
    this.isSolved = false;
    this.currentStepIndex = 0;
    this.buttons = [
      { id: 'sym_omega', symbol: 'Ω', label: 'Omega', isPressed: false },
      { id: 'sym_lambda', symbol: 'λ', label: 'Lambda', isPressed: false },
      { id: 'sym_delta', symbol: 'Δ', label: 'Delta', isPressed: false },
      { id: 'sym_psi', symbol: 'Ψ', label: 'Psi', isPressed: false },
    ];
  }
}
