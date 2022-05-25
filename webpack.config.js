const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './client/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client/dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
            {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: false
},
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts']
  },
  
};