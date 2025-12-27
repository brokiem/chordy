import type { ChordDiagramData } from '../types';

/**
 * Guitar chord diagram definitions.
 * Frets array: [low E (6th), A (5th), D (4th), G (3rd), B (2nd), high E (1st)]
 * Values: 0 = open, 'x' = muted, 1-5 = fret number
 */
export const chordDiagrams: Record<string, ChordDiagramData> = {
  // Open chords
  C: {
    name: 'C',
    frets: ['x', 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
  },
  D: {
    name: 'D',
    frets: ['x', 'x', 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
  },
  Dm: {
    name: 'Dm',
    frets: ['x', 'x', 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
  },
  E: {
    name: 'E',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
  },
  Em: {
    name: 'Em',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
  },
  Em7: {
    name: 'Em7',
    frets: [0, 2, 0, 0, 0, 0],
    fingers: [null, 2, null, null, null, null],
  },
  G: {
    name: 'G',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
  },
  G7: {
    name: 'G7',
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, null, null, null, 1],
  },
  A: {
    name: 'A',
    frets: ['x', 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
  },
  Am: {
    name: 'Am',
    frets: ['x', 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
  },
  A7: {
    name: 'A7',
    frets: ['x', 0, 2, 0, 2, 0],
    fingers: [null, null, 1, null, 3, null],
  },
  A7sus4: {
    name: 'A7sus4',
    frets: ['x', 0, 2, 0, 3, 0],
    fingers: [null, null, 1, null, 3, null],
  },
  D7: {
    name: 'D7',
    frets: ['x', 'x', 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
  },
  Dsus4: {
    name: 'Dsus4',
    frets: ['x', 'x', 0, 2, 3, 3],
    fingers: [null, null, null, 1, 2, 3],
  },

  // Barre chords
  F: {
    name: 'F',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barres: [{ fret: 1, fromString: 1, toString: 6 }],
  },
  Bm: {
    name: 'Bm',
    frets: ['x', 2, 4, 4, 3, 2],
    fingers: [null, 1, 3, 4, 2, 1],
    barres: [{ fret: 2, fromString: 1, toString: 5 }],
    baseFret: 2,
  },
};

/**
 * Get chord diagram data by chord name.
 * Returns undefined if chord is not found.
 */
export function getChordDiagram(name: string): ChordDiagramData | undefined {
  return chordDiagrams[name];
}

/**
 * Get all available chord names.
 */
export function getAvailableChords(): string[] {
  return Object.keys(chordDiagrams);
}
