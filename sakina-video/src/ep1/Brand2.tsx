import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { AMIRI, C, KUFI, PLEX } from "../theme";
import { Person, YUSUF } from "./Person";

// Heart centred on (0,0), about 520 wide x 470 tall.
const HEART =
  "M 0 225 C -70 170 -265 45 -265 -75 C -265 -175 -180 -240 -100 -240 C -50 -240 -18 -212 0 -180 C 18 -212 50 -240 100 -240 C 180 -240 265 -175 265 -75 C 265 45 70 170 0 225 Z";

const Gold = () => (
  <linearGradient id="hGold" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0%" stopColor="#F6DDA0" />
    <stop offset="50%" stopColor="#D9B25F" />
    <stop offset="100%" stopColor="#A9792C" />
  </linearGradient>
);

/** Heart at peace: gold heart outline holding a crescent over calm water. */
export const HeartMark: React.FC<{ size: number; bg?: boolean }> = ({ size, bg = true }) => (
  <svg width={size} height={size} viewBox="-400 -400 800 800">
    <defs>
      <Gold />
      <radialGradient id="hBg" cx="50%" cy="38%" r="70%">
        <stop offset="0%" stopColor="#1D4A52" />
        <stop offset="100%" stopColor="#0A1A20" />
      </radialGradient>
      <clipPath id="hClip">
        <path d={HEART} transform="translate(0 10) scale(0.92)" />
      </clipPath>
      <radialGradient id="moonGlow">
        <stop offset="0%" stopColor="#FFE3A0" stopOpacity={0.45} />
        <stop offset="100%" stopColor="#FFE3A0" stopOpacity={0} />
      </radialGradient>
    </defs>
    {bg ? <circle r={400} fill="url(#hBg)" /> : null}
    <g transform="translate(0 10)">
      <g clipPath="url(#hClip)">
        <circle cx={0} cy={-55} r={170} fill="url(#moonGlow)" />
        {/* crescent */}
        <path d="M 22 -150 A 92 92 0 1 0 92 -18 A 74 74 0 1 1 22 -150 Z" fill="url(#hGold)" transform="translate(-40 0)" />
        {/* calm water */}
        {[70, 118, 166].map((y, i) => (
          <path
            key={y}
            d={`M -300 ${y} C -230 ${y - 22} -160 ${y - 22} -90 ${y} S 50 ${y + 22} 120 ${y} S 250 ${y - 22} 320 ${y}`}
            stroke="url(#hGold)"
            strokeWidth={16 - i * 3}
            fill="none"
            strokeLinecap="round"
            opacity={1 - i * 0.25}
          />
        ))}
      </g>
      <path d={HEART} fill="none" stroke="url(#hGold)" strokeWidth={26} strokeLinejoin="round" />
    </g>
  </svg>
);

export const Logo2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A1A20" }}>
    <HeartMark size={800} />
  </AbsoluteFill>
);

export const Logo2WithName: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.night, alignItems: "center", justifyContent: "center", gap: 6, direction: "rtl" }}>
    <HeartMark size={540} bg={false} />
    <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 170, color: C.gold, lineHeight: 1 }}>سَكينة</div>
    <div style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 56, color: C.sand, marginTop: 10 }}>أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</div>
  </AbsoluteFill>
);

/**
 * YouTube banner 2560x1440.
 * Visible on desktop: full width, y 508-931 (2560x423).
 * Visible on every device: x 507-2053, y 508-931 (1546x423).
 * Everything that matters sits inside y 508-931.
 */
const BAND_TOP = 508;
const BAND_H = 423;
export const Banner2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.night, overflow: "hidden" }}>
    <Img src={staticFile("bg/roof.jpg")} style={{ position: "absolute", width: 2560, height: 1440, objectFit: "cover", objectPosition: "50% 40%", filter: "brightness(0.5) saturate(0.9)" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,26,32,0.55) 0%, rgba(10,26,32,0.88) 22%, rgba(10,26,32,0.92) 50%, rgba(10,26,32,0.88) 78%, rgba(10,26,32,0.55) 100%)" }} />
    {/* thin gold rules framing the visible band */}
    <div style={{ position: "absolute", left: 0, right: 0, top: BAND_TOP + 18, height: 2, background: "linear-gradient(90deg, rgba(217,178,95,0) 0%, rgba(217,178,95,0.6) 30%, rgba(217,178,95,0.6) 70%, rgba(217,178,95,0) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: BAND_TOP + BAND_H - 20, height: 2, background: "linear-gradient(90deg, rgba(217,178,95,0) 0%, rgba(217,178,95,0.6) 30%, rgba(217,178,95,0.6) 70%, rgba(217,178,95,0) 100%)" }} />
    {/* desktop-only side art, inside the band height */}
    <svg width={2560} height={1440} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="sideGlow">
          <stop offset="0%" stopColor="#FFE3A0" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#FFE3A0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={270} cy={760} r={230} fill="url(#sideGlow)" />
      <Person look={YUSUF} x={270} y={BAND_TOP + BAND_H - 24} scale={0.52} pose={{ facing: "front", seated: true, holdBook: 1, headTilt: 7, smile: 0.5 }} />
      {/* lantern on the right */}
      <g transform={`translate(2290 ${BAND_TOP + 60})`}>
        <circle cx={0} cy={150} r={200} fill="url(#sideGlow)" />
        <line x1={0} y1={-60} x2={0} y2={30} stroke={C.gold} strokeWidth={4} />
        <path d="M -40 30 L 40 30 L 54 60 L -54 60 Z" fill={C.gold} />
        <path d="M -54 60 C -70 130 -70 210 -54 260 L 54 260 C 70 210 70 130 54 60 Z" fill="rgba(255,227,160,0.25)" stroke={C.gold} strokeWidth={5} />
        <path d="M 0 120 C -18 150 -18 185 0 210 C 18 185 18 150 0 120 Z" fill="#FFE3A0" />
        <path d="M -60 260 L 60 260 L 46 300 L -46 300 Z" fill={C.gold} />
      </g>
    </svg>
    {/* central safe area */}
    <div
      style={{
        position: "absolute",
        left: 507,
        top: BAND_TOP,
        width: 1546,
        height: BAND_H,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        direction: "rtl",
      }}
    >
      <HeartMark size={330} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 176, color: C.gold, lineHeight: 1, textShadow: "0 0 50px rgba(217,178,95,0.35)" }}>سَكينة</div>
        <div style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 64, color: C.sand, lineHeight: 1.5 }}>﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾</div>
        <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 40, color: C.gold }}>قصص · تفسير · أحاديث · أرزاق</div>
      </div>
    </div>
  </AbsoluteFill>
);
