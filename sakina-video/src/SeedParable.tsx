import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AMIRI, at, C, INOUT, KUFI, PLEX, VO_OFFSET } from "./theme";
import { Yusuf } from "./Yusuf";
import { GRAINS, HEAD_LEN, makeStalk, stalkLength, WheatHead } from "./Wheat";
import { PHRASES, WORDS } from "./narration";

// narration time -> video time
const N = (s: number) => s + VO_OFFSET;

export const SEED_PARABLE_SECONDS = N(40);

// ---------- world layout ----------
const GROUND = 1450;
const SEED = { x: 660, y: GROUND - 6 };
const YUSUF_X = 190;
const STALKS = Array.from({ length: 7 }, (_, i) =>
  makeStalk(SEED.x, GROUND, -30 + i * 10, 640 - Math.abs(i - 3) * 32),
);
const MID = STALKS[3];
const ZOOM = 4.2;
const ZOOM_FOCUS = { x: MID.tx, y: MID.ty - HEAD_LEN / 2 };
// thread anchor: screen point (790, 960) expressed in world coords at full zoom
const ANCHOR = { x: ZOOM_FOCUS.x + (790 - 540) / ZOOM, y: ZOOM_FOCUS.y };

const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: rand(i) * 1080,
  y: rand(i + 100) * 1300,
  r: 0.8 + rand(i + 200) * 1.8,
  p: rand(i + 300) * Math.PI * 2,
}));
const FIELD = Array.from({ length: 30 }, (_, i) => {
  const x = -260 + rand(i + 400) * 1600;
  const tooClose = Math.abs(x - SEED.x) < 120;
  return {
    stalk: makeStalk(tooClose ? x + 260 : x, GROUND, -14 + rand(i + 500) * 28, 260 + rand(i + 600) * 260, 0.05),
    start: N(24.3) + rand(i + 700) * 3.6,
    scale: 0.55 + rand(i + 800) * 0.35,
  };
});

// pop timing for the zoomed head
const POP_START = N(16.5);
const POP_END = N(18.35);
const popTime = (i: number) => POP_START + (i / 100) * (POP_END - POP_START);

// ---------- camera ----------
const camTimes = [0, N(11.5), N(12.6), N(13.4), N(14.3), N(15.7), N(16.45), N(18.3), N(19.0), N(23.3), N(25.2), N(30.0), N(30.9)];
const camX = [560, 560, 620, 620, 660, 660, ZOOM_FOCUS.x, ZOOM_FOCUS.x, 660, 660, 580, 580, 520];
const camY = [1060, 1060, 1150, 1150, 1040, 1040, ZOOM_FOCUS.y, ZOOM_FOCUS.y, 1000, 1000, 1080, 1080, 1060];
const camS = [1, 1, 1.15, 1.15, 1.1, 1.1, ZOOM, ZOOM, 1.1, 1.1, 0.9, 0.9, 1.0];

const fade = (t: number, a: number, b: number, d = 0.4) =>
  interpolate(t, [a, a + d, b - d, b], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const TopText: React.FC<{ t: number; from: number; to: number; children: React.ReactNode; y?: number }> = ({
  t,
  from,
  to,
  children,
  y = 250,
}) => {
  const o = fade(t, from, to, 0.45);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 80,
        right: 80,
        direction: "rtl",
        textAlign: "center",
        opacity: o,
        translate: `0px ${at(t, [from, from + 0.6], [30, 0])}px`,
      }}
    >
      {children}
    </div>
  );
};

export const SeedParable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // camera
  const cx = interpolate(t, camTimes, camX, { extrapolateRight: "clamp", easing: INOUT });
  const cy = interpolate(t, camTimes, camY, { extrapolateRight: "clamp", easing: INOUT });
  const cs = interpolate(t, camTimes, camS, { extrapolateRight: "clamp", easing: INOUT });
  const camera = `translate(540 960) scale(${cs}) translate(${-cx} ${-cy})`;

  // ----- Yusuf pose -----
  const blinkPhase = (t % 3.3) / 3.3;
  const blink = blinkPhase > 0.95 ? 1 : 0;
  const rightArm =
    t < N(4.3)
      ? at(t, [0.3, 1.0], [0, -60])
      : t < N(30)
        ? at(t, [N(4.3), N(4.6), N(5.2)], [-60, -95, -8])
        : at(t, [N(30.4), N(31.2)], [-8, -38]);
  const smile = at(t, [N(30.3), N(31)], [0.25, 1]);
  const headTilt = t < N(30) ? at(t, [N(4.8), N(5.8)], [0, 7]) : at(t, [N(30), N(30.6)], [7, -3]);
  const look = at(t, [N(4.8), N(5.6)], [0, 5]);
  const yusufOpacity = interpolate(t, [N(15.5), N(16), N(29.6), N(30.2)], [1, 0, 0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ----- coin -> seed -----
  const handX = YUSUF_X + 92 + 224 * Math.sin((60 * Math.PI) / 180);
  const handY = GROUND - 500 + 224 * Math.cos((60 * Math.PI) / 180) - 18;
  const coinIn = at(t, [0.6, 1.2], [0, 1], Easing.bezier(0.34, 1.56, 0.64, 1));
  const flyP = at(t, [N(4.6), N(5.6)], [0, 1], Easing.bezier(0.45, 0, 0.55, 1));
  const coinX = interpolate(flyP, [0, 1], [handX, SEED.x]);
  const coinY = interpolate(flyP, [0, 1], [handY, SEED.y]) - Math.sin(flyP * Math.PI) * 260;
  const coinMorph = at(t, [N(5.6), N(6.1)], [1, 0]);
  const coinSpin = Math.cos(t * 9);
  const seedScale = at(t, [N(5.75), N(6.3)], [0, 1], Easing.bezier(0.34, 1.56, 0.64, 1));
  const seedSink = at(t, [N(11.9), N(13.0)], [0, 22]);
  const ripple = at(t, [N(5.7), N(7.0)], [0, 1], Easing.out(Easing.quad));
  const seedPulse = 1 + 0.08 * Math.sin(t * 4) + at(t, [N(21.9), N(22.4), N(23.4)], [0, 0.6, 0.1]);

  // ----- stalks -----
  const stalkStart = (i: number) => N(13.75) + Math.abs(i - 3) * 0.13;
  const sprout = at(t, [N(13.0), N(13.8)], [0, 1]);

  // ----- zoom HUD -----
  const popped = Math.max(0, Math.min(100, Math.floor(((t - POP_START) / (POP_END - POP_START)) * 100) + 1));
  const zoomHud = fade(t, N(16.3), N(18.6), 0.35);
  const threadsOpacity = interpolate(t, [N(16.5), N(16.8), N(18.3), N(18.8)], [0, 0.8, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // other heads fill after zoom-out
  const headFill = (i: number) => {
    if (i === 3) return (g: number) => at(t, [popTime(g), popTime(g) + 0.18], [0, 1], Easing.bezier(0.34, 1.56, 0.64, 1));
    const s = N(18.6) + Math.abs(i - 3) * 0.12;
    return (g: number) => at(t, [s + g * 0.006, s + g * 0.006 + 0.15], [0, 1]);
  };

  const eqCount = Math.round(at(t, [N(20.6), N(21.4)], [0, 700]));
  const fieldCount = Math.round(at(t, [N(24.4), N(29.6)], [700, 7700], Easing.bezier(0.5, 0, 0.75, 0)));

  const cardIn = at(t, [N(33.9), N(34.7)], [0, 1]);

  // current caption
  const phrase = PHRASES.find((p) => t >= N(WORDS[p[0]].start) - 0.15 && t <= N(WORDS[p[1]].end) + 0.25);

  return (
    <AbsoluteFill style={{ backgroundColor: C.night, overflow: "hidden" }}>
      <Audio src={staticFile("narration.mp3")} trimBefore={0} from={Math.round(VO_OFFSET * 30)} />

      {/* background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 35%, #173843 0%, ${C.night} 60%, #071216 100%)`,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.sand} opacity={0.15 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.3 + s.p))} />
        ))}
      </svg>

      {/* world */}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="grainGlow">
            <stop offset="0%" stopColor={C.gold} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="seedGlow">
            <stop offset="0%" stopColor="#FFE3A0" stopOpacity={0.9} />
            <stop offset="45%" stopColor={C.gold} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="groundFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0E242B" />
            <stop offset="100%" stopColor="#060E11" />
          </linearGradient>
        </defs>
        <g transform={camera}>
          {/* ground */}
          <rect x={-2000} y={GROUND} width={5000} height={1600} fill="url(#groundFade)" />
          <line x1={-2000} y1={GROUND} x2={3000} y2={GROUND} stroke={C.sand} strokeOpacity={0.18} strokeWidth={2} />

          {/* background field (God multiplies) */}
          {FIELD.map((f, i) => {
            const p = at(t, [f.start, f.start + 0.9], [0, 1]);
            if (p <= 0) return null;
            const L = stalkLength(f.stalk);
            const s = f.stalk;
            return (
              <g key={i} opacity={0.5}>
                <path
                  d={`M ${s.bx} ${s.by} Q ${s.cx} ${s.cy} ${s.tx} ${s.ty}`}
                  stroke={C.goldDeep}
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray={L}
                  strokeDashoffset={L * (1 - p)}
                />
                <g transform={`translate(${s.tx} ${s.ty}) rotate(${s.angle}) scale(${f.scale})`}>
                  <WheatHead grow={at(t, [f.start + 0.7, f.start + 1.2], [0, 1])} shown={100} />
                </g>
              </g>
            );
          })}

          {/* Yusuf */}
          <g transform={`translate(${YUSUF_X} ${GROUND})`} opacity={yusufOpacity}>
            <Yusuf rightArm={rightArm} blink={blink} smile={smile} headTilt={headTilt} look={look} />
          </g>

          {/* seed + ripple */}
          {seedScale > 0 ? (
            <g transform={`translate(${SEED.x} ${SEED.y + seedSink})`}>
              <circle r={70 * seedPulse} fill="url(#seedGlow)" opacity={at(t, [N(13.6), N(14.6)], [1, 0.35])} />
              <ellipse
                rx={140 * ripple}
                ry={22 * ripple}
                fill="none"
                stroke={C.gold}
                strokeWidth={2}
                opacity={(1 - ripple) * 0.8}
              />
              <path
                d="M 0 -16 C 10 -10 11 6 0 14 C -11 6 -10 -10 0 -16 Z"
                fill={C.gold}
                stroke="#F6DC9C"
                strokeWidth={1.5}
                transform={`scale(${seedScale * seedPulse})`}
              />
            </g>
          ) : null}
          {/* soil flecks when the seed is planted */}
          {[...Array(10)].map((_, i) => {
            const p = at(t, [N(12.1), N(12.9)], [0, 1]);
            if (p <= 0 || p >= 1) return null;
            const a = -Math.PI * (0.15 + 0.7 * rand(i + 900));
            const d = 30 + rand(i + 950) * 40;
            return (
              <circle
                key={i}
                cx={SEED.x + Math.cos(a) * d * p}
                cy={GROUND + Math.sin(a) * d * p + 60 * p * p}
                r={3}
                fill="#6B5642"
                opacity={1 - p}
              />
            );
          })}

          {/* first sprout */}
          {sprout > 0 && t < N(14.4) ? (
            <path
              d={`M ${SEED.x} ${GROUND} q 4 -40 0 -70`}
              stroke="#8FB47A"
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={80}
              strokeDashoffset={80 * (1 - sprout)}
              opacity={at(t, [N(14.0), N(14.4)], [1, 0])}
            />
          ) : null}

          {/* golden threads from the seed to every ear */}
          {STALKS.map((s, i) => {
            const p = at(t, [N(21.9) + i * 0.06, N(22.9) + i * 0.06], [0, 1]);
            const o = interpolate(t, [N(21.9), N(22.3), N(24.6), N(25.4)], [0, 0.9, 0.9, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (o <= 0) return null;
            const hx = s.tx + Math.sin((s.angle * Math.PI) / 180) * 75;
            const hy = s.ty - Math.cos((s.angle * Math.PI) / 180) * 75;
            const ctrlX = SEED.x + (hx - SEED.x) * 1.6;
            const ctrlY = GROUND - 200;
            return (
              <path
                key={i}
                d={`M ${SEED.x} ${SEED.y} Q ${ctrlX} ${ctrlY} ${hx} ${hy}`}
                stroke="#F3D58F"
                strokeWidth={2.2}
                fill="none"
                strokeDasharray={1200}
                strokeDashoffset={1200 * (1 - p)}
                opacity={o}
              />
            );
          })}

          {/* the seven stalks */}
          {STALKS.map((s, i) => {
            const st = stalkStart(i);
            const p = at(t, [st, st + 0.9], [0, 1]);
            if (p <= 0) return null;
            const L = stalkLength(s);
            const headGrow = at(t, [st + 0.75, st + 1.25], [0, 1], Easing.bezier(0.34, 1.56, 0.64, 1));
            const badge = at(t, [N(18.9) + i * 0.1, N(19.3) + i * 0.1], [0, 1], Easing.bezier(0.34, 1.56, 0.64, 1));
            const badgeOut = interpolate(t, [N(23.2), N(23.8)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const a = (s.angle * Math.PI) / 180;
            const bx = s.tx + Math.sin(a) * 205;
            const by = s.ty - Math.cos(a) * 205;
            const leafP = at(t, [st + 0.4, st + 0.9], [0, 1]);
            const lx = s.bx + (s.tx - s.bx) * 0.35;
            const ly = s.by + (s.ty - s.by) * 0.35;
            return (
              <g key={i}>
                <path
                  d={`M ${s.bx} ${s.by} Q ${s.cx} ${s.cy} ${s.tx} ${s.ty}`}
                  stroke={C.gold}
                  strokeWidth={3.2}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={L}
                  strokeDashoffset={L * (1 - p)}
                />
                {leafP > 0 ? (
                  <path
                    d={`M ${lx} ${ly} q ${i < 3 ? -40 : 40} -30 ${i < 3 ? -70 : 70} -10`}
                    stroke={C.goldDeep}
                    strokeWidth={2.4}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={90}
                    strokeDashoffset={90 * (1 - leafP)}
                  />
                ) : null}
                <g transform={`translate(${s.tx} ${s.ty}) rotate(${s.angle})`}>
                  <WheatHead grow={headGrow} pop={headFill(i)} glow={i === 3 ? zoomHud * 0.9 : 0} />
                </g>
                {badge > 0 && badgeOut > 0 ? (
                  <g transform={`translate(${bx} ${by}) scale(${badge})`} opacity={badgeOut}>
                    <rect x={-46} y={-24} width={92} height={48} rx={24} fill={C.night} stroke={C.gold} strokeWidth={2} />
                    <text
                      x={0}
                      y={11}
                      textAnchor="middle"
                      fontFamily={KUFI}
                      fontWeight={700}
                      fontSize={30}
                      fill={C.gold}
                    >
                      100
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* golden threads from each grain to the counter (zoomed in) */}
          {threadsOpacity > 0 ? (
            <g opacity={threadsOpacity}>
              {GRAINS.map((g) => {
                const p = at(t, [popTime(g.index), popTime(g.index) + 0.3], [0, 1]);
                if (p <= 0) return null;
                const gx = MID.tx + g.x;
                const gy = MID.ty + g.y;
                return (
                  <line
                    key={g.index}
                    x1={gx}
                    y1={gy}
                    x2={gx + (ANCHOR.x - gx) * p}
                    y2={gy + (ANCHOR.y - gy) * p}
                    stroke="#F3D58F"
                    strokeWidth={0.32}
                    opacity={0.55}
                  />
                );
              })}
              <circle cx={ANCHOR.x} cy={ANCHOR.y} r={2.2} fill="#FFE3A0" />
            </g>
          ) : null}

          {/* rising gold particles while the field multiplies */}
          {[...Array(40)].map((_, i) => {
            const start = N(24.4) + rand(i + 1000) * 5;
            const p = (t - start) / 3.5;
            if (p <= 0 || p >= 1) return null;
            return (
              <circle
                key={i}
                cx={-100 + rand(i + 1100) * 1300 + Math.sin(p * 6 + i) * 12}
                cy={GROUND - 40 - p * 700}
                r={2 + rand(i + 1200) * 2.5}
                fill="#FFE3A0"
                opacity={Math.sin(p * Math.PI) * 0.8}
              />
            );
          })}

          {/* coin */}
          {coinIn > 0 && coinMorph > 0 ? (
            <g transform={`translate(${coinX} ${coinY}) scale(${coinIn * coinMorph * (flyP > 0 ? Math.abs(coinSpin) * 0.85 + 0.15 : 1)} ${coinIn * coinMorph})`}>
              <circle r={30} fill={C.gold} stroke="#F6DC9C" strokeWidth={3} />
              <circle r={21} fill="none" stroke={C.goldDeep} strokeWidth={2.5} />
              <path d="M 6 -12 a 13 13 0 1 0 6 22 a 10 10 0 0 1 -6 -22 Z" fill={C.goldDeep} />
            </g>
          ) : null}
        </g>
      </svg>

      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />

      {/* ---------- HUD ---------- */}
      {/* watermark */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          direction: "rtl",
          opacity: 0.85 * (1 - cardIn),
        }}
      >
        <svg width={40} height={40} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={46} fill="none" stroke={C.gold} strokeWidth={4} />
          <path d="M58 26a20 20 0 1 0 14 32 17 17 0 0 1-14-32z" fill={C.gold} />
        </svg>
        <span style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 38, color: C.sand, letterSpacing: 1 }}>سَكينة</span>
      </div>

      <TopText t={t} from={0.4} to={N(4.4)}>
        <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 96, color: C.sand, lineHeight: 1.3 }}>
          ريالٌ واحد…
        </div>
        <div
          style={{
            fontFamily: KUFI,
            fontWeight: 700,
            fontSize: 96,
            color: C.gold,
            lineHeight: 1.3,
            opacity: at(t, [N(3.0), N(3.4)], [0, 1]),
          }}
        >
          كم يصير؟
        </div>
      </TopText>

      <TopText t={t} from={N(4.4)} to={N(11.2)}>
        <div style={{ fontFamily: PLEX, fontSize: 36, color: C.gold, marginBottom: 18, letterSpacing: 1 }}>سورة البقرة · 261</div>
        <div style={{ fontFamily: AMIRI, fontSize: 70, color: C.sand, lineHeight: 1.7, opacity: at(t, [N(6.5), N(7.1)], [0, 1]) }}>
          مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ
        </div>
        <div style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 84, color: C.gold, lineHeight: 1.6, opacity: at(t, [N(9.5), N(10.0)], [0, 1]) }}>
          كَمَثَلِ حَبَّةٍ
        </div>
      </TopText>

      <TopText t={t} from={N(13.6)} to={N(15.8)}>
        <div style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 84, color: C.sand, lineHeight: 1.6 }}>
          أَنبَتَتْ <span style={{ color: C.gold }}>سَبْعَ سَنَابِلَ</span>
        </div>
      </TopText>

      <TopText t={t} from={N(15.7)} to={N(18.6)} y={210}>
        <div style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 80, color: C.sand, lineHeight: 1.6 }}>
          فِي كُلِّ سُنبُلَةٍ <span style={{ color: C.gold }}>مِّائَةُ حَبَّةٍ</span>
        </div>
      </TopText>

      {/* zoom counter */}
      {zoomHud > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 720,
            width: 300,
            top: 830,
            textAlign: "center",
            direction: "rtl",
            opacity: zoomHud,
          }}
        >
          <div
            style={{
              fontFamily: KUFI,
              fontWeight: 700,
              fontSize: 160,
              color: C.gold,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              textShadow: `0 0 40px ${C.gold}88`,
            }}
          >
            {t < POP_START ? 0 : popped}
          </div>
          <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 44, color: C.sand, marginTop: 10 }}>حبّة</div>
        </div>
      ) : null}

      {/* 7 x 100 = 700 */}
      <TopText t={t} from={N(18.6)} to={N(23.4)}>
        <div
          style={{
            direction: "ltr",
            fontFamily: KUFI,
            fontWeight: 700,
            fontSize: 112,
            color: C.sand,
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 26,
          }}
        >
          <span style={{ opacity: at(t, [N(18.6), N(19.0)], [0, 1]) }}>7</span>
          <span style={{ opacity: at(t, [N(19.4), N(19.8)], [0, 1]), color: C.gold, fontSize: 80 }}>×</span>
          <span style={{ opacity: at(t, [N(19.6), N(20.0)], [0, 1]) }}>100</span>
          <span style={{ opacity: at(t, [N(20.5), N(20.8)], [0, 1]), color: C.gold, fontSize: 80 }}>=</span>
          <span
            style={{
              opacity: at(t, [N(20.5), N(20.8)], [0, 1]),
              color: C.gold,
              textShadow: `0 0 36px ${C.gold}99`,
              fontVariantNumeric: "tabular-nums",
              minWidth: 230,
              textAlign: "left",
            }}
          >
            {eqCount}
          </span>
        </div>
        <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 46, color: C.sand, opacity: at(t, [N(21.8), N(22.3)], [0, 1]) }}>
          من <span style={{ color: C.gold }}>حبّةٍ واحدة</span>
        </div>
      </TopText>

      {/* God multiplies */}
      <TopText t={t} from={N(23.6)} to={N(30.0)}>
        <div style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 92, color: C.gold, lineHeight: 1.5, textShadow: `0 0 30px ${C.gold}55` }}>
          وَاللَّهُ يُضَاعِفُ لِمَن يَشَاءُ
        </div>
        <div
          style={{
            fontFamily: KUFI,
            fontWeight: 700,
            fontSize: 84,
            color: C.sand,
            marginTop: 10,
            direction: "ltr",
            fontVariantNumeric: "tabular-nums",
            opacity: at(t, [N(24.4), N(24.8)], [0, 1]) * (1 - at(t, [N(28.0), N(28.4)], [0, 1])),
          }}
        >
          {fieldCount.toLocaleString("en-US")}+
        </div>
        <div
          style={{
            fontFamily: KUFI,
            fontWeight: 700,
            fontSize: 72,
            color: C.sand,
            marginTop: -100,
            opacity: at(t, [N(28.2), N(28.7)], [0, 1]),
          }}
        >
          أكثر من ذلك <span style={{ color: C.gold }}>بكثير</span>
        </div>
      </TopText>

      <TopText t={t} from={N(30.2)} to={N(34.2)}>
        <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 92, color: C.sand, lineHeight: 1.35 }}>صدقتُك لا تنقُص…</div>
        <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 104, color: C.gold, lineHeight: 1.35, opacity: at(t, [N(32.3), N(32.8)], [0, 1]) }}>
          إنّها تُزرَع
        </div>
      </TopText>

      {/* captions */}
      {phrase && cardIn < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 210,
            direction: "rtl",
            textAlign: "center",
            fontFamily: PLEX,
            fontWeight: 500,
            fontSize: 50,
            lineHeight: 1.6,
            opacity: 1 - cardIn,
          }}
        >
          <span style={{ background: "rgba(7,18,22,0.72)", padding: "8px 22px", borderRadius: 18, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
            {WORDS.slice(phrase[0], phrase[1] + 1).map((w, i) => (
              <span key={i} style={{ color: t >= N(w.start) ? C.sand : "rgba(239,228,207,0.38)" }}>
                {w.text}{" "}
              </span>
            ))}
          </span>
        </div>
      ) : null}

      {/* ---------- final verse card ---------- */}
      {cardIn > 0 ? <VerseCard t={t} cardIn={cardIn} /> : null}
    </AbsoluteFill>
  );
};

const VerseCard: React.FC<{ t: number; cardIn: number }> = ({ t, cardIn }) => {
  const logo = at(t, [N(36.6), N(37.4)], [0, 1]);
  return (
    <AbsoluteFill
      style={{
        opacity: cardIn,
        background: `radial-gradient(110% 70% at 50% 40%, #12343A 0%, ${C.night} 70%)`,
        direction: "rtl",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 70px",
      }}
    >
      <div
        style={{
          width: "100%",
          border: `2px solid ${C.gold}`,
          borderRadius: 28,
          padding: "56px 48px",
          position: "relative",
          scale: at(t, [N(33.9), N(34.8)], [0.94, 1]),
          background: "rgba(11,28,34,0.65)",
          boxShadow: `0 0 0 10px rgba(217,178,95,0.08)`,
        }}
      >
        <div
          style={{
            border: `1.5px solid ${C.gold}`,
            borderRadius: 18,
            padding: "18px 0",
            textAlign: "center",
            fontFamily: AMIRI,
            fontWeight: 700,
            fontSize: 56,
            color: C.gold,
            marginBottom: 46,
          }}
        >
          سُورَةُ البَقَرَة
        </div>
        <div style={{ fontFamily: AMIRI, fontSize: 64, lineHeight: 2.05, color: C.sand, textAlign: "center" }}>
          مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ{" "}
          <span style={{ color: C.gold }}>حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ</span> فِي كُلِّ سُنبُلَةٍ{" "}
          <span style={{ color: C.gold }}>مِّائَةُ حَبَّةٍ</span> ۗ وَاللَّهُ يُضَاعِفُ لِمَن يَشَاءُ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ ﴿٢٦١﴾
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 230,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: logo,
          translate: `0px ${(1 - logo) * 20}px`,
        }}
      >
        <svg width={76} height={76} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={46} fill="none" stroke={C.gold} strokeWidth={3} />
          <path d="M58 26a20 20 0 1 0 14 32 17 17 0 0 1-14-32z" fill={C.gold} />
        </svg>
        <div>
          <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 64, color: C.gold, lineHeight: 1.1 }}>سَكينة</div>
          <div style={{ fontFamily: PLEX, fontSize: 34, color: C.sand }}>قصصٌ تُقرّبك من الله</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
