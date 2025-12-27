import { memo } from 'preact/compat';
import type { Song } from '../types';
import { LyricsLine } from './LyricsLine';

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

  return (
    <article class="w-full max-w-3xl mx-auto">
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
      <div class="font-mono" role="main">
        {lines.map((line, index) => (
          <LyricsLine key={index} line={line} />
        ))}
      </div>
    </article>
  );
});
