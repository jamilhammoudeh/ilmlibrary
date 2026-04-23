"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export function LightboxImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`cursor-pointer ${className ?? ""}`}
        onClick={() => setOpen(true)}
      />

      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          data-modal-overlay
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>
          <Image
            src={src}
            alt={alt}
            width={800}
            height={800}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
