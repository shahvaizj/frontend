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
      <p>{about.bio}</p>
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
