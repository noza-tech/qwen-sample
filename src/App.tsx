import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { BigWordStrip, ServiceTicker } from "./components/Strips";
import Intro from "./components/Intro";
import Services from "./components/Services";
import WhyUsSection from "./components/WhyUs";
import PartnersInsights from "./components/Partners";
import Closing from "./components/Closing";

export default function App() {
  const [loading, setLoading] = useState(true);
  const handleDone = useCallback(() => setLoading(false), []);

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
    </div>
  );
}
