/**
 * Search for pictures url inside files.
 */
const fs = require('fs');
const path = require("path");

const filesFolder = process.argv[2];

const imgRegex = /([a-z]|\/)(.(?! |,|\)|\(|"|'))*(\.(jpe?g|png|gif|bmp))/gi;
const imgRegexMd = /([^\[])\!\[(.*?)\]\(([^\n)]*?\.(png|gif|jpe?g|bmp|PNG|GIF|JPE?G|BMP))\)/gi;
const dateRegex = /---[\s\S]*?date\: ?(.*)/;
const slugRegex = /---[\s\S]*?slug\: ?(.*)/;
const allImg = /crokmou.com\/images\/(.[^\)\/]*?.(jpe?g|gif|png|bmp|JPE?G|PNG|GIF|BMP))/g;
const regexImg = /{{< img src="(.*?)"/gi;

fs.readdir(filesFolder, function(err, folder) {
  folder.filter(f => f !== '.DS_Store').map(f => {
    'use strict';
    fs.readdir(__dirname.replace('_scripts', 'content') + '/' + f, function(err, files) {
      files.filter(function(file) { return file.substr(-3) === '.md'; }).
      forEach(function(file) {
        fs.readFile(path.join(__dirname.replace('_scripts', 'content') + '/' + f, file), 'utf-8',
            function(err, contents) {
              inspectFile(contents);
            });
      });
    })
  });
});

function inspectFile(content) {
    let m;
    const slug = ((content.match(slugRegex) || [])[1] || '').replace(/\"/g, '');
    const unParsedDate = ((content.match(dateRegex) || [])[1] || '').replace(/\"/g, '');
    const date = new Date(unParsedDate);
    const parsedDate = date.getUTCFullYear(unParsedDate) + '-' + (date.getUTCMonth(unParsedDate) + 1);
    const folder =  parsedDate + '-' + slug;
    do {
      m =  allImg.exec(content);
      if (m) {
        console.log(folder + '/' + m[1]);
      }
    } while (m);
}

