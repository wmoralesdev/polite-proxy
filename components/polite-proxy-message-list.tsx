'use client';

import { useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PoliteProxyMessageItem } from './polite-proxy-message-item';
import { useScrollToBottom } from '@/lib/hooks/use-scroll-to-bottom';
import type { Message } from '@/lib/types/messages';
import type { User } from '@supabase/supabase-js';

interface PoliteProxyMessageListProps {
  messages: Message[];
  currentUser: User | null;
  isProcessing: boolean;
}

export function PoliteProxyMessageList({
  messages,
  currentUser,
  isProcessing,
}: PoliteProxyMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useScrollToBottom(scrollRef, [messages, isProcessing]);

  return (
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
            <PoliteProxyMessageItem
              key={msg.id}
              message={msg}
              currentUser={currentUser}
            />
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
  );
}

