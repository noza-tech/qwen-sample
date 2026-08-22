import JSZip from "jszip";

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

const README = `MERIDIAN CARRIERS — landing page source
=========================================

Stack: React 18 + TypeScript + Vite 6 + Tailwind CSS 4 + Framer Motion

Run it:
  npm install
  npm run dev        # local dev server
  npm run build      # production build -> dist/

Structure:
  src/App.tsx            page composition + preloader sequence
  src/components/        Preloader, Header, Hero, Intro (truck scene),
                         Services, WhyUs, Partners, Closing
  src/lib/motion.tsx     scroll reveals, counters, section progress
  src/lib/images.ts      generated image manifest
  src/lib/sourceZip.ts   this download utility

Append ?zip to the site URL at any time to re-download this archive.
`;

function collectFiles(): Array<{ path: string; content: string }> {
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

export async function buildSourceZip(): Promise<Blob> {
  const zip = new JSZip();
  const root = zip.folder("meridian-carriers");
  if (!root) throw new Error("Could not create zip folder");
  for (const file of collectFiles()) {
    root.file(file.path, file.content);
  }
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}

export async function downloadSourceZip(): Promise<void> {
  const blob = await buildSourceZip();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "meridian-carriers-source.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
