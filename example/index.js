const Builder = require('../builder');
const path = require('path');
const vfs = require('vinyl-fs');

const builder = new Builder(path.join(__dirname, 'src'), function(file) {
  if (file.path.match(/\.html$/)) {
    const c = String(file.contents);
    const m = c.match(/href="([^"]+)"/);

    return this.entry(m[1]).then(linkedFile => {
      file.contents = new Buffer(c.replace(m[1], linkedFile.path));
      return file;
    });
  }

  if (file.path.match(/\.mycss$/)) {
    file.contents = new Buffer(
      String(file.contents).replace(
        'paint_it_black;',
        'background:black; color: white;'
      )
    );
    file.path = file.path.replace(/\.mycss$/, '.css');

    return file;
  }
});

builder.entry('index.html');

builder.pipe(vfs.dest(path.join(__dirname, 'dist')));
