# Platypodes

`npm install --save-dev platypodes`

A build tool, very early in development.

Platypodes transforms directories. You have to give it 3 things:
 - A source directory: the subtree where all your source code lives
 - One or more entry files (relative to src dir)
 - A loader/transformation function - to compile/transpile your code and resolve
   inter-file dependencies

Platypodes outputs a Vinyl stream, so you can feed the output to any gulp
plugin, or you can let your loader function to all the hard work and just
pipe the output to a destination directory.

## Example

```javascript
const path = require('path')
const Platypodes = require('platypodes');

const builder = new Platypodes(
  // Add a source directory
  path.join(__dirname, 'src'),

  // A loader, or file transformation function
  function (file /* vinyl file */) {

    // Filter by file extension
    if (file.path.match(/\.html$/)) {
      const contents = String(file.contents)

      // Look for linked dependencies (this is naïve for demo purposes)
      const img = contents.match(/<img href="(.+)">/)[1]

      // Add the file to the output stream
      return this.entry(img).then(
        newImg => {
          // The file contents or filename may have been transformed by
          // another part of the loader function - so get the new name and
          // replace old references.
          file.contents = new Buffer(contents.replace(img, newImg.path))
          return file;
        }
      )
    }

    // Return the file unprocessed if no loaders match
    return file;
  }
)

// Add a couple of entries - linked images will be automatically included
// by the loader.
builder.entry('index.html')
builder.entry('page1.html')

// Pipe all built files to the dist directory
builder.pipe(
  // The dest function is the same one gulp uses
  Platypodes.dest(
    path.join(__dirname, 'dist')
  )
)
```

## Loader function

The loader function is pretty dumb by default because I want people to be able
to write their own abstractions for it. You may like to use a webpack-style
config object, gulp-style stream, or something completely different.

I hope to come up with my own system with plugins for common things like
js and css transpilation, but I'm not exactly sure yet what form this system
will take - it will likely be trial and error.


## Contribute

If you see something you like in this fledgeling project I'd love to get some
more people working on it with me. Even if you just have thoughts on API or
design, please drop me a message or open an issue/PR!
