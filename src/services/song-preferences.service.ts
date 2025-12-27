import type { Song } from '../types';

const SELECTED_SONG_KEY = 'chordy-selected-song';

/**
 * Get the last selected song ID from localStorage
 */
export function getSelectedSongId(): string | null {
  try {
    return localStorage.getItem(SELECTED_SONG_KEY);
  } catch {
    return null;
  }
}

/**
 * Save the selected song ID to localStorage
 */
export function setSelectedSongId(songId: string): void {
  try {
    localStorage.setItem(SELECTED_SONG_KEY, songId);
  } catch {
    // localStorage not available
  }
}

/**
 * Get initial song ID from localStorage or fallback to first song
 */
export function getInitialSongId(songs: Song[]): string {
  const stored = getSelectedSongId();
  
  if (stored && songs.some((s) => s.id === stored)) {
    return stored;
  }
  
  return songs[0]?.id ?? '';
}
