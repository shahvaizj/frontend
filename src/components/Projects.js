import React, { useState } from 'react';
import './Projects.css';
import ProjectVisualsCarousel from './ProjectVisualsCarousel'; // Import the new component

const Projects = ({ projects, portfolioType = 'gaming' }) => {
  const [showOtherProjects, setShowOtherProjects] = useState(false);

  // Filter projects by category based on portfolioType
  const filteredProjects = projects.filter(project => 
    project.category && project.category.includes(portfolioType)
  );

  // Sort by order field
  const orderKey = portfolioType === 'gaming' ? 'gamingOrder' : 'educationalOrder';
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const orderA = a[orderKey] || 999;
    const orderB = b[orderKey] || 999;
    return orderA - orderB;
  });

  const featuredProjects = sortedProjects.slice(0, 6);
  
  // Get ALL projects that are not in featured (both gaming and educational)
  const featuredIds = featuredProjects.map(p => p.name);
  const otherProjects = projects.filter(project => !featuredIds.includes(project.name));

  return (
    <section id="projects" className="projects-section">
      <h2>Featured Projects</h2>
      <div className="projects-grid">
        {featuredProjects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-left-column">
              <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                <p className="project-tagline">{project.tagline}</p>
                <div className="project-tech-tags">
                  {project.techTags && project.techTags.map((tag, i) => (
                    <span key={i} className="tech-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="project-role">
                <h4>My Role:</h4>
                <p>{project.myRole}</p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="more-info-button">
                    More Info
                  </a>
                )}
              </div>
            </div>

            {/* Use the new ProjectVisualsCarousel component */}
            <div className="project-visuals-wrapper"> {/* New wrapper for visuals and thumbnails */}
              <ProjectVisualsCarousel
                youtubeVideoIds={project.youtubeVideoIds || (project.youtubeVideoId ? [project.youtubeVideoId] : [])}
                screenshots={project.screenshots}
                projectName={project.name}
              />
            </div>
          </div>
        ))}
      </div>

      {otherProjects.length > 0 && (
        <div className="view-more-button-container">
          <button className="view-more-button" onClick={() => setShowOtherProjects(true)}>
            View Other Projects
          </button>
        </div>
      )}

      {showOtherProjects && (
        <div className="other-projects-modal">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setShowOtherProjects(false)}>
              &times;
            </button>
            <h3>Other Projects</h3>
            <div className="projects-grid modal-grid">
              {otherProjects.map((project, index) => (
                <div key={index} className="project-card">
                  <h2>{project.name}</h2>
                  <p className="project-genre">Genre: {project.genre}</p>
                  <p>{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="more-info-button">
                      More Info
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
