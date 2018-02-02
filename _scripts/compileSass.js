const sass = require('node-sass');
const fs = require('fs');

const filesToRender = ['style', 'print'];

filesToRender.map((f) => {
  'use strict';
  const file = process.cwd() + '/themes/crokmou/static-src/assets/scss/'+f+'.scss';
  const outFile = process.cwd() + '/themes/crokmou/static/assets/'+f+'.css';
  const result = sass.renderSync({
    file,
    outputStyle: 'compressed',
    outFile,
  });
  if(result.css) {
    fs.writeFile(outFile, result.css, (error) => { error && console.log(error); });
  }
});

console.log(process.cwd() + '/themes/crokmou/static/assets/');