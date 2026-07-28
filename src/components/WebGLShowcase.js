import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './WebGLShowcase.css';

const WebGLShowcase = () => {
  const [isOpen, setIsOpen] = useState(false);
  const gameUrl = `${process.env.PUBLIC_URL}/portfolio-app/index.html`;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const gameModal = isOpen
    ? createPortal(
        <div className="webgl-modal" role="dialog" aria-modal="true" aria-label="Portfolio WebGL game">
          <button
            type="button"
            className="webgl-modal-backdrop"
            aria-label="Close WebGL game"
            onClick={() => setIsOpen(false)}
          />
          <div className="webgl-modal-panel">
            <div className="webgl-modal-header">
              <div>
                <p className="webgl-modal-kicker">Playable WebGL Demo</p>
                <h3>Portfolio Game</h3>
              </div>
              <button
                type="button"
                className="webgl-modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close WebGL game"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <iframe
              title="Portfolio WebGL App"
              src={gameUrl}
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
      <div className="webgl-launch-card reveal-scale">
        <div>
          <p className="webgl-kicker">Interactive WebGL Demo</p>
          <p className="webgl-copy">
            Launch the playable portfolio game in a focused popup without leaving the page.
          </p>
        </div>
        <button type="button" className="webgl-play-button" onClick={() => setIsOpen(true)}>
          <span className="material-symbols-outlined">stadia_controller</span>
          Play WebGL Game
        </button>
      </div>
      {gameModal}
    </section>
  );
};

export default WebGLShowcase;
