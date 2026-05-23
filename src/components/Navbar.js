import React from 'react';
import './Navbar.css';

const Navbar = ({ currentSection }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'projects', label: 'Projects', icon: 'sports_esports' },
    { id: 'skills', label: 'Skills', icon: 'psychology' },
    { id: 'testimonials', label: 'Testimonials', icon: 'format_quote' },
    { id: 'contact', label: 'Contact', icon: 'email' },
  ];

  return (
    <>
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
