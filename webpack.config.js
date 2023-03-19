const path = require('path');

const alias = require('alias-reuse');
const webpack = require('webpack');

const tsconfig = require('./tsconfig.json');

module.exports = (_, { mode }) => ({
  resolve: {
    extensions: ['.js', '.ts'],
    alias: alias.fromFile(__dirname, './tsconfig.json').toWebpack(),
  },
  target: 'web',
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    path: path.join(__dirname, tsconfig.compilerOptions.outDir, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: ['babel-loader', 'ts-loader'],
      exclude: /node_modules/,
    }],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'app'),
    },
    compress: true,
    port: 9000,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV_MODE: JSON.stringify(mode === 'development'),
    }),
  ],
});
