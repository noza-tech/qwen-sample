import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/* ---------------- prefers-reduced-motion ---------------- */
export function usePrefersReduced() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/* ---------------- in-view observer ---------------- */
export function useInView<T extends HTMLElement>(threshold = 0.2, once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return { ref, inView };
}

/* ---------------- Reveal wrapper ---------------- */
type RevealProps = {
  children: ReactNode;
  as?: "div" | "section" | "span" | "p" | "h2" | "h3" | "li" | "figure";
  dir?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
  id?: string;
};

export function Reveal({
  children,
  as = "div",
  dir = "up",
  delay = 0,
  className = "",
  id,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const Tag = as as "div";
  return (
    <Tag
      id={id}
      ref={ref}
      data-reveal={dir === "up" ? "" : dir}
      style={{ ["--rv-delay" as string]: `${delay}ms` }}
      className={`${inView ? "revealed " : ""}${className}`}
    >
      {children}
    </Tag>
  );
}

/* Masked line-by-line reveal for big headings */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  stagger = 90,
  as: Tag = "h2",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const T = Tag as "h2";
  return (
    <T ref={ref as never} className={`${inView ? "revealed " : ""}${className}`}>
      {lines.map((l, i) => (
        <span
          key={i}
          className={`mask-line ${lineClassName}`}
          style={{ ["--rv-delay" as string]: `${i * stagger}ms` }}
        >
          <span>{l}</span>
        </span>
      ))}
    </T>
  );
}

/* ---------------- count-up ---------------- */
export function useCountUp(
  target: number,
  active: boolean,
  duration = 1600,
  decimals = 0
) {
  const reduced = usePrefersReduced();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setVal(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduced]);
  return val.toFixed(decimals);
}

/* ---------------- scroll progress across a tall section ---------------- */
export function useSectionProgress() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReduced();
  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) {
      setProgress(0);
      return;
    }
    const p = Math.min(1, Math.max(0, -rect.top / total));
    setProgress(p);
  }, []);
  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);
  return { ref, progress: reduced ? 1 : progress };
}

/* ---------------- live clock for office footer ---------------- */
export function useClock(timeZone: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone,
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}
