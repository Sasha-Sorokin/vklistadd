const esbuild = require("rollup-plugin-esbuild");
const path = require("path");

const plugin = esbuild({
  include: /\.ts$/,
  exclude: /node_modules/,
  tsconfig: path.join(__dirname, "tsconfig.json"),
  target: "es2020",
});

module.exports = {
  default: plugin,
};
