// JSON_PICTURES_LIST = local list only;
const JSON_PICTURES_LIST = '';
const pictures = JSON_PICTURES_LIST;

const fs       = require('fs');
const path     = require('path');

const inputFile = process.argv[2];
const outputDir = process.argv[3] || 'posts_with_new_url/';

const idRegex = /.{1,}(_.{6})/g;
const imgRegex = /([a-z]|\/)(.(?! |,|\)|\(|"|'))*(\.(jpe?g|png|gif|bmp))/gi;


fs.readdir(inputFile, function (err, files) {
  'use strict';
  for (let i = 0; i < files.length; i++) {
    const fileName     = files[i],
          filepath = path.join(inputFile, fileName);
    fs.readFile(filepath, 'utf8', function (err, data) {
      let content = '';
      pictures.resources.map(pic => {
        const id = pic.public_id.replace(idRegex, '$1');
        const url = pic.secure_url;
        content = searchForIterations(id, url, content || data, fileName);
      });
    });
  }
});

function searchForIterations(id, url, data, fileName) {
  'use strict';
    let content = data;
    let matches = [];
    let images = imgRegex.exec(content);
    while (images != null) {
      if(images[0].indexOf(id + '.') >= 0) {
        matches.push(images[0]);
      }
      images = imgRegex.exec(content);
    }
    matches.map(match => {
      content = replaceAll(content, match, url);
    });
    if (fs.existsSync(path.join(__dirname, outputDir)) || fs.mkdirSync(path.join(__dirname, outputDir))) {
      fs.writeFileSync(path.join(__dirname, outputDir, fileName), content);
    }
    return content;
}
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}