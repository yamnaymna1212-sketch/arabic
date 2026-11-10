import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import WORDS_JSON from "./words.json";

export const FPS = 30;
export const WORDS = WORDS_JSON as { text: string; start: number; end: number }[];
/** Start time (s) of narration word i. */
export const W = (i: number) => WORDS[i].start;
export const WE = (i: number) => WORDS[i].end;

export const C = {
  ink: "#0b0d10",
  paper: "#f4efe6",
  gold: "#f2b544",
  red: "#e5484d",
  green: "#3dd68c",
  teal: "#5fb3b3",
  dim: "rgba(244,239,230,0.65)",
};
export const DISPLAY = "Bebas";
export const BODY = "Inter";

loadFont({ family: DISPLAY, url: staticFile("fonts/Bebas.woff2") });
loadFont({ family: BODY, url: staticFile("fonts/Inter.woff2"), weight: "100 900" });

export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 between a and b with easing. */
export const prog = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing: ease });

/** Visibility window with fade in/out. */
export const win = (t: number, a: number, b: number, fin = 0.35, fout = 0.35) =>
  Math.min(prog(t, a, a + fin), 1 - prog(t, b - fout, b));

/** A pop-in: scale + fade, returns style. */
export const pop = (t: number, a: number, b: number): React.CSSProperties => {
  const o = win(t, a, b, 0.3, 0.3);
  const s = interpolate(t, [a, a + 0.35], [0.85, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return { opacity: o, transform: `scale(${s})` };
};

export type Move = "in" | "out" | "left" | "right" | "up";

/** One cinematic still with a slow camera move, cross-faded by the timeline. */
export const Plate: React.FC<{
  src: string;
  t0: number;
  t1: number;
  move: Move;
  focusX?: number;
  focusY?: number;
  blur?: number;
  dark?: number;
}> = ({ src, t0, t1, move, focusX = 50, focusY = 45, blur = 0, dark = 0 }) => {
  const t = useT();
  const p = interpolate(t, [t0, t1], [0, 1], clamp);
  let scale = 1.08;
  let x = 0;
  let y = 0;
  if (move === "in") scale = 1.06 + 0.12 * p;
  if (move === "out") scale = 1.18 - 0.12 * p;
  if (move === "left") x = 3 - 6 * p;
  if (move === "right") x = -3 + 6 * p;
  if (move === "up") y = 2.5 - 5 * p;
  if (move === "left" || move === "right" || move === "up") scale = 1.14;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.ink }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: `${focusX}% ${focusY}%`,
          transform: `translate(${x}%, ${y}%) scale(${scale})`,
          filter: `saturate(1.05) contrast(1.06) ${blur ? `blur(${blur}px)` : ""} brightness(${1 - dark})`,
        }}
      />
    </AbsoluteFill>
  );
};

/** An AI-animated clip, slowed to fit its shot. */
export const Clip: React.FC<{ src: string; from: number; rate: number; dark?: number }> = ({ src, from, rate, dark = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Sequence from={Math.round(from * FPS)} layout="none">
      <OffthreadVideo
        src={staticFile(src)}
        muted
        playbackRate={rate}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.04)",
          filter: `saturate(1.05) contrast(1.06) brightness(${1 - dark})`,
        }}
      />
    </Sequence>
  </AbsoluteFill>
);

/** Film look: grain, vignette, gentle exposure flicker. */
export const FilmLook: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  const flicker = 0.03 * random(`fl${seed}`);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${flicker})` }} />
      <AbsoluteFill style={{ opacity: 0.14, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id={`g${seed}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              seed={seed % 50}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#g${seed})`} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BAR = 92;
export const Letterbox: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: BAR, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: BAR, background: "#000" }} />
  </AbsoluteFill>
);

/** Phrase captions shown in the bottom letterbox bar. */
export const Captions: React.FC<{ until: number }> = ({ until }) => {
  const t = useT();
  if (t > until) return null;
  // group words into phrases of max 7 words, breaking at punctuation
  const phrases = PHRASES;
  const ph = phrases.find((p) => t >= W(p[0]) - 0.1 && t <= WE(p[1]) + 0.2);
  if (!ph) return null;
  const words = WORDS.slice(ph[0], ph[1] + 1);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: BAR,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: 0.2,
        color: C.paper,
      }}
    >
      {words.map((w, i) => {
        const on = t >= w.start - 0.05;
        return (
          <span key={i} style={{ marginRight: 11, color: on ? C.paper : "rgba(244,239,230,0.38)" }}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const buildPhrases = () => {
  const out: [number, number][] = [];
  let s = 0;
  for (let i = 0; i < WORDS.length; i++) {
    const w = WORDS[i].text;
    const len = i - s + 1;
    const punct = /[.?!:;,]$/.test(w) || w.endsWith("...");
    const gap = i + 1 < WORDS.length ? WORDS[i + 1].start - WORDS[i].end : 1;
    if ((punct && len >= 3) || /[.?!]$/.test(w) || len >= 7 || gap > 0.45) {
      out.push([s, i]);
      s = i + 1;
    }
  }
  if (s < WORDS.length) out.push([s, WORDS.length - 1]);
  return out;
};
export const PHRASES = buildPhrases();

/** Small uppercase chapter stamp, top-left inside the frame. */
export const Stamp: React.FC<{ a: number; b: number; kicker?: string; text: string; color?: string }> = ({
  a,
  b,
  kicker,
  text,
  color = C.gold,
}) => {
  const t = useT();
  const o = win(t, a, b, 0.4, 0.5);
  const x = interpolate(prog(t, a, a + 0.6), [0, 1], [-40, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: BAR + 48,
        left: 80,
        opacity: o,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "stretch",
        gap: 18,
      }}
    >
      <div style={{ width: 8, background: color, borderRadius: 2 }} />
      <div>
        {kicker ? (
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: C.paper, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 110,
            lineHeight: 0.95,
            color: C.paper,
            textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

/** Frosted glass card. */
/** "film" = cinematic dark glass, "neon" = green glass panels of the neon style. */
export const ThemeCtx = React.createContext<"film" | "neon">("film");

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => {
  const neon = React.useContext(ThemeCtx) === "neon";
  return (
  <div
    style={{
      background: neon ? "linear-gradient(160deg, rgba(34,74,58,0.78), rgba(14,34,27,0.82))" : "rgba(12,14,18,0.72)",
      border: neon ? "1.5px solid rgba(110,231,183,0.45)" : "1px solid rgba(255,255,255,0.12)",
      borderRadius: neon ? 28 : 22,
      boxShadow: neon ? "0 0 40px rgba(61,220,151,0.18), 0 30px 80px rgba(0,0,0,0.5)" : "0 30px 80px rgba(0,0,0,0.5)",
      backdropFilter: "blur(14px)",
      color: C.paper,
      fontFamily: BODY,
      ...style,
    }}
  >
    {children}
  </div>
  );
};

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
