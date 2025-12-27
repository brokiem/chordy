import { memo } from 'preact/compat';
import type { SongLine as SongLineType } from '../types';
import { Chord } from './Chord';

interface LyricsLineProps {
  /** Line data containing lyrics and chord positions */
  line: SongLineType;
}

/**
 * Single line of lyrics with chords positioned above.
 * Uses monospace font and character-based positioning for precise alignment.
 */
export const LyricsLine = memo(function LyricsLine({ line }: LyricsLineProps) {
  const { lyrics, chords } = line;

  // Empty line (section break)
  if (!lyrics && chords.length === 0) {
    return <div class="h-4" aria-hidden="true" />;
  }

  // Sort chords by position for sequential rendering
  const sortedChords = [...chords].sort((a, b) => a.position - b.position);

  // Track end position of previous chord for spacing calculation
  let prevEndPosition = 0;

  return (
    <div class="leading-relaxed mb-1 mt-2">
      {/* Chords row */}
      {sortedChords.length > 0 && (
        <div
          class="font-mono h-[1.5em] whitespace-pre"
          role="group"
          aria-label="Chord progression"
        >
          {sortedChords.map((chord, index) => {
            const element = (
              <Chord
                key={`${chord.name}-${chord.position}-${index}`}
                name={chord.name}
                position={chord.position}
                prevEndPosition={prevEndPosition}
              />
            );
            prevEndPosition = chord.position + chord.name.length;
            return element;
          })}
        </div>
      )}

      {/* Lyrics row */}
      {lyrics && (
        <div class="font-mono text-[var(--color-text)] whitespace-pre-wrap">
          {lyrics}
        </div>
      )}
    </div>
  );
});
