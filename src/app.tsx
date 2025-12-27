import { useState, useMemo, useEffect } from 'preact/hooks';
import { ChordProvider, useChordContext } from './context/ChordContext';
import { SongViewer } from './components/SongViewer';
import { SongSelector } from './components/SongSelector';
import { ChordTooltip } from './components/ChordTooltip';
import { songs } from './data/songs';

const STORAGE_KEY = 'chordy-selected-song';

/**
 * Get initial song ID from localStorage or fallback to first song
 */
function getInitialSongId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && songs.some((s) => s.id === stored)) {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return songs[0]?.id ?? '';
}

/**
 * Inner app content with access to chord context.
 */
function AppContent() {
  const [selectedSongId, setSelectedSongId] = useState(getInitialSongId);
  const { pinnedChord, hoveredChord } = useChordContext();

  // Save to localStorage when selection changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, selectedSongId);
    } catch {
      // localStorage not available
    }
  }, [selectedSongId]);

  const selectedSong = useMemo(
    () => songs.find((s) => s.id === selectedSongId) ?? songs[0],
    [selectedSongId]
  );

  // Active chord for tooltip (pinned takes priority over hovered)
  const activeChord = pinnedChord ?? hoveredChord;

  return (
    <div class="min-h-screen bg-[var(--color-bg)]">
      {/* Header - sticky on mobile */}
      <header class="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Logo and branding */}
            <div class="flex items-center gap-2.5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                class="text-[var(--color-chord)]"
              >
                <path
                  d="M14 3C14 3 8 8 8 14C8 17.5 10 21 14 25C18 21 20 17.5 20 14C20 8 14 3 14 3Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle cx="14" cy="14" r="2" fill="currentColor" />
                <path
                  d="M14 8V10M14 18V20M10 14H12M16 14H18"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <span class="text-lg sm:text-xl font-bold text-[var(--color-text)]">
                Chordy
              </span>
            </div>

            {/* Song selector */}
            <SongSelector
              songs={songs}
              selectedId={selectedSongId}
              onSelect={setSelectedSongId}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {selectedSong && <SongViewer song={selectedSong} />}
      </main>

      {/* Chord tooltip (rendered via portal) */}
      {activeChord && (
        <ChordTooltip
          chordName={activeChord}
          isPinned={pinnedChord === activeChord}
        />
      )}

      {/* Footer */}
      {/* <footer class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-auto">
        <div class="border-t border-[var(--color-border)] pt-6">
          <p class="text-center text-xs text-[var(--color-text-muted)]">
            <span class="hidden sm:inline">Hover over chords to see diagrams • Click to pin</span>
            <span class="sm:hidden">Tap chords to see diagrams</span>
          </p>
        </div>
      </footer> */}
    </div>
  );
}

/**
 * Root application component.
 * Wraps content in ChordProvider for global chord state management.
 */
export function App() {
  return (
    <ChordProvider>
      <AppContent />
    </ChordProvider>
  );
}
