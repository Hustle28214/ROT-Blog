import React from 'react';
import './skillList.css';

const SkillItem = ({ name, progress, description }) => (
  <li className="skill-item" style={{ '--progress': `${progress}%` }}>
    <div className="skill-info">
      <span className="skill-name">{name}</span>
      {description && <span className="skill-description">{description}</span>}
    </div>
    <div className="progress-bar">
      <div className="progress-bar-fill"></div>
    </div>
  </li>
);

const SkillList = ({ children }) => {
  return (
    <div className="skill-list-container">
      {React.Children.map(children, (child, index) => (
        <div key={index} className="skill-section">
          <h2>{child.props.title || ''}</h2>
          {child.props.subtitle && <h3>{child.props.subtitle}</h3>}
          <ul className="skill-list">
            {child.props.items.map((item, subIndex) => (
              <SkillItem 
                key={subIndex} 
                name={item.name} 
                progress={item.progress} 
                description={item.description}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export { SkillList, SkillItem };