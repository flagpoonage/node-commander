import React from 'react';
import PagePackage from './PagePackage';
import PageScripts from './PageScripts';

const PAGES = {
  package: <PagePackage />,
  scripts: <PageScripts />
};

const Content = ({ page }) => PAGES[page];

export default Content;
