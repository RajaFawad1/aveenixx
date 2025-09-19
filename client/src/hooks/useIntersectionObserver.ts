import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '0px',
        root: options.root || null,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin, options.root]);

  return { elementRef, hasIntersected };
}