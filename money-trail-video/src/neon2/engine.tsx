import React from "react";
import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { LucideIcon } from "lucide-react";
import { BODY, DISPLAY, PHRASES, useT, W } from "../lib";
import { N, glow } from "../neon/kit";

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const easeIO = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/** Keyframe track: [time, value, duration?]. Holds, then eases to each new value. */
export const track = (t: number, keys: [number, number, number?][]) => {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [kt, kv, kd = 0.8] = keys[i];
    if (t < kt) break;
    v = v + (kv - v) * easeIO(clamp01((t - kt) / kd));
  }
  return v;
};

/** Window helper: 0..1 visible with ease in/out. */
export const vis = (t: number, a: number, b: number, f = 0.3) => Math.min(easeOut(clamp01((t - a) / f)), easeOut(clamp01((b - t) / f)));

/** Spring pop 0..1 starting at time a. */
export const usePop = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (a: number, damping = 11) => spring({ frame: f - Math.round(a * fps), fps, config: { damping, stiffness: 140, mass: 0.7 } });
};

// --- camera -------------------------------------------------------------------

const PST = PHRASES.map((p) => W(p[0]));
const PUNCH = [0, 0.045, 0.02, 0.06];
const DRIFT = [0, 22, -16, 10];
const punchKeys: [number, number, number?][] = PST.map((s, i) => [s, PUNCH[i % 4], 0.7]);
const driftKeys: [number, number, number?][] = PST.map((s, i) => [s, DRIFT[i % 4], 0.9]);
punchKeys.unshift([0, 0]);
driftKeys.unshift([0, 0]);

export type Cam = [number, number, number, number, number?][]; // [time, x, y, zoom, dur]

/** World container with an animated camera (pan/zoom), phrase "punches" and shakes. */
export const Camera: React.FC<{ cam: Cam; shakes?: number[]; w?: number; children: React.ReactNode }> = ({ cam, shakes = [], children }) => {
  const t = useT();
  const x = track(t, cam.map((k) => [k[0], k[1], k[4]]));
  const y = track(t, cam.map((k) => [k[0], k[2], k[4]]));
  let z = track(t, cam.map((k) => [k[0], k[3], k[4]]));
  z *= 1 + track(t, punchKeys) + 0.01 * Math.sin(t * 0.7);
  const dx = track(t, driftKeys);
  let sx = 0;
  let sy = 0;
  for (const s of shakes) {
    if (t >= s && t < s + 0.6) {
      const k = Math.exp(-(t - s) * 7) * 22;
      sx += (random(`sx${Math.floor(t * 60)}`) - 0.5) * k;
      sy += (random(`sy${Math.floor(t * 60)}`) - 0.5) * k;
    }
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          transform: `translate(${960 - x * z + sx + dx}px, ${540 - y * z + sy}px) scale(${z})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// --- scene transitions ----------------------------------------------------------

export type Tr = "whip" | "zoom" | "drop" | "fade" | "whipL";
export type SceneDef = { at: number; tr: Tr; el: React.FC };
const TD = 0.5;

export const Scenes: React.FC<{ list: SceneDef[] }> = ({ list }) => {
  const t = useT();
  let i = 0;
  for (let k = 0; k < list.length; k++) if (t >= list[k].at) i = k;
  const cur = list[i];
  const Cur = cur.el;
  const p = clamp01((t - cur.at) / TD);
  if (i === 0 || p >= 1) {
    return (
      <AbsoluteFill>
        <Cur />
      </AbsoluteFill>
    );
  }
  const Prev = list[i - 1].el;
  const e = easeIO(p);
  const blur = Math.sin(p * Math.PI) * 26;
  let outS: React.CSSProperties = {};
  let inS: React.CSSProperties = {};
  if (cur.tr === "whip" || cur.tr === "whipL") {
    const d = cur.tr === "whip" ? 1 : -1;
    outS = { transform: `translateX(${-d * e * 2100}px)`, filter: `blur(${blur}px)` };
    inS = { transform: `translateX(${d * (1 - e) * 2100}px)`, filter: `blur(${blur}px)` };
  } else if (cur.tr === "drop") {
    outS = { transform: `translateY(${-e * 1200}px)`, filter: `blur(${blur}px)` };
    inS = { transform: `translateY(${(1 - e) * 1200}px)`, filter: `blur(${blur}px)` };
  } else if (cur.tr === "zoom") {
    outS = { transform: `scale(${1 + e * 2.2})`, opacity: 1 - e, filter: `blur(${blur * 0.6}px)` };
    inS = { transform: `scale(${0.65 + 0.35 * e})`, opacity: e };
  } else {
    outS = { opacity: 1 - e };
    inS = { opacity: e };
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={outS}>
        <Prev />
      </AbsoluteFill>
      <AbsoluteFill style={inS}>
        <Cur />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- actor (walking, reacting neon character) ---------------------------------------

export type PoseName =
  | "idle"
  | "wave"
  | "point"
  | "up"
  | "phone"
  | "hold"
  | "shrug"
  | "stop"
  | "down"
  | "ears"
  | "think"
  | "reach"
  | "cheer"
  | "facepalm";
export type Face = "neutral" | "happy" | "worried" | "shock" | "sad" | "smirk" | "angry";
export type Arms = { l: [number, number]; r: [number, number] };
export const POSES: Record<PoseName, Arms> = {
  idle: { l: [12, 6], r: [12, 6] },
  wave: { l: [12, 6], r: [140, 170] },
  point: { l: [12, 6], r: [80, 88] },
  up: { l: [150, 165], r: [150, 165] },
  cheer: { l: [140, 175], r: [140, 175] },
  phone: { l: [12, 6], r: [25, 150] },
  hold: { l: [30, 110], r: [30, 110] },
  shrug: { l: [45, 125], r: [45, 125] },
  stop: { l: [12, 6], r: [70, 150] },
  down: { l: [4, 0], r: [4, 0] },
  ears: { l: [130, 230], r: [130, 230] },
  think: { l: [20, 120], r: [25, 165] },
  reach: { l: [12, 6], r: [70, 75] },
  facepalm: { l: [12, 6], r: [40, 190] },
};

/** Pose timeline with smooth blending between poses. */
export const poseAt = (t: number, list: [number, PoseName, Face][]) => {
  let i = 0;
  for (let k = 0; k < list.length; k++) if (t >= list[k][0]) i = k;
  const cur = list[i];
  const prev = list[Math.max(0, i - 1)];
  const p = easeIO(clamp01((t - cur[0]) / 0.28));
  const A = POSES[prev[1]];
  const B = POSES[cur[1]];
  const mixA = (a: [number, number], b: [number, number]): [number, number] => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];
  return { arms: { l: mixA(A.l, B.l), r: mixA(A.r, B.r) }, face: cur[2], pose: cur[1] };
};

/** Position track that also tells whether the actor is walking. */
export const moveAt = (t: number, keys: [number, number, number?][]) => {
  const x = track(t, keys);
  const x2 = track(t + 1 / 30, keys);
  return { x, walking: Math.abs(x2 - x) > 0.4, dir: x2 >= x ? 1 : -1 };
};

const limb = (pts: [number, number][], c: string, k: string) => {
  const s = pts.map((p) => p.join(",")).join(" ");
  return (
    <g key={k}>
      <polyline points={s} fill="none" stroke={c} strokeWidth={21} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={s} fill="none" stroke={N.fill} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[1][0]} cy={pts[1][1]} r={9} fill={N.fill} stroke={c} strokeWidth={3} />
    </g>
  );
};

export type ActorProp = "cap" | "badge" | "headset" | "tie" | "glasses" | "hair" | "gavel" | "vest" | "police";

export const Actor: React.FC<{
  x: number;
  y: number;
  s?: number;
  color?: string;
  arms?: Arms;
  face?: Face;
  props?: ActorProp[];
  walking?: boolean;
  dir?: number;
  jump?: number;
  tilt?: number;
  opacity?: number;
  label?: string;
  hold?: React.ReactNode; // drawn at right hand (screen space of actor svg)
  seed?: string;
}> = ({ x, y, s = 1, color = N.mint, arms = POSES.idle, face = "neutral", props = [], walking = false, dir = 1, jump = 0, tilt = 0, opacity = 1, label, hold, seed = "a" }) => {
  const f = useCurrentFrame();
  const ph = f / 4.2;
  const bob = walking ? Math.abs(Math.sin(ph)) * -8 : Math.sin(f / 22 + random(seed) * 6) * 2.5;
  const blink = (f + Math.floor(random(seed + "b") * 90)) % 110 < 4;
  const swing = walking ? Math.sin(ph) : 0;
  const A: Arms = walking && arms === POSES.idle ? { l: [12 + 26 * swing, 10], r: [12 - 26 * swing, 10] } : arms;
  const armPts = (side: 1 | -1, [u, fa]: [number, number]): [number, number][] => {
    const sx = 100 + side * 40;
    const sy = 158;
    const ex = sx + side * Math.sin((u * Math.PI) / 180) * 58;
    const ey = sy + Math.cos((u * Math.PI) / 180) * 58;
    const fx = ex + side * Math.sin((fa * Math.PI) / 180) * 52;
    const fy = ey + Math.cos((fa * Math.PI) / 180) * 52;
    return [
      [sx, sy],
      [ex, ey],
      [fx, fy],
    ];
  };
  const legPts = (hx: number, w: number): [number, number][] => {
    const a = (w * 28 * Math.PI) / 180;
    const kx = hx + Math.sin(a) * 70;
    const ky = 240 + Math.cos(a) * 70;
    const sa = a - Math.max(0, w) * 0.5;
    return [
      [hx, 240],
      [kx, ky],
      [kx + Math.sin(sa) * 66, ky + Math.cos(sa) * 66],
    ];
  };
  const Lp = armPts(-1, A.l);
  const Rp = armPts(1, A.r);
  const LL = legPts(84, walking ? swing : 0);
  const RL = legPts(116, walking ? -swing : 0);
  const has = (p: ActorProp) => props.includes(p);
  const eyeY = 70;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 100 * s,
        top: y - 400 * s + (bob - jump) * s,
        width: 200 * s,
        height: 400 * s,
        opacity,
        filter: glow(color),
      }}
    >
      <svg
        viewBox="0 0 200 400"
        width={200 * s}
        height={400 * s}
        style={{ overflow: "visible", transform: `scaleX(${dir}) rotate(${tilt}deg)`, transformOrigin: "50% 95%" }}
      >
        <ellipse cx={100} cy={394} rx={70} ry={10} fill={color} opacity={0.18} />
        {limb(LL, color, "ll")}
        {limb(RL, color, "rl")}
        <ellipse cx={LL[2][0] - 8} cy={LL[2][1] + 6} rx={20} ry={9} fill={N.fill} stroke={color} strokeWidth={3} />
        <ellipse cx={RL[2][0] + 8} cy={RL[2][1] + 6} rx={20} ry={9} fill={N.fill} stroke={color} strokeWidth={3} />
        <ellipse cx={100} cy={192} rx={46} ry={64} fill={N.fill} stroke={color} strokeWidth={3.5} />
        {has("vest") ? <path d="M70 150 L84 250 M130 150 L116 250" stroke={N.gold} strokeWidth={6} /> : null}
        {has("tie") ? <path d="M100 134 L92 150 L100 200 L108 150 Z" fill={color} /> : null}
        {has("police") ? <path d="M88 168 L100 160 L112 168 L108 186 L100 192 L92 186 Z" fill="none" stroke="#7fb8ff" strokeWidth={3} /> : null}
        {has("badge") ? (
          <g>
            <circle cx={100} cy={176} r={17} fill={N.fill} stroke={N.gold} strokeWidth={3} />
            <text x={100} y={185} textAnchor="middle" fontFamily={DISPLAY} fontSize={26} fill={N.gold}>
              $
            </text>
          </g>
        ) : null}
        {limb(Lp, color, "la")}
        {limb(Rp, color, "ra")}
        <circle cx={Lp[2][0]} cy={Lp[2][1]} r={11} fill={N.fill} stroke={color} strokeWidth={3} />
        <circle cx={Rp[2][0]} cy={Rp[2][1]} r={11} fill={N.fill} stroke={color} strokeWidth={3} />
        {has("gavel") ? (
          <g transform={`translate(${Rp[2][0]},${Rp[2][1]}) rotate(-30)`}>
            <rect x={-4} y={-46} width={8} height={46} fill={N.gold} />
            <rect x={-22} y={-62} width={44} height={18} rx={4} fill={N.fill} stroke={N.gold} strokeWidth={3} />
          </g>
        ) : null}
        {hold ? <g transform={`translate(${Rp[2][0]},${Rp[2][1]})`}>{hold}</g> : null}
        <rect x={92} y={116} width={16} height={14} fill={N.fill} stroke={color} strokeWidth={3} />
        {has("hair") ? <path d="M50 70 Q48 140 66 150 M150 70 Q152 140 134 150" stroke={color} strokeWidth={4} fill="none" /> : null}
        <circle cx={100} cy={70} r={50} fill={N.fill} stroke={color} strokeWidth={3.5} />
        <ellipse cx={80} cy={46} rx={12} ry={6} fill={color} opacity={0.25} transform="rotate(-25 80 46)" />
        {face === "happy" ? (
          <g stroke={N.white} strokeWidth={4} fill="none" strokeLinecap="round">
            <path d={`M76 ${eyeY + 2} Q84 ${eyeY - 8} 92 ${eyeY + 2}`} />
            <path d={`M108 ${eyeY + 2} Q116 ${eyeY - 8} 124 ${eyeY + 2}`} />
          </g>
        ) : (
          <g fill={N.white}>
            <ellipse cx={86} cy={eyeY} rx={face === "shock" ? 9 : 7} ry={blink ? 1.5 : face === "shock" ? 12 : 10} />
            <ellipse cx={118} cy={eyeY} rx={face === "shock" ? 9 : 7} ry={blink ? 1.5 : face === "shock" ? 12 : 10} />
          </g>
        )}
        {face === "worried" || face === "sad" ? (
          <g stroke={N.white} strokeWidth={3} strokeLinecap="round">
            <line x1={76} y1={52} x2={94} y2={47} />
            <line x1={110} y1={47} x2={128} y2={52} />
          </g>
        ) : null}
        {face === "angry" || face === "smirk" ? (
          <g stroke={N.white} strokeWidth={3} strokeLinecap="round">
            <line x1={76} y1={48} x2={94} y2={55} />
            <line x1={110} y1={55} x2={128} y2={48} />
          </g>
        ) : null}
        {face === "happy" ? (
          <path d="M88 92 Q102 106 116 92" stroke={N.white} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : face === "shock" ? (
          <ellipse cx={102} cy={98} rx={7} ry={9} fill="none" stroke={N.white} strokeWidth={3.5} />
        ) : face === "sad" || face === "worried" || face === "angry" ? (
          <path d="M90 100 Q102 92 114 100" stroke={N.white} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ) : face === "smirk" ? (
          <path d="M90 96 Q106 100 116 90" stroke={N.white} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ) : (
          <line x1={92} y1={96} x2={112} y2={94} stroke={N.white} strokeWidth={3.5} strokeLinecap="round" />
        )}
        {has("cap") || has("police") ? (
          <g>
            <path d="M52 58 Q56 14 100 14 Q144 14 148 58 Z" fill={N.fill} stroke={has("police") ? "#7fb8ff" : color} strokeWidth={3.5} />
            <path d="M120 54 Q160 52 178 62" stroke={has("police") ? "#7fb8ff" : color} strokeWidth={5} fill="none" strokeLinecap="round" />
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
        {has("glasses") ? (
          <g fill="none" stroke={N.white} strokeWidth={2.5}>
            <circle cx={86} cy={70} r={13} />
            <circle cx={118} cy={70} r={13} />
            <line x1={99} y1={70} x2={105} y2={70} />
          </g>
        ) : null}
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -48,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            background: N.white,
            color: "#0b2018",
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: 22,
            padding: "5px 15px",
            borderRadius: 999,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

// --- vehicles -------------------------------------------------------------------

const Wheel: React.FC<{ cx: number; cy: number; r: number; rot: number }> = ({ cx, cy, r, rot }) => (
  <g transform={`rotate(${rot} ${cx} ${cy})`}>
    <circle cx={cx} cy={cy} r={r} />
    <circle cx={cx} cy={cy} r={r * 0.38} />
    {[0, 60, 120].map((a) => (
      <line key={a} x1={cx + Math.cos((a * Math.PI) / 180) * r * 0.38} y1={cy + Math.sin((a * Math.PI) / 180) * r * 0.38} x2={cx + Math.cos((a * Math.PI) / 180) * r * 0.85} y2={cy + Math.sin((a * Math.PI) / 180) * r * 0.85} />
    ))}
    {[180, 240, 300].map((a) => (
      <line key={a} x1={cx + Math.cos((a * Math.PI) / 180) * r * 0.38} y1={cy + Math.sin((a * Math.PI) / 180) * r * 0.38} x2={cx + Math.cos((a * Math.PI) / 180) * r * 0.85} y2={cy + Math.sin((a * Math.PI) / 180) * r * 0.85} />
    ))}
  </g>
);

/** Pickup truck. Pass x as its moving position; wheels spin automatically. y = ground line. */
export const Pickup: React.FC<{ x: number; y: number; w?: number; color?: string; driver?: boolean; flip?: boolean; tilt?: number; opacity?: number; tarp?: number; tag?: string }> = ({
  x,
  y,
  w = 440,
  color = N.teal,
  driver,
  flip,
  tilt = 0,
  opacity = 1,
  tarp = 0,
  tag,
}) => {
  const k = w / 420;
  const rot = (x / (30 * k)) * (180 / Math.PI) * (flip ? -1 : 1);
  const f = useCurrentFrame();
  const jig = Math.abs(Math.sin(x / 40)) * 2;
  return (
    <svg
      viewBox="0 0 420 180"
      width={w}
      height={180 * k}
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - 172 * k - jig,
        overflow: "visible",
        opacity,
        filter: glow(color),
        transform: `scaleX(${flip ? -1 : 1}) rotate(${tilt}deg)`,
        transformOrigin: "20% 90%",
      }}
      fill={N.fill}
      stroke={color}
      strokeWidth={4}
      strokeLinejoin="round"
    >
      <path d="M20 135 L20 88 L215 88 L236 36 L322 36 L352 88 L398 94 Q412 98 412 114 L412 135 Z" />
      <path d="M244 46 L314 46 L336 86 L230 86 Z" opacity={0.75} />
      {driver ? (
        <g>
          <circle cx={285} cy={66} r={16} stroke={N.mint} />
          <path d="M268 60 Q272 44 285 44 Q300 44 302 60" stroke={N.mint} fill="none" />
        </g>
      ) : null}
      <line x1={150} y1={88} x2={150} y2={135} opacity={0.5} />
      <Wheel cx={95} cy={138} r={30} rot={rot} />
      <Wheel cx={335} cy={138} r={30} rot={rot} />
      <rect x={392} y={102} width={14} height={9} fill={N.gold} stroke="none" />
      <circle cx={412} cy={106} r={26 + Math.sin(f / 5) * 2} fill={N.gold} opacity={0.08} stroke="none" />
      {tarp > 0 ? (
        <path d="M10 140 Q30 40 120 30 Q260 10 360 40 Q420 70 418 140" fill={N.fill} stroke={N.lime} strokeDasharray="10 8" opacity={tarp} />
      ) : null}
      {tag ? (
        <g transform="translate(70 30) rotate(-8)">
          <rect x={0} y={0} width={120} height={46} rx={8} stroke={N.gold} />
          <text x={60} y={33} textAnchor="middle" fontFamily={DISPLAY} fontSize={30} fill={N.gold} stroke="none">
            {tag}
          </text>
        </g>
      ) : null}
    </svg>
  );
};

export const Tow: React.FC<{ x: number; y: number; w?: number; lift?: number; lights?: boolean }> = ({ x, y, w = 540, lift = 0, lights = true }) => {
  const k = w / 520;
  const f = useCurrentFrame();
  const on = Math.floor(f / 5) % 2 === 0;
  const rot = (x / (28 * k)) * (180 / Math.PI);
  return (
    <svg
      viewBox="0 0 520 220"
      width={w}
      height={220 * k}
      style={{ position: "absolute", left: x - w / 2, top: y - 196 * k, overflow: "visible", filter: glow(N.lime) }}
      fill={N.fill}
      stroke={N.lime}
      strokeWidth={4}
      strokeLinejoin="round"
    >
      <path d="M60 158 L60 122 L300 122 L300 158 Z" />
      <path d="M300 158 L300 96 L380 96 L402 56 L470 56 L496 102 L512 110 L512 158 Z" />
      <path d="M408 66 L462 66 L482 100 L394 100 Z" opacity={0.7} />
      <path d={`M160 122 L70 ${66 + lift * 12} L28 ${92 + lift * 12}`} fill="none" strokeWidth={6} />
      <path d={`M28 ${92 + lift * 12} L28 ${122 - lift * 2}`} fill="none" strokeWidth={3} />
      <Wheel cx={120} cy={168} r={28} rot={rot} />
      <Wheel cx={445} cy={168} r={28} rot={rot} />
      {lights ? (
        <g stroke="none">
          <rect x={410} y={44} width={22} height={10} rx={3} fill={on ? "#ffb020" : "#5a3a00"} />
          <rect x={436} y={44} width={22} height={10} rx={3} fill={on ? "#5a3a00" : "#ffb020"} />
          <circle cx={434} cy={50} r={on ? 90 : 60} fill="#ffb020" opacity={0.1} />
        </g>
      ) : null}
    </svg>
  );
};

// --- icons, bubbles, labels -------------------------------------------------------

/** Lucide icon in a glowing circle, springs in, floats, optional red cross. */
export const Ico: React.FC<{
  I: LucideIcon;
  x: number;
  y: number;
  a: number;
  b: number;
  size?: number;
  color?: string;
  label?: string;
  cross?: number;
  check?: number;
}> = ({ I, x, y, a, b, size = 90, color = N.mint, label, cross, check }) => {
  const t = useT();
  const pop = usePop();
  if (t < a - 0.1 || t > b + 0.4) return null;
  const sIn = pop(a);
  const out = easeOut(clamp01((b + 0.3 - t) / 0.3));
  const fl = Math.sin(t * 2.2 + x) * 6;
  const cx = cross !== undefined ? clamp01((t - cross) / 0.25) : 0;
  const ck = check !== undefined ? clamp01((t - check) / 0.25) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2 + fl,
        width: size,
        height: size,
        transform: `scale(${sIn * out})`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size,
          background: "radial-gradient(circle at 40% 35%, rgba(40,90,70,0.95), rgba(8,28,20,0.95))",
          border: `3px solid ${cx > 0.5 ? N.red : color}`,
          boxShadow: `0 0 ${size * 0.35}px ${cx > 0.5 ? N.red : color}88`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <I size={size * 0.5} color={cx > 0.5 ? N.red : color} strokeWidth={2.2} />
      </div>
      {cx > 0 ? (
        <svg width={size} height={size} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={size * 0.15} y1={size * 0.15} x2={size * 0.15 + size * 0.7 * cx} y2={size * 0.15 + size * 0.7 * cx} stroke={N.red} strokeWidth={8} strokeLinecap="round" />
          <line x1={size * 0.85} y1={size * 0.15} x2={size * 0.85 - size * 0.7 * cx} y2={size * 0.15 + size * 0.7 * cx} stroke={N.red} strokeWidth={8} strokeLinecap="round" />
        </svg>
      ) : null}
      {ck > 0 ? (
        <div
          style={{
            position: "absolute",
            right: -8,
            top: -8,
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: size,
            background: N.mint,
            color: "#04100b",
            fontWeight: 900,
            fontSize: size * 0.26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${ck})`,
          }}
        >
          ✓
        </div>
      ) : null}
      {label ? (
        <div
          style={{
            position: "absolute",
            top: size + 10,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: Math.max(18, size * 0.24),
            letterSpacing: 1,
            color: cx > 0.5 ? N.red : N.white,
            background: "rgba(4,16,11,0.8)",
            padding: "4px 12px",
            borderRadius: 999,
            border: `1px solid ${color}55`,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Speech bubble (world space). */
export const Say: React.FC<{ x: number; y: number; a: number; b: number; text: string; color?: string; size?: number }> = ({ x, y, a, b, text, color = N.white, size = 44 }) => {
  const t = useT();
  const pop = usePop();
  if (t < a - 0.1 || t > b + 0.4) return null;
  const s = pop(a) * easeOut(clamp01((b + 0.3 - t) / 0.3));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${s})`, transformOrigin: "30% 100%" }}>
      <div
        style={{
          background: "rgba(10,36,27,0.95)",
          border: `2.5px solid ${N.mint}`,
          borderRadius: 26,
          padding: "14px 26px",
          fontFamily: DISPLAY,
          fontSize: size,
          color,
          whiteSpace: "nowrap",
          boxShadow: `0 0 30px ${N.mint}55`,
        }}
      >
        {text}
      </div>
      <div style={{ width: 0, height: 0, marginLeft: 40, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: `18px solid ${N.mint}` }} />
    </div>
  );
};

/** Floating world label (big neon text). */
export const Tag: React.FC<{ x: number; y: number; a: number; b: number; text: string; color?: string; size?: number; rot?: number }> = ({ x, y, a, b, text, color = N.gold, size = 70, rot = 0 }) => {
  const t = useT();
  const pop = usePop();
  if (t < a - 0.1 || t > b + 0.4) return null;
  const s = pop(a) * easeOut(clamp01((b + 0.3 - t) / 0.3));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`,
        fontFamily: DISPLAY,
        fontSize: size,
        color,
        whiteSpace: "nowrap",
        textShadow: `0 0 18px ${color}aa, 0 0 40px ${color}55`,
      }}
    >
      {text}
    </div>
  );
};

/** Glowing line-art group. */
export const G: React.FC<{ x?: number; y?: number; w: number; h: number; color?: string; opacity?: number; sw?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  x = 0,
  y = 0,
  w,
  h,
  color = N.mint,
  opacity = 1,
  sw = 4,
  children,
  style,
}) => (
  <svg
    width={w}
    height={h}
    viewBox={`0 0 ${w} ${h}`}
    style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity, filter: glow(color, 0.8), ...style }}
    fill={N.fill}
    stroke={color}
    strokeWidth={sw}
    strokeLinejoin="round"
    strokeLinecap="round"
  >
    {children}
  </svg>
);

/** World floor grid that moves with the camera. */
export const Floor: React.FC<{ y?: number; x0?: number; x1?: number; color?: string }> = ({ y = 900, x0 = -1600, x1 = 3600, color = N.mint }) => {
  const cols = [];
  for (let x = x0; x <= x1; x += 120) cols.push(x);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={color} strokeWidth={2} opacity={0.5} />
      {[0, 1, 2, 3, 4, 5].map((r) => (
        <line key={r} x1={x0} y1={y + 18 + r * r * 14} x2={x1} y2={y + 18 + r * r * 14} stroke={color} strokeWidth={1} opacity={0.22 - r * 0.03} />
      ))}
      {cols.map((x) => (
        <line key={x} x1={x} y1={y} x2={960 + (x - 960) * 1.7} y2={y + 520} stroke={color} strokeWidth={1} opacity={0.14} />
      ))}
    </svg>
  );
};

// --- set pieces -------------------------------------------------------------------

export const Building: React.FC<{ x: number; y: number; w: number; h: number; color?: string; lit?: number; seed?: string; floors?: number; cols?: number }> = ({
  x,
  y,
  w,
  h,
  color = N.teal,
  lit = 0.6,
  seed = "b",
  floors = 3,
  cols = 4,
}) => {
  const wins = [];
  for (let r = 0; r < floors; r++)
    for (let c = 0; c < cols; c++) {
      const on = random(`${seed}${r}${c}`) < lit;
      wins.push(
        <rect
          key={`${r}-${c}`}
          x={30 + c * ((w - 60) / cols)}
          y={30 + r * ((h - 60) / floors)}
          width={(w - 60) / cols - 24}
          height={(h - 60) / floors - 30}
          rx={4}
          fill={on ? `${N.gold}55` : N.fill}
          stroke={on ? N.gold : color}
          strokeWidth={2}
        />,
      );
    }
  return (
    <G x={x} y={y - h} w={w} h={h} color={color}>
      <rect x={2} y={2} width={w - 4} height={h - 4} />
      {wins}
    </G>
  );
};

/** Building with columns: bank or courthouse. */
export const Columns: React.FC<{ x: number; y: number; w?: number; color?: string; title: string }> = ({ x, y, w = 560, color = N.gold, title }) => {
  const h = w * 0.78;
  return (
    <G x={x} y={y - h} w={w} h={h} color={color}>
      <path d={`M10 ${h * 0.3} L${w / 2} 6 L${w - 10} ${h * 0.3} Z`} />
      <rect x={30} y={h * 0.3} width={w - 60} height={20} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={60 + i * ((w - 150) / 4)} y={h * 0.3 + 30} width={30} height={h * 0.55} />
      ))}
      <rect x={10} y={h - 34} width={w - 20} height={16} />
      <rect x={0} y={h - 18} width={w} height={16} />
      <text x={w / 2} y={h * 0.24} textAnchor="middle" fontFamily={DISPLAY} fontSize={w * 0.07} fill={color} stroke="none">
        {title}
      </text>
    </G>
  );
};

export const Lamp: React.FC<{ x: number; y: number; on?: boolean; color?: string }> = ({ x, y, on = true, color = N.teal }) => (
  <>
    {on ? (
      <div
        style={{
          position: "absolute",
          left: x - 160,
          top: y - 360,
          width: 320,
          height: 360,
          background: `linear-gradient(180deg, ${N.gold}33, ${N.gold}00)`,
          clipPath: "polygon(44% 0, 56% 0, 100% 100%, 0 100%)",
        }}
      />
    ) : null}
    <G x={x - 40} y={y - 380} w={80} h={380} color={color}>
      <line x1={40} y1={380} x2={40} y2={20} />
      <path d="M40 20 L70 20" fill="none" />
      <rect x={58} y={14} width={22} height={14} rx={4} fill={on ? N.gold : N.fill} stroke={on ? N.gold : color} />
    </G>
  </>
);

export const Window: React.FC<{ x: number; y: number; w?: number; h?: number; night?: number; color?: string }> = ({ x, y, w = 300, h = 240, night = 1, color = N.teal }) => (
  <G x={x} y={y} w={w} h={h} color={color}>
    <rect x={2} y={2} width={w - 4} height={h - 4} rx={6} fill={night > 0.5 ? "rgba(10,20,50,0.6)" : "rgba(80,160,140,0.25)"} />
    <line x1={w / 2} y1={2} x2={w / 2} y2={h - 2} />
    <line x1={2} y1={h / 2} x2={w - 2} y2={h / 2} />
    {night > 0.5 ? (
      <circle cx={w * 0.72} cy={h * 0.28} r={22} fill={N.white} stroke={N.white} opacity={0.85} />
    ) : (
      <circle cx={w * 0.3} cy={h * 0.3} r={26} fill={N.gold} stroke={N.gold} />
    )}
    <path d={`M2 ${h - 40} L40 ${h - 70} L70 ${h - 50} L110 ${h - 90} L150 ${h - 60} L200 ${h - 85} L${w - 2} ${h - 55}`} fill="none" opacity={0.5} />
  </G>
);

export const Calendar: React.FC<{ x: number; y: number; a: number; b: number; text: string; sub?: string; color?: string; size?: number }> = ({ x, y, a, b, text, sub, color = N.red, size = 200 }) => {
  const t = useT();
  const pop = usePop();
  if (t < a - 0.1 || t > b + 0.4) return null;
  const s = pop(a) * easeOut(clamp01((b + 0.3 - t) / 0.3));
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, transform: `scale(${s})`, filter: glow(color, 0.8) }}>
      <div style={{ height: size * 0.24, background: color, borderRadius: "16px 16px 0 0" }} />
      <div
        style={{
          height: size * 0.76,
          background: N.fill,
          border: `3px solid ${color}`,
          borderTop: "none",
          borderRadius: "0 0 16px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: DISPLAY, fontSize: size * 0.42, color: N.white, lineHeight: 0.9 }}>{text}</div>
        {sub ? <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: size * 0.09, color, letterSpacing: 2 }}>{sub}</div> : null}
      </div>
    </div>
  );
};

/** A paper bill card in the world. */
export const Bill: React.FC<{ x: number; y: number; a: number; b: number; I: LucideIcon; title: string; amount: string; color?: string; state?: "paid" | "skipped" | null; rot?: number }> = ({
  x,
  y,
  a,
  b,
  I,
  title,
  amount,
  color = N.gold,
  state,
  rot = 0,
}) => {
  const t = useT();
  const pop = usePop();
  if (t < a - 0.1 || t > b + 0.4) return null;
  const s = pop(a) * easeOut(clamp01((b + 0.3 - t) / 0.3));
  const c = state === "paid" ? N.mint : state === "skipped" ? N.red : color;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 110,
        width: 300,
        padding: "20px 24px",
        background: "rgba(10,36,27,0.95)",
        border: `3px solid ${c}`,
        borderRadius: 20,
        boxShadow: `0 0 30px ${c}66`,
        transform: `scale(${s}) rotate(${rot + (state === "skipped" ? 6 : 0)}deg)`,
        opacity: state === "skipped" ? 0.75 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <I size={40} color={c} />
        <span style={{ fontFamily: DISPLAY, fontSize: 46, color: N.white }}>{title}</span>
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 64, color: c }}>{amount}</div>
      {state ? <div style={{ fontFamily: DISPLAY, fontSize: 44, color: c }}>{state === "paid" ? "✓ PAID" : "✕ SKIPPED"}</div> : null}
    </div>
  );
};

/** Flying object along a straight line (letters, coins, bills). */
export const Fly: React.FC<{ from: [number, number]; to: [number, number]; a: number; d?: number; children: React.ReactNode; arc?: number; spin?: number; keep?: number }> = ({
  from,
  to,
  a,
  d = 0.8,
  children,
  arc = 120,
  spin = 0,
  keep = 0.6,
}) => {
  const t = useT();
  if (t < a || t > a + d + keep) return null;
  const p = easeIO(clamp01((t - a) / d));
  const x = from[0] + (to[0] - from[0]) * p;
  const y = from[1] + (to[1] - from[1]) * p - Math.sin(p * Math.PI) * arc;
  const o = clamp01((a + d + keep - t) / 0.3);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${spin * p}deg)`, opacity: o }}>{children}</div>;
};

/** Small icon (no circle) for flying items. */
export const Mini: React.FC<{ I: LucideIcon; color?: string; size?: number }> = ({ I, color = N.gold, size = 60 }) => (
  <div style={{ filter: glow(color, 0.8) }}>
    <I size={size} color={color} strokeWidth={2.2} />
  </div>
);

/** Phone that rings (shakes) with glow. */
export const RingPhone: React.FC<{ x: number; y: number; a: number; b: number; ring?: boolean; size?: number }> = ({ x, y, a, b, ring = true, size = 150 }) => {
  const t = useT();
  const pop = usePop();
  if (t < a - 0.1 || t > b + 0.4) return null;
  const s = pop(a) * easeOut(clamp01((b + 0.3 - t) / 0.3));
  const sh = ring && Math.floor(t * 4) % 2 === 0 ? Math.sin(t * 90) * 8 : 0;
  return (
    <div style={{ position: "absolute", left: x - size * 0.3, top: y - size / 2, transform: `scale(${s}) rotate(${sh}deg)`, filter: glow(N.red, 0.8) }}>
      <svg width={size * 0.6} height={size} viewBox="0 0 60 100" fill={N.fill} stroke={ring ? N.red : N.teal} strokeWidth={3}>
        <rect x={2} y={2} width={56} height={96} rx={10} />
        <rect x={8} y={12} width={44} height={70} rx={4} fill={ring ? `${N.red}33` : N.fill} />
      </svg>
      {ring ? (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: -size * 0.2, top: 0, overflow: "visible" }} fill="none" stroke={N.red} strokeWidth={3}>
          <path d={`M88 30 Q98 50 88 70`} opacity={Math.floor(t * 6) % 2 ? 1 : 0.3} />
          <path d={`M12 30 Q2 50 12 70`} opacity={Math.floor(t * 6) % 2 ? 1 : 0.3} />
        </svg>
      ) : null}
    </div>
  );
};

export { N };
