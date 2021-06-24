const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')
module.exports = {
    entry: './src/js/index.js',
    output: {
        filename:'js/[name][contenthash:10].js',
        path: resolve(__dirname, 'build'),
        chunkFilename:'js/[name].[contenthash:10]_chunk.js' // 指定非入口文件的其他chunk的名字加上_chunk
    },
    module: {
        rules: [
            {
                test:/\.css$/,
                // 多个loader用use
                use: ['style-loader', 'css-loader']
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    mode:'production',
    // 解析模块的规则
    resolve: {
        // 配置解析模块路径别名: 优：简写路径； 缺：路径没有提示
        alias: {
            $css: resolve(__dirname, 'src/css')
        },
        // 配置省略文件路径的后缀名
        extensions:['.js', '.json','.css'],
        // 告诉 webpack 解析模块去哪个目录找
        modules:[resolve(__dirname,'node_modules'),'node_modules']
    },
    optimization: {
        splitChunks: {
            chunks:'all'
             /* 以下都是splitChunks默认配置，可以不写
            miniSize: 30 * 1024, // 分割的chunk最小为30kb（大于30kb的才分割）
            maxSize: 0, // 最大没有限制
            minChunks: 1, // 要提取的chunk最少被引用1次
            maxAsyncRequests: 5, // 按需加载时并行加载的文件的最大数量为5
            maxInitialRequests: 3, // 入口js文件最大并行请求数量
            automaticNameDelimiter: '~', // 名称连接符
            name: true, // 可以使用命名规则
            cacheGroups: { // 分割chunk的组
            vendors: {
                // node_modules中的文件会被打包到vendors组的chunk中，--> vendors~xxx.js
                // 满足上面的公共规则，大小超过30kb、至少被引用一次
                test: /[\\/]node_modules[\\/]/,
                // 优先级
                priority: -10
            },
            default: {
                // 要提取的chunk最少被引用2次
                minChunks: 2,
                prority: -20,
                // 如果当前要打包的模块和之前已经被提取的模块是同一个，就会复用，而不是重新打包
                reuseExistingChunk: true
            }
            } */
        },
        // 讲当前模块的记录其他模块的hash单独打包为一个文件 runtime
        // 解决：修改a文件导致b文件的contenthash变化
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`
        },
        minimizer: [
            // 配置生产环境的压缩方案： js和css
            new TerserWebpackPlugin({
                // 开启缓存
                // cache: true,
                // 开启多进程打包
                parallel: true,
                // 启动source-map
                // sourcemap: true
            })
        ]
    }
}