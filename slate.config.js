/* eslint-disable */

// Configuration file for all things Slate.
// For more information, visit https://github.com/Shopify/slate/wiki/Slate-Configuration

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TSClonerPlugin = require('./webpack_plugins/tscloner-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const customSlateConfiguration = {
  // Path to self-signed SSL key which is used when developing
  // (browsersync, asset server) to avoid browsers rejecting requests based
  // on SSL
  'ssl.key': path.resolve(__dirname, 'certs', 'server.key'),
  // Path to self-signed SSL certificate which is used when developing
  // (browsersync, asset server) to avoid browsers rejecting requests based
  // on SSL
  'ssl.cert': path.resolve(__dirname, 'certs', 'server.crt'),
  // An array of string paths to liquid files that associate css variables to liquid variables
  'cssVarLoader.liquidPath': ['src/snippets/css-variables.liquid'],
};

const webpackExtendedConfiguration = {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.common.js',
      '@vue': path.join(__dirname, 'src/vue'),
    },
  },
  module: {
    rules: [
      {
        test: /^[^\.]+\.css$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isProduction,
            },
          },

          {
            loader: 'style-loader',
            options: {
              sourceMap: isProduction,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isProduction,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isProduction,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'svgs',
        to: '../snippets/[name].[ext].liquid',
        toType: 'template',
      },
    ]),
    new TSClonerPlugin({
      configPath: path.resolve(
        __dirname,
        'src/config/tscloner/tscloner.config.json'
      ),
      sectionsFullPath: path.resolve(
        __dirname,
        'src/config/tscloner/sections_placeholders'
      ),
      assetsTemplatesPath: '../templates',
      assetsSectionsPath: '../sections',
    }),
  ],
  // output: {
  //   path: path.join(__dirname),
  // },
};

module.exports = {
  ...customSlateConfiguration,
  // Extends webpack development config using 'webpack-merge'
  // https://www.npmjs.com/package/webpack-merge
  'webpack.extend': {
    ...webpackExtendedConfiguration,
  },

  // Object which contains entrypoints used in webpack's config.entry key
  //'webpack.entrypoints': {},
};
