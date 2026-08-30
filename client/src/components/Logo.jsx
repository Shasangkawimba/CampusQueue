import React from 'react';

export default function Logo({ className = "w-8 h-8", iconClassName = "" }) {
  return (
    <div className={`flex items-center justify-center shrink-0 bg-white rounded-[22%] shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-black/10 ${className}`}>
      <img 
        src="/logo.png" 
        alt="CampusQueue Logo" 
        className={`w-[75%] h-[75%] object-contain ${iconClassName}`} 
      />
    </div>
  );
}
