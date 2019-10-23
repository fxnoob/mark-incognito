const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    background: "./src/background.js",
    option: "./option-page/App.jsx"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true // webpack@2.x and newer
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "[name].bundle.js"
  },
  plugins: [
    new CopyWebpackPlugin(
      [
        { from: "./option-page/option.html", force: true },
        { from: "./src/app/", force: true }
      ],
      {}
    ),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: "./dist",
    hot: true
  }
};
