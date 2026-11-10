import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BAR, BODY, C, Card, DISPLAY, money, pop, prog, ThemeCtx, useT, W, win } from "./lib";

const center: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/** Big centered words that replace each other ("NO CALL." → "NO WARNING."). */
export const BigWords: React.FC<{ items: { at: number; to: number; text: string; color?: string; size?: number }[]; dx?: number }> = ({
  items,
  dx = 0,
}) => {
  const t = useT();
  return (
    <>
      {items.map((it, i) => (
        <div key={i} style={{ ...center, ...pop(t, it.at, it.to), left: dx }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: it.size ?? 190,
              color: it.color ?? C.paper,
              letterSpacing: 2,
              textShadow: "0 10px 50px rgba(0,0,0,0.75)",
              textAlign: "center",
              lineHeight: 0.95,
            }}
          >
            {it.text}
          </div>
        </div>
      ))}
    </>
  );
};

/** Row of question cards (POLICE? THE CAR? THE DEBT?). */
export const QuestionRow: React.FC<{ a: number; b: number; items: { at: number; text: string }[] }> = ({ a, b, items }) => {
  const t = useT();
  return (
    <div style={{ ...center, gap: 36, opacity: win(t, a, b) }}>
      {items.map((it, i) => (
        <Card key={i} style={{ padding: "34px 46px", ...pop(t, it.at, b + 1) }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 96, color: C.gold, letterSpacing: 2 }}>{it.text}</div>
        </Card>
      ))}
    </div>
  );
};

export const TitleCard: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useT();
  const o = win(t, a, b, 0.6, 0.6);
  const line = prog(t, a + 0.8, a + 3.2);
  const dots = [0, 1, 2, 3, 4, 5, 6];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ ...center, flexDirection: "column" }}>
        <div style={{ fontFamily: BODY, fontWeight: 700, letterSpacing: 8, fontSize: 26, color: C.gold }}>
          THE MONEY TRAIL · EPISODE 1
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 150,
            color: C.paper,
            textAlign: "center",
            lineHeight: 0.92,
            marginTop: 18,
            textShadow: "0 10px 50px rgba(0,0,0,0.7)",
          }}
        >
          WHAT HAPPENS IF YOU
          <br />
          STOP PAYING YOUR <span style={{ color: C.gold }}>CAR LOAN?</span>
        </div>
        <div style={{ position: "relative", width: 1100, height: 60, marginTop: 50 }}>
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 0,
              height: 4,
              width: `${line * 100}%`,
              background: `linear-gradient(90deg, ${C.gold}, ${C.red})`,
              borderRadius: 2,
            }}
          />
          {dots.map((d) => {
            const x = (d / (dots.length - 1)) * 100;
            const on = line * 100 >= x - 0.5;
            return (
              <div
                key={d}
                style={{
                  position: "absolute",
                  left: `calc(${x}% - 12px)`,
                  top: 18,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  background: on ? (d === dots.length - 1 ? C.red : C.gold) : "rgba(255,255,255,0.2)",
                  boxShadow: on ? `0 0 20px ${d === dots.length - 1 ? C.red : C.gold}` : "none",
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: 1160, marginTop: 6 }}>
          <span style={{ fontFamily: BODY, fontWeight: 700, color: C.dim, fontSize: 22, letterSpacing: 3 }}>
            ONE MISSED PAYMENT
          </span>
          <span style={{ fontFamily: BODY, fontWeight: 700, color: C.red, fontSize: 22, letterSpacing: 3 }}>
            THE END?
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Name tag lower-left. */
export const NameTag: React.FC<{ a: number; b: number; name: string; sub: string }> = ({ a, b, name, sub }) => {
  const t = useT();
  const neon = React.useContext(ThemeCtx) === "neon";
  const o = win(t, a, b, 0.4, 0.4);
  const w = prog(t, a, a + 0.7);
  return (
    <div style={{ position: "absolute", left: neon ? 580 : 90, bottom: neon ? 330 : BAR + 70, opacity: o }}>
      <div style={{ height: 5, width: 420 * w, background: C.gold, marginBottom: 14 }} />
      <div style={{ fontFamily: DISPLAY, fontSize: 96, color: C.paper, lineHeight: 0.9 }}>{name}</div>
      <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 30, color: C.dim, letterSpacing: 2, marginTop: 6 }}>
        {sub}
      </div>
    </div>
  );
};

/** Right-side info card with rows that appear one by one. */
export const InfoCard: React.FC<{
  a: number;
  b: number;
  title?: string;
  rows: { at: number; label: string; value: string; color?: string }[];
  top?: number;
  width?: number;
}> = ({ a, b, title, rows, top = BAR + 120, width = 600 }) => {
  const t = useT();
  const o = win(t, a, b);
  const x = interpolate(prog(t, a, a + 0.6), [0, 1], [60, 0]);
  return (
    <Card style={{ position: "absolute", right: 90, top, width, padding: "34px 40px", opacity: o, transform: `translateX(${x}px)` }}>
      {title ? (
        <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.gold, marginBottom: 18 }}>{title}</div>
      ) : null}
      {rows.map((r, i) => {
        const ro = prog(t, r.at, r.at + 0.4);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "14px 0",
              borderTop: i ? "1px solid rgba(255,255,255,0.1)" : "none",
              opacity: ro,
              transform: `translateY(${(1 - ro) * 14}px)`,
            }}
          >
            <span style={{ fontSize: 28, color: C.dim, fontWeight: 600 }}>{r.label}</span>
            <span style={{ fontFamily: DISPLAY, fontSize: 64, color: r.color ?? C.paper }}>{r.value}</span>
          </div>
        );
      })}
    </Card>
  );
};

/** Two bills: rent vs truck. Truck gets crossed out. */
export const Choice: React.FC<{ a: number; b: number; pick: number }> = ({ a, b, pick }) => {
  const t = useT();
  const o = win(t, a, b);
  const p = prog(t, pick, pick + 0.5);
  const bill = (label: string, amt: string, chosen: boolean, at: number) => (
    <Card style={{ width: 430, padding: "30px 36px", ...pop(t, at, b + 1) }}>
      <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.dim }}>DUE THIS WEEK</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 84, marginTop: 8 }}>{label}</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 64, color: C.gold }}>{amt}</div>
      <div
        style={{
          marginTop: 14,
          fontFamily: DISPLAY,
          fontSize: 52,
          color: chosen ? C.green : C.red,
          opacity: p,
        }}
      >
        {chosen ? "✓ PAID" : "✕ SKIPPED"}
      </div>
    </Card>
  );
  return (
    <div style={{ ...center, gap: 50, opacity: o }}>
      {bill("RENT", "$1,100", true, a)}
      {bill("TRUCK PAYMENT", "$450", false, a + 1.2)}
    </div>
  );
};

/** Phone-style notification banner. */
export const Notice: React.FC<{ at: number; b: number; title: string; body: string; y?: number }> = ({
  at,
  b,
  title,
  body,
  y = 0,
}) => {
  const t = useT();
  const o = win(t, at, b, 0.3, 0.4);
  const dy = interpolate(prog(t, at, at + 0.5), [0, 1], [-40, 0]);
  return (
    <div
      style={{
        position: "absolute",
        right: 110,
        top: BAR + 70 + y,
        width: 620,
        opacity: o,
        transform: `translateY(${dy}px)`,
        background: "rgba(245,245,247,0.94)",
        borderRadius: 28,
        padding: "22px 26px",
        display: "flex",
        gap: 20,
        alignItems: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        fontFamily: BODY,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: "linear-gradient(135deg,#1f6feb,#0b3d91)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 30,
        }}
      >
        $
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 26, color: "#111" }}>{title}</span>
          <span style={{ fontSize: 20, color: "#777" }}>now</span>
        </div>
        <div style={{ fontSize: 24, color: "#333", marginTop: 4 }}>{body}</div>
      </div>
    </div>
  );
};

/** Credit score gauge that drops. */
export const Gauge: React.FC<{ a: number; b: number; from: number; to: number; dropAt: number; dropEnd: number }> = ({
  a,
  b,
  from,
  to,
  dropAt,
  dropEnd,
}) => {
  const t = useT();
  const o = win(t, a, b);
  const v = interpolate(t, [dropAt, dropEnd], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const frac = (v - 300) / 550;
  const ang = -180 + 180 * frac;
  const col = v > 700 ? C.green : v > 640 ? C.gold : C.red;
  const R = 210;
  const arc = (f0: number, f1: number) => {
    const p = (f: number) => {
      const th = Math.PI * (1 - f);
      return [250 + R * Math.cos(th), 250 - R * Math.sin(th)];
    };
    const [x0, y0] = p(f0);
    const [x1, y1] = p(f1);
    return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`;
  };
  return (
    <Card style={{ position: "absolute", right: 90, top: BAR + 90, width: 560, padding: "30px 30px 26px", opacity: o }}>
      <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.dim, textAlign: "center" }}>
        TYLER'S CREDIT SCORE
      </div>
      <svg width={500} height={290} viewBox="0 0 500 290">
        <path d={arc(0, 0.33)} stroke={C.red} strokeWidth={26} fill="none" />
        <path d={arc(0.34, 0.62)} stroke={C.gold} strokeWidth={26} fill="none" />
        <path d={arc(0.63, 1)} stroke={C.green} strokeWidth={26} fill="none" />
        <g transform={`rotate(${ang + 90} 250 250)`}>
          <line x1={250} y1={250} x2={250} y2={70} stroke={C.paper} strokeWidth={8} strokeLinecap="round" />
        </g>
        <circle cx={250} cy={250} r={16} fill={C.paper} />
      </svg>
      <div style={{ textAlign: "center", fontFamily: DISPLAY, fontSize: 120, lineHeight: 0.9, color: col, marginTop: -40 }}>
        {Math.round(v)}
      </div>
    </Card>
  );
};

/** Row of small chips. */
export const Chips: React.FC<{
  b: number;
  items: { at: number; text: string; color?: string }[];
  bottom?: number;
  left?: number;
}> = ({ b, items, bottom: b0, left: l0 }) => {
  const t = useT();
  const neon = React.useContext(ThemeCtx) === "neon";
  const bottom = b0 ?? (neon ? 150 : BAR + 70);
  const left = l0 ?? (neon ? 640 : 90);
  return (
    <div style={{ position: "absolute", left, bottom, display: "flex", gap: 18 }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            ...pop(t, it.at, b),
            fontFamily: DISPLAY,
            fontSize: 60,
            padding: "10px 28px",
            borderRadius: 14,
            background: "rgba(10,12,15,0.75)",
            border: `2px solid ${it.color ?? C.gold}`,
            color: it.color ?? C.gold,
          }}
        >
          {it.text}
        </div>
      ))}
    </div>
  );
};

/** Red rubber stamp. */
export const RubberStamp: React.FC<{ at: number; b: number; text: string; color?: string; x?: number; y?: number; size?: number }> = ({
  at,
  b,
  text,
  color = C.red,
  x = 0,
  y = 0,
  size = 150,
}) => {
  const t = useT();
  const o = win(t, at, b, 0.12, 0.4);
  const s = interpolate(t, [at, at + 0.18], [1.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ ...center, transform: `translate(${x}px, ${y}px)` }}>
      <div
        style={{
          opacity: o,
          transform: `rotate(-8deg) scale(${s})`,
          border: `10px solid ${color}`,
          color,
          fontFamily: DISPLAY,
          fontSize: size,
          padding: "6px 40px",
          borderRadius: 18,
          letterSpacing: 4,
          background: "rgba(0,0,0,0.35)",
          textShadow: "0 0 30px rgba(0,0,0,0.5)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Contract paper with highlighted clause. */
export const Contract: React.FC<{ a: number; b: number; hl: number }> = ({ a, b, hl }) => {
  const t = useT();
  const o = win(t, a, b);
  const h = prog(t, hl, hl + 0.8);
  const line = (w: number, k: number) => (
    <div key={k} style={{ height: 12, width: `${w}%`, background: "#c9c2b5", borderRadius: 6, margin: "14px 0" }} />
  );
  return (
    <div style={{ ...center, opacity: o }}>
      <div
        style={{
          width: 820,
          background: C.paper,
          borderRadius: 10,
          padding: "50px 60px",
          transform: `rotate(-2deg) translateY(${(1 - prog(t, a, a + 0.6)) * 40}px)`,
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          fontFamily: BODY,
          color: "#2a2620",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 3 }}>RETAIL INSTALLMENT CONTRACT</div>
        {[92, 85, 96, 70].map(line)}
        <div style={{ position: "relative", fontSize: 30, fontWeight: 600, lineHeight: 1.45, margin: "20px 0" }}>
          <span
            style={{
              position: "absolute",
              left: -8,
              top: 0,
              bottom: 0,
              width: `${h * 104}%`,
              background: "rgba(242,181,68,0.55)",
              zIndex: 0,
            }}
          />
          <span style={{ position: "relative" }}>
            §7. Failure to make any payment when due shall constitute a <b>DEFAULT</b>.
          </span>
        </div>
        {[88, 94, 60].map(line)}
      </div>
    </div>
  );
};

/** Missed-call counter. */
export const MissedCalls: React.FC<{ a: number; b: number; to: number }> = ({ a, b, to }) => {
  const t = useT();
  const o = win(t, a, b);
  const n = Math.max(1, Math.round(interpolate(t, [a, b - 1], [1, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <Card style={{ position: "absolute", right: 90, top: BAR + 100, padding: "28px 40px", opacity: o, display: "flex", gap: 26, alignItems: "center" }}>
      <div style={{ width: 84, height: 84, borderRadius: 42, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>
        ✆
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.dim }}>MISSED CALLS · AUTO LENDER</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 110, lineHeight: 0.9, color: C.red }}>{n}</div>
      </div>
    </Card>
  );
};

/** Big clock "3:12 AM". */
export const Clock: React.FC<{ a: number; b: number; text: string }> = ({ a, b, text }) => {
  const t = useT();
  const blink = Math.floor(t * 2) % 2 === 0;
  return (
    <div style={{ position: "absolute", left: 90, top: BAR + 60, ...pop(t, a, b) }}>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 210,
          color: "#ff5a4f",
          textShadow: "0 0 40px rgba(255,60,50,0.7)",
          letterSpacing: 6,
        }}
      >
        {text.replace(":", blink ? ":" : " ")}
      </div>
    </div>
  );
};

/** Checklist card (can / can't). */
export const Checklist: React.FC<{
  a: number;
  b: number;
  title: string;
  rows: { at: number; ok: boolean; text: string }[];
  note?: string;
}> = ({ a, b, title, rows, note }) => {
  const t = useT();
  const o = win(t, a, b);
  return (
    <Card style={{ position: "absolute", right: 90, top: BAR + 70, width: 720, padding: "30px 40px", opacity: o }}>
      <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.gold, marginBottom: 10 }}>{title}</div>
      {rows.map((r, i) => {
        const ro = prog(t, r.at, r.at + 0.4);
        return (
          <div key={i} style={{ display: "flex", gap: 20, alignItems: "center", padding: "12px 0", opacity: ro, transform: `translateX(${(1 - ro) * 20}px)` }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: r.ok ? "rgba(61,214,140,0.18)" : "rgba(229,72,77,0.18)",
                color: r.ok ? C.green : C.red,
                fontWeight: 800,
                fontSize: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {r.ok ? "✓" : "✕"}
            </div>
            <div style={{ fontSize: 32, fontWeight: 600 }}>{r.text}</div>
          </div>
        );
      })}
      {note ? <div style={{ marginTop: 10, fontSize: 20, color: C.dim }}>{note}</div> : null}
    </Card>
  );
};

/** Two option cards side by side. */
export const Options: React.FC<{
  a: number;
  b: number;
  items: { at: number; tag: string; title: string; body: string }[];
  failAt: number;
}> = ({ a, b, items, failAt }) => {
  const t = useT();
  const f = prog(t, failAt, failAt + 0.4);
  return (
    <div style={{ ...center, gap: 44, opacity: win(t, a, b), top: 60 }}>
      {items.map((it, i) => (
        <Card key={i} style={{ width: 560, padding: "34px 40px", position: "relative", ...pop(t, it.at, b + 1) }}>
          <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.gold }}>{it.tag}</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 110, lineHeight: 1 }}>{it.title}</div>
          <div style={{ fontSize: 30, color: C.dim, fontWeight: 500, lineHeight: 1.35 }}>{it.body}</div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 22,
              background: `rgba(10,10,10,${0.55 * f})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: DISPLAY,
              fontSize: 80,
              color: C.red,
              opacity: f,
            }}
          >
            ✕ CAN'T AFFORD
          </div>
        </Card>
      ))}
    </div>
  );
};

/** Deficiency math: lines build, then total. */
export const MathCard: React.FC<{ a: number; b: number; steps: number[]; totalAt: number; labelAt: number }> = ({
  a,
  b,
  steps,
  totalAt,
  labelAt,
}) => {
  const t = useT();
  const rows = [
    { l: "Still owed on the loan", v: "$19,000", c: C.paper },
    { l: "Auction sale price", v: "− $11,000", c: C.green },
    { l: "Repo, storage & auction fees", v: "+ $1,500", c: C.red },
  ];
  const tot = interpolate(t, [totalAt, totalAt + 1.2], [0, 9500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Card style={{ position: "absolute", right: 90, top: BAR + 80, width: 760, padding: "36px 44px", opacity: win(t, a, b) }}>
      <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.gold, marginBottom: 8 }}>LET'S DO THE MATH</div>
      {rows.map((r, i) => {
        const ro = prog(t, steps[i], steps[i] + 0.4);
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", opacity: ro }}>
            <span style={{ fontSize: 30, color: C.dim, fontWeight: 600 }}>{r.l}</span>
            <span style={{ fontFamily: DISPLAY, fontSize: 70, color: r.c }}>{r.v}</span>
          </div>
        );
      })}
      <div style={{ height: 3, background: "rgba(255,255,255,0.3)", margin: "10px 0", opacity: prog(t, totalAt - 0.2, totalAt) }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: prog(t, totalAt, totalAt + 0.3) }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: prog(t, labelAt, labelAt + 0.3) > 0.5 ? C.red : C.paper }}>
          {prog(t, labelAt, labelAt + 0.3) > 0.5 ? "DEFICIENCY BALANCE" : "Tyler still owes"}
        </span>
        <span style={{ fontFamily: DISPLAY, fontSize: 110, color: C.red }}>{money(tot)}</span>
      </div>
    </Card>
  );
};

/** Horizontal flow: A → B → C. */
export const Flow: React.FC<{ a: number; b: number; items: { at: number; text: string }[] }> = ({ a, b, items }) => {
  const t = useT();
  return (
    <div style={{ ...center, gap: 20, opacity: win(t, a, b) }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i ? (
            <div style={{ fontFamily: DISPLAY, fontSize: 90, color: C.gold, opacity: prog(t, it.at - 0.2, it.at + 0.2) }}>→</div>
          ) : null}
          <Card style={{ padding: "30px 40px", ...pop(t, it.at, b + 1) }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 88, color: i === items.length - 1 ? C.red : C.paper }}>{it.text}</div>
          </Card>
        </React.Fragment>
      ))}
    </div>
  );
};

/** Paycheck bar with garnished slice. */
export const Paycheck: React.FC<{ a: number; b: number; cutAt: number }> = ({ a, b, cutAt }) => {
  const t = useT();
  const c = prog(t, cutAt, cutAt + 1);
  return (
    <Card style={{ position: "absolute", right: 90, bottom: BAR + 80, width: 820, padding: "30px 40px", opacity: win(t, a, b) }}>
      <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.dim }}>TYLER'S PAYCHECK</div>
      <div style={{ display: "flex", height: 80, marginTop: 16, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ flex: 1, background: C.green, display: "flex", alignItems: "center", paddingLeft: 20, fontFamily: DISPLAY, fontSize: 44, color: C.ink }}>
          TAKE-HOME
        </div>
        <div
          style={{
            width: `${25 * c}%`,
            background: C.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: DISPLAY,
            fontSize: 44,
            color: C.paper,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          UP TO 25%
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 22, color: C.dim, opacity: c }}>
        Federal cap: 25% of disposable earnings. Some states protect more.
      </div>
    </Card>
  );
};

/** Bank account card that freezes. */
export const Account: React.FC<{ a: number; b: number; freezeAt: number }> = ({ a, b, freezeAt }) => {
  const t = useT();
  const f = prog(t, freezeAt, freezeAt + 0.6);
  return (
    <Card style={{ position: "absolute", right: 90, top: BAR + 100, width: 560, padding: "30px 40px", opacity: win(t, a, b) }}>
      <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.dim }}>CHECKING ••• 4821</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 110, color: f > 0.5 ? "#9fd8ff" : C.paper }}>
        {f > 0.5 ? "FROZEN" : "$1,240.18"}
      </div>
      <div style={{ fontSize: 24, color: C.dim }}>{f > 0.5 ? "Bank levy · court order" : "Available balance"}</div>
    </Card>
  );
};

/** Recap timeline. */
export const Timeline: React.FC<{ a: number; b: number; nodes: { at: number; k: string; v: string }[]; endAt: number }> = ({
  a,
  b,
  nodes,
  endAt,
}) => {
  const t = useT();
  const o = win(t, a, b, 0.6, 0.6);
  const last = nodes.filter((n) => t >= n.at).length;
  const fill = last <= 1 ? 0 : (last - 1) / (nodes.length - 1);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 120, right: 120, top: 470, height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3 }} />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 470,
          height: 6,
          width: `calc((100% - 240px) * ${fill})`,
          background: `linear-gradient(90deg, ${C.gold}, ${C.red})`,
          borderRadius: 3,
        }}
      />
      {nodes.map((n, i) => {
        const x = 120 + (i / (nodes.length - 1)) * (1920 - 240);
        const p = prog(t, n.at, n.at + 0.4);
        const up = i % 2 === 0;
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: x - 16,
                top: 457,
                width: 32,
                height: 32,
                borderRadius: 16,
                background: p > 0 ? (i === nodes.length - 1 ? C.red : C.gold) : "#333",
                boxShadow: p > 0 ? `0 0 24px ${C.gold}` : "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x - 160,
                width: 320,
                top: up ? 230 : 530,
                textAlign: "center",
                opacity: p,
                transform: `translateY(${(1 - p) * (up ? 20 : -20)}px)`,
              }}
            >
              <div style={{ fontFamily: DISPLAY, fontSize: 64, color: i === nodes.length - 1 ? C.red : C.gold }}>{n.k}</div>
              <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 28, color: C.paper, lineHeight: 1.25 }}>{n.v}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", ...pop(t, endAt, b) }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 96, color: C.paper }}>
          ALL FROM <span style={{ color: C.red }}>ONE DECISION.</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** Numbered tips list. */
export const Tips: React.FC<{ a: number; b: number; items: { at: number; title: string; body: string }[] }> = ({ a, b, items }) => {
  const t = useT();
  return (
    <Card style={{ position: "absolute", right: 90, top: BAR + 60, width: 820, padding: "30px 40px", opacity: win(t, a, b) }}>
      {items.map((it, i) => {
        const p = prog(t, it.at, it.at + 0.5);
        return (
          <div key={i} style={{ display: "flex", gap: 24, padding: "14px 0", opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 72, color: C.gold, width: 50, lineHeight: 0.9 }}>{i + 1}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 34 }}>{it.title}</div>
              <div style={{ fontSize: 24, color: C.dim, marginTop: 4 }}>{it.body}</div>
            </div>
          </div>
        );
      })}
    </Card>
  );
};

/** Centered statement card. */
export const Statement: React.FC<{ a: number; b: number; kicker?: string; text: React.ReactNode; width?: number; size?: number }> = ({
  a,
  b,
  kicker,
  text,
  width = 1100,
  size = 44,
}) => {
  const t = useT();
  return (
    <div style={{ ...center }}>
      <Card style={{ width, padding: "40px 56px", textAlign: "center", ...pop(t, a, b) }}>
        {kicker ? <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.gold, marginBottom: 14 }}>{kicker}</div> : null}
        <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1.3 }}>{text}</div>
      </Card>
    </div>
  );
};

/** Persistent small channel bug. */
export const Bug: React.FC<{ until: number }> = ({ until }) => {
  const t = useT();
  return (
    <div
      style={{
        position: "absolute",
        right: 60,
        top: BAR + 30,
        opacity: 0.75 * win(t, 23.5, until, 1, 1),
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: DISPLAY,
        fontSize: 34,
        letterSpacing: 2,
        color: C.paper,
      }}
    >
      <LogoMark size={34} />
      THE MONEY TRAIL
    </div>
  );
};

/** Logo mark: a dotted trail ending in a coin. */
export const LogoMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="14" cy="80" r="7" fill={C.gold} opacity="0.45" />
    <circle cx="34" cy="64" r="7" fill={C.gold} opacity="0.65" />
    <circle cx="52" cy="46" r="7" fill={C.gold} opacity="0.85" />
    <circle cx="74" cy="28" r="20" fill={C.gold} />
    <text x="74" y="37" textAnchor="middle" fontFamily="Bebas" fontSize="28" fill={C.ink}>
      $
    </text>
  </svg>
);

export const EndCard: React.FC<{ a: number; nextAt: number; b: number }> = ({ a, nextAt, b }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ opacity: win(t, a, b, 0.8, 1.2) }}>
      <div style={{ ...center, flexDirection: "column" }}>
        <div style={pop(t, a, b + 2)}>
          <LogoMark size={170} />
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 170, color: C.paper, letterSpacing: 4, lineHeight: 1, ...pop(t, a + 0.3, b + 2) }}>
          THE MONEY TRAIL
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 600, fontSize: 32, color: C.dim, letterSpacing: 3, opacity: prog(t, a + 0.8, a + 1.4) }}>
          FOLLOW THE MONEY. ALL THE WAY TO THE END.
        </div>
        <Card style={{ marginTop: 60, padding: "22px 40px", ...pop(t, nextAt, b + 2) }}>
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.gold }}>NEXT EPISODE · </span>
          <span style={{ fontWeight: 700, fontSize: 32 }}>What happens if you never pay your student loans?</span>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export { W };
