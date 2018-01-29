module.exports = {
  staticFileGlobs: [
    'public/assets/**/*'
  ],
  root: 'public/',
  runtimeCaching: [{
    urlPattern: /^https:\/\/cdn.rawgit.com\/crokmou\/images\//,
    handler: 'fastest'
  }, {
    urlPattern: /^https:\/\/crokmou.com\//,
    handler: 'networkFirst'
  }]
};