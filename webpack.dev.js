const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: "./src/main.tsx",
  output: {
    filename: "PerformerDetailsExtended.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/source.yml",
          to: "PerformerDetailsExtended.yml",
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "PerformerDetailsExtended.css",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
