export function postFiles(data) {
  var body = JSON.stringify(data);
  console.log('files received, ', body, data)
  var id = data.name;

  fetch('/videoUpload', {
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
      success: json.success,
      id: id
    })
  })
  .catch((err) => {
    console.log('error: ', err);
  })
}
