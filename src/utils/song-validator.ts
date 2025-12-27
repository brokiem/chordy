import type { Song, SongLine, ChordPosition } from '../types';

/**
 * Validation error with detailed information
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Validation result with typed data or errors
 */
export interface ValidationResult {
  valid: boolean;
  song?: Song;
  errors: ValidationError[];
}

/**
 * Type guard for ChordPosition
 */
function isChordPosition(obj: unknown): obj is ChordPosition {
  if (!obj || typeof obj !== 'object') return false;
  const chord = obj as Record<string, unknown>;
  
  return (
    typeof chord.name === 'string' &&
    chord.name.length > 0 &&
    typeof chord.position === 'number' &&
    chord.position >= 0 &&
    Number.isInteger(chord.position)
  );
}

/**
 * Type guard for SongLine
 */
function isSongLine(obj: unknown): obj is SongLine {
  if (!obj || typeof obj !== 'object') return false;
  const line = obj as Record<string, unknown>;
  
  return (
    typeof line.lyrics === 'string' &&
    Array.isArray(line.chords) &&
    line.chords.every(isChordPosition)
  );
}

/**
 * Validate song ID format (lowercase letters, numbers, hyphens only)
 */
function isValidId(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id) && id.length > 0;
}

/**
 * Sanitize a string to create a valid song ID
 */
export function sanitizeId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique ID from title and artist
 */
export function generateId(title: string, artist: string): string {
  const titlePart = sanitizeId(title);
  const artistPart = sanitizeId(artist);
  return artistPart ? `${titlePart}-${artistPart}` : titlePart;
}

/**
 * Comprehensive song data validation
 */
export function validateSong(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Song data must be a JSON object' }],
    };
  }

  const song = data as Record<string, unknown>;

  // Validate required fields
  if (typeof song.id !== 'string' || !song.id) {
    errors.push({
      field: 'id',
      message: 'Song ID is required and must be a non-empty string',
      value: song.id,
    });
  } else if (!isValidId(song.id)) {
    errors.push({
      field: 'id',
      message:
        'Song ID must contain only lowercase letters, numbers, and hyphens',
      value: song.id,
    });
  }

  if (typeof song.title !== 'string' || !song.title.trim()) {
    errors.push({
      field: 'title',
      message: 'Song title is required and must be a non-empty string',
      value: song.title,
    });
  }

  if (typeof song.artist !== 'string' || !song.artist.trim()) {
    errors.push({
      field: 'artist',
      message: 'Artist name is required and must be a non-empty string',
      value: song.artist,
    });
  }

  // Validate optional key field
  if (song.key !== undefined && typeof song.key !== 'string') {
    errors.push({
      field: 'key',
      message: 'Song key must be a string if provided',
      value: song.key,
    });
  }

  // Validate lines array
  if (!Array.isArray(song.lines)) {
    errors.push({
      field: 'lines',
      message: 'Song lines must be an array',
      value: song.lines,
    });
  } else if (song.lines.length === 0) {
    errors.push({
      field: 'lines',
      message: 'Song must have at least one line',
    });
  } else {
    // Validate each line
    song.lines.forEach((line, index) => {
      if (!isSongLine(line)) {
        if (!line || typeof line !== 'object') {
          errors.push({
            field: `lines[${index}]`,
            message: `Line ${index + 1} must be an object with 'lyrics' and 'chords' properties`,
            value: line,
          });
        } else {
          const l = line as Record<string, unknown>;
          if (typeof l.lyrics !== 'string') {
            errors.push({
              field: `lines[${index}].lyrics`,
              message: `Line ${index + 1}: lyrics must be a string`,
              value: l.lyrics,
            });
          }
          if (!Array.isArray(l.chords)) {
            errors.push({
              field: `lines[${index}].chords`,
              message: `Line ${index + 1}: chords must be an array`,
              value: l.chords,
            });
          } else {
            // Validate each chord in the line
            l.chords.forEach((chord, chordIndex) => {
              if (!isChordPosition(chord)) {
                errors.push({
                  field: `lines[${index}].chords[${chordIndex}]`,
                  message: `Line ${index + 1}, Chord ${chordIndex + 1}: must have 'name' (string) and 'position' (non-negative integer)`,
                  value: chord,
                });
              }
            });
          }
        }
      }
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    song: song as unknown as Song,
    errors: [],
  };
}

/**
 * Check if a song ID already exists in a list
 */
export function isDuplicateId(id: string, existingSongs: Song[]): boolean {
  return existingSongs.some((song) => song.id === id);
}

/**
 * Create a unique ID by appending a number if needed
 */
export function ensureUniqueId(
  baseId: string,
  existingSongs: Song[]
): string {
  let id = baseId;
  let counter = 1;

  while (isDuplicateId(id, existingSongs)) {
    id = `${baseId}-${counter}`;
    counter++;
  }

  return id;
}
