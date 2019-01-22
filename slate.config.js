/* eslint-disable */

// Configuration file for all things Slate.
// For more information, visit https://github.com/Shopify/slate/wiki/Slate-Configuration

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // An array of string paths to liquid files that associate css variables to liquid variables
  'cssVarLoader.liquidPath': ['src/snippets/css-variables.liquid'],
  'webpack.extend': {
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
              loader: 'style-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
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
    plugins: [new VueLoaderPlugin()],
  },
  // Object which contains entrypoints used in webpack's config.entry key
  //'webpack.entrypoints': {},
};

// useful:
// https://github.com/Shopify/slate/issues/871
// https://github.com/liron-navon/slate-vue-starter
