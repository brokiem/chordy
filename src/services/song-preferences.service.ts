import type { Song } from '../types';

const SELECTED_SONG_KEY = 'chordy-selected-song';
const AUTOSCROLL_SPEED_KEY = 'chordy-autoscroll-speed';

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

/**
 * Get saved autoscroll speed or default to 1
 */
export function getAutoScrollSpeed(): number {
  try {
    const stored = localStorage.getItem(AUTOSCROLL_SPEED_KEY);
    if (stored) {
      const parsed = parseFloat(stored);
      return isNaN(parsed) ? 1 : parsed;
    }
  } catch {
    // ignore
  }
  return 1;
}

/**
 * Save autoscroll speed to localStorage
 */
export function setAutoScrollSpeed(speed: number): void {
  try {
    localStorage.setItem(AUTOSCROLL_SPEED_KEY, speed.toString());
  } catch {
    // ignore
  }
}
