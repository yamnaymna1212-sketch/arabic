import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, KUFI, PLEX } from "../theme";
import { Person, YUSUF } from "./Person";
import { makeStalk, WheatHead } from "../Wheat";

// YouTube thumbnail, 1280x720. Variant A: "1 riyal = 700?" ; variant B: story hook.
const Stalks: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  const stalks = Array.from({ length: 7 }, (_, i) => makeStalk(0, 0, -30 + i * 10, 470 - Math.abs(i - 3) * 26));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={120} fill="url(#tGlow)" />
      {stalks.map((st, i) => (
        <g key={i}>
          <path d={`M ${st.bx} ${st.by} Q ${st.cx} ${st.cy} ${st.tx} ${st.ty}`} stroke={C.gold} strokeWidth={5} fill="none" strokeLinecap="round" />
          <g transform={`translate(${st.tx} ${st.ty}) rotate(${st.angle}) scale(1.25)`}>
            <WheatHead grow={1} shown={100} glow={0.6} />
          </g>
        </g>
      ))}
      <path d="M 0 -20 C 12 -12 13 8 0 18 C -13 8 -12 -12 0 -20 Z" fill="#FFE3A0" />
    </g>
  );
};

const Defs = () => (
  <defs>
    <radialGradient id="tGlow">
      <stop offset="0%" stopColor="#FFE3A0" stopOpacity={0.9} />
      <stop offset="100%" stopColor="#FFE3A0" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="grainGlow">
      <stop offset="0%" stopColor={C.gold} stopOpacity={0.55} />
      <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
    </radialGradient>
  </defs>
);

const Logo = () => (
  <div style={{ position: "absolute", top: 26, left: 30, display: "flex", alignItems: "center", gap: 10 }}>
    <svg width={46} height={46} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={46} fill="rgba(11,28,34,0.8)" stroke={C.gold} strokeWidth={5} />
      <path d="M58 26a20 20 0 1 0 14 32 17 17 0 0 1-14-32z" fill={C.gold} />
    </svg>
    <span style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 34, color: C.sand, textShadow: "0 2px 10px #000" }}>سَكينة</span>
  </div>
);

export const ThumbnailA: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.night, overflow: "hidden" }}>
    <Img src={staticFile("bg/shop.jpg")} style={{ position: "absolute", width: 1600, left: -160, top: -60, filter: "blur(6px) brightness(0.35) saturate(0.8)" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 90% at 30% 55%, rgba(217,178,95,0.28) 0%, rgba(11,28,34,0) 60%)" }} />
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <Stalks x={420} y={690} s={1.0} />
      <Person look={YUSUF} x={150} y={1060} scale={0.95} pose={{ facing: "front", smile: 1, headTilt: -6, rightArm: -40 }} />
    </svg>
    {/* riyal photo */}
    <div style={{ position: "absolute", left: 500, top: 440, width: 190, height: 190, rotate: "-8deg", borderRadius: 24, overflow: "hidden", border: `5px solid ${C.gold}`, boxShadow: "0 0 50px rgba(217,178,95,0.6), 0 20px 40px rgba(0,0,0,0.6)" }}>
      <Img src={staticFile("bg/riyal.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    {/* headline */}
    <div style={{ position: "absolute", right: 46, top: 120, width: 560, direction: "rtl", textAlign: "center" }}>
      <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 110, color: C.sand, lineHeight: 1.05, textShadow: "0 6px 0 #000, 0 10px 30px rgba(0,0,0,0.8)" }}>ريالٌ واحد</div>
      <div
        style={{
          direction: "rtl",
          whiteSpace: "nowrap",
          fontFamily: KUFI,
          fontWeight: 700,
          fontSize: 190,
          lineHeight: 1,
          color: C.gold,
          textShadow: "0 0 40px rgba(217,178,95,0.7), 0 8px 0 #3A2A10, 0 14px 30px rgba(0,0,0,0.8)",
          marginTop: 10,
        }}
      >
        = 700<span style={{ fontSize: 150 }}>؟</span>
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 22,
          fontFamily: PLEX,
          fontWeight: 700,
          fontSize: 40,
          color: C.night,
          background: C.gold,
          borderRadius: 12,
          padding: "4px 26px",
        }}
      >
        آية في سورة البقرة
      </div>
    </div>
    <Logo />
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 160px rgba(0,0,0,0.75)" }} />
  </AbsoluteFill>
);

export const ThumbnailB: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.night, overflow: "hidden" }}>
    <Img src={staticFile("bg/shop.jpg")} style={{ position: "absolute", width: 1700, left: -300, top: -170, filter: "brightness(0.55) saturate(0.9)" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(11,28,34,0.95) 0%, rgba(11,28,34,0.7) 38%, rgba(11,28,34,0) 65%)" }} />
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <circle cx={360} cy={420} r={260} fill="url(#tGlow)" opacity={0.55} />
      <Person look={YUSUF} x={250} y={1080} scale={1.0} pose={{ facing: "front", smile: 0.6, rightArm: -62 }} />
      <g transform="translate(560 470)">
        <circle r={70} fill="url(#tGlow)" />
        <ellipse rx={34} ry={34} fill="#C9C9C4" stroke="#8E8E88" strokeWidth={3} />
        <ellipse rx={22} ry={22} fill={C.gold} stroke="#B88B3A" strokeWidth={2} />
      </g>
    </svg>
    <div style={{ position: "absolute", right: 50, top: 110, width: 600, direction: "rtl", textAlign: "center" }}>
      <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 96, color: C.sand, lineHeight: 1.15, textShadow: "0 6px 0 #000, 0 10px 30px rgba(0,0,0,0.8)" }}>
        أعطى ريالاً…
      </div>
      <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 118, color: C.gold, lineHeight: 1.15, textShadow: "0 0 40px rgba(217,178,95,0.7), 0 8px 0 #3A2A10" }}>
        فضاعفه الله!
      </div>
      <div style={{ display: "inline-block", marginTop: 24, fontFamily: PLEX, fontWeight: 700, fontSize: 40, color: C.night, background: C.gold, borderRadius: 12, padding: "4px 26px" }}>
        قصة «مَثَلُ الحبّة»
      </div>
    </div>
    <Logo />
    <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 160px rgba(0,0,0,0.7)" }} />
  </AbsoluteFill>
);
