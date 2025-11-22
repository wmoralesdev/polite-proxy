'use client';

import { useSupabaseAuth } from './useSupabaseAuth';
import { useMessages } from './useMessages';
import { useMessagesRealtime } from './useMessagesRealtime';
import { useSubmitMessage } from './useSubmitMessage';
import type { User } from '@supabase/supabase-js';
import type { Message } from '@/lib/types/messages';

interface UseChatOptions {
  initialUser?: User | null;
  initialMessages?: Message[];
}

export function useChat(options?: UseChatOptions) {
  const auth = useSupabaseAuth({ initialUser: options?.initialUser });
  const messages = useMessages({
    userId: auth.user?.id,
    initialMessages: options?.initialMessages,
  });
  const realtime = useMessagesRealtime({ userId: auth.user?.id });
  const submitMessage = useSubmitMessage({ userId: auth.user?.id });

  const handleSubmit = async (message: string) => {
    if (!message.trim() || !auth.user) return;
    await submitMessage.submitMessage(message);
  };

  const handleLogin = async () => {
    await auth.signInWithGoogle();
  };

  const handleSignOut = async () => {
    await auth.signOut();
  };

  // Combine errors (prioritize mutation error, then auth error, then messages error)
  const error =
    submitMessage.error || auth.authError || messages.error || null;

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    messages: messages.messages,
    isLoading: auth.isAuthLoading || messages.isLoading,
    isProcessing: submitMessage.isProcessing,
    error,
    handleSubmit,
    handleSignOut,
    handleLogin,
    isRealtimeConnected: realtime.isConnected,
  };
}

