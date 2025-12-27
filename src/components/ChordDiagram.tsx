import { memo } from 'preact/compat';
import type { ChordDiagramData } from '../types';

interface ChordDiagramProps {
  chord: ChordDiagramData;
  /** Size of the diagram (width in pixels) */
  size?: number;
}

/** Number of frets to display */
const FRET_COUNT = 5;
/** Number of strings */
const STRING_COUNT = 6;

/**
 * SVG-based guitar chord diagram component.
 * Clean, proportional design with emphasis on finger positions.
 */
export const ChordDiagram = memo(function ChordDiagram({
  chord,
  size = 120,
}: ChordDiagramProps) {
  const { frets, fingers, barres, baseFret = 1 } = chord;

  // Layout - taller frets
  const padding = { top: 26, left: 9, right: 9, bottom: 6 };
  const fretboardWidth = size - padding.left - padding.right;
  const fretboardHeight = fretboardWidth * 1.4;
  const stringSpacing = fretboardWidth / (STRING_COUNT - 1);
  const fretSpacing = fretboardHeight / FRET_COUNT;
  const dotRadius = stringSpacing * 0.36;

  const totalWidth = size;
  const totalHeight = padding.top + fretboardHeight + padding.bottom;

  // Calculate x position for a string (0-indexed, 0 = low E)
  const stringX = (stringIndex: number) =>
    padding.left + stringIndex * stringSpacing;

  // Calculate y position for a fret (1-indexed)
  const fretY = (fretNumber: number) =>
    padding.top + (fretNumber - 0.5) * fretSpacing;

  // Render the nut (thick line at top) or position indicator
  const renderNut = () => {
    if (baseFret === 1) {
      return (
        <rect
          x={padding.left}
          y={padding.top - 4}
          width={fretboardWidth}
          height={5}
          fill="var(--color-text)"
          rx={1}
        />
      );
    } else {
      // Show base fret number
      return (
        <>
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left + fretboardWidth}
            y2={padding.top}
            stroke="var(--color-text)"
            strokeWidth={2}
          />
          <text
            x={padding.left - 4}
            y={padding.top + fretSpacing * 0.5}
            fill="var(--color-text-muted)"
            fontSize={10}
            fontWeight={600}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {baseFret}
          </text>
        </>
      );
    }
  };

  // Render horizontal fret lines
  const renderFrets = () => {
    return Array.from({ length: FRET_COUNT + 1 }, (_, i) => (
      <line
        key={`fret-${i}`}
        x1={padding.left}
        y1={padding.top + i * fretSpacing}
        x2={padding.left + fretboardWidth}
        y2={padding.top + i * fretSpacing}
        stroke="var(--color-text)"
        strokeWidth={i === 0 ? 0 : 1}
        strokeOpacity={0.3}
      />
    ));
  };

  // Render vertical string lines
  const renderStrings = () => {
    return Array.from({ length: STRING_COUNT }, (_, i) => {
      const thickness = 1.5 + (5 - i) * 0.15;
      return (
        <line
          key={`string-${i}`}
          x1={stringX(i)}
          y1={padding.top}
          x2={stringX(i)}
          y2={padding.top + fretboardHeight}
          stroke="var(--color-text)"
          strokeWidth={thickness}
          strokeOpacity={0.35}
        />
      );
    });
  };

  // Render open/muted string indicators above the nut
  const renderStringIndicators = () => {
    return frets.map((fret, i) => {
      const x = stringX(i);
      const y = padding.top - 18;

      if (fret === 'x') {
        const s = 4;
        return (
          <g key={`muted-${i}`}>
            <line
              x1={x - s}
              y1={y - s}
              x2={x + s}
              y2={y + s}
              stroke="var(--color-text-muted)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1={x + s}
              y1={y - s}
              x2={x - s}
              y2={y + s}
              stroke="var(--color-text-muted)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
        );
      } else if (fret === 0) {
        return (
          <circle
            key={`open-${i}`}
            cx={x}
            cy={y}
            r={5}
            fill="none"
            stroke="var(--color-text)"
            strokeWidth={1.5}
            strokeOpacity={0.7}
          />
        );
      }
      return null;
    });
  };

  // Render finger dots
  const renderFingerDots = () => {
    return frets.map((fret, stringIndex) => {
      if (typeof fret !== 'number' || fret === 0) return null;

      // Check if this string at this fret is covered by a barre
      // String numbering: fromString=1 is high E (index 5), toString=6 is low E (index 0)
      const isCoveredByBarre = barres?.some((b) => {
        if (b.fret !== fret) return false;
        // Convert string numbers to indices: string 1 = index 5, string 6 = index 0
        const fromIndex = 6 - b.fromString; // e.g., fromString=1 -> index 5
        const toIndex = 6 - b.toString;     // e.g., toString=6 -> index 0
        const minIndex = Math.min(fromIndex, toIndex);
        const maxIndex = Math.max(fromIndex, toIndex);
        return stringIndex >= minIndex && stringIndex <= maxIndex;
      });

      if (isCoveredByBarre) return null;

      const x = stringX(stringIndex);
      const y = fretY(fret - (baseFret - 1));
      const finger = fingers?.[stringIndex];

      return (
        <g key={`dot-${stringIndex}`}>
          <circle
            cx={x}
            cy={y}
            r={dotRadius}
            fill="var(--color-text)"
          />
          {finger && (
            <text
              x={x}
              y={y + 0.5}
              fill="var(--color-bg)"
              fontSize={11}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {finger}
            </text>
          )}
        </g>
      );
    });
  };

  // Render barre indicators with endpoint dots
  const renderBarres = () => {
    if (!barres) return null;

    return barres.map((barre, i) => {
      // Convert string numbers to indices: string 1 = index 5 (high E), string 6 = index 0 (low E)
      const fromIndex = 6 - barre.fromString; // e.g., fromString=1 -> index 5
      const toIndex = 6 - barre.toString;     // e.g., toString=6 -> index 0
      const leftIndex = Math.min(fromIndex, toIndex);
      const rightIndex = Math.max(fromIndex, toIndex);
      
      const startX = stringX(leftIndex);
      const endX = stringX(rightIndex);
      const y = fretY(barre.fret - (baseFret - 1));
      const barHeight = dotRadius * 1.4;

      return (
        <g key={`barre-${i}`}>
          {/* Main bar connecting the strings */}
          <rect
            x={startX}
            y={y - barHeight / 2}
            width={endX - startX}
            height={barHeight}
            fill="var(--color-text)"
          />
          {/* Left endpoint circle */}
          <circle
            cx={startX}
            cy={y}
            r={dotRadius}
            fill="var(--color-text)"
          />
          <text
            x={startX}
            y={y}
            fill="var(--color-bg)"
            fontSize={11}
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="central"
          >
            1
          </text>
          {/* Right endpoint circle */}
          <circle
            cx={endX}
            cy={y}
            r={dotRadius}
            fill="var(--color-text)"
          />
          <text
            x={endX}
            y={y}
            fill="var(--color-bg)"
            fontSize={11}
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="central"
          >
            1
          </text>
        </g>
      );
    });
  };

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      class="chord-diagram block mx-auto"
    >
      {renderFrets()}
      {renderStrings()}
      {renderNut()}
      {renderStringIndicators()}
      {renderBarres()}
      {renderFingerDots()}
    </svg>
  );
});
