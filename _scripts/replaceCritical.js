'use strict';
const replace = require('replace-in-file');
const fs = require('fs');

const criticals = {
  'post': '',
  'page': '',
  'home': '',
  'list': '',
};

Object.keys(criticals).map(c => {
  criticals[c] = fs.readFileSync(__dirname.replace('_scripts', '') + 'themes/crokmou/static/assets/critical_' + c + '.css', 'utf8');
});


getFiles('public').map((file) => {
  file = file.replace('public/', '');
  if(!/.html$/.test(file)) {
    return;
  }
  switch (file) {
    case (file.match(/^[0-9{4}]/) || {}).input:
      replaceCss(file, 'post');
      break;
    case (file.match(/^(a-propos|partenariats)/) || {}).input:
      replaceCss(file, 'page');
      break;
    case (file.match(/^(index.html|page)/) || {}).input:
      replaceCss(file, 'home');
      break;
    default:
      replaceCss(file, 'list');
      break;
  }
});

function replaceCss(file, css) {
  replace.sync({
    files: __dirname.replace('_scripts', 'public') + '/' + file,
    from: 'REPLACE_CRITICAL',
    to: criticals[css],
  });
}

function getFiles (dir, files_){
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files){
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}