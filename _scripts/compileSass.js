const sass = require('node-sass');
const path = require('path');
const fs = require('fs');

const filesToRender = ['style', 'print', 'critical'];

filesToRender.map((f) => {
  'use strict';
  const file = path.resolve('./themes', 'crokmou/static-src/assets/scss/'+f+'.scss');
  const outFile = path.resolve('./themes', 'crokmou/static/assets/'+f+'.css');
  sass.render({
    file,
    outputStyle: 'compressed',
    outFile,
  }, function(err, result) {
    if(!err){
      fs.writeFile(outFile, result.css);
    }
  });
});