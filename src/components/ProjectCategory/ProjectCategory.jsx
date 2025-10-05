import React, { useState } from 'react';
import styles from './ProjectCategory.module.css';
import PropTypes from 'prop-types';
import Link from '@docusaurus/Link';

function ProjectCategory({ title, description, projects }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryHeader}>
        <h2 className={styles.categoryTitle}>{title}</h2>
        <p className={styles.categoryDescription}>{description}</p>
      </div>
      
      <div className={styles.projectsGrid}>
        {projects.map((project, index) => (
          <Link
            key={index}
            to={project.href}
            className={styles.projectCard}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.projectContent}>
              <div className={styles.projectIconWrapper}>
                {project.iconSrc && (
                  <img 
                    src={project.iconSrc} 
                    alt={`${project.title} icon`} 
                    className={styles.projectIcon} 
                  />
                )}
              </div>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

ProjectCategory.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      iconSrc: PropTypes.string,
    })
  ).isRequired,
};

export default ProjectCategory;