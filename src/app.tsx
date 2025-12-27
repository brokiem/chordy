import { useState, useMemo, useEffect } from 'preact/hooks';
import { ChordProvider, useChordContext } from './context/ChordContext';
import { ToastProvider } from './context/ToastContext';
import { SongViewer } from './components/SongViewer';
import { SongSelector } from './components/SongSelector';
import { SongUploader } from './components/SongUploader';
import { ChordTooltip } from './components/ChordTooltip';
import { ToastContainer } from './components/ToastContainer';
import { songs } from './data/songs';
import { getCustomSongs } from './services/custom-songs.service';
import { getInitialSongId, setSelectedSongId as saveSelectedSongId } from './services/song-preferences.service';
import type { Song } from './types';

/**
 * Inner app content with access to chord context.
 */
function AppContent() {
  const [customSongs, setCustomSongs] = useState<Song[]>(() => getCustomSongs());
  const { pinnedChord, hoveredChord } = useChordContext();

  // Merge hardcoded songs with custom songs
  const allSongs = useMemo(() => {
    return [...songs, ...customSongs];
  }, [customSongs]);

  const [selectedSongId, setSelectedSongId] = useState(() => getInitialSongId(allSongs));

  // Save to localStorage when selection changes
  useEffect(() => {
    saveSelectedSongId(selectedSongId);
  }, [selectedSongId]);

  // Handle custom songs update
  const handleSongsUpdated = () => {
    setCustomSongs(getCustomSongs());
  };

  const selectedSong = useMemo(
    () => allSongs.find((s) => s.id === selectedSongId) ?? allSongs[0],
    [selectedSongId, allSongs]
  );

  // Active chord for tooltip (pinned takes priority over hovered)
  const activeChord = pinnedChord ?? hoveredChord;

  return (
    <div class="min-h-screen bg-[var(--color-bg)]">
      {/* Header - sticky on mobile */}
      <header class="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-3">
          <div class="flex flex-col items-center sm:flex-row sm:justify-between gap-3">
            {/* Logo and branding */}
            <div class="flex items-center gap-2.5 min-w-0">
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

            {/* Song selector and upload */}
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="flex-1 sm:flex-none min-w-0">
                <SongSelector
                  songs={allSongs}
                  selectedId={selectedSongId}
                  onSelect={setSelectedSongId}
                />
              </div>
              <SongUploader
                allSongs={allSongs}
                onSongsUpdated={handleSongsUpdated}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32">
        {selectedSong && <SongViewer song={selectedSong} />}
      </main>

      {/* Chord tooltip (rendered via portal) */}
      {activeChord && (
        <ChordTooltip
          chordName={activeChord}
          isPinned={pinnedChord === activeChord}
        />
      )}

      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  );
}

import { LenisManager } from './components/LenisManager';

/**
 * Root application component.
 * Wraps content in providers for global state management.
 */
export function App() {
  return (
    <ToastProvider>
      <ChordProvider>
        <LenisManager>
          <AppContent />
        </LenisManager>
      </ChordProvider>
    </ToastProvider>
  );
}
