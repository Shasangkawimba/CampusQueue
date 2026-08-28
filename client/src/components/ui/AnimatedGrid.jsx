import React from 'react';

export default function AnimatedGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#111111] z-10"></div>
      <svg
        className="absolute w-full h-[150%] top-0 left-0 opacity-[0.03] dark:opacity-[0.06] animate-[pulse_10s_ease-in-out_infinite]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="gridPattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>
      {/* Subtle floating glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
    </div>
  );
}
