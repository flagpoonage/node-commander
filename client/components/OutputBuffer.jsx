import React from 'react';
import OutputStyle from './OutputStyle';

const OutputBuffer = ({ buffer }) => (
  <span className="buffer testbuffer">
    {buffer.output.map(a => typeof a === 'string' ? <span>{a}</span> : <OutputStyle data={a} />)}
  </span>
);

export default OutputBuffer;
