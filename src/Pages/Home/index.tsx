import React, { createContext, useState, Dispatch } from 'react';
import styles from './index.module.scss';
import Header from './Components/Header';
import Banner from './Components/Banner';
import Content from './Components/Content';
import AmaiteWrap from '@/Components/AmaiteWrap';

export const PageSwitchContext = createContext<{
  page: string;
  setPage: Dispatch<any>;
}>({
  page: '',
  setPage: () => {},
});
const Home = () => {
  return (
    // <AmaiteWrap show={true} classNames={styles.fade}>
      <div className={styles.container}>
        <Header />
        <Banner />
        <Content />
      </div>
    // </AmaiteWrap>
  );
};
export default Home;
