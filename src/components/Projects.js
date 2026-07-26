import React, { useEffect, useRef, useState } from 'react';
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

  if (links.length === 0) {
    return null;
  }

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

const Projects = ({ projects, portfolioType = 'gaming' }) => {
  const sliderRef = useRef(null);
  const dragRef = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });
  const autoRef = useRef({ dir: 1, paused: false, pos: 0 });
  const [hoverPreview, setHoverPreview] = useState(null); // { project, rect } | null

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

  const handlePointerDown = (event) => {
    const el = sliderRef.current;
    if (!el) return;
    dragRef.current = { down: true, startX: event.clientX, scrollLeft: el.scrollLeft, moved: false };
    try { el.setPointerCapture(event.pointerId); } catch (e) { /* capture unsupported; drag still works */ }
    el.classList.add('dragging');
  };

  const handlePointerMove = (event) => {
    const state = dragRef.current;
    if (!state.down) return;
    const el = sliderRef.current;
    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 4) {
      state.moved = true;
      autoRef.current.paused = false;
      setHoverPreview(null);
    }
    el.scrollLeft = state.scrollLeft - delta;
  };

  const handlePointerUp = (event) => {
    const el = sliderRef.current;
    if (el) {
      try { el.releasePointerCapture(event.pointerId); } catch (e) { /* nothing to release */ }
      el.classList.remove('dragging');
      autoRef.current.pos = el.scrollLeft;
    }
    dragRef.current.down = false;
  };

  // Swallow the click that ends a drag so a card link doesn't fire mid-drag
  const handleClickCapture = (event) => {
    if (dragRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.moved = false;
    }
  };

  // Gently auto-scroll the "More Projects" strip, bouncing at each end.
  // Pauses on hover/drag, and respects reduced-motion preferences.
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const SPEED = 0.5;
    let raf;
    autoRef.current.pos = el.scrollLeft;
    // Drive scroll from a float accumulator — the browser rounds scrollLeft to
    // an integer, so sub-pixel increments would otherwise never accumulate.
    const step = () => {
      const auto = autoRef.current;
      const max = el.scrollWidth - el.clientWidth;
      if (max > 0 && !auto.paused && !dragRef.current.down) {
        auto.pos += SPEED * auto.dir;
        if (auto.pos >= max) { auto.pos = max; auto.dir = -1; }
        else if (auto.pos <= 0) { auto.pos = 0; auto.dir = 1; }
        el.scrollLeft = auto.pos;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [otherProjects.length]);

  const closeTimerRef = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Hover a card → freeze the auto-scroll at that point and pop a full-detail
  // card anchored to it. A short close delay bridges card → preview so moving
  // the pointer onto the expanded card doesn't dismiss it.
  const openPreview = (project, event) => {
    if (dragRef.current.down) return;
    clearCloseTimer();
    const rect = event.currentTarget.getBoundingClientRect();
    autoRef.current.paused = true;
    setHoverPreview({ project, rect });
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      autoRef.current.paused = false;
      setHoverPreview(null);
    }, 140);
  };

  const closeNow = () => {
    clearCloseTimer();
    autoRef.current.paused = false;
    setHoverPreview(null);
  };

  // If the page scrolls while a preview is open its anchor goes stale — close it.
  useEffect(() => {
    if (!hoverPreview) return undefined;
    const onScroll = () => closeNow();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hoverPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="projects" className="projects-section reveal">
      <h2>Featured Projects</h2>
      <div className="projects-grid">
        {featuredProjects.map((project, index) => (
          <div key={index} className="project-card">
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
        <div className="other-projects">
          <div className="other-projects-head">
            <h3 className="other-projects-heading">More Projects</h3>
            <span className="other-projects-hint">Drag to explore &middot; hover for details</span>
          </div>
          <div
            className="other-projects-slider"
            ref={sliderRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClickCapture={handleClickCapture}
          >
            {otherProjects.map((project, index) => (
              <div
                key={index}
                className="other-project-card"
                onMouseEnter={(event) => openPreview(project, event)}
                onMouseLeave={scheduleClose}
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
        </div>
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
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
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
    </section>
  );
};

export default Projects;
