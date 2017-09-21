const Readable = require('stream').Readable;
const Vinyl = require('vinyl');
const fs = require('fs');
const path = require('path');
const vfs = require('vinyl-fs');

// This is pretty straightforward at the mo...
class Builder extends Readable {
  constructor(src, plugins) {
    // Readable stream to make output gulp-compatible
    super({ objectMode: true, read: () => {} });

    this.src = src;
    this.plugins = plugins || (x => x);
  }

  entry(entry) {
    // Read file as Vinyl object
    let file = new Vinyl({
      path: entry,
      contents: fs.readFileSync(path.join(this.src, entry))
    });

    // Transform file using plugins
    return Promise.resolve(this.plugins(file)).then(file => {
      // Push to stream
      this.push(file);

      // Return to anyone concerned
      return file;
    });
  }
}

module.exports = Builder;

module.exports.dest = vfs.dest;
