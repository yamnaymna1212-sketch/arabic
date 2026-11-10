import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile } from "remotion";
import { C, Captions, Clip, FilmLook, FPS, Letterbox, Move, Plate, Stamp, W, WE, WORDS, useT } from "./lib";
import {
  Account,
  BigWords,
  Bug,
  Checklist,
  Chips,
  Choice,
  Clock,
  Contract,
  EndCard,
  Flow,
  Gauge,
  InfoCard,
  MathCard,
  MissedCalls,
  NameTag,
  Notice,
  Options,
  Paycheck,
  QuestionRow,
  RubberStamp,
  Statement,
  Timeline,
  Tips,
  TitleCard,
} from "./overlays";

const VO_END = WE(WORDS.length - 1);
export const EP1_SECONDS = VO_END + 4;

type Shot = { at: number; src: string; move: Move; fx?: number; fy?: number; blur?: number; dark?: number; vid?: string; rate?: number };
const sh = (at: number, src: string, move: Move, extra: Partial<Shot> = {}): Shot => ({ at, src, move, ...extra });
const S = (n: string) => `scenes/${n}.png`;

// Recap montage plates (behind the timeline).
const RECAP = ["s07", "s08", "s02", "s16", "s17", "s19", "s21", "s22", "s24", "s25"];
const recapShots: Shot[] = RECAP.map((n, i) =>
  sh(W(1153) + i * ((W(1245) - W(1153)) / RECAP.length), S(n), i % 2 ? "left" : "in", { dark: 0.6, blur: 3 }),
);

const RAW_SHOTS: Shot[] = [
  sh(0, S("s01"), "in", { fx: 45, fy: 40, vid: "s01" }),
  sh(W(17), S("s02"), "in", { fx: 60 }),
  sh(W(28), S("s04"), "in", { dark: 0.35 }),
  sh(W(33), S("s13"), "in"),
  sh(W(44), S("s01"), "out", { blur: 6, dark: 0.55 }),
  sh(W(68), S("s05"), "in", { fx: 70, fy: 35, vid: "s05" }),
  sh(W(111), S("s06"), "in", { fx: 30 }),
  sh(W(118), S("s06"), "out", { blur: 5, dark: 0.5 }),
  sh(W(130), S("s07"), "in", { fx: 70 }),
  sh(W(194), S("s08"), "in", { fx: 40 }),
  sh(W(247), S("s06"), "right", { blur: 6, dark: 0.55 }),
  sh(W(281), S("s10"), "in", { fx: 75, fy: 70 }),
  sh(W(311), S("s11"), "left"),
  sh(W(329), S("s01"), "in", { dark: 0.2 }),
  sh(W(343), S("s02"), "in", { fx: 55, vid: "s02" }),
  sh(W(409), S("s13"), "in", { fx: 35, vid: "s13" }),
  sh(W(424), S("s14"), "right", { fx: 40 }),
  sh(W(514), S("s15"), "in", { fx: 55 }),
  sh(W(559), S("s16"), "in", { fx: 40 }),
  sh(W(600), S("s16"), "out", { blur: 6, dark: 0.55 }),
  sh(W(652), S("s17"), "in", { fx: 45, fy: 55, vid: "s17" }),
  sh(W(715), S("s18"), "in", { fx: 25 }),
  sh(W(761), S("s07"), "out", { blur: 6, dark: 0.55 }),
  sh(W(792), S("s19"), "in", { fx: 40, vid: "s19" }),
  sh(W(804), S("s20"), "up", { vid: "s20" }),
  sh(W(833), S("s21"), "in", { fy: 55 }),
  sh(W(874), S("s22"), "in", { fx: 45, vid: "s22" }),
  sh(W(904), S("s04"), "in", { dark: 0.2 }),
  sh(W(940), S("s20"), "in", { dark: 0.15 }),
  sh(W(982), S("s11"), "right"),
  sh(W(997), S("s23"), "in", { fx: 50, fy: 55 }),
  sh(W(1026), S("s23"), "out", { blur: 6, dark: 0.55 }),
  sh(W(1035), S("s05"), "out", { fx: 70, fy: 35, dark: 0.1 }),
  sh(W(1054), S("s24"), "in", { fx: 50, fy: 35, vid: "s24" }),
  sh(W(1113), S("s25"), "in", { fx: 35 }),
  ...recapShots,
  sh(W(1245), S("s26"), "in", { fx: 35 }),
  sh(W(1333), S("s27"), "in", { fx: 40, dark: 0.15, vid: "s27" }),
  sh(W(1377), S("s27"), "out", { blur: 8, dark: 0.6 }),
];

const XF = 0.5; // crossfade seconds

// Animated shots: each 5 s clip is slowed down (max 0.7x) to fill its shot.
// If the shot is longer than the clip, we cross-fade to the clip's last frame.
const CLIP = 5;
const SHOTS: Shot[] = RAW_SHOTS.flatMap((s, i) => {
  if (!s.vid) return [s];
  const next = i + 1 < RAW_SHOTS.length ? RAW_SHOTS[i + 1].at : EP1_SECONDS + 1;
  const len = next - s.at;
  const d = Math.min(len + XF, CLIP / 0.7);
  const rate = Math.min(1, CLIP / d);
  const out: Shot[] = [{ ...s, rate }];
  if (len > d + 0.3) out.push({ ...s, vid: undefined, at: s.at + d - XF, src: `clips/${s.vid}-last.png`, move: "in" });
  return out;
});

const Plates: React.FC = () => {
  const t = useT();
  return (
    <>
      {SHOTS.map((s, i) => {
        const end = i + 1 < SHOTS.length ? SHOTS[i + 1].at : EP1_SECONDS + 1;
        if (t < s.at - XF || t > end + XF) return null;
        // later plates sit on top and fade in; the one underneath stays opaque
        const o = i === 0 ? 1 : (t - (s.at - XF)) / XF;
        return (
          <AbsoluteFill key={i} style={{ opacity: Math.max(0, Math.min(1, o)) }}>
            {s.vid ? (
              <Clip src={`clips/${s.vid}.mp4`} from={s.at - XF} rate={s.rate ?? 1} dark={s.dark} />
            ) : (
              <Plate src={s.src} t0={s.at - XF} t1={end + XF} move={s.move} focusX={s.fx} focusY={s.fy} blur={s.blur} dark={s.dark} />
            )}
          </AbsoluteFill>
        );
      })}
    </>
  );
};

const Overlays: React.FC = () => (
  <>
    {/* HOOK */}
    <BigWords
      items={[
        { at: W(10), to: W(12) - 0.05, text: "NO CALL." },
        { at: W(12), to: W(14) - 0.05, text: "NO WARNING." },
        { at: W(14), to: W(17) - 0.1, text: "YOU JUST... STOP.", color: C.gold },
      ]}
    />
    <QuestionRow
      a={W(28) - 0.1}
      b={W(44) - 0.2}
      items={[
        { at: W(28), text: "POLICE?" },
        { at: W(34), text: "THE CAR?" },
        { at: W(41), text: "THE DEBT?" },
      ]}
    />
    <TitleCard a={W(44)} b={W(68) - 0.3} />

    {/* MEET TYLER */}
    <NameTag a={W(68)} b={W(106)} name="TYLER" sub="27 · COLUMBUS, OHIO · USED PICKUP" />
    <InfoCard
      a={W(88) - 0.3}
      b={W(111)}
      title="THE LOAN"
      rows={[
        { at: W(90), label: "Financed", value: "$22,000" },
        { at: W(93), label: "Term", value: "6 YEARS" },
        { at: W(98), label: "Payment", value: "$450/MO", color: C.gold },
      ]}
    />
    <Stamp a={W(111)} b={W(118)} kicker="THEN" text="HOURS CUT" color={C.red} />
    <Choice a={W(118)} b={W(130) - 0.2} pick={W(126)} />

    {/* DAY 1 */}
    <Stamp a={W(130)} b={W(194) - 0.2} kicker="MISSED PAYMENT" text="DAY 1" />
    <Chips
      b={W(150)}
      items={[{ at: W(136), text: "GRACE PERIOD · 10–15 DAYS", color: C.teal }]}
    />
    <Chips b={W(190) - 0.3} items={[{ at: W(150), text: "+ LATE FEE $25–$50", color: C.red }]} />
    <Notice at={W(172)} b={W(194) - 0.2} title="Auto Loan" body="Your payment is past due. A late fee was added." />
    <Notice at={W(176)} b={W(194) - 0.2} y={150} title="Messages" body="Reminder: payment of $450 is overdue." />

    {/* DAY 30 */}
    <Stamp a={W(194)} b={W(247) - 0.2} kicker="30 DAYS LATE" text="DAY 30" />
    <Chips
      b={W(236)}
      items={[
        { at: W(219), text: "EQUIFAX" },
        { at: W(220), text: "EXPERIAN" },
        { at: W(222), text: "TRANSUNION" },
      ]}
    />
    <Gauge a={W(223) - 0.3} b={W(247) - 0.2} from={742} to={631} dropAt={W(226)} dropEnd={W(246)} />
    <Contract a={W(247)} b={W(281) - 0.2} hl={W(257)} />
    <RubberStamp at={W(269)} b={W(281) - 0.2} text="DEFAULT" y={190} x={260} size={130} />

    {/* DAY 60 */}
    <Stamp a={W(281)} b={W(311) - 0.2} kicker="SECOND MISSED PAYMENT" text="DAY 60" />
    <MissedCalls a={W(295)} b={W(311) - 0.2} to={23} />
    <Chips b={W(329) - 0.2} items={[{ at: W(320), text: "OUT OF SIGHT ≠ OUT OF MIND", color: C.red }]} />

    {/* REPO */}
    <Stamp a={W(329)} b={W(343) - 0.2} kicker="SOMEWHERE BETWEEN" text="DAY 60–90" color={C.red} />
    <Clock a={W(343)} b={W(364) - 0.2} text="3:12 AM" />
    <Chips
      b={W(364) - 0.2}
      items={[
        { at: W(357), text: "NO KNOCK", color: C.paper },
        { at: W(359), text: "NO COURT DATE", color: C.paper },
        { at: W(362), text: "NO POLICE", color: C.paper },
      ]}
    />
    <InfoCard
      a={W(364)}
      b={W(409) - 0.2}
      title="IN MOST STATES"
      width={640}
      rows={[
        { at: W(366), label: "Court order needed?", value: "NO", color: C.red },
        { at: W(375), label: "When?", value: "IN DEFAULT", color: C.gold },
        { at: W(397), label: "Who takes it?", value: "REPO CO.", color: C.paper },
      ]}
    />

    {/* RULES */}
    <Stamp a={W(424)} b={W(514) - 0.2} kicker="REPO AGENTS HAVE" text="RULES TOO" color={C.green} />
    <Checklist
      a={W(436)}
      b={W(514) - 0.2}
      title="NO “BREACH OF THE PEACE”"
      note="* In many states. Rules vary by state."
      rows={[
        { at: W(444), ok: true, text: "Driveway, street or parking lot" },
        { at: W(462), ok: false, text: "Breaking into a locked garage" },
        { at: W(468), ok: false, text: "Threats or force" },
        { at: W(478), ok: false, text: "Taking it over your objection*" },
        { at: W(491), ok: false, text: "Pretending to be police" },
      ]}
    />

    {/* BELONGINGS */}
    <Chips
      b={W(559) - 0.2}
      items={[
        { at: W(520), text: "WORK BOOTS", color: C.paper },
        { at: W(523), text: "SUNGLASSES", color: C.paper },
        { at: W(525), text: "TOOLS", color: C.paper },
      ]}
    />
    <InfoCard
      a={W(529)}
      b={W(559) - 0.2}
      width={620}
      rows={[
        { at: W(529), label: "The truck", value: "LENDER", color: C.red },
        { at: W(534), label: "Your stuff inside", value: "YOURS", color: C.green },
        { at: W(550), label: "How to ask", value: "FAST · IN WRITING", color: C.gold },
      ]}
    />

    {/* NOTICE + OPTIONS */}
    <Stamp a={W(559)} b={W(600) - 0.2} kicker="THE TRUCK IS GONE" text="DEBT OVER?" color={C.red} />
    <RubberStamp at={W(567)} b={W(570)} text="NOT EVEN CLOSE" size={110} />
    <Notice at={W(570)} b={W(600) - 0.2} title="Notice of Sale" body="Your vehicle will be sold at auction on the date below." />
    <Options
      a={W(600)}
      b={W(652) - 0.2}
      failAt={W(641)}
      items={[
        { at: W(600), tag: "OPTION 1", title: "REDEEM", body: "Pay the entire loan balance + repo fees. Get the truck back." },
        { at: W(618), tag: "OPTION 2 · SOME STATES", title: "REINSTATE", body: "Catch up on missed payments + fees. Keep the loan going." },
      ]}
    />

    {/* AUCTION */}
    <Stamp a={W(652)} b={W(715) - 0.2} kicker="WHERE IT STARTS TO HURT" text="THE AUCTION" color={C.red} />
    <InfoCard
      a={W(679) - 0.2}
      b={W(715) - 0.2}
      width={600}
      rows={[
        { at: W(679), label: "Still owed", value: "$19,000" },
        { at: W(688), label: "Sold for", value: "$11,000", color: C.green },
        { at: W(694), label: "Lender's costs", value: "+ $1,500", color: C.red },
      ]}
    />
    <MathCard a={W(715)} b={W(761) - 0.2} steps={[W(720), W(724), W(728)]} totalAt={W(734)} labelAt={W(749)} />

    {/* COLLECTIONS + LAWSUIT */}
    <Flow
      a={W(776) - 0.2}
      b={W(792) - 0.2}
      items={[
        { at: W(776), text: "COLLECTIONS" },
        { at: W(778), text: "DEBT BUYER" },
        { at: W(790), text: "LAWSUIT" },
      ]}
    />
    <Chips b={W(804) - 0.2} items={[{ at: W(800), text: "SERVED: COURT PAPERS", color: C.red }]} />
    <RubberStamp at={W(822)} b={W(833) - 0.2} text="DEFAULT JUDGMENT" size={120} />

    {/* TOOLS */}
    <Stamp a={W(833)} b={W(874) - 0.2} kicker="TOOL #1" text="WAGE GARNISHMENT" color={C.red} />
    <Paycheck a={W(838)} b={W(874) - 0.2} cutAt={W(856)} />
    <Stamp a={W(874)} b={W(904) - 0.2} kicker="TOOL #2" text="BANK LEVY" color={C.red} />
    <Account a={W(880)} b={W(904) - 0.2} freezeAt={W(886)} />
    <RubberStamp at={W(903)} b={W(904) + 0.6} text="DECLINED" size={140} y={-60} />

    {/* JAIL */}
    <BigWords
      items={[
        { at: W(910), to: W(921) - 0.1, text: "CAN TYLER GO\nTO JAIL?".replace("\n", " "), size: 150 },
        { at: W(921), to: W(934) - 0.1, text: "NO.", color: C.green, size: 300 },
      ]}
    />
    <Chips b={W(934)} items={[{ at: W(922), text: "NOT JUST FOR OWING MONEY", color: C.green }]} />
    <BigWords items={[{ at: W(934), to: W(940) - 0.1, text: "BUT THERE'S A CATCH.", color: C.gold, size: 150 }]} />
    <Stamp a={W(940)} b={W(976) - 0.2} kicker="CATCH #1" text="IGNORING THE JUDGE" color={C.red} />
    <Chips b={W(976) - 0.2} items={[{ at: W(960), text: "→ POSSIBLE WARRANT (SOME STATES)", color: C.red }]} />
    <Stamp a={W(976)} b={W(1026) - 0.2} kicker="CATCH #2" text="HIDING THE TRUCK" color={C.red} />
    <Chips b={W(1026) - 0.2} items={[{ at: W(1015), text: "→ CAN BE A CRIME (SOME STATES)", color: C.red }]} />
    <Statement
      a={W(1026)}
      b={W(1035) - 0.2}
      size={64}
      width={1200}
      text={
        <>
          <span style={{ color: C.green }}>Owing the debt</span> isn't a crime.
          <br />
          <span style={{ color: C.red }}>Hiding the collateral</span> can be.
        </>
      }
    />

    {/* CO-SIGNER */}
    <Stamp a={W(1035)} b={W(1054) - 0.2} kicker="ONE MORE TWIST" text="THE CO-SIGNER" color={C.gold} />
    <NameTag a={W(1054)} b={W(1077) - 0.2} name="MOM" sub="CO-SIGNER ON TYLER'S LOAN" />
    <Chips
      b={W(1077) - 0.2}
      left={900}
      items={[
        { at: W(1059), text: "LATE PAYMENTS", color: C.red },
        { at: W(1062), text: "REPO", color: C.red },
        { at: W(1064), text: "$9,500", color: C.red },
      ]}
    />
    <Statement
      a={W(1077)}
      b={W(1113) - 0.2}
      kicker="CO-SIGNING = OWING"
      text="The lender can collect from the co-signer, sometimes without going after the borrower first."
    />

    {/* 7 YEARS */}
    <Stamp a={W(1113)} b={W(1153) - 0.2} kicker="ON HIS CREDIT REPORT" text="7 YEARS" color={C.red} />
    <Chips
      b={W(1153) - 0.2}
      items={[
        { at: W(1137), text: "CAR LOANS" },
        { at: W(1139), text: "APARTMENTS" },
        { at: W(1142), text: "SOME JOBS" },
      ]}
    />

    {/* RECAP */}
    <Timeline
      a={W(1153)}
      b={W(1245) - 0.2}
      endAt={W(1232)}
      nodes={[
        { at: W(1161), k: "DAY 1", v: "Late fee" },
        { at: W(1166), k: "DAY 30", v: "Credit hit · default" },
        { at: W(1177), k: "DAY 60–90", v: "Tow truck at 3 AM" },
        { at: W(1189), k: "AUCTION", v: "$9,500 bill, no truck" },
        { at: W(1209), k: "COURT", v: "Lawsuit · garnishment · levy" },
        { at: W(1219), k: "7 YEARS", v: "Mom's credit · his record" },
      ]}
    />

    {/* WHAT TO DO */}
    <Stamp a={W(1245)} b={W(1264) - 0.2} kicker="WHAT PEOPLE LEARN TOO LATE" text="ACT EARLY" color={C.green} />
    <Tips
      a={W(1264) - 0.2}
      b={W(1333) - 0.2}
      items={[
        { at: W(1264), title: "Call before you miss", body: "Ask for a deferral or extension: payments moved to the end." },
        { at: W(1291), title: "Refinance", body: "A lower payment can keep the truck in your driveway." },
        { at: W(1296), title: "Sell it yourself", body: "A private sale almost always beats auction prices." },
        { at: W(1316), title: "Voluntary surrender", body: "Saves repo fees. Still hurts your credit." },
      ]}
    />
    <Statement
      a={W(1333)}
      b={W(1377) - 0.2}
      kicker="DISCLAIMER"
      size={38}
      text="General information, not financial or legal advice. Laws vary by state. Facing a repossession or lawsuit? Talk to a licensed attorney, legal aid office, or nonprofit credit counselor."
    />
    <EndCard a={W(1377)} nextAt={W(1402)} b={EP1_SECONDS} />
  </>
);

type Sfx = { at: number; src: string; vol: number };
const s = (at: number, src: string, vol = 0.5): Sfx => ({ at, src, vol });
const WH = "sfx/rm-whoosh.wav";
const HIT = "sfx/impactSoft_medium_000.wav";
const BOOM = "sfx/boom.mp3";
const SFX: Sfx[] = [
  s(W(10), HIT, 0.5),
  s(W(12), HIT, 0.5),
  s(W(14), BOOM, 0.6),
  s(W(28), WH, 0.35),
  s(W(34), WH, 0.35),
  s(W(41), WH, 0.35),
  s(W(44) - 0.2, BOOM, 0.5),
  s(W(68), WH, 0.3),
  s(W(90), "sfx/pluck_001.wav", 0.35),
  s(W(93), "sfx/pluck_001.wav", 0.35),
  s(W(98), "sfx/handleCoins.wav", 0.5),
  s(W(111), HIT, 0.45),
  s(W(126), "sfx/confirmation_002.wav", 0.3),
  s(W(130), WH, 0.35),
  s(W(150), "sfx/handleCoins.wav", 0.4),
  s(W(172), "sfx/rm-ding.wav", 0.35),
  s(W(176), "sfx/rm-ding.wav", 0.3),
  s(W(194), WH, 0.35),
  s(W(226), "sfx/drop_002.wav", 0.4),
  s(W(247), "sfx/rm-page-turn.wav", 0.5),
  s(W(269), "sfx/impactBell_heavy_000.wav", 0.45),
  s(W(281), WH, 0.35),
  s(W(329), WH, 0.35),
  s(W(343), BOOM, 0.6),
  s(W(357), HIT, 0.4),
  s(W(359), HIT, 0.4),
  s(W(362), HIT, 0.4),
  s(W(418), BOOM, 0.45),
  s(W(424), WH, 0.35),
  s(W(514), WH, 0.3),
  s(W(541), "sfx/rm-page-turn.wav", 0.35),
  s(W(559), WH, 0.35),
  s(W(567), "sfx/impactBell_heavy_000.wav", 0.4),
  s(W(570), "sfx/rm-ding.wav", 0.3),
  s(W(600), WH, 0.3),
  s(W(618), WH, 0.3),
  s(W(641), HIT, 0.45),
  s(W(652), WH, 0.35),
  s(W(688), "sfx/handleCoins.wav", 0.4),
  s(W(734), BOOM, 0.5),
  s(W(776), WH, 0.3),
  s(W(778), WH, 0.3),
  s(W(790), HIT, 0.45),
  s(W(792), "sfx/doorOpen_1.wav", 0.5),
  s(W(822), "sfx/impactBell_heavy_000.wav", 0.5),
  s(W(833), WH, 0.35),
  s(W(856), "sfx/drop_002.wav", 0.4),
  s(W(874), WH, 0.35),
  s(W(886), HIT, 0.4),
  s(W(903), "sfx/impactBell_heavy_000.wav", 0.45),
  s(W(910), WH, 0.35),
  s(W(921), BOOM, 0.6),
  s(W(934), HIT, 0.4),
  s(W(940), WH, 0.3),
  s(W(976), WH, 0.3),
  s(W(1026), HIT, 0.45),
  s(W(1035), WH, 0.35),
  s(W(1113), WH, 0.35),
  s(W(1153), "sfx/rm-whip.wav", 0.4),
  ...[1161, 1166, 1177, 1189, 1209, 1219].map((i) => s(W(i), "sfx/pluck_001.wav", 0.35)),
  s(W(1232), BOOM, 0.5),
  s(W(1245), WH, 0.35),
  ...[1264, 1291, 1296, 1316].map((i) => s(W(i), "sfx/confirmation_002.wav", 0.25)),
  s(W(1377), BOOM, 0.45),
];

const Music: React.FC = () => (
  <Audio
    src={staticFile("music/score.mp3")}
    volume={(f) => {
      const t = f / FPS;
      const fadeIn = interpolate(t, [0, 2], [0, 1], { extrapolateRight: "clamp" });
      const fadeOut = interpolate(t, [EP1_SECONDS - 4, EP1_SECONDS], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const swell = t > W(1377) - 0.5 ? 1.8 : 1; // music lifts under the end card
      return 0.28 * fadeIn * fadeOut * swell;
    }}
  />
);

export const Episode1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Plates />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3))" }} />
    <Overlays />
    <FilmLook />
    <Letterbox />
    <Bug until={W(1377)} />
    <Captions until={W(1377) - 0.3} />
    <Audio src={staticFile("vo/narration.mp3")} />
    <Music />
    {SFX.map((x, i) => (
      <Sequence key={i} from={Math.round(x.at * FPS)} durationInFrames={FPS * 4} layout="none">
        <Audio src={staticFile(x.src)} volume={x.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
