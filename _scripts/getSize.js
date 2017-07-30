/**
 * It will return a percentage value for a padding bottom image. You need to
 * pass a file path after the command line to make it work
 * e.g: node getSize /folder/sub-folder/images/my-image.jpg
 */
const sizeOf = require('image-size');

const inputFile = process.argv[2];

if(!inputFile) {
  console.error('You need an image path...');
  return;
}
const dimensions = sizeOf(inputFile);

console.log('Just paste or copy it from here.. ' + getSize(dimensions));

function getSize(dimensions) {
  const paddingBottom = (dimensions.height / (dimensions.width / 100)).toFixed(2) +'%';
  pbcopy(paddingBottom);
  return paddingBottom;
}

function pbcopy(data) {
  const proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(data); proc.stdin.end();
}