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
      recordAudio: null,
      recordVideo: null,
      mediaStream: null
    };

    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.onStopRecording = this.onStopRecording.bind(this);
  }

  startRecord() {
    captureUserMedia((stream) => {
      this.setState({ mediaStream: stream });

      this.state.recordAudio = RecordRTC(stream, {
        bufferSize: 16384
      });

      if(!isFirefox) {
        this.state.recordVideo = RecordRTC(stream, {
          type: 'video'
        });
      }

      this.state.recordAudio.startRecording();
      if(!isFirefox) {
        this.state.recordVideo.startRecording();
      }
    });

    setTimeout(() => {
      this.stopRecord();
    }, 5000);
  }

  stopRecord() {
    this.state.recordAudio.stopRecording(() => {
      if(isFirefox) this.onStopRecording();
    })

    if(!isFirefox) {
      this.state.recordVideo.stopRecording(() => {
        this.onStopRecording();
      });
    }
  }

  onStopRecording() {
    this.state.recordAudio.getDataURL((audioDataURL) => {
      if(!isFirefox) {
        this.state.recordVideo.getDataURL((videoDataURL) => {
          prepareData(audioDataURL, videoDataURL)
          .then((files) => {
            RecorderActionCreators.postFiles(files);
          });
        })
      } else {
        prepareData(audioDataURL)
        .then((files) => {
          RecorderActionCreators.postFiles(files);
        });
      }
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
