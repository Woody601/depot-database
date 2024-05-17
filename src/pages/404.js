import React from 'react';
import styles from "@/styles/404.module.css"; 

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.nextErrorH1}>404</h1>
        <div className={styles.messageContainer}>
          <h2 className={styles.message}>This page could not be found.</h2>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
