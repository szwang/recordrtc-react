
function getSignedUrl(file) {
  let queryString = '?objectName=' + file.id + '&contentType=' + encodeURIComponent(file.type);
  return fetch('/s3/sign' + queryString)
  .then((response) => {
    return response.json();
  })
  .catch((err) => {
    console.log('error: ', err)
  })
}

function uploadToS3(s3Info, fileInfo) {

  var xhr = this.createCORSRequest('PUT', s3Info.signedUrl);
  
  if (!xhr) {
    this.onError('CORS not supported', fileInfo);
  } else {
    xhr.onload = function() {
      if (xhr.status === 200) {
        this.onProgress(100, 'Upload completed', fileInfo);
        // return this.onFinishS3Put(s3Info, fileInfo);
      } else {
        alert('Upload error! Refresh the page and try again.')
        // return this.onError('Upload error: ' + xhr.status, fileInfo);
      }
    }.bind(this);
    xhr.onerror = function() { //TODO: create render function if error occurs
      alert('Upload error! Refresh the page and try again.')
      // return this.onError('XHR error', fileInfo);
    }.bind(this);
    xhr.upload.onprogress = function(e) {
      var percentLoaded;
      if (e.lengthComputable) {
        percentLoaded = Math.round((e.loaded / e.total) * 100);
        if(fileInfo.type.substring(0,3) === 'vid') { // only render result of vid upload to user
          UploadActionCreators.uploadFile(percentLoaded, s3Info);
        }
        // return this.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing' : 'Uploading', file);
      }
    }.bind(this);
  }

  xhr.setRequestHeader('Content-Type', fileInfo.type);
  xhr.setRequestHeader('x-amz-acl', 'public-read');

  this.httprequest = xhr;

  return xhr.send(fileInfo.data);

  // var params = {
  //   Body: fileInfo.data,
  //   Key: fileInfo.id,
  //   ContentType: fileInfo.type
  // };

  // console.log(params)

  // fetch(s3Info.signedUrl, {
  //   method: 'put',
  //   body: params
  // })
  // .then((response) => {
  //   console.log(response)
  // })
}

export default function S3Upload(params) { //parameters: type, data, id
  getSignedUrl(params)
  .then((json) => {
    console.log(json)
    uploadToS3(json, params);
  })
}