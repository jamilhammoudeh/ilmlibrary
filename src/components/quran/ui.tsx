"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";
import { useBodyScrollLock, useModalFocus } from "./hooks";

export const EXIT_EASE: [number, number, number, number] = [0.4, 0, 1, 1];

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// Shared focus-visible treatments: focusRing for neutral controls,
// focusRingOnAccent for accent-filled primaries where an accent ring
// would vanish against the fill.
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50";
export const focusRingOnAccent =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-deep focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export type ReaderIconName =
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "search"
  | "gear"
  | "bookmark"
  | "bookmark-filled"
  | "play"
  | "pause"
  | "skip-prev"
  | "skip-next"
  | "x"
  | "copy"
  | "link"
  | "book"
  | "list"
  | "kebab"
  | "check"
  | "plus"
  | "minus"
  | "palette"
  | "info";

const ICON_PATHS: Record<ReaderIconName, ReactNode> = {
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </>
  ),
  bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />,
  "bookmark-filled": (
    <path
      d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
      fill="currentColor"
    />
  ),
  play: <path d="M7 5v14l12-7z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="6.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  "skip-prev": (
    <>
      <path d="M19 19 9.5 12 19 5z" fill="currentColor" stroke="none" />
      <path d="M6.5 5v14" />
    </>
  ),
  "skip-next": (
    <>
      <path d="m5 5 9.5 7L5 19z" fill="currentColor" stroke="none" />
      <path d="M17.5 5v14" />
    </>
  ),
  x: <path d="M18 6 6 18M6 6l12 12" />,
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </>
  ),
  book: <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />,
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  kebab: (
    <>
      <circle cx="12" cy="5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  palette: (
    <>
      <path d="M12 22a10 10 0 1 1 10-10c0 2.3-1.8 3.5-3.6 3.5H16a2 2 0 0 0-1.5 3.3c.4.4.6.9.6 1.4A1.8 1.8 0 0 1 12 22z" />
      <circle cx="7.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5v5M12 7.6h.01" />
    </>
  ),
};

export function ReaderIcon({
  name,
  className = "h-4 w-4",
}: {
  name: ReaderIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export function IconTile({
  label,
  onClick,
  icon,
  active = false,
  disabled = false,
  size = "md",
  className,
}: {
  label: string;
  onClick: () => void;
  icon: ReaderIconName;
  active?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "flex items-center justify-center rounded-full transition active:scale-95",
        focusRing,
        size === "sm" ? "h-8 w-8" : "h-9 w-9",
        disabled
          ? "cursor-default bg-surface/70 text-foreground opacity-40"
          : active
            ? "bg-accent-soft text-accent-soft-text"
            : "bg-surface/70 text-foreground hover:bg-surface-deep/60",
        className
      )}
    >
      <ReaderIcon name={icon} className={size === "sm" ? "h-4 w-4" : "h-[1.1rem] w-[1.1rem]"} />
    </button>
  );
}

export function SegmentedSwitch<T extends string>({
  value,
  options,
  onChange,
  size = "md",
  ariaLabel,
  className,
}: {
  value: T;
  options: { value: T; label: string; icon?: ReaderIconName }[];
  onChange: (v: T) => void;
  size?: "sm" | "md";
  ariaLabel: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const thumbId = useId();
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cx("flex rounded-full bg-surface-deep/60 p-0.5", className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cx(
              "relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 font-medium transition-colors sm:flex-none",
              focusRing,
              size === "sm" ? "h-8 text-xs" : "h-9 text-sm",
              selected ? "text-accent-soft-text" : "text-muted hover:text-foreground"
            )}
          >
            {/* Floating thumb: the opaque pastel selected-state pill (the
                accent-soft fill plus deep-green label carries the state,
                no stroke). */}
            {selected ? (
              <motion.span
                layoutId={reduce ? undefined : `seg-thumb-${thumbId}`}
                aria-hidden
                className="absolute inset-0 rounded-full bg-accent-soft shadow-sm"
                transition={{ type: "spring", stiffness: 430, damping: 34 }}
              />
            ) : null}
            <span className="relative z-10 flex items-center gap-1.5">
              {option.icon ? <ReaderIcon name={option.icon} className="h-4 w-4" /> : null}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ToggleSwitch({
  label,
  checked,
  onChange,
  description,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className={cx("flex items-center justify-between gap-4 py-1", disabled && "opacity-60")}>
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {description ? <div className="text-xs text-muted">{description}</div> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors",
          focusRing,
          disabled && "cursor-default",
          checked ? "bg-accent" : "bg-border-strong"
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[1.125rem]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

export function Stepper({
  value,
  steps,
  onChange,
  formatLabel,
  decreaseLabel,
  increaseLabel,
}: {
  value: number;
  steps: number[];
  onChange: (v: number) => void;
  formatLabel: (value: number, index: number, total: number) => string;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  const index = Math.max(0, steps.indexOf(value));
  return (
    <div className="flex items-center justify-between gap-3">
      <IconTile
        label={decreaseLabel}
        icon="minus"
        disabled={index <= 0}
        onClick={() => {
          if (index > 0) onChange(steps[index - 1]);
        }}
      />
      <div className="min-w-[7rem] text-center text-sm font-medium tabular-nums text-foreground">
        {formatLabel(value, index, steps.length)}
      </div>
      <IconTile
        label={increaseLabel}
        icon="plus"
        disabled={index >= steps.length - 1}
        onClick={() => {
          if (index < steps.length - 1) onChange(steps[index + 1]);
        }}
      />
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  autoFocus = false,
  onClear,
  inputId,
  className,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  onClear?: () => void;
  inputId?: string;
  className?: string;
  /** Right-slot affordance (e.g. a shortcut kbd); shown only while empty. */
  hint?: ReactNode;
}) {
  return (
    <div
      className={cx(
        "flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 transition-colors focus-within:border-accent",
        className
      )}
    >
      <ReaderIcon name="search" className="h-4 w-4 shrink-0 text-muted" />
      <input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
      />
      {hint && !value ? hint : null}
      {onClear && value ? (
        <button
          type="button"
          aria-label="Clear"
          onClick={onClear}
          className={cx(
            "shrink-0 rounded-md p-0.5 text-muted transition-colors hover:text-foreground",
            focusRing
          )}
        >
          <ReaderIcon name="x" className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

const DRAWER_SURFACE_STYLE = {
  background:
    "linear-gradient(155deg, rgba(247,246,240,0.88), rgba(235,228,220,0.78))",
} as const;

const PANEL_SURFACE_CLASS =
  "rounded-3xl border border-[var(--glass-border)] shadow-[0_24px_70px_-12px_rgba(30,24,18,0.32)] backdrop-blur-2xl backdrop-saturate-150";

export function DrawerShell({
  open,
  onClose,
  title,
  widthClass,
  headerExtra,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  widthClass: string;
  headerExtra?: ReactNode;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  useBodyScrollLock(open);
  useModalFocus(open, panelRef);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[60]" initial={false} exit={{ pointerEvents: "none" }}>
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-night/40 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cx(
              "absolute right-3 top-3 bottom-3 flex flex-col overflow-hidden outline-none",
              widthClass,
              PANEL_SURFACE_CLASS
            )}
            style={DRAWER_SURFACE_STYLE}
            initial={reduce ? false : { x: "calc(100% + 28px)" }}
            animate={reduce ? undefined : { x: 0 }}
            exit={
              reduce
                ? undefined
                : {
                    x: "calc(100% + 28px)",
                    transition: { duration: 0.34, ease: EXIT_EASE },
                  }
            }
            transition={reduce ? { duration: 0 } : { duration: 0.62, ease: EASE }}
          >
            <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
              {headerExtra ?? (
                <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
              )}
              <IconTile label="Close" icon="x" onClick={onClose} />
            </div>
            <div className="thin-scrollbar flex-1 overflow-y-auto px-5 pb-5">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function BottomSheetShell({
  open,
  onClose,
  zClass,
  maxHeightClass,
  ariaLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  zClass: "z-[60]" | "z-[80]";
  maxHeightClass: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  useBodyScrollLock(open);
  useModalFocus(open, panelRef);

  // Portal to <body>: sheets can be declared inside transformed or z-indexed
  // chrome (the header stack) without inheriting its stacking context.
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={cx("fixed inset-0", zClass)}
          initial={false}
          exit={{ pointerEvents: "none" }}
        >
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-night/40 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className={cx(
              "absolute inset-x-3 bottom-3 flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] outline-none",
              maxHeightClass,
              PANEL_SURFACE_CLASS
            )}
            style={DRAWER_SURFACE_STYLE}
            initial={reduce ? false : { y: "calc(100% + 28px)" }}
            animate={reduce ? undefined : { y: 0 }}
            exit={reduce ? undefined : { y: "calc(100% + 28px)" }}
            transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
          >
            <div aria-hidden className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border-strong" />
            <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export type OverflowItem = {
  label: string;
  icon?: ReaderIconName;
  onSelect: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

export function OverflowPopover({
  open,
  onClose,
  anchor,
  items,
  alignClass = "right-0",
}: {
  open: boolean;
  onClose: () => void;
  anchor: "up" | "down";
  items: OverflowItem[];
  alignClass?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Topmost-layer Escape: capture phase so the orchestrator's bubble-phase
  // chain never sees the event while a popover is open. Outside-dismiss
  // checks the positioned wrapper (which also holds the trigger) so the
  // trigger's own click toggles instead of close-then-reopen.
  useEffect(() => {
    if (!open) return;
    function onDown(event: MouseEvent) {
      const node = ref.current?.parentElement ?? ref.current;
      if (node && !node.contains(event.target as Node)) onClose();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={ref}
          role="menu"
          className={cx(
            "absolute z-[80] w-56 rounded-xl border border-border bg-[var(--glass-paper-strong)] py-1 shadow-[0_18px_50px_-12px_rgba(30,24,18,0.28)] backdrop-blur-xl",
            anchor === "up" ? "bottom-full mb-2" : "top-full mt-2",
            alignClass
          )}
          initial={reduce ? false : { opacity: 0, y: anchor === "up" ? 6 : -6, scale: 0.98 }}
          animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: anchor === "up" ? 6 : -6, scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                onClose();
                item.onSelect();
              }}
              className={cx(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition-colors",
                focusRing,
                item.disabled
                  ? "cursor-default opacity-40"
                  : "hover:bg-surface-deep/60",
                item.destructive ? "text-rose" : "text-foreground"
              )}
            >
              {item.icon ? <ReaderIcon name={item.icon} className="h-4 w-4 text-muted" /> : null}
              {item.label}
            </button>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
