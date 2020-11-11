const path = require('path');
 
module.exports = {
  target: 'node',
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
    https: true
  },
  node: {
    fs: "empty"
  }
  /*
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  }*/
};