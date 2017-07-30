(function THUMBNAIL(){
  'use strickt';

  const fs       = require('fs');
  const path     = require('path');

  const inputFile = process.argv[2];
  const outputDir = process.argv[3] || '_posts/';

  const linkAndguidRegex = /<item>[\s\S]*?<link.{0,}>(.+?)<\/link>[\s\S]*?<guid.{0,}>(.+?.jpg)<\/guid>[\s\S]*?<wp:post_date>.{1,}\[(.{10}).{1,}<\/wp:post_date>[\s\S]*?<\/item>/g;
  const titleRegex = /http:\/\/www\.crokmou\.com(\/.*?\/.*?\/)(.{1,})/g;
  const thumbnailRegex = /http:\/\/www\.crokmou\.com\/wp-content\/uploads(\/.*?\/.*?\/.{1,})/g;

  fs.stat(inputFile, function (err, stat) {
    fs.readFile(inputFile, 'utf8', function (err, data) {
      const matches = [];
      let match = linkAndguidRegex.exec(data);
      while (match != null) {
        const file = titleRegex.exec(match[1]);
        const thumbnail = thumbnailRegex.exec(match[2]);
        if(file && file.length && thumbnail && thumbnail.length) {
          const link = file[2].split('/')[0];
          matches.push({link: match[3] + '-' + link, thumbnail: ('/assets/images/upload/'+thumbnail[1])});
        }
        match = linkAndguidRegex.exec(data);
      }
      if (fs.existsSync(outputDir) || fs.mkdirSync(outputDir)) {
        fs.writeFile(path.join(outputDir, "output.json"), JSON.stringify(matches));
      }
    });
  });
})()