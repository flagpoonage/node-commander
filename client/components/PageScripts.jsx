import React from 'react';
import { connect } from 'react-redux';

const PageScripts = connect(

  state => ({
    scripts: state.scriptsArray
  })

)(({ scripts, dispatch }) => (

  <div className="page-scripts">
    {'Page Scripts'}
  </div>

));

export default PageScripts;
