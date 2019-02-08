/* eslint-disable */

// Configuration file for all things Slate.
// For more information, visit https://github.com/Shopify/slate/wiki/Slate-Configuration

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TSClonerPlugin = require('./webpack_plugins/tscloner-plugin');
const ImageminPlugin = require('imagemin-webpack');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const glob = require('glob');

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
  cssVarLoaderEnable: true,
  'cssVarLoader.liquidPath': ['src/snippets/utils.css-variables.liquid'],
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
        test: /\.(jpe?g|png|gif|svg|liquid)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
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
    new TSClonerPlugin(),
    new ImageminPlugin({
      bail: false, // Ignore errors on corrupted images
      cache: true,
      name: '[name].[ext]',
      // include: /\/*.liquid/,
      imageminOptions: {
        plugins: [
          imageminGifsicle({
            interlaced: true,
          }),
          imageminJpegtran({
            progressive: true,
          }),
          imageminOptipng({
            optimizationLevel: 5,
          }),
          imageminSvgo({
            removeViewBox: true,
          }),
        ],
      },
    }),
    new ImageminWebpackPlugin({
      externalImages: {
        context: 'src',
        sources: glob.sync('src/svgs/*.svg'),
        destination: 'dist/snippets',
        fileName: 'icons.[name].[ext].liquid',
      },
      svgo: {
        plugins: [
          {
            removeAttrs: {
              attrs: 'class',
            },
          },
          {
            sortAttrs: true,
          },
          {
            removeStyleElement: true,
          },
          {
            removeScriptElement: true,
          },
          {
            addAttributesToSVGElement: {
              attribute: `class="c-icon {{ extra_classes }}" fill="{{ color }}"`,
            },
          },
        ],
      },
    }),
  ],
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
