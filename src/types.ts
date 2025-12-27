/**
 * Position of a chord within a lyrics line.
 * The position is character-based for precise alignment.
 */
export interface ChordPosition {
  /** Chord name (e.g., "G", "Am", "Cmaj7") */
  name: string;
  /** Character index in the lyrics where this chord should appear */
  position: number;
}

/**
 * A single line of a song with lyrics and chord positions.
 */
export interface SongLine {
  /** The lyrics text for this line */
  lyrics: string;
  /** Chords positioned above this line */
  chords: ChordPosition[];
}

/**
 * Complete song data structure.
 */
export interface Song {
  /** Unique identifier */
  id: string;
  /** Song title */
  title: string;
  /** Artist or band name */
  artist: string;
  /** Musical key (optional) */
  key?: string;
  /** All lines of the song */
  lines: SongLine[];
}

/**
 * Barre chord definition for spanning multiple strings.
 */
export interface ChordBarre {
  /** Fret position of the barre */
  fret: number;
  /** Starting string (1-6, low E to high E) */
  fromString: number;
  /** Ending string (1-6) */
  toString: number;
}

/**
 * Complete chord diagram data for rendering.
 */
export interface ChordDiagramData {
  /** Chord name */
  name: string;
  /**
   * Fret positions for each string (6 strings, low E to high E).
   * - number: fret number (1-5 typically)
   * - 0: open string
   * - 'x': muted string
   */
  frets: (number | 'x' | 0)[];
  /** Optional finger numbers for each string (1-4) */
  fingers?: (number | null)[];
  /** Optional barre chord definitions */
  barres?: ChordBarre[];
  /** Base fret position (for chords higher up the neck) */
  baseFret?: number;
}
