import type { Song } from '../types';
import { andaikanKauDatang } from './songs/andaikan-kau-datang';
import { iris } from './songs/iris';
import { morningLight } from './songs/morning-light';

/**
 * Song collection with chord charts.
 * Each song is structured with character-based chord positioning
 * for precise alignment above lyrics.
 */
export const songs: Song[] = [
  andaikanKauDatang,
  iris,
  morningLight,
];

/**
 * Get a song by its ID.
 */
export function getSongById(id: string): Song | undefined {
  return songs.find((song) => song.id === id);
}
