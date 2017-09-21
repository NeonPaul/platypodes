const postcss = require('postcss');

// PostCSS plugin
module.exports = file =>
  postcss([]).process(String(file.contents)).then(result => {
    file.contents = new Buffer(result.css);
    file.path = file.path.replace(/\.scss$/, '.css');
    return file;
  });
