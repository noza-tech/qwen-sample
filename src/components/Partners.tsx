import { useRef, useState } from "react";
import { MaskLines, Reveal } from "../lib/motion";
import { IMG } from "../lib/images";

/* fictional partner wordmarks with distinct type treatments */
const AIRLINES: { name: string; cls: string }[] = [
  { name: "POLARIS AIR", cls: "font-display tracking-wide" },
  { name: "Coral Airways", cls: "font-body font-bold italic" },
  { name: "KESTREL", cls: "font-mono font-bold tracking-[0.3em]" },
  { name: "Sunda Cargo", cls: "font-display" },
  { name: "PACIFIC RIDGE", cls: "font-body font-bold tracking-widest" },
  { name: "AeroLanka", cls: "font-body italic font-semibold" },
  { name: "TRANSMERIDIAN", cls: "font-mono font-bold" },
  { name: "Jet Oriole", cls: "font-display tracking-wider" },
  { name: "NORTHLIGHT", cls: "font-body font-bold tracking-[0.25em]" },
  { name: "Zephyr Line", cls: "font-body italic" },
];

const SHIPLINES: { name: string; cls: string }[] = [
  { name: "BOREAL LINE", cls: "font-display tracking-wide" },
  { name: "TransPac Co.", cls: "font-body font-bold" },
  { name: "HANSEATIC", cls: "font-mono font-bold tracking-[0.25em]" },
  { name: "Southern Cross Shipping", cls: "font-body font-semibold italic" },
  { name: "ORCA CARRIER", cls: "font-display" },
  { name: "Meridian Marine", cls: "font-body font-bold tracking-widest" },
  { name: "BASS STRAIT", cls: "font-mono font-bold" },
  { name: "Coral Sea Line", cls: "font-body italic font-semibold" },
  { name: "ANTARCTIC", cls: "font-display tracking-[0.2em]" },
  { name: "Harbour & Hull", cls: "font-body font-bold" },
];

function LogoRow({ items, reverse = false, dur = 40 }: { items: { name: string; cls: string }[]; reverse?: boolean; dur?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee py-2" aria-hidden="true">
      <div className={`marquee-track items-center gap-14 ${reverse ? "rev" : ""}`} style={{ ["--mq-dur" as string]: `${dur}s` }}>
        {doubled.map((l, i) => (
          <span
            key={i}
            className={`whitespace-nowrap text-2xl md:text-[1.8rem] text-dim/70 hover:text-bone transition-colors duration-300 cursor-default ${l.cls}`}
          >
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Partners() {
  return (
    <section id="network" className="relative scroll-mt-28 bg-coal border-y border-bone/10 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 pt-20 md:pt-28 pb-6">
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-5">Our partners</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="font-display uppercase text-bone leading-[0.95] text-4xl md:text-6xl xl:text-7xl"
              lines={[<>The lanes we</>, <>run <span className="text-ember">every day.</span></>]}
            />
          </div>
          <Reveal delay={150} className="lg:col-span-4 lg:col-start-9 lg:pt-14">
            <p className="text-dim leading-relaxed">
              Contracted space on major airlines and shipping lines means your
              cargo moves on schedule — even when capacity gets tight.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-coal to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-coal to-transparent z-10" />
        <div className="border-t border-bone/10 py-6">
          <div className="max-w-[1500px] mx-auto px-5 md:px-10 mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-dim">
            ✈ Airlines
          </div>
          <LogoRow items={AIRLINES} dur={36} />
        </div>
        <div className="border-t border-bone/10 py-6">
          <div className="max-w-[1500px] mx-auto px-5 md:px-10 mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-dim">
            ⚓ Shipping lines
          </div>
          <LogoRow items={SHIPLINES} reverse dur={44} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- insights rail ---------------- */

const POSTS = [
  {
    img: IMG.containers,
    cat: "Case study",
    date: "Aug 2026",
    title: "Cutting import delays and storage costs across 700+ containers",
    blurb: "How a pre-clearance programme saved a national retailer six figures in demurrage.",
  },
  {
    img: IMG.battery,
    cat: "Case study",
    date: "Jul 2026",
    title: "Grid-scale battery logistics for renewable infrastructure",
    blurb: "Dangerous-goods compliant moves for a 200 MWh storage project.",
  },
  {
    img: IMG.truckDawn,
    cat: "Case study",
    date: "Jul 2026",
    title: "A speed-to-market import programme for a new truck launch",
    blurb: "Coordinated RO/RO and air charters hit a fixed national launch date.",
  },
  {
    img: IMG.port,
    cat: "Asia Pacific",
    date: "Jul 2026",
    title: "Fleet-wide efficiency deals and what they mean for rates",
    blurb: "Decarbonisation commitments are quietly reshaping carrier pricing.",
  },
  {
    img: IMG.ship,
    cat: "Global",
    date: "Jun 2026",
    title: "Retailers race the tariff clock as spot rates climb",
    blurb: "Front-loading volumes are tightening equipment across trans-Pacific lanes.",
  },
  {
    img: IMG.warehouse,
    cat: "Industry",
    date: "Jun 2026",
    title: "Blank sailings are now a fact of life — plan around them",
    blurb: "Schedule reliability tips for shippers in a capacity-managed market.",
  },
];

export function Insights() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = () => {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 20);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
  };

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(460, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section id="insights" className="relative scroll-mt-28 bg-ink overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 pt-24 md:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-5">Insights</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="font-display uppercase text-bone leading-[0.95] text-4xl md:text-6xl xl:text-7xl"
              lines={[<>What's moving</>, <>in <span className="text-ember">your trade.</span></>]}
            />
          </div>
          <Reveal delay={150} className="flex items-center gap-3">
            <button
              onClick={() => nudge(-1)}
              disabled={!canLeft}
              aria-label="Scroll insights left"
              className="w-12 h-12 rounded-full border border-bone/25 grid place-items-center text-bone transition-all duration-300 hover:border-ember hover:text-ember disabled:opacity-30 disabled:hover:border-bone/25 disabled:hover:text-bone"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 8H3M7 3.5 2.5 8 7 12.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
              onClick={() => nudge(1)}
              disabled={!canRight}
              aria-label="Scroll insights right"
              className="w-12 h-12 rounded-full border border-bone/25 grid place-items-center text-bone transition-all duration-300 hover:border-ember hover:text-ember disabled:opacity-30 disabled:hover:border-bone/25 disabled:hover:text-bone"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <a href="#contact" className="ml-2 font-mono text-xs uppercase tracking-[0.18em] text-dim hover:text-ember transition-colors underline-offset-4 hover:underline">
              Get briefings →
            </a>
          </Reveal>
        </div>
      </div>

      <Reveal dir="up">
        <div
          ref={railRef}
          onScroll={update}
          className="flex gap-5 overflow-x-auto pb-24 md:pb-32 snap-x snap-mandatory scrollbar-none px-5 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ paddingLeft: "max(1.25rem, calc((100vw - 1500px) / 2 + 2.5rem))" }}
        >
          {POSTS.map((p, i) => (
            <article
              key={p.title}
              className="group snap-start shrink-0 w-[82vw] sm:w-[420px] rounded-lg overflow-hidden border border-bone/12 bg-coal hover:border-ember/50 transition-colors duration-500"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover img-duotone transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" />
                <span className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.18em] bg-ink/80 backdrop-blur-sm border border-bone/15 text-bone px-3 py-1.5 rounded-full">
                  {p.cat}
                </span>
                <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-[0.18em] text-bone/70">
                  {p.date}
                </span>
              </div>
              <div className="p-6 md:p-7">
                <h3 className="font-display uppercase text-bone text-xl md:text-2xl leading-snug group-hover:text-ember transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="mt-3 text-dim text-sm leading-relaxed">{p.blurb}</p>
                <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ember opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400">
                  Read briefing
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </article>
          ))}
          {/* end card */}
          <div className="snap-start shrink-0 w-[70vw] sm:w-[360px] rounded-lg border border-dashed border-bone/25 grid place-items-center p-8 text-center">
            <div>
              <div className="font-display uppercase text-bone text-2xl mb-2">Stay ahead of the lanes</div>
              <p className="text-dim text-sm mb-6">Monthly market briefings, straight to your inbox.</p>
              <a href="#contact" className="btn-fill inline-flex items-center gap-2 bg-bone text-ink rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] hover:text-bone transition-colors" style={{ ["--btn-fill" as string]: "var(--color-ember)" }}>
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function PartnersInsights() {
  return (
    <>
      <Partners />
      <Insights />
    </>
  );
}
