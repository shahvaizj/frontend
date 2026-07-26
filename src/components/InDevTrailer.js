import React, { useState } from 'react';
import './InDevTrailer.css';

const InDevTrailer = () => {
  const [open, setOpen] = useState(false);

  return (
    <section id="in-dev" className="indev-section reveal">
      <div className="indev-header">
        <span className="indev-badge">In Development</span>
        <h2 className="section-heading">Currently in the Forge</h2>
        <p className="indev-subtext">An early look at something being built right now.</p>
      </div>

      {open ? (
        <div className="indev-frame-wrap">
          <iframe
            title="In Development Project Trailer"
            src="https://www.youtube.com/embed/3IGaeBu36OA?autoplay=1"
            className="indev-frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button type="button" className="reveal-embed-btn" onClick={() => setOpen(true)}>
          <span className="material-symbols-outlined">play_arrow</span>
          Watch the trailer
        </button>
      )}
    </section>
  );
};

export default InDevTrailer;
