import { memo } from 'preact/compat';
import { Transition } from '@headlessui/react';
import { useToast } from '../context/ToastContext';
import type { Toast, ToastType } from '../context/ToastContext';

/**
 * Get icon for toast type
 */
function getToastIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    case 'error':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    case 'warning':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 6V10M10 14H10.01M9.99998 1.66667L1.66665 16.6667H18.3333L9.99998 1.66667Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    case 'info':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 14V10M10 6H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
  }
}

/**
 * Get styles for toast type
 * Using muted colors that match the dark theme
 */
function getToastStyles(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'bg-emerald-600/90 text-white border border-emerald-500/20';
    case 'error':
      return 'bg-rose-600/90 text-white border border-rose-500/20';
    case 'warning':
      return 'bg-amber-600/90 text-white border border-amber-500/20';
    case 'info':
      return 'bg-[var(--color-accent)]/90 text-white border border-[var(--color-accent)]/20';
  }
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: number) => void;
}

/**
 * Individual toast item with Headless UI transition
 */
const ToastItem = memo(function ToastItem({ toast, onRemove }: ToastItemProps) {
  return (
    <Transition
      appear
      show={true}
      enter="transform transition duration-200 ease-out"
      enterFrom="opacity-0 scale-90 translate-x-16 -translate-y-2"
      enterTo="opacity-100 scale-100 translate-x-0 translate-y-0"
      leave="transform transition duration-150 ease-in"
      leaveFrom="opacity-100 scale-100 translate-x-0 translate-y-0"
      leaveTo="opacity-0 scale-90 translate-x-16 -translate-y-2"
    >
      <div
        class={`
          flex items-start gap-3
          px-4 py-3 rounded-[var(--radius)] shadow-xl
          max-w-sm min-w-[280px]
          backdrop-blur-sm
          origin-top-right
          ${getToastStyles(toast.type)}
        `}
        role="alert"
      >
        {/* Icon */}
        <div class="flex-shrink-0 mt-0.5">{getToastIcon(toast.type)}</div>

        {/* Message */}
        <p class="flex-1 text-sm whitespace-pre-line leading-relaxed">
          {toast.message}
        </p>

        {/* Close button */}
        <button
          onClick={() => onRemove(toast.id)}
          class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M4 12L12 4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </Transition>
  );
});

/**
 * Global toast container overlay
 * Renders all active toasts with transitions
 */
export const ToastContainer = memo(function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <div class="pointer-events-auto space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
});
