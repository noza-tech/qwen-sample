import { ZipWriter } from "./zipWriter";
import { IMG } from "./images";

// Root-level project files, imported as raw text at build time.
import packageJson from "../../package.json?raw";
import indexHtml from "../../index.html?raw";
import viteConfig from "../../vite.config.js?raw";
import tsconfigJson from "../../tsconfig.json?raw";

// Every source file under src/, picked up automatically at build time.
const sourceModules = import.meta.glob("../../src/**/*.{ts,tsx,css}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const encoder = new TextEncoder();

const README = `MERIDIAN CARRIERS — landing page source (single-file archive)
==============================================================

Stack: React 18 + TypeScript + Vite 6 + Tailwind CSS 4 + Framer Motion

Run it:
  npm install
  npm run dev        # local dev server
  npm run build      # production build -> dist/

What's inside:
  package.json, index.html, vite.config.js, tsconfig.json
  src/               all components, motion library, styles
  public/img/        generated imagery (embedded when reachable at
                     download time — otherwise src/lib/images.ts keeps
                     the hosted URLs and everything still works online)

Append ?zip to the site URL at any time to re-download this archive.
`;

export interface ZipProgress {
  step: string;
  done: number;
  total: number;
}

export interface ZipResult {
  url: string;
  fileName: string;
  embeddedImages: number;
  skippedImages: number;
  sizeKB: number;
}

function collectSourceFiles(): Array<{ path: string; content: string }> {
  const files: Array<{ path: string; content: string }> = [
    { path: "package.json", content: packageJson },
    { path: "index.html", content: indexHtml },
    { path: "vite.config.js", content: viteConfig },
    { path: "tsconfig.json", content: tsconfigJson },
    { path: "README.txt", content: README },
  ];

  for (const [key, content] of Object.entries(sourceModules)) {
    // "../../src/App.tsx" -> "src/App.tsx"
    const rel = key.replace(/^\.\.\/\.\.\//, "").replace(/^\.\.\//, "");
    files.push({ path: rel, content });
  }
  return files;
}

async function fetchBinary(
  url: string,
  timeoutMs = 3500
): Promise<ArrayBuffer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function buildSourceZip(
  onProgress?: (p: ZipProgress) => void
): Promise<{ blob: Blob; embeddedImages: number; skippedImages: number }> {
  const zip = new ZipWriter();
  const files = collectSourceFiles();
  const total = files.length + 2;

  let done = 0;
  for (const file of files) {
    await zip.addFile(
      `meridian-carriers/${file.path}`,
      encoder.encode(file.content)
    );
    done += 1;
    onProgress?.({ step: `Packed ${file.path}`, done, total });
  }

  // Imagery: fetch everything in parallel with a hard per-image timeout,
  // then embed whatever arrived. Never blocks or fails the archive.
  onProgress?.({ step: "Fetching imagery…", done, total });
  const imageEntries = Object.entries(IMG);
  const fetched = await Promise.all(
    imageEntries.map(async ([name, url]) => ({
      name,
      buffer: await fetchBinary(url),
    }))
  );

  let embeddedImages = 0;
  for (const img of fetched) {
    if (img.buffer) {
      await zip.addFile(
        `meridian-carriers/public/img/${img.name}.png`,
        new Uint8Array(img.buffer)
      );
      embeddedImages += 1;
    }
  }
  const skippedImages = imageEntries.length - embeddedImages;

  done += 1;
  onProgress?.({
    step:
      skippedImages > 0
        ? `Embedded ${embeddedImages} images (${skippedImages} unreachable — skipped)`
        : `Embedded ${embeddedImages} images`,
    done,
    total,
  });

  onProgress?.({ step: "Compressing archive…", done: total, total });
  const blob = zip.build();
  return { blob, embeddedImages, skippedImages };
}

export async function downloadSourceZip(
  onProgress?: (p: ZipProgress) => void
): Promise<ZipResult> {
  const { blob, embeddedImages, skippedImages } =
    await buildSourceZip(onProgress);
  const fileName = "meridian-carriers-source.zip";
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Keep the URL alive long enough for large saves to finish (and for the
  // manual fallback link in the UI to remain usable).
  setTimeout(() => URL.revokeObjectURL(url), 120_000);

  return {
    url,
    fileName,
    embeddedImages,
    skippedImages,
    sizeKB: Math.max(1, Math.round(blob.size / 1024)),
  };
}
