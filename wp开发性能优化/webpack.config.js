/**
 * HMR: 
 *      hot module replacement 热模块替换 / 模块热替换
 *      作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块）极大提升了构建速度
 *      样式文件：可以使用HMR功能，因为style-loade内部实现了
 *      js文件：默认不能使用HMR功能 => 修改js代码，添加支持HMR功能代码
 *             注意：HMR功能只能处理非入口js文件的其他文件
 *      html文件：默认不能使用HMR功能，同时会到导致 问题：html文件不能热更新了 
 *               解决：修改entry入口 讲html文件引入（不需要HMR功能，只有一个文件，不需要优化）
 * source-map: 
 *      一种 提供源代码到构建后 代码映射技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）
 *      [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
            source-map：外部，错误代码准确信息 和 源代码的错误位置
            inline-source-map：内联，只生成一个内联 source-map，错误代码准确信息 和 源代码的错误位置
            hidden-source-map：外部，错误代码错误原因，但是没有错误位置（为了隐藏源代码），不能追踪源代码错误，只能提示到构建后代码的错误位置
            eval-source-map：内联，每一个文件都生成对应的 source-map，都在 eval 中，错误代码准确信息 和 源代码的错误位
            nosources-source-map：外部，错误代码准确信息，但是没有任何源代码信息（为了隐藏源代码）
            cheap-source-map：外部，错误代码准确信息 和 源代码的错误位置，只能把错误精确到整行，忽略列
            cheap-module-source-map：外部，错误代码准确信息 和 源代码的错误位置，module 会加入 loader 的 source-map
 *      内联 和 外部区别：1、外部生成文件build.js.map,内联没有 2、内联构建速度更快
        
        开发/生产环境可做的选择：
        开发环境：需要考虑速度快，调试更友好
            速度快( eval > inline > cheap >... )
                eval-cheap-souce-map
                eval-source-map
            调试更友好
                souce-map
                cheap-module-souce-map
                cheap-souce-map
            最终得出最好的两种方案 -->  eval-source-map（完整度高，内联速度快)(vue react 脚手架默认使用)
                                    eval-cheap-module-souce-map（错误提示忽略列但是包含其他信息，内联速度快）
        生产环境：需要考虑源代码要不要隐藏，调试要不要更友好
                内联会让代码体积变大，所以在生产环境不用内联
                隐藏源代码
                nosources-source-map 全部隐藏
                hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
最终得出最好的两种方案 -->  source-map（最完整)
                        cheap-module-souce-map（错误提示一整行忽略列）
 */
// resolve用来拼接绝对路径的方法
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // 入口文件
    entry: ['./src/index.js','./src/index.html'],
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
        open: true,
        // 开启HMR功能
        // 修改webpack配置，新配置要生效，需重新webpack服务
        hot: true
    },
    devtool: 'source-map'
}