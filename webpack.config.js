/**
 * @type {import('webpack').Configuration}
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

config = {
  entry: './src/index',
  output: {
    path: path.join(__dirname, '/build'),
    filename: `[name].[contenthash:8].js`
  },
  target: ["web", "es5"],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    mainFields: ["main", "module"]
  },
  optimization: {
    minimizer: [new TerserJSPlugin({extractComments: false, parallel: true}), new OptimizeCSSAssetsPlugin({})],
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
        chunks: "all",
        cacheGroups: {
            white: {
                test: /[\\/]node_modules[\\/](white-web-sdk)[\\/]/,
                name: 'web-sdk',
                chunks: 'all',
                priority: 10,
                reuseExistingChunk: true
            },
            video: {
                test: /video/,
                name: 'video',
                chunks: 'all',
                priority: 7,
                reuseExistingChunk: true
            },
            netless: {
              test: /@netless/,
              name: 'netless',
              chunks: 'all',
              priority: 7,
              reuseExistingChunk: true
            },
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'all',
                priority: 1,
                reuseExistingChunk: true
            }
        }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: `[name].css`,
      chunkFilename: `[name].[contenthash:8].css`,
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
            "thread-loader",
            "babel-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
      {
        test: /\.css$/,
        use: [{loader: MiniCssExtractPlugin.loader}, 'css-loader']
      },
      {
        test: /\.(svg|png)/,
        use: ['file-loader']
      }
    ]
  },
  // cache: {
  //     type: "filesystem"
  // }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.output.filename = '[name].[hash].js';
    config.module.rules[0].exclude = /node_modules/;
  }
  return config;
}