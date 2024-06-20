import React, { useState } from 'react';
import styles from './index.module.scss';
import Card from '../Card';
import CardList from './data';
import { useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState({});
  const [openChildPage, setOpenChildPage] = useState(false);
  const handleClickCard = (data: React.SetStateAction<{}>) => {
    //  setPage('ChildPage');
    navigate('/chat', { state: { params: data } });
    setCurrentData(data);
    setOpenChildPage(true);
  };
  return (
    <div className={styles.container}>
      {CardList.map((item, i) => {
        return (
          <div
            key={i}
            style={{ width: `${90 / CardList.length}%`, cursor: 'pointer' }}
          >
            <Card
              {...item}
              videoUrl={item.videoUrls[0]}
              key={item.videoUrls[0]}
              onClick={() => handleClickCard(item)}
            />
          </div>
        );
      })}
    </div>
  );
};
