import { useCallback, useEffect, useRef, useState } from "react";
import { buildSourceZip, type ZipResult } from "../lib/sourceZip";

type Status = "idle" | "working" | "done" | "error";

/**
 * Persistent "grab the code" affordance. One click packages the entire
 * project (source + embedded imagery) into a single .zip via the built-in
 * dependency-free zip writer — no external chunks to load, no network
 * dependency for the archive itself.
 */
export default function DownloadZip() {
  const [status, setStatus] = useState<Status>("idle");
  const [pct, setPct] = useState(0);
  const [step, setStep] = useState("");
  const [result, setResult] = useState<ZipResult | null>(null);
  const [open, setOpen] = useState(false);
  const busy = status === "working";
  const closeTimer = useRef<number | null>(null);

  const scheduleClose = useCallback((ms: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), ms);
  }, []);

  const run = useCallback(async () => {
    if (busy) return;
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setStatus("working");
    setPct(4);
    setStep("Preparing…");
    setOpen(true);
    try {
      // 1 — build the archive entirely locally (imagery is best-effort).
      const { blob, embeddedImages, skippedImages } = await buildSourceZip(
        ({ step: s, done, total }) => {
          setStep(s);
          setPct(Math.max(4, Math.round((done / total) * 96)));
        }
      );

      // 2 — publish it and set the manual link *before* triggering the save,
      // so a blocked programmatic download still leaves a working fallback.
      const fileName = "meridian-carriers-source.zip";
      const url = URL.createObjectURL(blob);
      setTimeout(() => URL.revokeObjectURL(url), 120_000);
      setPct(100);
      setResult({
        url,
        fileName,
        embeddedImages,
        skippedImages,
        sizeKB: Math.max(1, Math.round(blob.size / 1024)),
      });

      // 3 — attempt the automatic save.
      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setStep("Saved.");
        setStatus("done");
      } catch {
        setStep("Auto-save was blocked — use the manual link.");
        setStatus("error");
      }
      scheduleClose(9000);
    } catch (err) {
      console.error("Zip build failed", err);
      setStep("The archive could not be built — please retry.");
      setStatus("error");
      scheduleClose(9000);
    }
  }, [busy, scheduleClose]);

  // Keep the panel open while working; let it rest otherwise.
  useEffect(() => {
    if (busy) setOpen(true);
  }, [busy]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    []
  );

  const label =
    status === "working"
      ? `Packing… ${pct}%`
      : status === "done"
        ? "Saved ✓"
        : status === "error"
          ? "Saved — see panel"
          : "Download .zip";

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 rounded-lg border border-bone/15 bg-coal/95 backdrop-blur p-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] animate-[rise_0.25s_ease]">
          <p className="font-display uppercase text-bone text-sm leading-tight">
            Grab the whole project
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-dim">
            Every source file plus the imagery, compressed into a single
            runnable <span className="font-mono text-ember">.zip</span>.
          </p>

          {busy && (
            <>
              <div className="mt-3 h-1.5 rounded-full bg-bone/10 overflow-hidden">
                <div
                  className="h-full bg-ember transition-[width] duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-dim truncate">
                {step}
              </p>
            </>
          )}

          {status === "done" && result && (
            <p className="mt-3 text-[11px] leading-relaxed text-fog/90">
              <span className="text-mint font-semibold">Saved ✓</span> —{" "}
              {result.fileName} ({result.sizeKB.toLocaleString()} KB,{" "}
              {result.embeddedImages} images embedded
              {result.skippedImages > 0
                ? `, ${result.skippedImages} skipped`
                : ""}
              ).
              <a
                href={result.url}
                download={result.fileName}
                className="block mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ember underline decoration-ember/40 underline-offset-4 hover:decoration-ember"
              >
                Didn't start? Save manually
              </a>
            </p>
          )}

          {status === "error" && result && (
            <a
              href={result.url}
              download={result.fileName}
              className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-ember underline decoration-ember/40 underline-offset-4 hover:decoration-ember"
            >
              Save {result.fileName} manually
            </a>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={run}
        onMouseEnter={() => setOpen(true)}
        disabled={busy}
        className={`group inline-flex items-center gap-3 rounded-full border pl-4 pr-5 py-3 font-mono text-xs uppercase tracking-[0.16em] shadow-[0_14px_40px_rgba(0,0,0,0.45)] transition-all duration-300 cursor-pointer ${
          status === "done"
            ? "bg-mint text-ink border-mint"
            : "bg-ember text-ink border-ember hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(255,91,31,0.35)]"
        }`}
        aria-label="Download the full source code as a single zip file"
      >
        <span className="w-8 h-8 rounded-full bg-ink/15 grid place-items-center">
          {busy ? (
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
