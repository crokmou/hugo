const fs            = require('fs');
const _             = require('underscore');
const dotenv        = require('dotenv').config();
const path          = require('path');
const algoliasearch = require('algoliasearch');
const yaml          = require('yamljs');

const filesFolder = './content';
const fileToIndex = process.argv[2];
const api_key     = process.env.CROKMOU_CONF_ALGOLIA_ADMIN_KEY ||
    dotenv.parsed.CROKMOU_CONF_ALGOLIA_ADMIN_KEY;
const app_id      = process.env.CROKMOU_CONF_ALGOLIA_ID ||
    dotenv.parsed.CROKMOU_CONF_ALGOLIA_ADMIN_KEY;
const client      = algoliasearch(app_id, api_key);
const algolia     = client.initIndex('blog');
const diff        = require('deep-diff');

let json = [];

const yamlRegex = /---([\s\S]*?)---\n/;

fs.readdir(filesFolder, function(err, folder) {
  folder       = folder.filter(f => f !== '.DS_Store');
  let nbFolder = folder.length;
  folder.filter(f => f !== '.DS_Store').map(f => {
    'use strict';
    fs.readdir(__dirname.replace('_scripts/algolia', 'content') + '/' + f,
        function(err, files) {
          files = files.filter((file) =>
              file.substr(-3) === '.md' && !/index/.test(file) &&
              (!fileToIndex || file === fileToIndex)
          );
          if (!files.length) {
            nbFolder -= 1;
            return;
          }
          files.forEach(function(file, idx) {
            const filePath = path.join(__dirname.replace('_scripts/algolia',
                'content') + '/' + f, file);
            fs.readFile(filePath, 'utf-8', function(err, contents) {
              if (idx >= files.length - 1 && nbFolder >= 0) {
                nbFolder -= 1;
              }
              json.push(inspectFile(contents, f, file));
              if (!nbFolder) {
                const browser = algolia.browseAll();
                browser.on('result', (result) => {
                  let oldContent = _.sortBy(result.hits, 'objectID');
                  let newContent = _.sortBy(json, 'objectID');

                  const deletedContent = [];
                  const addedContent   = [];

                  const arrayOfOldContentIds = oldContent.map(
                      (item) => item.objectID);
                  const arrayOfNewContentIds = newContent.map(
                      (item) => item.objectID);

                  if (oldContent.length !== newContent.length) {
                    arrayOfOldContentIds.diff(arrayOfNewContentIds).
                    map((item) => {
                      deletedContent.push(
                          oldContent.filter((c) => c.objectID === item)[0]);
                    });
                    arrayOfNewContentIds.diff(arrayOfOldContentIds).
                    map((item) => {
                      addedContent.push(
                          newContent.filter((c) => c.objectID === item)[0]);
                    });
                    newContent = filterLengthJson(newContent, addedContent,
                        deletedContent);
                    oldContent = filterLengthJson(oldContent, addedContent,
                        deletedContent);
                  }

                  algolia.deleteObjects(deletedContent.map((j) => j.objectID),
                      function(err) {
                        if (err) {
                          throw new Error(err);
                        }
                        console.log('Removed object: ' + JSON.stringify(deletedContent));
                        algolia.addObjects(addedContent, (err) => {
                          if (err) {
                            throw new Error(err);
                          }
                          console.log('Added object: ' + JSON.stringify(addedContent));
                          const objectsToUpdate = [];
                          diff.observableDiff(oldContent, newContent,
                              function(d) {
                                const index    = d.kind !== 'A'
                                    ? d.path[0]
                                    : d.index;
                                const diffItem = newContent[index];
                                if (objectsToUpdate.filter(
                                        (item) => item.objectID ===
                                            diffItem.objectID).length > 0) {
                                  return;
                                }
                                objectsToUpdate.push(diffItem);
                              });
                          if (objectsToUpdate.length) {
                            console.log('Updated object: ' + JSON.stringify(objectsToUpdate));
                            algolia.saveObjects(objectsToUpdate);
                          }
                        });
                      });

                });
              }
            });
          });
        });
  });
});

function filterLengthJson(json, addedJson, deletedJson) {
  return json.filter((c) => {
    const isNotAdded   = !~addedJson.map(j => j.objectID).indexOf(c.objectID);
    const isNotDeleted = !~deletedJson.map(j => j.objectID).indexOf(c.objectID);
    return isNotAdded && isNotDeleted;
  });
}

function inspectFile(content, folderName, fileName) {
  const yml          = yaml.parse(((content.match(yamlRegex) || [])[1] || ''));
  const thumbnail    = yml.thumbnail || '';
  const slug         = yml.slug || (/[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}-(.*).md/.exec(fileName) || [])[1];
  const objectID     = slug;
  const unParsedDate = yml.date;
  const date         = new Date(unParsedDate);
  const month        = (date.getUTCMonth(unParsedDate) + 1);
  const parsedDate   = date.getUTCFullYear(unParsedDate) + '/' +
      (month < 10 ? '0' : '') + month;
  const uri          = (unParsedDate ? ('/' + parsedDate + '/') : '/') + slug;

  if (yml.slug) {
    delete yml.slug;
  }
  return ({
    ...yml,
    objectID,
    section  : folderName,
    thumbnail: thumbnail.split('/')[thumbnail.split('/').length - 1],
    uri,
  });
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};