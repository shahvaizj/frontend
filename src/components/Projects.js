import React, { useState } from 'react';
import './Projects.css';

const Projects = ({ projects }) => {
  const [showOtherProjects, setShowOtherProjects] = useState(false);

  const featuredProjects = projects.slice(0, 6);
  const otherProjects = projects.slice(6);

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
              </div>
            </div>

            <div className="project-visuals-slideshow">
              {project.youtubeVideoId && (
                <div className="project-video slideshow-item">
                  <iframe
                    src={`https://www.youtube.com/embed/${project.youtubeVideoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${project.name} Gameplay Video`}
                  ></iframe>
                </div>
              )}
              {project.screenshots && project.screenshots.map((screenshot, i) => (
                <div key={i} className="project-screenshot-item slideshow-item">
                  <img src={screenshot} alt={`${project.name} screenshot ${i + 1}`} />
                </div>
              ))}
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
