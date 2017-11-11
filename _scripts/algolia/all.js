const fs = require('fs');
const dotenv = require('dotenv').config();
const path = require("path");
const removeMd = require('remove-markdown');
const algoliasearch = require('algoliasearch');

const filesFolder = './content';
const fileToIndex = process.argv[2];
const api_key = dotenv.parsed.ALGOLIA_API_KEY;
const app_id = dotenv.parsed.ALGOLIA_ID;
const client = algoliasearch(app_id, api_key);
const index = client.initIndex('blog');

const json = [];

const descRegex = /---[\s\S]*?description\: ?(.*)/;
const titleRegex = /---[\s\S]*?title\: ?(.*)/;
const thumbnailRegex = /---[\s\S]*?thumbnail\: ?(.*)/;
const slugRegex = /---[\s\S]*?slug\: ?(.*)/;
const dateRegex = /---[\s\S]*?date\: ?(.*)/;
const contentRegex = /---[\s\S]*?---([\s\S]*)/;

fs.readdir(filesFolder, function(err, folder) {
  folder = folder.filter(f => f !== '.DS_Store');
  let nbFolder = folder.length;
  folder.filter(f => f !== '.DS_Store').map(f => {
    'use strict';
    fs.readdir(__dirname.replace('_scripts/algolia', 'content') + '/' + f, function(err, files) {
      files = files.filter((file) =>
        file.substr(-3) === '.md' && !/index/.test(file) && (!fileToIndex || file === fileToIndex)
      );
      if(!files.length) {
        nbFolder -= 1;
        return;
      }
      files.forEach(function (file, idx) {
        const filePath = path.join(__dirname.replace('_scripts/algolia', 'content') + '/' + f, file);
        fs.readFile(filePath, 'utf-8', function(err, contents) {
          if(idx >= files.length - 1 && nbFolder >= 0) {
            nbFolder -= 1;
          }
          json.push(inspectFile(contents));
          if(!nbFolder) {
            index.addObjects(JSON.parse(JSON.stringify(json)), function(err, content) {
            });
          }
        });
      });
    })
  });
});

function inspectFile(content) {
  const body = removeMd(((content.match(contentRegex) || [])[1] || '').replace(/\"/g, '')).replace(/\{\{\}\}/g, '').replace(/\n/g, '');
  const title = ((content.match(titleRegex) || [])[1] || '').replace(/\"/g, '');
  const description = ((content.match(descRegex) || [])[1] || '').replace(/\"/g, '');
  const thumbnail = ((content.match(thumbnailRegex) || [])[1] || '').replace(/\"/g, '');

  const slug = ((content.match(slugRegex) || [])[1] || '').replace(/\"/g, '');
  const objectID = slug;
  const unParsedDate = ((content.match(dateRegex) || [])[1] || '').replace(/\"/g, '');
  const date = new Date(unParsedDate);
  const month = (date.getUTCMonth(unParsedDate) + 1);
  const parsedDate = date.getUTCFullYear(unParsedDate) + '/' + (month < 10 ? '0' : '') + month;

  const uri =  '/' + parsedDate + '/' + slug;

  return ({objectID, title, description, thumbnail: thumbnail.split('/')[thumbnail.split('/').length - 1], uri, content: body})
}

