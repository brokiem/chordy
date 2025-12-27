import { useState, useEffect, useRef } from 'preact/hooks';
import { useLenis } from './LenisManager';
import { getAutoScrollSpeed, setAutoScrollSpeed } from '../services/song-preferences.service';

// Pixels per second at 1x speed
const BASE_SPEED_PPS = 50;

// Available speed multipliers
const SPEED_OPTIONS = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5, 10];

export function AutoScrollControls() {
  const { lenis } = useLenis();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(() => getAutoScrollSpeed());
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Track if scroll event was triggered by our autoscroll
  const isAutoScrolling = useRef(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSpeedMenuOpen(false);
      }
    };

    if (isSpeedMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSpeedMenuOpen]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle play/pause with Space
      // Ignore if user is typing in an input/textarea
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault(); // Prevent page scroll
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!lenis) return;

    if (isPlaying) {
      const startAutoScroll = () => {
         // Calculate remaining distance
         const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
         const currentScroll = lenis.scroll;
         const remainingDistance = maxScroll - currentScroll;
         
         if (remainingDistance <= 1) {
           setIsPlaying(false);
           return;
         }

         const pps = BASE_SPEED_PPS * speedMultiplier;
         const duration = remainingDistance / pps;

         isAutoScrolling.current = true;
         lenis.scrollTo(maxScroll, {
           duration: duration,
           easing: (t) => t, // Linear easing for constant speed
           lock: false,
           force: false,
           onComplete: () => {
             setIsPlaying(false);
             isAutoScrolling.current = false;
           }
         });
      };
      
      startAutoScroll();
      
      const stopOnInteraction = () => {
          // If we are playing, check if this interaction should stop it.
          // For wheel/touch, yes.
          // For keydown, only if it causes scroll? simplified: yes for any navigation key.
          if (isPlaying) {
              setIsPlaying(false);
              lenis.stop();
              lenis.start();
          }
      };

      window.addEventListener('wheel', stopOnInteraction);
      window.addEventListener('touchstart', stopOnInteraction);
      window.addEventListener('keydown', stopOnInteraction);

      return () => {
         window.removeEventListener('wheel', stopOnInteraction);
         window.removeEventListener('touchstart', stopOnInteraction);
         window.removeEventListener('keydown', stopOnInteraction);
         lenis.stop();
         lenis.start();
      };
    } else {
        lenis.stop();
        lenis.start();
    }
  }, [isPlaying, speedMultiplier, lenis]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeedMultiplier(newSpeed);
    setAutoScrollSpeed(newSpeed);
    setIsSpeedMenuOpen(false);
  };

  const increaseSpeed = () => {
    const currentIndex = SPEED_OPTIONS.indexOf(speedMultiplier);
    if (currentIndex < SPEED_OPTIONS.length - 1) {
      const newSpeed = SPEED_OPTIONS[currentIndex + 1];
      setSpeedMultiplier(newSpeed);
      setAutoScrollSpeed(newSpeed);
    }
  };

  const decreaseSpeed = () => {
    const currentIndex = SPEED_OPTIONS.indexOf(speedMultiplier);
    if (currentIndex > 0) {
      const newSpeed = SPEED_OPTIONS[currentIndex - 1];
      setSpeedMultiplier(newSpeed);
      setAutoScrollSpeed(newSpeed);
    }
  };

  if (!lenis) return null;

  return (
    <div class="fixed bottom-6 left-0 right-0 z-50 pointer-events-none px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto flex justify-end">
        <div 
          class="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] shadow-lg transition-transform hover:scale-[1.02]"
          role="region"
          aria-label="Autoscroll controls"
        >
      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        class={`h-8 w-8 rounded-full transition-colors flex items-center justify-center ${
          isPlaying 
            ? 'bg-[var(--color-accent)] text-white hover:opacity-90' 
            : 'bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)]'
        }`}
        title={isPlaying ? "Pause Autoscroll" : "Start Autoscroll"}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="ml-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Speed Controls */}
      <div class="flex items-center gap-1 px-1 relative" ref={menuRef}>
        <button
          onClick={decreaseSpeed}
          class="h-7 w-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] rounded-full transition-colors disabled:opacity-50"
          disabled={speedMultiplier <= SPEED_OPTIONS[0]}
          title="Decrease Speed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 12H4" />
          </svg>
        </button>
        
        <div class="relative">
            <button 
                onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                class="flex items-center gap-0.5 font-mono text-xs font-semibold pl-2 pr-1 py-1 text-center hover:bg-[var(--color-surface-hover)] rounded-md transition-colors group min-w-[50px] justify-between"
                title="Select Speed"
            >
              <span>{speedMultiplier}x</span>
              <svg 
                width="10" 
                height="10" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
                class={`text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-transform duration-200 ${isSpeedMenuOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isSpeedMenuOpen && (
                <div 
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-20 max-h-48 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl py-1 flex flex-col-reverse scrollbar-thin overscroll-contain"
                    data-lenis-prevent
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {SPEED_OPTIONS.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleSpeedChange(option)}
                            class={`w-full text-center py-1.5 text-xs font-mono hover:bg-[var(--color-surface-hover)] ${
                                speedMultiplier === option ? 'text-[var(--color-accent)] font-bold' : 'text-[var(--color-text)]'
                            }`}
                        >
                            {option}x
                        </button>
                    ))}
                </div>
            )}
        </div>

        <button
          onClick={increaseSpeed}
          class="h-7 w-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] rounded-full transition-colors disabled:opacity-50"
          disabled={speedMultiplier >= SPEED_OPTIONS[SPEED_OPTIONS.length - 1]}
          title="Increase Speed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
        </div>
      </div>
    </div>
  );
}
