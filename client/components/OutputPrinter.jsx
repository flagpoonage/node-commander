require('./style/OutputPrinter.pcss');

import React from 'react';
import OutputBuffer from './OutputBuffer';

const OutputPrinter = React.createClass({
  componentDidMount () {
    this.ticking = false;
    this.livescroll = true;
    //this.container.addEventListener('scroll', this.handleScroll, false);
  },

  handleScroll () {
    //last_known_scroll_position = window.scrollY;
    // if (!this.ticking) {
    //   window.requestAnimationFrame(() => {
    //     console.log(e.srcElement.scrollTop);
    //     this.ticking = false;
    //   });
    // }
    //
    // this.ticking = true;
  },

  componentDidUpdate () {
    if(!this.livescroll) {
      return;
    }

    let displayHeight = this.display.clientHeight;
    this.container.scrollTop = displayHeight - this.container.clientHeight;
  },

  render () {
    let output = this.props.output;
    return (
      <div className="output-printer" ref={container => this.container = container}>
        <pre ref={display => this.display = display}>
          {Array.isArray(output)
            ? output.map((buffer, index) => <OutputBuffer index={index} key={'buffer_' + index} buffer={buffer} />)
            : output}
        </pre>
      </div>
    );
  }
});

export default OutputPrinter;
