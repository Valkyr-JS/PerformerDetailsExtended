const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/main.tsx",
  output: {
    filename: "performerLibraryMeta.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  mode: "production",
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
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/source.yml",
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
