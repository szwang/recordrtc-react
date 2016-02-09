

export function captureUserMedia(callback) {
  var params = { audio: false, video: true };

  navigator.getUserMedia(params, callback, (error) => {
    alert(JSON.stringify(error));
  });
};