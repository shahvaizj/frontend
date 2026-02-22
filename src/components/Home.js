import React, { useState } from 'react'; // Import useState
import './Home.css'; // Import Home.css

const Home = ({ about, funTitles, contactEmail }) => {
  const [displayTitle, setDisplayTitle] = useState(about.title); // State to manage the displayed title

  const handleDotMouseEnter = (title) => {
    setDisplayTitle(title);
  };

  const handleDotMouseLeave = () => {
    setDisplayTitle(about.title); // Revert to original title on mouse leave
  };

  const highlightKeywords = (text) => {
    const keywords = [
      { text: '9+ years of experience', className: 'highlight-years' },
      { text: 'Game Developer with 9+ years', className: 'highlight-years' },
      { text: 'Unity3D', className: 'highlight-tech' },
      { text: 'multiplayer', className: 'highlight-tech' },
      { text: 'team leadership', className: 'highlight-skills' },
      { text: 'high-quality games', className: 'highlight-skills' },
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
      </div> {/* Render dynamic title */}
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
