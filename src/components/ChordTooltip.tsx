import { memo } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { ChordDiagram } from './ChordDiagram';
import { getChordDiagram } from '../data/chords';
import { useChordContext } from '../context/ChordContext';

interface ChordTooltipProps {
  /** Chord name to display */
  chordName: string;
  /** Whether the tooltip is pinned */
  isPinned: boolean;
}

/**
 * Floating tooltip component displaying chord name and diagram.
 * Uses portal for proper layering and handles viewport-aware positioning.
 */
export const ChordTooltip = memo(function ChordTooltip({
  chordName,
  isPinned,
}: ChordTooltipProps) {
  const { activePosition, unpinChord } = useChordContext();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const chordData = getChordDiagram(chordName);

  // Calculate position with viewport awareness
  useEffect(() => {
    if (!activePosition || !tooltipRef.current) {
      setIsVisible(false);
      return;
    }

    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    const tooltipWidth = rect.width || 140;
    const tooltipHeight = rect.height || 180;

    const padding = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = activePosition.x - tooltipWidth / 2;
    let y = activePosition.y - tooltipHeight - 12;

    // Horizontal bounds
    if (x < padding) {
      x = padding;
    } else if (x + tooltipWidth > viewportWidth - padding) {
      x = viewportWidth - tooltipWidth - padding;
    }

    // Vertical bounds - flip to bottom if not enough space on top
    if (y < padding) {
      y = activePosition.y + 28;
    }

    // Ensure not going off bottom
    if (y + tooltipHeight > viewportHeight - padding) {
      y = viewportHeight - tooltipHeight - padding;
    }

    setPosition({ x, y });
    // Delay visibility for smooth enter animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
  }, [activePosition]);

  if (!activePosition || !chordData) return null;

  const tooltipContent = (
    <div
      ref={tooltipRef}
      class={`
        fixed z-50 flex flex-col items-center
        bg-[var(--color-surface)]/95 backdrop-blur-sm
        border border-[var(--color-border)]
        rounded-[var(--radius)] shadow-[var(--shadow-tooltip)]
        overflow-hidden
        ${!isPinned ? 'pointer-events-none' : ''}
      `}
      style={{
        left: position?.x ?? activePosition!.x,
        top: position?.y ?? activePosition!.y,
        opacity: isVisible && position ? 1 : 0,
        transform: isVisible && position ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 180ms cubic-bezier(0.4, 0, 0.2, 1), transform 180ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Chord name header */}
      <div class="flex items-center justify-between w-full px-4 py-2.5">
        <span
          class={`
            text-sm font-semibold
            ${isPinned ? 'text-[var(--color-chord-pinned)]' : 'text-[var(--color-chord)]'}
          `}
        >
          {chordName}
        </span>
        {isPinned && (
          <button
            onClick={unpinChord}
            class="
              w-7 h-7 flex items-center justify-center -mr-2
              text-[var(--color-text-muted)] hover:text-[var(--color-text)]
              transition-colors duration-150
              rounded-full hover:bg-[var(--color-surface-hover)]
            "
            aria-label="Close tooltip"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Horizontal divider - full width */}
      <div class="w-full h-px bg-[var(--color-border)]" />

      {/* Chord diagram */}
      <div class="text-[var(--color-text)] px-3 py-3">
        <ChordDiagram chord={chordData!} size={140} />
      </div>
    </div>
  );

  // Render via portal for proper layering
  return createPortal(tooltipContent, document.body);
});

