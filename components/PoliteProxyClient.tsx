'use client';

import { useState, useRef } from 'react';
import { Send, LogOut, Lock, AlertTriangle, Skull, Biohazard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat } from '@/lib/hooks/useChat';
import { useScrollToBottom } from '@/lib/hooks/useScrollToBottom';
import type { User } from '@supabase/supabase-js';
import type { Message } from '@/lib/types/messages';

interface PoliteProxyClientProps {
  initialUser?: User | null;
  initialMessages?: Message[];
}

export function PoliteProxyClient({
  initialUser,
  initialMessages,
}: PoliteProxyClientProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    user,
    isAuthenticated,
    messages,
    isLoading,
    isProcessing,
    error,
    handleSubmit: submitMessage,
    handleSignOut,
    handleLogin,
  } = useChat({ initialUser, initialMessages });

  useScrollToBottom(scrollRef, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || !user) return;
    try {
      await submitMessage(input);
      setInput('');
    } catch (err) {
      // Error is handled by useChat hook
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-bold uppercase tracking-wider">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 font-mono bg-background text-foreground selection:bg-black selection:text-primary">
      {/* Industrial Background Pattern */}
      <div className="absolute inset-0 hazard-stripe-subtle pointer-events-none opacity-50" />

      {/* Main Card */}
      <Card className="w-full max-w-md h-[85vh] flex flex-col border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b-4 border-black bg-primary relative overflow-hidden">
          {/* Stripe overlay for header */}
          <div className="absolute top-0 right-0 w-16 h-full hazard-stripe opacity-20" />

          <div className="flex items-center gap-3 z-10">
            <div className="bg-black text-primary p-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
              <Biohazard className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none italic">
                POLITE PROXY
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`w-2 h-2 rounded-none ${
                    isAuthenticated ? 'bg-black animate-pulse' : 'bg-gray-400'
                  }`}
                />
                <span className="text-[10px] font-bold text-black uppercase tracking-widest">
                  {isAuthenticated ? 'Filtration Active' : 'System Offline'}
                </span>
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleSignOut}
              className="h-9 w-9 border-2 border-black bg-white hover:bg-black hover:text-primary transition-colors rounded-none z-10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>

        {/* Main Content */}
        <CardContent className="flex-1 p-0 overflow-hidden relative bg-white">
          {!isAuthenticated ? (
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
                  onClick={handleLogin}
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
          ) : (
            <>
              {error && (
                <div className="absolute top-4 left-4 right-4 bg-destructive text-white border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider z-20 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
              <ScrollArea className="h-full px-4 py-4" ref={scrollRef}>
                <div className="space-y-6 pb-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div className="space-y-2">
                        <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm">
                          No Messages Yet
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Be the first to test the filter
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${
                          msg.is_own ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <Avatar className="w-10 h-10 border-2 border-black rounded-none bg-gray-200">
                          <AvatarImage
                            src={
                              msg.is_own ? user?.user_metadata?.avatar_url : undefined
                            }
                          />
                          <AvatarFallback
                            className={`font-bold rounded-none border-b-2 border-r-2 border-black/20 ${
                              msg.is_own
                                ? 'bg-black text-primary'
                                : 'bg-white text-black'
                            }`}
                          >
                            {msg.is_own ? 'ME' : '??'}
                          </AvatarFallback>
                        </Avatar>

                        <div
                          className={`flex flex-col max-w-[85%] ${
                            msg.is_own ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div
                            className={`px-4 py-3 text-sm font-bold border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                              msg.is_own
                                ? 'bg-primary text-black border-black'
                                : 'bg-white text-black border-black'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest px-1">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}

                  {isProcessing && (
                    <div className="flex gap-3 flex-row-reverse">
                      <Avatar className="w-10 h-10 border-2 border-black rounded-none opacity-50">
                        <AvatarFallback className="rounded-none bg-black text-white">
                          ME
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-yellow-100 text-black border-2 border-black border-dashed px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 animate-pulse">
                        <AlertTriangle className="w-4 h-4" />
                        Sanitizing...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </CardContent>

        {/* Footer / Composer */}
        {isAuthenticated && (
          <CardFooter className="p-0 border-t-4 border-black bg-white">
            <div className="relative w-full flex flex-col">
              {/* Warning Tape */}
              <div className="w-full h-2 hazard-stripe" />

              <div className="flex relative">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Enter toxic waste here..."
                    className="min-h-[80px] w-full rounded-none border-0 bg-white text-black placeholder:text-gray-400 focus-visible:ring-0 py-4 px-4 text-sm font-bold resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    maxLength={500}
                    disabled={isProcessing}
                  />
                </div>

                <Button
                  className={`h-auto w-20 rounded-none border-l-4 border-black transition-all duration-200 flex flex-col gap-1 ${
                    input.trim() && !isProcessing
                      ? 'bg-black text-primary hover:bg-primary hover:text-black'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleSubmit}
                  disabled={isProcessing || !input.trim()}
                >
                  <Send className="w-6 h-6" />
                  <span className="text-[8px] font-black uppercase">Send</span>
                </Button>
              </div>
            </div>
            <div className="absolute -top-6 right-0 bg-black text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest border-l-4 border-t-4 border-r-4 border-white transform skew-x-[-10deg] translate-x-2">
              Output: Safe
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

