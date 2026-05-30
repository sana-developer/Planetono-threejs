'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useRef } from 'react';
import LogoAnimation from './LogoAnimation';

export default function LoadingScreen({onStart}: {onStart: () => void}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Stars appear
    tl.to('.star', {
      opacity: 1,
      stagger: 0.25,
      duration: 0.4,
    })
      .to('.stars', {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          gsap.set('.stars', { display: 'none' });
        }
      })

      .fromTo(
        '.logo-letter',
        {
          x: -60,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "power3.out",
        }
      )
      .to('.logo-letter', {
        y: -20,
        stagger: 0.08,
        duration: 0.25,
        ease: "power2.out",
        repeat: 2,        // total = 3 times (1 initial + 2 repeats)
        yoyo: true,       // up → down → up → down
      })
      .to('.logo-letter', {
        y: 0,
        stagger: 0.08,
        duration: 0.4,
        ease: "bounce.out",
      })

      .to('.sub-logo', {
        opacity: 1,
        y: -10,
        duration: 0.4,
      })

      .to('.start-btn', {
        opacity: 1,
        y: -10,
        duration: 0.4,
      });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-red-600 flex flex-col items-center justify-center relative"
    >
      {/* Stars (keep height to avoid layout shift) */}
      <div className="stars flex gap-2 h-[60px] items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <Image
            key={i}
            src="/star.svg"
            alt="star"
            width={60}
            height={60}
            className="star opacity-0"
          />
        ))}
      </div>

      <LogoAnimation />

      <div className="absolute bottom-10 flex flex-col gap-8 items-center">
        <button
          className="start-btn opacity-0 bg-white text-black text-2xl font-bold px-2 py-1 rounded-lg border-2 border-black shadow-[5px_4px_black] transition cartoon w-25"
          onClick={onStart}
        >
          START
        </button>

        <p className="text-black text-base flex items-center gap-2 font-medium">
          Immersive sound ahead. Use headphones for best effect
          <span className="text-lg">🎧</span>
        </p>
      </div>
    </div>
  );
}
