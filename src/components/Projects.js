import React from 'react';
import './Projects.css';
import ProjectVisualsCarousel from './ProjectVisualsCarousel';

const COMPANY_KEYWORDS = ['Zynga', 'SciPlay', 'Eclipse Gaming', 'React Games', 'Invocode'];

const highlightKeywords = (text) => {
  if (!text) return null;

  const keywords = [
    'Unity3D', 'Unity', 'C#', 'AWS', 'CI/CD', 'Git', 'GitFlow',
    'live-ops', 'Live-Ops', 'live ops', 'Live Ops',
    '$350K', '$1M', '$1M+', '$5M', 'daily revenue',
    'SciPlay', 'Zynga', 'Eclipse Gaming', 'React Games', 'Invocode',
    'iOS', 'Android', 'PlayStation', 'PC', 'Oculus', 'HoloLens',
    'VR', 'AR', 'real-money', 'casino', 'compliance',
    'state machine', 'State Machine', 'Addressables',
    'CI/CD pipeline', 'pipeline', 'vendor', 'on-call',
    'leaderboards', 'bingo', 'Jackpot Party', 'Game of Thrones',
    'Daily Challenges', 'Collections', 'Loot Train', 'Bannermen', 'Choose A Door',
    'Flash', 'WPF', 'Java', 'encryption', 'regulatory',
    'Cocos2d-x', 'hypercasual', 'mobile',
  ];

  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
  let result = text;

  for (const kw of sortedKeywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    result = result.replace(regex, '___H___$1___E___');
  }

  const parts = result.split(/(___H___|___E___)/);
  const elements = [];
  let highlight = false;
  let key = 0;

  for (const part of parts) {
    if (part === '___H___') { highlight = true; }
    else if (part === '___E___') { highlight = false; }
    else if (part) {
      if (highlight) {
        const isCompany = COMPANY_KEYWORDS.some(c => c.toLowerCase() === part.toLowerCase());
        elements.push(
          <span key={key++} className={isCompany ? 'highlighted-company' : 'highlighted-keyword'}>{part}</span>
        );
      } else {
        elements.push(part);
      }
    }
  }

  return <>{elements}</>;
};

const ProjectRightPanel = ({ project }) => {
  const hasMedia =
    (project.youtubeVideoIds && project.youtubeVideoIds.length > 0) ||
    (project.youtubeVideoId) ||
    (project.screenshots && project.screenshots.length > 0);

  if (hasMedia) {
    return (
      <div className="project-visuals-wrapper">
        <ProjectVisualsCarousel
          youtubeVideoIds={project.youtubeVideoIds || (project.youtubeVideoId ? [project.youtubeVideoId] : [])}
          screenshots={project.screenshots}
          projectName={project.name}
        />
      </div>
    );
  }

  if (project.panelIcons && project.panelIcons.length > 0) {
    return (
      <div className="project-icon-panel">
        <div className="project-info-glow" />
        <div className="project-icon-grid">
          {project.panelIcons.map((icon, i) => (
            <div key={i} className="panel-icon-card">
              <div className="panel-icon-visual">
                {icon.type === 'devicon' ? (
                  <i className={icon.class} />
                ) : (
                  <span className="material-symbols-outlined">{icon.name}</span>
                )}
              </div>
              <span className="panel-icon-label">{icon.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const [company, ...rest] = (project.tagline || '').split('·').map(s => s.trim());

  return (
    <div className="project-info-panel">
      <div className="project-info-glow" />
      <p className="project-info-company">{company}</p>
      {rest.length > 0 && (
        <p className="project-info-meta">{rest.join(' · ')}</p>
      )}
      <p className="project-info-desc">{project.description}</p>
    </div>
  );
};

const Projects = ({ projects, portfolioType = 'gaming' }) => {
  const filteredProjects = projects.filter(p =>
    p.category && p.category.includes(portfolioType)
  );

  const orderKey = portfolioType === 'gaming' ? 'gamingOrder' : 'educationalOrder';
  const sortedProjects = [...filteredProjects].sort((a, b) =>
    (a[orderKey] || 999) - (b[orderKey] || 999)
  );

  const featuredProjects = sortedProjects.slice(0, 6);

  return (
    <section id="projects" className="projects-section reveal">
      <h2 className="section-heading">Featured Projects</h2>
      <div className="projects-list">
        {featuredProjects.map((project, index) => (
          <div key={index} className={`project-card reveal${index % 2 === 1 ? ' project-card--reversed' : ''}${project.stats ? ' project-card--stat-showcase' : ''}`}>
            <div className="project-left">
              <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                <p className="project-genre">{project.genre}</p>
              </div>

              {project.stats ? (
                <>
                  {project.tagline && (
                    <p className="project-company-name">
                      {project.tagline.split('·').map(s => s.trim())[1]}
                    </p>
                  )}
                  <div className="project-stats">
                    {project.stats.map((stat, i) => (
                      <div key={i} className="project-stat">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="project-role">
                  <p>{highlightKeywords(project.myRole)}</p>
                </div>
              )}

              <div className="project-tech-tags">
                {project.techTags?.map((tag, i) => (
                  <span key={i} className="tech-tag">{tag}</span>
                ))}
              </div>

              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="more-info-button">
                  View Project
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_outward</span>
                </a>
              )}
            </div>

            <ProjectRightPanel project={project} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
