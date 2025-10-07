const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyWebpckPlugin = require('copy-webpack-plugin');
const CssPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle[fullhash].js',
    path: path.resolve(__dirname, 'build'),
    clean: true
  },
  mode: 'development',
  plugins: [
    new HtmlPlugin({
        template: './src/index.html'
    }),
    new CopyWebpckPlugin({
        patterns: [
            { from: './src/main.css', to: './' }
        ]
    }),
    new CssPlugin({
        filename: 'main[fullhash].css'
    })
  ],
  module: {
    rules: [
        { 
            test: /\.js$/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.css$/,
            use: [
                CssPlugin.loader,
                'css-loader'
            ]
        }
    ]
  },
  devServer: {
    port: 5500,
    static: {
        directory: path.join(__dirname, 'build')
    },
    devMiddleware: {
        writeToDisk: true
    },
    open: true
  }
};