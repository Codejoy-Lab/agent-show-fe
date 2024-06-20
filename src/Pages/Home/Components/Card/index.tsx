import React from 'react';
import styles from './index.module.scss';
interface CardProps {
  onClick: (...args: any) => void;
  videoUrl: string;
  type: string;
  style?: any
}
export default (props: CardProps) => {
  const { onClick, videoUrl, style } = props;
  return (
    <div className={styles.container} onClick={onClick} style={style || {}}>
      <video key={videoUrl} loop autoPlay className={styles.video}>
        <source src={videoUrl}></source>
      </video>
    </div>
  );
};
