import React, { useState } from 'react';
import './WebGLShowcase.css';

const WebGLShowcase = () => {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const [open, setOpen] = useState(false);

  if (isMobile) return null;

  return (
    <section id="webgl-showcase" className="webgl-showcase-section reveal">
      <h2 className="section-heading">While you are here, let's play a game.</h2>

      {open ? (
        <div className="webgl-frame-wrap">
          <iframe
            title="Portfolio WebGL App"
            src={`${process.env.PUBLIC_URL}/portfolio-app/index.html`}
            className="webgl-frame"
            allowFullScreen
          />
        </div>
      ) : (
        <button type="button" className="reveal-embed-btn" onClick={() => setOpen(true)}>
          <span className="material-symbols-outlined">sports_esports</span>
          Launch the game
        </button>
      )}
    </section>
  );
};

export default WebGLShowcase;
