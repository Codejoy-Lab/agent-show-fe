import React from 'react';
import styles from './index.module.scss';

export default () => {
  const Title = '三百六十行, 行行有AI';
  return (
    <div className={styles.container}>
      <span className={styles.title}>{Title}</span>
    </div>
  );
};
