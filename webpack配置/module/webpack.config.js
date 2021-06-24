const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename:'js/[name].js',
        path: resolve(__dirname, 'build'),
    },
    module: {
        rules: [
            {
                test:/\.css$/,
                // 多个loader用use
                use: ['style-loader', 'css-loader']
            },
            {
                test:/\.js$/,
                exclude: /node_modules/, // 排除node_modules下的js文件
                include: resolve(__dirname, src), // 只检查src下的js文件
                enforce: 'pre', // 优先执行
                // enforce: 'post', // 延后执行
                loader: 'eslint-loader', // 单个loader用loader
                option:{} // 指定配置项
            },
            {
                // 以下配置只会生效一个
                oneOf:[]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    mode:'development'
}