import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "working" | "done" | "error";

/**
 * A persistent, always-on-download affordance. One click packages the entire
 * project (source + embedded imagery) into a single .zip and saves it.
 */
export default function DownloadZip() {
  const [status, setStatus] = useState<Status>("idle");
  const [pct, setPct] = useState(0);
  const [open, setOpen] = useState(false);
  const busy = status === "working";

  const run = useCallback(async () => {
    if (busy) return;
    setStatus("working");
    setPct(0);
    try {
      const { downloadSourceZip } = await import("../lib/sourceZip");
      await downloadSourceZip(({ done, total }: { step: string; done: number; total: number }) => {
        setPct(Math.round((done / total) * 100));
      });
      setStatus("done");
      window.setTimeout(() => {
        setStatus("idle");
        setPct(0);
      }, 2600);
    } catch (err) {
      console.error("Zip download failed", err);
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2600);
    }
  }, [busy]);

  // Collapse the detail panel after a moment of inactivity.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpen(false), 5000);
    return () => window.clearTimeout(t);
  }, [open, pct]);

  const label =
    status === "working"
      ? `Packing… ${pct}%`
      : status === "done"
        ? "Saved ✓"
        : status === "error"
          ? "Try again"
          : "Download .zip";

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-64 rounded-lg border border-bone/15 bg-coal/95 backdrop-blur p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-[rise_0.25s_ease]">
          <p className="font-display uppercase text-bone text-sm leading-tight">
            Grab the whole project
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-dim">
            One click packages every source file <em>and</em> the embedded
            imagery into a single, runnable <span className="text-ember font-mono">.zip</span>.
          </p>
          {busy && (
            <div className="mt-3 h-1.5 rounded-full bg-bone/10 overflow-hidden">
              <div
                className="h-full bg-ember transition-[width] duration-150"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          run();
        }}
        onMouseEnter={() => setOpen(true)}
        disabled={busy}
        className={`group inline-flex items-center gap-3 rounded-full border pl-4 pr-5 py-3 font-mono text-xs uppercase tracking-[0.16em] shadow-[0_14px_40px_rgba(0,0,0,0.45)] transition-all duration-300 ${
          status === "done"
            ? "bg-mint text-ink border-mint"
            : status === "error"
              ? "bg-[#c0392b] text-bone border-[#c0392b]"
              : "bg-ember text-ink border-ember hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(255,91,31,0.35)]"
        }`}
        aria-label="Download the full source code as a single zip file"
      >
        <span className="w-8 h-8 rounded-full bg-ink/15 grid place-items-center">
          {status === "working" ? (
            <svg viewBox="0 0 20 20" className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="10" cy="10" r="7" opacity="0.25" />
              <path d="M10 3a7 7 0 0 1 7 7" strokeLinecap="round" />
            </svg>
          ) : status === "done" ? (
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 10.5 8.5 14.5 15.5 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3v9M6 8.5 10 12.5 14 8.5" />
              <path d="M4 15.5h12" />
            </svg>
          )}
        </span>
        {label}
      </button>
    </div>
  );
}
