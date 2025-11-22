'use client';

import { useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

let clientInstance: SupabaseClient | null = null;

export function useSupabaseClient() {
  return useMemo(() => {
    if (!clientInstance) {
      clientInstance = createClient();
    }
    return clientInstance;
  }, []);
}

