export default {
  postFiles(data) {
    var body = JSON.stringify(data);

    fetch('/upload', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body  
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      Dispatcher.dispatch({
        type: ActionType.UPLOAD_STATUS,
        uploading: false,
        success: json.success
      })
    })
    .catch((err) => {
      console.log('error: ', err);
    })
  }
} 