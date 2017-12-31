const replace = require('replace-in-file');
const fs = require('fs');

fs.readFile(__dirname.replace('_scripts', 'public') + '/assets/critical.css', 'utf8', function (err, data) {
  replace.sync({
    files: __dirname.replace('_scripts', 'public') + '/**/*.html',
    from: 'REPLACE_CRITICAL',
    to: data,
  });
});