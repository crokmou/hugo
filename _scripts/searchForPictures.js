'use strict';
/**
 * Search for pictures url inside files.
 */
const fs = require('fs');
const path = require("path");

const filesFolder = process.argv[2] || './_scripts/post';

const dateRegex = /---[\s\S]*?date\: ?(.*)/;
const slugRegex = /---[\s\S]*?slug\: ?(.*)/;
const allImg = /crokmou.com\/images\/(.[^\)\/]*?.(jpe?g|gif|png|bmp|JPE?G|PNG|GIF|BMP))/g;

fs.readdir(filesFolder, function(err, files) {
  files.filter(f => f !== '.DS_Store').map(file => {
    fs.readFile(path.join(filesFolder + '/' + file), 'utf-8', inspectFile);
  });
});

function inspectFile(err, content) {
  if(err) {
    console.log(err);
    return;
  }
  let m;
  const slug = ((content.match(slugRegex) || [])[1] || '').replace(/\"/g, '');
  const unParsedDate = ((content.match(dateRegex) || [])[1] || '').replace(/\"/g, '');
  const date = new Date(unParsedDate);
  const parsedDate = date.getUTCFullYear(unParsedDate) + '-' + (date.getUTCMonth(unParsedDate) + 1);
  const folder =  parsedDate + '-' + slug;
  do {
    m =  allImg.exec(content);
    if (m) {
      console.log(m[1]);
    }
  } while (m);
}

