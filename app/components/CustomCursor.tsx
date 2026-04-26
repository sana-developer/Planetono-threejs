'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: any) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button, a, input, textarea, [role="button"]')
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
  const offset = isPointer
    ? { x: -12, y: -8 }
    : { x: -6, y: -6 };


  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        transform: `translate(${position.x + offset.x}px, ${position.y + offset.y}px)`
      }}
    >
      {!isPointer ? (
        // Arrow Cursor
        <svg
          width="44"
          height="44"
          viewBox="150 150 260 300"
          className="pointer-events-none"
        >
          <path
            d="M174.837 185.856L190.031 432.628L258.911 326.247L385.209 315.743L174.837 185.856Z"
            fill="white"
            stroke="black"
            strokeWidth="20"
            style={{
              filter: "drop-shadow(14px 18px 0px black)"
            }}
          />
        </svg>
      ) : (
        // Hand Cursor
          <svg
            width="55"
            height="95"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-[4px_6px_0px_black]"
          >

            {/* hand */}
            <path
              d="M9.5 14V11.5C9.5 10.7 10.1 10 10.9 10C11.7 10 12.3 10.7 12.3 11.5V14
       M12.3 14V11.8C12.3 11 12.9 10.3 13.7 10.3C14.5 10.3 15.1 11 15.1 11.8V14
       M15.1 14V12.2C15.1 11.4 15.7 10.7 16.5 10.7C17.3 10.7 17.9 11.4 17.9 12.2V16
       C17.9 18 16.4 19.5 14.4 19.5H11.2C9.5 19.5 8 18.2 8 16.5V14"
              stroke="black"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="white"
            />
          </svg>
      )}
    </div>
  );
}
