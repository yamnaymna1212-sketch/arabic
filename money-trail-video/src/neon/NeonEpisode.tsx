import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { BODY, DISPLAY, FPS, PHRASES, ThemeCtx, useT, W, WE, win, WORDS } from "../lib";
import { EP1_SECONDS, Music, Overlays, SFX } from "../Episode";
import {
  Bars,
  Barn,
  Countdown,
  Crowd,
  Envelope,
  Garage,
  Mood,
  N,
  Neon,
  Person,
  Pill,
  Pose,
  Spotlight,
  Strike,
  Thought,
  TowTruck,
  Truck,
  World,
  glow,
  moodColor,
} from "./kit";

const END = EP1_SECONDS;
const lerp = (t: number, a: number, b: number, v0: number, v1: number) =>
  interpolate(t, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** World mood: green → amber → red, back to green for "what to do". */
const worldMood = (t: number) => {
  if (t < W(194)) return 0;
  if (t < W(281)) return lerp(t, W(194), W(281), 0, 0.7);
  if (t < W(343)) return lerp(t, W(281), W(343), 0.7, 2);
  if (t < W(1245)) return 2;
  return lerp(t, W(1245), W(1245) + 2.5, 2, 0);
};
const nightAmt = (t: number) => Math.max(win(t, W(17), W(44), 0.6, 0.8), win(t, W(329), W(409), 1, 1));

// Tyler's pose/mood by beat.
type Beat = [number, Pose, Mood];
const BEATS: Beat[] = [
  [0, "phone", "worried"],
  [W(68), "wave", "happy"],
  [W(98), "idle", "happy"],
  [W(111), "idle", "worried"],
  [W(126), "shrug", "worried"],
  [W(130), "phone", "neutral"],
  [W(190), "idle", "smirk"],
  [W(194), "idle", "worried"],
  [W(226), "down", "sad"],
  [W(247), "idle", "neutral"],
  [W(269), "idle", "shock"],
  [W(281), "stop", "smirk"],
  [W(311), "point", "smirk"],
  [W(327), "idle", "neutral"],
  [W(409), "phone", "shock"],
  [W(424), "idle", "neutral"],
  [W(444), "point", "neutral"],
  [W(491), "idle", "happy"],
  [W(514), "hold", "sad"],
  [W(559), "shrug", "worried"],
  [W(652), "idle", "sad"],
  [W(715), "idle", "worried"],
  [W(734), "idle", "shock"],
  [W(761), "phone", "worried"],
  [W(792), "hold", "shock"],
  [W(804), "idle", "worried"],
  [W(833), "hold", "sad"],
  [W(874), "phone", "neutral"],
  [W(903), "idle", "shock"],
  [W(904), "idle", "worried"],
  [W(921), "up", "happy"],
  [W(934), "idle", "worried"],
  [W(976), "point", "smirk"],
  [W(997), "idle", "smirk"],
  [W(1035), "wave", "happy"],
  [W(1054), "idle", "sad"],
  [W(1113), "idle", "sad"],
  [W(1245), "phone", "happy"],
  [W(1316), "wave", "happy"],
];
const HIDDEN: [number, number][] = [
  [W(44) - 0.2, W(68)],
  [W(332), W(409)],
  [W(600), W(652)],
  [W(776), W(792)],
  [W(1026), W(1035)],
  [W(1077), W(1113)],
  [W(1153), W(1245)],
  [W(1333), END + 5],
];

const TX = 330;
const TY = 960;
const TS = 1.3;

const Tyler: React.FC = () => {
  const t = useT();
  const beat = [...BEATS].reverse().find((b) => t >= b[0]) ?? BEATS[0];
  let o = 1;
  for (const [a, b] of HIDDEN) o = Math.min(o, 1 - win(t, a, b, 0.35, 0.35));
  const enter = lerp(t, 0, 0.6, 0, 1);
  return <Person x={TX} y={TY} scale={TS} pose={beat[1]} mood={beat[2]} props={["cap", "badge"]} opacity={o * enter} seed="tyler" />;
};

/** Things on stage besides Tyler, each in its time window. */
const Stage: React.FC = () => {
  const t = useT();
  const v = (a: number, b: number, f = 0.4) => win(t, a, b, f, f);

  // repo night sequence
  const towX = lerp(t, W(343), W(348) + 1.5, 1950, 1132) + lerp(t, W(397), W(409) - 0.5, 0, 1100);
  const lift = lerp(t, W(357), W(364), 0, 1);
  const truckRepoX = 760 + lerp(t, W(397), W(409) - 0.5, 0, 1100);
  // truck hidden "around the corner"
  const hideX = lerp(t, W(311), W(320), 640, 1560);

  return (
    <>
      {/* HOOK: Tyler stares at his phone next to his truck */}
      <Truck x={620} y={770} w={380} opacity={v(0, W(44)) * 0.85} />
      <Thought x={560} y={150} a={W(0) + 0.6} b={W(10) - 0.2} w={260}>
        <span style={{ fontFamily: DISPLAY, fontSize: 70, color: N.white }}>$450?</span>
      </Thought>

      {/* MEET TYLER: spotlight stage + new truck */}
      <Spotlight x={TX} y={TY} w={420} opacity={v(W(68), W(111))} />
      <Truck x={560} y={760} w={420} opacity={v(W(68), W(111))} />
      <Pill x={770} y={720} text="USED PICKUP · $22,000" a={W(80)} b={W(111)} />

      {/* DAY 60: collector keeps calling, truck goes around the corner */}
      <Person x={1560} y={960} scale={1} color={N.teal} pose="phone" mood="smirk" props={["headset"]} opacity={v(W(295), W(311))} seed="col" label="COLLECTIONS" flip />
      <Truck x={hideX} y={770} w={380} opacity={v(W(281), W(329))} />
      <Pill x={1500} y={700} text="AROUND THE CORNER" a={W(316)} b={W(329)} color={N.gold} />

      {/* REPO at 3:12 AM */}
      <Truck x={truckRepoX} y={770 - lift * 18} w={420} opacity={v(W(329) + 0.5, W(409) - 0.2)} />
      <TowTruck x={towX} y={740} lights lift={lift} />
      {/* empty spot */}
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 770,
          width: 420,
          height: 180,
          border: `3px dashed ${N.red}`,
          borderRadius: 18,
          opacity: v(W(409), W(424)),
          boxShadow: `0 0 30px ${N.red}55`,
        }}
      />
      <Pill x={970} y={740} text="EMPTY SPOT" a={W(418)} b={W(424)} color={N.red} />

      {/* RULES: locked garage, repo man can't get in */}
      <Person x={990} y={960} scale={0.95} color={N.lime} pose="shrug" mood="worried" props={["cap", "vest"]} opacity={v(W(436), W(514))} seed="repo" label="REPO AGENT" />


      {/* MYTH: debt gone? */}
      <Strike x={1060} y={430} text="THE DEBT IS GONE" a={W(559)} strikeAt={W(567)} b={W(570)} size={110} />

      {/* AUCTION: truck under the spotlight, bidders */}
      <Spotlight x={960} y={850} w={560} color={N.gold} opacity={v(W(652), W(715))} />
      <Truck x={750} y={670} w={420} opacity={v(W(652), W(715))} />
      <Crowd x={520} y={1060} cols={18} rows={2} gap={78} scale={0.32} pose="up" opacity={v(W(652), W(715))} seed="bid" />

      {/* MATH: bank officer */}
      <Person x={800} y={960} scale={1.1} color={N.teal} pose="point" mood="neutral" props={["tie", "glasses"]} opacity={v(W(715), W(761))} seed="bank" label="LENDER" flip />


      {/* SERVED */}
      <Person x={680} y={960} scale={1.1} color={N.lime} pose="point" mood="neutral" props={["cap"]} opacity={v(W(792), W(806))} seed="server" label="PROCESS SERVER" flip />

      {/* COURT: judge behind the bench */}
      <Person x={1000} y={820} scale={1.05} color={N.gold} pose="idle" mood="neutral" props={["glasses", "gavel"]} opacity={v(W(804), W(833))} seed="judge" label="JUDGE" />
      <Neon x={820} y={700} w={360} h={200} vb="0 0 360 200" color={N.gold} opacity={v(W(804), W(833))}>
        <rect x={4} y={4} width={352} height={192} rx={8} />
        <line x1={4} y1={40} x2={356} y2={40} />
      </Neon>

      {/* BANK LEVY: card terminal */}
      <Neon x={600} y={540} w={200} h={280} vb="0 0 200 280" color={t > W(903) ? N.red : N.teal} opacity={v(W(874), W(904))}>
        <rect x={4} y={4} width={192} height={272} rx={22} />
        <rect x={24} y={28} width={152} height={80} rx={8} />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={30 + (i % 3) * 50} y={128 + Math.floor(i / 3) * 44} width={38} height={30} rx={6} opacity={0.7} />
        ))}
        <text x={100} y={80} textAnchor="middle" fontFamily={DISPLAY} fontSize={34} fill={t > W(903) ? N.red : N.teal} stroke="none">
          {t > W(903) ? "DECLINED" : "$40.00"}
        </text>
      </Neon>

      {/* JAIL: bars drop around Tyler, then lift at "No." */}
      <Bars x={150} y={380 - lerp(t, W(921), W(921) + 0.8, 0, 900)} w={360} h={600} opacity={v(W(904), W(934))} />

      {/* CATCH 1: the judge again */}
      <Person x={1300} y={900} scale={1.05} color={N.gold} pose="point" mood="worried" props={["glasses", "gavel"]} opacity={v(W(940), W(976))} seed="judge2" label="JUDGE" flip />
      <Neon x={1140} y={780} w={320} h={180} vb="0 0 320 180" color={N.gold} opacity={v(W(940), W(976))}>
        <rect x={4} y={4} width={312} height={172} rx={8} />
      </Neon>

      {/* CATCH 2: barn with the truck under a tarp */}
      <Truck x={830} y={730} w={420} tarp opacity={v(W(997), W(1026))} />

      {/* TWIST: flashback, then Mom */}
      <Spotlight x={TX} y={TY} w={420} color={N.pink} opacity={v(W(1035), W(1054))} />
      <Truck x={560} y={760} w={420} opacity={v(W(1035), W(1054)) * 0.7} />
      <Pill x={760} y={700} text="FLASHBACK · THE DAY HE BOUGHT IT" a={W(1037)} b={W(1054)} color={N.pink} />
      <Person x={1480} y={960} scale={1.2} color={N.pink} pose="idle" mood={t > W(1100) ? "sad" : "worried"} props={["hair", "glasses"]} opacity={v(W(1054), W(1077))} seed="mom" label="MOM · CO-SIGNER" />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: v(W(1059), W(1077)), filter: glow(N.red) }}>
        <path d="M420 560 Q900 440 1400 560" fill="none" stroke={N.red} strokeWidth={5} strokeDasharray="12 10" />
      </svg>

      {/* 7 YEARS */}
      <Countdown x={900} y={520} size={380} frac={lerp(t, W(1117), W(1153), 1, 0.15)} label="7" sub="YEARS ON HIS REPORT" color={N.red} opacity={v(W(1113), W(1153))} />

      {/* WHAT TO DO: green again, phone call */}
      <Thought x={560} y={170} a={W(1264)} b={W(1291)} w={260}>
        <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 30, color: N.white, textAlign: "center" }}>
          “Can I defer
          <br />a payment?”
        </span>
      </Thought>
    </>
  );
};

/** Garage, envelope and barn need their own windows (they render unconditionally above). */
const Windowed: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const t = useT();
  const o = win(t, a, b, 0.4, 0.4);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** Top HUD: the countdown ring + Tyler's money status. */
const Hud: React.FC = () => {
  const t = useT();
  const o = win(t, W(130), W(1153), 0.6, 0.6);
  if (o <= 0) return null;
  const phases: [number, string][] = [
    [W(130), "DAY 1"],
    [W(194), "DAY 30"],
    [W(281), "DAY 60"],
    [W(343), "DAY 80"],
    [W(559), "DAY 95"],
    [W(652), "DAY 110"],
    [W(761), "MONTH 6"],
    [W(833), "MONTH 9"],
    [W(904), "YEAR 1"],
  ];
  const ph = [...phases].reverse().find((p) => t >= p[0]) ?? phases[0];
  const frac = lerp(t, W(130), W(1153), 0.04, 1);
  const missed = t >= W(329) ? 3 : t >= W(281) ? 2 : 1;
  const score = Math.round(
    t < W(226) ? 742 : t < W(246) ? lerp(t, W(226), W(246), 742, 631) : t < W(290) ? 631 : t < W(300) ? lerp(t, W(290), W(300), 631, 598) : t < W(418) ? 598 : t < W(822) ? 560 : 520,
  );
  const truck = t < W(418);
  const owes = t >= W(734) ? "$9,500" : t >= W(679) ? "$19,000" : "—";
  const col = moodColor(worldMood(t));
  const cell = (k: string, v: string, c: string) => (
    <div style={{ padding: "0 26px", borderLeft: "1px solid rgba(255,255,255,0.12)" }}>
      <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 15, letterSpacing: 3, color: "rgba(242,255,248,0.6)" }}>{k}</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 46, color: c, lineHeight: 1 }}>{v}</div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        top: 22,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: o,
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(160deg, rgba(34,74,58,0.7), rgba(10,26,20,0.85))",
        border: `1.5px solid ${col}77`,
        borderRadius: 999,
        padding: "8px 16px 8px 8px",
        boxShadow: `0 0 30px ${col}33`,
      }}
    >
      <div style={{ position: "relative", width: 96, height: 96 }}>
        <Countdown x={48} y={48} size={96} frac={frac} label="" color={col} />
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 52, color: N.white, padding: "0 22px 0 14px", minWidth: 190 }}>{ph[1]}</div>
      {cell("MISSED", String(missed), missed > 1 ? N.red : N.gold)}
      {cell("CREDIT SCORE", String(score), score > 700 ? N.mint : score > 600 ? N.gold : N.red)}
      {cell("TRUCK", truck ? "✓ HIS" : "✕ GONE", truck ? N.mint : N.red)}
      {cell("STILL OWES", owes, owes === "—" ? "rgba(242,255,248,0.4)" : N.red)}
    </div>
  );
};

const NeonCaptions: React.FC = () => {
  const t = useT();
  if (t > W(1377) - 0.3) return null;
  const ph = PHRASES.find((p) => t >= W(p[0]) - 0.1 && t <= WE(p[1]) + 0.2);
  if (!ph) return null;
  const words = WORDS.slice(ph[0], ph[1] + 1);
  return (
    <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "rgba(2,12,8,0.72)",
          border: "1px solid rgba(90,240,176,0.25)",
          borderRadius: 18,
          padding: "10px 26px",
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 34,
          color: N.white,
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ marginRight: 10, color: t >= w.start - 0.05 ? N.white : "rgba(242,255,248,0.4)" }}>
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export const NeonEpisode1: React.FC = () => {
  const t = useT();
  return (
    <ThemeCtx.Provider value="neon">
      <AbsoluteFill style={{ backgroundColor: N.bg }}>
        <World mood={worldMood(t)} night={nightAmt(t)} />
        <Stage />
        <Windowed a={W(424)} b={W(514)}>
          <Garage x={520} y={600} w={380} />
        </Windowed>
        <Windowed a={W(570)} b={W(600)}>
          <Envelope x={600} y={520} w={300} anger={0.35} label="NOTICE OF SALE" />
        </Windowed>
        <Windowed a={W(761)} b={W(776)}>
          <Envelope x={600} y={500} w={300} anger={0.9} label="FINAL NOTICE" />
        </Windowed>
        <Windowed a={W(990)} b={W(1026)}>
          <Barn x={760} y={500} w={560} />
        </Windowed>
        <Tyler />
        <Windowed a={W(514)} b={W(559)}>
          <Neon x={TX - 85} y={640} w={170} h={110} vb="0 0 170 110" color={N.gold}>
            <rect x={4} y={20} width={162} height={86} rx={6} />
            <path d="M4 20 L30 2 L140 2 L166 20" fill="none" />
            <path d="M40 40 L70 40 M90 40 L130 40" opacity={0.6} />
          </Neon>
        </Windowed>
        <Overlays neon />
        <Hud />
        <NeonCaptions />
        <Audio src={staticFile("vo/narration.mp3")} />
        <Music />
        {SFX.map((x, i) => (
          <Sequence key={i} from={Math.round(x.at * FPS)} durationInFrames={FPS * 4} layout="none">
            <Audio src={staticFile(x.src)} volume={x.vol} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

