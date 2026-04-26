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
    <main className="min-h-screen overflow-x-hidden" >
      {showLoader ? (
        <LoadingScreen onStart={()=> setShowLoader(false)} />
      ) : (
        <>
        <HeroSection />
        <HowItWorks />
        
        </>
      )}      
    </main>
  );
}
