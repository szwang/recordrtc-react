import React from 'react';
import RecordRTC from 'recordrtc';
import { captureUserMedia, prepareData } from '../utils/RecordUtils';
import Webcam from './Webcam.react';
import RecorderActionCreators from '../actions/RecorderActionCreators';

const isFirefox = !!navigator.mozGetUserMedia;

class RecordPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recordVideo: null,
      mediaStream: null,
      src: null
    };

    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.onStopRecording = this.onStopRecording.bind(this);
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

  startRecord() {
    captureUserMedia((stream) => {
      this.setState({ mediaStream: stream });

      this.state.recordVideo = RecordRTC(stream, {
        type: 'video'
      });

      this.state.recordVideo.startRecording();
    });

    setTimeout(() => {
      this.stopRecord();
    }, 5000);
  }

  stopRecord() {
    this.state.recordVideo.stopRecording(() => {
      this.onStopRecording();
    });
  }

  onStopRecording() {
    this.state.recordAudio.getDataURL((videoDataURL) => {
      prepareData(videoDataURL)
      .then((files) => {
        RecorderActionCreators.postFiles(files);
      });
    });
  }

  render() {
    return(
      <div>
        <Webcam />
        <button onClick={this.startRecord}>Start Record</button>
      </div>
    )
  }
}

export default RecordPage;
