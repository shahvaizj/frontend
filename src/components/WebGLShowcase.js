import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './WebGLShowcase.css';

const WebGLShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsPlaying(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isPlaying]);

  if (isMobile) return null;

  // The iframe only mounts while the popup is open, so the game never loads until asked for.
  const gameModal = isPlaying
    ? createPortal(
        <div className="webgl-modal" onClick={() => setIsPlaying(false)}>
          <button className="webgl-modal-close" onClick={() => setIsPlaying(false)} aria-label="Close game">
            &times;
          </button>
          <div className="webgl-modal-content" onClick={(event) => event.stopPropagation()}>
            <iframe
              title="Portfolio WebGL App"
              src={`${process.env.PUBLIC_URL}/portfolio-app/index.html`}
              className="webgl-frame"
              allowFullScreen
            />
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <section id="webgl-showcase" className="webgl-showcase-section reveal">
      <h2 className="section-heading">While you are here, let's play a game.</h2>

      <div className="webgl-launch-row">
        <button className="webgl-launch-button" onClick={() => setIsPlaying(true)}>
          <span className="material-symbols-outlined">sports_esports</span>
          Start Game
        </button>
      </div>

      {gameModal}
    </section>
  );
};

export default WebGLShowcase;
