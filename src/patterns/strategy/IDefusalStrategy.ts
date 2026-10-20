import { StrategyType, GeometricShape, VisualDirection } from '../../types';

/**
 * Patrón de Comportamiento: STRATEGY
 * Define la familia de algoritmos para validar las lógicas complejas de los módulos
 * (Orientación Espacial, Secuencia Matemática, Trivia Científica, Cifrado Geométrico y Resonancia Física).
 */
export interface IDefusalStrategy {
  readonly type: StrategyType;
  readonly name: string;
  readonly description: string;

  /**
   * Módulo 1: Orientación Espacial
  * Valida el valor calculado para la matriz visual
   */
  verifySpatialAnswer(answer: number): boolean;
  verifyVisualRoutingStep(currentStep: number, direction: VisualDirection): boolean;

  /**
   * Módulo 2: Secuencia Matemática
  * Valida el término de la secuencia numérica de la variante activa
   */
  verifyMathSequence(inputNumber: number): boolean;

  /**
   * Módulo 3: Conocimiento Científico
  * Valida los elementos y números atómicos de la variante activa
   */
  verifyScientificTrivia(elementSymbol: string, atomicNumber: number): boolean;

  /**
   * Módulo 4: Cifrado Geométrico
  * Valida paso o secuencia de figuras por suma de ángulos interiores
   */
  verifyGeometricStep(currentStep: number, shape: GeometricShape): boolean;
  verifyGeometricSequence(sequence: GeometricShape[]): boolean;

  /**
   * Módulo 5: Cálculo Físico
   * Valida frecuencia de resonancia en Hz
   */
  verifyPhysicalCalculation(frequencyHz: number, phaseDegrees: number): boolean;

  /**
   * Módulo 6: Ejecución Final
   * Valida prerrequisitos y anulación administrativa
   */
  verifyMasterSwitch(overrideGranted: boolean, allPrecedingSolved: boolean): boolean;
}
