"use client"
import Image from "next/image";
import LoadingScreen from "./components/LoadingScreen";
import { useState } from "react";
import { HeroSection } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Canvas } from "@react-three/fiber";
import HeroModels from "./components/HeroModels";

export default function Home() {
  const [showLoader, setShowLoader] = useState(false);
  return (
  <main className="w-full relative"> {/* Removed min-h-screen & overflow-x-hidden here */}
    {showLoader ? (
      <LoadingScreen onStart={()=> setShowLoader(false)} />
    ) : (
      <div className="main bg-[#f4be2c] w-full overflow-x-hidden">
        <HeroSection />
        <HowItWorks />
      </div>
    )}      
  </main>
);
}
