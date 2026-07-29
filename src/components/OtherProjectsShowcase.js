import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import './OtherProjectsShowcase.css';

/* Placeholder icon per project until real per-game icon art is supplied — for
   now this reuses each project's existing `icon` Material Symbol, the same
   field the "Other Projects" modal's category badges could draw from. Swap
   individual entries here for `{ type: 'img', url }` once real icons land. */
const iconFor = (project) => ({ type: 'material', name: project.icon || 'sports_esports' });

const ROW_SPEEDS = [0.35, 0.28, 0.4];

/* Round-robin into 3 rows (rather than contiguous thirds) so each row mixes
   projects from across the list instead of one row getting a run of similar
   genres in a row just because of how they sort. */
const splitIntoRows = (items, rowCount) => {
  const rows = Array.from({ length: rowCount }, () => []);
  items.forEach((item, i) => rows[i % rowCount].push(item));
  return rows;
};

const POPUP_WIDTH = 240;
const POPUP_GAP = 10;

/* Positioned via a portal to document.body rather than as a child of the tile
   — the marquee row clips with overflow: hidden (needed for the scrolling
   mask), so anything wider or taller than the tile itself would be cut off if
   it lived inside that row. This floats free above everything, anchored to
   the tile's on-screen position captured at hover time. */
const DetailPopup = ({ project, anchorRect }) => {
  if (!project || !anchorRect) return null;

  const centerX = anchorRect.left + anchorRect.width / 2;
  const left = Math.min(
    Math.max(centerX, POPUP_WIDTH / 2 + 8),
    window.innerWidth - POPUP_WIDTH / 2 - 8
  );
  const top = anchorRect.top - POPUP_GAP;

  return createPortal(
    <div
      className="other-project-popup"
      style={{ left, top, width: POPUP_WIDTH }}
    >
      <p className="other-project-popup-name">{project.name}</p>
      {project.genre && <p className="other-project-popup-genre">{project.genre}</p>}
      {project.description && (
        <p className="other-project-popup-desc">{project.description}</p>
      )}
      {project.techTags && project.techTags.length > 0 && (
        <div className="other-project-popup-tags">
          {project.techTags.slice(0, 4).map((tag, i) => (
            <span key={i} className="other-project-popup-tag">{tag}</span>
          ))}
        </div>
      )}
      <div className="other-project-popup-arrow" />
    </div>,
    document.body
  );
};

const ProjectTile = ({ project, onDetailEnter, onDetailLeave }) => {
  const tileRef = useRef(null);
  const icon = iconFor(project);

  const handleEnter = () => {
    const rect = tileRef.current?.getBoundingClientRect();
    onDetailEnter && onDetailEnter(project, rect);
  };

  const handleLeave = () => {
    onDetailLeave && onDetailLeave();
  };

  return (
    <div className="other-project-tile" ref={tileRef}>
      <button
        type="button"
        className="other-project-info-btn"
        aria-label={`${project.name} details`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        <span className="material-symbols-outlined">info</span>
      </button>

      <div className="other-project-tile-icon">
        <span className="material-symbols-outlined">{icon.name}</span>
      </div>
      <span className="other-project-tile-name">{project.name}</span>
    </div>
  );
};

/* Same auto-scrolling, draggable marquee as Skills.js's MarqueeRow — copied
   rather than shared so Skills.js stays untouched while it's hidden. Adds a
   pausedRef alongside the existing dragging ref: either one stops the tick
   from advancing the track, so a tile being inspected holds still. */
const MarqueeRow = ({ items, speed = 0.32, onShowDetail, onHideDetail }) => {
  const rowRef = useRef(null);
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const halfRef = useRef(0);
  const dragging = useRef(false);
  const dragX = useRef(0);
  const dragPos = useRef(0);
  const paused = useRef(false);

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
      if (!dragging.current && !paused.current) {
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
    dragX.current = clientX;
    dragPos.current = posRef.current;
    if (rowRef.current) rowRef.current.classList.add('dragging');
  }, []);

  const moveDrag = useCallback((clientX) => {
    if (!dragging.current) return;
    const delta = clientX - dragX.current;
    const newPos = normalize(dragPos.current + delta);
    posRef.current = newPos;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${newPos}px)`;
  }, [normalize]);

  const endDrag = useCallback(() => {
    dragging.current = false;
    if (rowRef.current) rowRef.current.classList.remove('dragging');
  }, []);

  const handleTileEnter = useCallback((project, rect) => {
    paused.current = true;
    onShowDetail(project, rect);
  }, [onShowDetail]);

  const handleTileLeave = useCallback(() => {
    paused.current = false;
    onHideDetail();
  }, [onHideDetail]);

  return (
    <div
      ref={rowRef}
      className="other-project-marquee-row"
      onMouseDown={(e) => { startDrag(e.clientX); e.preventDefault(); }}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
    >
      <div ref={trackRef} className="other-project-marquee-track">
        {[...items, ...items].map((project, i) => (
          <ProjectTile key={i} project={project} onDetailEnter={handleTileEnter} onDetailLeave={handleTileLeave} />
        ))}
      </div>
    </div>
  );
};

const OtherProjectsShowcase = ({ projects, portfolioType = 'gaming' }) => {
  const [activeDetail, setActiveDetail] = useState(null);

  const showDetail = useCallback((project, rect) => {
    if (rect) setActiveDetail({ project, rect });
  }, []);

  const hideDetail = useCallback(() => setActiveDetail(null), []);

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
      <div className="other-projects-rows">
        {rows.map((row, i) => (
          <MarqueeRow
            key={i}
            items={row}
            speed={ROW_SPEEDS[i] ?? 0.35}
            onShowDetail={showDetail}
            onHideDetail={hideDetail}
          />
        ))}
      </div>
      {activeDetail && (
        <DetailPopup project={activeDetail.project} anchorRect={activeDetail.rect} />
      )}
    </section>
  );
};

export default OtherProjectsShowcase;
