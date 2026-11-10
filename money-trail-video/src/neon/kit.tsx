import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { BODY, DISPLAY, prog, useT, win } from "../lib";

export const N = {
  mint: "#5af0b0",
  teal: "#4fd1e0",
  lime: "#c4f06a",
  gold: "#f6c453",
  red: "#ff5a5f",
  pink: "#ff9ccf",
  white: "#f2fff8",
  bg: "#04100b",
  fill: "rgba(6,26,19,0.92)",
};

const glow = (c: string, s = 1) => `drop-shadow(0 0 ${3 * s}px ${c}) drop-shadow(0 0 ${12 * s}px ${c}88)`;

/** Mix two hex colors. */
const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const p = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `rgb(${p[0]},${p[1]},${p[2]})`;
};

/** World mood: 0 = healthy green, 1 = warning amber, 2 = danger red. */
export const moodColor = (m: number) =>
  m <= 1 ? mix("#2bd98f", "#f0a63a", Math.max(0, m)) : mix("#f0a63a", "#ff4b4b", Math.min(1, m - 1));

/** Dark stage: glow, perspective floor grid, drifting dust. */
export const World: React.FC<{ mood: number; night?: number }> = ({ mood, night = 0 }) => {
  const f = useCurrentFrame();
  const col = moodColor(mood);
  const lines = Array.from({ length: 23 }, (_, i) => i - 11);
  const rows = [0, 1, 2, 3, 4, 5, 6];
  return (
    <AbsoluteFill style={{ backgroundColor: N.bg }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% 78%, ${col}${night ? "30" : "55"}, rgba(0,0,0,0) 72%)` }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 40% at 50% 30%, ${col}24, rgba(0,0,0,0) 70%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.5 - night * 0.15 }}>
        {lines.map((i) => (
          <line key={i} x1={960 + i * 30} y1={640} x2={960 + i * 260} y2={1080} stroke={col} strokeWidth={1} opacity={0.5} />
        ))}
        {rows.map((r) => {
          const y = 640 + Math.pow((r + ((f / 90) % 1)) / 7, 2) * 440;
          return <line key={r} x1={0} y1={y} x2={1920} y2={y} stroke={col} strokeWidth={1} opacity={0.35 * (r / 7)} />;
        })}
        <rect x={0} y={600} width={1920} height={60} fill="url(#hz)" />
        <defs>
          <linearGradient id="hz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={N.bg} stopOpacity="1" />
            <stop offset="1" stopColor={N.bg} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 46 }, (_, i) => {
          const x = random(`px${i}`) * 1920;
          const sp = 0.15 + random(`ps${i}`) * 0.35;
          const y = 1080 - ((random(`py${i}`) * 1080 + f * sp) % 1080);
          const r = 0.8 + random(`pr${i}`) * 1.8;
          const o = 0.15 + 0.35 * Math.abs(Math.sin(f / 40 + i));
          return <circle key={i} cx={x} cy={y} r={r} fill={col} opacity={o} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: `rgba(0,4,12,${night * 0.35})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};

export type Pose = "idle" | "wave" | "point" | "up" | "phone" | "hold" | "shrug" | "stop" | "down";
export type Mood = "neutral" | "happy" | "worried" | "shock" | "sad" | "smirk";
export type Prop = "cap" | "badge" | "headset" | "tie" | "hat" | "glasses" | "hair" | "gavel" | "vest";

// [upper angle, forearm angle] in degrees from straight down, positive = away from body
const ARMS: Record<Pose, { l: [number, number]; r: [number, number] }> = {
  idle: { l: [12, 6], r: [12, 6] },
  wave: { l: [12, 6], r: [140, 170] },
  point: { l: [12, 6], r: [80, 88] },
  up: { l: [150, 165], r: [150, 165] },
  phone: { l: [12, 6], r: [25, 150] },
  hold: { l: [30, 110], r: [30, 110] },
  shrug: { l: [45, 120], r: [45, 120] },
  stop: { l: [12, 6], r: [60, 150] },
  down: { l: [5, 0], r: [5, 0] },
};

const limb = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, c: string, k: string) => (
  <g key={k}>
    <polyline points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} fill="none" stroke={c} strokeWidth={21} strokeLinecap="round" strokeLinejoin="round" />
    <polyline points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} fill="none" stroke={N.fill} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={x2} cy={y2} r={9} fill={N.fill} stroke={c} strokeWidth={3} />
    <circle cx={x3} cy={y3} r={11} fill={N.fill} stroke={c} strokeWidth={3} />
  </g>
);

/** Neon line-art person. (x, y) = feet position. Height ≈ 400 * scale. */
export const Person: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
  pose?: Pose;
  mood?: Mood;
  props?: Prop[];
  opacity?: number;
  flip?: boolean;
  seed?: string;
  label?: string;
}> = ({ x, y, scale = 1, color = N.mint, pose = "idle", mood = "neutral", props = [], opacity = 1, flip = false, seed = "p", label }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 22 + random(seed) * 6) * 2.5;
  const blink = (f + Math.floor(random(seed + "b") * 90)) % 110 < 4;
  const wave = pose === "wave" ? Math.sin(f / 4) * 14 : 0;
  const a = ARMS[pose];
  const arm = (side: 1 | -1, [u, fa]: [number, number], extra = 0) => {
    const sx = 100 + side * 40;
    const sy = 158;
    const ex = sx + side * Math.sin((u * Math.PI) / 180) * 58;
    const ey = sy + Math.cos((u * Math.PI) / 180) * 58;
    const fx = ex + side * Math.sin(((fa + extra) * Math.PI) / 180) * 52;
    const fy = ey + Math.cos(((fa + extra) * Math.PI) / 180) * 52;
    return { sx, sy, ex, ey, fx, fy };
  };
  const L = arm(-1, a.l);
  const R = arm(1, a.r, wave);
  const eyeY = 70;
  const has = (p: Prop) => props.includes(p);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 100 * scale,
        top: y - 400 * scale + bob,
        width: 200 * scale,
        height: 400 * scale,
        opacity,
        transform: flip ? "scaleX(-1)" : undefined,
        filter: glow(color),
      }}
    >
      <svg viewBox="0 0 200 400" width={200 * scale} height={400 * scale} style={{ overflow: "visible" }}>
        <ellipse cx={100} cy={394} rx={70} ry={10} fill={color} opacity={0.18} />
        {/* legs */}
        {limb(84, 240, 82, 316, 82, 380, color, "ll")}
        {limb(116, 240, 118, 316, 118, 380, color, "rl")}
        <ellipse cx={74} cy={386} rx={20} ry={9} fill={N.fill} stroke={color} strokeWidth={3} />
        <ellipse cx={126} cy={386} rx={20} ry={9} fill={N.fill} stroke={color} strokeWidth={3} />
        {/* body */}
        <ellipse cx={100} cy={192} rx={46} ry={64} fill={N.fill} stroke={color} strokeWidth={3.5} />
        {has("vest") ? <path d="M70 150 L84 250 M130 150 L116 250" stroke={N.gold} strokeWidth={6} opacity={0.9} /> : null}
        {has("tie") ? <path d="M100 134 L92 150 L100 200 L108 150 Z" fill={color} opacity={0.85} /> : null}
        {has("badge") ? (
          <g>
            <circle cx={100} cy={176} r={17} fill={N.fill} stroke={N.gold} strokeWidth={3} />
            <text x={100} y={185} textAnchor="middle" fontFamily={DISPLAY} fontSize={26} fill={N.gold}>
              $
            </text>
          </g>
        ) : null}
        {/* arms */}
        {limb(L.sx, L.sy, L.ex, L.ey, L.fx, L.fy, color, "la")}
        {limb(R.sx, R.sy, R.ex, R.ey, R.fx, R.fy, color, "ra")}
        {pose === "phone" ? <rect x={R.fx - 12} y={R.fy - 34} width={24} height={40} rx={5} fill={N.fill} stroke={color} strokeWidth={3} /> : null}
        {has("gavel") ? (
          <g transform={`translate(${R.fx},${R.fy}) rotate(-30)`}>
            <rect x={-4} y={-46} width={8} height={46} fill={N.gold} />
            <rect x={-22} y={-62} width={44} height={18} rx={4} fill={N.fill} stroke={N.gold} strokeWidth={3} />
          </g>
        ) : null}
        {/* neck + head */}
        <rect x={92} y={116} width={16} height={14} fill={N.fill} stroke={color} strokeWidth={3} />
        {has("hair") ? <path d="M50 70 Q48 140 66 150 M150 70 Q152 140 134 150" stroke={color} strokeWidth={4} fill="none" /> : null}
        <circle cx={100} cy={70} r={50} fill={N.fill} stroke={color} strokeWidth={3.5} />
        <ellipse cx={80} cy={46} rx={12} ry={6} fill={color} opacity={0.25} transform="rotate(-25 80 46)" />
        {/* eyes */}
        {mood === "happy" ? (
          <g stroke={N.white} strokeWidth={4} fill="none" strokeLinecap="round">
            <path d={`M76 ${eyeY + 2} Q84 ${eyeY - 8} 92 ${eyeY + 2}`} />
            <path d={`M108 ${eyeY + 2} Q116 ${eyeY - 8} 124 ${eyeY + 2}`} />
          </g>
        ) : (
          <g fill={N.white}>
            <ellipse cx={84} cy={eyeY} rx={mood === "shock" ? 9 : 7} ry={blink ? 1.5 : mood === "shock" ? 12 : 10} />
            <ellipse cx={116} cy={eyeY} rx={mood === "shock" ? 9 : 7} ry={blink ? 1.5 : mood === "shock" ? 12 : 10} />
          </g>
        )}
        {mood === "worried" || mood === "sad" ? (
          <g stroke={N.white} strokeWidth={3} strokeLinecap="round">
            <line x1={74} y1={52} x2={92} y2={47} />
            <line x1={108} y1={47} x2={126} y2={52} />
          </g>
        ) : null}
        {mood === "smirk" ? (
          <g stroke={N.white} strokeWidth={3} strokeLinecap="round">
            <line x1={74} y1={50} x2={92} y2={55} />
            <line x1={108} y1={55} x2={126} y2={50} />
          </g>
        ) : null}
        {/* mouth */}
        {mood === "happy" ? (
          <path d="M86 92 Q100 106 114 92" stroke={N.white} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : mood === "shock" ? (
          <ellipse cx={100} cy={98} rx={7} ry={9} fill="none" stroke={N.white} strokeWidth={3.5} />
        ) : mood === "sad" || mood === "worried" ? (
          <path d="M88 100 Q100 92 112 100" stroke={N.white} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ) : mood === "smirk" ? (
          <path d="M88 96 Q104 100 114 90" stroke={N.white} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ) : (
          <line x1={90} y1={96} x2={110} y2={94} stroke={N.white} strokeWidth={3.5} strokeLinecap="round" />
        )}
        {/* head props */}
        {has("cap") ? (
          <g>
            <path d="M52 58 Q56 14 100 14 Q144 14 148 58 Z" fill={N.fill} stroke={color} strokeWidth={3.5} />
            <path d="M120 54 Q160 52 178 62" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
            <circle cx={100} cy={16} r={4} fill={color} />
          </g>
        ) : null}
        {has("headset") ? (
          <g fill="none" stroke={color} strokeWidth={4}>
            <path d="M48 70 Q48 14 100 14 Q152 14 152 70" />
            <rect x={38} y={56} width={16} height={30} rx={7} fill={N.fill} />
            <rect x={146} y={56} width={16} height={30} rx={7} fill={N.fill} />
            <path d="M46 86 Q52 112 84 110" />
          </g>
        ) : null}
        {has("hat") ? (
          <g>
            <ellipse cx={100} cy={30} rx={72} ry={12} fill={N.fill} stroke={N.gold} strokeWidth={3} />
            <path d="M66 30 Q70 -4 100 -4 Q130 -4 134 30 Z" fill={N.fill} stroke={N.gold} strokeWidth={3} />
          </g>
        ) : null}
        {has("glasses") ? (
          <g fill="none" stroke={N.white} strokeWidth={2.5}>
            <circle cx={84} cy={70} r={13} />
            <circle cx={116} cy={70} r={13} />
            <line x1={97} y1={70} x2={103} y2={70} />
          </g>
        ) : null}
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -50,
            transform: `translateX(-50%) ${flip ? "scaleX(-1)" : ""}`,
            whiteSpace: "nowrap",
            background: N.white,
            color: "#0b2018",
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: 22,
            padding: "6px 16px",
            borderRadius: 999,
            filter: "none",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Generic line-art wrapper with neon glow. */
export const Neon: React.FC<{ x: number; y: number; w: number; h: number; vb: string; color?: string; opacity?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  x,
  y,
  w,
  h,
  vb,
  color = N.mint,
  opacity = 1,
  children,
  style,
}) => (
  <svg
    viewBox={vb}
    width={w}
    height={h}
    style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity, filter: glow(color), ...style }}
    fill={N.fill}
    stroke={color}
    strokeWidth={4}
    strokeLinejoin="round"
    strokeLinecap="round"
  >
    {children}
  </svg>
);

export const Truck: React.FC<{ x: number; y: number; w?: number; color?: string; opacity?: number; tarp?: boolean }> = ({
  x,
  y,
  w = 420,
  color = N.teal,
  opacity = 1,
  tarp,
}) => (
  <Neon x={x} y={y} w={w} h={w * 0.43} vb="0 0 420 180" color={color} opacity={opacity}>
    <path d="M20 135 L20 88 L215 88 L236 36 L322 36 L352 88 L398 94 Q412 98 412 114 L412 135 Z" />
    <path d="M244 46 L314 46 L336 86 L230 86 Z" opacity={0.7} />
    <line x1={150} y1={88} x2={150} y2={135} opacity={0.5} />
    <circle cx={95} cy={138} r={30} />
    <circle cx={95} cy={138} r={11} />
    <circle cx={335} cy={138} r={30} />
    <circle cx={335} cy={138} r={11} />
    <rect x={392} y={102} width={14} height={9} fill={N.gold} stroke="none" />
    {tarp ? <path d="M10 140 Q30 40 120 30 Q260 10 360 40 Q420 70 418 140" fill={N.fill} stroke={N.lime} strokeDasharray="10 8" /> : null}
  </Neon>
);

export const TowTruck: React.FC<{ x: number; y: number; w?: number; lights?: boolean; lift?: number }> = ({ x, y, w = 520, lights, lift = 0 }) => {
  const f = useCurrentFrame();
  const on = Math.floor(f / 6) % 2 === 0;
  return (
    <Neon x={x} y={y} w={w} h={w * 0.42} vb="0 0 520 220" color={N.lime}>
      <path d="M60 158 L60 122 L300 122 L300 158 Z" />
      <path d="M300 158 L300 96 L380 96 L402 56 L470 56 L496 102 L512 110 L512 158 Z" />
      <path d="M408 66 L462 66 L482 100 L394 100 Z" opacity={0.7} />
      <path d={`M160 122 L70 ${66 + lift * 10} L40 ${88 + lift * 10}`} fill="none" strokeWidth={6} />
      <path d={`M40 ${88 + lift * 10} L40 ${118 - lift * 4}`} fill="none" strokeWidth={3} />
      <circle cx={120} cy={168} r={28} />
      <circle cx={120} cy={168} r={10} />
      <circle cx={445} cy={168} r={28} />
      <circle cx={445} cy={168} r={10} />
      {lights ? (
        <g stroke="none">
          <rect x={410} y={44} width={22} height={10} rx={3} fill={on ? "#ffb020" : "#5a3a00"} />
          <rect x={436} y={44} width={22} height={10} rx={3} fill={on ? "#5a3a00" : "#ffb020"} />
          <circle cx={432} cy={50} r={on ? 60 : 40} fill="#ffb020" opacity={0.12} />
        </g>
      ) : null}
    </Neon>
  );
};

export const Garage: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 420 }) => (
  <Neon x={x} y={y} w={w} h={w * 0.8} vb="0 0 420 336" color={N.teal}>
    <path d="M10 330 L10 130 L210 20 L410 130 L410 330 Z" />
    <rect x={70} y={170} width={280} height={160} />
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1={70} y1={200 + i * 28} x2={350} y2={200 + i * 28} opacity={0.6} />
    ))}
    <rect x={190} y={260} width={40} height={30} rx={4} stroke={N.gold} />
    <circle cx={210} cy={273} r={5} fill={N.gold} stroke="none" />
  </Neon>
);

export const Barn: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 560 }) => (
  <Neon x={x} y={y} w={w} h={w * 0.72} vb="0 0 560 400" color={N.gold}>
    <path d="M20 396 L20 160 L120 60 L440 60 L540 160 L540 396" fill="none" />
    <path d="M20 160 L540 160" fill="none" opacity={0.5} />
    <path d="M200 396 L200 220 L360 220 L360 396" fill="none" />
    <path d="M200 220 L360 396 M360 220 L200 396" fill="none" opacity={0.6} />
  </Neon>
);

export const Bars: React.FC<{ x: number; y: number; w: number; h: number; opacity?: number }> = ({ x, y, w, h, opacity = 1 }) => (
  <Neon x={x} y={y} w={w} h={h} vb={`0 0 ${w} ${h}`} color={N.white} opacity={opacity}>
    <rect x={0} y={0} width={w} height={h} fill="none" strokeWidth={8} />
    {Array.from({ length: Math.floor(w / 60) }, (_, i) => (
      <line key={i} x1={40 + i * 60} y1={0} x2={40 + i * 60} y2={h} strokeWidth={9} />
    ))}
    <line x1={0} y1={h * 0.3} x2={w} y2={h * 0.3} strokeWidth={6} />
  </Neon>
);

/** Envelope with a face that gets angrier (anger 0..1). */
export const Envelope: React.FC<{ x: number; y: number; w?: number; anger?: number; label?: string }> = ({ x, y, w = 260, anger = 0, label }) => {
  const c = anger > 0.5 ? N.red : N.gold;
  return (
    <Neon x={x} y={y} w={w} h={w * 0.66} vb="0 0 260 172" color={c}>
      <rect x={4} y={4} width={252} height={164} rx={14} />
      <path d="M4 18 L130 100 L256 18" fill="none" />
      <circle cx={100} cy={120} r={7} fill={N.white} stroke="none" />
      <circle cx={160} cy={120} r={7} fill={N.white} stroke="none" />
      <line x1={86} y1={100 + anger * 6} x2={112} y2={106 - anger * 2} stroke={N.white} strokeWidth={4} />
      <line x1={148} y1={106 - anger * 2} x2={174} y2={100 + anger * 6} stroke={N.white} strokeWidth={4} />
      <path d={`M112 ${148} Q130 ${140 + anger * -6} 148 148`} fill="none" stroke={N.white} strokeWidth={4} />
      {label ? (
        <text x={130} y={-14} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={22} fill={c} stroke="none">
          {label}
        </text>
      ) : null}
    </Neon>
  );
};

/** Stage disc + spotlight cone (from the reference's audition stage). */
export const Spotlight: React.FC<{ x: number; y: number; w?: number; color?: string; opacity?: number }> = ({ x, y, w = 420, color = N.mint, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: 0, width: w, height: y + 40, opacity, pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: w * 0.32,
        right: w * 0.32,
        top: 0,
        bottom: 30,
        background: `linear-gradient(180deg, ${color}00, ${color}33)`,
        clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)",
        transform: "scaleX(2.2)",
      }}
    />
    <svg width={w} height={80} style={{ position: "absolute", left: 0, bottom: 0, overflow: "visible", filter: glow(color) }}>
      <ellipse cx={w / 2} cy={40} rx={w / 2 - 6} ry={34} fill={`${color}22`} stroke={color} strokeWidth={3} />
      <ellipse cx={w / 2} cy={40} rx={w / 2 - 40} ry={22} fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
    </svg>
  </div>
);

/** A crowd of small people (audience, bidders). */
export const Crowd: React.FC<{ x: number; y: number; cols: number; rows: number; gap?: number; scale?: number; opacity?: number; seed?: string; pose?: Pose }> = ({
  x,
  y,
  cols,
  rows,
  gap = 70,
  scale = 0.3,
  opacity = 1,
  seed = "c",
  pose,
}) => {
  const palette = [N.teal, N.lime, N.mint, N.teal, "#7fd7ff"];
  const out: React.ReactNode[] = [];
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = 0; c < cols; c++) {
      const k = `${seed}${r}-${c}`;
      const col = palette[Math.floor(random(k) * palette.length)];
      const p: Pose = pose && random(k + "p") > 0.6 ? pose : "idle";
      out.push(
        <Person
          key={k}
          seed={k}
          x={x + c * gap + (r % 2) * gap * 0.5}
          y={y - r * 46}
          scale={scale * (1 - r * 0.08)}
          color={col}
          pose={p}
          opacity={opacity * (1 - r * 0.15)}
        />,
      );
    }
  }
  return <>{out}</>;
};

/** Big countdown ring: the episode's metaphor. */
export const Countdown: React.FC<{ x: number; y: number; size: number; frac: number; label: string; sub?: string; color: string; opacity?: number }> = ({
  x,
  y,
  size,
  frac,
  label,
  sub,
  color,
  opacity = 1,
}) => {
  const r = size / 2 - 14;
  const C2 = 2 * Math.PI * r;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, opacity }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, filter: glow(color) }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill={N.fill} stroke={`${color}44`} strokeWidth={8} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const l = i % 5 === 0 ? 14 : 6;
          return (
            <line
              key={i}
              x1={size / 2 + Math.sin(a) * (r - 14)}
              y1={size / 2 - Math.cos(a) * (r - 14)}
              x2={size / 2 + Math.sin(a) * (r - 14 - l)}
              y2={size / 2 - Math.cos(a) * (r - 14 - l)}
              stroke={color}
              strokeWidth={2}
              opacity={0.6}
            />
          );
        })}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${C2 * frac} ${C2}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: size * 0.24, color: N.white, lineHeight: 0.9 }}>{label}</div>
        {sub ? <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: size * 0.045, letterSpacing: 2, color }}>{sub}</div> : null}
      </div>
    </div>
  );
};

/** White pill label with a dot, like the reference ("SAME AUDIENCE"). */
export const Pill: React.FC<{ x: number; y: number; text: string; a: number; b: number; color?: string }> = ({ x, y, text, a, b, color = N.mint }) => {
  const t = useT();
  const o = win(t, a, b, 0.3, 0.3);
  const s = interpolate(prog(t, a, a + 0.4), [0, 1], [0.8, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s})`,
        opacity: o,
        background: N.white,
        color: "#0b2018",
        fontFamily: BODY,
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: 1,
        padding: "10px 24px",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: `0 0 24px ${color}66`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 12, height: 12, borderRadius: 6, background: color }} />
      {text}
    </div>
  );
};

/** Text with an animated red strikethrough (the reference's myth-busting move). */
export const Strike: React.FC<{ x: number; y: number; text: string; a: number; strikeAt: number; b: number; size?: number }> = ({ x, y, text, a, strikeAt, b, size = 90 }) => {
  const t = useT();
  const o = win(t, a, b, 0.3, 0.4);
  const k = prog(t, strikeAt, strikeAt + 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity: o, whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: DISPLAY, fontSize: size, color: k > 0.5 ? "rgba(242,255,248,0.45)" : N.white, letterSpacing: 2 }}>{text}</div>
      <div
        style={{
          position: "absolute",
          left: -10,
          top: "48%",
          height: 10,
          width: `calc(${k * 100}% + 20px)`,
          background: N.red,
          borderRadius: 5,
          boxShadow: `0 0 20px ${N.red}`,
          transform: "rotate(-3deg)",
        }}
      />
    </div>
  );
};

/** Thought bubble above a point. */
export const Thought: React.FC<{ x: number; y: number; a: number; b: number; children: React.ReactNode; w?: number }> = ({ x, y, a, b, children, w = 300 }) => {
  const t = useT();
  const o = win(t, a, b, 0.3, 0.3);
  const s = interpolate(prog(t, a, a + 0.45), [0, 1], [0.6, 1]);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, opacity: o, transform: `scale(${s})`, transformOrigin: "30% 100%" }}>
      <div
        style={{
          height: w * 0.55,
          borderRadius: "50%",
          background: "rgba(20,60,45,0.85)",
          border: `2px solid ${N.mint}88`,
          boxShadow: `0 0 30px ${N.mint}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      <div style={{ width: 26, height: 26, borderRadius: 13, marginLeft: w * 0.22, marginTop: 8, background: "rgba(20,60,45,0.85)", border: `2px solid ${N.mint}88` }} />
      <div style={{ width: 14, height: 14, borderRadius: 7, marginLeft: w * 0.16, marginTop: 6, background: "rgba(20,60,45,0.85)", border: `2px solid ${N.mint}88` }} />
    </div>
  );
};

export { glow };
