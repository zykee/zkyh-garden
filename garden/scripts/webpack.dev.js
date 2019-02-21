const path = require('path')
const moment = require('moment')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'moment'],
    index: './src/index.tsx'
  },
  output: {
    path: path.resolve('./dist'),
    filename: 'js/[name].js?v=[hash:6]'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: 'css'
              })
            ]
          })
        }
      },
      {
        test: /\.less$/,
        include: path.resolve('./src'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { minimize: process.env.NODE_ENV === 'production' ? true : false }
            },
            {
              loader: 'less-loader'
            }
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: { minimize: process.env.NODE_ENV === 'production' ? true : false }
          }
        })
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]?v=[hash:6]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/[name].css?v=[hash:6]'),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    })
  ]
}
