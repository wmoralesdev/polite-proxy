'use client';

import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@/lib/supabase/use-browser-client';
import type { User } from '@supabase/supabase-js';

interface UseSupabaseAuthOptions {
  initialUser?: User | null;
}

export function useSupabaseAuth(options?: UseSupabaseAuthOptions) {
  const supabase = useSupabaseClient();
  const [user, setUser] = useState<User | null>(options?.initialUser ?? null);
  const [isAuthLoading, setIsAuthLoading] = useState(!options?.initialUser);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // If we have initialUser, skip initial fetch
    if (options?.initialUser !== undefined) {
      setIsAuthLoading(false);
      return;
    }

    // Otherwise, fetch user on mount
    const initAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err: any) {
        console.error('Auth init error:', err);
        setAuthError(err.message || 'Failed to get user');
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, [supabase, options?.initialUser]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
      setAuthError(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError('Failed to authenticate');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      console.error('Sign out error:', err);
      setAuthError('Failed to sign out');
      throw err;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isAuthLoading,
    authError,
    signInWithGoogle,
    signOut,
  };
}

