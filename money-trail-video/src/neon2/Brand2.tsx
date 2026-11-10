import React from "react";
import { AbsoluteFill } from "remotion";
import { BODY, DISPLAY } from "../lib";
import { World, glow } from "../neon/kit";
import { Actor, N, POSES, Pickup, RealCard, Tow } from "./engine";

const outline = "0 0 2px #000, 0 6px 0 #000, 0 0 30px rgba(0,0,0,0.9)";

/** Channel mark: a neon coin with a dotted trail, Tyler's cap on top. */
export const Mark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", filter: glow(N.mint, 1.4) }}>
    <circle cx={22} cy={168} r={9} fill={N.gold} opacity={0.4} />
    <circle cx={48} cy={146} r={10} fill={N.gold} opacity={0.6} />
    <circle cx={74} cy={124} r={11} fill={N.gold} opacity={0.85} />
    <circle cx={128} cy={82} r={56} fill={N.fill} stroke={N.mint} strokeWidth={7} />
    <circle cx={128} cy={82} r={44} fill="none" stroke={N.mint} strokeWidth={2} opacity={0.5} />
    <text x={128} y={106} textAnchor="middle" fontFamily={DISPLAY} fontSize={70} fill={N.gold}>
      $
    </text>
    <path d="M82 52 Q86 14 128 14 Q170 14 174 52 Z" fill={N.fill} stroke={N.mint} strokeWidth={6} strokeLinejoin="round" />
    <path d="M150 48 Q184 46 198 56" stroke={N.mint} strokeWidth={7} fill="none" strokeLinecap="round" />
  </svg>
);

/** Logo: Tyler's neon head (mascot) with a gold $ coin. Built to read at 98px. */
export const NeonLogo: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, #145a42 0%, #0a2a1f 55%, #04100b 100%)", alignItems: "center", justifyContent: "center" }}>
    <svg width={800} height={800} viewBox="0 0 800 800" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="g" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="coin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.55" stopColor="#f2b544" />
          <stop offset="1" stopColor="#c98a1c" />
        </linearGradient>
      </defs>
      <circle cx={400} cy={400} r={372} fill="none" stroke={N.mint} strokeWidth={10} opacity={0.35} />
      <g filter="url(#g)" stroke={N.mint} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="#062018">
        {/* head */}
        <circle cx={385} cy={430} r={215} />
        {/* cap */}
        <path d="M172 380 Q182 170 385 170 Q588 170 598 380 Z" />
        <path d="M500 362 Q640 352 700 392" fill="none" />
        <line x1={190} y1={375} x2={590} y2={375} strokeWidth={14} />
      </g>
      {/* eyes + smile */}
      <g fill={N.white}>
        <ellipse cx={315} cy={470} rx={30} ry={44} />
        <ellipse cx={455} cy={470} rx={30} ry={44} />
      </g>
      <path d="M318 560 Q385 615 452 560" fill="none" stroke={N.white} strokeWidth={20} strokeLinecap="round" />
      {/* gold coin badge */}
      <g filter="url(#g)">
        <circle cx={600} cy={590} r={118} fill="url(#coin)" stroke="#fff3c4" strokeWidth={10} />
      </g>
      <circle cx={600} cy={590} r={88} fill="none" stroke="#a8700f" strokeWidth={6} opacity={0.7} />
      <text x={600} y={642} textAnchor="middle" fontFamily={DISPLAY} fontSize={150} fill="#3a2400">
        $
      </text>
    </svg>
  </AbsoluteFill>
);

// YouTube banner 2560x1440. Desktop shows the middle strip (y 509–932), phones only
// the centre 1546x423, so everything that matters lives inside that strip.
export const NeonBanner: React.FC = () => (
  <AbsoluteFill style={{ background: N.bg }}>
    <World mood={0} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 509, height: 423, background: "linear-gradient(90deg, rgba(4,16,11,0) 0%, rgba(20,70,52,0.35) 50%, rgba(4,16,11,0) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 932, height: 3, background: `linear-gradient(90deg, transparent, ${N.mint}88, transparent)` }} />
    <Actor x={330} y={925} s={0.98} arms={POSES.wave} face="happy" props={["cap", "badge"]} seed="bn" />
    <Pickup x={2230} y={920} w={480} />
    <div style={{ position: "absolute", left: 507, top: 509, width: 1546, height: 423, display: "flex", alignItems: "center", justifyContent: "center", gap: 46 }}>
      <div style={{ width: 290, height: 290, borderRadius: 290, overflow: "hidden", boxShadow: `0 0 50px ${N.mint}66`, flexShrink: 0 }}>
        <div style={{ transform: "scale(0.3625)", transformOrigin: "0 0", width: 800, height: 800, position: "relative" }}>
          <NeonLogo />
        </div>
      </div>
      <div>
        <div style={{ fontFamily: DISPLAY, fontSize: 176, color: N.white, letterSpacing: 6, lineHeight: 0.9, textShadow: `0 0 30px ${N.mint}88`, whiteSpace: "nowrap" }}>THE MONEY TRAIL</div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 38, color: N.gold, letterSpacing: 3, marginTop: 14, whiteSpace: "nowrap" }}>WHAT HAPPENS IF… · FOLLOW THE MONEY</div>
      </div>
    </div>
  </AbsoluteFill>
);

/** Thumbnail A: "GONE AT 3 AM" – tow truck takes his truck, Tyler in shock. */
export const NeonThumbA: React.FC = () => (
  <AbsoluteFill>
    <World mood={2} night={0.6} />
    <div style={{ position: "absolute", inset: 0, transform: "scale(0.6667)", transformOrigin: "0 0", width: 1920, height: 1080 }}>
      <div style={{ position: "absolute", left: 600, top: 500, width: 1300, height: 600, background: `radial-gradient(ellipse, ${N.red}33, transparent 70%)` }} />
      <Pickup x={1000} y={1010} w={560} tilt={-6} />
      <Tow x={1520} y={1010} w={640} lift={1} />
      <div style={{ position: "absolute", left: 0, top: 300, width: 700, height: 800, background: `radial-gradient(ellipse, ${N.mint}33, transparent 70%)` }} />
      <Actor x={330} y={1060} s={1.75} arms={POSES.up} face="shock" props={["cap", "badge"]} seed="ta" />
      <div style={{ position: "absolute", left: 650, top: 40, fontFamily: DISPLAY, fontSize: 250, lineHeight: 0.85, color: N.white, textShadow: outline }}>
        GONE AT <span style={{ color: N.red, textShadow: `${outline}, 0 0 40px ${N.red}` }}>3 AM</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 300,
          background: N.gold,
          color: "#140c00",
          fontFamily: DISPLAY,
          fontSize: 110,
          padding: "0 30px",
          transform: "rotate(-3deg)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        }}
      >
        STILL OWES $9,500
      </div>
    </div>
  </AbsoluteFill>
);

/** Thumbnail B: realistic card struck through + "STOP PAYING?" */
export const NeonThumbB: React.FC = () => (
  <AbsoluteFill>
    <World mood={1.4} />
    <div style={{ position: "absolute", inset: 0, transform: "scale(0.6667)", transformOrigin: "0 0", width: 1920, height: 1080 }}>
      <RealCard x={1380} y={640} a={-5} b={999} w={820} strikeAt={-1} stamp="STOP" />
      <div style={{ position: "absolute", left: 0, top: 300, width: 700, height: 800, background: `radial-gradient(ellipse, ${N.mint}33, transparent 70%)` }} />
      <Actor x={330} y={1080} s={1.8} arms={POSES.facepalm} face="shock" props={["cap", "badge"]} seed="tb" />
      <div style={{ position: "absolute", left: 640, top: 30, fontFamily: DISPLAY, fontSize: 210, lineHeight: 0.85, color: N.white, textShadow: outline }}>
        STOP PAYING
        <br />
        YOUR <span style={{ color: N.gold }}>CAR LOAN?</span>
      </div>
    </div>
  </AbsoluteFill>
);
