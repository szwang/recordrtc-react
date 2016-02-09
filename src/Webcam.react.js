import React from 'react';

class Webcam extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <video autoPlay muted src={this.props.src} />
    )
  }
}

export default Webcam;
