import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './Projects.css';
import ProjectVisualsCarousel from './ProjectVisualsCarousel';

const highlightKeywords = (text) => {
  if (!text) return null;

  const keywords = [
    'Unity3D', 'Unity', 'C#', 'JavaScript', 'TypeScript', 'React', 'Node.js',
    'Firebase', 'Photon', 'PUN', 'PUN2', 'PlayFab', 'AWS', 'Docker',
    'AI', 'Machine Learning', 'NLP',
    'Multiplayer', 'Networking', 'Network Synchronization',
    'UI', 'UX', 'Game Design',
    'Optimization', 'Performance', 'Mobile Optimization',
    'Game Economy', 'In-App Purchase', 'IAP', 'Ad Integration',
    'FPS', '3D', '2D', 'VR', 'AR', 'Virtual Reality', 'Augmented Reality',
    'Physics', 'Vehicle Physics', 'Ballistics', 'Pathfinding',
    'Animation', 'Shader', 'Shaders', 'VFX', 'Post-processing',
    'Level Design', 'Level Streaming', 'Procedural Generation',
    'Database', 'SQLite', 'MongoDB', 'Cloud Architecture',
    'RESTful API', 'API', 'WebGL', 'iOS', 'Android',
    'Git', 'Agile', 'Scrum', 'Jira', 'Team Leadership',
    'Leaderboard', 'Achievements', 'Localization', 'i18n',
    'Gamification', 'Progression', 'User Analytics',
    'Authentication', 'Dashboard', 'Child Safety', 'Accessibility',
    'Daily Challenge', 'Daily Challenges', 'Events System', 'Seasonal Events',
    'Match-3', 'Match-2', 'Match-3 Logic', 'Tile Matching', 'Tile-Match',
    '2-Tile Matching', '2 Tile Matching', 'Chain Combos', 'Cascade Effects',
    'Power-ups', 'Boosters', 'Special Tiles', 'Bomb', 'Rocket', 'Color Blaster',
    'Realistic Animal', 'Wildlife AI', 'Animal Movement', 'Tracking AI',
    'Wave Management', 'Wave-Based', 'Zombie Waves', 'Horde Behavior',
    'Weapon Customization', 'Weapon Upgrade', 'Loadout', 'Attachment',
    'Turn-Based Combat', 'Strategy', 'Tactical AI', 'RPG Elements',
    'Gladiator', 'Hero Progression', 'Equipment Crafting', 'Equipment System',
    'Vehicle Customization', 'Car Customization', 'Tuning System',
    'Drift Physics', 'Drift Mechanics', 'Nitrous Boost', 'Drifting',
    'Traffic AI', 'Traffic System', 'Pedestrian AI', 'Open World',
    'Terrain Generation', 'Terrain', 'Mud Physics', 'Off-Road', 'Suspension',
    'Breath Control', 'Wind Simulation', 'Bullet Drop', 'Recoil Pattern',
    'Real-time Chat', 'Matchmaking', 'Game State', 'Cross-platform',
    'In-app Purchases', 'Live Operations', 'Content Updates',
    'Real-time Pose Estimation', 'Motion Control', 'Sensor Tools',
    'Computer Vision', 'TensorFlow Lite', 'Pose Estimation',
    'Brain Training', 'Cognitive', 'Adaptive Learning', 'Speech Recognition',
    'Math Visualization', 'Interactive UI', 'Discrete Structures',
    'Roblox-style', 'Physics-Based Building', 'Water Physics', 'Ship Building',
    'Rhythm Game', 'Music Synchronization', 'Keypoints', 'Dance Moves',
    'Castle Building', '2D Strategy', 'Multiplayer Arena', 'Siege Warfare',
    'City Building', 'Infrastructure', 'Smart City', 'SimCity',
    'Academic Management', 'Student Data', 'Progress Tracking', 'KG to 5th',
    'Pre-school', 'Educational Platform', 'Task Management',
    'Hyper-casual', 'Casual Game', 'Building System', 'House Building',
    'Storm Progression', 'Survival Mechanics', 'House Customization',
    'Infinite Replayability', 'High Score', 'Responsive Touch', 'Gesture',
    'Object Pooling', 'Touch Controls', 'Daily Reward', 'Reward System',
    'Sensor Tools', 'Sensor Technologies', 'Motion-Controlled', 'Motion Control',
    'Player Stats', 'Stat Tracking', 'Health Tracking', 'Fitness',
    'Multidisciplinary Team', 'Brain Scientists', 'Immersive', 'Neuroscience',
    'Real-time Pose', 'Motion Sensors', 'Accurate Stats', 'Game Performance',
    'UK-based', 'UK'
  ];

  const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
  let result = text;

  for (const keyword of sortedKeywords) {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedKeyword})\\b`, 'gi');
    result = result.replace(regex, '___HIGHLIGHT___$1___END___');
  }

  const parts = result.split(/(___HIGHLIGHT___|___END___)/);
  const elements = [];
  let isHighlight = false;
  let keyIndex = 0;

  for (const part of parts) {
    if (part === '___HIGHLIGHT___') {
      isHighlight = true;
    } else if (part === '___END___') {
      isHighlight = false;
    } else if (part) {
      if (isHighlight) {
        elements.push(<span key={keyIndex++} className="highlighted-keyword">{part}</span>);
      } else {
        elements.push(part);
      }
    }
  }

  return <>{elements}</>;
};

const getProjectLinks = (project) => {
  if (project.links && project.links.length > 0) {
    return project.links;
  }
  return project.link ? [{ label: 'More Info', url: project.link }] : [];
};

const ProjectLinks = ({ project }) => {
  const links = getProjectLinks(project);
  if (links.length === 0) return null;

  return (
    <div className="project-links">
      {links.map((link) => (
        <a
          key={`${project.name}-${link.label}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="more-info-button"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

const ProjectCard = ({ project }) => (
  <div className="project-panel-card">
    <div className="project-left-column">
      <div className="project-header">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-genre">{project.genre}</p>
        <div className="project-tech-tags">
          {project.techTags && project.techTags.map((tag, i) => (
            <span key={i} className="tech-tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="project-role">
        <h4>My Role:</h4>
        <p>{highlightKeywords(project.myRole)}</p>
        <ProjectLinks project={project} />
      </div>
    </div>
    <div className="project-visuals-wrapper">
      <ProjectVisualsCarousel
        youtubeVideoIds={project.youtubeVideoIds || (project.youtubeVideoId ? [project.youtubeVideoId] : [])}
        screenshots={project.screenshots}
        projectName={project.name}
      />
    </div>
  </div>
);

const Projects = ({ projects, portfolioType = 'gaming' }) => {
  const [hoverPreview, setHoverPreview] = useState(null);

  const filteredProjects = projects.filter(project =>
    project.category && project.category.includes(portfolioType)
  );

  const orderKey = portfolioType === 'gaming' ? 'gamingOrder' : 'educationalOrder';
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const orderA = a[orderKey] || 999;
    const orderB = b[orderKey] || 999;
    return orderA - orderB;
  });

  const featuredProjects = sortedProjects.slice(0, 6);
  const featuredIds = featuredProjects.map(p => p.name);
  const otherProjects = projects.filter(project => !featuredIds.includes(project.name));

  return (
    <>
      {featuredProjects.length > 0 && (
        <section id="projects" className="projects-section reveal">
          <h2>Featured Projects</h2>
          <ProjectCard project={featuredProjects[0]} />
        </section>
      )}

      {featuredProjects.slice(1).map((project, index) => (
        <section key={project.name} className={`project-panel reveal reveal-delay-${Math.min(index + 1, 5)}`}>
          <ProjectCard project={project} />
        </section>
      ))}

      {otherProjects.length > 0 && (
        <section className="other-projects-panel reveal">
          <h2>More Projects</h2>
          <div className="other-projects-grid">
            {otherProjects.map((project, index) => (
              <div
                key={index}
                className="other-project-card"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoverPreview({ project, rect });
                }}
                onMouseLeave={() => {
                  setHoverPreview(null);
                }}
              >
                <h4>{project.name}</h4>
                <p className="other-project-genre">{project.genre}</p>
                <div className="project-tech-tags">
                  {project.techTags && project.techTags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="tech-tag">{tag}</span>
                  ))}
                </div>
                <p className="other-project-role">{highlightKeywords(project.myRole)}</p>
                <ProjectLinks project={project} />
              </div>
            ))}
          </div>
        </section>
      )}

      {hoverPreview && createPortal(
        <div
          className="other-project-preview"
          style={{
            top: Math.max(12, hoverPreview.rect.top),
            left: Math.min(
              Math.max(hoverPreview.rect.left, 12),
              window.innerWidth - 380 - 12
            ),
          }}
          onMouseEnter={() => {}}
          onMouseLeave={() => setHoverPreview(null)}
        >
          <h4>{hoverPreview.project.name}</h4>
          <p className="other-project-genre">{hoverPreview.project.genre}</p>
          <div className="project-tech-tags">
            {hoverPreview.project.techTags && hoverPreview.project.techTags.map((tag, i) => (
              <span key={i} className="tech-tag">{tag}</span>
            ))}
          </div>
          <p className="other-project-role-full">{highlightKeywords(hoverPreview.project.myRole)}</p>
          <ProjectLinks project={hoverPreview.project} />
        </div>,
        document.body
      )}
    </>
  );
};

export default Projects;
