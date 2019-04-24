var webpack = require("webpack");
var path = require("path");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var ROOT_PATH = path.resolve(__dirname);

module.exports = {
    entry: [ROOT_PATH + "/html2canvas.js", ROOT_PATH + "/monitor.js", ROOT_PATH + "/fetchCode.js"],
    output: {
        path: ROOT_PATH,
        filename: 'monitor.fetch.min.js'
    },
    // optimization: {
    //     minimizer: [
    //       new UglifyJsPlugin({
    //         uglifyOptions: {
    //           warnings: false,
    //           except: ['$super', '$', 'exports', 'require', 'html2canvas']
    //         },
    //       }),
    //     ],
    // },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({    //压缩代码
        compress: {
          warnings: false
        },
        except: ['$super', '$', 'exports', 'require', 'html2canvas']    //排除关键字
      })
    ]
};