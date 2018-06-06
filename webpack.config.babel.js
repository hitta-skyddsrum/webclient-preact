import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
const ENV = process.env.NODE_ENV || 'development';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');

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
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },

  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            unsafe_comps: true,
            properties: true,
            keep_fargs: false,
            pure_getters: true,
            collapse_vars: true,
            unsafe: true,
            ie8: false,
            warnings: false,
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
          }
        }
      }),
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { 
                modules: true, 
                sourceMap: CSS_MAPS, 
                importLoaders: 1,
                minimize: true,
              },
            },
            {
              loader: `postcss-loader`,
              options: {
                sourceMap: CSS_MAPS,
                options: {},
                plugins: () => {
                  autoprefixer();
                }
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: CSS_MAPS }
            }
          ]
        })
      },
      {
        test: /\.(scss|css)$/,
        exclude: [
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'src/containers'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { 
                sourceMap: CSS_MAPS, 
                importLoaders: 1,
                minimize: true,
              }
            },
            {
              loader: `postcss-loader`,
              options: {
                sourceMap: CSS_MAPS,
                plugins: () => {
                  autoprefixer();
                }
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: CSS_MAPS }
            }
          ]
        })
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
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
      disable: ENV !== 'production'
    }),
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
    ]),
    new SentryCliPlugin({
      dryRun: ENV !== 'production',
      include: './build',
      release: new GitRevisionPlugin().commithash(),
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
