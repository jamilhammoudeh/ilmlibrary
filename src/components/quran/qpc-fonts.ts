"use client";

import { qpcFontFamily, qpcPageId } from "./qpc-page";

// Imperative, idempotent QPC page-font registration for the study view.
// The mushaf river keeps its own declarative <QpcPageFontFace> font-storm
// guard (faces exist only on full-tier cards); the study view instead has
// hundreds of unvirtualized cards, so each distinct page face is registered
// at most once here. A registered face with no glyph usage triggers no
// network fetch, and faces left installed after unmount are harmless: the
// browser dedupes by family + src.

const loaded = new Map<number, Promise<void>>();

export function ensureQpcFontFace(pageNumber: number): void {
  const id = qpcPageId(pageNumber);
  if (document.head.querySelector(`style[data-qpc-face="${id}"]`)) return;
  const style = document.createElement("style");
  style.dataset.qpcFace = id;
  style.textContent = `@font-face{font-family:"QPCV4-${id}";src:url("/fonts/qpc-v4/p${id}.woff2") format("woff2");font-weight:400;font-style:normal;font-display:block;}`;
  document.head.appendChild(style);
}

export function loadQpcFont(pageNumber: number): Promise<void> {
  let promise = loaded.get(pageNumber);
  if (!promise) {
    promise = Promise.resolve().then(() => {
      ensureQpcFontFace(pageNumber);
      if ("fonts" in document) {
        return document.fonts.load(`1em "${qpcFontFamily(pageNumber)}"`).then(
          () => undefined,
          () => undefined
        );
      }
      return undefined;
    });
    loaded.set(pageNumber, promise);
  }
  return promise;
}
