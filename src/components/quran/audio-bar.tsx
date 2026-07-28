"use client";

import { useState, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/reveal";
import { useAudioProgress } from "./hooks";
import {
  IconTile,
  OverflowPopover,
  ReaderIcon,
  cx,
  focusRing,
  focusRingOnAccent,
} from "./ui";

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

// Custom bottom player over the single hidden <audio>. Mounts on first play,
// stays while paused, unmounts only via its close button.
export function AudioBar({
  mounted,
  audioRef,
  playing,
  playerLabel,
  transientLabel,
  reciterName,
  autoAdvanceArmed,
  onDisarmAutoAdvance,
  onPlayPause,
  onPrevAyah,
  onNextAyah,
  canPrev,
  canNext,
  onClose,
  onOpenReciter,
  currentSrc,
  playbackRate,
  onSetPlaybackRate,
  autoplayBlocked,
}: {
  mounted: boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
  playing: boolean;
  playerLabel: string;
  transientLabel: string | null;
  reciterName: string;
  autoAdvanceArmed: boolean;
  onDisarmAutoAdvance: () => void;
  onPlayPause: () => void;
  onPrevAyah: () => void;
  onNextAyah: () => void;
  canPrev: boolean;
  canNext: boolean;
  onClose: () => void;
  onOpenReciter: () => void;
  currentSrc: string | null;
  playbackRate: number;
  onSetPlaybackRate: (rate: number) => void;
  autoplayBlocked: boolean;
}) {
  const reduce = useReducedMotion();
  const { currentTime, duration, buffered } = useAudioProgress(audioRef);
  const [menuOpen, setMenuOpen] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);

  // The persistent label is "SurahName N / ReciterName"; transient notify()
  // messages replace the title line for 2.5s.
  const separatorIndex = playerLabel.indexOf(" / ");
  const title =
    transientLabel ??
    (separatorIndex >= 0 ? playerLabel.slice(0, separatorIndex) : playerLabel);
  const subtitle =
    separatorIndex >= 0 ? playerLabel.slice(separatorIndex + 3) : reciterName;

  return (
    <AnimatePresence>
      {mounted ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "saturate(180%) blur(20px)",
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
          }}
          initial={reduce ? false : { y: 16, opacity: 0 }}
          animate={reduce ? undefined : { y: 0, opacity: 1 }}
          exit={reduce ? undefined : { y: 16, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="section-shell-wide pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {/* Scrubber */}
            <div className="flex h-7 items-center gap-3">
              <span className="w-10 text-xs tabular-nums text-muted">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex h-1.5 flex-1 items-center">
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 h-1 w-full self-center rounded-full bg-border"
                />
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 h-1 self-center rounded-full bg-border-strong/50"
                  style={{
                    width:
                      duration > 0
                        ? `${Math.min(100, (buffered / duration) * 100)}%`
                        : "0%",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 h-1 self-center rounded-full bg-accent"
                  style={{
                    width:
                      duration > 0
                        ? `${Math.min(100, (currentTime / duration) * 100)}%`
                        : "0%",
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 0}
                  step={0.1}
                  value={Math.min(currentTime, duration > 0 ? duration : 0)}
                  onChange={(event) => {
                    const audio = audioRef.current;
                    if (audio) audio.currentTime = Number(event.target.value);
                  }}
                  aria-label="Seek"
                  className="audio-scrubber relative z-10 h-1.5 w-full"
                />
              </div>
              <span className="w-10 text-right text-xs tabular-nums text-muted">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls */}
            <div className="grid h-12 grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-foreground">{title}</div>
                <div className="truncate text-xs text-muted">{subtitle}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous ayah"
                  disabled={!canPrev}
                  onClick={onPrevAyah}
                  className={cx(
                    "flex h-10 w-10 items-center justify-center rounded-full bg-surface/70 text-foreground transition-colors hover:bg-surface-deep/60 disabled:cursor-default disabled:opacity-40",
                    focusRing
                  )}
                >
                  <ReaderIcon name="skip-prev" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={onPlayPause}
                  className={cx(
                    "flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_10px_30px_-8px_var(--accent-glow)] transition hover:bg-accent-deep active:scale-[0.97]",
                    focusRingOnAccent,
                    autoplayBlocked && !playing && !reduce && "accent-glow"
                  )}
                >
                  <motion.span
                    key={playing ? "pause" : "play"}
                    initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                    animate={reduce ? undefined : { scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 430, damping: 30 }}
                    className="flex"
                  >
                    <ReaderIcon name={playing ? "pause" : "play"} className="h-5 w-5" />
                  </motion.span>
                </button>
                <button
                  type="button"
                  aria-label="Next ayah"
                  disabled={!canNext}
                  onClick={onNextAyah}
                  className={cx(
                    "flex h-10 w-10 items-center justify-center rounded-full bg-surface/70 text-foreground transition-colors hover:bg-surface-deep/60 disabled:cursor-default disabled:opacity-40",
                    focusRing
                  )}
                >
                  <ReaderIcon name="skip-next" className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 justify-self-end">
                {autoAdvanceArmed ? (
                  <button
                    type="button"
                    onClick={onDisarmAutoAdvance}
                    className={cx(
                      "hidden rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-soft-text transition-colors hover:bg-accent-soft/70 sm:block",
                      focusRing
                    )}
                  >
                    Auto-advancing
                  </button>
                ) : null}
                <div className="relative">
                  <IconTile
                    label="More audio options"
                    icon="kebab"
                    onClick={() => setMenuOpen((current) => !current)}
                  />
                  <OverflowPopover
                    open={menuOpen}
                    onClose={() => {
                      setMenuOpen(false);
                      setSpeedOpen(false);
                    }}
                    anchor="up"
                    items={
                      speedOpen
                        ? PLAYBACK_RATES.map((rate) => ({
                            label: `${rate}x${rate === playbackRate ? " (current)" : ""}`,
                            icon: rate === playbackRate ? ("check" as const) : undefined,
                            onSelect: () => {
                              onSetPlaybackRate(rate);
                              setSpeedOpen(false);
                            },
                          }))
                        : [
                            {
                              label: "Download audio",
                              icon: "link" as const,
                              disabled: !currentSrc,
                              onSelect: () => {
                                if (!currentSrc) return;
                                const anchor = document.createElement("a");
                                anchor.href = currentSrc;
                                anchor.download = "";
                                anchor.rel = "noopener";
                                anchor.target = "_blank";
                                document.body.appendChild(anchor);
                                anchor.click();
                                document.body.removeChild(anchor);
                              },
                            },
                            {
                              label: `Playback speed (${playbackRate}x)`,
                              icon: "list" as const,
                              onSelect: () => {
                                setSpeedOpen(true);
                                setMenuOpen(true);
                              },
                            },
                            {
                              label: "Reciter",
                              icon: "gear" as const,
                              onSelect: onOpenReciter,
                            },
                          ]
                    }
                  />
                </div>
                <IconTile label="Stop and close player" icon="x" onClick={onClose} />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
