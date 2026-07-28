"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

// lg-and-up viewport check, SSR-safe (server snapshot assumes desktop).
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true
  );
}

// Navbar auto-hide: visible near the top or while scrolling up, hidden while
// scrolling down. lockVisible() suppresses hiding briefly (view toggles) so
// the chrome never vanishes mid-interaction.
export function useHeaderAutoHide(): {
  hidden: boolean;
  lockVisible: (ms?: number) => void;
} {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const lockUntil = useRef(0);

  const lockVisible = useCallback((ms = 600) => {
    lockUntil.current = Date.now() + ms;
    setHidden(false);
  }, []);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y < 80 || y < lastY.current - 4) {
        setHidden(false);
      } else if (y > lastY.current + 4 && Date.now() > lockUntil.current) {
        setHidden(true);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { hidden, lockVisible };
}

// Freeze the page behind any open drawer or sheet.
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

// Modal focus management for drawers and sheets: moves focus into the panel
// on open, traps Tab inside it, and restores focus on close.
export function useModalFocus(open: boolean, panelRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    // Don't steal focus from a field that autofocused inside the panel
    // (the SearchDrawer input).
    if (panel && !panel.contains(document.activeElement)) {
      panel.focus({ preventScroll: true });
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      previous?.focus({ preventScroll: true });
    };
  }, [open, panelRef]);
}

// Dismiss a popover on any mousedown outside its panel. Escape handling lives
// in the orchestrator's central priority chain.
export function useOutsideDismiss(
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  active: boolean
): void {
  useEffect(() => {
    if (!active) return;
    function onDown(event: MouseEvent) {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) onDismiss();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [active, onDismiss, ref]);
}

// Touch long-press detection over pointer events; movement past 10px cancels
// so scrolling never fires it.
export function useLongPress(
  onLongPress: (event: PointerEvent) => void,
  ms = 500
): {
  onPointerDown: (event: ReactPointerEvent) => void;
  onPointerUp: (event: ReactPointerEvent) => void;
  onPointerMove: (event: ReactPointerEvent) => void;
  onPointerCancel: (event: ReactPointerEvent) => void;
} {
  const timer = useRef<number | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const callbackRef = useRef(onLongPress);
  useEffect(() => {
    callbackRef.current = onLongPress;
  }, [onLongPress]);

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    origin.current = null;
  }, []);

  useEffect(() => clear, [clear]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType === "mouse") return;
      clear();
      origin.current = { x: event.clientX, y: event.clientY };
      const native = event.nativeEvent;
      timer.current = window.setTimeout(() => {
        timer.current = null;
        callbackRef.current(native);
      }, ms);
    },
    [clear, ms]
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (!origin.current) return;
      const dx = event.clientX - origin.current.x;
      const dy = event.clientY - origin.current.y;
      if (Math.hypot(dx, dy) > 10) clear();
    },
    [clear]
  );

  return {
    onPointerDown,
    onPointerUp: clear,
    onPointerMove,
    onPointerCancel: clear,
  };
}

// Live progress readout for the custom audio bar; buffered is the end of the
// last buffered range in seconds.
export function useAudioProgress(audioRef: RefObject<HTMLAudioElement | null>): {
  currentTime: number;
  duration: number;
  buffered: number;
} {
  const [progress, setProgress] = useState({
    currentTime: 0,
    duration: 0,
    buffered: 0,
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function read() {
      const element = audioRef.current;
      if (!element) return;
      let buffered = 0;
      try {
        const ranges = element.buffered;
        if (ranges.length > 0) buffered = ranges.end(ranges.length - 1);
      } catch {
        buffered = 0;
      }
      setProgress({
        currentTime: element.currentTime || 0,
        duration: Number.isFinite(element.duration) ? element.duration : 0,
        buffered,
      });
    }

    read();
    audio.addEventListener("timeupdate", read);
    audio.addEventListener("durationchange", read);
    audio.addEventListener("progress", read);
    audio.addEventListener("loadedmetadata", read);
    audio.addEventListener("emptied", read);
    return () => {
      audio.removeEventListener("timeupdate", read);
      audio.removeEventListener("durationchange", read);
      audio.removeEventListener("progress", read);
      audio.removeEventListener("loadedmetadata", read);
      audio.removeEventListener("emptied", read);
    };
  }, [audioRef]);

  return progress;
}
