import { memo } from 'preact/compat';
import { useCallback, useRef, useMemo } from 'preact/hooks';
import { useChordContext } from '../context/ChordContext';

interface ChordProps {
  /** Chord name to display */
  name: string;
  /** Character position offset for spacing */
  position: number;
  /** Previous chord's end position for calculating gaps */
  prevEndPosition: number;
}

/**
 * Generate a consistent color for a chord based on its name.
 * Uses blue base color (matching theme) with slight hue shifts for differentiation.
 */
function getChordColor(chordName: string): string {
  // Simple hash function to get a consistent number from chord name
  let hash = 0;
  for (let i = 0; i < chordName.length; i++) {
    hash = chordName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Base hue is 210 (blue, matching --color-chord: #60a5fa which is ~210)
  // Shift by ±30 degrees to stay in blue-cyan-purple range
  const baseHue = 210;
  const hueShift = (Math.abs(hash) % 60) - 30; // Range: -30 to +30
  const hue = baseHue + hueShift;
  
  // Use consistent saturation and lightness matching the theme blue
  return `hsl(${hue}, 70%, 68%)`;
}

/**
 * Generate hover color (slightly lighter and more saturated)
 */
function getChordHoverColor(chordName: string): string {
  let hash = 0;
  for (let i = 0; i < chordName.length; i++) {
    hash = chordName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const baseHue = 210;
  const hueShift = (Math.abs(hash) % 60) - 30;
  const hue = baseHue + hueShift;
  return `hsl(${hue}, 75%, 78%)`;
}

/**
 * Interactive chord label component.
 * Handles hover and click interactions for showing/pinning tooltips.
 * Each chord has a unique color based on its name for easy differentiation.
 */
export const Chord = memo(function Chord({
  name,
  position,
  prevEndPosition,
}: ChordProps) {
  const { pinnedChord, hoveredChord, pinChord, setHoveredChord } = useChordContext();
  const chordRef = useRef<HTMLSpanElement>(null);

  const isPinned = pinnedChord === name;
  const isHovered = hoveredChord === name;

  // Calculate spacing before this chord
  const spacesNeeded = Math.max(0, position - prevEndPosition);

  // Memoize colors based on chord name
  const { baseColor, hoverColor } = useMemo(() => ({
    baseColor: getChordColor(name),
    hoverColor: getChordHoverColor(name),
  }), [name]);

  const getPosition = useCallback(() => {
    if (!chordRef.current) return { x: 0, y: 0 };
    const rect = chordRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHoveredChord(name, getPosition());
  }, [name, setHoveredChord, getPosition]);

  const handleMouseLeave = useCallback(() => {
    setHoveredChord(null);
  }, [setHoveredChord]);

  const handleClick = useCallback(() => {
    pinChord(name, getPosition());
  }, [name, pinChord, getPosition]);

  return (
    <>
      {/* Spacing before chord */}
      {spacesNeeded > 0 && (
        <span class="whitespace-pre">{' '.repeat(spacesNeeded)}</span>
      )}

      {/* Chord label */}
      <span
        ref={chordRef}
        role="button"
        tabIndex={0}
        class={`
          cursor-pointer select-none font-semibold
          transition-colors duration-150
          relative
          py-0.5 -my-0.5 px-2.5 -mx-2.5
          focus:outline-none rounded-sm
        `}
        style={{
          color: isPinned 
            ? 'var(--color-chord-pinned)' 
            : isHovered 
              ? hoverColor 
              : baseColor,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {name}
      </span>
    </>
  );
});
