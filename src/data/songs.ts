import type { Song } from '../types';

/**
 * Sample song collection for demonstration.
 * Songs are structured with character-based chord positioning
 * for precise alignment above lyrics.
 */
export const songs: Song[] = [
  {
    id: 'let-it-be',
    title: 'Let It Be',
    artist: 'The Beatles',
    key: 'C',
    lines: [
      {
        lyrics: 'When I find myself in times of trouble',
        chords: [
          { name: 'C', position: 0 },
          { name: 'G', position: 18 },
        ],
      },
      {
        lyrics: 'Mother Mary comes to me',
        chords: [
          { name: 'Am', position: 0 },
          { name: 'F', position: 13 },
        ],
      },
      {
        lyrics: 'Speaking words of wisdom, let it be',
        chords: [
          { name: 'C', position: 0 },
          { name: 'G', position: 16 },
          { name: 'F', position: 24 },
          { name: 'C', position: 31 },
        ],
      },
      {
        lyrics: '',
        chords: [],
      },
      {
        lyrics: 'And in my hour of darkness',
        chords: [
          { name: 'C', position: 0 },
          { name: 'G', position: 14 },
        ],
      },
      {
        lyrics: 'She is standing right in front of me',
        chords: [
          { name: 'Am', position: 0 },
          { name: 'F', position: 18 },
        ],
      },
      {
        lyrics: 'Speaking words of wisdom, let it be',
        chords: [
          { name: 'C', position: 0 },
          { name: 'G', position: 16 },
          { name: 'F', position: 24 },
          { name: 'C', position: 31 },
        ],
      },
      {
        lyrics: '',
        chords: [],
      },
      {
        lyrics: 'Let it be, let it be',
        chords: [
          { name: 'Am', position: 0 },
          { name: 'G', position: 11 },
        ],
      },
      {
        lyrics: 'Let it be, let it be',
        chords: [
          { name: 'F', position: 0 },
          { name: 'C', position: 11 },
        ],
      },
      {
        lyrics: 'Whisper words of wisdom, let it be',
        chords: [
          { name: 'C', position: 0 },
          { name: 'G', position: 16 },
          { name: 'F', position: 24 },
          { name: 'C', position: 31 },
        ],
      },
    ],
  },
  {
    id: 'wonderwall',
    title: 'Wonderwall',
    artist: 'Oasis',
    key: 'F#m',
    lines: [
      {
        lyrics: "Today is gonna be the day",
        chords: [
          { name: 'Em7', position: 0 },
          { name: 'G', position: 13 },
        ],
      },
      {
        lyrics: "That they're gonna throw it back to you",
        chords: [
          { name: 'Dsus4', position: 0 },
          { name: 'A7sus4', position: 21 },
        ],
      },
      {
        lyrics: "By now you should've somehow",
        chords: [
          { name: 'Em7', position: 0 },
          { name: 'G', position: 15 },
        ],
      },
      {
        lyrics: "Realized what you gotta do",
        chords: [
          { name: 'Dsus4', position: 0 },
          { name: 'A7sus4', position: 14 },
        ],
      },
      {
        lyrics: '',
        chords: [],
      },
      {
        lyrics: "I don't believe that anybody",
        chords: [
          { name: 'C', position: 0 },
          { name: 'D', position: 16 },
        ],
      },
      {
        lyrics: 'Feels the way I do about you now',
        chords: [
          { name: 'Em', position: 0 },
        ],
      },
      {
        lyrics: '',
        chords: [],
      },
      {
        lyrics: "And all the roads we have to walk are winding",
        chords: [
          { name: 'C', position: 0 },
          { name: 'D', position: 24 },
        ],
      },
      {
        lyrics: "And all the lights that lead us there are blinding",
        chords: [
          { name: 'Em', position: 0 },
        ],
      },
    ],
  },
  {
    id: 'house-rising-sun',
    title: 'House of the Rising Sun',
    artist: 'The Animals',
    key: 'Am',
    lines: [
      {
        lyrics: 'There is a house in New Orleans',
        chords: [
          { name: 'Am', position: 0 },
          { name: 'C', position: 12 },
          { name: 'D', position: 19 },
        ],
      },
      {
        lyrics: 'They call the Rising Sun',
        chords: [
          { name: 'F', position: 0 },
          { name: 'Am', position: 14 },
        ],
      },
      {
        lyrics: "And it's been the ruin of many a poor boy",
        chords: [
          { name: 'C', position: 0 },
          { name: 'D', position: 18 },
          { name: 'F', position: 30 },
        ],
      },
      {
        lyrics: 'And God, I know I\'m one',
        chords: [
          { name: 'Am', position: 0 },
          { name: 'E', position: 14 },
        ],
      },
      {
        lyrics: '',
        chords: [],
      },
      {
        lyrics: 'My mother was a tailor',
        chords: [
          { name: 'Am', position: 0 },
          { name: 'C', position: 11 },
        ],
      },
      {
        lyrics: 'She sewed my new blue jeans',
        chords: [
          { name: 'D', position: 0 },
          { name: 'F', position: 12 },
        ],
      },
      {
        lyrics: 'My father was a gambling man',
        chords: [
          { name: 'Am', position: 0 },
          { name: 'C', position: 15 },
        ],
      },
      {
        lyrics: 'Down in New Orleans',
        chords: [
          { name: 'D', position: 0 },
          { name: 'E', position: 8 },
          { name: 'Am', position: 13 },
        ],
      },
    ],
  },
];

/**
 * Get a song by its ID.
 */
export function getSongById(id: string): Song | undefined {
  return songs.find((song) => song.id === id);
}
