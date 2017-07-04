var path = require('path');

module.exports = {
  context: __dirname,
  entry: './lib/main.js',
  output: {
    filename: 'fiefDOM.js',
    path: path.resolve(__dirname, 'lib')
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '*']
  }
};
