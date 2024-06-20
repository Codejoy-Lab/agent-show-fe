import React, { useState, useContext } from 'react';
import styles from './index.module.scss';
import Card from '../Card';
import ChildPage from '../../../ChildPage';
import CardList from './data';
import { PageSwitchContext } from '../../index';
import { useNavigate, useLocation } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();
  // const list = CardList
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
          <div key={i} style={{ width: `${90 / CardList.length}%`, cursor:'pointer' }}>
            <Card {...item} key={i} onClick={() => handleClickCard(item)} />
          </div>
        );
      })}
    </div>
  );
};
