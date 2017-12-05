const fetch = require('node-fetch');
const replace = require('replace-in-file');
const gitHubPath = 'crokmou/images';
const url        = 'https://api.github.com/repos/' + gitHubPath + '/tags';

fetch(url).then(function(res) {
  return res.json();
}).then(function(json) {
  const versions = json.sort(function (a, b) {
    const nameA = a.name.toUpperCase().replace('V', ''); // ignore upper and lowercase
    const nameB = b.name.toUpperCase().replace('V', ''); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  const tag = versions[versions.length - 1].name.replace('v', '');
  replace.sync({
    files: __dirname.replace('\/_scripts', '')+'/content/**/*.md',
    from: 'GIT_TAG',
    to: tag,
  });
});