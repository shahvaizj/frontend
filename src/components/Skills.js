import React from 'react';
import './Skills.css';

const Skills = ({ skills }) => (
  <section id="skills" className="skills-section reveal">
    <h2>Skills</h2>
    <div className="skills-list">
      {skills.map((categoryData, i) => (
        <div key={i} className={`skills-group reveal reveal-delay-${i + 1}`}>
          <h3 className="skills-group-title">{categoryData.category}</h3>
          <ul className="skills-items">
            {categoryData.items.map((name, j) => (
              <li key={j}>{name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default Skills;
