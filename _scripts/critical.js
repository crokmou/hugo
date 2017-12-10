const penthouse = require('penthouse');
const fs = require('fs');
const path = require('path');
/*

critical.generate({
  base: path.resolve('./public'),
  css: [path.resolve('./public', 'assets/style.css')],
  src: 'index.html',
  dest: 'assets/critical.css',
  include: ['header__ss-nav', 'header__nav', 'header__ss', 'header__ss__search'],
  dimensions: [{
    width: 1024,
    height: 768
  }, {
    width: 1280,
    height: 670
  }]
});
*/
penthouse({
  url: 'file:///'+path.resolve('./public', 'index.html'),       // can also use file:/// protocol for local files
  css: path.resolve('./public', 'assets/style.css'),      // path to original css file on disk
  strict:true
})
.then(criticalCss => {
  // use the critical css
  fs.writeFileSync(path.resolve('./public', 'assets/critical.css'), criticalCss);
})
.catch(err => {
  console.log(err);
  // handle the error
})