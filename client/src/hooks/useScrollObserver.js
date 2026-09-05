import { useEffect } from 'react';

export const useScrollObserver = (dependency) => {
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const scanAndReveal = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in or near viewport, reveal immediately
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    scanAndReveal();

    const timer1 = setTimeout(scanAndReveal, 100);
    const timer2 = setTimeout(scanAndReveal, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
    };
  }, [dependency]);
};
