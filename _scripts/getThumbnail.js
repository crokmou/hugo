(function THUMBNAIL(){
  'use strickt';

  const fs       = require('fs');
  const path     = require('path');

  const inputFile = process.argv[2] || './_scripts/output/';

  const thumbnailRegex = /---[\s\S]*?thumbnail: {0,}(.*?\.(jpg|bmp|gif|png))[\s\S]*?---/gi;

  fs.readdir(inputFile, function (err, files) {
    'use strict';
    for (let i = 0; i < files.length; i++) {
      const fileName     = files[i],
            filepath = path.join(inputFile, fileName);
      fs.readFile(filepath, 'utf8', function (err, data) {
        searchForIterations(data);
      });
    }
  });

  function searchForIterations(data) {
    'use strict';
    let match = thumbnailRegex.exec(data);
    while (match != null) {
      const file = match[1].split('/')[match[1].split('/').length - 1];
      console.log(file);
      match = thumbnailRegex.exec(data);
    }
  }
})();