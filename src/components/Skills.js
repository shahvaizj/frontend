import React, { useEffect, useRef, useCallback } from 'react';
import './Skills.css';

const SKILL_ICONS = {
  // ── Engineering Leadership ──────────────────────────────────────────────
  'Cross-Functional Team Management': { type: 'material', name: 'groups' },
  'Hiring & Performance Reviews':     { type: 'material', name: 'manage_accounts' },
  'Vendor & External Team Governance':{ type: 'material', name: 'handshake' },
  'Budget Management ($1M–$5M)':      { type: 'material', name: 'account_balance' },
  'Technical Roadmap Planning':       { type: 'material', name: 'timeline' },
  'Agile / Scrum':                    { type: 'material', name: 'loop' },
  'Sprint Planning':                  { type: 'material', name: 'directions_run' },
  'Code Review Standards':            { type: 'material', name: 'rate_review' },
  'GitFlow Workflow':                 { type: 'devicon',  cls: 'devicon-git-plain colored' },
  'Production Incident Command':      { type: 'material', name: 'crisis_alert' },
  'Enterprise Change Control':        { type: 'material', name: 'change_circle' },
  'Stakeholder Communication':        { type: 'material', name: 'forum' },
  'Technical Interviews':             { type: 'material', name: 'quiz' },
  'Risk Management':                  { type: 'material', name: 'shield' },
  'On-Call Rotation Leadership':      { type: 'material', name: 'notifications_active' },

  // ── Game Development & Technology ───────────────────────────────────────
  'Unity3D (12+ years)':              { type: 'img',      url: 'https://cdn.simpleicons.org/unity' },
  'C# Architecture':                  { type: 'devicon',  cls: 'devicon-csharp-plain colored' },
  'Live-Ops Systems Design':          { type: 'material', name: 'live_tv' },
  'Gameplay State Machines':          { type: 'material', name: 'account_tree' },
  'Unity Addressables':               { type: 'material', name: 'inventory_2' },
  'Real-Money Gaming Platforms':      { type: 'material', name: 'monetization_on' },
  'Casino-Grade Compliance':          { type: 'material', name: 'verified_user' },
  'Internal Developer Tooling':       { type: 'material', name: 'build' },
  'Mobile Performance Optimization':  { type: 'material', name: 'speed' },
  'Cocos2d-x':                        { type: 'material', name: 'extension' },
  'WPF':                              { type: 'devicon',  cls: 'devicon-dot-net-plain colored' },
  'iOS & Android':                    { type: 'material', name: 'phone_iphone' },
  'PlayStation & PC':                 { type: 'material', name: 'sports_esports' },
  'Oculus VR':                        { type: 'material', name: 'vrpano' },
  'HoloLens AR':                      { type: 'material', name: 'view_in_ar' },
  'C++':                              { type: 'devicon',  cls: 'devicon-cplusplus-plain colored' },
  'C#':                               { type: 'devicon',  cls: 'devicon-csharp-plain colored' },
  'Java':                             { type: 'devicon',  cls: 'devicon-java-plain colored' },
  'JavaScript':                       { type: 'devicon',  cls: 'devicon-javascript-plain colored' },
  'React':                            { type: 'devicon',  cls: 'devicon-react-original colored' },
  'PHP':                              { type: 'devicon',  cls: 'devicon-php-plain colored' },

  // ── Cloud & DevOps ──────────────────────────────────────────────────────
  'AWS Cloud Practitioner':           { type: 'devicon',  cls: 'devicon-amazonwebservices-plain-wordmark colored' },
  'AWS Solutions Architect':          { type: 'devicon',  cls: 'devicon-amazonwebservices-plain colored' },
  'CI/CD Pipeline Design':            { type: 'material', name: 'sync_alt' },
  'Git Workflow Architecture':        { type: 'devicon',  cls: 'devicon-git-plain colored' },
  'Automated Build Pipelines':        { type: 'material', name: 'precision_manufacturing' },
  'Pipeline Optimization':            { type: 'material', name: 'tune' },
  'Infrastructure Security':          { type: 'material', name: 'security' },
  'Log-Drive Encryption':             { type: 'material', name: 'lock' },
  'Deployment Cadence Management':    { type: 'material', name: 'rocket_launch' },
  'Build Time Optimization':          { type: 'material', name: 'bolt' },
  'Branch Strategy & PR Standards':   { type: 'material', name: 'call_split' },
  'Merge Conflict Elimination':       { type: 'material', name: 'merge' },
};

const CATEGORY_META = {
  'Engineering Leadership':        { icon: 'corporate_fare', color: 'var(--accent-color)' },
  'Game Development & Technology': { icon: 'sports_esports', color: 'var(--accent-2)' },
  'Cloud & DevOps':                { icon: 'cloud',          color: 'var(--accent-3)' },
};

const SPEEDS = [0.35, 0.28, 0.4];

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

const MarqueeRow = ({ items, speed = 0.35 }) => {
  const rowRef    = useRef(null);
  const trackRef  = useRef(null);
  const posRef    = useRef(0);
  const rafRef    = useRef(null);
  const halfRef   = useRef(0);
  const dragging  = useRef(false);
  const dragX     = useRef(0);
  const dragPos   = useRef(0);

  const normalize = useCallback((p) => {
    const half = halfRef.current;
    if (!half) return p;
    p = p % half;
    if (p > 0) p -= half;
    return p;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = () => {
      if (!halfRef.current) halfRef.current = track.scrollWidth / 2;
      if (!dragging.current) {
        posRef.current = normalize(posRef.current - speed);
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, normalize]);

  const startDrag = useCallback((clientX) => {
    dragging.current = true;
    dragX.current    = clientX;
    dragPos.current  = posRef.current;
    if (rowRef.current) rowRef.current.classList.add('dragging');
  }, []);

  const moveDrag = useCallback((clientX) => {
    if (!dragging.current) return;
    const delta  = clientX - dragX.current;
    const newPos = normalize(dragPos.current + delta);
    posRef.current = newPos;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${newPos}px)`;
  }, [normalize]);

  const endDrag = useCallback(() => {
    dragging.current = false;
    if (rowRef.current) rowRef.current.classList.remove('dragging');
  }, []);

  return (
    <div
      ref={rowRef}
      className="skill-marquee-row"
      onMouseDown={(e) => { startDrag(e.clientX); e.preventDefault(); }}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
    >
      <div ref={trackRef} className="skill-marquee-track">
        {[...items, ...items].map((name, i) => (
          <SkillCard key={i} name={name} />
        ))}
      </div>
    </div>
  );
};

const Skills = ({ skills }) => (
  <section id="skills" className="skills-section reveal">
    <h2 className="section-heading">Skills</h2>
    <div className="skills-categories">
      {skills.map((categoryData, i) => {
        const meta = CATEGORY_META[categoryData.category] || { icon: 'star', color: 'var(--accent-color)' };
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
            <MarqueeRow items={categoryData.items} speed={SPEEDS[i] ?? 0.35} />
          </div>
        );
      })}
    </div>
  </section>
);

export default Skills;
