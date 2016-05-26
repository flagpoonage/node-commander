import React from 'react';
import { connect } from 'react-redux';
import { openPackage } from '../actions/open-package';

const Header = connect(

  state => ({
    pkg: state.pkg
  })

)(({ pkg, dispatch }) => (

  <header className="package-header">
    <div className="div-clickable open-package" onClick={() => dispatch(openPackage)}>
      {'Select package file...'}
    </div>
    <div className="package-details">
      {!pkg ? (
        <h1>{'No package selected'}</h1>
      ) : (
        <h1>{pkg.name}</h1>
      )}
    </div>
  </header>

));

export default Header;
