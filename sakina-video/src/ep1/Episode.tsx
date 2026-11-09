import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { C, PLEX } from "../theme";
import { END, N, REC_START, useT, win } from "./kit";
import { City, Hook, Roof, Shop, Souq, WalkBack } from "./Story";
import { SeedWorld } from "./SeedWorld";
import { Challenge, Lessons, Outro, Recitation } from "./Ending";
import { PHRASES, WORDS } from "./words";

export const EP1_SECONDS = END;
const FPS = 30;

type Sfx = { at: number; src: string; vol: number };
const s = (at: number, src: string, vol = 0.5): Sfx => ({ at, src, vol });

const steps = (a: number, b: number, every: number, vol = 0.35): Sfx[] => {
  const out: Sfx[] = [];
  let i = 0;
  for (let t = a + 0.1; t < b; t += every) out.push(s(t, `sfx/footstep0${i++ % 4}.wav`, vol));
  return out;
};

const SFX: Sfx[] = [
  // hook
  s(N(1.55), "sfx/handleCoins.wav", 0.7),
  s(N(1.5), "sfx/rm-whoosh.wav", 0.35),
  s(N(4.3), "sfx/boom.mp3", 0.8),
  s(N(5.15), "sfx/pluck_001.wav", 0.4),
  s(N(7.75), "sfx/boom.mp3", 0.7),
  // city
  s(N(11.65), "sfx/rm-whoosh.wav", 0.4),
  ...steps(N(11.7), N(12.5), 0.35),
  s(N(12.05), "sfx/pluck_001.wav", 0.35),
  s(N(12.8), "sfx/pluck_001.wav", 0.35),
  // souq
  s(N(14.8), "sfx/rm-whip.wav", 0.35),
  ...steps(N(14.85), N(16.6), 0.35),
  s(N(16.5), "sfx/pluck_001.wav", 0.35),
  s(N(18.55), "sfx/chip-lay-1.wav", 0.6),
  s(N(18.73), "sfx/chip-lay-1.wav", 0.6),
  s(N(18.91), "sfx/chip-lay-1.wav", 0.6),
  s(N(19.85), "sfx/pluck_001.wav", 0.4),
  s(N(21.05), "sfx/pluck_001.wav", 0.4),
  s(N(22.4), "sfx/pluck_001.wav", 0.4),
  // shop
  s(N(24.85), "sfx/doorOpen_1.wav", 0.6),
  s(N(25.0), "sfx/rm-ding.wav", 0.25),
  ...steps(N(24.95), N(26.3), 0.35),
  s(N(26.6), "sfx/pluck_001.wav", 0.35),
  s(N(28.0), "sfx/rm-whoosh.wav", 0.2),
  ...[0, 1, 2, 3].map((i) => s(N(30.5) + i * 0.32, "sfx/chip-lay-1.wav", 0.55)),
  s(N(32.0), "sfx/drop_002.wav", 0.5),
  s(N(36.45), "sfx/impactSoft_medium_000.wav", 0.6),
  s(N(36.95), "sfx/impactSoft_medium_000.wav", 0.5),
  s(N(37.9), "sfx/rm-whoosh.wav", 0.25),
  s(N(43.1), "sfx/handleCoins2.wav", 0.75),
  s(N(43.25), "sfx/rm-ding.wav", 0.35),
  s(N(44.15), "sfx/confirmation_002.wav", 0.35),
  ...steps(N(45.15), N(46.35), 0.2, 0.3),
  // walk back
  s(N(46.5), "sfx/rm-whip.wav", 0.3),
  ...steps(N(46.55), N(51.7), 0.48, 0.3),
  s(N(48.0), "sfx/pluck_001.wav", 0.3),
  s(N(51.85), "sfx/growth.mp3", 0.5),
  // roof
  s(N(54.55), "sfx/boom.mp3", 0.45),
  s(N(55.6), "sfx/bookOpen.wav", 0.7),
  s(N(57.1), "sfx/bookFlip2.wav", 0.6),
  s(N(57.2), "sfx/growth.mp3", 0.35),
  // seed world
  s(N(62.2), "sfx/boom.mp3", 0.55),
  s(N(68.45), "sfx/handleCoins.wav", 0.6),
  s(N(69.6), "sfx/growth.mp3", 0.5),
  s(N(71.25), "sfx/impactSoft_medium_000.wav", 0.7),
  s(N(72.0), "sfx/growth.mp3", 0.6),
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => s(N(73.3) + [0.42, 0.28, 0.14, 0, 0.14, 0.28, 0.42][i] + 0.9 + i * 0.01, "sfx/pluck_001.wav", 0.3)),
  s(N(75.2), "sfx/rm-whoosh.wav", 0.5),
  ...Array.from({ length: 26 }, (_, i) => s(N(77.0) + i * 0.1, i % 2 ? "sfx/glass_001.wav" : "sfx/glass_002.wav", 0.22)),
  s(N(79.65), "sfx/rm-ding.wav", 0.4),
  s(N(79.9), "sfx/rm-whip.wav", 0.4),
  s(N(81.0), "sfx/pluck_001.wav", 0.35),
  s(N(82.3), "sfx/pluck_001.wav", 0.35),
  s(N(83.3), "sfx/boom.mp3", 0.8),
  s(N(85.0), "sfx/growth.mp3", 0.45),
  s(N(88.4), "sfx/growth.mp3", 0.5),
  s(N(90.6), "sfx/growth.mp3", 0.45),
  s(N(94.3), "sfx/boom.mp3", 0.5),
  s(N(96.3), "sfx/boom.mp3", 0.45),
  s(N(98.9), "sfx/pluck_001.wav", 0.35),
  s(N(100.0), "sfx/pluck_001.wav", 0.35),
  s(N(100.6), "sfx/rm-page-turn.wav", 0.4),
  // lessons
  s(N(103.0), "sfx/rm-whip.wav", 0.35),
  s(N(104.4), "sfx/impactSoft_medium_000.wav", 0.5),
  s(N(111.1), "sfx/pluck_001.wav", 0.35),
  s(N(112.0), "sfx/impactSoft_medium_000.wav", 0.5),
  s(N(116.9), "sfx/chip-lay-1.wav", 0.4),
  s(N(118.4), "sfx/pluck_001.wav", 0.35),
  s(N(119.35), "sfx/impactSoft_medium_000.wav", 0.5),
  // challenge
  s(N(124.55), "sfx/rm-whip.wav", 0.35),
  ...Array.from({ length: 7 }, (_, i) => s(N(126.3) + i * 0.3 + 0.15, "sfx/confirmation_002.wav", 0.25)),
  s(N(128.5), "sfx/handleCoins.wav", 0.5),
  s(N(129.7), "sfx/pluck_001.wav", 0.35),
  ...Array.from({ length: 16 }, (_, i) => s(N(133.8) + i * 0.1, "sfx/glass_002.wav", 0.12)),
  s(N(135.3), "sfx/pluck_001.wav", 0.35),
  // recitation & outro
  s(N(135.65), "sfx/rm-whoosh.wav", 0.3),
  s(END - 6.9 + 1.55, "sfx/drop_002.wav", 0.5),
  s(END - 6.9 + 2.3, "sfx/rm-ding.wav", 0.4),
];

const Captions: React.FC = () => {
  const t = useT();
  if (t > REC_START - 0.4) return null;
  const phrase = PHRASES.find((p) => t >= N(WORDS[p[0]].start) - 0.12 && t <= N(WORDS[p[1]].end) + 0.25);
  if (!phrase) return null;
  const o = win(t, N(WORDS[phrase[0]].start) - 0.12, N(WORDS[phrase[1]].end) + 0.25, 0.1, 0.12);
  return (
    <div style={{ position: "absolute", left: 160, right: 160, bottom: 46, textAlign: "center", direction: "rtl", opacity: o }}>
      <span
        style={{
          fontFamily: PLEX,
          fontWeight: 500,
          fontSize: 46,
          lineHeight: 1.55,
          background: "rgba(5,13,16,0.72)",
          padding: "6px 24px",
          borderRadius: 14,
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {WORDS.slice(phrase[0], phrase[1] + 1).map((w, i) => (
          <span key={i} style={{ color: t >= N(w.start) ? C.sand : "rgba(239,228,207,0.4)" }}>
            {w.text}{" "}
          </span>
        ))}
      </span>
    </div>
  );
};

export const Episode1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.night }}>
      <Hook />
      <City />
      <Souq />
      <Shop />
      <WalkBack />
      <Roof />
      <SeedWorld />
      <Lessons />
      <Challenge />
      <Recitation />
      <Outro />
      <Captions />

      {/* ---------- audio ---------- */}
      <Sequence from={Math.round(N(0) * FPS)} layout="none">
        <Audio src={staticFile("narration-long.wav")} volume={1} />
      </Sequence>
      <Sequence from={Math.round(REC_START * FPS)} layout="none">
        <Audio src={staticFile("recitation.wav")} volume={1} />
      </Sequence>
      <Audio src={staticFile("sfx/wind.wav")} volume={0.06} />
      <Sequence from={Math.round(N(11.7) * FPS)} durationInFrames={Math.round((N(54.6) - N(11.7)) * FPS)} layout="none">
        <Audio src={staticFile("sfx/souq.mp3")} volume={0.16} loop />
      </Sequence>
      {SFX.map((x, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(x.at * FPS))} durationInFrames={FPS * 5} layout="none">
          <Audio src={staticFile(x.src)} volume={x.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
