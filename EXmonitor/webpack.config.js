var webpack = require("webpack");
var path = require("path");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var ROOT_PATH = path.resolve(__dirname);

module.exports = {
    entry: [ROOT_PATH + "/monitor.js", ROOT_PATH + "/fetchCode.js"],
    output: {
        path: ROOT_PATH,
        filename: 'monitor.fetch.min.js'
    },
    optimization: {
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              warnings: false,
              except: ['$super', '$', 'exports', 'require']
            },
          }),
        ],
      },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false
    //         },
    //         except: ['$super', '$', 'exports', 'require'] // 排除关键字
    //     })
    // ]
};