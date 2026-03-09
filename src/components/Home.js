import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ParticleBackground from './ParticleBackground';
import './Home.css';

const HeroVisualCard = ({ src, alt, className }) => (
  <div className={`hero-visual-card ${className}`}>
    <img src={src} alt={alt} loading="lazy" />
  </div>
);

const Home = ({ about, funTitles, contactEmail, theme }) => {
  const aboutData = about || {};
  const titleSeed = aboutData.title || 'Game Developer';
  const allTitles = useMemo(() => [titleSeed, ...(funTitles || [])], [titleSeed, funTitles]);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const isHovering = useRef(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 520);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const currentTitle = allTitles[currentIndex] || '';
    let timeout;

    if (!isDeleting && displayText === currentTitle) {
      timeout = setTimeout(() => {
        if (!isHovering.current) {
          setIsDeleting(true);
        }
      }, 2200);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % allTitles.length);
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, displayText.length - 1));
      }, 26);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, displayText.length + 1));
      }, 52);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, allTitles]);

  const handleDotMouseEnter = useCallback((title, index) => {
    isHovering.current = true;
    setIsDeleting(false);
    setCurrentIndex(index);
    setDisplayText(title);
  }, []);

  const handleDotMouseLeave = useCallback(() => {
    isHovering.current = false;
  }, []);

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
      <div className="home-gradient-bg"></div>
      <ParticleBackground theme={theme} />
      <div className="home-content">
        <div className="home-copy reveal revealed">
          <p className="home-kicker">Game Developer Portfolio</p>
          <h1>{aboutData.name || 'Muhammad Shahvaiz Jahangeer'}</h1>
          <div className="animated-title-container">
            <h2>
              {displayText}
              <span className={`typewriter-cursor ${cursorVisible ? '' : 'hidden'}`}>|</span>
            </h2>
          </div>

          {funTitles && (
            <div className="fun-titles-dots" aria-label="Role selector">
              {allTitles.map((title, index) => (
                <span
                  key={index}
                  className={`fun-title-dot ${currentIndex === index ? 'active' : ''}`}
                  onMouseEnter={() => handleDotMouseEnter(title, index)}
                  onMouseLeave={handleDotMouseLeave}
                ></span>
              ))}
            </div>
          )}

          <p
            className="home-bio"
            dangerouslySetInnerHTML={{
              __html: highlightKeywords(aboutData.bio || 'Senior Unity Game Developer building polished interactive experiences.'),
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

        <div className="hero-visuals reveal reveal-delay-2">
          <HeroVisualCard src={`${process.env.PUBLIC_URL}/images/Zombie_1.webp`} alt="Zombie project preview" className="card-a" />
          <HeroVisualCard src={`${process.env.PUBLIC_URL}/images/Racing_1.webp`} alt="Racing project preview" className="card-b" />
          <HeroVisualCard src={`${process.env.PUBLIC_URL}/images/Shooter_1.webp`} alt="Shooter project preview" className="card-c" />
        </div>
      </div>
    </section>
  );
};

export default Home;
