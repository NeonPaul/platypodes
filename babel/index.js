const babel = require('babel-core');

// This is the babel config for loading javascript files
module.exports =
  // This is the function to transform the file
  // Args: vinyl file and builder instance
  (file, builder) => {
    // Pass it on to babel
    const src = babel.transform(String(file.contents), {
      plugins: [
        // This is our special loader for intercepting `require` calls
        require('./loader')(
          // It takes 2 functions:
          // - One to pull in a file and return its output path
          src => builder.entry(src).then(f => f.path),
          // - One to pull in a file and return its contents
          src => builder.entry(src).then(f => String(f.contents))
        )
        // Add more generic babel plugins here
      ]
    }).code;

    // Set the file's contents with the transformed version
    file.contents = new Buffer(src);
  };
