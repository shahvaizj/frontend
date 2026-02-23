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
  const playerRefs = useRef({});

  const totalVisuals = allVisuals.length;

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      allVisuals.forEach((visual, index) => {
        if (visual.type === 'youtube' && !playerRefs.current[index]) {
          playerRefs.current[index] = new window.YT.Player(`youtube-player-${index}`, {});
        }
      });
    };
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (totalVisuals === 0) {
    return null;
  }

  return (
    <>
      <div className="project-visuals-carousel-main">
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
