import { IDefusalStrategy } from './IDefusalStrategy';
import { StrategyType, GeometricShape, VisualDirection } from '../../types';

/**
 * Patrón: STRATEGY (Concreta)
 * DeductiveStrategy: Estrategia deductiva activa para resolución secuencial.
 * Basada estrictamente en la semilla BOMB-882:
 * 1. Espacial: dos polígonos con suma de ángulos interiores de 900° -> TRIANGLE, HEXAGON.
 * 2. Matemática: "Octavo término Fibonacci" -> 1, 1, 2, 3, 5, 8, 13, 21.
 * 3. Científica: Oxígeno (O), Z = 8; Hierro (Fe), Z = 26.
 * 4. Geométrico: ángulos interiores de TRIANGLE + PENTAGON + OCTAGON = 1800°.
 * 5. Física: "Doble del primer primo de dos dígitos" -> 11 * 2 = 22 Hz.
 * 6. Maestro: Anulación sudo override confirmada y módulos 1 a 5 resueltos.
 */
export class DeductiveStrategy implements IDefusalStrategy {
  public readonly type: StrategyType = 'DEDUCTIVE';
  public readonly name: string = 'Estrategia Deductiva (Núcleo Sincronizado)';
  public readonly description: string =
    'El núcleo de la bomba ha sido acoplado a las ecuaciones deterministas de la semilla BOMB-882.';

  private readonly spatialSolution: GeometricShape[] = ['TRIANGLE', 'HEXAGON'];
  /** Módulo 4: suma de ángulos interiores = 1800° */
  private readonly geometricSolution: GeometricShape[] = ['TRIANGLE', 'PENTAGON', 'OCTAGON'];
  private readonly visualRoutingSolution: VisualDirection[] = ['UP', 'LEFT', 'DOWN'];

  public verifySpatialStep(currentStep: number, shape: GeometricShape): boolean {
    if (currentStep < 0 || currentStep >= this.spatialSolution.length) return false;
    return this.spatialSolution[currentStep] === shape;
  }

  public verifySpatialSequence(sequence: GeometricShape[]): boolean {
    if (sequence.length !== this.spatialSolution.length) return false;
    return sequence.every((shape, idx) => shape === this.spatialSolution[idx]);
  }

  public verifyVisualRoutingStep(currentStep: number, direction: VisualDirection): boolean {
    if (currentStep < 0 || currentStep >= this.visualRoutingSolution.length) return false;
    return this.visualRoutingSolution[currentStep] === direction;
  }

  public verifyMathSequence(inputNumber: number): boolean {
    return inputNumber === 21;
  }

  public verifyScientificTrivia(elementSymbol: string, atomicNumber: number): boolean {
    const normalizedSymbol = elementSymbol.trim().toUpperCase();
    const normalizedAtomicNumber = Number(atomicNumber);
    return (normalizedSymbol === 'O' && normalizedAtomicNumber === 8)
      || (normalizedSymbol === 'FE' && normalizedAtomicNumber === 26);
  }

  public verifyGeometricStep(currentStep: number, shape: GeometricShape): boolean {
    if (currentStep < 0 || currentStep >= this.geometricSolution.length) return false;
    return this.geometricSolution[currentStep] === shape;
  }

  public verifyGeometricSequence(sequence: GeometricShape[]): boolean {
    if (sequence.length !== this.geometricSolution.length) return false;
    return sequence.every((shape, idx) => shape === this.geometricSolution[idx]);
  }

  public verifyPhysicalCalculation(frequencyHz: number): boolean {
    return Number(frequencyHz) === 22;
  }

  public verifyMasterSwitch(overrideGranted: boolean, allPrecedingSolved: boolean): boolean {
    return overrideGranted && allPrecedingSolved;
  }
}
