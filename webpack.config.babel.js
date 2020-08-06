import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';
import path from 'path';
import cssnano from 'cssnano';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const PacktrackerPlugin = require('@packtracker/webpack-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const purgecss = require('@fullhuman/postcss-purgecss');

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config();

const CSS_MAPS = ENV !== 'production';
/* eslint-disable */
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    main: './index.js',
  },
  mode: ENV,

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.scss'],
    modules: [
      path.resolve(__dirname, "src/lib"),
      path.resolve(__dirname, "node_modules"),
      'node_modules'
    ],
    alias: {
      components: path.resolve(__dirname, "src/components"),    // used for tests
      style: path.resolve(__dirname, "src/style"),
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        sourceMap: true,
        parallel: true,
        extractComments: true,
        terserOptions: {
          warnings: false,
          compress: {
            unsafe_comps: true,
            properties: true,
            keep_fargs: false,
            pure_getters: true,
            collapse_vars: true,
            unsafe: true,
            sequences: true,
            dead_code: true,
            drop_debugger: true,
            comparisons: true,
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: false,
            hoist_funs: true,
            if_return: true,
            join_vars: true,
            drop_console: true
          },
        },
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        // Transform our own .(scss|css) files with PostCSS and CSS-modules
        test: /\.(scss|css)$/,
        include: [
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'src/containers'),
        ],
        use: [
          ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: CSS_MAPS,
              importLoaders: 1,
            },
          },
          {
            loader: `postcss-loader`,
            options: {
              sourceMap: CSS_MAPS,
              options: {},
              plugins: () => {
                autoprefixer();
                cssnano();
                purgecss();
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['node_modules', 'node_modules/@material/*'].map(p => path.join(__dirname, p)),
              },
              sourceMap: CSS_MAPS,
            }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        exclude: [
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'src/containers'),
        ],
        use: [
          ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: CSS_MAPS,
              importLoaders: 1,
            }
          },
          {
            loader: `postcss-loader`,
            options: {
              sourceMap: CSS_MAPS,
              plugins: () => {
                autoprefixer();
                cssnano();
              }
            }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: CSS_MAPS }
          }
        ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(xml|html|txt|md)$/,
        use: 'raw-loader'
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: ENV==='production' ? 'file-loader' : 'url-loader'
      }
    ]
  },
  plugins: ([
    new PacktrackerPlugin({
      branch: process.env.TRAVIS_PULL_REQUEST_BRANCH || process.env.TRAVIS_BRANCH || process.env.BRANCH,
      project_token: process.env.PACKTRACKER_TOKEN,
      upload: process.env.CI === 'true',
    }),
    new MiniCssExtractPlugin({
      filename: ENV !== 'production' ? '[name].css' : '[name].[hash].css',
      chunkFilename: ENV !== 'production' ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV),
      'process.env.ORS_API_KEY': JSON.stringify(process.env.ORS_API_KEY),
      'process.env.OSM_EMAIL': JSON.stringify(process.env.OSM_EMAIL),
      'process.env.LOCATION_IQ_API_KEY': JSON.stringify(process.env.LOCATION_IQ_API_KEY),
      'GA_TRACKING_ID': JSON.stringify(process.env.GA_TRACKING_ID),
      'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
      'process.env.COMMITHASH': JSON.stringify(new GitRevisionPlugin().commithash()),
      'process.env.ALGOLIA_APP_ID': JSON.stringify(process.env.ALGOLIA_APP_ID),
      'process.env.ALGOLIA_API_KEY': JSON.stringify(process.env.ALGOLIA_API_KEY),
    }),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      minify: { collapseWhitespace: true },
      inject: false,
      // https://github.com/jantimon/html-webpack-plugin/issues/870#issuecomment-370004105
      chunksSortMode: 'none',
    }),
    new CopyWebpackPlugin([
      { from: './manifest.json', to: './' },
      { from: './_redirects', to: './' },
      { from: './favicon.ico', to: './' },
      { from: './sitemap*.xml', to: './' },
      { from: '.well-known', to: '.well-known' },
    ]),
  ]).concat(process.env.ENV !== 'production' ? [] : [
    new SentryCliPlugin({
      include: './build',
      release: new GitRevisionPlugin().commithash(),
    }),
  ]).concat(ENV !== 'production' ? [] : [
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/sw.js'),
    }),
  ]),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    publicPath: '/',
    contentBase: './src',
    open: false,
    openPage: '',
    hot: true,
    historyApiFallback: {
      index: '/index.html',
    },
  }
};
