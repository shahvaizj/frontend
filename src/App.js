import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Navbar from './components/Navbar';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });
  const [portfolioData, setPortfolioData] = useState({
    about: null,
    skills: null,
    projects: null,
    testimonials: null,
    contact: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');

  const portfolioType = location.pathname.includes('/2') ? 'educational' : 'gaming';

  const togglePortfolio = () => {
    navigate(portfolioType === 'gaming' ? '/2' : '/1');
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [about, skills, projects, testimonials, contact] = await Promise.all([
          axios.get(process.env.PUBLIC_URL + '/about.json'),
          axios.get(process.env.PUBLIC_URL + '/skills.json'),
          axios.get(process.env.PUBLIC_URL + '/projects.json'),
          axios.get(process.env.PUBLIC_URL + '/testimonials.json'),
          axios.get(process.env.PUBLIC_URL + '/contact.json'),
        ]);

        setPortfolioData({
          about: about.data,
          skills: skills.data,
          projects: projects.data,
          testimonials: testimonials.data,
          contact: contact.data,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'skills', 'projects', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 300;
      let foundSection = null;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            foundSection = section;
            break;
          }
        }
      }
      
      if (foundSection) {
        setCurrentSection(foundSection);
      } else if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50) {
        setCurrentSection('contact');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const PortfolioContent = () => (
    <div className={`App ${theme}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} currentSection={currentSection} />
      <button onClick={toggleTheme} className="theme-toggle-fixed">
        <span className="material-symbols-outlined">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
      <div className="portfolio-toggle" style={{ display: 'none' }}>
        <button 
          className={`toggle-btn ${portfolioType === 'gaming' ? 'active' : ''}`}
          onClick={() => navigate('/1')}
        >
          Gaming
        </button>
        <button 
          className={`toggle-btn ${portfolioType === 'educational' ? 'active' : ''}`}
          onClick={() => navigate('/2')}
        >
          Educational
        </button>
      </div>
      <main className="main-content">
        <Home about={portfolioData.about} funTitles={portfolioData.about.funTitles} contactEmail={portfolioData.contact.email} />
        <Skills skills={portfolioData.skills} />
        <Projects projects={portfolioData.projects} portfolioType={portfolioType} />
        <Testimonials testimonials={portfolioData.testimonials} />
        <Contact contact={portfolioData.contact} />
      </main>
    </div>
  );

  return <PortfolioContent />;
}

export default App;
