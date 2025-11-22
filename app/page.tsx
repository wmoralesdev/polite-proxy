import { createClient } from '@/lib/supabase/server';
import { QueryProvider } from '@/components/query-provider';
import { PoliteProxyClient } from '@/components/polite-proxy-client';
import type { Message } from '@/lib/types/messages';

async function getInitialData() {
  const supabase = await createClient();
  
  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch initial messages if user is authenticated
  let initialMessages: Message[] = [];
  if (user) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      initialMessages = data
        .map((msg: { id: string; content: string; created_at: string; user_id?: string }) => ({
          ...msg,
          is_own: msg.user_id === user.id,
        }))
        .reverse();
    }
  }

  return {
    user,
    initialMessages,
  };
}

export default async function PoliteProxyPage() {
  const { user, initialMessages } = await getInitialData();

  return (
    <QueryProvider>
      <PoliteProxyClient initialUser={user} initialMessages={initialMessages} />
    </QueryProvider>
  );
}
