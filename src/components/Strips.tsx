const SERVICES = [
  "Air Freight",
  "Ocean Freight",
  "Customs Brokerage",
  "Warehousing & 3PL",
  "Project Cargo",
  "Domestic & Linehaul",
];

export function ServiceTicker({
  solid = false,
  duration = 30,
}: {
  solid?: boolean;
  duration?: number;
}) {
  const items = [...SERVICES, ...SERVICES];
  return (
    <div
      className={`marquee select-none border-y ${
        solid
          ? "bg-ember text-ink border-ember"
          : "bg-ink text-bone border-bone/12"
      } py-4 md:py-5`}
      aria-hidden="true"
    >
      <div
        className="marquee-track items-center gap-8"
        style={{ ["--mq-dur" as string]: `${duration}s` }}
      >
        {items.map((s, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className={`font-display uppercase leading-none whitespace-nowrap text-3xl md:text-5xl ${
                solid ? "" : i % 2 === 0 ? "text-outline" : "text-bone/85"
              }`}
            >
              {s}
            </span>
            <svg
              viewBox="0 0 24 24"
              className={`w-5 h-5 md:w-7 md:h-7 shrink-0 ${solid ? "text-ink" : "text-ember"}`}
              fill="currentColor"
            >
              <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export function BigWordStrip({ word }: { word: string }) {
  const items = Array(6).fill(word);
  return (
    <div className="marquee select-none py-6 md:py-10" aria-hidden="true">
      <div className="marquee-track rev items-center gap-12" style={{ ["--mq-dur" as string]: "40s" }}>
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="font-display uppercase leading-none whitespace-nowrap text-[16vw] md:text-[9rem] text-outline opacity-70">
              {w}
            </span>
            <span className="text-ember text-4xl md:text-6xl">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
