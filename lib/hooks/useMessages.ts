'use client';

import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from '@/lib/supabase/useBrowserClient';
import type { Message } from '@/lib/types/messages';

interface UseMessagesOptions {
  userId?: string;
  initialMessages?: Message[];
}

export function useMessages(options?: UseMessagesOptions) {
  const supabase = useSupabaseClient();
  const { userId, initialMessages } = options || {};

  const {
    data: messages = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Message[]>({
    queryKey: ['messages', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedMessages: Message[] = (data || [])
        .map((msg: any) => ({
          ...msg,
          is_own: msg.user_id === userId,
        }))
        .reverse();

      return formattedMessages;
    },
    enabled: !!userId,
    initialData: initialMessages,
  });

  return {
    messages,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

