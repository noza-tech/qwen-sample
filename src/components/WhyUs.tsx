import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MaskLines, Reveal } from "../lib/motion";

/* ---------------- why us ---------------- */

const REASONS = [
  {
    title: "One point of contact",
    desc: "No chasing multiple vendors. A single dedicated crew runs your shipment from origin to destination.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="10" r="5" />
        <path d="M6 27c1.6-5.4 5.4-8 10-8s8.4 2.6 10 8" />
        <path d="M16 21v6M13 24h6" />
      </svg>
    ),
  },
  {
    title: "Full-chain visibility",
    desc: "Track freight in real time and get proactive updates before small issues become real delays.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20 10 12l5 5 6-8 7 9" />
        <circle cx="10" cy="12" r="2" /><circle cx="15" cy="17" r="2" /><circle cx="21" cy="9" r="2" />
        <path d="M4 26h24" opacity=".5" />
      </svg>
    ),
  },
  {
    title: "Compliance you can trust",
    desc: "Licensed brokers keep every consignment inside regulatory requirements across APAC jurisdictions.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3l10 4v7c0 7-4.2 11.6-10 14C10.2 25.6 6 21 6 14V7z" />
        <path d="M11.5 15.5l3.5 3.5 6-6.5" />
      </svg>
    ),
  },
  {
    title: "Transparent pricing",
    desc: "No hidden fees. Clear, competitive rates backed by responsive support throughout the shipment.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 26 26 6" />
        <circle cx="11" cy="11" r="2" /><circle cx="21" cy="21" r="2" />
        <path d="M8 4h8l12 12-8 8L8 12z" opacity=".55" />
      </svg>
    ),
  },
  {
    title: "Fast issue resolution",
    desc: "When the unexpected happens we don't point fingers — we solve it, immediately, and protect your timeline.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3 7 18h7l-2 11L24 13h-8z" />
      </svg>
    ),
  },
];

function WhyUs() {
  return (
    <section id="why-us" className="relative scroll-mt-28 bg-coal border-y border-bone/10">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-5">Why us</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="font-display uppercase text-bone leading-[0.95] text-4xl md:text-6xl xl:text-7xl"
              lines={[<>Logistics that pulls</>, <>its <span className="text-ember">weight.</span></>]}
            />
          </div>
          <Reveal delay={150} className="lg:col-span-4 lg:col-start-9 lg:pt-14">
            <p className="text-dim leading-relaxed">
              Five commitments we make on every consignment — whether it's a
              single pallet or a full project programme.
            </p>
          </Reveal>
        </div>

        <div>
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 70}>
              <div
                className={`group grid md:grid-cols-12 items-center gap-4 md:gap-8 py-7 md:py-8 border-t border-bone/12 transition-all duration-500 hover:bg-slab/60 hover:px-4 md:hover:px-6 ${
                  i === REASONS.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="md:col-span-1 font-mono text-xs text-dim group-hover:text-ember transition-colors">0{i + 1}</span>
                <span className="md:col-span-1 text-dim group-hover:text-ember transition-colors duration-300">{r.icon}</span>
                <h3 className="md:col-span-4 font-display uppercase text-bone text-2xl md:text-3xl leading-tight">{r.title}</h3>
                <p className="md:col-span-5 text-dim leading-relaxed text-[15px]">{r.desc}</p>
                <span className="hidden md:grid md:col-span-1 place-items-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-dim transition-all duration-300 group-hover:text-ember group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M4 12h15M13 5.5 19.5 12 13 18.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- sky / plane ---------------- */

function Cloud({ className, scale = 1, opacity = 0.9 }: { className: string; scale?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 200 70" className={className} style={{ transform: `scale(${scale})`, opacity }} fill="#e9e4d8" aria-hidden="true">
      <path d="M20 60c-12 0-18-8-15-16 2-7 9-10 15-9 1-12 12-19 23-17 6-10 22-13 31-5 8-6 21-5 27 3 10-3 21 2 24 11 8-1 15 4 16 12 6 1 10 6 9 12-1 5-6 9-12 9z" />
    </svg>
  );
}

function Plane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 120" className={className} fill="none" aria-label="Cargo aircraft">
      {/* contrail */}
      <path d="M10 60h70" stroke="#e9e4d8" strokeOpacity=".25" strokeWidth="3" strokeDasharray="14 12" className="road-line" />
      {/* fuselage */}
      <path d="M80 52 C110 40 200 38 262 46 C290 50 306 56 312 60 C306 64 290 70 262 74 C200 82 110 80 80 68 C72 64 72 56 80 52Z" fill="#e9e4d8" />
      {/* tail */}
      <path d="M92 52 L64 18 L88 18 L120 50Z" fill="#e9e4d8" />
      <path d="M92 68 L74 92 L92 92 L116 70Z" fill="#c9cdd4" />
      {/* tail fin accent */}
      <path d="M70 20 L88 20 L100 34 L82 34Z" fill="#ff5b1f" />
      {/* wings */}
      <path d="M188 56 L130 108 L158 108 L226 60Z" fill="#c9cdd4" />
      <path d="M188 60 L140 12 L166 12 L224 56Z" fill="#e9e4d8" />
      {/* engines */}
      <ellipse cx="176" cy="22" rx="14" ry="7" fill="#1a1e27" stroke="#e9e4d8" strokeWidth="2" />
      <ellipse cx="166" cy="98" rx="14" ry="7" fill="#1a1e27" stroke="#c9cdd4" strokeWidth="2" />
      {/* cockpit */}
      <path d="M292 52 C300 54 306 57 310 60 C306 62 300 64 292 65Z" fill="#1a1e27" />
      {/* livery */}
      <path d="M96 62 H280" stroke="#ff5b1f" strokeWidth="4" strokeLinecap="round" />
      <text x="130" y="56" fontFamily="'Space Mono', monospace" fontSize="11" letterSpacing="3" fill="#1a1e27">MERIDIAN</text>
    </svg>
  );
}

function SkySection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const planeX = useTransform(scrollYProgress, [0, 1], ["-30%", "60%"]);
  const planeY = useTransform(scrollYProgress, [0, 0.5, 1], [60, -20, -80]);
  const cloudA = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const cloudB = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const cloudC = useTransform(scrollYProgress, [0, 1], ["0%", "-32%"]);

  return (
    <div ref={ref} className="relative overflow-hidden bg-[#0e1420]">
      {/* sky gradient + stars */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b0d12_0%,#101a2e_45%,#0b0d12_100%)]" />
      <div className="absolute inset-0 dot-field opacity-25 [mask-image:radial-gradient(80%_70%_at_50%_40%,black,transparent)]" />

      <div className="relative max-w-[1500px] mx-auto px-5 md:px-10 py-28 md:py-40">
        <motion.div style={{ x: cloudA }} className="absolute top-10 left-[6%] w-52 md:w-72 cloud-drift" aria-hidden="true">
          <Cloud className="w-full opacity-[0.14]" />
        </motion.div>
        <motion.div style={{ x: cloudB }} className="absolute top-[46%] right-[4%] w-64 md:w-96 cloud-drift" aria-hidden="true">
          <Cloud className="w-full opacity-[0.1]" scale={1.1} />
        </motion.div>
        <motion.div style={{ x: cloudC }} className="absolute bottom-8 left-[28%] w-40 md:w-56 cloud-drift" aria-hidden="true">
          <Cloud className="w-full opacity-[0.12]" scale={0.85} />
        </motion.div>

        <motion.div style={{ x: planeX, y: planeY }} className="relative z-10 mb-16 md:mb-24 float-y">
          <Plane className="w-56 md:w-80" />
        </motion.div>

        <div className="relative z-10 max-w-3xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-5">Air · Sea · Land — one manifest</p>
          </Reveal>
          <MaskLines
            as="h2"
            className="font-display uppercase text-bone leading-[0.95] text-4xl md:text-6xl xl:text-7xl"
            lines={[<>Whichever way it flies,</>, <>sails or rolls — <span className="text-ember">we're on it.</span></>]}
          />
          <Reveal delay={200}>
            <p className="mt-7 text-fog/85 text-lg leading-relaxed max-w-xl">
              Mode is a detail. Outcome is the contract. We choose the lane,
              book the space, clear the border and drive the last mile — you get
              one reference number and one number to call.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ---------------- testimonials ---------------- */

const QUOTES = [
  {
    quote:
      "Our business wouldn't run the same without this crew. They tailor every consignment on its merits, and our dedicated account manager actually knows our operation. That personal service is something we never got from the big players.",
    name: "Thomas Munro",
    role: "Director",
    company: "Picha Group",
    initials: "TM",
    tone: "bg-ember text-ink",
  },
  {
    quote:
      "A first-time shipment into a major infrastructure programme threw up uncharted territory. Three months of discovery, then flawless execution — first-time-right delivery to our customer's 3PL. Relentless attention to detail, dock to dock.",
    name: "Francis Fung",
    role: "APAC Supply Chain Ops Director",
    company: "Fortune 500 telecoms supplier",
    initials: "FF",
    tone: "bg-harbor text-bone",
  },
  {
    quote:
      "We built a seamless, cost-effective pipeline for one of the country's largest fashion retailers together. They shortened our time-to-market across Asia and negotiated rates that delivered real savings. Always available, always helpful.",
    name: "Alex Hughes",
    role: "Senior Management",
    company: "Factory X",
    initials: "AH",
    tone: "bg-bone text-ink",
  },
];

function Testimonials() {
  return (
    <section className="relative bg-ink overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-50" />
      <div className="relative max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-5">Word on the wharf</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="font-display uppercase text-bone leading-[0.95] text-4xl md:text-6xl xl:text-7xl"
              lines={[<>Trusted by shippers</>, <>across <span className="text-ember">APAC.</span></>]}
            />
          </div>
          <Reveal delay={150} className="lg:col-span-4 lg:col-start-9 lg:pt-14">
            <p className="text-dim leading-relaxed">
              From first-time importers to high-volume programmes, customers
              come back because we treat their freight like our own.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 130}>
              <figure className="group relative h-full rounded-lg border border-bone/12 bg-coal p-7 md:p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 hover:border-ember/50">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-ember mb-6" fill="currentColor" aria-hidden="true">
                  <path d="M4 13c0-4.4 2.8-7.8 7-9l1 1.8c-2.6 1-4.2 2.8-4.5 5 .4-.2 1-.3 1.5-.3 2.2 0 3.8 1.6 3.8 3.9S11 18.5 8.6 18.5C5.8 18.5 4 16.2 4 13zm11 0c0-4.4 2.8-7.8 7-9l1 1.8c-2.6 1-4.2 2.8-4.5 5 .4-.2 1-.3 1.5-.3 2.2 0 3.8 1.6 3.8 3.9s-1.8 4.1-4.2 4.1c-2.8 0-4.6-2.3-4.6-5.5z" />
                </svg>
                <blockquote className="text-fog/90 leading-relaxed text-[15px] flex-1">{q.quote}</blockquote>
                <figcaption className="mt-8 pt-6 border-t border-bone/10 flex items-center gap-4">
                  <span className={`w-11 h-11 rounded-full grid place-items-center font-display text-sm ${q.tone}`}>{q.initials}</span>
                  <span>
                    <span className="block font-semibold text-bone">{q.name}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-dim mt-0.5">
                      {q.role} · {q.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WhyUsSection() {
  return (
    <>
      <WhyUs />
      <SkySection />
      <Testimonials />
    </>
  );
}
