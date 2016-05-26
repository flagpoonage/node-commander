import React from 'react';
import { connect } from 'react-redux';

const Sidebar = connect(

  state => ({
    pkg: state.pkg
  })

)(({ pkg }) => (

  <aside className="sidebar">
  </aside>

));

export default Sidebar;
