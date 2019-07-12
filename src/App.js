import React from 'react';
import './App.css';
import * as handTrack from 'handtrackjs';

const videoWidth = 720;
const videoHeight = 480;

async function setupCamera(video) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  video.width = videoWidth;
  video.height = videoHeight;

  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: videoWidth,
      height: videoHeight,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.canvas = React.createRef();
    this.state = { handTrackModel: null, video: null }
  }

  clapDetection = (rect1, rect2) => {
    if (rect1[0] < rect2[0] + rect2[2] &&
      rect1[0] + rect1[2] > rect2[0] &&
      rect1[1] < rect2[1] + rect2[3] &&
      rect1[3] + rect1[1] > rect2[1]) {
      console.log('clap!')
      this.setState({})
    }
  }

  runDetection = () => {
    this.state.handTrackModel.detect(this.video.current).then(predictions => {
      // console.log("Predictions: ", predictions);
      if (predictions.length === 2) {
        this.clapDetection(predictions[0].bbox, predictions[1].bbox)
      }
      const context = this.canvas.current.getContext("2d");
      this.state.handTrackModel.renderPredictions(predictions, this.canvas.current, context, this.video.current);
      // if (isVideo) {
      requestAnimationFrame(this.runDetection);
      // }
    });
  }
  async componentDidMount() {
    const v = await setupCamera(this.video.current)
    v.play()
    const model = await handTrack.load({
      flipHorizontal: true,   // flip e.g for video
      maxNumBoxes: 2,        // maximum number of boxes to detect
      iouThreshold: 0.5,      // ioU threshold for non-max suppression
      scoreThreshold: 0.9,    // confidence threshold for predictions.
    })
    this.setState({ handTrackModel: model, video: v }, () => {
      this.runDetection()
    });

  }

  shouldComponentUpdate(nextProps, nextState){

  }
  render() {
    return (
      <div className="App">
        <video className="canvasbox" ref={this.video} playsInline></video>
        <canvas className="canvasbox" ref={this.canvas}></canvas>

      </div>
    );
  }
}

export default App;
