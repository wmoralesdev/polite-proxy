'use client';

import { useEffect, RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  deps: unknown[]
) {
  useEffect(() => {
    if (ref.current) {
      const scrollContainer = ref.current.querySelector<HTMLElement>(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, deps);
}

