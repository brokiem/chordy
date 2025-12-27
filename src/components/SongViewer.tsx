import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import type { Song } from '../types';
import { LyricsLine } from './LyricsLine';
import { AutoScrollControls } from './AutoScrollControls';

interface SongViewerProps {
  /** Song data to display */
  song: Song;
}

/**
 * Main song display container.
 * Shows song metadata and renders all lyrics lines with chords.
 */
export const SongViewer = memo(function SongViewer({ song }: SongViewerProps) {
  const { lines } = song;

  // Calculate the maximum line length (lyrics or chords) to determine scaling
  const maxLineLength = useMemo(() => {
    return lines.reduce((max, line) => {
       const lyricsLen = line.lyrics ? line.lyrics.length : 0;
       // Estimate chord line length based on last chord position + name length
       const lastChord = line.chords[line.chords.length - 1];
       const chordsLen = lastChord ? lastChord.position + lastChord.name.length : 0;
       return Math.max(max, lyricsLen, chordsLen);
    }, 40); // Default min width of 40 chars
  }, [lines]);

  return (
    <article 
      class="w-full max-w-3xl mx-auto" 
      style={{ 
        containerType: 'inline-size',
        // Dynamic font size:
        // - Min: 12px (0.75rem) - prevents too small text, allowing wrap if needed
        // - Preferred: fits max chars in width (assuming ~0.6ch per character width ratio for monospace)
        // - Max: 16px (1rem) - standard desktop size
        fontSize: `clamp(0.75rem, calc(100cqw / (${maxLineLength} * 0.6)), 1rem)`
      }}
    >
      {/* Song header */}
      {/* <header class="mb-6 pb-4 border-b border-[var(--color-border)]">
        <h1 class="text-2xl font-bold text-[var(--color-text)] mb-1">
          {title}
        </h1>
        <div class="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
          <span>{artist}</span>
          {key && (
            <>
              <span class="opacity-50">•</span>
              <span class="flex items-center gap-1">
                <span class="opacity-70">Key:</span>
                <span class="text-[var(--color-chord)] font-medium">{key}</span>
              </span>
            </>
          )}
        </div>
      </header> */}

      {/* Lyrics with chords */}
      <div class="font-mono pb-4" role="main">
        {lines.map((line, index) => (
          <LyricsLine key={index} line={line} />
        ))}
      </div>
      
      <AutoScrollControls />
    </article>
  );
});
