import React from 'react';
import styles from './index.module.scss';
interface CardProps {
  onClick: (...args: any) => void;
  videoUrls: string[];
  type: string;
  style?: any
}
export default (props: CardProps) => {
  const { onClick, videoUrls, style } = props;

  return (
    <div className={styles.container} onClick={onClick} style={style || {}}>
      <video loop autoPlay className={styles.video}>
        <source src={videoUrls[0]}></source>
      </video>
    </div>
  );
};
