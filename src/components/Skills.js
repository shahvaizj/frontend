import React from 'react';
import './Skills.css';

const Skills = ({ skills }) => { // Now receives categorized skills
  return (
    <section id="skills" className="skills-section">
      <h2>Skills</h2>

      {skills.map((categoryData, catIndex) => (
        <div key={catIndex} className="skill-category-banner"> {/* Apply new common class */}
          <h3 className="skill-category-banner-title">{categoryData.category}</h3>
          <div className="skill-tags-container">
            {categoryData.items.map((skill, skillIndex) => (
              <span key={skillIndex} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Skills;
