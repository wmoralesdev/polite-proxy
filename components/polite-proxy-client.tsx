'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useChat } from '@/lib/hooks/use-chat';
import { PoliteProxyLoadingScreen } from './polite-proxy-loading-screen';
import { PoliteProxyHeader } from './polite-proxy-header';
import { PoliteProxyUnauthedScreen } from './polite-proxy-unauthed-screen';
import { PoliteProxyErrorBanner } from './polite-proxy-error-banner';
import { PoliteProxyMessageList } from './polite-proxy-message-list';
import { PoliteProxyComposer } from './polite-proxy-composer';
import type { User } from '@supabase/supabase-js';
import type { Message } from '@/lib/types/messages';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PoliteProxyClientProps {
  initialUser?: User | null;
  initialMessages?: Message[];
}

export function PoliteProxyClient({
  initialUser,
  initialMessages,
}: PoliteProxyClientProps) {
  const {
    user,
    isAuthenticated,
    messages,
    isLoading,
    isProcessing,
    error,
    handleSubmit,
    handleSignOut,
    handleLogin,
  } = useChat({ initialUser, initialMessages });

  if (isLoading) {
    return <PoliteProxyLoadingScreen />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 font-mono bg-background text-foreground selection:bg-black selection:text-primary">
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 hazard-stripe-subtle pointer-events-none opacity-50" />

      {/* About Button */}
      <div className="absolute top-4 right-4 z-50">
        <Link href="/about">
          <Button variant="outline" className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white font-bold uppercase tracking-wider">
            <Info className="w-4 h-4 mr-2" />
            Acerca de
          </Button>
        </Link>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md h-[85vh] flex flex-col border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
        <PoliteProxyHeader
          isAuthenticated={isAuthenticated}
          user={user}
          onSignOut={handleSignOut}
        />

        <CardContent className="flex-1 p-0 overflow-hidden relative bg-white">
          {!isAuthenticated ? (
            <PoliteProxyUnauthedScreen onLogin={handleLogin} />
          ) : (
            <>
              {error && <PoliteProxyErrorBanner error={error} />}
              <PoliteProxyMessageList
                messages={messages}
                currentUser={user}
                isProcessing={isProcessing}
              />
            </>
          )}
        </CardContent>

        {isAuthenticated && (
          <CardFooter className="p-0 border-t-4 border-black bg-white">
            <PoliteProxyComposer
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
