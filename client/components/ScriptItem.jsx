import React from 'react';
import { stopScript, startScript } from '../actions/script-proc';
import OutputPrinter from './OutputPrinter';

const toggleProc = (dispatch, script) => () => dispatch(script.process ? stopScript(script.process) : startScript(script));

const ScriptItem = ({ script, cwd, dispatch }) => (
  <div className="script-item">
    <span className="label">
      {script.label}
    </span>
    <button className="action" onClick={toggleProc(dispatch, script)}>
      {script.process ? 'Stop' : 'Start'}
    </button>
    {script.data ? (
      <OutputPrinter output={script.data} />
    ) : null}
  </div>
);

export default ScriptItem;
