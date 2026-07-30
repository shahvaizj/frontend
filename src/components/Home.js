import React from 'react';
import ParticleBackground from './ParticleBackground';
import './Home.css';

const DEFAULT_SPECIALISATIONS = [
  [
    { label: 'Gameplay', type: 'material', icon: 'sports_esports' },
    { label: 'Multiplayer', type: 'material', icon: 'groups' },
    { label: 'Mobile', type: 'material', icon: 'smartphone' },
    { label: 'VR/AR', type: 'material', icon: 'vrpano' },
  ],
  [
    { label: 'Unity', type: 'devicon', class: 'devicon-unity-plain', emphasis: true, sectionStart: true },
    { label: 'Unreal', type: 'devicon', class: 'devicon-unrealengine-original', emphasis: true },
  ],
  [
    { label: 'C#', type: 'devicon', class: 'devicon-csharp-plain', sectionStart: true },
    { label: 'C++', type: 'devicon', class: 'devicon-cplusplus-plain' },
    { label: 'Python', type: 'devicon', class: 'devicon-python-plain' },
    { label: 'TypeScript', type: 'devicon', class: 'devicon-typescript-plain' },
  ],
];

const Home = ({ about, contactEmail }) => {
  const aboutData = about || {};
  const stats = aboutData.stats || [];
  const specialisations = aboutData.specialisations || DEFAULT_SPECIALISATIONS;

  /* Hero intro choreography: the name and the emphasised engine icons (Unity
     /Unreal) pop first, then every other spec icon cascades in one by one —
     hence a running counter across rows rather than a per-row index, so the
     cascade reads as a single continuous wave regardless of how the icons
     are grouped into rows. CTAs and stats continue the same cascade after. */
  let iconCascadeIndex = 0;

  return (
    <section id="home" className="home-section">
      <ParticleBackground />
      <div className="home-content">
        <div className="home-copy reveal revealed">
          <p className="home-kicker">Game Developer Portfolio</p>
          <h1 className="home-name">
            <span className="home-name-prefix">{aboutData.namePrefix || 'Muhammad'}</span>
            <span className="home-name-main">{aboutData.name || 'Shahvaiz Jahangeer'}</span>
          </h1>

          {specialisations.length > 0 && (
            <div className="home-specialisations">
              {specialisations.map((row, rowIndex) => (
                <ul key={rowIndex} className="home-spec-row">
                  {row.map((item, index) => {
                    const cascadeIndex = item.emphasis ? null : iconCascadeIndex++;
                    return (
                      <li
                        key={index}
                        className={`home-spec-item${item.emphasis ? ' home-spec-item--emphasis' : ''}${item.sectionStart ? ' home-spec-item--section-start' : ''}`}
                        style={cascadeIndex !== null ? { '--i': cascadeIndex } : undefined}
                      >
                        <span className="home-spec-icon">
                          {item.type === 'devicon'
                            ? <i className={item.class} />
                            : <span className="material-symbols-outlined">{item.icon}</span>
                          }
                        </span>
                        <span className="home-spec-label">{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          )}

          <div className="home-cta-row">
            <a href="#projects" className="home-primary-cta" style={{ '--i': 0 }}>See Featured Work</a>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="home-secondary-cta" style={{ '--i': 1 }}>
                <span className="material-symbols-outlined">mail</span>
                {contactEmail}
              </a>
            )}
          </div>

          {stats.length > 0 && (
            <dl className="home-stats" style={{ '--stat-count': stats.length }}>
              {stats.map((stat, index) => (
                <div key={index} className="home-stat" style={{ '--i': index }}>
                  <dt className="home-stat-value">{stat.value}</dt>
                  <dd className="home-stat-label">{stat.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
