const { merge } = require("webpack-merge");

const commmon = require("./webpack.common");

module.exports = merge(commmon, {
  mode: "production",
});
