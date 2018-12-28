'use strict';

const penthouse = require('penthouse');
const fs = require('fs');

const URL = 'http://localhost:1313/';
const ASSETS = 'themes/crokmou/static/assets/';

const sections = {
  'post'            : {defaultFile: '2013/10/comtesse-du-barry-blanquette-veau/index.html', files: []},
  'page'            : {defaultFile: 'a-propos/index.html', files: []},
  'home'            : {defaultFile: 'index.html', files: []},
  'list'            : {defaultFile: 'carnet-de-voyage/index.html', files: []},
};

(function getPenthoused() {
  Object.keys(sections).map((s) => {
    const section = sections[s];
    penthouse({
      url:  URL + section.defaultFile, // can also use file:/// protocol for local files
      css: ASSETS + (/home|list/.test(s) ? 'list.css' : 'single.css'), // path to original css file on disk
    }).then(critical => {
      fs.writeFileSync(ASSETS + 'critical_'+s + '.css', critical);
    }).catch(err => {
      console.log(err);
    });
  })
})();
