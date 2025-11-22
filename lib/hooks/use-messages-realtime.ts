'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@/lib/supabase/use-browser-client';
import type { Message } from '@/lib/types/messages';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseMessagesRealtimeOptions {
  userId?: string;
}

export function useMessagesRealtime(options?: UseMessagesRealtimeOptions) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const { userId } = options || {};
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Clean up previous channel if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create new channel
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: any) => {
          const newMessage: Message = {
            ...(payload.new as any),
            is_own: payload.new.user_id === userId,
          };

          // Update React Query cache
          queryClient.setQueryData<Message[]>(['messages', userId], (old) => {
            if (!old) return [newMessage];
            // Avoid duplicates
            if (old.some((msg) => msg.id === newMessage.id)) {
              return old;
            }
            return [...old, newMessage];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [supabase, queryClient, userId]);

  return {
    isConnected: !!channelRef.current,
  };
}

