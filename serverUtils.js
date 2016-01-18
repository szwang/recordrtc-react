var fs = require('fs');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

function s3Upload(fileName, key, resolve, reject) {
  console.log('uploading ', fileName, key, ' to s3');

  var body = fs.createReadStream(fileName);

  return s3.upload({
    Body: body,
    Key: key,
    ContentType: 'video/webm',
    Bucket: 'recordrtc-test',
    ACL: 'public-read'  
  })
  .on('httpUploadProgress', function(e) {
    console.log('upload in progress', e);
  })
  .send(function(err, data) {
    if(err) {
      console.log('s3 upload error occurred: ', err);
      reject(Error(err));
    } else {
      console.log('s3 upload success: ', data);
      resolve({ success: true, link: data.Location });
    }
  })
}

module.exports = {
  uploadToDisk: function(file, isFirefox) {
    return new Promise(function(resolve, reject) {
      var fileRootName = file.name.split('.').shift(),
          fileExtension = file.name.split('.').pop(),
          filePathBase = './uploads/',
          fileRootNameWithBase = filePathBase + fileRootName,
          filePath = fileRootNameWithBase + '.' + fileExtension,
          fileID = 2,
          fileBuffer;
      
      var fileName = file.name.split('.')[0] + '.webm'
      var key = file.name.split('.')[0];

      while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
      }    

      file.contents = file.contents.split(',').pop();
      fileBuffer = new Buffer(file.contents, "base64");
      fs.writeFile(filePath, fileBuffer, function(error) {
        if(error) {
          reject(Error(error));
        } else {
          if(!isFirefox) {
            resolve();
          } else {
            s3Upload('uploads/' + fileName, key + '.webm', resolve, reject);
          } 
        }
      });
    })
  },

  merge: function(files) {
    var isWin = !!process.platform.match( /^win/ );

    if (isWin) {
      return this.handleWin(files)
    } else {
      return this.handleMac(files)
    }
  },

  handleWin: function(files) {
    return new Promise(function(resolve, reject) {
      
      var merger = __dirname + '\\merger.bat';
      var audioFile = __dirname + '\\uploads\\' + files.audio.name;
      var videoFile = __dirname + '\\uploads\\' + files.video.name;
      var mergedFile = __dirname + '\\uploads\\' + files.audio.name.split('.')[0] + '-merged.webm';

      var command = merger + ', ' + audioFile + " " + videoFile + " " + mergedFile + '';
      var fileName = files.audio.name.split('.')[0] + '-merged.webm'
      var key = files.audio.name.split('.')[0];
      
      exec(command, function(error, stdout, stderr) {
        if(error) {
          console.log('error occurred');
          resolve(Error(error));
        } else {
          fs.unlink(audioFile);
          fs.unlink(videoFile);

          s3Upload('uploads/' + fileName, key + '.webm', resolve, reject);
        }
      })
    })
  },

  handleMac: function(files) {
    return new Promise(function(resolve, reject) {

      var audioFile = __dirname + '/uploads/' + files.audio.name;
      var videoFile = __dirname + '/uploads/' + files.video.name;
      var mergedFile = __dirname + '/uploads/' + files.audio.name.split('.')[0] + '-merged.webm';

      var util = require('util'),
          exec = require('child_process').exec;

      var command = "ffmpeg -i " + audioFile + " -i " + videoFile + " -map 0:0 -map 1:0 " + mergedFile;
      var fileName = files.audio.name.split('.')[0] + '-merged.webm'
      var key = files.audio.name.split('.')[0];

      exec(command, function(error, stdout, stderr) {
        console.log('running command: ', command);
        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
        
        if(error) {
          console.log('merging error: ', error);
        }

        fs.unlink(audioFile);
        fs.unlink(videoFile);

        s3Upload('uploads/' + fileName, key + '.webm', resolve, reject);
      })
    })
  }
}








