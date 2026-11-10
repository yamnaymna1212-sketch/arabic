import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BODY, C, DISPLAY } from "./lib";
import { LogoMark } from "./overlays";

const Base: React.FC<{ src: string; pos?: string; children: React.ReactNode }> = ({ src, pos = "center", children }) => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "contrast(1.12) saturate(1.15)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)" }} />
    {children}
    <div style={{ position: "absolute", right: 22, bottom: 18, display: "flex", alignItems: "center", gap: 8, fontFamily: DISPLAY, fontSize: 30, color: C.paper, opacity: 0.9 }}>
      <LogoMark size={30} /> THE MONEY TRAIL
    </div>
  </AbsoluteFill>
);

const outline = "0 0 0 #000, 4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 10px 30px rgba(0,0,0,0.8)";

export const ThumbA: React.FC = () => (
  <Base src="scenes/s13.png" pos="30% 50%">
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.75) 70%)" }} />
    <div style={{ position: "absolute", right: 40, top: 70, width: 620, textAlign: "right" }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 150, lineHeight: 0.88, color: C.paper, textShadow: outline }}>
        GONE AT <span style={{ color: "#ff4d4d" }}>3 AM</span>
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 26,
          background: C.gold,
          color: C.ink,
          fontFamily: DISPLAY,
          fontSize: 78,
          padding: "4px 22px",
          transform: "rotate(-3deg)",
        }}
      >
        STILL OWES $9,500
      </div>
    </div>
  </Base>
);

export const ThumbB: React.FC = () => (
  <Base src="scenes/s02.png" pos="60% 50%">
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 45%)" }} />
    <div style={{ position: "absolute", left: 40, top: 30, width: 1200 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 132, lineHeight: 0.9, color: C.paper, textShadow: outline }}>
        STOP PAYING YOUR <span style={{ color: C.gold }}>CAR LOAN?</span>
      </div>
      <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 40, color: C.paper, textShadow: outline, marginTop: 10 }}>
        Here's what happens next…
      </div>
    </div>
  </Base>
);
