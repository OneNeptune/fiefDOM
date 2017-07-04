var path = require('path');

module.exports = {
  context: __dirname,
  entry: './lib/main.js',
  output: {
    filename: 'jquery_lite.js',
    path: path.resolve(__dirname, 'lib')
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '*']
  }
};
