import React, { useState, useEffect, useRef } from 'react';
import './Projects.css';

const ProjectVisualsCarousel = ({ youtubeVideoIds, screenshots, projectName }) => {
  const allVisuals = [];
  if (youtubeVideoIds && youtubeVideoIds.length > 0) {
    youtubeVideoIds.forEach(id => allVisuals.push({ type: 'youtube', id }));
  }
  if (screenshots && screenshots.length > 0) {
    screenshots.forEach(screenshot => allVisuals.push({ type: 'screenshot', url: screenshot }));
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const timeoutRef = useRef(null);
  const playerRefs = useRef({});

  const totalVisuals = allVisuals.length;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      allVisuals.forEach((visual, index) => {
        if (visual.type === 'youtube' && !playerRefs.current[index]) {
          playerRefs.current[index] = new window.YT.Player(`youtube-player-${index}`, {
            events: {
              onStateChange: (event) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  setIsVideoPlaying(true);
                } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                  setIsVideoPlaying(false);
                }
              }
            }
          });
        }
      });
    };

    return () => {
      resetTimeout();
    };
  }, []);

  useEffect(() => {
    resetTimeout();
    if (totalVisuals > 1 && !isPaused && !isVideoPlaying) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalVisuals);
      }, 5000);
    }
    return () => {
      resetTimeout();
    };
  }, [currentIndex, totalVisuals, isPaused, isVideoPlaying]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPaused(false);
  };

  if (totalVisuals === 0) {
    return null;
  }

  return (
    <>
      <div
        className="project-visuals-carousel-main"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="carousel-content" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {allVisuals.map((visual, index) => (
            <div key={index} className="carousel-item">
              {visual.type === 'youtube' ? (
                <div className="project-video slideshow-item">
                  <iframe
                    id={`youtube-player-${index}`}
                    src={`https://www.youtube.com/embed/${visual.id}?enablejsapi=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${projectName} Video`}
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
            <div
              key={index}
              className={`carousel-thumbnail ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              {visual.type === 'youtube' ? (
                <img
                  src={`https://img.youtube.com/vi/${visual.id}/default.jpg`}
                  alt={`Thumbnail for ${projectName} video`}
                />
              ) : (
                <img
                  src={`${process.env.PUBLIC_URL}/${visual.url}`}
                  alt={`Thumbnail for ${projectName} screenshot ${index + 1}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectVisualsCarousel;
