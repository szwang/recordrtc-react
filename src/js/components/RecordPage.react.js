import React from 'react';
import RecordRTC from 'recordrtc';
import { captureUserMedia } from '../utils/RecordUtils';
import Webcam from './Webcam.react';
import RecorderActionCreators from '../actions/RecorderActionCreators';

const isFirefox = !!navigator.mozGetUserMedia;

function prepareData(audioDataURL, videoDataURL) {
  return new Promise((resolve, reject) => {
    let files = {};
    let id = Math.floor(Math.random()*90000) + 10000;

    if(videoDataURL) {
      files.video = {
          name: id + '.webm',
          type: 'video/webm',
          contents: videoDataURL
      }
    }

    files.audio = {
      name: id + (isFirefox ? '.webm' : '.wav'),
      type: isFirefox ? 'video/webm' : 'audio/wav',
      contents: audioDataURL
    }

    files.isFirefox = isFirefox;
    files.name = id;

    resolve(files);
  })
};

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
          this.prepareData(audioDataURL, videoDataURL)
        })
      } else {
        this.prepareData(audioDataURL)
      }

      .then((files) => {
        RecorderActionCreators.postFiles(files);
      });
    });
  }

  render() {
    <div>
      <Webcam />
      <button>Start Record</button>
    </div>
  }
}

export default RecordPage;
