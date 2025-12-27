import type { Song } from '../types';
import { andaikanKauDatang } from './songs/andaikan-kau-datang';
import { iris } from './songs/iris';

/**
 * Song collection with chord charts.
 * Each song is structured with character-based chord positioning
 * for precise alignment above lyrics.
 */
export const songs: Song[] = [
  andaikanKauDatang,
  iris,
];

/**
 * Get a song by its ID.
 */
export function getSongById(id: string): Song | undefined {
  return songs.find((song) => song.id === id);
}
