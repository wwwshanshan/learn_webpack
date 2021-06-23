// resolve用来拼接绝对路径的方法
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // 入口文件
    entry: "./src/index.js",
    // 输出文件
    output: {
        // 输出文件名
        filename: 'js/build.js',
        // 输出路径
        // __dirname 是nodejs的变量，代表当前文件的目录绝对路径
        path: resolve(__dirname, 'build')
    },
    // loader的配置
    // 1、下载 2、使用（配置loader）
    module: {
        rules: [
            // 详细loader配置
            // 不同文件必须配置不同loader配置
            {
                // css
                // 匹配文件
                test: /\.css$/,
                // 使用那些loader进行处理
                use: [
                    // use数组中loader执行顺序：从右到左，从下到上
                    // 创建style标签，将js中的样式资源插入进行，添加到head中生效
                    'style-loader',
                    // 讲css文件变成commonjs模块加载到js中，里面内容是样式字符串
                    'css-loader'
                ]
            }, {
                // less
                test: /\.less$/,
                // 多个loader处理使用use
                use: [
                    // 创建style标签，将js中的样式资源插入进行，添加到head中生效
                    'style-loader',
                    // 讲css文件变成commonjs模块加载到js中，里面内容是样式字符串
                    'css-loader',
                    // 讲less文件编译成css文件
                    // 需要下载less和less-loader
                    'less-loader'
                ]
            }, {
                // 处理图片资源（默认处理不了html中的img图片）
                test: /\.(jpg|jpeg|png|gif)$/,
                // 一个loader处理使用loader
                // 下载url-loader file-loader
                loader: 'url-loader',
                // 图片大小小于8kb，就会被base64处理
                // 优点：减少请求数量（减轻服务器压力）
                // 缺点：图片体积会更大（文件请求速度更慢）
                options: {
                    limit: 8 * 1024,
                    // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                    // 解析时会出现的问题：[object Module]
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    esModule: false,
                    // 给图片重命名
                    // [hash:10]取图片的hash的前10位 [ext]取文件原来扩展名
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs'
                }

            }, {
                test: /\.html$/,
                // 处理html文件中的img图片（负责引入img， 从而能被url-loade进行处理）
                loader: 'html-loader',
                options:{
                    esModule:false
                }
            }, {
                // 打包其他资源
                // exclude排除其他资源
                exclude: /\.(css|js|html|less|json|jpg|jpeg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'other'
                }

            }
        ]
    },
    // plugins的配置
    // 1、下载  2、引入 3、使用
    plugins: [
        // html-webpack-plugin (new调用)
        // 功能：默认创建空的HTML,自动引入打包输出的所有资源（js/css）
        new HtmlWebpackPlugin({
            // 复制 './src/index.html' 文件，自动引入打包输出的所有资源（js/css）
            template: './src/index.html'
        })
    ],
    // 模式
    mode: 'development',
    // 开发服务器 devServer:自动化 不用每次修改后输入webpack打包（自动编译，自动打开浏览器，自动刷新浏览器...）
    // 特点：只会在内存中编译打包，不会有任何输出
    // 启动devServer指令：npx(本地) webpack-dev-server 或者 npx webpack serve

    devServer: {
        // 项目构建后路径
        contentBase: resolve(__dirname, 'build'),
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true
    }
}