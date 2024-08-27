import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css'; // 使用 CSS 模块

const Card = ({ title, description, href }) => {
  return (
    <a href={href} className={styles.card}>
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
};

export default Card;