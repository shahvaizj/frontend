import { useEffect } from 'react';

const useScrollReveal = (trigger) => {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    if (elements.length === 0) {
      return undefined;
    }

    // Safety fallback: never leave content hidden if observer doesn't fire.
    const revealAll = () => {
      elements.forEach((el) => el.classList.add('revealed'));
    };

    if (typeof window.IntersectionObserver !== 'function') {
      revealAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    const fallbackTimer = window.setTimeout(revealAll, 1800);

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [trigger]);
};

export default useScrollReveal;
