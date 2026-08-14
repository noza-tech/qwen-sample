import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReduced } from "../lib/motion";

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

function CountryRow({ speed = 30, reverse = false }: { speed?: number; reverse?: boolean }) {
  const items = [...COUNTRIES, ...COUNTRIES];
  return (
    <div className="marquee select-none" aria-hidden="true">
      <div
        className={`marquee-track items-baseline gap-10 ${reverse ? "rev" : ""}`}
        style={{ ["--mq-dur" as string]: `${speed}s` }}
      >
        {items.map((c, i) => (
          <span key={i} className="flex items-baseline gap-10">
            <span
              className={`font-display uppercase leading-none ${
                i % 3 === 0
                  ? "text-[3.2rem] md:text-[4.6rem] text-outline"
                  : i % 3 === 1
                  ? "text-[1.4rem] md:text-[1.9rem] text-bone/80"
                  : "text-[2.2rem] md:text-[3rem] text-ember/90"
              }`}
            >
              {c}
            </span>
            <span className="text-dim text-lg">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReduced();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 350);
      return () => clearTimeout(t);
    }
    let raf = 0;
    const start = performance.now();
    const dur = 2100;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(onDone, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-ink flex flex-col overflow-hidden"
      exit={{ y: "-100%", transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* dotted world field */}
      <div className="absolute inset-0 dot-field opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_42%,black_35%,transparent_78%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(63,106,216,0.14),transparent_70%)]" />

      {/* top manifest line */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 pt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
        <span>Meridian Carriers</span>
        <span className="hidden md:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ember blink-dot" />
          Establishing route…
        </span>
        <span>APAC → World</span>
      </div>

      {/* country marquees */}
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-4 md:gap-6">
        <CountryRow speed={26} />
        <CountryRow speed={38} reverse />
      </div>

      {/* counter */}
      <div className="relative z-10 flex items-end justify-between px-6 md:px-12 pb-6 md:pb-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim max-w-[220px] leading-relaxed hidden sm:block">
          One crew · every leg<br />Freight · Customs · Linehaul
        </div>
        <div className="font-display text-bone text-[22vw] md:text-[11rem] leading-[0.85] tabular-nums">
          {count}
        </div>
      </div>

      {/* progress rule */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-coal">
        <div
          className="h-full bg-ember transition-[width] duration-150 ease-out"
          style={{ width: `${count}%` }}
        />
      </div>
    </motion.div>
  );
}
