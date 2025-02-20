import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({ title, description, href, iconSrc }) => {
  return (
    <a href={href} className={styles.card} target="_blank">
      <div className={styles.cardIcon}>
        {iconSrc && <img src={iconSrc} alt={title} />}
      </div>
      <div className={styles.cardContent}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </a>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  iconSrc: PropTypes.string, // 图标是可选的
};

export default Card;