import React from 'react';
import './InDevTrailer.css';

const InDevTrailer = () => (
  <section id="in-dev" className="indev-section reveal">
    <div className="indev-header">
      <span className="indev-badge">In Development</span>
      <h2 className="section-heading">Currently in the Forge</h2>
      <p className="indev-subtext">An early look at something being built right now.</p>
    </div>
    <div className="indev-frame-wrap">
      <iframe
        title="In Development Project Trailer"
        src="https://www.youtube.com/embed/3IGaeBu36OA"
        className="indev-frame"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </section>
);

export default InDevTrailer;
