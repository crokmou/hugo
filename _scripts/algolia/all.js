const fs = require('fs');
const _ = require('underscore');
const dotenv = require('dotenv').config();
const path = require("path");
const algoliasearch = require('algoliasearch');
const yaml = require('yamljs');

const filesFolder = './content';
const fileToIndex = process.argv[2];
const api_key = dotenv.parsed.CROKMOU_CONF_ALGOLIA_API_KEY;
const app_id = dotenv.parsed.CROKMOU_CONF_ALGOLIA_ID;
const client = algoliasearch(app_id, api_key);
const index = client.initIndex('blog');
const observableDiff = require('deep-diff').observableDiff;

let json = [];

const yamlRegex = /---([\s\S]*?)---\n/;

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
          json.push(inspectFile(contents, f));
          if(!nbFolder) {
            fs.readFile(path.join(__dirname, 'all.json'), 'utf-8', function(err, backup) {
              const newJson = [];
              const deletedJSon = [];
              let content = _.sortBy(JSON.parse(backup), 'objectID');
              json = _.sortBy(json, 'objectID');

              const arrayOfContentIds = content.map((item) => item.objectID);
              const arrayOfJsonIds = json.map((item) => item.objectID);

              if(content.length !== json.length) {
                arrayOfContentIds.diff(arrayOfJsonIds).map((item) => {
                  deletedJSon.push(content.filter((c) => c.objectID === item)[0]);
                  content = content.filter((c) => c.objectID !== item);
                });
              }

              observableDiff(content, json, function (d) {
                const index = d.kind !== 'A' ? d.path[0] : d.index;
                const jsonItem = json[index];
                if(newJson.filter((item) => item.objectID === jsonItem.objectID).length > 0) {
                  return;
                }
                newJson.push(jsonItem);
              });
              if (fs.existsSync('./_scripts/algolia/') || fs.mkdirSync('./_scripts/algolia/')) {
                fs.writeFileSync(path.join('./_scripts/algolia/', 'all.json'), (JSON.stringify(json)));
              }
              if(newJson.length) {
                index.addObjects(newJson);
              }
            });
          }
        });
      });
    })
  });
});

function inspectFile(content, folderName) {
  const yml = yaml.parse(((content.match(yamlRegex) || [])[1] || ''));
  const thumbnail = yml.thumbnail || '';
  const slug = yml.slug || '';
  const objectID = slug;
  const unParsedDate = yml.date;
  const date = new Date(unParsedDate);
  const month = (date.getUTCMonth(unParsedDate) + 1);
  const parsedDate = date.getUTCFullYear(unParsedDate) + '/' + (month < 10 ? '0' : '') + month;
  const uri =  (unParsedDate ? ('/' + parsedDate + '/') : '/') + slug;

  if(yml.slug) {
    delete yml.slug;
  }
  return ({...yml, objectID, section: folderName, thumbnail: thumbnail.split('/')[thumbnail.split('/').length - 1], uri})
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};