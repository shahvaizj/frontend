import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Projects.css';

const AUTO_ADVANCE_MS = 5000;

const ProjectVisualsCarousel = ({ youtubeVideoIds, screenshots, projectName }) => {
  const allVisuals = [];

  if (youtubeVideoIds && youtubeVideoIds.length > 0) {
    youtubeVideoIds.forEach((id) => allVisuals.push({ type: 'youtube', id }));
  }

  if (screenshots && screenshots.length > 0) {
    screenshots.forEach((screenshot) => allVisuals.push({ type: 'screenshot', url: screenshot }));
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalVisuals = allVisuals.length;
  const pausedRef = useRef(false);
  const timerRef = useRef(null);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalVisuals);
  }, [totalVisuals]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalVisuals) % totalVisuals);
  }, [totalVisuals]);

  const goToSlide = useCallback((index) => setCurrentIndex(index), []);

  useEffect(() => {
    if (totalVisuals < 2) return undefined;

    const schedule = () => {
      timerRef.current = setTimeout(() => {
        if (!pausedRef.current) goNext();
        schedule();
      }, AUTO_ADVANCE_MS);
    };

    schedule();
    return () => clearTimeout(timerRef.current);
  }, [totalVisuals, goNext]);

  const handleUserNav = useCallback((fn) => {
    clearTimeout(timerRef.current);
    fn();
  }, []);

  if (totalVisuals === 0) return null;

  return (
    <div
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="project-visuals-carousel-main">
        {totalVisuals > 1 && (
          <>
            <button
              className="project-carousel-arrow left"
              onClick={() => handleUserNav(goPrev)}
              aria-label="Previous visual"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              className="project-carousel-arrow right"
              onClick={() => handleUserNav(goNext)}
              aria-label="Next visual"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </>
        )}

        <div className="carousel-content" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {allVisuals.map((visual, index) => (
            <div key={index} className="carousel-item">
              {visual.type === 'youtube' ? (
                <div className="project-video slideshow-item">
                  <iframe
                    src={`https://www.youtube.com/embed/${visual.id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${projectName} Video ${index + 1}`}
                  ></iframe>
                </div>
              ) : (
                <div className="project-screenshot-item slideshow-item">
                  <img src={`${process.env.PUBLIC_URL}/${visual.url}`} alt={`${projectName} screenshot ${index + 1}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {totalVisuals > 1 && (
        <div className="project-carousel-thumbnails">
          {allVisuals.map((visual, index) => (
            <button
              type="button"
              key={index}
              className={`carousel-thumbnail ${currentIndex === index ? 'active' : ''}`}
              onClick={() => handleUserNav(() => goToSlide(index))}
            >
              {visual.type === 'youtube' ? (
                <img src={`https://img.youtube.com/vi/${visual.id}/default.jpg`} alt={`Thumbnail for ${projectName} video`} />
              ) : (
                <img
                  src={`${process.env.PUBLIC_URL}/${visual.url}`}
                  alt={`Thumbnail for ${projectName} screenshot ${index + 1}`}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectVisualsCarousel;
