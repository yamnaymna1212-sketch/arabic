import React from "react";
import { BookOpen, Calculator, House, TrendingUp, Users, Wallet, Wheat } from "lucide-react";
import { C, KUFI, PLEX, AMIRI } from "../theme";
import { CHILD, Person, SALIM, YUSUF } from "./Person";
import {
  Bubble,
  camAt,
  Headline,
  IconBadge,
  IdeaBackdrop,
  IO,
  k,
  N,
  NameTag,
  PhotoCard,
  POP,
  rand,
  Scene,
  useT,
  Vignette,
  win,
  World,
} from "./kit";

const blinkAt = (t: number, seed = 0) => (((t + seed) % 3.1) / 3.1 > 0.955 ? 1 : 0);
const talk = (t: number, a: number, b: number) => (t > a && t < b ? Math.abs(Math.sin(t * 14)) : 0);

// ======================= HOOK =======================
export const Hook: React.FC = () => {
  const t = useT();
  const a = 0;
  const b = N(11.75);
  const count = Math.round(k(t, [N(2.8), N(3.9)], [1, 700], IO));
  const burst = k(t, [N(4.3), N(5.2)], [0, 1]);
  const punch = 1 + 0.06 * Math.exp(-((t - N(1.65)) ** 2) * 40) + 0.05 * Math.exp(-((t - N(4.35)) ** 2) * 40);
  return (
    <Scene a={a} b={b}>
      <div style={{ position: "absolute", inset: 0, scale: punch * k(t, [0, b], [1, 1.08], (x) => x) }}>
        <IdeaBackdrop t={t} />
        {/* light rays for "word of God" */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: win(t, N(5.9), N(9.2), 0.5, 0.5) * 0.9,
            background: `conic-gradient(from ${t * 8}deg at 50% 45%, rgba(217,178,95,0) 0deg, rgba(217,178,95,0.16) 12deg, rgba(217,178,95,0) 24deg, rgba(217,178,95,0) 45deg, rgba(217,178,95,0.12) 57deg, rgba(217,178,95,0) 70deg, rgba(217,178,95,0) 90deg, rgba(217,178,95,0.16) 102deg, rgba(217,178,95,0) 115deg, rgba(217,178,95,0) 180deg, rgba(217,178,95,0.14) 192deg, rgba(217,178,95,0) 205deg, rgba(217,178,95,0) 270deg, rgba(217,178,95,0.14) 282deg, rgba(217,178,95,0) 295deg)`,
          }}
        />
        <Headline t={t} at={0.15} until={N(1.5)} words={["ماذا", "لو", "قلتُ", "لك…"]} y={460} size={110} />
        <PhotoCard t={t} at={N(1.55)} until={N(5.0)} x={k(t, [N(2.6), N(3.0)], [960, 640], IO)} y={520} size={460} label="ريالٌ واحد" />
        {/* arrow + counter */}
        <div
          style={{
            position: "absolute",
            left: 1000,
            top: 380,
            width: 600,
            textAlign: "center",
            opacity: win(t, N(2.7), N(5.0), 0.2, 0.3),
            direction: "ltr",
          }}
        >
          <div
            style={{
              fontFamily: KUFI,
              fontWeight: 700,
              fontSize: 220,
              color: C.gold,
              lineHeight: 1,
              textShadow: `0 0 50px ${C.gold}88`,
              fontVariantNumeric: "tabular-nums",
              translate: `${Math.sin(t * 70) * 8 * burst * (1 - burst)}px 0px`,
            }}
          >
            {count}
            {t > N(4.3) ? "+" : "?"}
          </div>
          <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 64, color: C.sand, opacity: k(t, [N(4.3), N(4.6)], [0, 1]) }}>
            بل أكثر!
          </div>
        </div>
        {/* gold burst particles */}
        {burst > 0 && burst < 1 ? (
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 46 }, (_, i) => {
              const ang = rand(i) * Math.PI * 2;
              const d = 80 + rand(i + 7) * 520 * burst;
              return (
                <circle
                  key={i}
                  cx={1300 + Math.cos(ang) * d}
                  cy={500 + Math.sin(ang) * d}
                  r={3 + rand(i + 3) * 6}
                  fill="#FFE3A0"
                  opacity={1 - burst}
                />
              );
            })}
          </svg>
        ) : null}
        <IconBadge Icon={BookOpen} t={t} at={N(5.15)} until={N(7.7)} x={960} y={380} size={190} />
        <Headline t={t} at={N(5.15)} until={N(7.7)} words={["ليس", "هذا", "كلامي…"]} y={540} size={84} />
        <Headline t={t} at={N(6.4)} until={N(7.7)} words={["بل", "كلامُ", "الله"]} y={660} size={110} font="amiri" gold={[1, 2]} />
        {/* episode title */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: win(t, N(7.75), b, 0.3, 0.1),
            direction: "rtl",
          }}
        >
          <svg width={120} height={120} viewBox="0 0 100 100" style={{ scale: k(t, [N(7.75), N(8.3)], [0, 1], POP) }}>
            <circle cx={50} cy={50} r={46} fill="none" stroke={C.gold} strokeWidth={3} />
            <path d="M58 26a20 20 0 1 0 14 32 17 17 0 0 1-14-32z" fill={C.gold} />
          </svg>
          <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 40, color: C.gold, letterSpacing: 2 }}>سَكينة · الحلقة ١</div>
          <div
            style={{
              fontFamily: KUFI,
              fontWeight: 700,
              fontSize: 180,
              color: C.sand,
              lineHeight: 1.1,
              letterSpacing: k(t, [N(7.8), N(11.5)], [30, 0], (x) => x),
              textShadow: `0 0 60px ${C.gold}55`,
            }}
          >
            مَثَلُ <span style={{ color: C.gold }}>الحبّة</span>
          </div>
          <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 44, color: C.sand, opacity: k(t, [N(9.2), N(9.7)], [0, 1]) }}>
            يومٌ واحد مع يوسف
          </div>
        </div>
        <Vignette />
      </div>
    </Scene>
  );
};

// ======================= CITY =======================
export const City: React.FC = () => {
  const t = useT();
  const a = N(11.7);
  const b = N(14.85);
  const walkEnd = N(12.5);
  const yx = k(t, [a, walkEnd], [-80, 820], (x) => x);
  const walking = t < walkEnd;
  const cam = camAt(t, [
    [a, 980, 560, 1.02],
    [N(12.3), 900, 640, 1.18],
    [b, 860, 720, 1.42],
  ]);
  return (
    <Scene a={a} b={b}>
      <World
        cam={cam}
        plate="bg/city.jpg"
        html={
          <>
            <NameTag t={t} at={N(12.05)} until={b} x={yx + 170} y={720} name="يوسف" sub="٢٨ سنة · محاسب" />
            <IconBadge Icon={Users} t={t} at={N(12.8)} until={b} x={yx - 330} y={720} size={120} label="مثلُك ومثلي" />
          </>
        }
      >
        {/* birds */}
        {Array.from({ length: 6 }, (_, i) => {
          const bx = ((t - a) * (80 + i * 12) + i * 260) % 2200 - 200;
          const by = 160 + i * 28 + Math.sin(t * 3 + i) * 10;
          const f = Math.sin(t * 12 + i) * 8;
          return <path key={i} d={`M ${bx - 14} ${by - f} Q ${bx - 6} ${by - 4} ${bx} ${by} Q ${bx + 6} ${by - 4} ${bx + 14} ${by - f}`} stroke="#2B3A3E" strokeWidth={3} fill="none" />;
        })}
        <Person
          look={YUSUF}
          x={yx}
          y={1050}
          scale={0.62}
          pose={
            walking
              ? { facing: "right", walk: (t - a) * 9, walkAmp: 1, blink: blinkAt(t) }
              : {
                  facing: "front",
                  rightArm: k(t, [walkEnd, walkEnd + 0.3], [0, -130]) + Math.sin(t * 10) * 12 * win(t, walkEnd + 0.3, N(13.6), 0.1, 0.3),
                  smile: 0.8,
                  blink: blinkAt(t),
                }
          }
        />
      </World>
      <Vignette strength={0.35} />
    </Scene>
  );
};

// ======================= SOUQ =======================
export const Souq: React.FC = () => {
  const t = useT();
  const a = N(14.85);
  const b = N(24.9);
  const stop = N(16.6);
  const yx = k(t, [a, stop], [300, 1000], (x) => x);
  const walking = t < stop;
  const worried = k(t, [N(19.8), N(20.4)], [0, 1]);
  const cam = camAt(t, [
    [a, 700, 600, 1.08],
    [stop, 1060, 640, 1.15],
    [N(17.0), 1120, 700, 1.5],
    [N(19.7), 1120, 700, 1.55],
    [N(20.2), 1240, 640, 1.7],
    [b, 1260, 630, 1.8],
  ]);
  return (
    <Scene a={a} b={b}>
      <World cam={cam} plate="bg/souq.jpg">
        <Person
          look={YUSUF}
          x={yx}
          y={1010}
          scale={0.66}
          pose={
            walking
              ? { facing: "right", walk: (t - a) * 9, walkAmp: 1, blink: blinkAt(t) }
              : {
                  facing: "front",
                  rightArm: k(t, [stop, stop + 0.5, N(19.6), N(20)], [0, -35, -35, 0]),
                  smile: 0.2 - worried * 0.9,
                  headTilt: worried * 6,
                  headTurn: worried * Math.sin(t * 2.2) * 6,
                  blink: blinkAt(t, 1),
                }
          }
        />
      </World>
      <div style={{ position: "absolute", inset: 0, background: "rgba(80,30,20,0.18)", opacity: worried, mixBlendMode: "multiply" }} />
      {/* HUD */}
      <IconBadge Icon={Wallet} t={t} at={N(16.5)} until={N(18.5)} x={1400} y={430} size={130} label="ما بقيَ من الراتب" />
      {[0, 1, 2].map((i) => (
        <PhotoCard key={i} t={t} at={N(18.55) + i * 0.18} until={N(19.85)} x={1240 + i * 150} y={520 - (i === 1 ? 30 : 0)} size={170} rot={-10 + i * 10} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 1190,
          top: 680,
          width: 460,
          textAlign: "center",
          fontFamily: KUFI,
          fontWeight: 700,
          fontSize: 52,
          color: C.sand,
          background: "rgba(11,28,34,0.85)",
          borderRadius: 16,
          padding: "8px 0",
          opacity: win(t, N(18.6), N(19.85), 0.2, 0.2),
          direction: "rtl",
        }}
      >
        بضعةُ ريالاتٍ <span style={{ color: C.gold }}>فقط</span>
      </div>
      <IconBadge Icon={House} t={t} at={N(19.85)} until={b} x={1560} y={190} size={120} label="الإيجارُ قريب" ring={C.clay} color="#E8B59F" />
      <IconBadge Icon={TrendingUp} t={t} at={N(21.05)} until={b} x={1560} y={460} size={120} label="الأسعارُ ترتفع" ring={C.clay} color="#E8B59F" />
      <IconBadge Icon={Calculator} t={t} at={N(22.4)} until={b} x={1560} y={730} size={120} label="يحسبُ كلَّ ريال" />
      <Vignette strength={0.4 + worried * 0.2} />
    </Scene>
  );
};

// ======================= SHOP =======================
const COUNTER_TOP = 466;
export const Shop: React.FC = () => {
  const t = useT();
  const a = N(24.9);
  const b = N(46.55);
  const enterEnd = N(26.3);
  const yx = k(t, [a, enterEnd], [-60, 520], (x) => x);
  const walking = t < enterEnd;
  const runA = N(45.15);
  const cx = k(t, [runA, runA + 1.2], [1000, -200], (x) => x);
  const childRunning = t > runA;
  const childSad = k(t, [N(35.4), N(35.9)], [0, 1]) * (1 - k(t, [N(44.1), N(44.4)], [0, 1]));
  const give = k(t, [N(41.4), N(42.2)], [0, 1]) * (1 - k(t, [N(44.2), N(44.8)], [0, 1]));
  const fly = k(t, [N(42.4), N(43.1)], [0, 1], IO);
  const coinX = 711 + fly * (1010 - 711);
  const coinY = 749 + fly * (COUNTER_TOP - 6 - 749) - Math.sin(fly * Math.PI) * 120;
  const torn = k(t, [N(36.4), N(37.0)], [0, 1]) * (1 - k(t, [N(40.9), N(41.3)], [0, 1]));
  const cam = camAt(t, [
    [a, 900, 560, 1.0],
    [N(26.4), 860, 590, 1.08],
    [N(27.9), 860, 590, 1.08],
    [N(28.6), 1000, 640, 1.45],
    [N(30.3), 1000, 660, 1.55],
    [N(33.8), 1000, 660, 1.55],
    [N(34.4), 1000, 690, 2.1],
    [N(36.2), 1000, 700, 2.15],
    [N(36.6), 560, 600, 2.0],
    [N(40.9), 590, 600, 2.1],
    [N(41.4), 820, 620, 1.3],
    [N(42.8), 860, 600, 1.35],
    [N(43.15), 1010, 480, 2.4],
    [N(43.9), 1010, 500, 2.3],
    [N(44.3), 960, 640, 1.45],
    [b, 760, 620, 1.2],
  ]);
  const childCoins = Math.min(4, Math.max(1, Math.floor((t - N(30.5)) / 0.32) + 1));
  return (
    <Scene a={a} b={b}>
      <World cam={cam} plate="bg/shop.jpg">
        <defs>
          <clipPath id="behindCounter">
            <rect x={-500} y={-500} width={3000} height={COUNTER_TOP + 500} />
          </clipPath>
          <radialGradient id="coinGlow">
            <stop offset="0%" stopColor="#FFE3A0" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#FFE3A0" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g clipPath="url(#behindCounter)">
          <Person
            look={SALIM}
            x={1330}
            y={650}
            scale={0.56}
            pose={{
              facing: "front",
              rightArm: k(t, [N(25.8), N(26.1)], [0, -120]) * (1 - k(t, [N(27.2), N(27.6)], [0, 1])) + Math.sin(t * 10) * 10 * win(t, N(26.1), N(27.2)),
              smile: 0.7 + 0.3 * k(t, [N(44.1), N(44.5)], [0, 1]),
              mouth: talk(t, N(25.9), N(26.9)),
              blink: blinkAt(t, 2),
              headTurn: t > N(28) ? -8 : 0,
            }}
          />
        </g>
        <Person
          look={CHILD}
          x={childRunning ? cx : 1000}
          y={905}
          scale={0.42}
          pose={
            childRunning
              ? { facing: "left", walk: (t - runA) * 16, walkAmp: 1.3, smile: 1 }
              : {
                  facing: "front",
                  rightArm: k(t, [N(30.3), N(30.6)], [0, -45]) * (1 - k(t, [N(33.5), N(33.8)], [0, 1])),
                  leftArm: k(t, [N(30.3), N(30.6)], [0, 45]) * (1 - k(t, [N(33.5), N(33.8)], [0, 1])),
                  headTilt: k(t, [N(33.9), N(34.4)], [0, -8]) * (1 - childSad) + childSad * 12,
                  smile: -childSad * 0.9 + k(t, [N(44.1), N(44.4)], [0, 1]) * 1.2,
                  blink: blinkAt(t, 0.7),
                }
          }
        />
        {Array.from({ length: 10 }, (_, i) => {
          const p = k(t, [N(44.1) + i * 0.04, N(44.9) + i * 0.04], [0, 1]);
          if (p <= 0 || p >= 1) return null;
          const ang = (i / 10) * Math.PI * 2;
          return <circle key={i} cx={1000 + Math.cos(ang) * 110 * p} cy={640 + Math.sin(ang) * 110 * p} r={6} fill="#FFE3A0" opacity={1 - p} />;
        })}
        <Person
          look={YUSUF}
          x={yx}
          y={1010}
          scale={0.66}
          pose={
            walking
              ? { facing: "right", walk: (t - a) * 9, walkAmp: 1, blink: blinkAt(t) }
              : {
                  facing: "front",
                  rightArm: -give * 62 + k(t, [N(26.3), N(26.6)], [0, -30]) * (1 - k(t, [N(27.2), N(27.5)], [0, 1])),
                  headTurn: torn > 0 ? Math.sin(t * 5) * 8 : 6,
                  smile: 0.3 - torn * 0.8 + k(t, [N(44.2), N(44.6)], [0, 0.6]),
                  headTilt: torn * 5,
                  blink: blinkAt(t, 1.4),
                }
          }
        />
        {t > N(41.9) && t < b ? (
          <g transform={`translate(${coinX} ${coinY})`}>
            <circle r={60} fill="url(#coinGlow)" opacity={k(t, [N(43.0), N(43.4)], [0, 1])} />
            <ellipse rx={20} ry={fly > 0.99 ? 8 : 20} fill="#C9C9C4" stroke="#8E8E88" strokeWidth={2} />
            <ellipse rx={13} ry={fly > 0.99 ? 5 : 13} fill={C.gold} stroke="#B88B3A" strokeWidth={1.5} />
          </g>
        ) : null}
      </World>
      <div style={{ position: "absolute", inset: 0, opacity: torn * 0.8, background: "radial-gradient(70% 70% at 40% 45%, rgba(0,0,0,0) 50%, rgba(140,40,25,0.55) 100%)" }} />
      {/* HUD */}
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 110,
          opacity: win(t, N(26.6), N(33.7), 0.2, 0.3),
          scale: k(t, [N(26.6), N(27.0)], [0, 1], POP),
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "rgba(11,28,34,0.9)",
          border: `3px solid ${C.gold}`,
          borderRadius: 20,
          padding: "12px 30px",
          direction: "rtl",
        }}
      >
        <Wheat size={60} color={C.gold} />
        <span style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 58, color: C.sand }}>
          الخبز = <span style={{ color: C.gold }}>5</span> ريال
        </span>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <PhotoCard key={i} t={t} at={N(30.5) + i * 0.32} until={N(33.8)} x={720 + i * 160} y={330} size={140} rot={-6 + i * 4} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 660,
          width: 600,
          top: 130,
          textAlign: "center",
          fontFamily: KUFI,
          fontWeight: 700,
          fontSize: 60,
          color: t > N(32.0) ? "#F09A7E" : C.sand,
          opacity: win(t, N(30.5), N(33.8), 0.2, 0.3),
          direction: "rtl",
          translate: `${t > N(32.0) && t < N(32.9) ? Math.sin(t * 60) * 8 : 0}px 0px`,
          textShadow: "0 4px 20px rgba(0,0,0,0.7)",
        }}
      >
        {t > N(32.0) ? (
          <>
            <span style={{ direction: "ltr", display: "inline-block" }}>4 / 5</span> · ينقصُه ريال!
          </>
        ) : (
          `${childCoins} ${childCoins > 2 ? "ريالات" : "ريال"}`
        )}
      </div>
      <Bubble t={t} at={N(37.9)} until={N(41.0)} x={1420} y={300} tx={1060} ty={440} color={C.clay} shake={k(t, [N(39.6), N(39.8)], [0, 1]) * (1 - k(t, [N(40.6), N(40.8)], [0, 1]))} w={620}>
        أنتَ أحوجُ إليه!
      </Bubble>
      <Vignette strength={0.35} />
    </Scene>
  );
};

// ======================= WALK BACK =======================
export const WalkBack: React.FC = () => {
  const t = useT();
  const a = N(46.55);
  const b = N(54.6);
  const yx = k(t, [a, N(51.7)], [1500, 760], (x) => x);
  const walking = t < N(51.7);
  const godLight = k(t, [N(51.8), N(52.8)], [0, 1]);
  const cam = camAt(t, [
    [a, 1300, 600, 1.2],
    [N(51.7), 820, 620, 1.3],
    [N(52.4), 800, 560, 1.15, -1.5],
    [b, 800, 520, 1.05, -2],
  ]);
  return (
    <Scene a={a} b={b} dir={-1}>
      <World cam={cam} plate="bg/souq.jpg" plateFilter={`sepia(0.35) saturate(0.8) brightness(${0.78 + godLight * 0.15})`}>
        <defs>
          <linearGradient id="beam" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFE9B8" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#FFE9B8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d="M 640 -300 L 980 -300 L 1180 1100 L 380 1100 Z" fill="url(#beam)" opacity={godLight * 0.75} />
        {Array.from({ length: 24 }, (_, i) => {
          if (godLight <= 0) return null;
          const p = ((t - N(51.8)) * 0.25 + rand(i)) % 1;
          return <circle key={i} cx={560 + rand(i + 4) * 500} cy={1000 - p * 1000} r={3 + rand(i + 9) * 3} fill="#FFE3A0" opacity={godLight * Math.sin(p * Math.PI)} />;
        })}
        <Person
          look={YUSUF}
          x={yx}
          y={1010}
          scale={0.66}
          pose={
            walking
              ? { facing: "left", walk: (t - a) * 6.5, walkAmp: 0.8, blink: blinkAt(t), headTilt: 6 }
              : { facing: "front", smile: godLight * 0.5, headTilt: -godLight * 9, headTurn: 0, blink: blinkAt(t) }
          }
        />
      </World>
      <Bubble t={t} at={N(48.0)} until={N(51.7)} x={1380} y={290} tx={1060} ty={420} w={460}>
        <span style={{ color: C.clay, direction: "ltr", display: "inline-block" }}>−1</span>&nbsp;ريال
      </Bubble>
      <IconBadge Icon={Calculator} t={t} at={N(50.4)} until={N(51.75)} x={560} y={330} size={120} label="هكذا نحسبُها نحن" />
      <Headline t={t} at={N(51.85)} until={b} words={["لكنّ", "اللهَ", "يحسبُها", "بطريقةٍ", "أخرى", "تماماً"]} y={110} size={96} gold={[1, 4, 5]} step={0.2} />
      <Vignette strength={0.45} />
    </Scene>
  );
};

// ======================= ROOFTOP =======================
export const Roof: React.FC = () => {
  const t = useT();
  const a = N(54.6);
  const b = N(62.25);
  const book = k(t, [N(55.6), N(56.4)], [0, 1]);
  const glow = k(t, [N(57.2), N(58.4)], [0, 1]);
  const cam = camAt(t, [
    [a, 960, 520, 1.0],
    [N(56.6), 860, 600, 1.25],
    [N(58.0), 820, 640, 1.7],
    [N(60.2), 820, 610, 1.9],
    [b, 820, 560, 2.6],
  ]);
  return (
    <Scene a={a} b={b} flashIn>
      <World
        cam={cam}
        plate="bg/roof.jpg"
        html={
          <div
            style={{
              position: "absolute",
              left: 560,
              top: 330,
              width: 520,
              textAlign: "center",
              direction: "rtl",
              opacity: win(t, N(58.3), b, 0.4, 0.2),
              translate: `0px ${k(t, [N(58.3), N(59)], [20, 0])}px`,
            }}
          >
            <div style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 54, color: C.gold, textShadow: "0 0 20px rgba(217,178,95,0.8)" }}>سورة البقرة</div>
            <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 30, color: C.sand }}>الآية ٢٦١</div>
          </div>
        }
      >
        <defs>
          <radialGradient id="bookGlow">
            <stop offset="0%" stopColor="#FFE3A0" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#FFE3A0" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={820} cy={720} r={260} fill="url(#bookGlow)" opacity={glow * (0.8 + 0.2 * Math.sin(t * 3))} />
        <Person
          look={YUSUF}
          x={820}
          y={985}
          scale={0.62}
          pose={{
            facing: "front",
            seated: true,
            holdBook: book,
            headTilt: 8 - k(t, [N(60.2), N(60.8)], [0, 6]),
            smile: k(t, [N(60.2), N(61)], [0, 0.6]),
            blink: blinkAt(t, 0.4),
          }}
        />
        {Array.from({ length: 30 }, (_, i) => {
          const p = ((t - N(57.2)) * 0.35 + rand(i)) % 1;
          if (glow <= 0) return null;
          return <circle key={i} cx={820 + (rand(i + 1) - 0.5) * 300 + Math.sin(p * 8 + i) * 14} cy={740 - p * 600} r={2 + rand(i + 2) * 3} fill="#FFE3A0" opacity={glow * Math.sin(p * Math.PI)} />;
        })}
      </World>
      <div style={{ position: "absolute", inset: 0, background: "#FFF3D6", opacity: k(t, [b - 0.5, b], [0, 0.85], (x) => x * x) }} />
      <Vignette strength={0.45} />
    </Scene>
  );
};

