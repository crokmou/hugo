(function markdonify(){
  'use strict';

  const toMarkdown = require('to-markdown');
  const fs       = require('fs');
  const path     = require('path');

  const inputFile = process.argv[2];
  const outputDir = process.argv[3] || './_scripts/output/';

  const divRegex = /(<div[\s\S]*?>)([\s\S]*?)(<\/div>)/g;
  const spanRegex = /(<span[\s\S]*?>)([\s\S]*?)(<\/span>)/g;

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
    if (filename === '.DS_Store') {
      return;
    }
    fs.readFile(filepath, 'utf8', function (err, data) {

      if (err) {
        return console.log(err);
      }

      var regexThumbnail           = /---[\s\S]{1,}image: {0,}(.*\n)[\s\S]{1,}---/g.exec(data);
      var regexLayout              = /---[\s\S]{1,}layout: {0,}(.{1,}\n)[\s\S]{1,}---/g.exec(data);
      var regexTitle               = /---[\s\S]{1,}title: {0,}(.{1,}\n)[\s\S]{1,}---/g.exec(data);
      var regexDate                = /---[\s\S]{1,}date: {0,}(.*)[\s\S]{1,}---/g.exec(data);
      var regexCategories          = /---[\s\S]{1,}categories: {0,}(\n( {2,}.*\n){1,})[\s\S]{1,}---/g.exec(data);
      var regexTags                = /---[\s\S]{1,}tags: {0,}(\n( {2,}.*\n){1,})[\s\S]{1,}---/g.exec(data);
      var regexIngredient_qty      = /---[\s\S]{1,}wpcf-ingredient_qty: {0,}(\n( {2,}.*\n){1,})[\s\S]{1,}---/g.exec(data);
      var regexIngredient_temps    = /---[\s\S]{1,}wpcf-ingredient_temps: {0,}(\n( {2,}.*\n){1,})[\s\S]{1,}---/g.exec(data);
      var regexIngredient_textarea = /---[\s\S]{1,}wpcf-ingredient-textarea: {0,}(\n( {2,}.*\n){1,})[\s\S]{1,}---/g.exec(data);
      var regexDisqusId            = /---[\s\S]{1,}dsq_thread_id:\n {0,}- "(.{0,})"\n{0,}[\s\S]{1,}---/g.exec(data);

      var frontMatter = {
        type               : regexLayout && regexLayout[1],
        title              : regexTitle && regexTitle[1],
        date               : regexDate && regexDate[1],
        thumbnail          : regexThumbnail && regexThumbnail[1],
        categories         : regexCategories && regexCategories[1],
        tags               : regexTags && regexTags[1],
        ingredient_qty     : regexIngredient_qty && regexIngredient_qty[1],
        ingredient_temps   : regexIngredient_temps && regexIngredient_temps[1],
        ingredient_textarea: regexIngredient_textarea &&
        regexIngredient_textarea[1],
        disqusId           : regexDisqusId && regexDisqusId[1],
      };

      var newFrontMatter = frontMatterStr(frontMatter);
      var html = toMarkdown(/(---)[\s\S]*?(---\n)([\s\S]{0,})/g.exec(data)[3]).replace(divRegex, '$2').replace(divRegex, '$2').replace(spanRegex, '$2').replace(spanRegex, '$2');

      if (fs.existsSync(outputDir) || fs.mkdirSync(outputDir)) {
        fs.writeFileSync(path.join(outputDir, (filename.replace('.html', '.md'))), (newFrontMatter + '' + html));
      }
    });
  }

  function frontMatterStr(obj) {
    var str = '';

    var array = Object.keys(obj).map(front => {
      if(obj[front]) {
        switch(front) {
          case 'ingredient_textarea':
            var html = obj[front].replace(divRegex, '$2').replace(spanRegex, '$2');
            var replaced = toMarkdown(html)
              .replace(/\\r\\n \\r\\n\n/g, '')
              .replace(/\\r\\n\\r\\n/g, '\n')
              .replace(/\n\*/g, '*')
              .replace(/\n\s*\n/g, '\n')
              .replace(/\*   /g,'* ')
              .replace(/\* /g, '> * ')
              .replace(/(> \* \*\*)(.{0,})\*\*/g, '> ## $2\n> ')
              .replace(/ {2,}/g, '')
              .replace(/"([\s\S]{0,})"/g, '$1')
              .replace(/\n/g, '\n  ')
              .replace(/(^\s*\n){2,}/gm, '$1');
            return front + ": |\n  " + replaced + "\n";
           break;
          case 'date':
            return front + ": " + obj[front] + '\n';
            break;
          default:
            return front + ": " + obj[front];
            break;
        }
      } else { return ''; }
    });

    array.forEach(item => str += item);
    return '---\n' + str + '\n---\n\n';
  }

})();