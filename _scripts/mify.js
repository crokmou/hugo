/**
 * eg: node ./_scripts/mify.js ./_scripts/export_folder
 */
(function markdonify(){
  'use strict';

  const toMarkdown = require('to-markdown');
  const fs       = require('fs');
  const path     = require('path');

  const inputFile = process.argv[2];
  const outputDir = process.argv[3] || './_scripts/output/';

  const divRegex = /(<div[\s\S]*?>)([\s\S]*?)(<\/div>)/g;
  const spanRegex = /(<span[\s\S]*?>)([\s\S]*?)(<\/span>)/g;
  const lineBreaksRegex = /\n\s*\n\s*\n/g;

  fs.stat(inputFile, function (err, stat) {
    //console.log('Is directory, walking all files');
    fs.readdir(inputFile, function (err, files) {
      for (let i = 0; i < files.length; i++) {
        const file     = files[i],
              filepath = path.join(inputFile, file);
        //console.log('reading file', filepath);
        readFile(filepath, file);
      }
    })
  });

  function readFile(filepath, filename) {
    console.log(filename);
    if (filename === '.DS_Store') {
      return;
    }
    fs.readFile(filepath, 'utf8', function (err, data) {

      if (err) {
        return console.log(err);
      }

      const html = replaceWeirdos(/((---)[\s\S]*?(---\n))/g.exec(data)[1]) + '\n' + replaceWeirdos(toMarkdown(/(---)[\s\S]*?(---\n)([\s\S]{0,})/g
      .exec(data)[3])
      .replace(divRegex, '$2')
      .replace(divRegex, '$2')
      .replace(spanRegex, '$2')
      .replace(spanRegex, '$2')
      .replace(lineBreaksRegex, '\n\n'));

      if (fs.existsSync(outputDir) || fs.mkdirSync(outputDir)) {
        fs.writeFileSync(path.join(outputDir, filename), (html));
      }
    });
  }

  function replaceWeirdos(str) {
    return str && str.replace(/&#8211;/g, '–')
    .replace(/&#038;/g, '&')
    .replace(/&#8230;/g, '…')
    .replace(/â/g, 'â')
    .replace(/ê/g, 'ê')
    .replace(/î/g, 'î')
    .replace(/ï/g, 'ï')
    .replace(/ô/g, 'ô')
    .replace(/û/g, 'û')
    .replace(/à/g, 'à')
    .replace(/é/g, 'é')
    .replace(/è/g, 'è')
    .replace(/&rsquo;/g, '\'')
  }

})();