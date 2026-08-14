import { useEffect, useState } from "react";
import { MaskLines, Reveal, useClock, useInView } from "../lib/motion";

/* ---------------- FAQ ---------------- */

const FAQS = [
  {
    q: "What does Meridian Carriers do?",
    a: "We're a freight forwarding and logistics group delivering end-to-end supply chain solutions — airfreight, seafreight, customs brokerage, warehousing and transport — under one accountable team.",
  },
  {
    q: "Which industries do you specialise in?",
    a: "Retail and fashion, food & beverage, industrials, technology, renewables and project cargo. If it crosses a border, we've probably moved something like it.",
  },
  {
    q: "What shipping methods do you offer?",
    a: "Airfreight, seafreight (FCL and LCL), breakbulk, RO/RO and multimodal solutions combining air, sea and road into a single booking.",
  },
  {
    q: "Do you handle customs clearance in-house?",
    a: "Yes. Our licensed brokers manage import and export clearance directly — no outsourcing, no relay between providers, no lost context.",
  },
  {
    q: "How is freight pricing calculated?",
    a: "Rates depend on shipment size, chargeable weight, origin and destination, mode, fuel and current market conditions. Every quote itemises the components so there are no surprises.",
  },
  {
    q: "Can you handle oversized or heavy cargo?",
    a: "That's a speciality. Our project cargo team manages out-of-gauge (OOG) and heavy-lift shipments end to end, including permits, surveys and engineered load configurations.",
  },
  {
    q: "How do I request a quote?",
    a: "Email your shipment details to hello@meridiancarriers.com, call any office, or use the form above. A real person responds — usually within the hour during business time.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" className="relative scroll-mt-28 bg-coal border-t border-bone/10">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-5">F.A.Q</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="font-display uppercase text-bone leading-[0.95] text-4xl md:text-6xl"
              lines={[<>Straight answers,</>, <>so you can</>, <>move <span className="text-ember">forward.</span></>]}
            />
            <Reveal delay={200}>
              <div className="mt-10 rounded-lg border border-bone/12 bg-slab p-7">
                <p className="text-fog/90 leading-relaxed mb-5">
                  Still have questions? Our operations desk picks up the phone.
                </p>
                <a
                  href="mailto:hello@meridiancarriers.com"
                  className="btn-fill inline-flex items-center gap-3 border border-bone/25 rounded-full px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-bone hover:text-ink transition-colors duration-300"
                >
                  Email the desk
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 50}>
                <div className={`faq-item border-t border-bone/12 ${open === i ? "open" : ""} ${i === FAQS.length - 1 ? "border-b" : ""}`}>
                  <button
                    onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full flex items-center gap-5 py-6 text-left group"
                    aria-expanded={open === i}
                  >
                    <span className={`font-mono text-xs shrink-0 transition-colors ${open === i ? "text-ember" : "text-dim"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`flex-1 font-display uppercase text-xl md:text-2xl leading-snug transition-colors ${open === i ? "text-ember" : "text-bone group-hover:text-ember"}`}>
                      {f.q}
                    </span>
                    <span className={`shrink-0 w-9 h-9 rounded-full border grid place-items-center transition-all duration-400 ${open === i ? "border-ember bg-ember text-ink rotate-45" : "border-bone/25 text-bone group-hover:border-ember group-hover:text-ember"}`}>
                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M8 3v10M3 8h10" strokeLinecap="round" /></svg>
                    </span>
                  </button>
                  <div className="faq-body">
                    <div>
                      <p className="pb-7 pl-[3.2rem] pr-10 text-dim leading-relaxed max-w-2xl">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */

function Cta() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const words = "READY TO MOVE WITH CERTAINTY?".split(" ");
  return (
    <section id="contact" className="relative scroll-mt-28 overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(255,91,31,0.13),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent" />
      <div ref={ref} className="relative max-w-[1500px] mx-auto px-5 md:px-10 py-28 md:py-40 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-8 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-ember/60" /> Next consignment <span className="w-8 h-px bg-ember/60" />
        </p>
        <h2 className="font-display uppercase text-bone leading-[0.92] text-[11vw] md:text-[6.6vw] xl:text-[6.4rem]">
          {words.map((w, i) => (
            <span key={i} className="mask-line inline-block align-top mx-[0.35em]">
              <span
                className={`inline-block transition-transform duration-700 ${inView ? "translate-y-0" : "translate-y-[115%]"}`}
                style={{ transitionDelay: `${i * 70}ms`, transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1)" }}
              >
                {i === words.length - 1 ? <span className="text-ember">{w}</span> : w}
              </span>
            </span>
          ))}
        </h2>
        <Reveal delay={350}>
          <p className="mx-auto mt-8 max-w-xl text-fog/85 text-lg leading-relaxed">
            No phone trees, no passing the buck — experienced operators ready to
            price your lane, plan the move and pick up the phone.
          </p>
        </Reveal>
        <Reveal delay={480} className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:hello@meridiancarriers.com"
            className="btn-fill inline-flex items-center gap-3 bg-ember text-ink rounded-full px-9 py-4 font-mono text-xs uppercase tracking-[0.18em] hover:text-bone transition-colors duration-300"
            style={{ ["--btn-fill" as string]: "var(--color-bone)" }}
          >
            Work with us
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a
            href="tel:+61290000000"
            className="btn-fill inline-flex items-center gap-3 border border-bone/30 text-bone rounded-full px-9 py-4 font-mono text-xs uppercase tracking-[0.18em] hover:text-ink transition-colors duration-300"
          >
            +61 2 9000 0000
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- footer ---------------- */

const OFFICES = [
  { city: "Sydney", zone: "Australia/Sydney", code: "SYD" },
  { city: "Auckland", zone: "Pacific/Auckland", code: "AKL" },
  { city: "Hong Kong", zone: "Asia/Hong_Kong", code: "HKG" },
  { city: "Singapore", zone: "Asia/Singapore", code: "SIN" },
];

function OfficeClock({ city, zone, code }: { city: string; zone: string; code: string }) {
  const time = useClock(zone);
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-bone/10 group">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember">{code}</span>
      <span className="flex-1 text-bone font-medium">{city}</span>
      <span className="font-mono text-sm text-dim tabular-nums group-hover:text-bone transition-colors">{time}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative bg-coal border-t border-bone/10 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 pt-16 md:pt-20 pb-8">
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 bg-ember rounded-md grid place-items-center">
                <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="#0b0d12" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 22V10l5 7 5-7v12" />
                  <path d="M22 10v12M22 10h4a3 3 0 0 1 0 6h-4" />
                </svg>
              </span>
              <span className="font-display uppercase text-xl text-bone">Meridian Carriers</span>
            </div>
            <p className="text-dim leading-relaxed text-sm max-w-xs mb-6">
              Freight forwarding, customs brokerage, warehousing and linehaul —
              one crew across APAC, accountable door to door.
            </p>
            <a href="mailto:hello@meridiancarriers.com" className="text-bone hover:text-ember transition-colors font-medium">
              hello@meridiancarriers.com
            </a>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.26em] text-dim mb-5">Navigate</h4>
            <ul className="space-y-3">
              {[
                ["Services", "#services"],
                ["Reliability", "#reliability"],
                ["Why us", "#why-us"],
                ["Network", "#network"],
                ["Insights", "#insights"],
                ["F.A.Q", "#faq"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-fog hover:text-ember transition-colors text-sm inline-flex items-center gap-2 group">
                    <span className="w-0 h-px bg-ember transition-all duration-300 group-hover:w-3" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.26em] text-dim mb-5">Services</h4>
            <ul className="space-y-3 text-sm">
              {["Air Freight", "Ocean Freight", "Customs Brokerage", "Warehousing & 3PL", "Project Cargo", "Domestic & Linehaul"].map((s) => (
                <li key={s}>
                  <a href="#services" className="text-fog hover:text-ember transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 h-px bg-ember transition-all duration-300 group-hover:w-3" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.26em] text-dim mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-mint blink-dot" /> Operations desk — live
            </h4>
            {OFFICES.map((o) => (
              <OfficeClock key={o.code} {...o} />
            ))}
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
              24/7 emergency line · +61 2 9000 0000
            </p>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="select-none leading-none text-center" aria-hidden="true">
          <div className="font-display uppercase text-[13.5vw] leading-[0.8] text-outline opacity-60 whitespace-nowrap">
            Meridian
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-bone/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
          <span>© 2026 Meridian Carriers Pty Ltd · AFSL demo site</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mint blink-dot" />
            All lanes operational
          </span>
          <a href="#top" className="group inline-flex items-center gap-2 hover:text-ember transition-colors">
            Back to top
            <svg viewBox="0 0 16 16" className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 13V3M3.5 7 8 2.5 12.5 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Closing() {
  return (
    <>
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
