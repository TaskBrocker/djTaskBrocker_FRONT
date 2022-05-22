const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/djTaskBrockerFrontendAdmin"),
    filename: "[name].js",
  },
  resolve: {
    alias: {
      //layouts: path.resolve(__dirname, './src/layouts/'),
      //context: path.resolve(__dirname, './src/context/'),
      //assets: path.resolve(__dirname, './src/assets/'),
      //components: path.resolve(__dirname, './src/components/'),
      //examples: path.resolve(__dirname, './src/examples/'),
    },
  },  
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: [
          'babel-loader',
        ]
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: 'images',
            outputPath: 'images',
          }
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(sass)$/,
        use: [
          'sass-loader',
        ]
      },
    ],
  },
  /*
  optimization: {
    minimize: true,
  },
  */
  plugins: 
    [new webpack.ProvidePlugin({
      "React": "react",}),
    ],
};