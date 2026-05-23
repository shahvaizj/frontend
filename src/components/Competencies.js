import React from 'react';
import './Competencies.css';

const ACCENT_CYCLE = ['var(--accent-color)', 'var(--accent-2)', 'var(--accent-3)'];

const Competencies = ({ competencies }) => {
  if (!competencies || competencies.length === 0) return null;

  return (
    <section id="competencies" className="competencies-section reveal">
      <h2 className="section-heading">Core Competencies</h2>
      <p className="competencies-subtitle">Mapped against CIO / Executive Director of Engineering requirements</p>
      <div className="competencies-grid">
        {competencies.map((item, i) => {
          const accent = ACCENT_CYCLE[i % 3];
          return (
            <div key={i} className="competency-card reveal" style={{ '--card-accent': accent }}>
              <div className="competency-icon">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <h3 className="competency-area">{item.area}</h3>
              <p className="competency-evidence">{item.evidence}</p>
              <div className="competency-target">
                <span className="material-symbols-outlined target-icon">arrow_forward</span>
                <span>{item.target}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Competencies;
