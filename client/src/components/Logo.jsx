import React from 'react';

export default function Logo({ className = "w-6 h-6", iconClassName = "w-4 h-4" }) {
  return (
    <div className={`${className} rounded-md bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shrink-0`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={iconClassName}
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.25 4.64" />
      </svg>
    </div>
  );
}
