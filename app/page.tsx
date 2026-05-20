"use client";

import { useState } from "react";
import { HeroSection } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import LoadingScreen from "./components/LoadingScreen";

export default function Home() {
  const [showLoader, setShowLoader] = useState(false);

  return (
    <main className="w-full relative bg-[#f4be2c]">
      {showLoader ? (
        <LoadingScreen onStart={() => setShowLoader(false)} />
      ) : (
        <div className="w-full">
          <HeroSection />
          <HowItWorks />
        </div>
      )}
    </main>
  );
}