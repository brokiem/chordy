import { memo } from 'preact/compat';
import { useState, useRef, useEffect } from 'preact/hooks';
import type { Song } from '../types';

interface SongSelectorProps {
  /** List of available songs */
  songs: Song[];
  /** Currently selected song ID */
  selectedId: string;
  /** Callback when song selection changes */
  onSelect: (songId: string) => void;
}

/**
 * Dropdown selector for switching between songs.
 * Custom implementation with smooth animations for Preact compatibility.
 */
export const SongSelector = memo(function SongSelector({
  songs,
  selectedId,
  onSelect,
}: SongSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedSong = songs.find((s) => s.id === selectedId);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (songId: string) => {
    onSelect(songId);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} class="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        class="
          relative w-full sm:w-auto min-w-[75px]
          bg-[var(--color-surface)] text-[var(--color-text)]
          border border-[var(--color-border)]
          rounded-[var(--radius)] px-3 py-2 pr-10 h-9 flex items-center
          text-sm font-medium text-left
          cursor-pointer
          transition-all duration-150
          hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]
          focus:outline-none
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span class="block truncate">
          {selectedSong ? (
            <>
              <span class="font-semibold">{selectedSong.title}</span>
              <span class="text-[var(--color-text-muted)] ml-1.5">— {selectedSong.artist}</span>
            </>
          ) : (
            'Select a song'
          )}
        </span>
        {/* Chevron icon */}
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            class={`h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown menu */}
      <div
        class={`
          absolute z-50 mt-2 right-0 sm:left-0 sm:right-auto w-full min-w-[75px]
          max-h-60 overflow-auto overscroll-contain
          bg-[var(--color-surface)]/95 backdrop-blur-sm
          border border-[var(--color-border)]
          rounded-[var(--radius)] shadow-lg
          p-1
          origin-top
          transition-all duration-150 ease-out
          ${isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
          }
        `}
        role="listbox"
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {songs.map((song) => {
          const isSelected = song.id === selectedId;
          return (
            <button
              key={song.id}
              onClick={() => handleSelect(song.id)}
              role="option"
              aria-selected={isSelected}
              class={`
                relative w-full cursor-pointer select-none
                px-2 py-1.5 text-left rounded-sm text-sm
                transition-colors duration-100
                hover:bg-[var(--color-surface-hover)]
                ${isSelected ? 'text-[var(--color-chord)]' : 'text-[var(--color-text)]'}
              `}
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex flex-col min-w-0">
                  <span class={`block truncate font-medium ${isSelected ? 'text-[var(--color-chord)]' : ''}`}>
                    {song.title}
                  </span>
                  <span class="block truncate text-xs text-[var(--color-text-muted)]">
                    {song.artist}
                  </span>
                </div>
                {isSelected && (
                  <svg class="h-4 w-4 text-[var(--color-chord)] flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8L6.5 11.5L13 5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});
