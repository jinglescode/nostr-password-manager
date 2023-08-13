const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.tsx",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        exclude: /node_modules/,
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "**/*",
          context: "public",
        },
      ],
    }),
    ...getHtmlPlugins(["index"]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      crypto: require.resolve("crypto-browserify"),
    },
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: "Vault",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
