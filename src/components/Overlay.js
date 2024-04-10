// Overlay.js
import React from 'react';
import styles from '../styles/Overlay.module.css';

const Overlay = ({ isOpen, onClose, children }) => {
  return (
    <div className={isOpen ? styles.overlayOpen : styles.overlayClosed}>
      <div className={styles.overlayContent}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Overlay;
