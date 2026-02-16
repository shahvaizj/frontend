import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import App.css
import Home from './components/Home';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';

import Navbar from './components/Navbar'; // Import Navbar

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light'; // Default to 'light' if no theme saved
  });
  const [portfolioData, setPortfolioData] = useState({
    about: null,
    skills: null,
    techStack: null,
    projects: null,
    testimonials: null,
    contact: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Effect to save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [about, skills, projects, testimonials, contact] = await Promise.all([
          axios.get(process.env.PUBLIC_URL + '/about.json'),
          axios.get(process.env.PUBLIC_URL + '/skills.json'), // This will now return categorized skills
          axios.get(process.env.PUBLIC_URL + '/projects.json'),
          axios.get(process.env.PUBLIC_URL + '/testimonials.json'),
          axios.get(process.env.PUBLIC_URL + '/contact.json'),
        ]);

        setPortfolioData({
          about: about.data,
          skills: skills.data, // skills.data now directly contains categories
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
  }, []); // Original effect dependencies

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={`App ${theme}`}> {/* Original theme class on App div */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <button onClick={toggleTheme} className="theme-toggle-fixed">
        <span className="material-symbols-outlined">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
      <Home about={portfolioData.about} funTitles={portfolioData.about.funTitles} contactEmail={portfolioData.contact.email} />
      <Skills skills={portfolioData.skills} />
      <Projects projects={portfolioData.projects} />
      <Testimonials testimonials={portfolioData.testimonials} />
    </div>
  );
}

export default App;
