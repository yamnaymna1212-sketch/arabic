import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BODY, C, DISPLAY } from "./lib";
import { LogoMark } from "./overlays";

export const Logo: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1b2230, #0b0d10 75%)", alignItems: "center", justifyContent: "center" }}>
    <LogoMark size={430} />
    <div style={{ fontFamily: DISPLAY, fontSize: 92, color: C.paper, letterSpacing: 6, marginTop: -10 }}>THE MONEY TRAIL</div>
  </AbsoluteFill>
);

// YouTube banner: keep key content inside the 1546x423 safe area at the center.
export const Banner: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Img src={staticFile("scenes/s27.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", filter: "brightness(0.5) saturate(1.1)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,13,16,0.92) 25%, rgba(11,13,16,0.2) 70%)" }} />
    <div style={{ position: "absolute", left: 507, top: 509, width: 1546, height: 423, display: "flex", alignItems: "center", gap: 40 }}>
      <LogoMark size={260} />
      <div>
        <div style={{ fontFamily: DISPLAY, fontSize: 170, color: C.paper, letterSpacing: 6, lineHeight: 0.9 }}>THE MONEY TRAIL</div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 40, color: C.gold, letterSpacing: 3, marginTop: 10, whiteSpace: "nowrap" }}>
          FOLLOW THE MONEY. ALL THE WAY TO THE END.
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
