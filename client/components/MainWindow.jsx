import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';

const MainWindow = () => (

  <div className="main-window">
    <Header />
    <Sidebar />
    <Content />
  </div>

);

export default MainWindow;
