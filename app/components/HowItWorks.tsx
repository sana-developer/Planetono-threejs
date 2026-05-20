"use client";

import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import HowItWorksModels from "./HowItWorksModels";

const steps = [
  { step: 1, title: "Choose your meal" },
  { step: 2, title: "Size your fries" },
  { step: 3, title: "Pick a snack" },
  { step: 4, title: "Claim your toy" }
];

export function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      const scrolledIntoSection = -rect.top;
      
      if (scrolledIntoSection < 0) {
        setCurrentStep(1);
        return;
      }

      const scrollFraction = Math.min(Math.max(scrolledIntoSection / totalHeight, 0), 1);
      
      if (scrollFraction < 0.25) setCurrentStep(1);
      else if (scrollFraction < 0.5) setCurrentStep(2);
      else if (scrollFraction < 0.75) setCurrentStep(3);
      else setCurrentStep(4);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="how-it-works-section relative w-full h-[400vh] bg-gradient-to-b from-indigo-900 via-purple-900 to-black"
    >
      {/* Sticky view pane frame */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* 3D Scene Viewport */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Canvas camera={{ position: [0, 0, 195], fov: 45 }}>
            <HowItWorksModels />
          </Canvas>
        </div>

        {/* Interface Overlay Layers */}
        <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-8 md:p-12">
          <div className="w-full flex justify-between items-start pt-4">
            <div className="relative top-4 left-12 animate-bounce pointer-events-auto">
              <Image src="/star.svg" alt="star" width={50} height={50} />
            </div>
            <div className="relative top-24 right-24 animate-pulse pointer-events-auto">
              <Image src="/star.svg" alt="star" width={65} height={65} />
            </div>
          </div>

          <div className="w-full flex flex-col gap-6 md:gap-8 pb-4 pointer-events-auto">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-wide drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
              How it works
            </h2>
            
            <div className="flex flex-wrap gap-4">
              {steps.map((s) => (
                <div key={s.step} className="flex flex-row gap-2">
                  <button
                    onClick={() => {
                      if (!containerRef.current) return;
                      const sectionTop = containerRef.current.offsetTop;
                      const sectionHeight = containerRef.current.offsetHeight - window.innerHeight;
                      const targetY = sectionTop + ((s.step - 1) / 3) * sectionHeight;
                      
                      window.scrollTo({ top: targetY, behavior: 'smooth' });
                    }}
                    className={`border-3 border-black rounded-xl p-3 px-6 shadow-[4px_4px_0px_black] font-black text-xl transition-all active:scale-95
                      ${currentStep === s.step ? 'bg-yellow-400 text-black' : 'bg-white text-black'}`}
                  >
                    {s.step}
                  </button>
                  
                  <button
                    className={`${currentStep === s.step ? 'block' : 'hidden'} border-3 border-black rounded-xl p-3 px-6 shadow-[4px_4px_0px_black]
                                font-bold text-xl bg-white text-black`}
                  >
                    {s.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}