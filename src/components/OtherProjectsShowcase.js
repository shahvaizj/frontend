import React, { useRef, useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './OtherProjectsShowcase.css';

/* macOS-dock-style magnification: icons within MAGNIFY_RADIUS px of the
   cursor scale up, tapering to 1x at the radius edge. Runs on raw DOM refs
   rather than React state — with up to ~22 icons re-measured on every
   mousemove, going through setState/re-render for a purely visual transform
   would be wasteful; direct style writes plus rAF throttling is what the
   existing MarqueeRow-style effects in this codebase already do for the same
   reason. Only transform/z-index are touched, so this never triggers layout,
   just compositing. */
const MAGNIFY_RADIUS = 220;
const MAGNIFY_MAX_SCALE = 1.6;

const scaleForDistance = (dist) => {
  if (dist >= MAGNIFY_RADIUS) return 1;
  const t = 1 - dist / MAGNIFY_RADIUS;
  return 1 + (t * t) * (MAGNIFY_MAX_SCALE - 1);
};

const useMagnifyEffect = (containerRef) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let rafId = null;
    /* Updated on every mousemove regardless of throttling, so the rAF
       callback (which may fire several events later) always reads the
       cursor's actual latest position rather than a stale one captured at
       whichever event happened to trigger the pending frame. */
    let latestX = 0;
    let latestY = 0;

    const applyMagnify = () => {
      rafId = null;
      const icons = container.querySelectorAll('.other-project-tile-icon');
      icons.forEach((icon) => {
        const rect = icon.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(latestX - cx, latestY - cy);
        const scale = scaleForDistance(dist);
        icon.style.transform = scale > 1.001 ? `scale(${scale.toFixed(3)})` : '';
        icon.style.zIndex = scale > 1.02 ? '5' : '';
      });
    };

    const handleMove = (e) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(applyMagnify);
      }
    };

    const handleLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      container.querySelectorAll('.other-project-tile-icon').forEach((icon) => {
        icon.style.transform = '';
        icon.style.zIndex = '';
      });
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
};

/* Per-project artwork from public/images/Small Icons/. Keyed by the exact
   `name` in projects.json and mapped to the exact filename on disk — the two
   don't always match (the folder shortens "Alisha Academy Kids Learning", and
   uses "4x4" where the project name uses "4×4"), so this stays an explicit
   lookup rather than name-derived guessing.
   Includes the 6 gaming-featured projects (Crazy Taxi, Ludo Cruise, Lumber
   Tycoon, Sniper Fury, Underground Racing, Zombie Shooter) even though they
   never show up in the gaming portfolio's Other Projects list — on the
   educational portfolio, whose top-6 is a different cut (by educationalOrder),
   5 of those 6 land in this "other" list instead, and without an entry here
   they fell back to a generic Material Symbol despite real art existing.
   Pre School Academy has no artwork supplied yet, so it falls through to its
   Material Symbol `icon` field. Drop a matching file in the folder and add a
   line here to give it a real icon. */
const ICON_DIR = 'images/Small Icons';

const PROJECT_ICONS = {
  'Body Mirror': 'BodyMirror.png',
  'ALISHA ACADEMY KIDS LEARNING': 'Alisha Academy.webp',
  'MODERN WARFARE SHOOTER': 'Modern Warfare Shooter.webp',
  'BUS SIMULATOR': 'Bus Simulator.webp',
  'FLYWORLD – 2D FLIGHT': 'Flyworld – 2D Flight.webp',
  'TASBEHAT TILE MATCH': 'Tasbehat Tile Match.webp',
  'Alpha Battle': 'Alpha Battle.webp',
  'FRUIT BLAST SAGA': 'Fruit Blast Saga.webp',
  'RAINING ROCKETS': 'Raining Rockets.webp',
  'Genius Gen: Kids Learning': 'Genius Gen - Kids Learning.webp',
  'TOP-DOWN RUNNER': 'Top-Down Runner.webp',
  'TRUCK SIMULATOR: OFFROAD 4×4': 'Truck Simulator - Offroad 4x4.webp',
  'STORM SURVIVAL': 'Storm Survival.webp',
  'PARKING SIMULATOR': 'Parking Simulator.webp',
  'STRING THEORY': 'String Theory.webp',
  'HUNTING GAME': 'Hunting Game.webp',
  'SHIP RIVER CROSSING': 'Ship River Crossing.webp',
  'TOP DOWN SHOOTER': 'Top Down Shooter.webp',
  'DANCING CUBE': 'Dancing Cube.webp',
  'CASTLE BATTLE': 'Castle Battle.webp',
  'FLAG MASTER': 'Flag Master.webp',
  'SIEMENS CITY BUILDER': 'Siemens City Builder.webp',
  'LUMBER TYCOON INC': 'Lumber Empire.webp',
  'SNIPER FURY': 'Sniper Fury.webp',
  'UNDERGROUND RACING': 'Underground Racing.webp',
  'CRAZY TAXI 2 – ANGRY DRIVER': 'Crazy Taxi.webp',
  'ZOMBIE SHOOTER 3D': 'Zombie Shooter.webp',
  'LUDO CRUISE': 'Ludo Cruise.webp',
};

const iconFor = (project) => {
  const file = PROJECT_ICONS[project.name];
  if (file) {
    /* encodeURI, not a raw template string: both the folder name and most
       filenames contain spaces, and one contains an en dash. */
    return { type: 'img', url: encodeURI(`${process.env.PUBLIC_URL}/${ICON_DIR}/${file}`) };
  }
  return { type: 'material', name: project.icon || 'sports_esports' };
};

/* Round-robin into 3 rows (rather than contiguous thirds) so each row mixes
   projects from across the list instead of one row getting a run of similar
   genres just because of how they sort. Purely a grouping/visual-rhythm
   device now — the rows are static, not scrolling tracks. */
const splitIntoRows = (items, rowCount) => {
  const rows = Array.from({ length: rowCount }, () => []);
  items.forEach((item, i) => rows[i % rowCount].push(item));
  return rows;
};

const POPUP_WIDTH = 300;
const POPUP_GAP = 12;
/* Rough ceiling on popup height (name + summary paragraph + tech tag row),
   used only to decide whether it fits above the tile or needs to flip below
   — the popup itself still just grows to fit its real content. */
const POPUP_EST_HEIGHT = 280;
/* Hover must linger this long before the popup appears — a quick pass of the
   cursor across a row of icons shouldn't pop up a card for every one it
   crosses. */
const HOVER_DELAY_MS = 450;

/* One flowing paragraph per project instead of separate genre/tagline/role/
   tag blocks — genre and description (or myRole, for entries that only have
   the older field) read as a single sentence rather than a stack of labelled
   fragments. */
const summarize = (project) => {
  const parts = [];
  if (project.genre) parts.push(project.genre);
  const body = project.description || project.myRole;
  if (body) parts.push(body);
  return parts.join('. ');
};

/* Positioned via a portal to document.body — a panel this size would blow out
   the grid's row height if it lived inline in a cell. Floats free above
   everything, anchored to the tile's on-screen position captured at hover
   time, flipping below the tile when there isn't room above (top grid rows).
   Mounts small/transparent and animates in on the next frame — see the
   `entered` state below — rather than just appearing instantly. */
const DetailPopup = ({ project, anchorRect }) => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [project, anchorRect]);

  if (!project || !anchorRect) return null;

  const centerX = anchorRect.left + anchorRect.width / 2;
  const left = Math.min(
    Math.max(centerX, POPUP_WIDTH / 2 + 8),
    window.innerWidth - POPUP_WIDTH / 2 - 8
  );

  const showBelow = anchorRect.top < POPUP_EST_HEIGHT + POPUP_GAP;
  const top = showBelow ? anchorRect.bottom + POPUP_GAP : anchorRect.top - POPUP_GAP;
  const summary = summarize(project);

  return createPortal(
    <div
      className={`other-project-popup ${showBelow ? 'below' : 'above'} ${entered ? 'entered' : ''}`}
      style={{ left, top, width: POPUP_WIDTH }}
    >
      <p className="other-project-popup-name">{project.name}</p>
      {summary && <p className="other-project-popup-summary">{summary}</p>}

      {project.techTags && project.techTags.length > 0 && (
        <div className="other-project-popup-tags">
          {project.techTags.map((tag, i) => (
            <span key={i} className="other-project-popup-tag">{tag}</span>
          ))}
        </div>
      )}

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="other-project-popup-link"
          onClick={(e) => e.stopPropagation()}
        >
          View Project
          <span className="material-symbols-outlined">arrow_outward</span>
        </a>
      )}

      <div className="other-project-popup-arrow" />
    </div>,
    document.body
  );
};

const ProjectTile = ({ project, onDetailEnter, onDetailLeave, delay = 1 }) => {
  const tileRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const icon = iconFor(project);

  const handleEnter = () => {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      const rect = tileRef.current?.getBoundingClientRect();
      onDetailEnter && onDetailEnter(project, rect);
    }, HOVER_DELAY_MS);
  };

  const handleLeave = () => {
    clearTimeout(hoverTimerRef.current);
    onDetailLeave && onDetailLeave();
  };

  useEffect(() => () => clearTimeout(hoverTimerRef.current), []);

  return (
    <div className={`other-project-tile reveal reveal-delay-${delay}`} ref={tileRef}>
      <div
        className={`other-project-tile-icon ${icon.type === 'img' ? 'is-image' : 'is-fallback'}`}
        role="button"
        tabIndex={0}
        aria-label={`${project.name} details`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        {icon.type === 'img'
          ? <img src={icon.url} alt={project.name} className="other-project-tile-img" />
          : <span className="material-symbols-outlined">{icon.name}</span>
        }
      </div>
      <span className="other-project-tile-name">{project.name}</span>
    </div>
  );
};

const OtherProjectsShowcase = ({ projects, portfolioType = 'gaming' }) => {
  const [activeDetail, setActiveDetail] = useState(null);
  const rowsRef = useRef(null);

  const showDetail = useCallback((project, rect) => {
    if (rect) setActiveDetail({ project, rect });
  }, []);

  const hideDetail = useCallback(() => setActiveDetail(null), []);

  /* Called unconditionally, before the early returns below — the effect it
     registers is a no-op (rowsRef.current is null) on any render that bails
     out before the grid mounts, but the hook call itself must never be
     skipped or React's hook-order invariant breaks between renders. */
  useMagnifyEffect(rowsRef);

  if (!projects || projects.length === 0) return null;

  const filtered = projects.filter((p) => p.category && p.category.includes(portfolioType));
  const orderKey = portfolioType === 'gaming' ? 'gamingOrder' : 'educationalOrder';
  const sorted = [...filtered].sort((a, b) => (a[orderKey] || 999) - (b[orderKey] || 999));
  const featuredNames = sorted.slice(0, 6).map((p) => p.name);
  const otherProjects = projects.filter((p) => !featuredNames.includes(p.name));

  if (otherProjects.length === 0) return null;

  const rows = splitIntoRows(otherProjects, 3).filter((row) => row.length > 0);

  return (
    <section id="other-projects" className="other-projects-showcase-section reveal">
      <h2>Other Projects</h2>
      <div className="other-projects-rows" ref={rowsRef}>
        {rows.map((row, r) => (
          <div key={r} className="other-projects-row">
            {row.map((project, i) => (
              <ProjectTile key={i} project={project} onDetailEnter={showDetail} onDetailLeave={hideDetail} delay={(i % 5) + 1} />
            ))}
          </div>
        ))}
      </div>
      {activeDetail && (
        <DetailPopup project={activeDetail.project} anchorRect={activeDetail.rect} />
      )}
    </section>
  );
};

export default OtherProjectsShowcase;
