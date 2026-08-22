import JSZip from "jszip";
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

const README = `MERIDIAN CARRIERS — landing page source (self-contained archive)
=================================================================

Stack: React 18 + TypeScript + Vite 6 + Tailwind CSS 4 + Framer Motion

Run it:
  npm install
  npm run dev        # local dev server
  npm run build      # production build -> dist/

What's inside:
  package.json, index.html, vite.config.js, tsconfig.json
  src/               all components, motion library, styles
  public/img/        generated imagery (embedded, works offline)

Append ?zip to the site URL at any time to re-download this archive.
`;

interface Progress {
  step: string;
  done: number;
  total: number;
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

/** Fetch a remote image and add it to the zip. Skipped silently on failure. */
async function embedImage(
  zip: JSZip,
  name: string,
  url: string
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return false;
    const buffer = await res.arrayBuffer();
    zip.file(`public/img/${name}.png`, buffer);
    return true;
  } catch {
    return false;
  }
}

export async function buildSourceZip(
  onProgress?: (p: Progress) => void
): Promise<Blob> {
  const zip = new JSZip();
  const root = zip.folder("meridian-carriers");
  if (!root) throw new Error("Could not create zip folder");

  const files = collectSourceFiles();
  const imageEntries = Object.entries(IMG);
  const total = files.length + imageEntries.length + 1;

  let done = 0;
  for (const file of files) {
    root.file(file.path, file.content);
    done += 1;
    onProgress?.({ step: `Packing ${file.path}`, done, total });
  }

  for (const [name, url] of imageEntries) {
    await embedImage(root, name, url);
    done += 1;
    onProgress?.({ step: `Embedding ${name}.png`, done, total });
  }

  onProgress?.({ step: "Compressing…", done: total - 1, total });
  const blob = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 7 } },
    (meta) => {
      onProgress?.({ step: "Compressing…", done: total, total: Math.max(total, 100) });
      void meta;
    }
  );
  return blob;
}

export async function downloadSourceZip(
  onProgress?: (p: Progress) => void
): Promise<void> {
  const blob = await buildSourceZip(onProgress);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "meridian-carriers-source.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
