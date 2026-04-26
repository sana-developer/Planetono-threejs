'use client'

import gsap from "gsap";
import { useRef } from "react";

function LogoAnimation() {
  const text = 'PLANETOÑO';
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const handleHover = (index: number) => {
    const targets = [
      lettersRef.current[index - 1],
      lettersRef.current[index],
      lettersRef.current[index + 1],
    ].filter(Boolean);

    gsap.to(targets, {
      y: -20,
      duration: 0.2,
      ease: 'power2.out',
      stagger: 0.05,
    });

    gsap.to(targets, {
      y: 0,
      duration: 0.4,
      ease: 'bounce.out',
      delay: 0.2,
      stagger: 0.05,
    });
  };

  return (
    <div className="relative text-center mb-10">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white cartoon-text flex justify-center gap-1">
        {text.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => (lettersRef.current[i] = el)}
            onMouseEnter={() => handleHover(i)}
            className="logo-letter inline-block opacity-0 cursor-pointer"
          >
            {char}
          </span>
        ))}
      </h1>

      <p className="sub-logo opacity-0 absolute left-1/2 -translate-x-1/2 top-9 text-yellow-300 text-2xl font-semibold mt-1 cartoon-text">
        惑星ちゃん
      </p>
    </div>
  );
}

export default LogoAnimation;