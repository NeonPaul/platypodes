const babel = require('babel-core');
const deasyncPromise = require('deasync-promise');

// This is a babel plugin to replace require statements with build assets
const babelPlugin = (pathname, inline) => babel => {
  const t = babel.types;

  return {
    visitor: {
      // Look for a function call...
      CallExpression(path, state) {
        if (
          // Where the function is named 'require'
          path.node.callee.name !== 'require' ||
          // The first argument is a String
          path.node.arguments[0].type !== 'StringLiteral' ||
          // The first argument contains a ! character
          path.node.arguments[0].value.indexOf('!') < 0
        ) {
          // Skip this node if the requirements aren't met
          return;
        }

        // The ! delimits the source path and the 'context'
        const [src, cx] = path.node.arguments[0].value.split('!');

        // If context is the string 'raw', get the inline code
        // otherwise get the built file path
        // NB: babel plugins have to be synchronous, but the build functions
        // return promises - fortunately there's a library to help us!
        const resolved = deasyncPromise(
          cx === 'raw' ? inline(src) : pathname(src)
        );
        // Kind of ham-fisted but works for now

        // Replace the require call with a string
        path.replaceWith(t.stringLiteral(resolved));
      }
    }
  };
};

module.exports = babelPlugin;
