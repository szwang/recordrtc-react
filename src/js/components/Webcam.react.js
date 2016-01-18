import React from 'react';
import { captureUserMedia } from '../utils/RecordUtils';

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

class Webcam extends React.Component {
  constructor(props) {
    super(props);

    this.state = { src: null };

    this.requestUserMedia = this.requestUserMedia.bind(this);
  }

  componentDidMount() {
    if(!hasGetUserMedia()) {
      alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
      return;
    }
    this.requestUserMedia();
  }

  requestUserMedia() {
    captureUserMedia((stream) => {
      this.setState({ src: window.URL.createObjectURL(stream) });
    });
  }

  render() {
    return (
      <video autoPlay muted src={this.state.src} />
    )
  }
}

export default Webcam;
