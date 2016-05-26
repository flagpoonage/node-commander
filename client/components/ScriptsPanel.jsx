import React from 'react';
import ScriptItem from './ScriptItem';

const ScriptsPanel = ({ scripts, cwd, dispatch }) => (
  <div className="scripts-panel">
    {scripts.map(s => (<ScriptItem script={s} dispatch={dispatch} />))}
  </div>
);

export default ScriptsPanel;
