const fs    = require('fs');
const uncss = require('uncss');

const files   = ['public/index.html'];
const options = {
  csspath     : '../public/assets/',
  stylesheets : ['list.css'],
  ignoreSheets: [/fonts.googleapis/],
  ignore      : [/global-search.*?/, /aa-.*?/],
  timeout     : 1000,
  htmlroot    : 'public',
  banner      : false,
  userAgent   : 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)',
};

uncss(files, options, function(error, output) {
  if (error) {
    throw new Error(error);
  }
  fs.writeFileSync('public/assets/list.css', output);
});