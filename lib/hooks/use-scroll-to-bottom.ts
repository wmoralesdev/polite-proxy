'use client';

import { useEffect, RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement | null>(
  ref: RefObject<T>,
  deps: unknown[]
) {
  useEffect(() => {
    if (ref.current) {
      const scrollContainer = ref.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, deps);
}

