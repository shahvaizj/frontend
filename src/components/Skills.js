import React from 'react';
import './Skills.css';

const SKILL_ICONS = {
  // — Game Development —
  'Unity3D Engine':              { type: 'img',      url: 'https://cdn.simpleicons.org/unity' },
  'Unreal Engine':               { type: 'devicon',  cls: 'devicon-unrealengine-original' },
  'Godot Engine':                { type: 'devicon',  cls: 'devicon-godot-plain colored' },
  'C#':                          { type: 'devicon',  cls: 'devicon-csharp-plain colored' },
  'Unity UI':                    { type: 'material', name: 'dashboard' },
  'UXML':                        { type: 'material', name: 'code_blocks' },
  'Augmented Reality (AR)':      { type: 'material', name: 'view_in_ar' },
  'Virtual Reality (VR)':        { type: 'material', name: 'vrpano' },
  'Photon Networking':           { type: 'material', name: 'hub' },
  'Multiplayer Development':     { type: 'material', name: 'groups' },
  'Game Design Patterns':        { type: 'material', name: 'extension' },
  'Game Optimization':           { type: 'material', name: 'speed' },
  'Google Firebase':             { type: 'devicon',  cls: 'devicon-firebase-plain colored' },
  'PlayFab Services':            { type: 'material', name: 'cloud_sync' },
  'Cinemachine':                 { type: 'material', name: 'videocam' },
  'Unity DOTS/ECS':              { type: 'material', name: 'memory' },
  'Unity Addressables':          { type: 'material', name: 'inventory_2' },
  'NavMesh & AI Pathfinding':    { type: 'material', name: 'route' },
  'Physics Simulation':          { type: 'material', name: 'science' },
  'Procedural Generation':       { type: 'material', name: 'auto_awesome' },
  'Mixed Reality (MR)':          { type: 'material', name: 'merge' },
  'In-App Purchases':            { type: 'material', name: 'shopping_cart' },
  'Unity Analytics':             { type: 'material', name: 'analytics' },
  'Level Design':                { type: 'material', name: 'map' },
  'Game Monetization':           { type: 'material', name: 'monetization_on' },
  'Localization & Accessibility':{ type: 'material', name: 'translate' },

  // — Team Management —
  'Jira':                        { type: 'devicon',  cls: 'devicon-jira-plain colored' },
  'ClickUp':                     { type: 'material', name: 'task_alt' },
  'Sprint Planning':             { type: 'material', name: 'directions_run' },
  'Agile/Scrum':                 { type: 'material', name: 'loop' },
  'Team Leadership':             { type: 'material', name: 'manage_accounts' },
  'Trello':                      { type: 'devicon',  cls: 'devicon-trello-plain colored' },
  'Kanban Methodology':          { type: 'material', name: 'view_kanban' },
  'Roadmap Planning':            { type: 'material', name: 'timeline' },
  'Code Review Processes':       { type: 'material', name: 'rate_review' },
  'Risk Management':             { type: 'material', name: 'shield' },
  'Resource Allocation':         { type: 'material', name: 'diversity_3' },
  'Remote Team Management':      { type: 'material', name: 'home_work' },
  'Performance Reviews':         { type: 'material', name: 'star_rate' },
  'Technical Documentation':     { type: 'material', name: 'description' },
  'GitFlow Workflow':            { type: 'devicon',  cls: 'devicon-git-plain colored' },
  'Product Backlog Grooming':    { type: 'material', name: 'checklist' },

  // — Other / Web —
  'HTML5':                       { type: 'devicon',  cls: 'devicon-html5-plain colored' },
  'CSS3':                        { type: 'devicon',  cls: 'devicon-css3-plain colored' },
  'JavaScript (ES6+)':           { type: 'devicon',  cls: 'devicon-javascript-plain colored' },
  'TypeScript':                  { type: 'devicon',  cls: 'devicon-typescript-plain colored' },
  'React.js':                    { type: 'devicon',  cls: 'devicon-react-original colored' },
  'Next.js':                     { type: 'devicon',  cls: 'devicon-nextjs-plain' },
  'Vue.js':                      { type: 'devicon',  cls: 'devicon-vuejs-plain colored' },
  'Node.js':                     { type: 'devicon',  cls: 'devicon-nodejs-plain colored' },
  'Express.js':                  { type: 'devicon',  cls: 'devicon-express-original' },
  'RESTful APIs':                { type: 'material', name: 'api' },
  'GraphQL':                     { type: 'devicon',  cls: 'devicon-graphql-plain colored' },
  'MongoDB':                     { type: 'devicon',  cls: 'devicon-mongodb-plain colored' },
  'MySQL':                       { type: 'devicon',  cls: 'devicon-mysql-plain colored' },
  'n-8-n':                       { type: 'material', name: 'account_tree' },
  'Firebase Firestore':          { type: 'devicon',  cls: 'devicon-firebase-plain colored' },
  'Git':                         { type: 'devicon',  cls: 'devicon-git-plain colored' },
  'GitLab CI':                   { type: 'devicon',  cls: 'devicon-gitlab-plain colored' },
  'Google Cloud Platform':       { type: 'devicon',  cls: 'devicon-googlecloud-plain colored' },
  'Azure':                       { type: 'devicon',  cls: 'devicon-azure-plain colored' },
  'Docker':                      { type: 'devicon',  cls: 'devicon-docker-plain colored' },
  'AI/ML Integration':           { type: 'material', name: 'psychology' },
  'OpenAI API':                  { type: 'material', name: 'smart_toy' },
  'Prompt Engineering':          { type: 'material', name: 'chat_bubble' },
  'Automation Tools':            { type: 'material', name: 'precision_manufacturing' },
  'Python':                      { type: 'devicon',  cls: 'devicon-python-plain colored' },
};

const CATEGORY_META = {
  'Game Development': { icon: 'sports_esports', color: 'var(--accent-color)' },
  'Team Management':  { icon: 'groups',          color: 'var(--accent-2)' },
  'Other':            { icon: 'code',             color: '#a78bfa' },
};

// Distribute items round-robin across N rows so rows are evenly mixed
const splitIntoRows = (items, numRows = 3) => {
  const rows = Array.from({ length: numRows }, () => []);
  items.forEach((item, i) => rows[i % numRows].push(item));
  return rows;
};

const SkillCard = ({ name }) => {
  const icon = SKILL_ICONS[name] || { type: 'material', name: 'star' };
  return (
    <div className="skill-card">
      <div className="skill-icon">
        {icon.type === 'devicon'
          ? <i className={icon.cls} />
          : icon.type === 'img'
          ? <img src={icon.url} alt={name} className="skill-icon-img" />
          : <span className="material-symbols-outlined">{icon.name}</span>
        }
      </div>
      <span className="skill-name">{name}</span>
    </div>
  );
};

const DURATIONS = [25, 32, 20];

const MarqueeRow = ({ items, direction, duration }) => (
  <div className="skill-marquee-row">
    <div
      className={`skill-marquee-track marquee-${direction}`}
      style={{ animationDuration: `${duration}s` }}
    >
      {/* Duplicate the list so the loop is seamless */}
      {[...items, ...items].map((name, i) => (
        <SkillCard key={i} name={name} />
      ))}
    </div>
  </div>
);

const Skills = ({ skills }) => (
  <section id="skills" className="skills-section reveal">
    <h2>Skills</h2>
    <div className="skills-categories">
      {skills.map((categoryData, i) => {
        const meta = CATEGORY_META[categoryData.category] || { icon: 'star', color: 'var(--accent-color)' };
        const rows = splitIntoRows(categoryData.items);
        return (
          <div key={i} className={`skills-category reveal reveal-delay-${i + 1}`}>
            <div className="skills-category-header">
              <span
                className="material-symbols-outlined category-icon"
                style={{ color: meta.color }}
              >
                {meta.icon}
              </span>
              <h3 style={{ color: meta.color }}>{categoryData.category}</h3>
            </div>
            <div className="skills-marquee-wrap">
              <MarqueeRow
                items={categoryData.items}
                direction="left"
                duration={DURATIONS[i] || 25}
              />
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default Skills;
