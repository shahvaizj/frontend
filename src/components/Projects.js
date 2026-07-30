import React, { useEffect, useRef, useState } from 'react';
import './Projects.css';
import ProjectVisualsCarousel from './ProjectVisualsCarousel';

const highlightKeywords = (text) => {
  if (!text) return null;
  
  const keywords = [
    'JavaScript', 'TypeScript', 'React', 'Node.js',
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

/* Material Symbol shown inside each tech chip. Anything unmapped falls back to a
   neutral glyph, so new tags never break the row. */
const TAG_ICONS = {
  'Brain EEG Sensor': 'neurology',
  'Machine Learning': 'network_intelligence',
  'Pose Estimation': 'accessibility_new',
  'Firebase': 'local_fire_department',
  'Cloud Architecture': 'cloud',
  'RESTful APIs': 'api',
  'Photon PUN2': 'hub',
  'Real-time Multiplayer': 'groups',
  'Multiplayer': 'groups',
  'Network Synchronization': 'sync_alt',
  'Game Economy': 'monetization_on',
  'Game Economy Design': 'monetization_on',
  'IAP': 'shopping_cart',
  'Ad Integration': 'ads_click',
  'UI/UX Design': 'dashboard',
  'UI/UX': 'dashboard',
  'Scriptable Objects': 'inventory_2',
  'Data Persistence': 'save',
  'SQLite': 'database',
  'Mobile Optimization': 'speed',
  'Memory Management': 'memory',
  'Performance Tuning': 'tune',
  'FPS Mechanics': 'target',
  'FPS': 'target',
  'Ballistics System': 'track_changes',
  'Custom Shaders': 'gradient',
  'Weapon System': 'swords',
  'Weapon Systems': 'swords',
  'AI Behavior Trees': 'account_tree',
  'AI': 'psychology',
  'Pathfinding': 'route',
  'VFX': 'auto_awesome',
  'Post-processing': 'filter_vintage',
  'Lighting': 'lightbulb',
  'Vehicle Physics': 'directions_car',
  'Drift Mechanics': 'moving',
  'Car Customization': 'build',
  'Tuning System': 'settings',
  'Leaderboards': 'leaderboard',
  'Gore System': 'bloodtype',
  'Wave Management': 'waves',

  // — Tech Stack chips (tools/plugins) —
  'Unity URP': 'texture',
  'URP': 'texture',
  'HDRP (or URP if mobile)': 'gradient',
  "Realistic Car Controller (RCC)": 'directions_car',
  "Eddy's Vehicle Physics": 'directions_car',
  'DOTween': 'animation',
  'AdMob': 'ads_click',
  'AppLovin MAX': 'campaign',
  'Game Analytics': 'analytics',
  'GameAnalytics': 'analytics',
  'Cinemachine': 'videocam',
  'Addressables': 'inventory_2',
  'Unity Addressables': 'inventory_2',
  'Firebase Analytics': 'local_fire_department',
  'Firebase Crashlytics': 'bug_report',
  'Firebase Remote Config': 'tune',
  'Remote Config': 'tune',
  'Odin Inspector': 'construction',
  'Unity Localization': 'translate',
  'Photon Fusion': 'hub',
  'PlayFab': 'cloud_sync',
  'Facebook SDK': 'share',
  'Unity Gaming Services': 'cloud',
  'Cloud Code': 'code',
  'Cloud Save': 'cloud_done',
  'Unity Input System': 'sports_esports',
  'Behavior Designer': 'account_tree',
  'Unity AI Navigation': 'route',
  'AI Navigation': 'route',
  'Opsive Ultimate Character Controller': 'directions_walk',
  'FMOD': 'graphic_eq',
};

const iconForTag = (tag) => TAG_ICONS[tag] || 'chevron_right';

/* The card header, meta tiles and media caption are all derived from fields the
   project data already carries — no extra authoring needed per project. */
const buildCardData = (project) => {
  const taglineParts = (project.tagline || '').split('|').map((s) => s.trim()).filter(Boolean);

  /* Role, platform and downloads are all shown as large stacked tiles.
     Genre is deliberately absent here — it's already the header subtitle.
     Ownership only exists on solo-shipped titles (own-IP releases where the
     work spans design through marketing, not just engineering), so it's an
     optional fourth tile rather than something every project carries. */
  const metaPrimary = [
    project.role && { label: 'My Role', value: project.role },
    project.platform && { label: 'Platform', value: project.platform },
    project.downloads && { label: 'Downloads', value: project.downloads },
    project.ownership && { label: 'Ownership', value: project.ownership, wide: true },
  ].filter(Boolean);

  return { metaPrimary, focus: taglineParts[0] || null };
};

/* Types the bullets out one after another once the card scrolls into view, then
   swaps in the keyword-highlighted version. A hidden copy of the finished list
   holds the box height steady so the card never reflows mid-animation. */
const TypewriterList = ({ items, speed = 8 }) => {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const text = items.join('');

  useEffect(() => {
    if (started) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length);
      setStarted(true);
      return undefined;
    }

    /* Plain rect checks on scroll rather than IntersectionObserver: the same
       approach App.js already uses, and it cannot leave the text stuck empty
       if the observer never fires. */
    const check = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        setStarted(true);
      }
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [text, started]);

  useEffect(() => {
    if (!started || count >= text.length) return undefined;
    const timer = setTimeout(() => setCount((c) => Math.min(c + 2, text.length)), speed);
    return () => clearTimeout(timer);
  }, [started, count, text, speed]);

  const done = count >= text.length;

  /* Walk the bullets, handing each one its share of the typed characters. */
  let budget = count;
  const revealed = items.map((item) => {
    const shown = Math.max(0, Math.min(item.length, budget));
    budget -= item.length;
    return { full: item, shown };
  });
  const typingIndex = revealed.findIndex((r) => r.shown > 0 && r.shown < r.full.length);

  return (
    <div className="project-role-text typewriter" ref={ref}>
      <ul className="contribution-list typewriter-sizer" aria-hidden="true">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <ul className="contribution-list typewriter-live">
        {revealed.map((entry, i) => (
          entry.shown > 0 && (
            <li key={i}>
              {done ? highlightKeywords(entry.full) : entry.full.slice(0, entry.shown)}
              {i === typingIndex && <span className="typewriter-caret">|</span>}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

const Projects = ({ projects, portfolioType = 'gaming' }) => {
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

  return (
    <section id="projects" className="projects-section reveal">
      <h2>Featured Projects</h2>
      <div className="projects-grid">
        {featuredProjects.map((project, index) => {
          const card = buildCardData(project);

          return (
            <article key={index} className={`project-card reveal reveal-delay-${(index % 5) + 1}`}>
              <header className="project-card-head">
                <h3 className="project-name">{project.name}</h3>
                <p className="project-genre">{project.genre}</p>
              </header>

              <div className="project-card-body">
                {card.metaPrimary.length > 0 && (
                  <div className="project-meta-grid">
                    {card.metaPrimary.map((item, i) => (
                      <div key={i} className={`project-meta project-meta--lg${item.wide ? ' project-meta--wide' : ''}`} style={{ '--i': i }}>
                        <span className="project-meta-label">{item.label}</span>
                        <span className="project-meta-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="project-media">
                  <div className="project-visuals-wrapper">
                    <ProjectVisualsCarousel
                      youtubeVideoIds={project.youtubeVideoIds || (project.youtubeVideoId ? [project.youtubeVideoId] : [])}
                      screenshots={project.screenshots}
                      projectName={project.name}
                    />
                  </div>
                </div>

                <div className="project-role-panel">
                  <h4 className="project-role-title">
                    <span className="material-symbols-outlined">badge</span>
                    Key Contribution
                  </h4>
                  <TypewriterList items={project.contributions || [project.myRole]} />

                  {project.techStack && project.techStack.length > 0 && (
                    <div className="project-role-tech">
                      <h5 className="project-role-tech-heading">Tech Stack</h5>
                      <div className="project-tech-tags">
                        {project.techStack.map((tag, i) => (
                          <span key={i} className="tech-tag" style={{ '--i': i }}>
                            <span className="material-symbols-outlined">{iconForTag(tag)}</span>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="more-info-button">
                      View Project
                      <span className="material-symbols-outlined">arrow_outward</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
