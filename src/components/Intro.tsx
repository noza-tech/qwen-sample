import { useEffect, useRef, useState } from "react";
import {
  MaskLines,
  Reveal,
  prefersReducedMotion,
  useCountUp,
  useInView,
  useSectionProgress,
} from "../lib/motion";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIO = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function Wheel({ cx, cy, r = 21 }: { cx: number; cy: number; r?: number }) {
  return (
    <g className="wheel" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <circle cx={cx} cy={cy} r={r} fill="#14181f" stroke="#2c313c" strokeWidth="5" />
      <circle cx={cx} cy={cy} r={r * 0.52} fill="#20242e" stroke="#3a4150" strokeWidth="2.5" />
      {[0, 60, 120].map((a) => (
        <line
          key={a}
          x1={cx - r * 0.5 * Math.cos((a * Math.PI) / 180)}
          y1={cy - r * 0.5 * Math.sin((a * Math.PI) / 180)}
          x2={cx + r * 0.5 * Math.cos((a * Math.PI) / 180)}
          y2={cy + r * 0.5 * Math.sin((a * Math.PI) / 180)}
          stroke="#4a5262"
          strokeWidth="2.5"
        />
      ))}
      <circle cx={cx} cy={cy} r={3.4} fill="#8e939d" />
    </g>
  );
}

function Truck({ spin }: { spin: number }) {
  return (
    <svg
      viewBox="0 0 700 235"
      className="w-full shrink-0"
      style={{ ["--spin" as string]: `${spin}deg` }}
      aria-label="Meridian Carriers semi-trailer truck"
    >
      <style>{`.wheel{transform:rotate(var(--spin))}`}</style>
      {/* trailer body */}
      <rect x="18" y="30" width="430" height="128" rx="6" fill="#ff5b1f" />
      {Array.from({ length: 26 }).map((_, i) => (
        <line key={i} x1={34 + i * 16} y1="38" x2={34 + i * 16} y2="150" stroke="#d94a15" strokeWidth="3" opacity="0.55" />
      ))}
      <rect x="18" y="30" width="430" height="128" rx="6" fill="none" stroke="#1b120c" strokeWidth="3" />
      <text x="233" y="108" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="44" letterSpacing="6" fill="#0b0d12">
        MERIDIAN
      </text>
      <text x="233" y="136" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="13" letterSpacing="4" fill="#5e2408">
        CARRIERS · MC 4410
      </text>
      <rect x="10" y="158" width="448" height="14" rx="4" fill="#20242e" />
      {/* cab */}
      <path d="M458 62 h96 q10 0 16 8 l26 34 q4 6 4 14 v32 q0 8 -8 8 h-134 z" fill="#14181f" stroke="#2c313c" strokeWidth="3" />
      <path d="M470 72 h78 q6 0 10 5 l20 27 h-108 z" fill="#3f6ad8" opacity="0.9" />
      <rect x="452" y="150" width="148" height="22" rx="4" fill="#20242e" />
      <rect x="452" y="40" width="8" height="36" rx="3" fill="#2c313c" />
      <rect x="596" y="140" width="10" height="20" rx="3" fill="#f5b72f" />
      <rect x="452" y="118" width="14" height="26" rx="3" fill="#2c313c" />
      {/* wheels */}
      <Wheel cx={70} cy={186} />
      <Wheel cx={128} cy={186} />
      <Wheel cx={352} cy={186} />
      <Wheel cx={410} cy={186} />
      <Wheel cx={500} cy={186} />
      <Wheel cx={560} cy={186} />
    </svg>
  );
}

function ReachStacker({ boomAngle }: { boomAngle: number }) {
  return (
    <svg viewBox="0 0 360 300" className="w-full" aria-label="Reach stacker">
      {/* boom group pivots at (228,160) */}
      <g transform={`rotate(${boomAngle} 228 160)`}>
        <line x1="228" y1="160" x2="72" y2="88" stroke="#ff5b1f" strokeWidth="15" strokeLinecap="round" />
        <line x1="152" y1="125" x2="50" y2="78" stroke="#d94a15" strokeWidth="10" strokeLinecap="round" />
        {/* spreader */}
        <rect x="14" y="66" width="88" height="13" rx="3" fill="#20242e" stroke="#3a4150" strokeWidth="2" />
        <rect x="24" y="79" width="10" height="9" fill="#3a4150" />
        <rect x="82" y="79" width="10" height="9" fill="#3a4150" />
      </g>
      {/* hydraulic */}
      <line x1="252" y1="205" x2="170" y2="128" stroke="#3a4150" strokeWidth="9" strokeLinecap="round" />
      {/* body */}
      <rect x="196" y="140" width="116" height="74" rx="10" fill="#14181f" stroke="#2c313c" strokeWidth="3" />
      <rect x="210" y="152" width="46" height="30" rx="4" fill="#3f6ad8" opacity="0.85" />
      <rect x="304" y="150" width="34" height="64" rx="6" fill="#20242e" />
      {/* chassis + wheels */}
      <rect x="150" y="214" width="196" height="34" rx="8" fill="#20242e" />
      <Wheel cx={196} cy={262} r={26} />
      <Wheel cx={306} cy={262} r={26} />
      <circle cx="196" cy="262" r="6" fill="#8e939d" />
      <circle cx="306" cy="262" r="6" fill="#8e939d" />
    </svg>
  );
}

const MILESTONES = ["Origin pickup", "Port of Sydney", "M5 linehaul", "Customs gate", "Final delivery"];

function TruckScene() {
  const { ref, progress } = useSectionProgress();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduce = prefersReducedMotion();
  const p = reduce ? 0.72 : progress;

  const [dims, setDims] = useState({ s: 1, bedOffset: 16, bedPx: 78, gripPx: 380, gripLeft: 70, stackerPct: 26 });
  useEffect(() => {
    const measure = () => {
      const w = stageRef.current?.clientWidth ?? 1200;
      const truckW = Math.min(700, w * 0.88);
      const s = truckW / 700;
      const stackerW = Math.min(360, w * 0.42);
      const stackerPct = (stackerW / w) * 100;
      setDims({
        s,
        bedOffset: ((truckW * 0.333) / w) * 100,
        bedPx: 78 * s,
        gripPx: 300 * s + 70,
        gripLeft: 100 - stackerPct * 0.92 - 4,
        stackerPct,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // choreography
  const pIn = easeIO(seg(p, 0.02, 0.3));
  const pLoad = easeIO(seg(p, 0.34, 0.58));
  const pOut = easeIO(seg(p, 0.64, 0.98));
  const pBoomDown = easeIO(seg(p, 0.3, 0.56));
  const pBoomUp = easeIO(seg(p, 0.6, 0.74));
  const boomAngle = pBoomUp > 0 ? lerp(6, -16, pBoomUp) : lerp(-16, 6, pBoomDown);

  const truckLeft = pOut > 0 ? lerp(26, 118, pOut) : lerp(-62, 26, pIn);
  const dist = 88 * pIn + 92 * pOut;
  const spin = dist * 30;
  const moving = dist > 0.5 && pLoad < 1;
  const speed = moving ? Math.round(22 + 74 * (pOut > 0 ? pOut : pIn)) : 0;

  const contLeft = lerp(dims.gripLeft, truckLeft + dims.bedOffset, pLoad);
  const contBottom = lerp(dims.gripPx, dims.bedPx, pLoad);
  const contRot = lerp(-5, 0, pLoad);

  const phase = p < 0.32 ? "Linehaul arriving" : p < 0.62 ? "Loading container MC 4410" : "Departing — loaded";
  const activeMilestone = Math.min(4, Math.floor(p * 5.2));

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div ref={stageRef} className="absolute inset-0">
          {/* backdrop */}
          <div className="absolute inset-0 blueprint-grid opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_62%,rgba(63,106,216,0.1),transparent_70%)]" />
          {/* distant terminal silhouette */}
          <svg className="absolute bottom-[13vh] left-0 w-full h-40 md:h-56 text-bone/[0.05]" viewBox="0 0 1200 200" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
            <path d="M60 200V70h14V40h10v30h96V40h10v30h14v130h-24v-96H96v96zM360 200v-60h120v60h-20v-40h-80v40zM700 200V60h12v-24h8v24h110v-24h8v24h12v140h-22v-104H744v104zM1020 200v-70h140v70h-24v-46h-92v46z" />
          </svg>

          <div className="relative h-full max-w-[1500px] mx-auto px-5 md:px-10 flex flex-col justify-center">
            {/* heading + speedo */}
            <div className="flex items-end justify-between gap-6 mb-6 md:mb-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-3">
                  From countless journeys, clarity
                </p>
                <h3 className="font-display uppercase text-bone text-3xl md:text-5xl leading-none">
                  Every kilometre, accounted for.
                </h3>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-dim flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${speed > 0 ? "bg-ember blink-dot" : "bg-mint"}`} />
                  {phase}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-ember text-6xl md:text-8xl leading-none tabular-nums">
                  {String(speed).padStart(2, "0")}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim mt-1">km/h · linehaul</div>
              </div>
            </div>

            {/* stage */}
            <div className="relative">
              {/* reach stacker */}
              <div
                className="absolute z-10"
                style={{ right: "0.5%", bottom: "13vh", width: `${Math.min(dims.stackerPct, 30)}%`, minWidth: 150 }}
              >
                <ReachStacker boomAngle={boomAngle} />
              </div>

              {/* container */}
              <div
                className="absolute z-20 will-change-transform"
                style={{
                  left: `${contLeft}%`,
                  bottom: `calc(13vh + ${contBottom}px)`,
                  width: 250 * dims.s,
                  height: 100 * dims.s,
                  transform: `translateX(-50%) rotate(${contRot}deg)`,
                  transition: reduce ? undefined : "left 0.12s linear, bottom 0.12s linear",
                }}
              >
                <div className="w-full h-full rounded-[3px] bg-ember border-2 border-[#1b120c] relative overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                  <div className="absolute inset-0 opacity-50" style={{ background: "repeating-linear-gradient(90deg, #d94a15 0 6px, transparent 6px 16px)" }} />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="font-display uppercase text-ink text-sm md:text-lg tracking-[0.18em]">Meridian</span>
                  </div>
                  <span className="absolute bottom-1 right-2 font-mono text-[8px] text-[#5e2408]">MC 4410 · 40′HC</span>
                </div>
              </div>

              {/* truck */}
              <div
                className="absolute z-10 will-change-transform"
                style={{
                  left: `${truckLeft}%`,
                  bottom: "13vh",
                  width: `min(700px, 88vw)`,
                  transition: reduce ? undefined : "left 0.12s linear",
                }}
              >
                <Truck spin={spin} />
              </div>

              {/* road */}
              <svg className="w-full h-10 md:h-14 mt-[13vh]" preserveAspectRatio="none" viewBox="0 0 1200 40">
                <line x1="0" y1="8" x2="1200" y2="8" stroke="#2c313c" strokeWidth="3" />
                <line
                  x1="0" y1="26" x2="1200" y2="26"
                  stroke="#8e939d" strokeWidth="3" strokeDasharray="34 26"
                  className={`road-line ${moving ? "fast" : ""}`}
                  style={{ animationPlayState: moving ? "running" : "paused" }}
                />
              </svg>

              {/* milestones */}
              <div className="mt-6 md:mt-10">
                <div className="relative h-px bg-bone/15">
                  <div className="absolute inset-y-0 left-0 bg-ember" style={{ width: `${p * 100}%` }} />
                  {MILESTONES.map((m, i) => {
                    const left = (i / (MILESTONES.length - 1)) * 100;
                    const on = i <= activeMilestone;
                    return (
                      <div key={m} className="absolute top-0" style={{ left: `${left}%` }}>
                        <span
                          className={`absolute -top-[5px] w-[11px] h-[11px] rounded-full border-2 transition-all duration-300 ${
                            on ? "bg-ember border-ember shadow-[0_0_14px_rgba(255,91,31,0.7)]" : "bg-ink border-bone/30"
                          }`}
                          style={{ transform: "translateX(-50%)" }}
                        />
                        <span
                          className={`absolute top-4 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] md:text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                            on ? "text-bone" : "text-dim/60"
                          }`}
                        >
                          {m}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  suffix,
  label,
  decimals = 0,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const v = useCountUp(value, inView, 1700, decimals);
  return (
    <Reveal delay={delay}>
      <div ref={ref} className="border-l-2 border-ember/70 pl-5 md:pl-6">
        <div className="font-display text-bone text-5xl md:text-6xl leading-none tabular-nums">
          {Number(v).toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
          <span className="text-ember">{suffix}</span>
        </div>
        <div className="mt-2.5 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-dim">{label}</div>
      </div>
    </Reveal>
  );
}

export default function Intro() {
  return (
    <section id="manifesto" className="relative bg-ink">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 pt-24 md:pt-36 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-ember" /> The Meridian standard
              </p>
            </Reveal>
            <MaskLines
              as="h2"
              className="font-display uppercase text-bone leading-[0.95] text-5xl md:text-7xl xl:text-[5.4rem]"
              lines={[
                <>We move freight.</>,
                <>
                  We <span className="text-ember">answer</span> for it.
                </>,
              ]}
            />
          </div>
          <div className="lg:col-span-5 space-y-6 lg:pt-10">
            <Reveal delay={150}>
              <p className="text-fog/90 text-lg leading-relaxed">
                Every service lives under one roof with one team on the hook — so
                your supply chain runs the way your business needs it to: on
                schedule, in view, and without excuses.
              </p>
            </Reveal>
            <Reveal delay={250}>
              <p className="text-dim leading-relaxed">
                When something goes sideways, you make one call — the crew already
                inside your shipment makes it right. No vendor roulette, no
                "that's the other operator's problem." One manifest, one owner,
                door to door.
              </p>
            </Reveal>
            <Reveal delay={340}>
              <a
                href="#why-us"
                className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-ember"
              >
                <span className="w-10 h-10 rounded-full border border-ember/50 grid place-items-center group-hover:bg-ember group-hover:text-ink transition-all duration-300">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M8 2v11M3.5 9 8 13.5 12.5 9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                More about us
              </a>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid sm:grid-cols-3 gap-8 md:gap-10">
          <Stat value={2400} suffix="+" label="Shipments per month" />
          <Stat value={98.4} suffix="%" label="On-time delivery rate" decimals={1} delay={120} />
          <Stat value={12} suffix="+" label="Years on the road" delay={240} />
        </div>
      </div>

      <TruckScene />
    </section>
  );
}
