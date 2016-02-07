
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

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();

  if (xhr.withCredentials != null) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest !== "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }

  return xhr;
};

function uploadToS3(s3Info, fileInfo) {
  return new Promise((resolve, reject) => {
    var xhr = createCORSRequest('PUT', s3Info.signedUrl);
    
    if (!xhr) {
      alert('CORS not supported');
    } else {
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log('upload complete')
          resolve(true);
        } else {
          alert('Upload error! Refresh the page and try again.')
        }
      };
    }

    xhr.setRequestHeader('Content-Type', fileInfo.type);
    xhr.setRequestHeader('x-amz-acl', 'public-read');

    return xhr.send(fileInfo.data);
  })
}

export default function S3Upload(params) { //parameters: type, data, id
  return new Promise((resolve, reject) => {
    getSignedUrl(params)
    .then((json) => {
      console.log(json)
      return uploadToS3(json, params)
    })
    .then((success) => {
      if(success) resolve(true);
      else reject(false);
    })
  })
}

