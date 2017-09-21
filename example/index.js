const Builder = require('../builder');
const path = require('path');
const vfs = require('vinyl-fs');

const builder = new Builder(path.join(__dirname, 'src'), file => file);

builder.entry('index.html');

builder.pipe(vfs.dest(path.join(__dirname, 'dist')));
