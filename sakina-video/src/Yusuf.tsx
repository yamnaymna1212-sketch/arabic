import React from "react";
import { C } from "./theme";

/**
 * Yusuf: the channel's one recurring character.
 * Young Arab man, short trimmed beard, olive jacket over a sand shirt.
 * Local coordinates: feet at (0,0), head top near y=-690.
 */
export type YusufPose = {
  /** right arm (viewer's right) rotation in degrees, 0 = hanging */
  rightArm?: number;
  /** left arm rotation in degrees, 0 = hanging */
  leftArm?: number;
  /** 0 = eyes open, 1 = closed */
  blink?: number;
  /** 0 = calm, 1 = smiling */
  smile?: number;
  /** head tilt in degrees */
  headTilt?: number;
  /** look direction offset for pupils in px */
  look?: number;
};

const Arm: React.FC<{ side: 1 | -1; angle: number }> = ({ side, angle }) => {
  const sx = 92 * side;
  return (
    <g transform={`rotate(${angle} ${sx} -500)`}>
      <path
        d={`M ${sx - 26} -505 Q ${sx + 6 * side} -520 ${sx + 26} -500 L ${sx + 22 * side + (side === 1 ? 0 : 0)} -300 L ${sx - 20} -300 Z`}
        fill={side === 1 ? C.jacket : C.jacketShade}
      />
      <rect x={sx - 21} y={-312} width={42} height={22} rx={6} fill={C.jacketShade} />
      <ellipse cx={sx} cy={-276} rx={20} ry={24} fill={C.skin} />
    </g>
  );
};

export const Yusuf: React.FC<YusufPose> = ({
  rightArm = 0,
  leftArm = 0,
  blink = 0,
  smile = 0,
  headTilt = 0,
  look = 0,
}) => {
  const eyeRy = 7 * (1 - blink) + 0.8;
  const mouthCurve = 6 + smile * 12;
  return (
    <g>
      {/* ground shadow */}
      <ellipse cx={0} cy={4} rx={120} ry={14} fill="#000" opacity={0.35} />
      {/* legs */}
      <path d="M -62 -300 L -58 -14 L -12 -14 L -6 -300 Z" fill={C.trousers} />
      <path d="M 6 -300 L 12 -14 L 58 -14 L 62 -300 Z" fill={C.trousers} />
      <path d="M -66 -18 Q -40 -34 -6 -18 L -6 0 L -72 0 Z" fill="#17191B" />
      <path d="M 6 -18 Q 40 -34 66 -18 L 72 0 L 6 0 Z" fill="#17191B" />
      {/* left arm behind body when hanging */}
      <Arm side={-1} angle={leftArm} />
      {/* torso: shirt then jacket panels */}
      <path d="M -82 -510 Q 0 -540 82 -510 L 76 -292 L -76 -292 Z" fill={C.shirt} />
      <path d="M -96 -505 Q -60 -528 -18 -532 L -6 -292 L -84 -292 Q -96 -400 -96 -505 Z" fill={C.jacket} />
      <path d="M 96 -505 Q 60 -528 18 -532 L 6 -292 L 84 -292 Q 96 -400 96 -505 Z" fill={C.jacket} />
      <path d="M -18 -532 L -40 -470 L -10 -452 Z" fill={C.jacketShade} />
      <path d="M 18 -532 L 40 -470 L 10 -452 Z" fill={C.jacketShade} />
      <rect x={-70} y={-400} width={38} height={6} rx={3} fill={C.jacketShade} />
      <rect x={32} y={-400} width={38} height={6} rx={3} fill={C.jacketShade} />
      {/* right arm in front */}
      <Arm side={1} angle={rightArm} />
      {/* neck */}
      <rect x={-20} y={-560} width={40} height={36} fill={C.skinShade} />
      {/* head */}
      <g transform={`rotate(${headTilt} 0 -560)`}>
        <ellipse cx={-62} cy={-615} rx={11} ry={17} fill={C.skinShade} />
        <ellipse cx={62} cy={-615} rx={11} ry={17} fill={C.skinShade} />
        <ellipse cx={0} cy={-618} rx={62} ry={74} fill={C.skin} />
        {/* hair */}
        <path
          d="M -64 -628 Q -70 -700 -10 -704 Q 40 -712 62 -680 Q 72 -660 64 -626 Q 58 -664 30 -668 Q -10 -660 -40 -672 Q -58 -660 -64 -628 Z"
          fill={C.hair}
        />
        {/* short trimmed beard */}
        <path
          d="M -60 -612 Q -60 -560 -30 -548 Q 0 -538 30 -548 Q 60 -560 60 -612 Q 54 -580 40 -578 Q 20 -592 0 -588 Q -20 -592 -40 -578 Q -54 -580 -60 -612 Z"
          fill={C.hair}
          opacity={0.92}
        />
        {/* mustache */}
        <path d="M -22 -596 Q 0 -606 22 -596 Q 0 -592 -22 -596 Z" fill={C.hair} />
        {/* mouth */}
        <path
          d={`M -14 -584 Q 0 ${-584 + mouthCurve} 14 -584`}
          stroke="#5A2E22"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
        {/* brows */}
        <path d="M -40 -646 Q -26 -654 -12 -646" stroke={C.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M 12 -646 Q 26 -654 40 -646" stroke={C.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
        {/* eyes */}
        <ellipse cx={-26 + look} cy={-628} rx={6} ry={eyeRy} fill="#1B1512" />
        <ellipse cx={26 + look} cy={-628} rx={6} ry={eyeRy} fill="#1B1512" />
        {/* nose */}
        <path d="M 0 -628 Q 6 -610 -2 -606" stroke={C.skinShade} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};
