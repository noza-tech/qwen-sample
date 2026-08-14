import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MaskLines } from "../lib/motion";
import { IMG } from "../lib/images";

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden flex flex-col">
      {/* backdrop */}
      <div className="absolute inset-0">
        <motion.div style={{ y: yImg }} className="absolute inset-[-6%]">
          <img
            src={IMG.interchange}
            alt="Elevated highway interchange with freight traffic"
            className="w-full h-full object-cover img-duotone kenburns"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/72 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-ink/60" />
      </div>

      {/* side manifest */}
      <motion.div
        style={{ opacity: fade }}
        className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-5 font-mono text-[10px] uppercase tracking-[0.3em] text-dim"
      >
        <span className="[writing-mode:vertical-rl] rotate-180">33.8688° S — 151.2093° E</span>
        <span className="w-px h-16 bg-bone/25" />
        <span className="[writing-mode:vertical-rl] rotate-180">Sydney · HQ</span>
      </motion.div>

      {/* vertical edge label */}
      <div className="hidden lg:block absolute left-8 bottom-28 z-10 [writing-mode:vertical-rl] rotate-180 font-mono text-[10px] uppercase tracking-[0.34em] text-dim">
        EST. 2013 — Freight · Customs · Linehaul
      </div>

      {/* content */}
      <motion.div
        style={{ y: yText, opacity: fade }}
        className="relative z-10 flex-1 flex flex-col justify-end max-w-[1500px] w-full mx-auto px-5 md:px-10 pb-10 pt-32"
      >
        <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-ember">
          <span className="w-2 h-2 rounded-full bg-ember blink-dot" />
          One operator · every leg of the journey
        </div>

        <MaskLines
          as="h1"
          stagger={110}
          lines={[
            <>Every leg,</>,
            <>
              one <span className="text-ember">crew.</span>
            </>,
          ]}
          className="font-display uppercase leading-[0.9] text-bone text-[15.5vw] md:text-[10.2vw] lg:text-[9.2rem] xl:text-[10.6rem]"
        />

        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <p className="max-w-md text-fog/90 text-base md:text-lg leading-relaxed">
            Freight forwarding, customs brokerage and linehaul transport — unified
            across APAC under one accountable team, from first pickup to final
            proof of delivery.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="btn-fill inline-flex items-center gap-3 bg-bone text-ink rounded-full px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] hover:text-bone transition-colors duration-300"
              style={{ ["--btn-fill" as string]: "var(--color-ember)" }}
            >
              Talk with us
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#services"
              className="btn-fill inline-flex items-center gap-3 border border-bone/30 text-bone rounded-full px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] hover:text-ink transition-colors duration-300"
            >
              Our services
            </a>
          </div>
        </div>
      </motion.div>

      {/* bottom status bar */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 border-t border-bone/12 bg-ink/55 backdrop-blur-sm"
      >
        <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-3.5 flex items-center gap-6 overflow-hidden font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-dim whitespace-nowrap">
          <span className="flex items-center gap-2 text-mint shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-mint blink-dot" /> Live ops
          </span>
          <span className="shrink-0">SYD → HKG · AWB 065-4471 8832 · departed</span>
          <span className="hidden md:inline shrink-0">MEL → SIN · FCL 40′ HC · customs released</span>
          <span className="hidden lg:inline shrink-0">AKL → LAX · priority air · 04h 12m in flight</span>
          <span className="hidden xl:inline shrink-0 text-ember">BNE linehaul · on schedule</span>
        </div>
      </motion.div>

      {/* scroll cue */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-10 hidden md:flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-dim">Scroll</span>
        <span className="w-px h-12 bg-bone/20 relative overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-ember animate-[scrollcue_1.6s_ease-in-out_infinite]" />
        </span>
        <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(220%)}}`}</style>
      </div>
    </section>
  );
}
