'use client';

import { Lock, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PoliteProxyUnauthedScreenProps {
  onLogin: () => void;
}

export function PoliteProxyUnauthedScreen({
  onLogin,
}: PoliteProxyUnauthedScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8 bg-grid-black/5">
      <div className="relative group">
        <div className="absolute -inset-2 bg-black translate-x-2 translate-y-2 transition-transform" />
        <div className="relative bg-primary border-2 border-black p-6">
          <Skull className="w-16 h-16 text-black" />
        </div>
      </div>

      <div className="space-y-3 max-w-xs mx-auto">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-black italic">
          Toxic Content <br /> Detected
        </h2>
        <p className="text-black font-bold text-sm border-l-4 border-primary pl-4 text-left">
          Your input is dangerous. <br />
          Our AI sanitizes it before it infects the database.
        </p>
      </div>

      <div className="w-full space-y-4 pt-4">
        <Button
          onClick={onLogin}
          size="lg"
          className="w-full bg-black text-primary hover:bg-primary hover:text-black border-2 border-transparent hover:border-black font-black uppercase tracking-widest text-sm h-14 shadow-[4px_4px_0px_0px_var(--color-primary)] hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 rounded-none"
        >
          Authenticate via Google
        </Button>

        <div className="flex items-center justify-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-gray-100 border border-black/20 p-2 text-black">
          <Lock className="w-3 h-3" />
          <span>
            Write Access:{' '}
            <span className="bg-black text-white px-1">DENIED</span>
          </span>
        </div>
      </div>
    </div>
  );
}

