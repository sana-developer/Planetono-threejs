"use client";

import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { useState } from "react";
import HowItWorksModels from "./HowItWorksModels";

const steps = [
  { step: 1, title: "Choose your meal" },
  { step: 2, title: "Size your fries" },
  { step: 3, title: "Pick a snack" },
  { step: 4, title: "Claim your toy" }
];

export function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    // Ensure section has a relative block container style for the pin layout to grip onto
<div className="how-it-works-section relative w-full min-h-screen mb-[2500px]">      
      {/* 3D Viewport Wrapper Layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 90], fov: 45 }}>
          <HowItWorksModels />
        </Canvas>
      </div>

      {/* Foreground UI Components */}
      <div className="relative z-10 w-full min-h-screen pointer-events-none">
        <div className="absolute top-12 right-[50%] pointer-events-auto">
          <Image src="/star.svg" alt="star" width={60} height={60} />
        </div>
        <div className="absolute bottom-[30%] left-[30%] pointer-events-auto">
          <Image src="/star.svg" alt="star" width={60} height={60} />
        </div>

        {/* UI Elements pinned cleanly over the bottom frame */}
        <div className="absolute bottom-12 left-0 w-full flex flex-col gap-6 p-8 pointer-events-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white cartoon-text gap-1 !tracking-normal">
            How it works
          </h2>
          <div className="flex flex-wrap gap-4">
            {steps.map((s) => (
              <div key={s.step} className="flex flex-row gap-2">
                <button
                  onClick={() => setCurrentStep(s.step)}
                  className="border-3 border-black rounded-lg p-3 px-5 shadow-[4px_4px_0px_black] font-bold text-lg
                             hover:translate-x-[2px] hover:translate-y-[2px]
                             hover:shadow-[2px_2px_0px_black] transition-all active:scale-95 bg-white"
                >
                  {s.step}
                </button>
                <button
                  className={`${currentStep === s.step ? 'block' : 'hidden'} border-3 border-black rounded-lg p-3 px-5 shadow-[4px_4px_0px_black]
                             font-bold text-lg hover:translate-x-[2px] hover:translate-y-[2px]
                             hover:shadow-[2px_2px_0px_black] transition-all active:scale-95 bg-white`}
                >
                  {s.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}