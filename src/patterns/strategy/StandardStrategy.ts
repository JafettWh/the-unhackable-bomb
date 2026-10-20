import { IDefusalStrategy } from './IDefusalStrategy';
import { StrategyType, CardinalDirection, GeometricShape } from '../../types';

/**
 * Patrón: STRATEGY (Concreta)
 * StandardStrategy: Estrategia defensiva por defecto en estado no sincronizado.
 * Bloquea cualquier resolución no deductiva.
 */
export class StandardStrategy implements IDefusalStrategy {
  public readonly type: StrategyType = 'STANDARD';
  public readonly name: string = 'Estrategia Estándar (Modo Seguro)';
  public readonly description: string =
    'Modo de protección perimetral activo. Las lógicas de resolución requieren validación deductiva.';

  public verifySpatialStep(_currentStep: number, _direction: CardinalDirection): boolean {
    return false;
  }

  public verifySpatialSequence(_sequence: CardinalDirection[]): boolean {
    return false;
  }

  public verifyMathSequence(_inputNumber: number): boolean {
    return false;
  }

  public verifyScientificTrivia(_elementSymbol: string, _atomicNumber: number): boolean {
    return false;
  }

  public verifyGeometricStep(_currentStep: number, _shape: GeometricShape): boolean {
    return false;
  }

  public verifyGeometricSequence(_sequence: GeometricShape[]): boolean {
    return false;
  }

  public verifyPhysicalCalculation(_frequencyHz: number): boolean {
    return false;
  }

  public verifyMasterSwitch(_overrideGranted: boolean, _allPrecedingSolved: boolean): boolean {
    return false;
  }
}
