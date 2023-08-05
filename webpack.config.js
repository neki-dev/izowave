const path = require('path');

const alias = require('alias-reuse');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const tsconfig = require('./tsconfig.json');

module.exports = (_, options) => {
  const isDev = options.mode === 'development';
  const entryDir = path.resolve(__dirname, 'src');
  const outputDir = path.resolve(__dirname, tsconfig.compilerOptions.outDir);

  return {
    target: 'web',
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      alias: alias.fromFile(__dirname, './tsconfig.json').toWebpack(),
    },
    entry: path.join(entryDir, 'index.ts'),
    output: {
      path: outputDir,
      filename: 'bundle.[fullhash].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'ts-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        IS_DEV_MODE: JSON.stringify(isDev),
      }),
      new HtmlWebpackPlugin({
        template: path.join(entryDir, 'index.html'),
        filename: 'index.html',
        inject: 'body',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(entryDir, 'assets'),
            to: 'assets',
          },
        ],
      }),
    ],
    devServer: {
      static: {
        directory: outputDir,
      },
      compress: true,
      port: 9999,
    },
    devtool: 'source-map',
    optimization: isDev
      ? undefined
      : {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              output: { comments: false },
            },
          }),
        ],
      },
  };
};
