import { MaskLines, Reveal, useInView } from "../lib/motion";
import { IMG } from "../lib/images";

type Service = {
  no: string;
  title: string;
  desc: string;
  img: string;
  tags: string[];
};

const SERVICES: Service[] = [
  {
    no: "01",
    title: "Air Freight",
    desc: "Next-flight-out, priority and deferred air programmes on the lanes that matter — booked, tendered and tracked to the minute.",
    img: IMG.truckDawn,
    tags: ["NFO", "Charter", "Consolidated"],
  },
  {
    no: "02",
    title: "Ocean Freight",
    desc: "Full and part-container moves plus specialised equipment, with carrier tenders run for the right mix of rate and reliability.",
    img: IMG.ship,
    tags: ["FCL / LCL", "Reefer", "Breakbulk"],
  },
  {
    no: "03",
    title: "Customs Brokerage",
    desc: "Our own licensed brokers handle classification, concessions and biosecurity in-house — nothing subcontracted, nothing guessed.",
    img: IMG.port,
    tags: ["Licensed", "Tariff mapping", "Quarantine"],
  },
  {
    no: "04",
    title: "Warehousing & 3PL",
    desc: "Bonded and ambient storage with pick-pack and distribution plugged straight into your inbound and outbound freight.",
    img: IMG.warehouse,
    tags: ["Pick & pack", "Inventory", "Distribution"],
  },
  {
    no: "05",
    title: "Project Cargo",
    desc: "Out-of-gauge, heavy-lift and high-value moves — route surveys, permits and lift plans engineered before the cargo travels.",
    img: IMG.battery,
    tags: ["OOG", "Heavy lift", "Surveys"],
  },
  {
    no: "06",
    title: "Domestic & Linehaul",
    desc: "Metro, regional and interstate runs held to fixed service levels, with live tracking published on every delivery.",
    img: IMG.containers,
    tags: ["FTL / LTL", "Interstate", "Last mile"],
  },
];

function ServiceIcon({ i }: { i: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (i) {
    case 0:
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8" {...common}>
          <path d="M3 19.5 29 8l-8.5 15.5-4.2-6.1z" />
          <path d="M16.3 17.4 29 8l-14 3.5" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8" {...common}>
          <path d="M4 21h24l-3 6H7z" />
          <path d="M8 21v-5h16v5M12 16v-4h8v4M16 12V8" />
          <path d="M2.5 25.5c2 1.6 4 1.6 6 0s4-1.6 6 0 4 1.6 6 0 4-1.6 6 0" opacity=".6" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8" {...common}>
          <path d="M12 14c0-4-3-4.5-3-8a7 7 0 0 1 14 0c0 3.5-3 4-3 8" />
          <path d="M7 20a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H7z" />
          <path d="M5 27h22" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8" {...common}>
          <path d="M3 27V12L16 5l13 7v15" />
          <path d="M9 27v-9h14v9M9 22h14M16 18v4" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8" {...common}>
          <path d="M5 28h22M8 28V9l14-4v23" />
          <path d="M8 9l14-4M22 12v4M22 16l-3 3h6zM19 24h6v4h-6z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8" {...common}>
          <path d="M2 8h17v14H2zM19 12h6l4 5v5h-10" />
          <circle cx="8" cy="24.5" r="2.6" />
          <circle cx="23.5" cy="24.5" r="2.6" />
        </svg>
      );
  }
}

function ServicesGrid() {
  return (
    <div id="services" className="relative scroll-mt-28 bg-coal border-y border-bone/10">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-10 mb-14 md:mb-20">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-5">Capabilities</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="font-display uppercase text-bone leading-[0.95] text-4xl md:text-6xl xl:text-7xl"
              lines={[<>Everything your freight needs.</>, <><span className="text-ember">One</span> group.</>]}
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8 space-y-5 lg:pt-14">
            <Reveal delay={120}>
              <p className="text-fog/90 text-lg leading-relaxed">
                From air to sea, from clearance to final delivery — decades of
                expertise across every freight discipline, working as one system.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="text-dim leading-relaxed">
                One partner, one point of contact, total visibility from origin
                to destination.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.no} delay={(i % 3) * 110}>
              <article className="group relative h-full rounded-lg border border-bone/12 bg-ink overflow-hidden transition-all duration-500 hover:border-ember/60 hover:-translate-y-2">
                <div className="relative h-44 md:h-52 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="w-full h-full object-cover img-duotone scale-[1.04] transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                  <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/80 bg-ink/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-bone/15">
                    {s.no}
                  </span>
                  <span className="absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center bg-ember text-ink opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 13 13 3M6 3h7v7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="p-6 md:p-7">
                  <div className="flex items-center gap-3 text-ember mb-4">
                    <ServiceIcon i={i} />
                    <span className="h-px flex-1 bg-bone/10" />
                  </div>
                  <h3 className="font-display uppercase text-bone text-2xl md:text-[1.7rem] leading-tight">{s.title}</h3>
                  <p className="mt-3 text-dim text-[15px] leading-relaxed">{s.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span key={t} className="font-mono text-[9px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full border border-bone/15 text-dim group-hover:border-ember/50 group-hover:text-ember transition-colors duration-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-12 flex justify-center">
          <a href="#contact" className="btn-fill inline-flex items-center gap-3 border border-bone/25 rounded-full px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone hover:text-ink transition-colors duration-300">
            Our services in detail
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------------- reliability ---------------- */

const FEATURES = [
  {
    title: "Live milestone tracking",
    desc: "Every checkpoint is scanned and published to your dashboard — exceptions get flagged before they grow into delays.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="17" r="9" />
        <circle cx="20" cy="17" r="3.2" fill="currentColor" stroke="none" />
        <path d="M20 8V4M20 30v6M11 17H5M35 17h-6" opacity=".55" />
        <path d="M13 33c4-2.6 10-2.6 14 0" />
      </svg>
    ),
  },
  {
    title: "Network across the map",
    desc: "Owned offices plus vetted agents across APAC, Europe and the Americas — capacity on the lanes your volumes actually run.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="15" />
        <ellipse cx="20" cy="20" rx="6.5" ry="15" />
        <path d="M5.5 15h29M5.5 25h29" opacity=".6" />
      </svg>
    ),
  },
  {
    title: "24/7 humans on the line",
    desc: "Phones answered by the ops team, not a queue — and whoever picks up carries the issue through to resolution.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22v-3a12 12 0 0 1 24 0v3" />
        <rect x="5" y="21" width="6" height="9" rx="2.5" />
        <rect x="29" y="21" width="6" height="9" rx="2.5" />
        <path d="M32 30v2a4 4 0 0 1-4 4h-6" />
      </svg>
    ),
  },
];

function Reliability() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  return (
    <section id="reliability" className="relative scroll-mt-28 overflow-hidden bg-ink">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 pt-24 md:pt-32">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember mb-5">Reliability at every milestone</p>
            </Reveal>
            <MaskLines
              as="h2"
              className="font-display uppercase text-bone leading-[0.95] text-4xl md:text-6xl xl:text-7xl"
              lines={[<>Built for businesses that</>, <><span className="text-ember">can't afford</span> disruption.</>]}
            />
          </div>
          <Reveal delay={150} className="lg:col-span-4 lg:col-start-9">
            <p className="text-dim leading-relaxed">
              One accountable team means your supply chain moves predictably and
              transparently — no runaround between vendors, no black holes
              between borders.
            </p>
          </Reveal>
        </div>
      </div>

      <div ref={ref} className="relative h-[46vh] md:h-[62vh] overflow-hidden my-4">
        <img
          src={IMG.ship}
          alt="Aerial view of a container vessel"
          className={`w-full h-full object-cover img-duotone transition-transform duration-[1.6s] ease-out ${inView ? "scale-100" : "scale-110"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-ink/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1500px] mx-auto w-full px-5 md:px-10">
            <MaskLines
              as="h3"
              className="font-display uppercase text-bone/95 leading-[0.95] text-4xl md:text-6xl xl:text-7xl max-w-3xl"
              lines={[<>Precision at</>, <><span className="text-ember">every milestone.</span></>]}
            />
          </div>
        </div>
        <div className="absolute bottom-5 left-5 md:left-10 font-mono text-[10px] uppercase tracking-[0.22em] text-bone/70 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-mint blink-dot" /> Vessel Meridian Star · 14,000 TEU · en route SIN → SYD
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-5 md:px-10 pb-24 md:pb-32 pt-10">
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 130}>
              <div className="group relative h-full rounded-lg border border-bone/12 bg-coal p-7 md:p-9 overflow-hidden transition-all duration-500 hover:border-ember/50 hover:-translate-y-1.5">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-ember/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center justify-between mb-8">
                  <span className="text-ember">{f.icon}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">0{i + 1}</span>
                </div>
                <h4 className="font-display uppercase text-bone text-2xl md:text-[1.7rem] leading-tight mb-3">{f.title}</h4>
                <p className="text-dim leading-relaxed text-[15px]">{f.desc}</p>
                <div className="mt-7 h-px bg-bone/10 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-0 bg-ember transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <>
      <ServicesGrid />
      <Reliability />
    </>
  );
}
