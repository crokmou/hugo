'use strict';

const critical = require('critical');
const penthouse = require('penthouse');
const replace = require('replace-in-file');
const fs = require('fs');

const URL = 'http://localhost:1313/';
const ASSETS = 'themes/crokmou/static/assets/';

const sections = {
  'post'            : {defaultFile: '2018/01/dorayaki-pancake-japonais-v/index.html', files: []},
  'page'            : {defaultFile: 'a-propos/index.html', files: []},
  'home'            : {defaultFile: 'index.html', files: []},
  'list'            : {defaultFile: 'carnet-de-voyage/index.html', files: []},
};

/*getFiles('public').map((file) => {
  file = file.replace('public/', '');
  if(!/.html$/.test(file)) {
    return;
  }
  switch (file) {
    case (file.match(/^[0-9{4}]/) || {}).input:
      sections['post'].files.push(file);
      break;
    case (file.match(/^(a-propos|partenariats)/) || {}).input:
      sections['page'].files.push(file);
      break;
    case (file.match(/^(index.html|pages?)/) || {}).input:
      sections['home'].files.push(file);
      break;
    default:
      sections['list'].files.push(file);
      break;
  }
});*/

(function getPenthoused() {
  Object.keys(sections).map((s) => {
    const section = sections[s];
    penthouse({
      url:  URL + section.defaultFile, // can also use file:/// protocol for local files
      css: ASSETS + 'style.css', // path to original css file on disk
    }).then(critical => {
      fs.writeFileSync(ASSETS + 'critical_'+s + '.css', critical);
    }).catch(err => {
      console.log(err);
    });
  })
})();
/*critical.generate({
  base: './public/',
  src: '2018/01/dorayaki-pancake-japonais-v/index.html',
  width: 1300,
  height: 900,
}).then(function (output) {
  console.log(output);
}).error(function (err) {
  console.log(error);
});*/


/*
  critical.generate({
    base: 'public/',
    src: section.defaultFile,
    css: ['public/assets/style.css'],
    width: 1300,
    height: 900
  }, function (err, output) {
    section.files.map((file) => {
      replace.sync({
        files: __dirname.replace('_scripts', 'public') + '/' + file,
        from: 'REPLACE_CRITICAL',
        to: output,
      });
    });
  });*/


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