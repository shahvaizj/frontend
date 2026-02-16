import React from 'react';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
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

      </ul>
    </nav>
  );
};

export default Navbar;
