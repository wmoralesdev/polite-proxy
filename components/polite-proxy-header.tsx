'use client';

import { LogOut, Biohazard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@supabase/supabase-js';

interface PoliteProxyHeaderProps {
  isAuthenticated: boolean;
  user: User | null;
  onSignOut: () => void;
}

function getUserDisplayName(user: User | null): string {
  if (!user) return '';
  // Extract first name from Google user metadata
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User';
  // Return only the first name
  return fullName.split(' ')[0];
}

function getUserInitials(user: User | null): string {
  if (!user) return '?';
  const firstName = getUserDisplayName(user);
  return firstName.substring(0, 1).toUpperCase();
}

export function PoliteProxyHeader({
  isAuthenticated,
  user,
  onSignOut,
}: PoliteProxyHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b-4 border-black bg-primary relative overflow-hidden">
      {/* Stripe overlay for header */}
      <div className="absolute top-0 right-0 w-16 h-full hazard-stripe opacity-20" />

      <div className="flex items-center gap-3 z-10 flex-1 min-w-0">
        <div className="bg-black text-primary p-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] flex-shrink-0">
          <Biohazard className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="text-xl font-black tracking-tighter uppercase leading-none italic">
            POLITE PROXY
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-2 h-2 rounded-none flex-shrink-0 ${
                isAuthenticated ? 'bg-black animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span className="text-[10px] font-bold text-black uppercase tracking-widest">
              {isAuthenticated ? 'Filtration Active' : 'System Offline'}
            </span>
          </div>
        </div>
      </div>

      {isAuthenticated && user && (
        <div className="flex items-center gap-2 z-10 flex-shrink-0">
          <div className="flex items-center gap-2 bg-black/10 px-2 py-1 rounded-none border border-black/20">
            <Avatar className="w-6 h-6 border border-black rounded-none">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-black text-[10px] font-bold rounded-none">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-bold text-black uppercase tracking-wider max-w-[100px] truncate">
              {getUserDisplayName(user)}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onSignOut}
            className="h-9 w-9 border-2 border-black bg-white hover:bg-black hover:text-primary transition-colors rounded-none"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      )}
    </CardHeader>
  );
}

