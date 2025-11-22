'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PoliteProxyComposerProps {
  onSubmit: (message: string) => Promise<void>;
  isProcessing: boolean;
}

export function PoliteProxyComposer({
  onSubmit,
  isProcessing,
}: PoliteProxyComposerProps) {
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;
    const message = input.trim();
    setInput('');
    await onSubmit(message);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
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
            onKeyDown={handleKeyDown}
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
      <div className="absolute -top-6 right-0 bg-black text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest border-l-4 border-t-4 border-r-4 border-white transform skew-x-[-10deg] translate-x-2">
        Output: Safe
      </div>
    </div>
  );
}

