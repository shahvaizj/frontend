import React from 'react';
import './Navbar.css';

const Navbar = ({ currentSection }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'skills', label: 'Skills', icon: 'psychology' },
    { id: 'projects', label: 'Projects', icon: 'sports_esports' },
    { id: 'testimonials', label: 'Testimonials', icon: 'format_quote' },
    { id: 'contact', label: 'Contact', icon: 'email' },
  ];

  return (
    <>
      <nav className="navbar">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.id} className="nav-item">
              <a 
                href={`#${item.id}`} 
                className={`nav-link ${currentSection === item.id ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined nav-icon">{item.icon}</span>
                <span className="nav-tooltip">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="navbar-mobile">
        {navItems.map((item) => (
          <a 
            key={item.id}
            href={`#${item.id}`} 
            className={`mobile-nav-link ${currentSection === item.id ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
