import { ChemicalElement, GeometricShape } from '../types';

export interface SpatialChallenge {
  rows: Array<[number, number, number | null]>;
  answer: number;
}

export interface MathChallenge {
  sequence: number[];
  answer: number;
  choices: number[];
}

export interface ScienceChallenge {
  elements: [ChemicalElement, ChemicalElement];
  clues: [string, string];
}

export interface GeometryChallenge {
  targetAngleSum: number;
}

export interface PhysicalChallenge {
  fundamentalHz: number;
  harmonic: number;
}

export type OverrideColor =
  | 'RED'
  | 'CYAN'
  | 'GREEN'
  | 'LIME'
  | 'PURPLE'
  | 'BLUE'
  | 'ORANGE'
  | 'WHITE'
  | 'PINK'
  | 'SLATE';

export interface OverrideChallenge {
  colors: [OverrideColor, OverrideColor, OverrideColor, OverrideColor];
}

export const OVERRIDE_COLOR_BASES: Record<OverrideColor, number> = {
  RED: 1,
  CYAN: 2,
  GREEN: 3,
  LIME: 4,
  PURPLE: 5,
  BLUE: 6,
  ORANGE: 7,
  WHITE: 8,
  PINK: 9,
  SLATE: 0,
};

export const getOverrideCode = (challenge: OverrideChallenge): string =>
  challenge.colors
    .map((color, index) => (OVERRIDE_COLOR_BASES[color] + index + 1) % 10)
    .join('');

export interface ChallengeVariant {
  spatial: SpatialChallenge;
  math: MathChallenge;
  science: ScienceChallenge;
  geometry: GeometryChallenge;
  physical: PhysicalChallenge;
  override: OverrideChallenge;
}

export const CHALLENGE_VARIANTS: ChallengeVariant[] = [
  {
    spatial: { rows: [[2, 3, 13], [4, 5, 41], [6, 7, null]], answer: 85 },
    math: { sequence: [1, 1, 2, 3, 5, 8, 13], answer: 21, choices: [8, 13, 19, 21, 26, 29, 34, 42, 47, 55, 60] },
    science: {
      elements: [
        { symbol: 'O', name: 'Oxígeno', atomicNumber: 8 },
        { symbol: 'Fe', name: 'Hierro', atomicNumber: 26 },
      ],
      clues: ['Gas diatómico que ocupa cerca de una quinta parte del aire seco y permite la combustión.', 'Metal de transición cuya oxidación produce herrumbre rojiza; también participa en el transporte de gases en la sangre.'],
    },
    geometry: { targetAngleSum: 1800 },
    physical: { fundamentalHz: 13, harmonic: 5 },
    override: { colors: ['RED', 'GREEN', 'BLUE', 'LIME'] },
  },
  {
    spatial: { rows: [[3, 4, 25], [5, 6, 61], [7, 8, null]], answer: 113 },
    math: { sequence: [2, 2, 4, 6, 10, 16, 26], answer: 42, choices: [8, 13, 19, 21, 26, 29, 34, 42, 47, 55, 60] },
    science: {
      elements: [
        { symbol: 'C', name: 'Carbono', atomicNumber: 6 },
        { symbol: 'Na', name: 'Sodio', atomicNumber: 11 },
      ],
      clues: ['No metal tetravalente que forma el esqueleto de innumerables moléculas orgánicas.', 'Metal alcalino que cede con facilidad su electrón externo; su símbolo deriva del nombre latino natrium.'],
    },
    geometry: { targetAngleSum: 2160 },
    physical: { fundamentalHz: 7, harmonic: 8 },
    override: { colors: ['CYAN', 'PURPLE', 'ORANGE', 'WHITE'] },
  },
  {
    spatial: { rows: [[1, 2, 5], [3, 4, 25], [5, 6, null]], answer: 61 },
    math: { sequence: [1, 3, 4, 7, 11, 18, 29], answer: 47, choices: [8, 13, 19, 21, 26, 29, 34, 42, 47, 55, 60] },
    science: {
      elements: [
        { symbol: 'He', name: 'Helio', atomicNumber: 2 },
        { symbol: 'Au', name: 'Oro', atomicNumber: 79 },
      ],
      clues: ['Gas noble del primer período: su única capa electrónica está completa.', 'Metal noble de acuñación cuyo símbolo procede de aurum.'],
    },
    geometry: { targetAngleSum: 1080 },
    physical: { fundamentalHz: 11, harmonic: 6 },
    override: { colors: ['PINK', 'SLATE', 'RED', 'CYAN'] },
  },
  {
    spatial: { rows: [[2, 5, 29], [3, 6, 45], [4, 7, null]], answer: 65 },
    math: { sequence: [3, 4, 7, 11, 18, 29, 47], answer: 76, choices: [8, 13, 19, 21, 26, 29, 34, 42, 47, 55, 76] },
    science: {
      elements: [
        { symbol: 'N', name: 'Nitrógeno', atomicNumber: 7 },
        { symbol: 'C', name: 'Carbono', atomicNumber: 6 },
      ],
      clues: ['Gas diatómico que constituye aproximadamente cuatro quintas partes de la atmósfera.', 'No metal capaz de formar cuatro enlaces covalentes y construir cadenas moleculares.'],
    },
    geometry: { targetAngleSum: 1620 },
    physical: { fundamentalHz: 17, harmonic: 4 },
    override: { colors: ['BLUE', 'LIME', 'GREEN', 'PURPLE'] },
  },
  {
    spatial: { rows: [[1, 4, 17], [2, 5, 29], [3, 6, null]], answer: 45 },
    math: { sequence: [1, 4, 5, 9, 14, 23, 37], answer: 60, choices: [8, 13, 19, 21, 26, 29, 34, 42, 47, 55, 60] },
    science: {
      elements: [
        { symbol: 'H', name: 'Hidrógeno', atomicNumber: 1 },
        { symbol: 'O', name: 'Oxígeno', atomicNumber: 8 },
      ],
      clues: ['Núcleo con un solo protón; es el elemento más abundante del universo observable.', 'Gas diatómico que compone aproximadamente una quinta parte del aire y sostiene la combustión.'],
    },
    geometry: { targetAngleSum: 1980 },
    physical: { fundamentalHz: 19, harmonic: 3 },
    override: { colors: ['WHITE', 'RED', 'SLATE', 'ORANGE'] },
  },
];

export const getInteriorAngle = (shape: GeometricShape): number => {
  const sides: Record<GeometricShape, number> = {
    TRIANGLE: 3,
    SQUARE: 4,
    PENTAGON: 5,
    HEXAGON: 6,
    OCTAGON: 8,
  };
  return (sides[shape] - 2) * 180;
};

export const getValidGeometricSequences = (targetAngleSum: number): GeometricShape[][] => {
  const shapes: GeometricShape[] = ['TRIANGLE', 'SQUARE', 'PENTAGON', 'HEXAGON', 'OCTAGON'];
  const sequences: GeometricShape[][] = [];

  for (let first = 0; first < shapes.length - 2; first++) {
    for (let second = first + 1; second < shapes.length - 1; second++) {
      for (let third = second + 1; third < shapes.length; third++) {
        const sequence: GeometricShape[] = [shapes[first], shapes[second], shapes[third]];
        if (sequence.reduce((sum, shape) => sum + getInteriorAngle(shape), 0) === targetAngleSum) {
          sequences.push(sequence);
        }
      }
    }
  }

  return sequences;
};

export const isValidGeometricPrefix = (
  sequence: GeometricShape[],
  targetAngleSum: number
): boolean =>
  sequence.length > 0
  && sequence.length <= 3
  && getValidGeometricSequences(targetAngleSum).some((candidate) =>
    sequence.every((shape, index) => candidate[index] === shape)
  );