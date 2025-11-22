'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@/lib/supabase/use-browser-client';

interface UseSubmitMessageOptions {
  userId?: string;
}

export function useSubmitMessage(options?: UseSubmitMessageOptions) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const { userId } = options || {};

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const { data, error } = await supabase.functions.invoke('submit-message', {
        body: { message: message.trim() },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate queries as safety net (realtime should handle updates)
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['messages', userId] });
      }
    },
  });

  return {
    submitMessage: mutation.mutateAsync,
    isProcessing: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

