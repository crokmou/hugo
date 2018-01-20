const fetch = require('node-fetch');
const replace = require('replace-in-file');
const semverSort = require('semver-sort');
const gitHubPath = 'crokmou/images';
const url        = 'https://api.github.com/repos/' + gitHubPath + '/tags';

fetch(url).then(function(res) {
  return res.json();
}).then(function(json) {
  const versions = Object.keys(json).map((key) => json[key].name.toLowerCase());
  const tag = semverSort.desc(versions)[0];
  console.log(tag, __dirname.replace('\/_scripts', '')+'/content/**/*.md');
  replace.sync({
    files: __dirname.replace('\/_scripts', '')+'/content/**/*.md',
    from: 'GIT_TAG',
    to: tag,
  });
});
