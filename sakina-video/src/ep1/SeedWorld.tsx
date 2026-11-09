import React from "react";
import { Img, staticFile } from "remotion";
import { Eye, Gift, Infinity as InfinityIcon } from "lucide-react";
import { AMIRI, C, KUFI, PLEX } from "../theme";
import { GRAINS, HEAD_LEN, makeStalk, stalkLength, WheatHead } from "../Wheat";
import { camAt, Headline, IconBadge, IdeaBackdrop, IO, k, N, PhotoCard, POP, rand, Scene, useT, Vignette, win, World } from "./kit";

const GROUND = 840;
const SEED = { x: 1180, y: GROUND - 6 };
const STALKS = Array.from({ length: 7 }, (_, i) => makeStalk(SEED.x, GROUND, -30 + i * 10, 470 - Math.abs(i - 3) * 26));
const MID = STALKS[3];
const ZOOM = 3.4;
const FOCUS = { x: MID.tx, y: MID.ty - HEAD_LEN / 2 };
const ANCHOR = { x: FOCUS.x + (1420 - 960) / ZOOM, y: FOCUS.y };

const POP_A = N(77.0);
const POP_B = N(79.6);
const popTime = (i: number) => POP_A + (i / 100) * (POP_B - POP_A);

const FIELD = Array.from({ length: 70 }, (_, i) => {
  const depth = rand(i + 300); // 0 near .. 1 far
  const x = -900 + rand(i + 400) * 3700;
  const s = makeStalk(Math.abs(x - SEED.x) < 160 ? x + 340 : x, GROUND - depth * 140, -14 + rand(i + 500) * 28, (200 + rand(i + 600) * 260) * (1 - depth * 0.55), 0.05);
  return { s, start: N(88.4) + rand(i + 700) * 6.5, scale: (0.5 + rand(i + 800) * 0.35) * (1 - depth * 0.5), depth };
});

export const SeedWorld: React.FC = () => {
  const t = useT();
  const a = N(62.25);
  const b = N(103.05);

  const cam = camAt(
    t,
    [
      [a, 960, 540, 1.15],
      [N(68.3), 1060, 560, 1.0],
      [N(70.6), 1120, 640, 1.2],
      [N(71.9), 1120, 640, 1.2],
      [N(73.3), 1080, 560, 1.0],
      [N(75.2), 1080, 560, 1.0],
      [N(76.3), FOCUS.x, FOCUS.y, ZOOM],
      [N(79.8), FOCUS.x, FOCUS.y, ZOOM * 1.05],
      [N(80.6), 1060, 560, 1.0],
      [N(86.4), 1080, 540, 1.0],
      [N(90.4), 1060, 480, 0.82],
      [N(96.0), 1000, 420, 0.6],
      [N(98.7), 980, 460, 0.7],
      [b, 980, 480, 0.75],
    ],
    0.6,
  );

  // riyal -> seed
  const morph = k(t, [N(69.6), N(70.3)], [0, 1]);
  const seedIn = k(t, [N(69.9), N(70.4)], [0, 1], POP);
  const drop = k(t, [N(70.7), N(71.3)], [0, 1], (x) => x * x);
  const sink = k(t, [N(71.3), N(71.9)], [0, 14]);
  const seedY = 520 + drop * (SEED.y - 520) + sink;
  const pulse = 1 + 0.08 * Math.sin(t * 4) + k(t, [N(85.0), N(85.4), N(86.6)], [0, 0.7, 0.1]);

  const stalkStart = (i: number) => N(73.3) + Math.abs(i - 3) * 0.14;
  const sprout = k(t, [N(72.1), N(73.0)], [0, 1]);
  const headFill = (i: number) => {
    if (i === 3) return (g: number) => k(t, [popTime(g), popTime(g) + 0.16], [0, 1], POP);
    const s = N(80.7) + Math.abs(i - 3) * 0.12;
    return (g: number) => k(t, [s + g * 0.005, s + g * 0.005 + 0.15], [0, 1]);
  };
  const popped = Math.max(0, Math.min(100, Math.floor(((t - POP_A) / (POP_B - POP_A)) * 100) + 1));
  const zoomHud = win(t, N(76.2), N(80.0), 0.3, 0.3);
  const threads = win(t, N(77.0), N(80.2), 0.3, 0.4) * 0.85;
  const eqCount = Math.round(k(t, [N(83.3), N(84.4)], [0, 700]));
  const fieldCount = Math.round(k(t, [N(90.6), N(95.8)], [700, 70000], (x) => x * x * x));
  const flashback = win(t, N(100.6), b, 0.4, 0.3);

  return (
    <Scene a={a} b={b} flashIn>
      <IdeaBackdrop t={t} tint="#163A40" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: win(t, a, N(68.6), 0.4, 0.6) * 0.9,
          background: `conic-gradient(from ${t * 8}deg at 50% 40%, rgba(217,178,95,0) 0deg, rgba(217,178,95,0.15) 12deg, rgba(217,178,95,0) 24deg, rgba(217,178,95,0) 60deg, rgba(217,178,95,0.12) 72deg, rgba(217,178,95,0) 84deg, rgba(217,178,95,0) 150deg, rgba(217,178,95,0.15) 162deg, rgba(217,178,95,0) 174deg, rgba(217,178,95,0) 240deg, rgba(217,178,95,0.12) 252deg, rgba(217,178,95,0) 264deg, rgba(217,178,95,0) 300deg, rgba(217,178,95,0.14) 312deg, rgba(217,178,95,0) 324deg)`,
        }}
      />
      <World
        cam={cam}
        html={
          <>
            <PhotoCard t={t} at={N(68.45)} until={N(70.1)} x={SEED.x} y={520} size={300} rot={-3} />
            {/* "100" counter while zoomed */}
          </>
        }
      >
        <defs>
          <radialGradient id="grainGlow">
            <stop offset="0%" stopColor={C.gold} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="seedGlow2">
            <stop offset="0%" stopColor="#FFE3A0" stopOpacity={0.9} />
            <stop offset="45%" stopColor={C.gold} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="soil" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10272D" />
            <stop offset="100%" stopColor="#050D10" />
          </linearGradient>
        </defs>
        <rect x={-4000} y={GROUND} width={9000} height={3000} fill="url(#soil)" />
        <line x1={-4000} y1={GROUND} x2={5000} y2={GROUND} stroke={C.sand} strokeOpacity={0.2} strokeWidth={2} />

        {/* endless field (God multiplies) */}
        {FIELD.map((f, i) => {
          const p = k(t, [f.start, f.start + 0.9], [0, 1]);
          if (p <= 0) return null;
          const s = f.s;
          const L = stalkLength(s);
          return (
            <g key={i} opacity={0.75 - f.depth * 0.45}>
              <path d={`M ${s.bx} ${s.by} Q ${s.cx} ${s.cy} ${s.tx} ${s.ty}`} stroke={C.goldDeep} strokeWidth={2.4} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
              <g transform={`translate(${s.tx} ${s.ty}) rotate(${s.angle}) scale(${f.scale})`}>
                <WheatHead grow={k(t, [f.start + 0.7, f.start + 1.2], [0, 1], POP)} shown={100} />
              </g>
            </g>
          );
        })}

        {/* threads seed -> heads */}
        {STALKS.map((s, i) => {
          const p = k(t, [N(85.0) + i * 0.05, N(85.9) + i * 0.05], [0, 1]);
          const o = win(t, N(85.0), N(88.6), 0.3, 0.6);
          if (o <= 0) return null;
          const a2 = (s.angle * Math.PI) / 180;
          const hx = s.tx + Math.sin(a2) * 75;
          const hy = s.ty - Math.cos(a2) * 75;
          return (
            <path
              key={i}
              d={`M ${SEED.x} ${SEED.y} Q ${SEED.x + (hx - SEED.x) * 1.7} ${GROUND - 180} ${hx} ${hy}`}
              stroke="#F3D58F"
              strokeWidth={2.4}
              fill="none"
              strokeDasharray={1100}
              strokeDashoffset={1100 * (1 - p)}
              opacity={o}
            />
          );
        })}

        {/* sprout */}
        {sprout > 0 && t < N(73.8) ? (
          <path d={`M ${SEED.x} ${GROUND} q 4 -40 0 -70`} stroke="#8FB47A" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={80} strokeDashoffset={80 * (1 - sprout)} opacity={k(t, [N(73.4), N(73.8)], [1, 0])} />
        ) : null}

        {/* seven stalks */}
        {STALKS.map((s, i) => {
          const st = stalkStart(i);
          const p = k(t, [st, st + 0.8], [0, 1]);
          if (p <= 0) return null;
          const L = stalkLength(s);
          const grow = k(t, [st + 0.65, st + 1.1], [0, 1], POP);
          const a2 = (s.angle * Math.PI) / 180;
          const nb = k(t, [st + 0.9, st + 1.2], [0, 1], POP) * (1 - k(t, [N(75.0), N(75.4)], [0, 1]));
          const badge = k(t, [N(81.0) + i * 0.1, N(81.4) + i * 0.1], [0, 1], POP) * (1 - k(t, [N(86.2), N(86.8)], [0, 1]));
          const bx = s.tx + Math.sin(a2) * 200;
          const by = s.ty - Math.cos(a2) * 200;
          const lx = s.bx + (s.tx - s.bx) * 0.35;
          const ly = s.by + (s.ty - s.by) * 0.35;
          const leaf = k(t, [st + 0.35, st + 0.8], [0, 1]);
          return (
            <g key={i}>
              <path d={`M ${s.bx} ${s.by} Q ${s.cx} ${s.cy} ${s.tx} ${s.ty}`} stroke={C.gold} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
              {leaf > 0 ? (
                <path d={`M ${lx} ${ly} q ${i < 3 ? -40 : 40} -30 ${i < 3 ? -70 : 70} -10`} stroke={C.goldDeep} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeDasharray={90} strokeDashoffset={90 * (1 - leaf)} />
              ) : null}
              <g transform={`translate(${s.tx} ${s.ty}) rotate(${s.angle})`}>
                <WheatHead grow={grow} pop={headFill(i)} glow={i === 3 ? zoomHud * 0.9 : 0} />
              </g>
              {nb > 0 ? (
                <g transform={`translate(${s.tx + Math.sin(a2) * 200} ${s.ty - Math.cos(a2) * 200}) scale(${nb})`}>
                  <circle r={26} fill={C.night} stroke={C.gold} strokeWidth={2.5} />
                  <text y={11} textAnchor="middle" fontFamily={KUFI} fontWeight={700} fontSize={30} fill={C.gold}>
                    {i + 1}
                  </text>
                </g>
              ) : null}
              {badge > 0 ? (
                <g transform={`translate(${bx} ${by}) scale(${badge})`}>
                  <rect x={-48} y={-24} width={96} height={48} rx={24} fill={C.night} stroke={C.gold} strokeWidth={2} />
                  <text y={11} textAnchor="middle" fontFamily={KUFI} fontWeight={700} fontSize={30} fill={C.gold}>
                    100
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}

        {/* grain threads */}
        {threads > 0 ? (
          <g opacity={threads}>
            {GRAINS.map((g) => {
              const p = k(t, [popTime(g.index), popTime(g.index) + 0.3], [0, 1]);
              if (p <= 0) return null;
              const gx = MID.tx + g.x;
              const gy = MID.ty + g.y;
              return <line key={g.index} x1={gx} y1={gy} x2={gx + (ANCHOR.x - gx) * p} y2={gy + (ANCHOR.y - gy) * p} stroke="#F3D58F" strokeWidth={0.35} opacity={0.6} />;
            })}
            <circle cx={ANCHOR.x} cy={ANCHOR.y} r={2.4} fill="#FFE3A0" />
          </g>
        ) : null}

        {/* the seed */}
        {seedIn > 0 ? (
          <g transform={`translate(${SEED.x} ${seedY})`}>
            <circle r={90 * pulse} fill="url(#seedGlow2)" opacity={k(t, [N(73.2), N(74.2)], [1, 0.35])} />
            <path d="M 0 -18 C 11 -11 12 7 0 16 C -12 7 -11 -11 0 -18 Z" fill={C.gold} stroke="#F6DC9C" strokeWidth={1.5} transform={`scale(${seedIn * pulse * (1.6 - morph * 0.6)})`} />
          </g>
        ) : null}
        {/* dust when the seed lands */}
        {Array.from({ length: 12 }, (_, i) => {
          const p = k(t, [N(71.25), N(72.0)], [0, 1]);
          if (p <= 0 || p >= 1) return null;
          const ang = -Math.PI * (0.1 + 0.8 * rand(i + 900));
          const d = 30 + rand(i + 950) * 60;
          return <circle key={i} cx={SEED.x + Math.cos(ang) * d * p} cy={GROUND + Math.sin(ang) * d * p + 60 * p * p} r={3.5} fill="#7B6650" opacity={1 - p} />;
        })}
        {/* rising gold while multiplying */}
        {Array.from({ length: 60 }, (_, i) => {
          const st = N(88.6) + rand(i + 1000) * 9;
          const p = (t - st) / 3.5;
          if (p <= 0 || p >= 1) return null;
          return <circle key={i} cx={-500 + rand(i + 1100) * 3000} cy={GROUND - 40 - p * 900} r={2 + rand(i + 1200) * 3} fill="#FFE3A0" opacity={Math.sin(p * Math.PI) * 0.8} />;
        })}
      </World>

      {/* ---------- HUD ---------- */}
      {/* ayah being read, left panel */}
      <div
        style={{
          position: "absolute",
          left: k(t, [N(67.9), N(68.6)], [210, 70], IO),
          top: k(t, [N(67.9), N(68.6)], [250, 120], IO),
          width: k(t, [N(67.9), N(68.6)], [1500, 820], IO),
          textAlign: "center",
          direction: "rtl",
          opacity: win(t, a + 0.2, N(75.1), 0.3, 0.3),
        }}
      >
        <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 36, color: C.gold, marginBottom: 10 }}>سورة البقرة · ٢٦١</div>
        <div style={{ fontFamily: AMIRI, fontSize: k(t, [N(67.9), N(68.6)], [100, 58], IO), lineHeight: 1.8, color: C.sand, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
          {[
            ["مَّثَلُ", 63.87],
            ["الَّذِينَ", 64.2],
            ["يُنفِقُونَ", 64.75],
            ["أَمْوَالَهُمْ", 65.38],
            ["فِي", 66.04],
            ["سَبِيلِ", 66.24],
            ["اللَّهِ", 66.6],
            ["كَمَثَلِ", 67.28],
            ["حَبَّةٍ", 67.77],
            ["أَنبَتَتْ", 73.3],
            ["سَبْعَ", 73.93],
            ["سَنَابِلَ", 74.25],
          ].map(([w, s], i) => (
            <span
              key={i}
              style={{
                opacity: k(t, [N(s as number), N(s as number) + 0.3], [0.18, 1]),
                color: i >= 7 && t > N(s as number) ? C.gold : undefined,
                marginInline: 8,
              }}
            >
              {w as string}{" "}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 20, fontFamily: KUFI, fontWeight: 700, fontSize: 120, color: C.gold, opacity: k(t, [N(74.0), N(74.3)], [0, 1]), lineHeight: 1 }}>
          7 <span style={{ fontSize: 60, color: C.sand }}>سنابل</span>
        </div>
      </div>

      <Headline t={t} at={N(68.4)} until={N(70.6)} words={["تخيّل", "ريالَ", "يوسف…"]} x={560} y={300} size={80} width={900} gold={[1]} />
      <Headline t={t} at={N(69.6)} until={N(71.8)} words={["حبّةً", "صغيرة"]} x={560} y={420} size={96} width={900} gold={[0]} />
      <Headline t={t} at={N(75.2)} until={N(76.6)} words={["اقتربْ", "أكثر…"]} x={960} y={110} size={84} />

      {zoomHud > 0 ? (
        <div style={{ position: "absolute", left: 1290, top: 380, width: 360, textAlign: "center", opacity: zoomHud, direction: "rtl" }}>
          <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 200, color: C.gold, lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: `0 0 40px ${C.gold}88` }}>
            {t < POP_A ? 0 : popped}
          </div>
          <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 52, color: C.sand, marginTop: 8 }}>حبّة في سنبلة واحدة</div>
        </div>
      ) : null}
      {zoomHud > 0 ? (
        <div style={{ position: "absolute", left: 140, top: 140, width: 640, direction: "rtl", opacity: zoomHud, fontFamily: AMIRI, fontWeight: 700, fontSize: 72, lineHeight: 1.6, color: C.sand }}>
          فِي كُلِّ سُنبُلَةٍ <span style={{ color: C.gold }}>مِّائَةُ حَبَّةٍ</span>
        </div>
      ) : null}

      {/* 7 x 100 = 700 */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 230,
          width: 760,
          opacity: win(t, N(80.8), N(86.6), 0.3, 0.4),
          direction: "ltr",
          textAlign: "center",
          fontFamily: KUFI,
          fontWeight: 700,
        }}
      >
        <div style={{ fontSize: 130, color: C.sand, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26 }}>
          <span style={{ opacity: k(t, [N(81.0), N(81.3)], [0, 1]), scale: k(t, [N(81.0), N(81.4)], [0.4, 1], POP) }}>7</span>
          <span style={{ opacity: k(t, [N(82.1), N(82.4)], [0, 1]), color: C.gold, fontSize: 90 }}>×</span>
          <span style={{ opacity: k(t, [N(82.3), N(82.6)], [0, 1]), scale: k(t, [N(82.3), N(82.7)], [0.4, 1], POP) }}>100</span>
        </div>
        <div style={{ fontSize: 190, color: C.gold, lineHeight: 1.1, opacity: k(t, [N(83.2), N(83.5)], [0, 1]), textShadow: `0 0 50px ${C.gold}99`, fontVariantNumeric: "tabular-nums" }}>
          = {eqCount}
        </div>
        <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 54, color: C.sand, direction: "rtl", opacity: k(t, [N(85.0), N(85.4)], [0, 1]) }}>
          من <span style={{ color: C.gold }}>حبّةٍ واحدة!</span>
        </div>
      </div>

      {/* God multiplies */}
      <Headline t={t} at={N(88.4)} until={N(96.1)} words={["وَاللَّهُ", "يُضَاعِفُ", "لِمَن", "يَشَاءُ"]} y={90} size={110} font="amiri" gold={[0, 1, 2, 3]} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 250,
          textAlign: "center",
          fontFamily: KUFI,
          fontWeight: 700,
          fontSize: 120,
          color: C.sand,
          direction: "ltr",
          fontVariantNumeric: "tabular-nums",
          opacity: win(t, N(90.6), N(94.3), 0.3, 0.3),
          textShadow: "0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        {fieldCount.toLocaleString("en-US")}+
      </div>
      <IconBadge Icon={InfinityIcon} t={t} at={N(94.3)} until={N(96.1)} x={960} y={380} size={170} label="أضعافاً لا يعلمها إلا هو" />
      <Headline t={t} at={N(96.3)} until={b} words={["وَاللَّهُ", "وَاسِعٌ", "عَلِيمٌ"]} y={90} size={120} font="amiri" gold={[1, 2]} step={0.3} />
      <IconBadge Icon={Gift} t={t} at={N(98.9)} until={b} x={1500} y={420} size={140} label="واسعُ العطاء" />
      <IconBadge Icon={Eye} t={t} at={N(100.0)} until={b} x={420} y={420} size={140} label="عليمٌ بنيّتك" />
      {flashback > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 960 - 190,
            top: 330,
            width: 380,
            height: 380,
            borderRadius: "50%",
            overflow: "hidden",
            border: `4px solid ${C.gold}`,
            opacity: flashback,
            scale: k(t, [N(100.6), N(101.1)], [0.5, 1], POP),
            boxShadow: "0 0 60px rgba(217,178,95,0.5)",
          }}
        >
          <Img src={staticFile("bg/shop.jpg")} style={{ position: "absolute", width: 2400 * 0.55, left: -480, top: -150, filter: "sepia(0.6) brightness(0.85)" }} />
          <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", fontFamily: KUFI, fontWeight: 700, fontSize: 36, color: C.sand, textShadow: "0 2px 10px #000" }}>
            لم يرَه أحد…
          </div>
        </div>
      ) : null}
      <Vignette strength={0.5} />
    </Scene>
  );
};

