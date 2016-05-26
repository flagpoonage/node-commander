import React from 'react';

const OutputStyle = ({ index, data }) => (
  <span className={data.style}>
    {data.output.map((d, i) => (
      typeof d === 'string' ? <span key={'buffer_' + index + '_' + i}>{d}</span> : <OutputStyle data={d} />
    ))}
  </span>
);

OutputStyle.propTypes = {
  index: React.PropTypes.number,
  data: React.PropTypes.any
};

export default OutputStyle;
