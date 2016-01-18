export function captureUserMedia(callback) {
  var params = {
    audio: true,
    video: true
  };

  navigator.getUserMedia(params, callback, (error) => {
    alert(JSON.stringify(error));
  });
};

export function prepareData(audioDataURL, videoDataURL) {
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