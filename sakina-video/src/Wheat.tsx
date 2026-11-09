import React from "react";
import { C } from "./theme";

export const HEAD_LEN = 150;
export const HEAD_W = 44;
export const ROWS = 25;
export const PER_ROW = 4;

export type Grain = { x: number; y: number; rot: number; index: number };

/** 100 grains laid out in a teardrop head. Local coords: head base at (0,0), pointing up (-y). */
export const GRAINS: Grain[] = (() => {
  const out: Grain[] = [];
  let index = 0;
  for (let r = 0; r < ROWS; r++) {
    const v = r / (ROWS - 1);
    const w = HEAD_W * Math.sin(Math.PI * (0.18 + 0.78 * v)) + 6;
    const y = -8 - v * (HEAD_LEN - 18);
    for (let k = 0; k < PER_ROW; k++) {
      const off = (k - (PER_ROW - 1) / 2) / PER_ROW;
      out.push({ x: off * w + (r % 2 ? 2 : -2), y, rot: off * 50, index: index++ });
    }
  }
  return out;
})();

/** Wheat head. `grow` 0..1 scales the whole head; `shown` = how many grains are filled (0..100); `glow` 0..1. */
export const WheatHead: React.FC<{
  grow: number;
  shown?: number;
  glow?: number;
  pop?: (i: number) => number;
}> = ({ grow, shown = 100, glow = 0, pop }) => {
  if (grow <= 0) return null;
  return (
    <g transform={`scale(${grow})`}>
      {/* awns */}
      {[-14, -7, 0, 7, 14].map((dx, i) => (
        <line
          key={i}
          x1={dx * 0.6}
          y1={-HEAD_LEN + 16}
          x2={dx * 2.2}
          y2={-HEAD_LEN - 58 + Math.abs(dx) * 1.5}
          stroke={C.gold}
          strokeWidth={1.4}
          opacity={0.75}
        />
      ))}
      {glow > 0 ? (
        <ellipse cx={0} cy={-HEAD_LEN / 2} rx={HEAD_W} ry={HEAD_LEN * 0.62} fill="url(#grainGlow)" opacity={glow} />
      ) : null}
      {GRAINS.map((g) => {
        const filled = g.index < shown;
        const s = pop ? pop(g.index) : filled ? 1 : 0;
        return (
          <g key={g.index} transform={`translate(${g.x} ${g.y}) rotate(${g.rot})`}>
            <ellipse rx={5.4} ry={8.2} fill="none" stroke={C.goldDeep} strokeWidth={0.8} opacity={0.5} />
            {s > 0 ? (
              <ellipse rx={5.4 * s} ry={8.2 * s} fill={C.gold} stroke="#F3D58F" strokeWidth={0.6} />
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

export type Stalk = { angle: number; len: number; bx: number; by: number; tx: number; ty: number; cx: number; cy: number };

export const makeStalk = (bx: number, by: number, angleDeg: number, len: number, bend = 0.08): Stalk => {
  const a = (angleDeg * Math.PI) / 180;
  const tx = bx + len * Math.sin(a);
  const ty = by - len * Math.cos(a);
  // gentle outward bow
  const cx = bx + (tx - bx) * 0.5 + Math.sin(a) * len * bend;
  const cy = by + (ty - by) * 0.55;
  return { angle: angleDeg, len, bx, by, tx, ty, cx, cy };
};

/** Approximate stalk path length for dash animation. */
export const stalkLength = (s: Stalk) => s.len * 1.04;
