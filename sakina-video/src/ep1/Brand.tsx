import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BookOpen, Coins, ScrollText, Sparkles } from "lucide-react";
import { C, KUFI, PLEX } from "../theme";
import { Person, YUSUF } from "./Person";
import { makeStalk, WheatHead } from "../Wheat";

/** Eight-point star (rub el hizb style) path centred at 0,0. */
const star = (r: number) => {
  const sq = (rot: number) => {
    const pts = [0, 1, 2, 3].map((i) => {
      const a = ((i * 90 + rot + 45) * Math.PI) / 180;
      return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
    });
    return `M ${pts.join(" L ")} Z`;
  };
  return [sq(0), sq(45)];
};

export const Mark: React.FC<{ size: number; withRing?: boolean }> = ({ size, withRing = true }) => {
  const [s1, s2] = star(300);
  return (
    <svg width={size} height={size} viewBox="-400 -400 800 800">
      <defs>
        <radialGradient id="markBg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#1C4650" />
          <stop offset="100%" stopColor="#0A1A20" />
        </radialGradient>
        <linearGradient id="goldG" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#F3D58F" />
          <stop offset="55%" stopColor="#D9B25F" />
          <stop offset="100%" stopColor="#A87B30" />
        </linearGradient>
      </defs>
      <circle r={400} fill="url(#markBg)" />
      {withRing ? <circle r={372} fill="none" stroke="url(#goldG)" strokeWidth={10} opacity={0.9} /> : null}
      <path d={s1} fill="none" stroke="url(#goldG)" strokeWidth={9} opacity={0.55} />
      <path d={s2} fill="none" stroke="url(#goldG)" strokeWidth={9} opacity={0.55} />
      {/* crescent */}
      <path d="M 60 -175 A 175 175 0 1 0 175 110 A 145 145 0 1 1 60 -175 Z" fill="url(#goldG)" transform="translate(-10 20)" />
      {/* wheat ear inside the crescent: the channel's first parable */}
      <g transform="translate(55 95) rotate(18) scale(1.15)">
        <line x1={0} y1={40} x2={0} y2={-10} stroke="url(#goldG)" strokeWidth={6} strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <ellipse cx={-11} cy={-20 - i * 22} rx={9} ry={15} transform={`rotate(-28 -11 ${-20 - i * 22})`} fill="url(#goldG)" />
            <ellipse cx={11} cy={-20 - i * 22} rx={9} ry={15} transform={`rotate(28 11 ${-20 - i * 22})`} fill="url(#goldG)" />
          </g>
        ))}
        <ellipse cx={0} cy={-135} rx={8} ry={14} fill="url(#goldG)" />
      </g>
    </svg>
  );
};

export const Logo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A1A20", alignItems: "center", justifyContent: "center" }}>
    <Mark size={800} />
  </AbsoluteFill>
);

export const LogoWithName: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.night, alignItems: "center", justifyContent: "center", gap: 10, direction: "rtl" }}>
    <Mark size={520} />
    <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 170, color: C.gold, lineHeight: 1 }}>سَكينة</div>
    <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 52, color: C.sand }}>قصصٌ تُقرّبك من الله</div>
  </AbsoluteFill>
);

// Banner 2560x1440. Safe area for all devices: 1546x423 centred (x 507-2053, y 508-931).
export const Banner: React.FC = () => {
  const stalks = Array.from({ length: 7 }, (_, i) => makeStalk(0, 0, -30 + i * 10, 470 - Math.abs(i - 3) * 26));
  return (
    <AbsoluteFill style={{ backgroundColor: C.night, overflow: "hidden" }}>
      <Img src={staticFile("bg/roof.jpg")} style={{ position: "absolute", width: 2560, height: 1440, objectFit: "cover", filter: "brightness(0.55) saturate(0.9)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(42% 40% at 50% 50%, rgba(11,28,34,0.92) 0%, rgba(11,28,34,0.75) 55%, rgba(11,28,34,0.25) 100%)" }} />
      <svg width={2560} height={1440} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="grainGlow">
            <stop offset="0%" stopColor={C.gold} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="bGlow">
            <stop offset="0%" stopColor="#FFE3A0" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#FFE3A0" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* golden wheat at the right edge (outside the safe area, decorative) */}
        <g transform="translate(2290 1180) scale(1.2)">
          <circle r={300} fill="url(#bGlow)" />
          {stalks.map((st, i) => (
            <g key={i}>
              <path d={`M ${st.bx} ${st.by} Q ${st.cx} ${st.cy} ${st.tx} ${st.ty}`} stroke={C.gold} strokeWidth={4} fill="none" />
              <g transform={`translate(${st.tx} ${st.ty}) rotate(${st.angle}) scale(1.2)`}>
                <WheatHead grow={1} shown={100} glow={0.4} />
              </g>
            </g>
          ))}
        </g>
        {/* Yusuf reading, left edge */}
        <circle cx={300} cy={1050} r={320} fill="url(#bGlow)" />
        <Person look={YUSUF} x={300} y={1400} scale={0.95} pose={{ facing: "front", seated: true, holdBook: 1, headTilt: 7, smile: 0.5 }} />
      </svg>
      {/* safe-area content */}
      <div
        style={{
          position: "absolute",
          left: 507,
          top: 508,
          width: 1546,
          height: 423,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          direction: "rtl",
        }}
      >
        <Mark size={330} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 190, color: C.gold, lineHeight: 1, textShadow: "0 0 50px rgba(217,178,95,0.4)" }}>سَكينة</div>
          <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 62, color: C.sand }}>قصصٌ تُقرّبك من الله</div>
          <div style={{ display: "flex", gap: 34, marginTop: 14, fontFamily: PLEX, fontWeight: 500, fontSize: 40, color: C.sand }}>
            {[
              [BookOpen, "تفسير"],
              [ScrollText, "أحاديث"],
              [Coins, "أرزاق"],
              [Sparkles, "استغفار"],
            ].map(([Icon, label], i) => {
              const I = Icon as typeof BookOpen;
              return (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <I size={44} color={C.gold} strokeWidth={1.8} />
                  {label as string}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
