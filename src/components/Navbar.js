import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const isGaming = location.pathname === '/gaming' || location.pathname === '/';
  const isEducational = location.pathname === '/educational';

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <a href="#home" className="nav-link">Home</a>
        </li>
        <li className="nav-item">
          <a href="#skills" className="nav-link">Skills</a>
        </li>
        <li className="nav-item">
          <a href="#projects" className="nav-link">Projects</a>
        </li>
        <li className="nav-item">
          <a href="#testimonials" className="nav-link">Testimonials</a>
        </li>
        <li className="nav-item portfolio-switch">
          <span className="portfolio-label">View:</span>
          <Link 
            to="/gaming" 
            className={`nav-link portfolio-link ${isGaming ? 'active' : ''}`}
          >
            Gaming
          </Link>
          <Link 
            to="/educational" 
            className={`nav-link portfolio-link ${isEducational ? 'active' : ''}`}
          >
            Educational
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
