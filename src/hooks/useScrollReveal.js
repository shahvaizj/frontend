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
    /* True last resort — IntersectionObserver is what should reveal each
       element the moment it's actually scrolled to (each one unobserves
       itself once triggered, so this timer only ever touches elements the
       observer hasn't caught yet). It must stay long enough that no normal
       visit ever reaches it before real scrolling does; it exists purely to
       guard against the observer failing outright, not to pace reveals. */
    const fallbackTimer = window.setTimeout(revealAll, 15000);

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [trigger]);
};

export default useScrollReveal;
