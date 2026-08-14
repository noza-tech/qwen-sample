import { MaskLines, Reveal, useCountUp, useInView, useSectionProgress } from "../lib/motion";

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
      className="w-[520px] md:w-[700px] shrink-0"
      style={{ ["--spin" as string]: `${spin}deg` }}
      aria-label="Meridian Carriers semi-trailer truck"
    >
      <style>{`.wheel{transform:rotate(var(--spin))}`}</style>
      {/* trailer body */}
      <g>
        <rect x="18" y="30" width="430" height="128" rx="6" fill="#ff5b1f" />
        {/* corrugation */}
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
        {/* chassis */}
        <rect x="10" y="158" width="448" height="14" rx="4" fill="#20242e" />
        <rect x="26" y="172" width="14" height="10" fill="#20242e" />
      </g>
      {/* cab */}
      <g>
        <path d="M458 62 h96 q10 0 16 8 l26 34 q4 6 4 14 v32 q0 8 -8 8 h-134 z" fill="#14181f" stroke="#2c313c" strokeWidth="3" />
        <path d="M470 72 h78 q6 0 10 5 l20 27 h-108 z" fill="#3f6ad8" opacity="0.85" />
        <path d="M470 72 h78 q6 0 10 5 l20 27 h-108 z" fill="url(#glass)" />
        <rect x="452" y="150" width="148" height="22" rx="4" fill="#20242e" />
        {/* exhaust + details */}
        <rect x="452" y="40" width="8" height="36" rx="3" fill="#2c313c" />
        <rect x="596" y="140" width="10" height="20" rx="3" fill="#f5b72f" />
        <rect x="452" y="118" width="14" height="26" rx="3" fill="#2c313c" />
      </g>
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fa3ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#274a9e" stopOpacity="0.9" />
        </linearGradient>
      </defs>
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

const MILESTONES = ["Origin pickup", "Port of Sydney", "M5 linehaul", "Customs gate", "Final delivery"];

function TruckScene() {
  const { ref, progress } = useSectionProgress();
  const speed = Math.round(progress * 96);
  const translate = -22 + progress * 74; // % of container width
  const activeMilestone = Math.min(4, Math.floor(progress * 5.2));

  return (
    <div ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* backdrop */}
        <div className="absolute inset-0 blueprint-grid opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_60%,rgba(63,106,216,0.1),transparent_70%)]" />

        <div className="relative max-w-[1500px] mx-auto w-full px-5 md:px-10">
          <div className="flex items-end justify-between gap-6 mb-4 md:mb-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-3">
                From countless journeys, clarity
              </p>
              <h3 className="font-display uppercase text-bone text-3xl md:text-5xl leading-none">
                Every kilometre, accounted for.
              </h3>
            </div>
            {/* speedometer */}
            <div className="text-right shrink-0">
              <div className="font-display text-ember text-6xl md:text-8xl leading-none tabular-nums">
                {String(speed).padStart(2, "0")}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim mt-1">km/h · linehaul</div>
            </div>
          </div>

          {/* truck + road */}
          <div className="relative">
            <div
              className="will-change-transform"
              style={{ transform: `translateX(${translate}%)`, transition: "transform 0.1s linear" }}
            >
              <Truck spin={progress * 2600} />
            </div>

            {/* road */}
            <svg className="w-full h-10 md:h-14 -mt-2" preserveAspectRatio="none" viewBox="0 0 1200 40">
              <line x1="0" y1="8" x2="1200" y2="8" stroke="#2c313c" strokeWidth="3" />
              <line
                x1="0" y1="26" x2="1200" y2="26"
                stroke="#8e939d" strokeWidth="3" strokeDasharray="34 26"
                className={progress > 0.02 ? "road-line fast" : "road-line"}
                style={{ animationPlayState: progress > 0.01 ? "running" : "paused" }}
              />
            </svg>

            {/* milestone track */}
            <div className="mt-6 md:mt-10">
              <div className="relative h-px bg-bone/15">
                <div className="absolute inset-y-0 left-0 bg-ember" style={{ width: `${progress * 100}%`, transition: "width 0.1s linear" }} />
                {MILESTONES.map((m, i) => {
                  const left = (i / (MILESTONES.length - 1)) * 100;
                  const on = i <= activeMilestone;
                  return (
                    <div key={m} className="absolute top-0" style={{ left: `${left}%` }}>
                      <span
                        className={`absolute -top-[5px] left-0 w-[11px] h-[11px] rounded-full border-2 transition-all duration-300 ${
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
              stagger={130}
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
                That means no finger-pointing between vendors. No delays that
                vanish into handoffs. Just one crew accountable from origin to
                destination — and a phone that gets picked up.
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

        {/* stats */}
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
