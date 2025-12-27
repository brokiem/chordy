import { memo, useState, useRef, useCallback, useEffect } from 'preact/compat';
import { Transition } from '@headlessui/react';
import type { Song } from '../types';
import { addCustomSong, removeCustomSong, getCustomSongs } from '../services/custom-songs.service';
import { useToast } from '../context/ToastContext';
import type { ValidationError } from '../utils/song-validator';

interface SongUploaderProps {
  /** All songs (hardcoded + custom) to check for duplicates */
  allSongs: Song[];
  /** Callback when songs are updated */
  onSongsUpdated: () => void;
}

/**
 * Song uploader component with file input and drag-and-drop support.
 * Uses global toast system for notifications.
 */
export const SongUploader = memo(function SongUploader({
  allSongs,
  onSongsUpdated,
}: SongUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [customSongs, setCustomSongs] = useState<Song[]>(() => getCustomSongs());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use global toast system
  const { showToast } = useToast();

  // Handle file processing
  const processFile = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        const result = addCustomSong(data, allSongs);
        
        if (result.success) {
          showToast('success', `Song "${result.song.title}" uploaded successfully!`);
          setCustomSongs(getCustomSongs());
          onSongsUpdated();
        } else {
          const errorMsg = result.errors.map((e: ValidationError) => 
            `${e.field}: ${e.message}`
          ).join('\n');
          showToast('error', `Validation failed:\n${errorMsg}`);
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          showToast('error', 'Invalid JSON file. Please check the file format.');
        } else if (error instanceof Error) {
          showToast('error', error.message);
        } else {
          showToast('error', 'Failed to upload song. Please try again.');
        }
      }
    },
    [allSongs, onSongsUpdated, showToast]
  );

  // Handle file input change
  const handleFileChange = useCallback(
    (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        processFile(file);
        // Reset input
        target.value = '';
      }
    },
    [processFile]
  );

  // Handle drag and drop
  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const file = event.dataTransfer?.files[0];
      if (file && file.type === 'application/json') {
        processFile(file);
      } else {
        showToast('error', 'Please drop a JSON file');
      }
    },
    [processFile, showToast]
  );

  // Handle delete song
  const handleDeleteSong = useCallback(
    (songId: string) => {
      try {
        removeCustomSong(songId);
        setCustomSongs(getCustomSongs());
        onSongsUpdated();
        showToast('success', 'Song removed');
      } catch (error) {
        if (error instanceof Error) {
          showToast('error', error.message);
        }
      }
    },
    [onSongsUpdated, showToast]
  );

  // Trigger file input
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Download schema
  const handleDownloadSchema = useCallback(() => {
    window.open('/song-schema.json', '_blank');
  }, []);

  // Close panel on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Upload button */}
      <div class="relative" ref={containerRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          class="
            relative
            bg-[var(--color-accent)] text-white
            rounded-[var(--radius)] h-9 w-9
            cursor-pointer
            transition-all duration-150
            hover:opacity-90
            focus:outline-none
            flex items-center justify-center
          "
          aria-label="Upload custom songs"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4V16M12 4L8 8M12 4L16 8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        {/* Dropdown panel with Transition */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-150"
          enterFrom="opacity-0 scale-95 -translate-y-1"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 -translate-y-1"
        >
          <div
            class="
              absolute z-50 mt-2 right-0
              w-80 sm:w-96
              bg-[var(--color-surface)]/98 backdrop-blur-sm
              border border-[var(--color-border)]
              rounded-[var(--radius)] shadow-lg
              p-6
              origin-top-right
            "
          >
            {/* Header */}
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-[var(--color-text)]">
                Upload Custom Songs
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M4 12L12 4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Upload area */}
            <div
              class={`
                border border-dashed rounded-[var(--radius)] p-6 mb-4
                text-center cursor-pointer
                transition-all duration-150
                ${
                  isDragging
                    ? 'border-[var(--color-chord)] bg-[var(--color-chord)]/10'
                    : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <svg
                class="mx-auto mb-2 text-[var(--color-text-muted)]"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 4V16M12 4L8 8M12 4L16 8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <p class="text-sm text-[var(--color-text)] mb-1">
                Click to upload or drag & drop
              </p>
              <p class="text-xs text-[var(--color-text-muted)]">
                JSON files only
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileChange}
                class="hidden"
              />
            </div>

            {/* Schema link */}
            <button
              onClick={handleDownloadSchema}
              class="
                w-full text-xs text-[var(--color-chord)]
                hover:underline text-left
                cursor-pointer transition-colors
                hover:text-[var(--color-chord-hover)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-chord)]/50 rounded
              "
            >
              View JSON Schema
            </button>

            {/* Custom songs list */}
            {customSongs.length > 0 && (
              <div class="border-t border-[var(--color-border)] pt-3">
                <h4 class="text-xs font-semibold text-[var(--color-text-muted)] mb-2">
                  Custom Songs ({customSongs.length})
                </h4>
                <div 
                  class="space-y-2 max-h-48 overflow-y-auto overscroll-contain"
                  data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  {customSongs.map((song) => (
                    <div
                      key={song.id}
                      class="
                        flex items-center justify-between gap-3
                        px-3 py-2.5 rounded-lg
                        bg-[var(--color-surface-hover)]
                        border border-[var(--color-border)]
                        text-xs
                        transition-all duration-150
                      "
                    >
                      <div class="min-w-0 flex-1">
                        <p class="font-medium text-[var(--color-text)] truncate">
                          {song.title}
                        </p>
                        <p class="text-[var(--color-text-muted)] truncate">
                          {song.artist}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        class="
                          flex-shrink-0
                          p-1.5 rounded-md
                          text-red-400
                          hover:text-red-300
                          hover:bg-red-500/10
                          transition-all duration-150
                          cursor-pointer
                          focus:outline-none focus:ring-2 focus:ring-red-500/50
                        "
                        aria-label={`Delete ${song.title}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6.5 7V11M9.5 7V11M4 4H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4Z"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Transition>
      </div>
    </>
  );
});
