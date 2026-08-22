import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { BigWordStrip, ServiceTicker } from "./components/Strips";
import Intro from "./components/Intro";
import Services from "./components/Services";
import WhyUsSection from "./components/WhyUs";
import PartnersInsights from "./components/Partners";
import Closing from "./components/Closing";
import DownloadZip from "./components/DownloadZip";

export default function App() {
  const [loading, setLoading] = useState(true);
  const handleDone = useCallback(() => setLoading(false), []);

  // Append ?zip to the URL to auto-download the full source archive.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("zip")) {
      // Lazy load: the zip tooling must never stand between the user and the page.
      import("./lib/sourceZip")
        .then((m) => m.downloadSourceZip())
        .catch((err: unknown) => console.error("Zip failed:", err));
      params.delete("zip");
      const next = params.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (next ? `?${next}` : "")
      );
    }
  }, []);

  return (
    <div className="bg-ink text-bone font-body">
      <AnimatePresence>{loading && <Preloader onDone={handleDone} />}</AnimatePresence>

      <div className="noise-layer" aria-hidden="true" />

      {!loading && (
        <>
          <Header />

          <main>
            <Hero />
            <ServiceTicker solid duration={26} />
            <Intro />
            <Services />
            <WhyUsSection />
            <PartnersInsights />
            <BigWordStrip word="Delivered" />
            <Closing />
          </main>
        </>
      )}

      <DownloadZip />
    </div>
  );
}
