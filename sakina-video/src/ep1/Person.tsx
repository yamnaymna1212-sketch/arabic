import React from "react";

/**
 * Reusable flat-vector person for the Sakina channel.
 * Local coords: feet at (0,0), standing height ~690 units.
 */
export type Look = {
  skin: string;
  skinShade: string;
  hair: string;
  top: string; // jacket / vest / shirt outer
  topShade: string;
  inner: string; // shirt under the jacket
  trousers: string;
  shoes: string;
  beard: "short" | "grey" | "none";
  cap?: boolean; // white taqiyah
};

export const YUSUF: Look = {
  skin: "#C99A76",
  skinShade: "#B5845F",
  hair: "#1E1A17",
  top: "#4E5B3A",
  topShade: "#3E4A2E",
  inner: "#EFE4CF",
  trousers: "#262B2F",
  shoes: "#17191B",
  beard: "short",
};

export const SALIM: Look = {
  skin: "#B98C6A",
  skinShade: "#A27556",
  hair: "#D9D4CB",
  top: "#6B4A33",
  topShade: "#573B28",
  inner: "#F2EEE6",
  trousers: "#F2EEE6",
  shoes: "#3A2A20",
  beard: "grey",
  cap: true,
};

export const CHILD: Look = {
  skin: "#D2A47F",
  skinShade: "#BC8E69",
  hair: "#2A1F18",
  top: "#3F6E86",
  topShade: "#335A6E",
  inner: "#3F6E86",
  trousers: "#5A4A3A",
  shoes: "#2A221C",
  beard: "none",
};

export type Pose = {
  facing?: "front" | "right" | "left";
  /** walk cycle phase in radians; amplitude 0 = standing */
  walk?: number;
  walkAmp?: number;
  rightArm?: number; // front view: viewer's right arm, degrees (negative = raise outward)
  leftArm?: number;
  blink?: number;
  smile?: number; // -1 sad .. 1 big smile
  headTilt?: number;
  headTurn?: number; // pupils offset
  seated?: boolean;
  holdBook?: number; // 0..1 open mushaf in hands (front view)
  mouth?: number; // 0..1 talking
};

const Head: React.FC<{ L: Look; p: Pose; side: boolean }> = ({ L, p, side }) => {
  const eyeRy = 7 * (1 - (p.blink ?? 0)) + 0.8;
  const smile = p.smile ?? 0;
  const look = p.headTurn ?? 0;
  const mouthY = -584;
  const curve = 4 + smile * 10;
  const open = (p.mouth ?? 0) * 7;
  if (side) {
    // profile facing +x
    return (
      <g transform={`rotate(${p.headTilt ?? 0} 0 -560)`}>
        <ellipse cx={-6} cy={-616} rx={12} ry={17} fill={L.skinShade} />
        <path d="M -52 -620 Q -54 -690 4 -694 Q 56 -694 60 -630 L 66 -606 L 58 -598 Q 60 -566 30 -550 Q -10 -540 -40 -570 Q -54 -590 -52 -620 Z" fill={L.skin} />
        {L.cap ? (
          <path d="M -54 -640 Q -50 -700 6 -702 Q 58 -700 60 -646 Z" fill="#F4F1EA" />
        ) : (
          <path d="M -56 -612 Q -62 -704 6 -706 Q 54 -706 62 -664 Q 30 -676 6 -668 Q -16 -660 -24 -640 Q -34 -632 -36 -612 Z" fill={L.hair} />
        )}
        {L.beard !== "none" ? (
          <path
            d={L.beard === "grey" ? "M -30 -600 Q -30 -520 22 -522 Q 60 -540 60 -598 Q 44 -580 20 -584 Q -4 -588 -30 -600 Z" : "M -30 -604 Q -26 -552 18 -548 Q 52 -556 58 -598 Q 44 -584 24 -588 Q 0 -592 -30 -604 Z"}
            fill={L.beard === "grey" ? "#E3DED5" : L.hair}
          />
        ) : null}
        <path d={`M 40 ${mouthY + 4} Q 50 ${mouthY + 4 + curve * 0.5 + open} 58 ${mouthY + 2}`} stroke="#5A2E22" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M 24 -650 Q 38 -656 50 -648" stroke={L.beard === "grey" ? "#CFC9BF" : L.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
        <ellipse cx={40 + look * 0.4} cy={-630} rx={5.5} ry={eyeRy} fill="#1B1512" />
      </g>
    );
  }
  return (
    <g transform={`rotate(${p.headTilt ?? 0} 0 -560)`}>
      <ellipse cx={-62} cy={-615} rx={11} ry={17} fill={L.skinShade} />
      <ellipse cx={62} cy={-615} rx={11} ry={17} fill={L.skinShade} />
      <ellipse cx={0} cy={-618} rx={62} ry={74} fill={L.skin} />
      {L.cap ? (
        <path d="M -62 -642 Q -60 -704 0 -706 Q 60 -704 62 -642 Q 0 -656 -62 -642 Z" fill="#F4F1EA" />
      ) : (
        <path d="M -64 -628 Q -70 -700 -10 -704 Q 40 -712 62 -680 Q 72 -660 64 -626 Q 58 -664 30 -668 Q -10 -660 -40 -672 Q -58 -660 -64 -628 Z" fill={L.hair} />
      )}
      {L.beard === "short" ? (
        <>
          <path d="M -60 -612 Q -60 -560 -30 -548 Q 0 -538 30 -548 Q 60 -560 60 -612 Q 54 -580 40 -578 Q 20 -592 0 -588 Q -20 -592 -40 -578 Q -54 -580 -60 -612 Z" fill={L.hair} opacity={0.92} />
          <path d="M -22 -596 Q 0 -606 22 -596 Q 0 -592 -22 -596 Z" fill={L.hair} />
        </>
      ) : null}
      {L.beard === "grey" ? (
        <>
          <path d="M -60 -612 Q -62 -520 0 -500 Q 62 -520 60 -612 Q 52 -580 36 -582 Q 18 -594 0 -590 Q -18 -594 -36 -582 Q -52 -580 -60 -612 Z" fill="#E3DED5" />
          <path d="M -24 -596 Q 0 -608 24 -596 Q 0 -590 -24 -596 Z" fill="#D2CCC2" />
        </>
      ) : null}
      {open > 0.5 ? (
        <ellipse cx={0} cy={mouthY + 2} rx={10} ry={open} fill="#5A2E22" />
      ) : (
        <path d={`M -14 ${mouthY} Q 0 ${mouthY + curve} 14 ${mouthY}`} stroke="#5A2E22" strokeWidth={4} fill="none" strokeLinecap="round" />
      )}
      <path d={`M -40 ${-646 - smile * 2} Q -26 ${-654 + (smile < 0 ? 6 : 0)} -12 -646`} stroke={L.beard === "grey" ? "#CFC9BF" : L.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M 12 -646 Q 26 ${-654 + (smile < 0 ? 6 : 0)} 40 ${-646 - smile * 2}`} stroke={L.beard === "grey" ? "#CFC9BF" : L.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={-26 + look} cy={-628} rx={6} ry={eyeRy} fill="#1B1512" />
      <ellipse cx={26 + look} cy={-628} rx={6} ry={eyeRy} fill="#1B1512" />
      <path d="M 0 -628 Q 6 -610 -2 -606" stroke={L.skinShade} strokeWidth={4} fill="none" strokeLinecap="round" />
      {smile > 0.4 ? (
        <>
          <ellipse cx={-38} cy={-602} rx={9} ry={5} fill="#D9826A" opacity={0.35} />
          <ellipse cx={38} cy={-602} rx={9} ry={5} fill="#D9826A" opacity={0.35} />
        </>
      ) : null}
    </g>
  );
};

const FrontArm: React.FC<{ L: Look; side: 1 | -1; angle: number }> = ({ L, side, angle }) => {
  const sx = 92 * side;
  return (
    <g transform={`rotate(${angle} ${sx} -500)`}>
      <path d={`M ${sx - 26} -505 Q ${sx} -522 ${sx + 26} -500 L ${sx + 22} -300 L ${sx - 20} -300 Z`} fill={side === 1 ? L.top : L.topShade} />
      <rect x={sx - 21} y={-312} width={42} height={22} rx={6} fill={L.topShade} />
      <ellipse cx={sx} cy={-276} rx={20} ry={24} fill={L.skin} />
    </g>
  );
};

const Front: React.FC<{ L: Look; p: Pose }> = ({ L, p }) => {
  const seated = !!p.seated;
  const book = p.holdBook ?? 0;
  const rA = book > 0 ? -18 - book * 22 : p.rightArm ?? 0;
  const lA = book > 0 ? 18 + book * 22 : p.leftArm ?? 0;
  return (
    <g>
      <ellipse cx={0} cy={4} rx={seated ? 170 : 120} ry={14} fill="#000" opacity={0.3} />
      {seated ? (
        <g>
          <path d="M -150 -10 Q -150 -90 -60 -96 L 60 -96 Q 150 -90 150 -10 Q 150 6 120 6 L -120 6 Q -150 6 -150 -10 Z" fill={L.trousers} />
          <ellipse cx={-110} cy={-6} rx={36} ry={14} fill={L.shoes} />
          <ellipse cx={110} cy={-6} rx={36} ry={14} fill={L.shoes} />
        </g>
      ) : (
        <g>
          <path d="M -62 -300 L -58 -14 L -12 -14 L -6 -300 Z" fill={L.trousers} />
          <path d="M 6 -300 L 12 -14 L 58 -14 L 62 -300 Z" fill={L.trousers} />
          <path d="M -66 -18 Q -40 -34 -6 -18 L -6 0 L -72 0 Z" fill={L.shoes} />
          <path d="M 6 -18 Q 40 -34 66 -18 L 72 0 L 6 0 Z" fill={L.shoes} />
        </g>
      )}
      <g transform={seated ? "translate(0 210)" : undefined}>
        <FrontArm L={L} side={-1} angle={lA} />
        <path d="M -82 -510 Q 0 -540 82 -510 L 76 -292 L -76 -292 Z" fill={L.inner} />
        <path d="M -96 -505 Q -60 -528 -18 -532 L -6 -292 L -84 -292 Q -96 -400 -96 -505 Z" fill={L.top} />
        <path d="M 96 -505 Q 60 -528 18 -532 L 6 -292 L 84 -292 Q 96 -400 96 -505 Z" fill={L.top} />
        <path d="M -18 -532 L -40 -470 L -10 -452 Z" fill={L.topShade} />
        <path d="M 18 -532 L 40 -470 L 10 -452 Z" fill={L.topShade} />
        <FrontArm L={L} side={1} angle={rA} />
        {book > 0 ? (
          <g transform={`translate(0 -330) scale(${0.6 + 0.4 * book})`}>
            <path d="M -110 -10 L 0 6 L 110 -10 L 110 70 L 0 86 L -110 70 Z" fill="#1F4F43" />
            <path d="M -100 -14 Q -50 -26 0 0 L 0 76 Q -50 52 -100 62 Z" fill="#F4ECD8" />
            <path d="M 100 -14 Q 50 -26 0 0 L 0 76 Q 50 52 100 62 Z" fill="#FBF5E6" />
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <line x1={-86} y1={-2 + i * 13} x2={-14} y2={6 + i * 13} stroke="#8A7A5A" strokeWidth={2} opacity={0.6} />
                <line x1={14} y1={6 + i * 13} x2={86} y2={-2 + i * 13} stroke="#8A7A5A" strokeWidth={2} opacity={0.6} />
              </g>
            ))}
          </g>
        ) : null}
        <rect x={-20} y={-560} width={40} height={36} fill={L.skinShade} />
        <Head L={L} p={p} side={false} />
      </g>
    </g>
  );
};

const Side: React.FC<{ L: Look; p: Pose }> = ({ L, p }) => {
  const ph = p.walk ?? 0;
  const amp = p.walkAmp ?? 0;
  const swing = Math.sin(ph) * 28 * amp;
  const bob = -Math.abs(Math.cos(ph)) * 10 * amp;
  const leg = (angle: number, shade: boolean) => (
    <g transform={`rotate(${angle} 0 -300)`}>
      <path d="M -26 -300 L -22 -14 L 22 -14 L 26 -300 Z" fill={shade ? "#1C2024" : L.trousers} />
      <path d="M -24 -20 L 50 -20 Q 62 -8 50 0 L -24 0 Z" fill={L.shoes} />
    </g>
  );
  const arm = (angle: number, back: boolean) => (
    <g transform={`rotate(${angle} 4 -500)`}>
      <path d="M -20 -510 Q 4 -526 28 -508 L 22 -300 L -14 -300 Z" fill={back ? L.topShade : L.top} />
      <ellipse cx={4} cy={-278} rx={19} ry={23} fill={back ? L.skinShade : L.skin} />
    </g>
  );
  return (
    <g>
      <ellipse cx={0} cy={4} rx={90} ry={12} fill="#000" opacity={0.3} />
      <g transform={`translate(0 ${bob})`}>
        {leg(-swing, true)}
        {arm(swing * 0.9, true)}
        {leg(swing, false)}
        <path d="M -44 -520 Q 0 -540 50 -516 L 48 -292 L -42 -292 Z" fill={L.top} />
        <path d="M 30 -528 L 52 -520 L 48 -420 L 34 -420 Z" fill={L.inner} />
        <rect x={-14} y={-560} width={34} height={36} fill={L.skinShade} />
        <Head L={L} p={p} side />
        {arm(-swing * 0.9, false)}
      </g>
    </g>
  );
};

export const Person: React.FC<{ look: Look; pose?: Pose; x: number; y: number; scale?: number; opacity?: number }> = ({
  look,
  pose = {},
  x,
  y,
  scale = 1,
  opacity = 1,
}) => {
  const facing = pose.facing ?? "front";
  const flip = facing === "left" ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * flip} ${scale})`} opacity={opacity}>
      {facing === "front" ? <Front L={look} p={pose} /> : <Side L={look} p={pose} />}
    </g>
  );
};
