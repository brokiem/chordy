import { createContext } from 'preact';
import { useContext, useState, useCallback, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

/**
 * Chord context state for managing tooltip interactions.
 */
interface ChordContextValue {
  /** Currently pinned chord name (null if none) */
  pinnedChord: string | null;
  /** Currently hovered chord name (null if none) */
  hoveredChord: string | null;
  /** Position of the active chord element for tooltip placement */
  activePosition: { x: number; y: number } | null;
  /** Pin a chord (clicking on it) */
  pinChord: (chord: string, position: { x: number; y: number }) => void;
  /** Unpin the current chord */
  unpinChord: () => void;
  /** Set hovered chord */
  setHoveredChord: (chord: string | null, position?: { x: number; y: number }) => void;
}

const ChordContext = createContext<ChordContextValue | null>(null);

interface ChordProviderProps {
  children: ComponentChildren;
}

/** Debounce delay for hover state changes (ms) */
const HOVER_DEBOUNCE_MS = 50;

/**
 * Provider component for chord interaction state.
 * Manages pinned and hovered chord states globally.
 */
export function ChordProvider({ children }: ChordProviderProps) {
  const [pinnedChord, setPinnedChord] = useState<string | null>(null);
  const [hoveredChord, setHoveredChordState] = useState<string | null>(null);
  const [activePosition, setActivePosition] = useState<{ x: number; y: number } | null>(null);
  
  // Ref to track debounce timeout for hover state
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pinChord = useCallback((chord: string, position: { x: number; y: number }) => {
    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // If clicking the same chord, unpin it
    if (pinnedChord === chord) {
      setPinnedChord(null);
      setActivePosition(null);
    } else {
      setPinnedChord(chord);
      setActivePosition(position);
    }
  }, [pinnedChord]);

  const unpinChord = useCallback(() => {
    setPinnedChord(null);
    setActivePosition(null);
  }, []);

  const setHoveredChord = useCallback((chord: string | null, position?: { x: number; y: number }) => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    if (chord) {
      // Immediate show on hover enter
      setHoveredChordState(chord);
      if (position && !pinnedChord) {
        setActivePosition(position);
      }
    } else {
      // Debounced hide on hover leave to prevent flickering
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredChordState(null);
        if (!pinnedChord) {
          setActivePosition(null);
        }
        hoverTimeoutRef.current = null;
      }, HOVER_DEBOUNCE_MS);
    }
  }, [pinnedChord]);

  return (
    <ChordContext.Provider
      value={{
        pinnedChord,
        hoveredChord,
        activePosition,
        pinChord,
        unpinChord,
        setHoveredChord,
      }}
    >
      {children}
    </ChordContext.Provider>
  );
}

/**
 * Hook to access chord context.
 * Must be used within a ChordProvider.
 */
export function useChordContext(): ChordContextValue {
  const context = useContext(ChordContext);
  if (!context) {
    throw new Error('useChordContext must be used within a ChordProvider');
  }
  return context;
}
