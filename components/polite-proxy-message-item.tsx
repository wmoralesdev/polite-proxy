'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Message } from '@/lib/types/messages';
import type { User } from '@supabase/supabase-js';

interface PoliteProxyMessageItemProps {
  message: Message;
  currentUser: User | null;
}

export function PoliteProxyMessageItem({
  message,
  currentUser,
}: PoliteProxyMessageItemProps) {
  const isOwn = message.is_own ?? false;
  const avatarUrl = isOwn ? currentUser?.user_metadata?.avatar_url : undefined;
  const avatarFallback = isOwn ? 'ME' : '??';

  return (
    <div
      className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <Avatar className="w-10 h-10 border-2 border-black rounded-none bg-gray-200">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback
          className={`font-bold rounded-none border-b-2 border-r-2 border-black/20 ${
            isOwn ? 'bg-black text-primary' : 'bg-white text-black'
          }`}
        >
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex flex-col max-w-[85%] ${
          isOwn ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`px-4 py-3 text-sm font-bold border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
            isOwn
              ? 'bg-primary text-black border-black'
              : 'bg-white text-black border-black'
          }`}
        >
          {message.content}
        </div>
        <span className="text-[9px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest px-1">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}

