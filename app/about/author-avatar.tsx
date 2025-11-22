'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function AuthorAvatar() {
  const [isToxic, setIsToxic] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger glitch effect before swapping
      setIsGlitching(true);
      
      setTimeout(() => {
        setIsToxic((prev) => !prev);
      }, 150); // Swap halfway through glitch

      setTimeout(() => {
        setIsGlitching(false);
      }, 300); // End glitch
    }, 3000); // Toggle every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 w-24 overflow-hidden border-2 border-black bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className={cn(
        "relative w-full h-full transition-all duration-100",
        isGlitching && "translate-x-1 translate-y-[-2px] saturate-200 contrast-200 scale-110"
      )}>
        <Image
          src={isToxic ? "/me-toxic.png" : "/me.jpeg"}
          alt="Walter Morales"
          fill
          className="object-cover"
          sizes="96px"
          priority
        />
        
        {/* Glitch overlays */}
        {isGlitching && (
          <>
            <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay animate-pulse" />
            <div className="absolute inset-0 bg-green-500/20 mix-blend-color-dodge translate-x-[-2px]" />
          </>
        )}
      </div>
      
      {/* Status indicator */}
      <div className={cn(
        "absolute bottom-0 right-0 h-4 w-4 border-2 border-black transition-colors duration-300",
        isToxic ? "bg-red-500 animate-pulse" : "bg-green-500"
      )} />
    </div>
  );
}
