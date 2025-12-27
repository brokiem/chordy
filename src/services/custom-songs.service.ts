import type { Song } from '../types';
import { validateSong, ensureUniqueId } from '../utils/song-validator';
import type { ValidationResult } from '../utils/song-validator';

const STORAGE_KEY = 'chordy-custom-songs';

/**
 * Service error for better error handling
 */
export class CustomSongsError extends Error {
  public code: 'STORAGE_UNAVAILABLE' | 'QUOTA_EXCEEDED' | 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'NOT_FOUND';
  
  constructor(
    message: string,
    code: 'STORAGE_UNAVAILABLE' | 'QUOTA_EXCEEDED' | 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'NOT_FOUND'
  ) {
    super(message);
    this.name = 'CustomSongsError';
    this.code = code;
  }
}

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all custom songs from localStorage
 */
export function getCustomSongs(): Song[] {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.error('Stored custom songs is not an array');
      return [];
    }

    // Validate each song
    const validSongs: Song[] = [];
    parsed.forEach((song, index) => {
      const result = validateSong(song);
      if (result.valid && result.song) {
        validSongs.push(result.song);
      } else {
        console.warn(`Invalid custom song at index ${index}:`, result.errors);
      }
    });

    return validSongs;
  } catch (error) {
    console.error('Failed to load custom songs:', error);
    return [];
  }
}

/**
 * Save custom songs to localStorage
 */
function saveCustomSongs(songs: Song[]): void {
  if (!isStorageAvailable()) {
    throw new CustomSongsError(
      'localStorage is not available in this browser',
      'STORAGE_UNAVAILABLE'
    );
  }

  try {
    const json = JSON.stringify(songs);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new CustomSongsError(
        'Storage quota exceeded. Try removing some custom songs.',
        'QUOTA_EXCEEDED'
      );
    }
    throw new CustomSongsError(
      'Failed to save custom songs',
      'STORAGE_UNAVAILABLE'
    );
  }
}

/**
 * Add a new custom song
 * Returns the song ID (may be modified to ensure uniqueness)
 */
export function addCustomSong(
  songData: unknown,
  existingAllSongs: Song[]
): { success: true; song: Song } | { success: false; errors: ValidationResult['errors'] } {
  // Validate the song data
  const validation = validateSong(songData);
  if (!validation.valid || !validation.song) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  const song = validation.song;

  // Ensure unique ID across all songs (custom + hardcoded)
  const uniqueId = ensureUniqueId(song.id, existingAllSongs);
  const songToAdd: Song = { ...song, id: uniqueId };

  // Get existing custom songs
  const customSongs = getCustomSongs();

  // Add the new song
  const updatedSongs = [...customSongs, songToAdd];

  // Save to localStorage
  saveCustomSongs(updatedSongs);

  return {
    success: true,
    song: songToAdd,
  };
}

/**
 * Remove a custom song by ID
 */
export function removeCustomSong(id: string): void {
  const customSongs = getCustomSongs();
  const filtered = customSongs.filter((song) => song.id !== id);

  if (filtered.length === customSongs.length) {
    throw new CustomSongsError(
      `Custom song with ID "${id}" not found`,
      'NOT_FOUND'
    );
  }

  saveCustomSongs(filtered);
}

/**
 * Clear all custom songs
 */
export function clearAllCustomSongs(): void {
  if (!isStorageAvailable()) {
    throw new CustomSongsError(
      'localStorage is not available in this browser',
      'STORAGE_UNAVAILABLE'
    );
  }

  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get count of custom songs
 */
export function getCustomSongsCount(): number {
  return getCustomSongs().length;
}
