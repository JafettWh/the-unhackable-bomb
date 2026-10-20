import { BaseModule } from './BaseModule';
import { ModuleId, BombEvent, ChemicalElement, PeriodicElement } from '../types';
import { ScienceChallenge } from './ChallengeVariants';

/**
 * MÓDULO 3: Conocimiento Científico (Observer)
 * UI: Selector de elementos químicos y dial numérico para número atómico Z.
 * Comando Terminal: query --trivia -> pistas de los dos elementos de la variante.
 * Patrón Observer: Se desbloquea automáticamente cuando el Módulo 2 es resuelto.
 * Al resolver, activa el Módulo 4.
 */
export class ScientificTriviaModule extends BaseModule {
  public readonly id: ModuleId = 'module_3';
  public readonly title: string = 'MÓDULO 03 // CONOCIMIENTO CIENTÍFICO';
  public readonly subtitle: string = 'ESTABILIZACIÓN ELEMENTAL Y NÚMERO ATÓMICO';

  public static readonly AVAILABLE_ELEMENTS: PeriodicElement[] = [
    { symbol: 'H', name: 'Hidrógeno', atomicNumber: 1, electronShells: [1] },
    { symbol: 'He', name: 'Helio', atomicNumber: 2, electronShells: [2] },
    { symbol: 'C', name: 'Carbono', atomicNumber: 6, electronShells: [2, 4] },
    { symbol: 'N', name: 'Nitrógeno', atomicNumber: 7, electronShells: [2, 5] },
    { symbol: 'O', name: 'Oxígeno', atomicNumber: 8, electronShells: [2, 6] },
    { symbol: 'Na', name: 'Sodio', atomicNumber: 11, electronShells: [2, 8, 1] },
    { symbol: 'Fe', name: 'Hierro', atomicNumber: 26, electronShells: [2, 8, 14, 2] },
    { symbol: 'Au', name: 'Oro', atomicNumber: 79, electronShells: [2, 8, 18, 32, 18, 1] },
  ];

  private selectedElement: string = 'H';
  private currentDialZ: number = 1;
  private solvedElements: number = 0;
  private readonly targetElements: [ChemicalElement, ChemicalElement];
  private readonly clues: [string, string];

  constructor(challenge: ScienceChallenge) {
    super();
    this.targetElements = challenge.elements;
    this.clues = challenge.clues;
    this.isUnlocked = false; // Bloqueado hasta resolver Módulo 2
  }

  public update(event: BombEvent): void {
    if (event.type === 'MODULE_SOLVED' && event.data?.moduleId === 'module_2') {
      this.isUnlocked = true;
    } else if (event.type === 'RESET') {
      this.reset();
    }
  }

  public setElement(symbol: string): void {
    if (this.isSolved || !this.isUnlocked) return;
    this.selectedElement = symbol;
  }

  public setDialZ(z: number): void {
    if (this.isSolved || !this.isUnlocked) return;
    this.currentDialZ = Math.max(1, Math.min(99, z));
  }

  public adjustDialZ(delta: number): void {
    this.setDialZ(this.currentDialZ + delta);
  }

  public confirmSubmission(): boolean {
    if (this.isSolved) return true;
    if (!this.isUnlocked) return false;
    if (!this.context || !this.context.canInteract()) return false;

    const target = this.targetElements[this.solvedElements];
    const strategy = this.context.getStrategy();
    const isValid = target
      && this.selectedElement === target.symbol
      && strategy.verifyScientificTrivia(this.selectedElement, this.currentDialZ);

    if (isValid) {
      this.solvedElements++;
      if (this.solvedElements === this.targetElements.length) {
        this.markSolved();
      } else {
        this.selectedElement = this.targetElements[this.solvedElements].symbol;
        this.currentDialZ = 1;
      }
      return true;
    } else {
      this.triggerStrike(
        `Configuración química [Elemento: ${this.selectedElement}, Z=${this.currentDialZ}] inestable. Combustión reactiva anómala.`
      );
      return false;
    }
  }

  public getSelectedElement(): string {
    return this.selectedElement;
  }

  public getCurrentDialZ(): number {
    return this.currentDialZ;
  }

  public getSolvedElements(): number {
    return this.solvedElements;
  }

  public getTargetElements(): [ChemicalElement, ChemicalElement] {
    return this.targetElements;
  }

  public getTerminalHint(): string {
    return this.clues.map((clue, index) => `${index + 1}. ${clue}`).join('\n');
  }

  public reset(): void {
    this.isSolved = false;
    this.isUnlocked = false;
    this.selectedElement = 'H';
    this.currentDialZ = 1;
    this.solvedElements = 0;
  }
}
