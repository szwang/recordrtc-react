import React from 'react';
import RecordRTC from 'recordrtc';
import { captureUserMedia, prepareData } from '../utils/RecordUtils';
import Webcam from './Webcam.react';
import S3Upload from '../utils/S3Utils';

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);

class RecordPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recordVideo: null,
      mediaStream: null,
      src: null,
      uploadSuccess: null
    };

    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.onStopRecording = this.onStopRecording.bind(this);
  }

  componentDidMount() {
    if(!hasGetUserMedia) {
      alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
      return;
    }
    this.requestUserMedia();
  }

  requestUserMedia() {
    console.log('requestUserMedia')
    captureUserMedia((stream) => {
      this.setState({ src: window.URL.createObjectURL(stream) });
      console.log('setting state', this.state)
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
      var blob = this.state.recordVideo.blob;
      console.log('blob: ', blob)
      var params = {
        type: 'video/webm',
        data: blob,
        id: 1234
      }
      S3Upload(params)
      .then((success) => {
        if(success) {
          this.setState({ uploadSuccess: true });
        } else {
          alert('Upload failed :(')
        }
      })
    });
  }

  onStopRecording() {
  }

  render() {
    return(
      <div>
        {this.state.uploadSuccess ? <div>Upload success!</div> : null}
        <Webcam src={this.state.src} />
        <button onClick={this.startRecord}>Start Record</button>
      </div>
    )
  }
}

export default RecordPage;

