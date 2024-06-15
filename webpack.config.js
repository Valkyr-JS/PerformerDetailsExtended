const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: "./src/performerLibraryMeta.tsx",
  output: {
    filename: "performerLibraryMeta.js",
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
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/performerLibraryMeta.yml",
          to: "performerLibraryMeta.yml",
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "performerLibraryMeta.css",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
