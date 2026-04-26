'use client';

import Image from 'next/image';
import { Volume2 } from 'lucide-react';
import LogoAnimation from './LogoAnimation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Navbar() {
  gsap.registerPlugin(ScrollTrigger)
  useGSAP(() => {
    gsap.to(".logo-letter", {
      opacity: 1,
      duration: 0.3,
    })
    gsap.to(".sub-logo", {
      opacity: 1,
      duration: 0.2,
    })

    gsap.to(".nav", {
      background: "#e7000b", // i want full background, i is like transparent
      position: "fixed",
      duration: 0.1,
      paddingLeft: "100px",
      paddingRight: "100px",
      borderBottom: "5px solid black",
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        scrub: true,
      }

    })
  })
  return (
    <div className="nav z-100 w-full flex items-center justify-between px-20 py-6 font-bold text-black relative">
      <div className="flex gap-10 text-lg">
        <p className="cursor-pointer">How it works</p>
        <p className="cursor-pointer">Locations</p>
      </div>

      {/* Logo */}
      <LogoAnimation />

      <div className="flex items-center gap-10 text-lg">
        <p className="cursor-pointer">Contact</p>

        <div className="flex items-center gap-2 border-2 border-black rounded-full px-3 py-1">
          <span>Sound on</span>
          <Volume2 size={18} />
        </div>
      </div>
    </div>
  );
}