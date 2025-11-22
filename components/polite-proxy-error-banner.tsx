'use client';

import { AlertTriangle } from 'lucide-react';

interface PoliteProxyErrorBannerProps {
  error: string;
}

export function PoliteProxyErrorBanner({
  error,
}: PoliteProxyErrorBannerProps) {
  return (
    <div className="absolute top-4 left-4 right-4 bg-destructive text-white border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider z-20 flex items-center gap-2">
      <AlertTriangle className="w-4 h-4" />
      {error}
    </div>
  );
}

