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
      var regexPermalink           = /---[\s\S]{1,}permalink: {0,}(.{1,})\n[\s\S]{1,}---/g.exec(data);

      const permalink = (regexPermalink && regexPermalink[1]);
      const slug = permalink.split('/')[permalink.split('/').length-1];
      const fileName = (regexDate && regexDate[1]).split('T')[0] + '-' + slug + '.md';

      const title = regexTitle && regexTitle[1];

      const frontMatter = {
        type               : replaceWeirdos(regexLayout && regexLayout[1]),
        title              : replaceWeirdos(title).replace(/'(.*\'.*?)'/g, '"$1"'),
        date               : replaceWeirdos(regexDate && regexDate[1]),
        thumbnail          : replaceWeirdos(regexThumbnail && regexThumbnail[1]),
        categories         : replaceWeirdos(regexCategories && regexCategories[1]),
        tags               : replaceWeirdos(regexTags && regexTags[1]),
        ingredient_qty     : replaceWeirdos(regexIngredient_qty && regexIngredient_qty[1]),
        ingredient_temps   : replaceWeirdos(regexIngredient_temps && regexIngredient_temps[1]),
        ingredient_textarea: replaceWeirdos(regexIngredient_textarea &&
        regexIngredient_textarea[1]),
        disqusId           : replaceWeirdos(regexDisqusId && regexDisqusId[1] + '\n'),
        slug: replaceWeirdos(slug),
      };

      var newFrontMatter = frontMatterStr(frontMatter);
      var html = replaceWeirdos(toMarkdown(/(---)[\s\S]*?(---\n)([\s\S]{0,})/g
      .exec(data)[3])
      .replace(divRegex, '$2')
      .replace(divRegex, '$2')
      .replace(spanRegex, '$2')
      .replace(spanRegex, '$2')
      .replace(lineBreaksRegex, '\n\n'));

      if (fs.existsSync(outputDir) || fs.mkdirSync(outputDir)) {
        fs.writeFileSync(path.join(outputDir, fileName), (newFrontMatter + '' + html));
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
    .replace(/ô/g, 'ô')
    .replace(/û/g, 'û')
    .replace(/à/g, 'à')
    .replace(/é/g, 'é')
    .replace(/è/g, 'è')
    .replace(/&rsquo;/g, '\'')
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