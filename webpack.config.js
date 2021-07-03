const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
  return {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html')
      }),
      new Dotenv({
        path: `./.env.${env.NODE_ENV}`,
      }),
      new CopyPlugin({
        patterns: [
          { from: "src/assets/icons", to: "assets/icons" },
        ],
      }),
    ],
    mode: env.NODE_ENV,
    devServer: {
      contentBase: path.join(__dirname, 'src'),
    }
  }
};