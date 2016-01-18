import React from 'react';

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
    this.captureUserMedia((stream) => {
      this.setState({ src: window.URL.createObjectURL(stream) });
    });
  }

  captureUserMedia(callback) {
    var params = { audio: false, video: true };

    navigator.getUserMedia(params, callback, (error) => {
      alert(JSON.stringify(error));
    });
  }

  render() {
    return (
      <video src={this.state.src} />
    )
  }
}

export default Webcam;