const path = require("path");

module.exports = {
  entry: "./src/performerLibraryMeta.tsx",
  output: {
    filename: "performerLibraryMeta.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
