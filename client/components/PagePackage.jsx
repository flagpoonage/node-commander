import React from 'react';
import { connect } from 'react-redux';
import OutputPrinter from './OutputPrinter';

const PagePackage = connect(

  state => ({
    pkg: state.pkg
  })

)(({ pkg }) => (

  <div className="page-package">
    <OutputPrinter output={JSON.stringify(pkg, null, 2)} />
  </div>

));

export default PagePackage;
