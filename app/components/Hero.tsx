"use client";

import Image from "next/image";
import { Navbar } from "./Navbar";
import { ArrowLeft, ArrowRight } from "lucide-react";
import HeroModels from "./HeroModels";
import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    title: "BIGGER\nTHAN HUNGER.\nSMALLER THAN\nA PLANET",
    desc1: "Stacked cosmic burger with orbit fries and stardust sauce.",
    desc2: "Comes with Major Paws, the fluffiest captain in the Milky Way.",
  },
  {
    title: "SLICED\nACROSS THE\nGALAXY\nONE BITE",
    desc1: "Cosmic pizza baked in a supernova oven with asteroid toppings.",
    desc2: "Paired with Coffee Nebula — brewed from the darkest matter.",
  },
  {
    title: "THE DOG\nTHAT CROSSED\nTHE EVENT\nHORIZON",
    desc1: "A hotdog so long it bends spacetime. Mustard from Jupiter.",
    desc2: "Relish harvested from the rings of Saturn. Worth the trip.",
  },
];

const Images = ["/bubble.svg", "/pizza_bubble.svg", "/hotDog_bubble.svg"];

const AUTO_SWITCH_MS = 3000;

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  // Progress bar + auto-switch
  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / AUTO_SWITCH_MS) * 100, 100);
      setProgress(pct);
      if (elapsed >= AUTO_SWITCH_MS) {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
        setProgress(0);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [current]);

  const slide = SLIDES[current];

  return (
    <div className="hero w-full min-h-screen bg-[#f4be2c] relative overflow-hidden">
      <Navbar />

      <div className="relative grid grid-cols-3 items-center px-10">
        {/* LEFT */}
        <div className="flex flex-col items-start gap-6">
          <div className="absolute top-0">
            <Image src={Images[current]} alt="bubble" width={350} height={350} />
          </div>
          <Image src="/star.svg" alt="star" width={60} height={60} />
        </div>

        <div className="absolute top-2.5 right-[50%]">
          <Image src="/star.svg" alt="star" width={60} height={60} />
        </div>
        <div className="absolute bottom-[30%] left-[30%]">
          <Image src="/star.svg" alt="star" width={60} height={60} />
        </div>

        {/* CENTER */}
        <div className="flex justify-center">
          <div className="absolute top-0 w-55 h-85 bg-red-600 rounded-[50%]" />
          <div className="absolute top-20 w-150 h-80">
            <Canvas camera={{ position: [0, 0, 90], fov: 45 }}>
              <HeroModels activeIndex={current} />
            </Canvas>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6 transition-all duration-500">
          <h1
            key={current}
            className="text-5xl font-extrabold leading-tight whitespace-pre-line
                       animate-fade-in"
          >
            {slide.title}
          </h1>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <p>{slide.desc1}</p>
            <p>{slide.desc2}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={() => goTo(current - 1)}
              className="border-2 border-black rounded-lg p-3 shadow-[4px_4px_0px_black]
                         hover:translate-x-[2px] hover:translate-y-[2px]
                         hover:shadow-[2px_2px_0px_black] transition-all active:scale-95"
            >
              <ArrowLeft />
            </button>

            {/* Dot indicators with progress on active */}
            <div className="flex items-center gap-3">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative flex items-center"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  {i === current ? (
                    // Active: wide pill with progress fill
                    <div className="w-20 h-2 bg-black/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full transition-none"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ) : (
                    // Inactive: small dot
                    <div className="w-2 h-2 bg-black/40 rounded-full hover:bg-black transition-colors" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => goTo(current + 1)}
              className="border-2 border-black rounded-lg p-3 shadow-[4px_4px_0px_black]
                         hover:translate-x-[2px] hover:translate-y-[2px]
                         hover:shadow-[2px_2px_0px_black] transition-all active:scale-95"
            >
              <ArrowRight />
            </button>
          </div>

          {/* Slide counter */}
          <p className="text-sm font-bold text-black/50">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(SLIDES.length).padStart(2, "0")}
          </p>
        </div>
      </div>
    </div>
  );
}