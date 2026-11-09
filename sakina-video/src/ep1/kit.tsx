import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { LucideIcon } from "lucide-react";
import { AMIRI, C, KUFI, PLEX } from "../theme";

export const W = 1920;
export const H = 1080;
export const VO = 0.6; // narration starts here
export const N = (n: number) => n + VO;
export const REC_START = N(141.3);
export const REC_LEN = 24.2;
export const END = REC_START + REC_LEN + 7;

export const POP = Easing.bezier(0.34, 1.56, 0.64, 1);
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IO = Easing.bezier(0.65, 0, 0.35, 1);

export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

export const k = (t: number, input: number[], output: number[], easing: (n: number) => number = OUT) =>
  interpolate(t, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** 0 -> 1 -> 0 window with fades. */
export const win = (t: number, a: number, b: number, fi = 0.3, fo = 0.3) => {
  if (t < a || t > b) return 0;
  return Math.min(k(t, [a, a + fi], [0, 1]), k(t, [b - fo, b], [1, 0]));
};

export const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export type CamKey = [t: number, x: number, y: number, z: number, rot?: number];

export const camAt = (t: number, keys: CamKey[], shake = 1) => {
  const ts = keys.map((q) => q[0]);
  const get = (i: number) => interpolate(t, ts, keys.map((q) => q[i] ?? 0), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: IO });
  return {
    x: get(1) + Math.sin(t * 1.3) * 3 * shake + Math.sin(t * 2.7) * 1.5 * shake,
    y: get(2) + Math.cos(t * 1.1) * 2.5 * shake,
    z: get(3),
    rot: get(4) + Math.sin(t * 0.7) * 0.15 * shake,
  };
};

/**
 * A scene window with whip-pan style transitions in and out.
 * dir: 1 = enters from the right (RTL feels natural), -1 = from the left.
 */
export const Scene: React.FC<{ a: number; b: number; children: React.ReactNode; dir?: number; flashIn?: boolean }> = ({
  a,
  b,
  children,
  dir = 1,
  flashIn = false,
}) => {
  const t = useT();
  if (t < a - 0.01 || t > b + 0.01) return null;
  const inP = k(t, [a, a + 0.42], [1, 0], Easing.bezier(0.2, 0.9, 0.3, 1));
  const outP = k(t, [b - 0.32, b], [0, 1], Easing.bezier(0.6, 0, 0.9, 0.4));
  const dx = inP * 260 * dir - outP * 260 * dir;
  const blur = (inP + outP) * 16;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        translate: `${dx}px 0px`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        opacity: flashIn ? 1 : Math.min(1, 1.6 - inP * 1.2) * (1 - outP * 0.6),
      }}
    >
      {children}
      {flashIn ? (
        <div style={{ position: "absolute", inset: 0, background: "#FFF3D6", opacity: k(t, [a, a + 0.5], [0.9, 0]) }} />
      ) : null}
    </div>
  );
};

/** World container: a plate image (2400x1350 centred on 1920x1080) plus SVG overlay, moved by the camera. */
export const World: React.FC<{
  cam: { x: number; y: number; z: number; rot: number };
  plate?: string;
  plateFilter?: string;
  children?: React.ReactNode;
  html?: React.ReactNode;
}> = ({ cam, plate, plateFilter, children, html }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: W,
      height: H,
      transformOrigin: "0 0",
      transform: `translate(${W / 2}px, ${H / 2}px) rotate(${cam.rot}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`,
    }}
  >
    {plate ? (
      <Img
        src={staticFile(plate)}
        style={{ position: "absolute", left: -240, top: -135, width: 2400, height: 1350, filter: plateFilter }}
      />
    ) : null}
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {children}
    </svg>
    {html}
  </div>
);

export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.55, color = "0,0,0" }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(75% 75% at 50% 50%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
    }}
  />
);

/** Round icon badge that pops in, optional label underneath. */
export const IconBadge: React.FC<{
  Icon: LucideIcon;
  t: number;
  at: number;
  until?: number;
  x: number;
  y: number;
  size?: number;
  label?: string;
  sub?: string;
  color?: string;
  ring?: string;
}> = ({ Icon, t, at, until = 9999, x, y, size = 140, label, sub, color = C.gold, ring = C.gold }) => {
  const s = k(t, [at, at + 0.45], [0, 1], POP);
  const o = win(t, at, until, 0.15, 0.3);
  if (o <= 0) return null;
  const float = Math.sin((t - at) * 2.2) * 5;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 200,
        top: y - size / 2 + float,
        width: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: o,
        scale: s,
        direction: "rtl",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "rgba(11,28,34,0.88)",
          border: `3px solid ${ring}`,
          boxShadow: `0 0 0 8px rgba(217,178,95,0.12), 0 12px 40px rgba(0,0,0,0.45)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={size * 0.5} color={color} strokeWidth={1.8} />
      </div>
      {label ? (
        <div
          style={{
            fontFamily: KUFI,
            fontWeight: 700,
            fontSize: 44,
            color: C.sand,
            background: "rgba(11,28,34,0.82)",
            padding: "6px 22px",
            borderRadius: 14,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
      {sub ? <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 30, color: C.gold }}>{sub}</div> : null}
    </div>
  );
};

/** Thought bubble with text. (x,y) = bubble centre; tail points to (tx,ty). */
export const Bubble: React.FC<{
  t: number;
  at: number;
  until: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  children: React.ReactNode;
  color?: string;
  shake?: number;
  w?: number;
}> = ({ t, at, until, x, y, tx, ty, children, color = C.sand, shake = 0, w = 560 }) => {
  const o = win(t, at, until, 0.2, 0.25);
  if (o <= 0) return null;
  const s = k(t, [at, at + 0.4], [0.3, 1], POP);
  const sx = shake * Math.sin(t * 60) * 6;
  const dots = [0.25, 0.5, 0.72].map((f, i) => ({ x: tx + (x - tx) * f, y: ty + (y - ty) * f, r: 9 + i * 7 }));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x - d.r,
            top: d.y - d.r,
            width: d.r * 2,
            height: d.r * 2,
            borderRadius: "50%",
            background: "#F7F1E3",
            scale: k(t, [at + i * 0.06, at + 0.25 + i * 0.06], [0, 1], POP),
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: x - w / 2 + sx,
          top: y - 90,
          width: w,
          minHeight: 180,
          borderRadius: 90,
          background: "#F7F1E3",
          boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: s,
          direction: "rtl",
          fontFamily: KUFI,
          fontWeight: 700,
          fontSize: 58,
          color,
          textAlign: "center",
          padding: "20px 40px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Real photo card (riyal) with gold frame, glow and shine sweep. */
export const PhotoCard: React.FC<{
  t: number;
  at: number;
  until: number;
  x: number;
  y: number;
  size: number;
  src?: string;
  rot?: number;
  label?: string;
}> = ({ t, at, until, x, y, size, src = "bg/riyal.jpg", rot = -4, label }) => {
  const o = win(t, at, until, 0.12, 0.3);
  if (o <= 0) return null;
  const s = k(t, [at, at + 0.5], [1.6, 1], OUT);
  const blur = k(t, [at, at + 0.3], [18, 0]);
  const shine = k(t, [at + 0.35, at + 1.1], [-1, 2], IO);
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        opacity: o,
        scale: s,
        rotate: `${rot + Math.sin((t - at) * 1.5) * 1.5}deg`,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -30,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(217,178,95,0.45) 0%, rgba(217,178,95,0) 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          overflow: "hidden",
          border: `4px solid ${C.gold}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 65%)",
            translate: `${shine * size}px 0px`,
          }}
        />
      </div>
      {label ? (
        <div
          style={{
            position: "absolute",
            bottom: -70,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: KUFI,
            fontWeight: 700,
            fontSize: 46,
            color: C.gold,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Headline that reveals word by word. */
export const Headline: React.FC<{
  t: number;
  at: number;
  until: number;
  words: string[];
  x?: number;
  y: number;
  size?: number;
  color?: string;
  gold?: number[];
  font?: "kufi" | "amiri";
  step?: number;
  width?: number;
}> = ({ t, at, until, words, x = 960, y, size = 92, color = C.sand, gold = [], font = "kufi", step = 0.12, width = 1500 }) => {
  const o = win(t, at, until, 0.15, 0.3);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        width,
        top: y,
        direction: "rtl",
        textAlign: "center",
        opacity: o,
        fontFamily: font === "kufi" ? KUFI : AMIRI,
        fontWeight: 700,
        fontSize: size,
        lineHeight: font === "kufi" ? 1.35 : 1.7,
        color,
        textShadow: "0 6px 30px rgba(0,0,0,0.55)",
      }}
    >
      {words.map((w, i) => {
        const p = k(t, [at + i * step, at + i * step + 0.35], [0, 1]);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              translate: `0px ${(1 - p) * 26}px`,
              color: gold.includes(i) ? C.gold : undefined,
              marginInline: size * 0.12,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Name tag lower-third pointing at a character. */
export const NameTag: React.FC<{ t: number; at: number; until: number; x: number; y: number; name: string; sub: string }> = ({
  t,
  at,
  until,
  x,
  y,
  name,
  sub,
}) => {
  const o = win(t, at, until, 0.2, 0.3);
  if (o <= 0) return null;
  const line = k(t, [at, at + 0.35], [0, 1]);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, direction: "rtl" }}>
      <div style={{ width: 140 * line, height: 3, background: C.gold, marginBottom: 10 }} />
      <div
        style={{
          background: "rgba(11,28,34,0.88)",
          borderRight: `6px solid ${C.gold}`,
          padding: "10px 26px",
          borderRadius: 10,
          clipPath: `inset(0 ${(1 - k(t, [at + 0.15, at + 0.6], [0, 1])) * 100}% 0 0)`,
        }}
      >
        <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 56, color: C.gold, lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 30, color: C.sand }}>{sub}</div>
      </div>
    </div>
  );
};

/** Stars + slowly turning eight-point geometric pattern, used on the dark "idea" backdrops. */
export const IdeaBackdrop: React.FC<{ t: number; tint?: string }> = ({ t, tint = "#173843" }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(90% 90% at 50% 40%, ${tint} 0%, ${C.night} 60%, #050D10 100%)` }} />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 110 }, (_, i) => (
        <circle
          key={i}
          cx={rand(i) * W}
          cy={rand(i + 50) * H}
          r={0.8 + rand(i + 99) * 1.8}
          fill={C.sand}
          opacity={0.12 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.4 + i))}
        />
      ))}
      <g transform={`translate(${W / 2} ${H / 2}) rotate(${t * 3})`} opacity={0.07}>
        {[260, 420, 600, 820].map((r, j) => (
          <g key={j}>
            {[0, 45].map((a) => (
              <rect key={a} x={-r / 2} y={-r / 2} width={r} height={r} transform={`rotate(${a + j * 11})`} fill="none" stroke={C.gold} strokeWidth={2} />
            ))}
          </g>
        ))}
      </g>
    </svg>
  </>
);
