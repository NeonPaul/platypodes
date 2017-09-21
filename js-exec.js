// This plugin transforms a file from javascript to plain text
// by executing the file and grabing the stdout.

module.exports = (file, builder) => {
  // Todo: use require('requireFromString')
  // what to do about child requires, node_modules, etc?
  const p = require('child_process').spawnSync('node', [
    '-e',
    String(file.contents)
  ]);

  if (p.stderr) {
    process.stderr.write(p.stderr);
  }

  file.contents = new Buffer(p.stdout);
  file.path.replace(/\.js$/, '.html');

  // Not very elegant, I know

  return file;
};
