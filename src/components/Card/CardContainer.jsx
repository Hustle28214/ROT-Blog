import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

const CardContainer = ({ children }) => {
  return <div className={styles.cardContainer}>{children}</div>;
};

CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CardContainer;