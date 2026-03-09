import React from 'react';
import './WebGLShowcase.css';

const WebGLShowcase = () => {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (isMobile) return null;

  return (
    <section id="webgl-showcase" className="webgl-showcase-section reveal">
      <h2 className="section-heading">While you are here, let's play a game.</h2>

      <div className="webgl-frame-wrap">
        <iframe
          title="Portfolio WebGL App"
          src={`${process.env.PUBLIC_URL}/portfolio-app/index.html`}
          className="webgl-frame"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </section>
  );
};

export default WebGLShowcase;
