const fs = require('fs');
const path = require("path");

const filesFolder = process.argv[2];

const imgRegex = /([a-z]|\/)(.(?! |,|\)|\(|"|'))*(\.(jpe?g|png|gif|bmp))/gi;

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
      m =  imgRegex.exec(content);
      if (m) {
        console.log(m[0]);
      }
    } while (m);
}

