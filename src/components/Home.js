import React, { useState } from 'react';
import './Home.css';

const Home = ({ about, funTitles, contactEmail, id }) => {
  const [displayTitle, setDisplayTitle] = useState(about.title);

  const handleDotMouseEnter = (title) => {
    setDisplayTitle(title);
  };

  const handleDotMouseLeave = () => {
    setDisplayTitle(about.title);
  };

  const highlightKeywords = (text) => {
    const keywords = [
      { text: '9+ years', className: 'highlight-years' },
      { text: 'Senior Unity Game Developer', className: 'highlight-years' },
      { text: 'Unity3D', className: 'highlight-tech' },
      { text: 'multiplayer', className: 'highlight-tech' },
      { text: 'real-time', className: 'highlight-tech' },
      { text: 'cross-platform', className: 'highlight-skills' },
      { text: 'high-performance', className: 'highlight-skills' },
    ];

    let result = text;
    keywords.forEach(({ text: keyword, className }) => {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedKeyword})`, 'gi');
      result = result.replace(regex, `<span class="${className}">$1</span>`);
    });
    return result;
  };

  return (
    <section id="home" className="home-section">
      <h1>Muhammad Shahvaiz Jahangeer</h1>
      <div key={displayTitle} className="animated-title-container">
        <h2>{displayTitle}</h2>
      </div>
      {funTitles && (
        <div className="fun-titles-dots">
          {[about.title, ...funTitles].map((title, index) => (
            <span
              key={index}
              className={`fun-title-dot ${displayTitle === title ? 'active' : ''}`}
              onMouseEnter={() => handleDotMouseEnter(title)}
            ></span>
          ))}
        </div>
      )}
      <p dangerouslySetInnerHTML={{ __html: highlightKeywords(about.bio) }}></p>
      {contactEmail && (
        <div className="home-contact-email">
          <span className="material-symbols-outlined">mail</span>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </div>
      )}
    </section>
  );
};

export default Home;
