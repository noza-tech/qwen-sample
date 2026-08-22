import { useEffect, useState } from "react";
import { IMG } from "../lib/images";
import { prefersReducedMotion } from "../lib/motion";

const COUNTRIES = [
  "Australia",
  "New Zealand",
  "Hong Kong",
  "China",
  "Vietnam",
  "United States",
  "Thailand",
  "Germany",
  "United Kingdom",
  "Singapore",
  "Malaysia",
  "Japan",
];

const CITIES = [
  { code: "LAX", x: 13, y: 42 },
  { code: "HAM", x: 51, y: 28 },
  { code: "DXB", x: 60, y: 46 },
  { code: "HKG", x: 76, y: 48 },
  { code: "SIN", x: 73, y: 58 },
  { code: "SYD", x: 88, y: 76 },
];

function CountryRow({ reverse = false }: { reverse?: boolean }) {
  const list = [...COUNTRIES, ...COUNTRIES];
  return (
    <div className="overflow-hidden py-3 select-none" aria-hidden="true">
      <div className={`marquee-track items-baseline gap-8 ${reverse ? "reverse" : ""}`} style={{ width: "max-content" }}>
        {list.map((c, i) => (
          <span key={i} className="flex items-baseline gap-8 whitespace-nowrap">
            <span className={`font-display uppercase text-xl md:text-2xl ${reverse ? "text-dim" : "text-bone/90"}`}>{c}</span>
            <span className="text-ember text-sm">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const duration = reduce ? 420 : 1750;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setExiting(true), reduce ? 120 : 460);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => {
      setGone(true);
      onDone();
    }, prefersReducedMotion() ? 80 : 760);
    return () => clearTimeout(t);
  }, [exiting, onDone]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] bg-ink transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] ${
        exiting ? "-translate-y-full duration-700" : "duration-0"
      }`}
      aria-label="Loading Meridian Carriers"
    >
      {/* ember edge revealed during exit */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-ember" />

      <div className="h-full grid lg:grid-cols-[1.08fr_0.92fr]">
        {/* left — counter + countries */}
        <div className="flex flex-col p-6 md:p-10 lg:border-r border-bone/10 min-h-0">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-ember">work with us</span>
            <span className="font-display text-bone text-lg tracking-wide">
              M<span className="text-ember">—</span>C
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center -my-4">
            <div className="relative">
              <div className="font-display text-bone leading-[0.82] tabular-nums text-[clamp(7rem,23vw,19rem)]">
                {count}
                <span className="text-ember align-top text-[0.32em]">%</span>
              </div>
              <div className="absolute right-0 bottom-3 hidden md:block text-right">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">loading manifest</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-fog mt-1">
                  SYD → APAC → WORLD
                </div>
              </div>
            </div>
            <div className="mt-6 h-px bg-bone/15 relative overflow-hidden max-w-xl">
              <div className="absolute inset-y-0 left-0 bg-ember" style={{ width: `${count}%` }} />
            </div>
          </div>

          <div className="border-t border-bone/10 -mx-6 md:-mx-10 px-6 md:px-10">
            <CountryRow />
            <div className="border-t border-bone/10" />
            <CountryRow reverse />
          </div>
        </div>

        {/* right — dotted world map */}
        <div className="hidden lg:block relative overflow-hidden">
          <img
            src={IMG.map}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80 [mask-image:radial-gradient(85%_80%_at_55%_45%,black,transparent)]"
            style={{ transform: `scale(${1.06 - count / 2500})` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_40%,rgba(63,106,216,0.14),transparent_70%)]" />
          {CITIES.map((c, i) => (
            <div key={c.code} className="absolute" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
              <span className="absolute -inset-2 rounded-full border border-ember/50 animate-ping [animation-duration:2.6s]" style={{ animationDelay: `${i * 0.4}s` }} />
              <span className="block w-1.5 h-1.5 rounded-full bg-ember shadow-[0_0_12px_rgba(255,91,31,0.9)]" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-fog whitespace-nowrap">
                {c.code}
              </span>
            </div>
          ))}
          <div className="absolute bottom-8 right-10 text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim leading-loose">
              one crew · every mile
              <br />
              freight · customs · linehaul
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
