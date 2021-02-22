const path = require('path');
const fs = require('fs');
const cracoBabelLoader = require('craco-babel-loader');

// Handle relative paths to sibling packages
const appDirectory = fs.realpathSync(process.cwd());
const resolvePackage = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  webpack: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'styled-components': path.resolve('./node_modules/styled-components')
    }
  },
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [
          // No "unexpected token" error importing components from these lerna siblings:
          resolvePackage('../landing')
          // resolvePackage('../more-components'),
          // resolvePackage('../another-components-package')
        ]
      }
    }
  ]
};
