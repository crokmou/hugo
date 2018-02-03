'use strict';
const fs   = require('fs');
const exec = require('child_process').exec;

function getFiles (dir, files_){
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files){
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      getFiles(name, files_);
    } else {
      files_.push(name.replace('public', 'https://crokmou.com').replace('index.html', ''));
    }
  }
  return files_;
}
let i = 0;
getFiles('public').map((file) => {
  const time = process.hrtime();
  exec('curl '  + file + ' -H \'Upgrade-Insecure-Requests: 1\' -H \'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36\' --compressed', function (error, stdout, stderr) {
    const diff = process.hrtime(time);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    console.log(i++, ": process took %d nanoseconds", diff[0] * 1e9 + diff[1]);
  });
});