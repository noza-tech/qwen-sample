import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Reliability", href: "#reliability" },
  { label: "Why us", href: "#why-us" },
  { label: "Network", href: "#network" },
  { label: "Insights", href: "#insights" },
  { label: "F.A.Q", href: "#faq" },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3 group">
      <span className="w-9 h-9 bg-ember rounded-md grid place-items-center transition-transform duration-300 group-hover:-rotate-6">
        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" stroke="#0b0d12" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 22V10l5 7 5-7v12" />
          <path d="M22 10v12M22 10h4a3 3 0 0 1 0 6h-4" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display uppercase text-[15px] tracking-wide text-bone">Meridian</span>
        <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-dim">Carriers</span>
      </span>
    </a>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${
          scrolled
            ? "bg-ink/85 backdrop-blur-md border-b border-bone/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-5 md:px-10 flex items-center justify-between gap-6">
          <Logo />
          <nav className="hidden lg:flex items-center gap-7">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone transition-colors"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="btn-fill hidden sm:inline-flex items-center gap-2 border border-bone/25 rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone hover:text-ink transition-colors duration-300"
            >
              Work with us
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden w-10 h-10 grid place-items-center border border-bone/25 rounded-full text-bone hover:border-ember hover:text-ember transition-colors"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 20 20" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M3 6.5h14M3 10h14M8 13.5h9" />
              </svg>
            </button>
          </div>
        </div>
        {/* scroll progress */}
        <div className="absolute bottom-[-1px] left-0 h-[2px] bg-ember" style={{ width: `${progress * 100}%` }} />
      </motion.header>

      {/* mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] bg-coal flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 grid place-items-center border border-bone/25 rounded-full text-bone hover:border-ember hover:text-ember transition-colors"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5 }}
                  className="group flex items-baseline gap-4 py-3 border-b border-bone/10"
                >
                  <span className="font-mono text-[11px] text-ember">0{i + 1}</span>
                  <span className="font-display uppercase text-4xl text-bone group-hover:text-ember transition-colors">
                    {l.label}
                  </span>
                </motion.a>
              ))}
            </nav>
            <div className="px-8 pb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              hello@meridiancarriers.com · +61 2 9000 0000
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
