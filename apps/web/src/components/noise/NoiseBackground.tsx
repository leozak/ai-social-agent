import type { PropsWithChildren } from "react";

export function NoiseBackground({ children }: PropsWithChildren) {
  return (
    <div
      className="relative min-h-screen bg-linear-to-br
                  from-neutral-800 to-neutral-600"
    >
      <svg className="hidden">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.80"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
      </svg>

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.1]"
        style={{ filter: "url(#noise)" }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
