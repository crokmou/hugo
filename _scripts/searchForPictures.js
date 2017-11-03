/**
 * Search for pictures url inside files.
 */
const fs = require('fs');
const path = require("path");

const filesFolder = process.argv[2];

const imgRegex = /([a-z]|\/)(.(?! |,|\)|\(|"|'))*(\.(jpe?g|png|gif|bmp))/gi;
const imgRegexMd = /([^\[])\!\[(.*?)\]\(([^\n)]*?\.(png|gif|jpg|jpeg))\)/gi;
const regexImg = /{{< img src="(.*?)"/gi;

fs.readdir(filesFolder, function(err, files) {
  files
  .filter(function(file) { return file.substr(-3) === '.md'; })
  .forEach(function(file) {
    fs.readFile(path.join(filesFolder, file), 'utf-8', function(err, contents) {
      inspectFile(contents);
    });
  });
});

function inspectFile(content) {
    var m;
    do {
      m =  regexImg.exec(content);
      if (m) {
        console.log(m[1].replace(/.*?([^\/]*$)/g, '$1'));
      }
    } while (m);
}

