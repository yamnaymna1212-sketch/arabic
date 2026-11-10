import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import {
  AlertTriangle,
  Banknote,
  Bell,
  BellOff,
  Building2,
  Calendar as CalIcon,
  Car,
  Clock,
  Coffee,
  DollarSign,
  DoorClosed,
  FileText,
  Footprints,
  Gavel,
  Glasses,
  Hammer,
  Hand,
  Handshake,
  HeartCrack,
  Home,
  Landmark,
  Lock,
  Mail,
  MessageSquare,
  Moon,
  Music,
  Package,
  PenLine,
  PhoneCall,
  PhoneOff,
  Receipt,
  RefreshCw,
  Scale,
  Scissors,
  Search,
  ShieldAlert,
  Siren,
  Tag as TagIcon,
  TrendingDown,
  Truck as TruckIcon,
  UserX,
  Wallet,
  Wrench,
} from "lucide-react";
import { BODY, DISPLAY, FPS, PHRASES, ThemeCtx, useT, W, WE, WORDS } from "../lib";
import { EP1_SECONDS, Music as Score, SFX } from "../Episode";
import { BigWords, Clock as BigClock, Contract, EndCard, MissedCalls, NameTag, Notice, Paycheck, RubberStamp, Statement, TitleCard } from "../overlays";
import { Stamp } from "../lib";
import { Bars, Crowd, Countdown, Garage, Barn, Spotlight, World, moodColor, glow } from "../neon/kit";
import {
  Actor,
  Bill,
  Building,
  Calendar,
  Camera,
  Columns,
  Floor,
  Fly,
  G,
  Ico,
  Lamp,
  Mini,
  N,
  Pickup,
  RealCard,
  RingPhone,
  Say,
  SceneDef,
  Scenes,
  Tag,
  Tow,
  Window,
  clamp01,
  moveAt,
  poseAt,
  track,
  vis,
  type Face,
  type PoseName,
} from "./engine";

const END = EP1_SECONDS;
const FL = 900; // floor line

type PL = [number, PoseName, Face][];

/** Tyler with pose list and optional position track. */
const Tyler: React.FC<{ poses: PL; x?: [number, number, number?][]; s?: number; dir?: number; hold?: React.ReactNode; jump?: number; props?: ("cap" | "badge" | "vest")[]; opacity?: number }> = ({
  poses,
  x = [[0, 700]],
  s = 1.05,
  dir = 1,
  hold,
  jump = 0,
  props = ["cap", "badge"],
  opacity = 1,
}) => {
  const t = useT();
  const P = poseAt(t, poses);
  const m = moveAt(t, x);
  return (
    <Actor
      x={m.x}
      y={FL}
      s={s}
      arms={P.arms}
      face={P.face}
      walking={m.walking}
      dir={m.walking ? m.dir : dir}
      props={props}
      hold={hold}
      jump={jump}
      opacity={opacity}
      seed="tyler"
    />
  );
};

const jumpAt = (t: number, at: number, h = 60) => {
  const p = (t - at) / 0.45;
  return p > 0 && p < 1 ? Math.sin(p * Math.PI) * h : 0;
};

const Room: React.FC<{ night?: number; x?: number }> = ({ night = 1, x = 0 }) => (
  <>
    <G x={x + 120} y={180} w={1680} h={720} color={N.teal} opacity={0.35} sw={2}>
      <rect x={2} y={2} width={1676} height={716} fill="none" />
    </G>
    <Window x={x + 1180} y={260} night={night} />
    <G x={x + 260} y={700} w={460} h={200} color={N.teal}>
      <path d="M10 196 L10 70 Q10 40 40 40 L420 40 Q450 40 450 70 L450 196" />
      <rect x={10} y={110} width={440} height={60} rx={10} />
    </G>
    <G x={x + 900} y={560} w={200} h={340} color={N.teal} opacity={0.8}>
      <line x1={100} y1={340} x2={100} y2={60} />
      <path d="M50 60 L150 60 L130 10 L70 10 Z" fill={`${N.gold}33`} stroke={N.gold} />
    </G>
  </>
);

// ---------------------------------------------------------------- scenes

const S_Hook: React.FC = () => {
  const t = useT();
  return (
    <Camera
      cam={[
        [0, 900, 560, 1.0],
        [W(10), 760, 520, 1.25, 0.6],
        [W(14), 760, 470, 1.55, 0.5],
        [W(17), 1100, 480, 1.1, 0.7],
        [W(28), 1150, 470, 1.0, 0.6],
        [W(41), 1150, 450, 1.15, 0.6],
      ]}
    >
      <Floor />
      <Room night={1} />
      <Tyler
        x={[[0, 640], [0.3, 720, 1.4]]}
        poses={[
          [0, "phone", "worried"],
          [W(14), "down", "smirk"],
          [W(17), "think", "worried"],
          [W(28), "ears", "shock"],
          [W(33), "shrug", "worried"],
          [W(41), "facepalm", "sad"],
        ]}
        dir={1}
        jump={jumpAt(t, W(28), 40)}
      />
      <Tag x={720} y={210} a={W(10)} b={W(12) - 0.1} text="NO CALL." color={N.white} size={90} />
      <Tag x={720} y={210} a={W(12)} b={W(14) - 0.1} text="NO WARNING." color={N.white} size={90} />
      <Tag x={720} y={210} a={W(14)} b={W(17) - 0.1} text="YOU JUST... STOP." color={N.gold} size={90} />
      <Ico I={Moon} x={1330} y={330} a={W(17)} b={W(28)} label="3 AM?" color={N.white} size={110} />
      <Ico I={Siren} x={1080} y={300} a={W(28)} b={W(44) - 0.3} label="POLICE?" color={N.red} size={130} />
      <Ico I={Car} x={1330} y={520} a={W(33)} b={W(44) - 0.3} label="THE CAR?" color={N.teal} size={130} cross={W(38)} />
      <Ico I={DollarSign} x={1560} y={300} a={W(41)} b={W(44) - 0.3} label="THE DEBT?" color={N.gold} size={130} />
    </Camera>
  );
};

const S_Title: React.FC = () => {
  const t = useT();
  const nodes: [number, number, typeof Home][] = [
    [300, 760, Home],
    [700, 560, Car],
    [1100, 760, TruckIcon],
    [1500, 560, Gavel],
    [1900, 760, Scale],
    [2300, 560, Lock],
  ];
  const draw = clamp01((t - W(44)) / 6);
  const d = "M300 760 C 500 760 500 560 700 560 S 900 760 1100 760 S 1300 560 1500 560 S 1700 760 1900 760 S 2100 560 2300 560";
  return (
    <Camera cam={[[W(44), 700, 560, 0.85], [W(44) + 0.1, 1500, 600, 0.95, 8]]}>
      <Floor y={980} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: glow(N.gold, 0.8), opacity: 0.55 }} width={1} height={1}>
        <path d={d} fill="none" stroke={N.gold} strokeWidth={8} strokeDasharray={`${3000 * draw} 4000`} strokeLinecap="round" />
      </svg>
      {nodes.map(([x, y, I], i) => (
        <Ico key={i} I={I} x={x} y={y} a={W(44) + 0.4 + i * 0.9} b={W(68)} size={110} color={i > 2 ? N.red : N.mint} />
      ))}
    </Camera>
  );
};

const S_Dealer: React.FC = () => {
  const t = useT();
  const flags = Array.from({ length: 24 }, (_, i) => i);
  return (
    <Camera
      cam={[
        [W(68), 500, 560, 1.0],
        [W(70) + 0.4, 650, 500, 1.3, 0.7],
        [W(80), 950, 560, 1.0, 0.8],
        [W(88), 1060, 560, 1.3, 0.6],
        [W(93), 1300, 480, 1.1, 0.6],
        [W(98), 1350, 500, 1.25, 0.6],
      ]}
    >
      <Floor />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        <path d="M100 260 Q 950 340 1900 260" fill="none" stroke={N.teal} strokeWidth={2} />
        {flags.map((i) => {
          const x = 100 + i * 75;
          const y = 260 + Math.sin((i / 23) * Math.PI) * 60;
          const sw = Math.sin(t * 5 + i) * 6;
          const c = [N.red, N.gold, N.mint, N.teal][i % 4];
          return <path key={i} d={`M${x} ${y} L${x + 30} ${y} L${x + 15 + sw} ${y + 46}`} fill={`${c}55`} stroke={c} strokeWidth={2} />;
        })}
      </svg>
      <Tag x={1450} y={160} a={W(68)} b={W(106)} text="USED CARS" color={N.red} size={110} />
      <Pickup x={1650} y={FL} w={380} color={N.gold} opacity={0.6} />
      <Pickup x={1080} y={FL} w={460} tag={t > W(88) ? "$22,000" : undefined} />
      <Tyler
        x={[[W(68), -150], [W(68), 560, 1.6], [W(80), 760, 1.2]]}
        poses={[
          [W(68), "idle", "happy"],
          [W(70), "wave", "happy"],
          [W(80), "idle", "happy"],
          [W(84), "point", "happy"],
          [W(96), "cheer", "happy"],
          [W(100), "idle", "happy"],
        ]}
        jump={jumpAt(t, W(96), 50)}
      />
      <Calendar x={1260} y={430} a={W(90)} b={W(106)} text="6" sub="YEARS" color={N.teal} size={170} />
      <Ico I={Receipt} x={1500} y={420} a={W(96)} b={W(106)} label="$450 / MONTH" color={N.gold} size={130} />
    </Camera>
  );
};

const S_Drive: React.FC = () => {
  const t = useT();
  const span = W(111) - W(106);
  const tx = track(t, [[W(106), 300], [W(106) + 0.01, 2700, span]]);
  return (
    <Camera cam={[[W(106), 400, 600, 1.0], [W(106) + 0.01, 2700, 600, 1.0, span]]}>
      <Floor x0={-400} x1={3600} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Lamp key={i} x={100 + i * 600} y={FL} on={false} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Building key={i} x={-100 + i * 900} y={FL - 40} w={360} h={420 + (i % 2) * 120} seed={`dr${i}`} lit={0.2} />
      ))}
      <Pickup x={tx} y={FL} w={460} driver />
      <Tag x={tx} y={560} a={W(106) + 0.3} b={W(111)} text="EVERYTHING'S FINE ✓" color={N.mint} size={64} />
    </Camera>
  );
};

const S_Kitchen: React.FC = () => {
  const t = useT();
  return (
    <Camera cam={[[W(111), 760, 520, 1.25], [W(118), 1150, 480, 1.0, 0.7], [W(126), 1250, 470, 1.2, 0.6]]}>
      <Floor />
      <Room night={0} />
      <G x={650} y={720} w={420} h={180} color={N.teal}>
        <rect x={0} y={0} width={420} height={20} />
        <line x1={40} y1={20} x2={40} y2={180} />
        <line x1={380} y1={20} x2={380} y2={180} />
      </G>
      <Tyler
        x={[[W(111), 520]]}
        poses={[
          [W(111), "shrug", "shock"],
          [W(118), "think", "worried"],
          [W(126), "point", "worried"],
        ]}
        jump={jumpAt(t, W(111) + 0.2, 30)}
      />
      <Ico I={Clock} x={880} y={330} a={W(111)} b={W(118)} label="HOURS CUT" color={N.red} size={130} cross={W(114)} />
      <Ico I={Scissors} x={1090} y={330} a={W(112)} b={W(118)} color={N.red} size={90} />
      <Bill x={1060} y={430} a={W(118)} b={W(130)} I={Home} title="RENT" amount="$1,100" state={t > W(126) ? "paid" : null} rot={-4} />
      <Bill x={1420} y={450} a={W(121)} b={W(130)} I={TruckIcon} title="TRUCK" amount="$450" state={t > W(127) ? "skipped" : null} rot={4} />
    </Camera>
  );
};

const S_Day1: React.FC = () => {
  const t = useT();
  return (
    <Camera
      cam={[
        [W(130), 950, 520, 1.0],
        [W(136), 1100, 450, 1.15, 0.6],
        [W(150), 1320, 560, 1.2, 0.6],
        [W(172), 1100, 450, 1.05, 0.6],
        [W(182), 780, 520, 1.35, 0.6],
        [W(190), 800, 500, 1.15, 0.5],
      ]}
    >
      <Floor />
      <Room night={0.6} />
      <Tyler
        x={[[W(130), 600]]}
        poses={[
          [W(130), "phone", "neutral"],
          [W(150), "phone", "worried"],
          [W(182), "reach", "neutral"],
          [W(190), "shrug", "smirk"],
        ]}
      />
      <Calendar x={1400} y={330} a={W(130)} b={W(136)} text="1" sub="DAY LATE" color={N.gold} size={190} />
      <div style={{ position: "absolute", left: 0, top: 0, opacity: vis(t, W(136), W(150)) }}>
        <Countdown x={1120} y={420} size={260} frac={clamp01((t - W(136)) / 4)} label="10–15" sub="DAYS GRACE" color={N.teal} />
      </div>
      <G x={1230} y={560} w={180} h={200} color={N.gold} opacity={vis(t, W(150), W(172))}>
        <path d="M20 20 L20 180 Q20 196 40 196 L140 196 Q160 196 160 180 L160 20" fill={`${N.gold}11`} />
        <text x={90} y={120} textAnchor="middle" fontFamily={DISPLAY} fontSize={40} fill={N.gold} stroke="none">
          FEES
        </text>
      </G>
      {[0, 1, 2, 3].map((i) => (
        <Fly key={i} from={[1320 + (i - 1.5) * 40, 100]} to={[1320, 700]} a={W(152) + i * 0.25} d={0.6} arc={-40} keep={0.1}>
          <Mini I={DollarSign} color={N.gold} size={56} />
        </Fly>
      ))}
      <Tag x={1320} y={470} a={W(152)} b={W(172)} text="+ $25–$50" color={N.red} size={80} />
      <Ico I={Mail} x={950} y={300} a={W(172)} b={W(182)} label="EMAIL" color={N.teal} size={100} />
      <Ico I={MessageSquare} x={1150} y={260} a={W(176)} b={W(182)} label="TEXT" color={N.teal} size={100} />
      <Ico I={PhoneCall} x={1350} y={300} a={W(178)} b={W(182)} label="AUTO CALL" color={N.teal} size={100} />
      <Tag x={800} y={260} a={W(190)} b={W(194)} text="DOESN'T PAY" color={N.red} size={84} rot={-4} />
    </Camera>
  );
};

const ScoreDial: React.FC<{ x: number; y: number; a: number; b: number; v: number }> = ({ x, y, a, b, v }) => {
  const t = useT();
  const o = vis(t, a, b);
  if (o <= 0) return null;
  const frac = (v - 300) / 550;
  const ang = -180 + 180 * frac;
  const col = v > 700 ? N.mint : v > 640 ? N.gold : N.red;
  return (
    <div style={{ position: "absolute", left: x - 230, top: y - 200, width: 460, height: 300, opacity: o, transform: `scale(${0.8 + 0.2 * o})`, filter: glow(col, 0.8) }}>
      <svg width={460} height={260} viewBox="0 0 460 260">
        <path d="M30 240 A200 200 0 0 1 430 240" fill="none" stroke={`${col}33`} strokeWidth={26} />
        <path d="M30 240 A200 200 0 0 1 430 240" fill="none" stroke={col} strokeWidth={26} strokeDasharray={`${628 * frac} 700`} />
        <g transform={`rotate(${ang + 90} 230 240)`}>
          <line x1={230} y1={240} x2={230} y2={70} stroke={N.white} strokeWidth={8} strokeLinecap="round" />
        </g>
        <circle cx={230} cy={240} r={16} fill={N.white} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: DISPLAY, fontSize: 110, color: col }}>{Math.round(v)}</div>
    </div>
  );
};

const S_Day30: React.FC = () => {
  const t = useT();
  const v = track(t, [[0, 742], [W(226), 631, 2.5]]);
  return (
    <Camera
      cam={[
        [W(194), 650, 520, 1.15],
        [W(202), 1250, 520, 0.8, 0.8],
        [W(223), 1000, 500, 1.1, 0.7],
        [W(236), 1050, 470, 1.35, 0.6],
      ]}
    >
      <Floor />
      <Columns x={180} y={FL} w={420} title="LENDER" color={N.teal} />
      {["EQUIFAX", "EXPERIAN", "TRANSUNION"].map((n, i) => (
        <React.Fragment key={n}>
          <Building x={1200 + i * 380} y={FL} w={300} h={380 + i * 40} seed={n} lit={0.5} color={N.gold} />
          <Tag x={1350 + i * 380} y={FL - 440 - i * 40} a={W(219) + i * 0.6} b={W(223)} text={n} color={N.gold} size={50} />
          <Fly from={[400, 450]} to={[1350 + i * 380, FL - 300]} a={W(208) + i * 0.4} d={0.9} arc={160} spin={360}>
            <Mini I={FileText} color={N.red} size={60} />
          </Fly>
        </React.Fragment>
      ))}
      <Calendar x={420} y={260} a={W(194)} b={W(202)} text="30" sub="DAYS LATE" color={N.red} size={180} />
      <Tyler x={[[W(194), 760]]} poses={[[W(194), "idle", "worried"], [W(226), "down", "sad"], [W(236), "facepalm", "sad"]]} />
      <ScoreDial x={1150} y={430} a={W(223)} b={W(247)} v={v} />
      <Tag x={1150} y={680} a={W(236)} b={W(247)} text="−100+ POINTS" color={N.red} size={70} />
    </Camera>
  );
};

const S_Contract: React.FC = () => (
  <Camera cam={[[W(247), 700, 520, 1.25], [W(257), 760, 480, 1.4, 1.5], [W(269), 700, 520, 1.2, 0.3]]} shakes={[W(269)]}>
    <Floor />
    <Room night={0.6} />
    <Tyler x={[[0, 600]]} poses={[[W(247), "hold", "neutral"], [W(257), "think", "worried"], [W(269), "up", "shock"]]} />
    <Ico I={Search} x={820} y={280} a={W(249)} b={W(269)} color={N.teal} size={110} label="FINE PRINT" />
  </Camera>
);

const S_Day60: React.FC = () => {
  const calls = Array.from({ length: 9 }, (_, i) => W(287) + i * 1.0);
  return (
    <Camera
      cam={[
        [W(281), 1000, 520, 0.9],
        [W(287), 1500, 520, 1.25, 0.6],
        [W(295), 650, 520, 1.25, 0.6],
        [W(300), 1000, 500, 0.95, 0.6],
        [W(307), 620, 480, 1.45, 0.5],
      ]}
    >
      <Floor />
      <Calendar x={1000} y={240} a={W(281)} b={W(287)} text="60" sub="DAYS LATE" color={N.red} size={180} />
      <G x={1340} y={720} w={360} h={180} color={N.teal}>
        <rect x={0} y={0} width={360} height={20} />
        <line x1={30} y1={20} x2={30} y2={180} />
        <line x1={330} y1={20} x2={330} y2={180} />
      </G>
      <Actor x={1520} y={FL} s={1.0} color={N.teal} arms={{ l: [12, 6], r: [25, 150] }} face="smirk" props={["headset"]} label="COLLECTIONS" dir={-1} seed="col" />
      {calls.map((c, i) => (
        <Fly key={i} from={[1450, 450]} to={[700, 450]} a={c} d={0.7} arc={80} keep={0}>
          <Mini I={PhoneCall} color={N.red} size={54} />
        </Fly>
      ))}
      <RingPhone x={830} y={560} a={W(287)} b={W(311)} />
      <Tyler x={[[0, 600]]} poses={[[W(281), "idle", "worried"], [W(295), "stop", "angry"], [W(307), "ears", "angry"]]} />
      <Ico I={PhoneOff} x={600} y={250} a={W(307)} b={W(311)} color={N.red} size={110} label="NOT PICKING UP" />
    </Camera>
  );
};

const S_Hide: React.FC = () => {
  const t = useT();
  const tx = track(t, [[W(311), 350], [W(311) + 0.3, 2000, 2.6]]);
  return (
    <Camera cam={[[W(311), 600, 560, 1.0], [W(311) + 0.3, 1500, 560, 0.95, 2.4], [W(318), 1400, 560, 1.0, 0.5], [W(322), 1000, 540, 1.15, 2.5]]}>
      <Floor />
      {[0, 1, 2].map((i) => (
        <Building key={i} x={-200 + i * 620} y={FL - 30} w={420} h={460} seed={`h${i}`} lit={0.4} />
      ))}
      <Lamp x={1300} y={FL} on />
      <Pickup x={tx} y={FL} w={440} driver={t < W(318)} />
      <Building x={1700} y={FL} w={700} h={620} seed="corner" lit={0.3} color={N.teal} />
      <Tag x={1950} y={180} a={W(313)} b={W(327)} text="AROUND THE CORNER" color={N.gold} size={56} />
      <Tyler
        opacity={t > W(317) ? 1 : 0}
        x={[[W(317), 1650], [W(318), 1000, 4]]}
        poses={[
          [W(317), "idle", "smirk"],
          [W(325), "shrug", "smirk"],
          [W(327), "idle", "worried"],
        ]}
      />
      <Ico I={Music} x={1100} y={420} a={W(318)} b={W(326)} color={N.mint} size={80} />
      <Tag x={1050} y={300} a={W(320)} b={W(327)} text="OUT OF SIGHT, OUT OF MIND?" color={N.white} size={60} />
      <Tag x={1000} y={300} a={W(327)} b={W(329)} text="IT DOESN'T." color={N.red} size={90} />
    </Camera>
  );
};

const S_Repo: React.FC = () => {
  const t = useT();
  const towX = track(t, [[W(329), 2700], [W(343), 1360, 3], [W(397), 3400, 8]]);
  const truckX = track(t, [[W(329), 900], [W(397), 2940, 8]]);
  const lift = track(t, [[W(329), 0], [W(364), 1, 2]]);
  const lit = t < W(337) ? 0.6 : t < W(343) ? 0.25 : 0.08;
  return (
    <Camera
      cam={[
        [W(329), 1000, 520, 0.9],
        [W(343), 1350, 560, 1.0, 1.0],
        [W(357), 1150, 420, 0.95, 0.6],
        [W(364), 1100, 660, 1.35, 0.8],
        [W(375), 1050, 540, 1.0, 0.8],
        [W(386), 900, 600, 1.15, 0.8],
        [W(397), 2600, 600, 1.0, 8],
      ]}
    >
      <Floor x0={-600} x1={4200} />
      <Building x={0} y={FL - 200} w={640} h={520} seed="apt1" lit={lit} floors={3} cols={5} />
      <Building x={700} y={FL - 200} w={560} h={460} seed="apt2" lit={lit} floors={3} cols={4} />
      <G x={1500} y={80} w={120} h={120} color={N.white} opacity={0.8}>
        <circle cx={60} cy={60} r={46} fill={`${N.white}22`} />
      </G>
      <Lamp x={300} y={FL} on />
      <Lamp x={1700} y={FL} on />
      <Lamp x={2900} y={FL} on />
      <Pickup x={truckX} y={FL} w={440} tilt={-lift * 6} />
      <Tow x={towX} y={FL} w={560} lift={lift} />
      <Ico I={DoorClosed} x={800} y={250} a={W(357)} b={W(364)} label="NO KNOCK" color={N.teal} size={110} cross={W(357) + 0.4} />
      <Ico I={Gavel} x={1100} y={250} a={W(359)} b={W(364)} label="NO COURT DATE" color={N.gold} size={110} cross={W(359) + 0.4} />
      <Ico I={Siren} x={1400} y={250} a={W(362)} b={W(364) + 0.3} label="NO POLICE" color={N.red} size={110} cross={W(362) + 0.4} />
      <Tag x={1150} y={380} a={W(366)} b={W(386)} text="NO COURT ORDER NEEDED*" color={N.gold} size={64} />
      <Tag x={1150} y={450} a={W(368)} b={W(386)} text="*IN MOST STATES, ONCE IN DEFAULT" color={N.white} size={34} />
    </Camera>
  );
};

const S_Morning: React.FC = () => {
  const t = useT();
  const sunY = track(t, [[W(409), 520], [W(409) + 0.1, 260, 4]]);
  const drop = W(418) + 0.2;
  return (
    <Camera cam={[[W(409), 650, 540, 1.0], [W(415), 820, 520, 1.1, 0.6], [W(418), 820, 560, 1.3, 0.35]]} shakes={[W(418)]}>
      <Floor />
      <div style={{ position: "absolute", left: 1350, top: sunY, width: 200, height: 200, borderRadius: 200, background: `radial-gradient(circle, ${N.gold}, ${N.gold}00 70%)` }} />
      <Building x={0} y={FL - 200} w={640} h={520} seed="apt1" lit={0.1} floors={3} cols={5} />
      <div
        style={{
          position: "absolute",
          left: 880,
          top: FL - 190,
          width: 460,
          height: 190,
          border: `4px dashed ${N.red}`,
          borderRadius: 18,
          opacity: vis(t, W(416), W(424)),
          boxShadow: `0 0 30px ${N.red}66`,
        }}
      />
      <Tyler
        x={[[W(409), 200], [W(409), 700, 2]]}
        poses={[
          [W(409), "phone", "happy"],
          [W(418), "up", "shock"],
        ]}
        hold={t < drop ? <g transform="translate(-14,-40)"><rect x={0} y={0} width={28} height={36} rx={4} fill={N.fill} stroke={N.gold} strokeWidth={3} /></g> : undefined}
        jump={jumpAt(t, W(418), 70)}
      />
      <Fly from={[760, 480]} to={[820, 890]} a={drop} d={0.5} arc={-30} spin={200} keep={3}>
        <Mini I={Coffee} color={N.gold} size={56} />
      </Fly>
      <Tag x={1110} y={650} a={W(418)} b={W(424)} text="EMPTY." color={N.red} size={100} />
    </Camera>
  );
};

const S_Rules: React.FC = () => {
  const t = useT();
  const agentX = track(t, [[W(424), 2100], [W(436), 1330, 2.4], [W(462), 1180, 0.6], [W(463) + 0.4, 1290, 0.4], [W(486), 2300, 4]]);
  const am = moveAt(t, [[W(424), 2100], [W(436), 1330, 2.4], [W(462), 1180, 0.6], [W(463) + 0.4, 1290, 0.4], [W(486), 2300, 4]]);
  return (
    <Camera
      cam={[
        [W(424), 1100, 520, 0.8],
        [W(436), 1300, 540, 1.05, 0.8],
        [W(444), 1150, 420, 0.9, 0.6],
        [W(462), 1130, 640, 1.35, 0.6],
        [W(468), 1150, 460, 0.95, 0.6],
        [W(472), 860, 540, 1.25, 0.6],
        [W(491), 1250, 460, 0.95, 0.6],
        [W(497), 1450, 560, 1.15, 0.8],
      ]}
      shakes={[W(463)]}
    >
      <Floor />
      <Garage x={880} y={FL - 330} w={420} />
      <Tow x={2050} y={FL} w={520} lights />
      <Actor x={agentX} y={FL} s={1.0} color={N.lime} arms={t > W(462) && t < W(464) ? { l: [12, 6], r: [70, 75] } : am.walking ? undefined : { l: [45, 125], r: [45, 125] }} walking={am.walking} dir={am.walking ? am.dir : -1} face={t > W(462) ? "angry" : "neutral"} props={["cap", "vest"]} label="REPO AGENT" seed="rep" />
      <Tyler
        opacity={t > W(470) ? 1 : 0}
        x={[[W(470), 500], [W(470), 760, 1.2]]}
        poses={[
          [W(470), "idle", "angry"],
          [W(474), "stop", "angry"],
          [W(491), "idle", "happy"],
        ]}
      />
      <Say x={860} y={430} a={W(476)} b={W(488)} text="NO." size={70} />
      <Ico I={Home} x={760} y={230} a={W(444)} b={W(459)} label="DRIVEWAY" color={N.mint} size={100} check={W(445)} />
      <Ico I={Car} x={1000} y={230} a={W(446)} b={W(459)} label="STREET" color={N.mint} size={100} check={W(447)} />
      <Ico I={Building2} x={1240} y={230} a={W(448)} b={W(459)} label="PARKING LOT" color={N.mint} size={100} check={W(449)} />
      <Ico I={Lock} x={1090} y={560} a={W(462)} b={W(472)} label="LOCKED GARAGE" color={N.gold} size={110} cross={W(466)} />
      <Ico I={AlertTriangle} x={900} y={260} a={W(468)} b={W(472)} label="THREATS" color={N.red} size={100} cross={W(469)} />
      <Ico I={Hand} x={1300} y={260} a={W(470)} b={W(472) + 0.4} label="FORCE" color={N.red} size={100} cross={W(470) + 0.3} />
      <Ico I={ShieldAlert} x={1150} y={250} a={W(491)} b={W(497)} label="FAKE POLICE" color={N.red} size={120} cross={W(493)} />
      <Actor
        x={track(t, [[W(497), 2100], [W(497), 1550, 1.6]])}
        y={FL}
        s={1.0}
        color="#7fb8ff"
        walking={t > W(497) && t < W(497) + 1.6}
        dir={-1}
        face="neutral"
        props={["police"]}
        opacity={t > W(497) ? 1 : 0}
        label="POLICE"
        seed="cop"
      />
      <Ico I={Handshake} x={1550} y={330} a={W(504)} b={W(514)} label="KEEP THE PEACE" color="#7fb8ff" size={110} />
    </Camera>
  );
};

const S_Impound: React.FC = () => {
  const t = useT();
  const posts = Array.from({ length: 11 }, (_, i) => 700 + i * 120);
  return (
    <Camera cam={[[W(514), 950, 520, 0.95], [W(520), 820, 560, 1.15, 0.6], [W(529), 1250, 480, 1.0, 0.6], [W(541), 700, 500, 1.3, 0.6]]}>
      <Floor />
      <Pickup x={1350} y={FL - 20} w={420} color={N.teal} opacity={0.9} />
      <Pickup x={1800} y={FL - 30} w={360} color={N.gold} opacity={0.5} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: glow(N.teal, 0.6) }} width={1} height={1}>
        {posts.map((x) => (
          <line key={x} x1={x} y1={FL} x2={x} y2={FL - 360} stroke={N.teal} strokeWidth={5} />
        ))}
        {posts.slice(0, -1).map((x) => (
          <g key={`m${x}`} stroke={N.teal} strokeWidth={1.5} opacity={0.6}>
            <line x1={x} y1={FL - 360} x2={x + 120} y2={FL} />
            <line x1={x + 120} y1={FL - 360} x2={x} y2={FL} />
          </g>
        ))}
        <path d={Array.from({ length: 24 }, (_, i) => `M${700 + i * 50} ${FL - 380} a 25 18 0 1 1 0.1 0`).join(" ")} fill="none" stroke={N.white} strokeWidth={2} opacity={0.7} />
      </svg>
      <Tyler x={[[W(514), 300], [W(514), 520, 1.5]]} poses={[[W(514), "idle", "sad"], [W(517), "hold", "sad"], [W(534), "hold", "happy"], [W(541), "hold", "neutral"]]} />
      <G x={440} y={590} w={170} h={110} color={N.gold} opacity={t > W(517) ? 1 : 0}>
        <rect x={4} y={20} width={162} height={86} rx={6} />
        <path d="M4 20 L30 2 L140 2 L166 20" fill="none" />
      </G>
      {[
        [W(520), Footprints, "BOOTS"],
        [W(523), Glasses, "SUNGLASSES"],
        [W(525), Wrench, "TOOLS"],
      ].map(([a, I], i) => (
        <Fly key={i} from={[1350, 650]} to={[525, 600]} a={a as number} d={0.9} arc={260} spin={180} keep={0.2}>
          <Mini I={I as typeof Wrench} color={N.gold} size={70} />
        </Fly>
      ))}
      <Tag x={900} y={330} a={W(520)} b={W(529)} text="BOOTS · SUNGLASSES · TOOLS" color={N.gold} size={52} />
      <Ico I={TruckIcon} x={1350} y={380} a={W(529)} b={W(541)} label="TRUCK → LENDER" color={N.red} size={110} />
      <Ico I={Package} x={760} y={380} a={W(534)} b={W(541)} label="YOUR STUFF → YOURS" color={N.mint} size={110} check={W(536)} />
      <Ico I={Clock} x={760} y={300} a={W(549)} b={W(559)} label="ASK FAST" color={N.gold} size={100} />
      <Ico I={FileText} x={980} y={300} a={W(552)} b={W(559)} label="IN WRITING" color={N.gold} size={100} />
    </Camera>
  );
};

const S_Mail: React.FC = () => {
  return (
    <Camera
      cam={[
        [W(559), 900, 480, 1.0],
        [W(567), 950, 380, 1.15, 0.5],
        [W(570), 800, 520, 1.3, 0.6],
        [W(600), 1200, 470, 0.95, 0.7],
        [W(618), 1500, 470, 1.1, 0.6],
        [W(641), 1300, 500, 0.9, 0.6],
        [W(646), 1500, 420, 1.2, 0.5],
      ]}
    >
      <Floor />
      <G x={960} y={640} w={120} h={260} color={N.teal}>
        <line x1={60} y1={260} x2={60} y2={80} strokeWidth={8} />
        <path d="M10 80 L10 30 Q10 0 60 0 Q110 0 110 30 L110 80 Z" />
        <line x1={110} y1={20} x2={110} y2={-30} stroke={N.red} />
      </G>
      <Fly from={[1700, 100]} to={[1020, 700]} a={W(566)} d={0.8} arc={60} spin={-30} keep={0.1}>
        <Mini I={Mail} color={N.gold} size={80} />
      </Fly>
      <Tyler
        x={[[W(559), 640], [W(569), 800, 0.8]]}
        poses={[
          [W(559), "cheer", "happy"],
          [W(567), "idle", "shock"],
          [W(570), "hold", "worried"],
          [W(600), "think", "neutral"],
          [W(641), "shrug", "sad"],
        ]}
      />
      <Tag x={880} y={250} a={W(559)} b={W(567)} text="DEBT'S OVER?" color={N.mint} size={90} />
      <Tag x={880} y={250} a={W(567)} b={W(570)} text="NOT EVEN CLOSE." color={N.red} size={90} rot={-3} />
      <Tag x={820} y={330} a={W(571)} b={W(600)} text="NOTICE OF SALE" color={N.gold} size={64} />
      <Ico I={Wallet} x={1250} y={430} a={W(600)} b={W(652) - 0.3} label="REDEEM: PAY IT ALL" color={N.gold} size={150} cross={W(641)} />
      <Ico I={RefreshCw} x={1650} y={430} a={W(618)} b={W(652) - 0.3} label="REINSTATE: CATCH UP*" color={N.teal} size={150} cross={W(641) + 0.3} />
      <Tag x={1450} y={680} a={W(620)} b={W(641)} text="*SOME STATES & CONTRACTS" color={N.white} size={34} />
      <Ico I={Gavel} x={1500} y={300} a={W(646)} b={W(652)} label="TO AUCTION" color={N.red} size={120} />
    </Camera>
  );
};

const S_Auction: React.FC = () => {
  const t = useT();
  const tx = track(t, [[W(652), -300], [W(652) + 0.2, 1000, 2.2]]);
  const bid = Math.round(track(t, [[W(661), 6000], [W(670), 11000, 6]]) / 100) * 100;
  return (
    <Camera
      cam={[
        [W(652), 900, 560, 0.85],
        [W(661), 1000, 600, 1.15, 0.8],
        [W(679), 460, 520, 1.2, 0.6],
        [W(688), 1500, 400, 1.2, 0.5],
        [W(694), 1050, 460, 0.95, 0.6],
      ]}
      shakes={[W(688)]}
    >
      <Spotlight x={1000} y={FL - 20} w={620} color={N.gold} />
      <Pickup x={tx} y={FL - 30} w={460} />
      <Crowd x={420} y={1170} cols={20} rows={3} gap={80} scale={0.34} pose="up" seed="bid2" />
      <div
        style={{
          position: "absolute",
          left: 1380,
          top: 180,
          width: 420,
          padding: "20px 30px",
          background: "rgba(10,36,27,0.95)",
          border: `3px solid ${t > W(688) ? N.red : N.gold}`,
          borderRadius: 22,
          boxShadow: `0 0 30px ${N.gold}55`,
          opacity: vis(t, W(658), W(715)),
        }}
      >
        <div style={{ fontFamily: BODY, fontWeight: 800, letterSpacing: 3, color: N.gold, fontSize: 22 }}>{t > W(688) ? "SOLD" : "CURRENT BID"}</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 110, color: N.white, lineHeight: 1 }}>${bid.toLocaleString("en-US")}</div>
      </div>
      <Tyler x={[[0, 360]]} poses={[[W(652), "idle", "sad"], [W(679), "facepalm", "sad"], [W(688), "idle", "shock"]]} />
      <Tag x={420} y={300} a={W(679)} b={W(688)} text="STILL OWED $19,000" color={N.red} size={64} />
      <Ico I={Gavel} x={1300} y={420} a={W(688)} b={W(694)} color={N.red} size={120} label="SOLD!" />
      <Ico I={TruckIcon} x={800} y={300} a={W(697)} b={W(715)} label="TOW" color={N.red} size={100} />
      <Ico I={Building2} x={1000} y={300} a={W(699)} b={W(715)} label="STORAGE" color={N.red} size={100} />
      <Ico I={Wrench} x={1200} y={300} a={W(704)} b={W(715)} label="AUCTION PREP" color={N.red} size={100} />
      <Tag x={1000} y={170} a={W(710)} b={W(715)} text="+ $1,500 FEES" color={N.red} size={80} />
    </Camera>
  );
};

const S_Bank: React.FC = () => {
  const t = useT();
  return (
    <Camera
      cam={[
        [W(715), 1000, 560, 0.9],
        [W(720), 1050, 330, 1.05, 0.6],
        [W(734), 1050, 400, 1.3, 0.4],
        [W(742), 820, 560, 1.2, 0.6],
        [W(749), 1050, 420, 1.0, 0.6],
      ]}
      shakes={[W(734)]}
    >
      <Floor />
      <Columns x={1420} y={FL} w={620} title="LENDER" color={N.teal} />
      <G x={1310} y={730} w={380} h={170} color={N.gold}>
        <rect x={0} y={0} width={380} height={22} />
        <rect x={20} y={22} width={340} height={148} fill="none" />
      </G>
      <Actor x={1500} y={760} s={0.95} color={N.teal} arms={{ l: [12, 6], r: [80, 88] }} face="neutral" props={["tie", "glasses"]} dir={-1} label="LENDER" seed="lend" />
      <Tyler x={[[W(715), 500], [W(715), 760, 1.4]]} poses={[[W(715), "idle", "worried"], [W(734), "up", "shock"], [W(742), "facepalm", "sad"]]} jump={jumpAt(t, W(734), 50)} />
      <Tag x={700} y={250} a={W(720)} b={W(761)} text="$19,000" color={N.white} size={80} />
      <Tag x={970} y={250} a={W(724)} b={W(761)} text="− $11,000" color={N.mint} size={80} />
      <Tag x={1270} y={250} a={W(728)} b={W(761)} text="+ $1,500" color={N.red} size={80} />
      <Tag x={1050} y={380} a={W(734)} b={W(761)} text="= $9,500" color={N.red} size={150} />
      <Ico I={TruckIcon} x={620} y={430} a={W(742)} b={W(749)} label="NO TRUCK" color={N.red} size={110} cross={W(743)} />
      <Tag x={1050} y={500} a={W(749)} b={W(761)} text="DEFICIENCY BALANCE" color={N.gold} size={64} />
    </Camera>
  );
};

const S_Chain: React.FC = () => {
  const t = useT();
  const bagX = track(t, [[W(761), 400], [W(776), 1100, 0.9], [W(778), 1800, 0.9], [W(787), 2500, 0.9]]);
  return (
    <Camera cam={[[W(761), 500, 520, 1.0], [W(776), 1100, 520, 1.0, 0.9], [W(778), 1800, 520, 1.0, 0.9], [W(787), 2500, 520, 1.1, 0.9]]}>
      <Floor x0={-400} x1={3400} />
      <Columns x={200} y={FL} w={400} title="LENDER" color={N.teal} />
      <Building x={900} y={FL} w={400} h={460} seed="ca" lit={0.6} color={N.gold} />
      <Tag x={1100} y={380} a={W(761)} b={W(792)} text="COLLECTION AGENCY" color={N.gold} size={44} />
      <Building x={1600} y={FL} w={400} h={400} seed="db" lit={0.4} color={N.lime} />
      <Tag x={1800} y={440} a={W(761)} b={W(792)} text="DEBT BUYER" color={N.lime} size={44} />
      <Columns x={2300} y={FL} w={420} title="COURT" color={N.red} />
      <div style={{ position: "absolute", left: bagX - 70, top: 560 - Math.abs(Math.sin(t * 3)) * 30, width: 140, textAlign: "center", filter: glow(N.gold, 0.8) }}>
        <Banknote size={90} color={N.gold} />
        <div style={{ fontFamily: DISPLAY, fontSize: 44, color: N.gold }}>$9,500</div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <Fly key={i} from={[1100, 400]} to={[300 + i * 30, 820 - i * 20]} a={W(764) + i * 0.4} d={0.7} arc={100} keep={6}>
          <Mini I={Mail} color={N.red} size={50} />
        </Fly>
      ))}
    </Camera>
  );
};

const S_Door: React.FC = () => {
  const t = useT();
  const knock = t > W(792) && t < W(795) ? Math.sin(t * 60) * 4 : 0;
  return (
    <Camera cam={[[W(792), 960, 520, 1.1], [W(796), 880, 460, 1.35, 0.6], [W(799), 960, 500, 1.15, 0.6]]}>
      <Floor />
      <G x={120} y={180} w={1680} h={720} color={N.teal} opacity={0.35} sw={2}>
        <rect x={2} y={2} width={1676} height={716} fill="none" />
      </G>
      <G x={840 + knock} y={420} w={240} h={480} color={N.gold}>
        <rect x={0} y={0} width={240} height={480} rx={6} />
        <circle cx={200} cy={250} r={10} fill={N.gold} />
      </G>
      <Tag x={960} y={330} a={W(792)} b={W(796)} text="KNOCK KNOCK" color={N.white} size={70} rot={-4} />
      <Actor x={1300} y={FL} s={1.0} color={N.lime} arms={{ l: [12, 6], r: [70, 75] }} face="neutral" props={["cap"]} dir={-1} label="PROCESS SERVER" seed="srv" />
      <Tyler x={[[W(792), 640]]} poses={[[W(792), "idle", "neutral"], [W(796), "hold", "shock"], [W(800), "facepalm", "sad"]]} />
      <Fly from={[1200, 640]} to={[700, 640]} a={W(795)} d={0.6} arc={40} keep={3}>
        <Mini I={FileText} color={N.red} size={70} />
      </Fly>
      <Tag x={760} y={250} a={W(796)} b={W(804)} text="SUMMONS" color={N.red} size={80} />
      <Ico I={Clock} x={1050} y={250} a={W(799)} b={W(804)} label="NO RESPONSE?" color={N.gold} size={100} />
    </Camera>
  );
};

const S_Court: React.FC = () => {
  const t = useT();
  const slam = t > W(822) && t < W(822) + 0.25;
  return (
    <Camera
      cam={[
        [W(804), 850, 280, 0.95],
        [W(805), 850, 600, 1.0, 2.2],
        [W(812), 2500, 520, 1.0, 1.0],
        [W(820), 2560, 470, 1.15, 0.6],
        [W(822), 2560, 450, 1.3, 0.25],
        [W(824), 2500, 520, 1.0, 0.6],
      ]}
      shakes={[W(822)]}
    >
      <Floor x0={-400} x1={3600} />
      <Columns x={540} y={FL} w={640} title="COURTHOUSE" color={N.gold} />
      <G x={1950} y={180} w={1300} h={720} color={N.gold} opacity={0.3} sw={2}>
        <rect x={2} y={2} width={1296} height={716} fill="none" />
      </G>
      <Actor x={2700} y={760} s={1.0} color={N.gold} arms={slam ? { l: [12, 6], r: [60, 30] } : { l: [12, 6], r: [140, 200] }} face="angry" props={["glasses", "gavel"]} label="JUDGE" dir={-1} seed="jdg" />
      <G x={2500} y={700} w={420} h={200} color={N.gold}>
        <rect x={0} y={0} width={420} height={200} rx={8} />
        <line x1={0} y1={40} x2={420} y2={40} />
      </G>
      <G x={2120} y={760} w={140} h={140} color={N.teal}>
        <path d="M10 140 L10 60 L130 60 L130 140 M10 100 L130 100 M10 60 L10 0 L130 0 L130 60" fill="none" />
      </G>
      <Ico I={UserX} x={2190} y={600} a={W(812)} b={W(833)} label="TYLER: NO-SHOW" color={N.red} size={110} />
      <Ico I={Wrench} x={2350} y={330} a={W(826)} b={W(833)} label="NEW TOOLS" color={N.red} size={90} />
      <Ico I={Hammer} x={2550} y={300} a={W(828)} b={W(833)} color={N.red} size={90} />
    </Camera>
  );
};

const S_Work: React.FC = () => {
  const t = useT();
  return (
    <Camera cam={[[W(833), 900, 520, 1.0], [W(838), 1200, 470, 1.1, 0.6], [W(856), 850, 470, 1.25, 0.6], [W(866), 1000, 500, 1.0, 0.8]]}>
      <Floor />
      {[0, 1, 2].map((i) => (
        <G key={i} x={1150 + i * 260} y={420} w={220} h={480} color={N.teal} opacity={0.8}>
          <rect x={0} y={0} width={220} height={480} fill="none" />
          {[1, 2, 3].map((r) => (
            <line key={r} x1={0} y1={r * 120} x2={220} y2={r * 120} />
          ))}
          {[0, 1, 2, 3].map((r) => (
            <rect key={`b${r}`} x={20 + (r % 2) * 90} y={r * 120 + 50} width={70} height={60} stroke={N.gold} />
          ))}
        </G>
      ))}
      <Tag x={1500} y={340} a={W(833)} b={W(874)} text="WAREHOUSE · EMPLOYER" color={N.teal} size={44} />
      <Tyler x={[[0, 640]]} props={["cap", "badge", "vest"]} poses={[[W(833), "idle", "neutral"], [W(840), "hold", "happy"], [W(856), "hold", "shock"], [W(862), "facepalm", "sad"]]} />
      <Bill x={900} y={440} a={W(840)} b={W(874)} I={Banknote} title="PAYCHECK" amount={t > W(858) ? "−25%" : "$1,600"} color={t > W(858) ? N.red : N.mint} />
      {[0, 1, 2, 3].map((i) => (
        <Fly key={i} from={[900, 450]} to={[1900, 120 + i * 60]} a={W(856) + i * 0.3} d={1.0} arc={120} spin={360} keep={0}>
          <Mini I={DollarSign} color={N.red} size={60} />
        </Fly>
      ))}
    </Camera>
  );
};

const S_Gas: React.FC = () => {
  const t = useT();
  const declined = t > W(903);
  return (
    <Camera
      cam={[
        [W(874), 1000, 520, 0.95],
        [W(880), 1350, 400, 1.15, 0.6],
        [W(895), 1050, 520, 1.3, 0.6],
        [W(903), 1150, 470, 1.55, 0.25],
      ]}
      shakes={[W(903)]}
    >
      <Floor />
      <G x={500} y={220} w={1100} h={80} color={N.red}>
        <rect x={0} y={0} width={1100} height={70} rx={8} />
      </G>
      <G x={600} y={290} w={900} h={610} color={N.teal} sw={6}>
        <line x1={20} y1={0} x2={20} y2={610} />
        <line x1={880} y1={0} x2={880} y2={610} />
      </G>
      <G x={1080} y={560} w={200} h={340} color={declined ? N.red : N.teal}>
        <rect x={0} y={0} width={200} height={340} rx={14} />
        <rect x={30} y={40} width={140} height={80} rx={6} fill={declined ? `${N.red}33` : N.fill} />
        <text x={100} y={92} textAnchor="middle" fontFamily={DISPLAY} fontSize={30} fill={declined ? N.red : N.teal} stroke="none">
          {declined ? "DECLINED" : "$40.00"}
        </text>
      </G>
      <Tyler x={[[W(874), 500], [W(874), 900, 1.6]]} poses={[[W(874), "idle", "neutral"], [W(895), "reach", "neutral"], [W(903), "up", "shock"]]} hold={<g transform="translate(-18,-12)"><rect x={0} y={0} width={36} height={24} rx={4} fill={N.fill} stroke={N.gold} strokeWidth={3} /></g>} />
      <Ico I={Landmark} x={1450} y={380} a={W(880)} b={W(895)} label="TYLER'S BANK" color={N.teal} size={120} />
      <Ico I={Lock} x={1620} y={300} a={W(886)} b={W(895)} label="FROZEN" color="#9fd8ff" size={100} />
    </Camera>
  );
};

const S_Jail: React.FC = () => {
  const t = useT();
  const barsY = track(t, [[W(904), -900], [W(912), 300, 0.25], [W(921), -1200, 0.6]]);
  return (
    <Camera cam={[[W(904), 900, 520, 1.0], [W(912), 1050, 540, 1.1, 0.3], [W(921), 1100, 500, 1.0, 0.5], [W(934), 1100, 520, 1.05, 0.5]]} shakes={[W(912) + 0.25]}>
      <Floor />
      <G x={150} y={180} w={1620} h={720} color={N.teal} opacity={0.3} sw={2}>
        {Array.from({ length: 12 }, (_, r) => (
          <line key={r} x1={0} y1={r * 60} x2={1620} y2={r * 60} />
        ))}
      </G>
      <Bars x={450} y={barsY} w={420} h={620} />
      <Tyler x={[[0, 660]]} poses={[[W(904), "idle", "worried"], [W(912), "up", "shock"], [W(921), "cheer", "happy"], [W(934), "idle", "worried"]]} jump={jumpAt(t, W(921), 70)} />
    </Camera>
  );
};

const S_Warrant: React.FC = () => (
  <Camera cam={[[W(940), 600, 520, 1.0], [W(945), 1350, 500, 1.05, 0.7], [W(958), 1350, 430, 1.3, 0.6], [W(968), 900, 520, 0.95, 0.7]]}>
    <Floor />
    <Room night={1} x={-500} />
    <Tyler x={[[0, 500]]} poses={[[W(940), "phone", "smirk"], [W(958), "idle", "shock"]]} />
    <Actor x={1450} y={760} s={1.0} color={N.gold} arms={{ l: [12, 6], r: [80, 88] }} face="angry" props={["glasses"]} label="JUDGE" dir={-1} seed="jdg2" />
    <G x={1250} y={700} w={420} h={200} color={N.gold}>
      <rect x={0} y={0} width={420} height={200} rx={8} />
    </G>
    <Ico I={CalIcon} x={1100} y={300} a={W(945)} b={W(958)} label="COURT ORDER: SHOW UP" color={N.gold} size={110} />
    <Ico I={BellOff} x={600} y={260} a={W(949)} b={W(958)} label="IGNORED" color={N.red} size={100} />
    <Ico I={FileText} x={1400} y={300} a={W(958)} b={W(976)} label="WARRANT (SOME STATES)" color={N.red} size={130} />
    <Tag x={900} y={200} a={W(968)} b={W(976)} text="NOT FOR THE DEBT" color={N.white} size={64} />
  </Camera>
);

const S_Barn: React.FC = () => {
  const t = useT();
  const tx = track(t, [[W(976), -400], [W(990), 1380, 3.2]]);
  const tarp = clamp01((t - W(1001)) / 0.8);
  const siren = t > W(1015);
  const on = Math.floor(t * 6) % 2 === 0;
  return (
    <Camera cam={[[W(976), 700, 520, 1.0], [W(990), 1150, 560, 0.85, 3], [W(1001), 1380, 600, 1.2, 0.6], [W(1015), 1380, 460, 0.95, 0.6]]}>
      <Floor />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        <path d="M-400 700 Q 300 560 900 690 T 2200 640" fill="none" stroke={N.gold} strokeWidth={2} opacity={0.5} />
      </svg>
      <Barn x={1080} y={FL - 430} w={600} />
      <Pickup x={tx} y={FL} w={420} driver={t < W(997)} tarp={tarp} />
      <Tag x={700} y={300} a={W(992)} b={W(1001)} text="A FRIEND'S BARN · ANOTHER COUNTY" color={N.gold} size={52} />
      <Tag x={700} y={300} a={W(1005)} b={W(1015)} text="OR SELLING IT" color={N.gold} size={60} />
      {siren ? (
        <div style={{ position: "absolute", left: 1100, top: 200, width: 600, height: 500, background: `radial-gradient(circle, ${on ? "#ff3b3b55" : "#3b7bff55"}, transparent 65%)` }} />
      ) : null}
      <Ico I={Siren} x={1380} y={300} a={W(1015)} b={W(1035)} label="CAN BE A CRIME*" color={N.red} size={130} />
    </Camera>
  );
};

const S_Flash: React.FC = () => (
  <AbsoluteFill style={{ filter: "sepia(0.6) hue-rotate(290deg) saturate(1.4)" }}>
    <Camera cam={[[W(1035), 900, 520, 1.0], [W(1043), 950, 500, 1.2, 1.5]]}>
      <Floor />
      <Pickup x={1350} y={FL} w={440} />
      <G x={650} y={730} w={300} h={170} color={N.gold}>
        <rect x={0} y={0} width={300} height={20} />
        <line x1={30} y1={20} x2={30} y2={170} />
        <line x1={270} y1={20} x2={270} y2={170} />
      </G>
      <Tyler x={[[0, 520]]} poses={[[W(1035), "wave", "happy"], [W(1045), "idle", "happy"]]} />
      <Actor x={1050} y={FL} s={1.1} color={N.pink} arms={{ l: [12, 6], r: [70, 100] }} face="happy" props={["hair", "glasses"]} label="MOM" seed="mom0" />
      <Ico I={PenLine} x={800} y={560} a={W(1049)} b={W(1054)} label="CO-SIGNED" color={N.pink} size={110} />
      <Tag x={900} y={230} a={W(1037)} b={W(1054)} text="FLASHBACK" color={N.pink} size={70} />
    </Camera>
  </AbsoluteFill>
);

const S_Mom: React.FC = () => {
  const t = useT();
  const face: Face = t > W(1100) ? "sad" : t > W(1059) ? "worried" : "neutral";
  return (
    <Camera cam={[[W(1054), 1000, 520, 0.95], [W(1059), 1250, 480, 1.2, 0.6], [W(1077), 1000, 500, 1.0, 0.8], [W(1100), 1250, 450, 1.35, 0.6]]}>
      <Floor />
      <G x={1300} y={420} w={520} h={480} color={N.pink}>
        <path d="M0 480 L0 160 L260 10 L520 160 L520 480" fill="none" />
        <rect x={60} y={220} width={140} height={120} />
        <rect x={320} y={260} width={120} height={220} />
      </G>
      <Actor x={1200} y={FL} s={1.15} color={N.pink} arms={t > W(1059) ? { l: [12, 6], r: [30, 110] } : { l: [12, 6], r: [12, 6] }} face={face} props={["hair", "glasses"]} label="MOM · CO-SIGNER" seed="mom" dir={-1} />
      <Tyler x={[[0, 360]]} s={0.8} poses={[[W(1054), "idle", "sad"]]} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: glow(N.red, 0.8), opacity: vis(t, W(1057), W(1113)) }} width={1} height={1}>
        <path d="M430 560 Q 800 420 1130 560" fill="none" stroke={N.red} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-t * 60} />
      </svg>
      {[
        [W(1059), "LATE"],
        [W(1062), "REPO"],
        [W(1064), "$9,500"],
      ].map(([a, txt], i) => (
        <React.Fragment key={i}>
          <Fly from={[400, 450]} to={[1150, 520]} a={a as number} d={0.7} arc={160} keep={0}>
            <Mini I={Mail} color={N.red} size={60} />
          </Fly>
          <Tag x={1000 + i * 180} y={300} a={(a as number) + 0.6} b={W(1077)} text={txt as string} color={N.red} size={56} />
        </React.Fragment>
      ))}
      <Ico I={HeartCrack} x={1200} y={330} a={W(1100)} b={W(1113)} color={N.pink} size={120} label="SHE DID NOTHING WRONG" />
    </Camera>
  );
};

const S_Years: React.FC = () => {
  const t = useT();
  const yr = 2026 + Math.min(7, Math.floor(clamp01((t - W(1117)) / 3) * 7));
  return (
    <Camera cam={[[W(1113), 900, 520, 1.0], [W(1127), 1000, 460, 1.2, 0.6], [W(1135), 1200, 480, 0.95, 0.6]]}>
      <Floor />
      <Tyler x={[[0, 500]]} poses={[[W(1113), "idle", "sad"], [W(1137), "shrug", "sad"]]} />
      <Calendar x={950} y={380} a={W(1113)} b={W(1135)} text={String(yr)} sub="ON HIS REPORT" color={N.red} size={300} />
      <Ico I={Car} x={1000} y={330} a={W(1137)} b={W(1153)} label="CAR LOANS" color={N.red} size={120} cross={W(1138)} />
      <Ico I={Home} x={1250} y={330} a={W(1139)} b={W(1153)} label="APARTMENTS" color={N.red} size={120} cross={W(1140)} />
      <Ico I={Building2} x={1500} y={330} a={W(1142)} b={W(1153)} label="SOME JOBS" color={N.red} size={120} cross={W(1143)} />
      <Tag x={1250} y={560} a={W(1148)} b={W(1153)} text="OR A LOT MORE EXPENSIVE" color={N.gold} size={56} />
    </Camera>
  );
};

const S_Recap: React.FC = () => {
  const t = useT();
  const nodes: [number, number, number, typeof Home, string, string][] = [
    [W(1161), 300, 700, Bell, "DAY 1", "LATE FEE"],
    [W(1166), 750, 500, TrendingDown, "DAY 30", "CREDIT HIT"],
    [W(1177), 1200, 700, TruckIcon, "DAY 60–90", "3 AM TOW"],
    [W(1189), 1650, 500, Gavel, "AUCTION", "$9,500 BILL"],
    [W(1209), 2100, 700, Scale, "COURT", "GARNISHMENT"],
    [W(1219), 2550, 500, HeartCrack, "MOM", "CREDIT HIT"],
    [W(1225), 3000, 700, CalIcon, "7 YEARS", "ON REPORT"],
  ];
  const camX = track(t, [[W(1153), 300], ...nodes.map((n) => [n[0], n[1], 0.8] as [number, number, number])]);
  const d = "M300 700 C 520 700 530 500 750 500 S 980 700 1200 700 S 1430 500 1650 500 S 1880 700 2100 700 S 2330 500 2550 500 S 2780 700 3000 700";
  const lit = nodes.filter((n) => t >= n[0]).length;
  return (
    <AbsoluteFill>
      <Camera cam={[[W(1153), 900, 600, 0.6], [W(1158), 900, 600, 1.0, 1]]}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${900 - camX}px)` }}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: glow(N.gold, 0.8) }} width={1} height={1}>
            <path d={d} fill="none" stroke={`${N.gold}33`} strokeWidth={10} />
            <path d={d} fill="none" stroke={N.red} strokeWidth={10} strokeDasharray={`${(lit / nodes.length) * 3300} 6000`} strokeLinecap="round" />
          </svg>
          {nodes.map(([a, x, y, I, k, v]) => (
            <React.Fragment key={k}>
              <Ico I={I} x={x} y={y} a={a} b={W(1245)} size={130} color={N.red} />
              <Tag x={x} y={y - 140} a={a + 0.1} b={W(1245)} text={k} color={N.gold} size={60} />
              <Tag x={x} y={y + 120} a={a + 0.2} b={W(1245)} text={v} color={N.white} size={40} />
            </React.Fragment>
          ))}
        </div>
      </Camera>
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${vis(t, W(1232), W(1245)) * 0.55})` }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Tag x={960} y={540} a={W(1232)} b={W(1245)} text="ALL FROM ONE DECISION." color={N.red} size={130} />
      </div>
    </AbsoluteFill>
  );
};

const S_Tips: React.FC = () => (
  <Camera cam={[[W(1245), 800, 520, 1.15], [W(1264), 1050, 480, 1.0, 0.7], [W(1291), 1200, 480, 1.05, 0.6], [W(1296), 1500, 520, 1.05, 0.6], [W(1316), 1650, 520, 1.05, 0.6]]}>
    <Floor />
    <Room night={0} />
    <Tyler x={[[0, 560]]} poses={[[W(1245), "phone", "happy"], [W(1291), "think", "happy"], [W(1296), "point", "happy"], [W(1316), "wave", "happy"]]} />
    <Say x={700} y={330} a={W(1264)} b={W(1291)} text="CAN I DEFER A PAYMENT?" size={40} />
    <Ico I={PhoneCall} x={900} y={560} a={W(1264)} b={W(1333)} label="CALL BEFORE YOU MISS" color={N.mint} size={120} check={W(1270)} />
    <Ico I={RefreshCw} x={1230} y={560} a={W(1291)} b={W(1333)} label="REFINANCE" color={N.mint} size={120} check={W(1293)} />
    <Ico I={TagIcon} x={1560} y={560} a={W(1296)} b={W(1333)} label="SELL IT YOURSELF" color={N.mint} size={120} check={W(1300)} />
    <Ico I={Handshake} x={1890} y={560} a={W(1316)} b={W(1333)} label="HAND IT BACK" color={N.gold} size={120} />
    <Tag x={1560} y={720} a={W(1300)} b={W(1316)} text="BEATS AUCTION PRICES" color={N.mint} size={56} />
  </Camera>
);

const S_Disc: React.FC = () => (
  <Camera cam={[[W(1333), 960, 540, 0.9], [W(1340), 960, 540, 1.05, 6]]}>
    <Floor />
    <Ico I={Scale} x={960} y={220} a={W(1333)} b={W(1377)} color={N.gold} size={150} />
  </Camera>
);

const S_End: React.FC = () => (
  <Camera cam={[[W(1377), 960, 420, 1.0], [W(1380), 1100, 420, 0.9, 8]]}>
    <Floor />
    <div style={{ position: "absolute", left: 1500, top: 520, width: 360, height: 360, borderRadius: 400, background: `radial-gradient(circle, ${N.gold}aa, ${N.gold}00 70%)` }} />
    <Tyler x={[[W(1377), 400], [W(1378), 1700, 10]]} s={0.6} poses={[[W(1377), "idle", "happy"]]} />
  </Camera>
);

const SCENES: SceneDef[] = [
  { at: 0, tr: "fade", el: S_Hook },
  { at: W(44), tr: "zoom", el: S_Title },
  { at: W(68), tr: "whip", el: S_Dealer },
  { at: W(106), tr: "whip", el: S_Drive },
  { at: W(111), tr: "whip", el: S_Kitchen },
  { at: W(130), tr: "zoom", el: S_Day1 },
  { at: W(194), tr: "whip", el: S_Day30 },
  { at: W(247), tr: "zoom", el: S_Contract },
  { at: W(281), tr: "whip", el: S_Day60 },
  { at: W(311), tr: "whip", el: S_Hide },
  { at: W(329), tr: "drop", el: S_Repo },
  { at: W(409), tr: "fade", el: S_Morning },
  { at: W(424), tr: "whip", el: S_Rules },
  { at: W(514), tr: "whip", el: S_Impound },
  { at: W(559), tr: "whip", el: S_Mail },
  { at: W(652), tr: "drop", el: S_Auction },
  { at: W(715), tr: "whip", el: S_Bank },
  { at: W(761), tr: "whip", el: S_Chain },
  { at: W(792), tr: "whip", el: S_Door },
  { at: W(804), tr: "drop", el: S_Court },
  { at: W(833), tr: "whip", el: S_Work },
  { at: W(874), tr: "whip", el: S_Gas },
  { at: W(904), tr: "drop", el: S_Jail },
  { at: W(940), tr: "whip", el: S_Warrant },
  { at: W(976), tr: "whip", el: S_Barn },
  { at: W(1035), tr: "zoom", el: S_Flash },
  { at: W(1054), tr: "whip", el: S_Mom },
  { at: W(1113), tr: "whip", el: S_Years },
  { at: W(1153), tr: "zoom", el: S_Recap },
  { at: W(1245), tr: "whip", el: S_Tips },
  { at: W(1333), tr: "fade", el: S_Disc },
  { at: W(1377), tr: "zoom", el: S_End },
];

/** World mood: green → amber → red, back to green for "what to do". */
const worldMood = (t: number) => {
  if (t < W(194)) return 0;
  if (t < W(281)) return 0.7 * clamp01((t - W(194)) / (W(281) - W(194)));
  if (t < W(343)) return 0.7 + 1.3 * clamp01((t - W(281)) / (W(343) - W(281)));
  if (t < W(1245)) return 2;
  return 2 - 2 * clamp01((t - W(1245)) / 2.5);
};
const nightAmt = (t: number) => {
  if (t < W(44)) return 1;
  if (t >= W(329) && t < W(409)) return 1;
  if ((t >= W(874) && t < W(904)) || (t >= W(976) && t < W(1035))) return 0.7;
  return 0;
};

const Hud: React.FC = () => {
  const t = useT();
  const o = vis(t, W(130), W(1153), 0.6);
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
  const frac = 0.04 + 0.96 * clamp01((t - W(130)) / (W(1153) - W(130)));
  const missed = t >= W(329) ? 3 : t >= W(281) ? 2 : 1;
  const score = Math.round(track(t, [[0, 742], [W(226), 631, 2.5], [W(290), 598, 1], [W(418), 560, 1], [W(822), 520, 1]]));
  const truck = t < W(418);
  const owes = t >= W(734) ? "$9,500" : t >= W(679) ? "$19,000" : "—";
  const col = moodColor(worldMood(t));
  const cell = (k: string, v: string, c: string) => (
    <div style={{ padding: "0 24px", borderLeft: "1px solid rgba(255,255,255,0.12)" }}>
      <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 15, letterSpacing: 3, color: "rgba(242,255,248,0.6)" }}>{k}</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 44, color: c, lineHeight: 1 }}>{v}</div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - o) * -40}px)`,
        opacity: o,
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(160deg, rgba(34,74,58,0.75), rgba(10,26,20,0.9))",
        border: `1.5px solid ${col}88`,
        borderRadius: 999,
        padding: "6px 14px 6px 6px",
        boxShadow: `0 0 30px ${col}33`,
      }}
    >
      <div style={{ position: "relative", width: 86, height: 86 }}>
        <Countdown x={43} y={43} size={86} frac={frac} label="" color={col} />
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 50, color: N.white, padding: "0 20px 0 14px", minWidth: 180 }}>{ph[1]}</div>
      {cell("MISSED", String(missed), missed > 1 ? N.red : N.gold)}
      {cell("CREDIT SCORE", String(score), score > 700 ? N.mint : score > 600 ? N.gold : N.red)}
      {cell("TRUCK", truck ? "✓ HIS" : "✕ GONE", truck ? N.mint : N.red)}
      {cell("STILL OWES", owes, owes === "—" ? "rgba(242,255,248,0.4)" : N.red)}
    </div>
  );
};

const Captions: React.FC = () => {
  const t = useT();
  if (t > W(1377) - 0.3) return null;
  const ph = PHRASES.find((p) => t >= W(p[0]) - 0.1 && t <= WE(p[1]) + 0.2);
  if (!ph) return null;
  const words = WORDS.slice(ph[0], ph[1] + 1);
  return (
    <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "rgba(2,12,8,0.75)", border: "1px solid rgba(90,240,176,0.25)", borderRadius: 18, padding: "8px 24px", fontFamily: BODY, fontWeight: 700, fontSize: 32, color: N.white }}>
        {words.map((w, i) => (
          <span key={i} style={{ marginRight: 9, color: t >= w.start - 0.05 ? N.white : "rgba(242,255,248,0.4)" }}>
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Screen-space cards that stay from the first version (kept short). */
const Cards: React.FC = () => (
  <>
    <RealCard x={1400} y={470} a={0.5} b={W(17) - 0.2} w={600} strikeAt={W(14)} stamp="STOP" />
    <RealCard x={1350} y={560} a={W(895)} b={W(904) + 0.3} w={520} declineAt={W(903)} />
    <TitleCard a={W(44)} b={W(68) - 0.3} />
    <NameTag a={W(70)} b={W(88)} name="TYLER" sub="27 · COLUMBUS, OHIO" />
    <Notice at={W(172)} b={W(190)} title="Auto Loan" body="Your payment is past due. A late fee was added." />
    <Contract a={W(250)} b={W(281) - 0.2} hl={W(257)} />
    <RubberStamp at={W(269)} b={W(281) - 0.2} text="DEFAULT" y={190} x={260} size={130} />
    <MissedCalls a={W(290)} b={W(311) - 0.2} to={23} />
    <BigClock a={W(343)} b={W(357) - 0.2} text="3:12 AM" />
    <Stamp a={W(424)} b={W(436)} kicker="REPO AGENTS HAVE" text="RULES TOO" color={N.mint} />
    <RubberStamp at={W(822)} b={W(833) - 0.2} text="DEFAULT JUDGMENT" size={120} />
    <Stamp a={W(833)} b={W(845)} kicker="TOOL #1" text="WAGE GARNISHMENT" color={N.red} />
    <Paycheck a={W(856)} b={W(874) - 0.2} cutAt={W(857)} />
    <Stamp a={W(874)} b={W(886)} kicker="TOOL #2" text="BANK LEVY" color={N.red} />
    <BigWords
      dx={260}
      items={[
        { at: W(910), to: W(921) - 0.1, text: "CAN TYLER GO TO JAIL?", size: 120 },
        { at: W(921), to: W(934) - 0.1, text: "NO.", color: N.mint, size: 300 },
        { at: W(934), to: W(940) - 0.1, text: "BUT THERE'S A CATCH.", color: N.gold, size: 120 },
      ]}
    />
    <Stamp a={W(940)} b={W(950)} kicker="CATCH #1" text="IGNORING THE JUDGE" color={N.red} />
    <Stamp a={W(976)} b={W(990)} kicker="CATCH #2" text="HIDING THE TRUCK" color={N.red} />
    <Statement
      a={W(1026)}
      b={W(1035) - 0.2}
      size={60}
      width={1200}
      text={
        <>
          <span style={{ color: N.mint }}>Owing the debt</span> isn't a crime.
          <br />
          <span style={{ color: N.red }}>Hiding the collateral</span> can be.
        </>
      }
    />
    <Statement a={W(1077)} b={W(1100)} kicker="CO-SIGNING = OWING" text="The lender can collect from the co-signer, sometimes without going after the borrower first." />
    <Stamp a={W(1245)} b={W(1264)} kicker="WHAT PEOPLE LEARN TOO LATE" text="ACT EARLY" color={N.mint} />
    <Statement
      a={W(1335)}
      b={W(1377) - 0.2}
      kicker="DISCLAIMER"
      size={36}
      text="General information, not financial or legal advice. Laws vary by state. Facing a repossession or lawsuit? Talk to a licensed attorney, legal aid office, or nonprofit credit counselor."
    />
    <EndCard a={W(1377)} nextAt={W(1402)} b={END} />
  </>
);

const TRANSITION_SFX = SCENES.slice(1).map((s) => ({ at: s.at - 0.15, src: s.tr === "drop" ? "sfx/rm-whip.wav" : "sfx/rm-whoosh.wav", vol: 0.32 }));

export const NeonEpisode2: React.FC = () => {
  const t = useT();
  return (
    <ThemeCtx.Provider value="neon">
      <AbsoluteFill style={{ backgroundColor: N.bg }}>
        <World mood={worldMood(t)} night={nightAmt(t)} />
        <Scenes list={SCENES} />
        <Cards />
        <Hud />
        <Captions />
        <Audio src={staticFile("vo/narration.mp3")} />
        <Score />
        {[...SFX, ...TRANSITION_SFX].map((x, i) => (
          <Sequence key={i} from={Math.max(0, Math.round(x.at * FPS))} durationInFrames={FPS * 4} layout="none">
            <Audio src={staticFile(x.src)} volume={x.vol} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

