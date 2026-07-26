import React, { useState, useEffect, useMemo } from 'react';
import './Home.css';

const Home = ({ about, funTitles, contactEmail }) => {
  const aboutData = about || {};
  const titleSeed = aboutData.title || 'Game Developer';
  const allTitles = useMemo(() => [titleSeed, ...(funTitles || [])], [titleSeed, funTitles]);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 520);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const currentTitle = allTitles[currentIndex] || '';
    let timeout;

    if (!isDeleting && displayText === currentTitle) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % allTitles.length);
    } else if (isDeleting) {
      timeout = setTimeout(() => setDisplayText(currentTitle.substring(0, displayText.length - 1)), 26);
    } else {
      timeout = setTimeout(() => setDisplayText(currentTitle.substring(0, displayText.length + 1)), 52);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, allTitles]);

  const highlightKeywords = (text) => {
    const keywords = [
      { text: '9+ years', className: 'highlight-years' },
      { text: 'Senior Game Developer', className: 'highlight-years' },
      { text: 'Unity3D', className: 'highlight-tech' },
      { text: 'Unreal Engine', className: 'highlight-tech' },
      { text: 'Godot', className: 'highlight-tech' },
      { text: 'multiplayer', className: 'highlight-tech' },
      { text: 'real-time', className: 'highlight-tech' },
      { text: 'cross-platform', className: 'highlight-skills' },
      { text: 'high-performance', className: 'highlight-skills' },
    ];

    let result = text;
    keywords.forEach(({ text: keyword, className }) => {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(`(${escapedKeyword})`, 'gi'), `<span class="${className}">$1</span>`);
    });

    return result;
  };

  const name = aboutData.name || 'Muhammad Shahvaiz Jahangeer';

  return (
    <section id="home" className="home-section">
      <div className="home-gradient-bg"></div>
      <div className="home-content">
        <div className="home-copy">
          <p className="home-kicker">Game Developer Portfolio</p>
          <h1 className="hero-name" aria-label={name}>
            {name.split('').map((ch, i) => (
              <span
                key={i}
                className="hero-letter"
                aria-hidden="true"
                style={{ animationDelay: `${0.12 + i * 0.028}s` }}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </h1>
          <div className="animated-title-container">
            <h2>
              {displayText}
              <span className={`typewriter-cursor ${cursorVisible ? '' : 'hidden'}`}>|</span>
            </h2>
          </div>

          <p
            className="home-bio"
            dangerouslySetInnerHTML={{
              __html: highlightKeywords(aboutData.bio || 'Senior Game Developer building polished interactive experiences.'),
            }}
          ></p>

          <div className="home-cta-row">
            <a href="#projects" className="home-primary-cta">See Featured Work</a>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="home-secondary-cta">
                <span className="material-symbols-outlined">mail</span>
                {contactEmail}
              </a>
            )}
          </div>
        </div>

        <div className="hero-visuals">
          <img
            src={`${process.env.PUBLIC_URL}/images/character.png`}
            alt="Character"
            className="hero-character-img"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
