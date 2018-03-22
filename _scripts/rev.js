const Version = require("node-version-assets");
const dir = __dirname.replace('_scripts', 'public');

const cssAndJsVersioning = new Version({
  assets: [dir+'/assets/list.css', dir+'/assets/print.css', dir+'/assets/single.css', dir+'/assets/app.js'],
  grepFiles: [dir+'/**/*.html']
});
cssAndJsVersioning.run(() => {
  const serviceWorkerVersioning = new Version({
    assets: [dir+'/service-worker.js'],
    grepFiles: [dir+'/assets/*.js']
  });
  serviceWorkerVersioning.run();
});