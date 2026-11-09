import React from "react";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { Bell, Bird, CalendarCheck, Check, EyeOff, HandCoins, Heart, MessageCircle, Mic, Sprout, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AMIRI, C, KUFI, PLEX } from "../theme";
import { Person, YUSUF } from "./Person";
import { camAt, END, Headline, IconBadge, IdeaBackdrop, k, N, PhotoCard, POP, REC_LEN, REC_START, Scene, useT, Vignette, win, World } from "./kit";

// ======================= LESSONS =======================
const Card: React.FC<{
  t: number;
  at: number;
  active: boolean;
  x: number;
  n: string;
  Icon: LucideIcon;
  title: string;
  quote?: string;
  quoteAt?: number;
  source?: string;
  sourceAt?: number;
  extra?: React.ReactNode;
}> = ({ t, at, active, x, n, Icon, title, quote, quoteAt = 0, source, sourceAt = 0, extra }) => {
  const s = k(t, [at, at + 0.5], [0, 1], POP);
  if (s <= 0) {
    const ph = k(t, [N(104.2), N(104.8)], [0, 1], POP);
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: 270,
          width: 540,
          height: 600,
          borderRadius: 30,
          border: "3px dashed rgba(217,178,95,0.35)",
          background: "rgba(14,34,41,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: ph * 0.94,
          opacity: ph,
          fontFamily: KUFI,
          fontWeight: 700,
          fontSize: 200,
          color: "rgba(217,178,95,0.22)",
        }}
      >
        {n}
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 270,
        width: 540,
        height: 600,
        borderRadius: 30,
        background: active ? "rgba(19,44,52,0.96)" : "rgba(14,34,41,0.8)",
        border: `3px solid ${active ? C.gold : "rgba(217,178,95,0.3)"}`,
        boxShadow: active ? "0 0 0 10px rgba(217,178,95,0.1), 0 30px 60px rgba(0,0,0,0.5)" : "0 20px 40px rgba(0,0,0,0.35)",
        scale: s * (active ? 1.04 : 0.96),
        opacity: active ? 1 : 0.55,
        direction: "rtl",
        padding: "50px 36px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        translate: `0px ${(1 - s) * 80}px`,
      }}
    >
      <div style={{ position: "absolute", top: 22, right: 28, fontFamily: KUFI, fontWeight: 700, fontSize: 54, color: "rgba(217,178,95,0.5)" }}>{n}</div>
      <div style={{ width: 150, height: 150, borderRadius: "50%", border: `3px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(217,178,95,0.08)" }}>
        <Icon size={84} color={C.gold} strokeWidth={1.7} />
      </div>
      <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 58, color: C.sand, textAlign: "center", lineHeight: 1.3 }}>{title}</div>
      {quote ? (
        <div style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 54, color: C.gold, textAlign: "center", lineHeight: 1.6, opacity: k(t, [quoteAt, quoteAt + 0.4], [0, 1]) }}>«{quote}»</div>
      ) : null}
      {source ? (
        <div
          style={{
            fontFamily: PLEX,
            fontWeight: 500,
            fontSize: 30,
            color: C.night,
            background: C.gold,
            borderRadius: 999,
            padding: "4px 22px",
            opacity: k(t, [sourceAt, sourceAt + 0.3], [0, 1]),
            scale: k(t, [sourceAt, sourceAt + 0.4], [0.5, 1], POP),
          }}
        >
          {source}
        </div>
      ) : null}
      {extra}
    </div>
  );
};

export const Lessons: React.FC = () => {
  const t = useT();
  const a = N(103.05);
  const b = N(124.6);
  const which = t < N(112.0) ? 0 : t < N(119.35) ? 1 : 2;
  const date = k(t, [N(116.9), N(117.6)], [0, 1]);
  return (
    <Scene a={a} b={b}>
      <IdeaBackdrop t={t} tint="#123238" />
      <Headline t={t} at={a + 0.05} until={b} words={["فماذا", "نتعلّم؟"]} y={k(t, [N(104.2), N(104.7)], [420, 70])} size={k(t, [N(104.2), N(104.7)], [130, 84])} gold={[1]} />
      <Card t={t} at={N(104.4)} active={which === 0} x={1300} n="١" Icon={HandCoins} title="الصدقةُ لا تُنقص المال" quote="ما نقصتْ صدقةٌ من مال" quoteAt={N(108.9)} source="رواه مسلم" sourceAt={N(111.1)} />
      <Card
        t={t}
        at={N(112.0)}
        active={which === 1}
        x={690}
        n="٢"
        Icon={Sprout}
        title="لا تحتقرِ القليل"
        quote="اتّقوا النارَ ولو بشِقِّ تمرة"
        quoteAt={N(116.0)}
        source="متّفقٌ عليه"
        sourceAt={N(118.4)}
        extra={
          <svg width={180} height={80} viewBox="0 0 180 80" style={{ opacity: k(t, [N(116.8), N(117.1)], [0, 1]) }}>
            <g transform={`translate(${90 - date * 22} 40) rotate(${-date * 12})`}>
              <path d="M 0 -26 C -30 -26 -40 0 -36 10 C -30 26 -10 28 0 26 Z" fill="#8A4B2A" />
            </g>
            <g transform={`translate(${90 + date * 22} 40) rotate(${date * 12})`}>
              <path d="M 0 -26 C 30 -26 40 0 36 10 C 30 26 10 28 0 26 Z" fill="#7A4024" />
            </g>
          </svg>
        }
      />
      <Card t={t} at={N(119.35)} active={which === 2} x={80} n="٣" Icon={Heart} title="خالصةً لله" quote="لا ليراكَ الناس" quoteAt={N(123.3)} />
      <Vignette strength={0.45} />
    </Scene>
  );
};

// ======================= CHALLENGE =======================
const DAYS = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const TYPED = "ماذا تغيّر في قلبي؟ أشعر براحة…";

export const Challenge: React.FC = () => {
  const t = useT();
  const a = N(124.6);
  const b = N(135.7);
  const typed = Math.floor(k(t, [N(133.8), N(135.4)], [0, TYPED.length], (x) => x));
  return (
    <Scene a={a} b={b}>
      <IdeaBackdrop t={t} tint="#163A40" />
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, direction: "rtl", opacity: win(t, a, b) }}>
        <Target size={84} color={C.gold} strokeWidth={1.8} style={{ scale: k(t, [a, a + 0.5], [0, 1], POP) }} />
        <span style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 96, color: C.sand }}>
          تحدّي <span style={{ color: C.gold }}>هذا الأسبوع</span>
        </span>
      </div>
      {/* 7 days */}
      <div style={{ position: "absolute", top: 270, left: 140, right: 140, display: "flex", justifyContent: "space-between", direction: "rtl" }}>
        {DAYS.map((d, i) => {
          const at = N(126.3) + i * 0.3;
          const s = k(t, [at - 0.4, at], [0, 1], POP);
          const done = k(t, [at + 0.15, at + 0.4], [0, 1], POP);
          return (
            <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, scale: s }}>
              <div
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: 30,
                  border: `3px solid ${done > 0.5 ? C.gold : "rgba(217,178,95,0.35)"}`,
                  background: done > 0.5 ? "rgba(217,178,95,0.14)" : "rgba(14,34,41,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <HandCoins size={78} color={C.gold} strokeWidth={1.6} />
                <div style={{ position: "absolute", top: -18, left: -18, width: 56, height: 56, borderRadius: "50%", background: C.emerald, border: `3px solid ${C.sand}`, display: "flex", alignItems: "center", justifyContent: "center", scale: done }}>
                  <Check size={32} color={C.sand} strokeWidth={3} />
                </div>
              </div>
              <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 34, color: C.sand }}>{d}</div>
            </div>
          );
        })}
      </div>
      <PhotoCard t={t} at={N(128.5)} until={N(129.6)} x={960} y={700} size={240} label="ولو بريال" />
      <IconBadge Icon={EyeOff} t={t} at={N(129.7)} until={N(131.5)} x={960} y={680} size={170} label="ولا تُخبرْ به أحداً" />
      <IconBadge Icon={CalendarCheck} t={t} at={N(126.2)} until={N(128.4)} x={960} y={700} size={140} label="كلَّ يوم" />
      {/* comment box */}
      <div
        style={{
          position: "absolute",
          left: 360,
          right: 360,
          top: 600,
          opacity: win(t, N(131.6), b),
          translate: `0px ${k(t, [N(131.6), N(132.1)], [60, 0])}px`,
          direction: "rtl",
          display: "flex",
          gap: 26,
          alignItems: "center",
          background: "rgba(239,228,207,0.97)",
          borderRadius: 26,
          padding: "26px 34px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ width: 86, height: 86, borderRadius: "50%", background: C.emerald, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <MessageCircle size={46} color={C.sand} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 30, color: "#5B6B6B" }}>أضف تعليقاً…</div>
          <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 46, color: C.night, minHeight: 60 }}>
            {TYPED.slice(0, typed)}
            <span style={{ opacity: Math.sin(t * 10) > 0 ? 1 : 0, color: C.emerald }}>|</span>
          </div>
        </div>
        <Heart size={56} color={C.clay} fill={t > N(135.3) ? C.clay : "none"} style={{ scale: k(t, [N(135.3), N(135.6)], [1, 1.4], POP) }} />
      </div>
      <Vignette strength={0.45} />
    </Scene>
  );
};

// ======================= RECITER + RECITATION =======================
const SEGMENTS: { text: string; a: number; b: number }[] = [
  { text: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ", a: 0.1, b: 6.0 },
  { text: "كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ", a: 6.0, b: 10.8 },
  { text: "فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ ۗ", a: 10.9, b: 15.1 },
  { text: "وَاللَّهُ يُضَاعِفُ لِمَن يَشَاءُ ۗ", a: 15.4, b: 19.1 },
  { text: "وَاللَّهُ وَاسِعٌ عَلِيمٌ ﴿٢٦١﴾", a: 19.3, b: 23.9 },
];

const Waveform: React.FC<{ active: boolean }> = ({ active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data = useAudioData(staticFile("recitation.wav"));
  const recFrame = Math.round(frame - REC_START * fps);
  let bars: number[] = Array.from({ length: 48 }, () => 0.04);
  if (data && active && recFrame >= 0) {
    const v = visualizeAudio({ fps, frame: recFrame, audioData: data, numberOfSamples: 64, smoothing: true });
    bars = v.slice(2, 50).map((x) => Math.min(1, Math.sqrt(x) * 2.2));
  }
  const mirrored = [...bars.slice().reverse(), ...bars];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 120 }}>
      {mirrored.map((v, i) => (
        <div key={i} style={{ width: 8, height: 8 + v * 110, borderRadius: 4, background: C.gold, opacity: 0.35 + v * 0.65 }} />
      ))}
    </div>
  );
};

export const Recitation: React.FC = () => {
  const t = useT();
  const a = N(135.7);
  const b = REC_START + REC_LEN + 0.6;
  const r = t - REC_START;
  const cam = camAt(t, [
    [a, 820, 640, 1.5],
    [REC_START, 900, 600, 1.15],
    [b, 960, 560, 1.05],
  ]);
  const card = k(t, [REC_START - 0.6, REC_START + 0.2], [0, 1]);
  return (
    <Scene a={a} b={b}>
      <World cam={cam} plate="bg/roof.jpg" plateFilter="brightness(0.55) saturate(0.85) blur(2px)">
        <Person look={YUSUF} x={820} y={985} scale={0.62} pose={{ facing: "front", seated: true, headTilt: 6, smile: 0.5, blink: (t % 3.3) / 3.3 > 0.95 ? 1 : 0 }} />
      </World>
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,13,16,0.35)" }} />
      {/* reciter name card */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: k(t, [REC_START - 0.6, REC_START + 0.2], [380, 70]),
          display: "flex",
          justifyContent: "center",
          opacity: win(t, a + 0.3, b, 0.4, 0.4),
          direction: "rtl",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26, background: "rgba(11,28,34,0.9)", border: `2px solid ${C.gold}`, borderRadius: 999, padding: "14px 40px 14px 18px" }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: C.emerald, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mic size={48} color={C.sand} />
          </div>
          <div>
            <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 52, color: C.gold, lineHeight: 1.2 }}>الشيخ مشاري راشد العفاسي</div>
            <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 30, color: C.sand }}>تلاوة · سورة البقرة · الآية ٢٦١</div>
          </div>
        </div>
      </div>
      {/* verse card */}
      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          top: 260,
          opacity: card * win(t, a, b, 0.1, 0.5),
          scale: 0.94 + card * 0.06,
          direction: "rtl",
          border: `2px solid ${C.gold}`,
          borderRadius: 30,
          background: "rgba(11,28,34,0.82)",
          padding: "40px 60px 30px",
          boxShadow: "0 0 0 12px rgba(217,178,95,0.07)",
        }}
      >
        <div style={{ fontFamily: AMIRI, fontSize: 70, lineHeight: 1.95, textAlign: "center", color: C.sand }}>
          {SEGMENTS.map((s, i) => {
            const on = r >= s.a && r <= s.b + 0.3;
            const done = r > s.b + 0.3;
            return (
              <span
                key={i}
                style={{
                  color: on ? C.gold : done ? C.sand : "rgba(239,228,207,0.4)",
                  textShadow: on ? "0 0 24px rgba(217,178,95,0.7)" : undefined,
                  marginInline: 8,
                }}
              >
                {s.text}{" "}
              </span>
            );
          })}
        </div>
        <Waveform active={r > 0 && r < REC_LEN} />
      </div>
      <Vignette strength={0.5} />
    </Scene>
  );
};

// ======================= OUTRO =======================
export const Outro: React.FC = () => {
  const t = useT();
  const a = REC_START + REC_LEN + 0.3;
  const b = END;
  const press = t > a + 1.6;
  return (
    <Scene a={a} b={b + 0.5}>
      <IdeaBackdrop t={t} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, direction: "rtl" }}>
        <svg width={150} height={150} viewBox="0 0 100 100" style={{ scale: k(t, [a, a + 0.6], [0, 1], POP) }}>
          <circle cx={50} cy={50} r={46} fill="none" stroke={C.gold} strokeWidth={3} />
          <path d="M58 26a20 20 0 1 0 14 32 17 17 0 0 1-14-32z" fill={C.gold} />
        </svg>
        <div style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 130, color: C.gold, lineHeight: 1 }}>سَكينة</div>
        <div style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 44, color: C.sand }}>قصصٌ تُقرّبك من الله</div>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: press ? "#3A3A3A" : "#C4302B",
            color: "#fff",
            borderRadius: 14,
            padding: "16px 40px",
            fontFamily: KUFI,
            fontWeight: 700,
            fontSize: 48,
            scale: k(t, [a + 0.6, a + 1.0], [0, 1], POP) * (t > a + 1.5 && t < a + 1.7 ? 0.92 : 1),
          }}
        >
          {press ? "تمّ الاشتراك" : "اشترك"}
          <Bell size={44} color="#fff" fill={t > a + 2.3 ? "#fff" : "none"} style={{ rotate: `${t > a + 2.3 && t < a + 3.0 ? Math.sin(t * 40) * 20 : 0}deg` }} />
        </div>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 16, opacity: k(t, [a + 2.6, a + 3.1], [0, 1]) }}>
          <Bird size={48} color={C.gold} />
          <span style={{ fontFamily: PLEX, fontWeight: 500, fontSize: 40, color: C.sand }}>
            الحلقة القادمة: <span style={{ color: C.gold }}>الطيرُ الذي لا يخزّن</span>
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: k(t, [b - 0.8, b], [0, 1]) }} />
      <Vignette />
    </Scene>
  );
};

