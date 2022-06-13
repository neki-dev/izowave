const path = require('path');
const webpack = require('webpack');
const alias = require('alias-reuse');
const tsconfig = require('./tsconfig.json');

module.exports = (_, { mode }) => ({
  resolve: {
    extensions: ['.js', '.ts'],
    alias: alias(path.resolve(__dirname))
      .fromTsconfig()
      .toWebpack(),
  },
  target: 'web',
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'src/index.ts'),
  ],
  output: {
    path: path.resolve(__dirname, tsconfig.compilerOptions.outDir, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'babel-loader',
    }],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'app'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new webpack.DefinePlugin({
      'IS_DEV_MODE': JSON.stringify(mode === 'development')
    })
  ]
});
