import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ParticleBackground from './ParticleBackground';
import './Home.css';

const BUBBLE_MESSAGE = "Hey, Player 1! Welcome to my world. Feel free to explore!";

const Home = ({ about, funTitles, contactEmail, theme }) => {
  const aboutData = about || {};
  const titleSeed = aboutData.title || 'Game Developer';
  const allTitles = useMemo(() => [titleSeed, ...(funTitles || [])], [titleSeed, funTitles]);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const isHovering = useRef(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showBubble, setShowBubble] = useState(false);

  const sectionRef = useRef(null);
  const visualsRef = useRef(null);
  const imgRef = useRef(null);
  const pinnedRef = useRef(false);
  const scrollProgressRef = useRef(0);
  const isActiveRef = useRef(false);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 520);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const currentTitle = allTitles[currentIndex] || '';
    let timeout;

    if (!isDeleting && displayText === currentTitle) {
      timeout = setTimeout(() => {
        if (!isHovering.current) setIsDeleting(true);
      }, 2200);
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

  const handleDotMouseEnter = useCallback((title, index) => {
    isHovering.current = true;
    setIsDeleting(false);
    setCurrentIndex(index);
    setDisplayText(title);
  }, []);

  const handleDotMouseLeave = useCallback(() => {
    isHovering.current = false;
  }, []);

  const applyFilter = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const p = scrollProgressRef.current;
    const active = isActiveRef.current;
    const split = (p * 8).toFixed(1);
    const splitA = (p * 0.85).toFixed(2);
    const glowA = (0.5 + p * 0.4).toFixed(2);
    const filters = [];
    if (active) {
      filters.push('sepia(1)', 'saturate(8)', 'hue-rotate(190deg)', 'brightness(1.2)');
    }
    filters.push(
      `drop-shadow(${split}px 0 0 rgba(0,80,255,${splitA}))`,
      `drop-shadow(-${split}px 0 0 rgba(0,220,255,${splitA}))`,
      `drop-shadow(0 0 ${active ? 36 : 18}px rgba(${active ? '0,150,255' : '0,245,255'},${active ? 0.9 : glowA}))`,
      'drop-shadow(0 28px 44px rgba(0,0,10,0.6))',
    );
    img.style.filter = filters.join(' ');
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const visuals = visualsRef.current;
    if (!section || !visuals) return;

    const onScroll = () => {
      const { top, height } = section.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -top / height));
      scrollProgressRef.current = p;
      visuals.style.transform = `translateY(${-(p * 90).toFixed(1)}px) rotate(${(p * 1.8).toFixed(2)}deg)`;
      applyFilter();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [applyFilter]);

  const handleCharEnter = useCallback(() => {
    isActiveRef.current = true;
    setShowBubble(true);
    applyFilter();
  }, [applyFilter]);

  const handleCharLeave = useCallback(() => {
    if (!pinnedRef.current) {
      isActiveRef.current = false;
      setShowBubble(false);
      applyFilter();
    }
  }, [applyFilter]);

  const handleCharClick = useCallback(() => {
    pinnedRef.current = !pinnedRef.current;
    isActiveRef.current = pinnedRef.current;
    setShowBubble(pinnedRef.current);
    applyFilter();
  }, [applyFilter]);

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

  return (
    <section id="home" className="home-section" ref={sectionRef}>
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

        <div className="hero-visuals reveal reveal-delay-2" ref={visualsRef}>
          {showBubble && (
            <div className="character-bubble">
              <span>{BUBBLE_MESSAGE}</span>
            </div>
          )}

          <div className="floating-engine-icons">
            <div className="engine-icon-badge unity-badge">
              <img src="https://cdn.simpleicons.org/unity" alt="Unity3D" />
            </div>
          </div>

          <img
            ref={imgRef}
            src={`${process.env.PUBLIC_URL}/images/Character_z.png`}
            alt="Character"
            className="hero-character-img"
            loading="lazy"
            onMouseEnter={handleCharEnter}
            onMouseLeave={handleCharLeave}
            onClick={handleCharClick}
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
