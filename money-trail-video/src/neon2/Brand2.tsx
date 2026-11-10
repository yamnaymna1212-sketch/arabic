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

export const NeonLogo: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #0f3a2b, #04100b 70%)", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "absolute", inset: 60, borderRadius: "50%", border: `6px solid ${N.mint}55`, boxShadow: `0 0 80px ${N.mint}44 inset` }} />
    <div style={{ marginTop: -60 }}>
      <Mark size={430} />
    </div>
    <div style={{ position: "absolute", bottom: 150, fontFamily: DISPLAY, fontSize: 92, letterSpacing: 6, color: N.white, textShadow: `0 0 24px ${N.mint}` }}>
      MONEY TRAIL
    </div>
  </AbsoluteFill>
);

// YouTube banner 2560x1440; keep text inside the centre 1546x423 safe area.
export const NeonBanner: React.FC = () => (
  <AbsoluteFill>
    <World mood={0} />
    <Actor x={300} y={1180} s={2.0} arms={POSES.wave} face="happy" props={["cap", "badge"]} seed="bn" />
    <Pickup x={2050} y={1180} w={760} />
    <div style={{ position: "absolute", left: 507, top: 509, width: 1546, height: 423, display: "flex", alignItems: "center", justifyContent: "center", gap: 50 }}>
      <Mark size={300} />
      <div>
        <div style={{ fontFamily: DISPLAY, fontSize: 190, color: N.white, letterSpacing: 6, lineHeight: 0.9, textShadow: `0 0 30px ${N.mint}88` }}>THE MONEY TRAIL</div>
        <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 40, color: N.gold, letterSpacing: 3, marginTop: 12, whiteSpace: "nowrap" }}>WHAT HAPPENS IF… · FOLLOW THE MONEY</div>
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
