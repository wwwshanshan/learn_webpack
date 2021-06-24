const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 设置nodejs环境变量 决定使用browserslist的哪个环境
// process.env.NODE_ENV = 'development'
// 复用loader
const commonCssLoader = [ 
    // 创建style标签，将js中的样式资源插入进行，添加到head中生效
    // 'style-loader',

    // 这个loader取代style-loader，作用：提取js中的css成单独文件通过link加载
    MiniCssExtractPlugin.loader,

    // 讲css文件变成commonjs模块加载到js中，里面内容是样式字符串
    // 问题：1、js文件体积会很大，2、需要先加载js在动态创建style标签，样式渲染速度慢，会出现闪屏现象
    // 解决：用MiniCssExtractPlugin.loader代替style-loader
    'css-loader',

    /**
     * css兼容性处理：postcss => 安装 postcss-loader postcss-preset-env
     * postcss-preset-env插件帮postcss找到page.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
     * package.json中定义browserslist
         "browserslist":{
        "development":[ 
            开发环境 => 设置node环境变量： process.env.NODE_ENV = 'development'
            "last 1 chrom version", 兼容最近的版本
            "last 1 firefox version",
            "last 1 safari version"
        ],
        "production":[ 满足绝大多数浏览器兼容
            生产环境 （默认生产环境）
            ">0.2%",  大于99.8%的浏览器
            "not dead", 
            "not op_mini all" 
        ]
    }
    */
    {
        loader: 'postcss-loader',
        options: {
            postcssOptions:{
                plugins:  [
                // postcss的插件
                require('postcss-preset-env')
            ] 
            }
            
        }
    }
]
module.exports = {
    entry:'./src/js/index.js',
    output:{
        filename:'js/build.js',
        path:resolve(__dirname, "build")
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[...commonCssLoader]
            },
            {
                test:/\.less/,
                use:[
                   ...commonCssLoader,
                    'less-loader'
                ],
            },
            /**
             * 语法检查：下载 eslint-loader eslint
             * 注意：只检查自己的源代码，第三方库是不用检查的
             * 设置检查规则：
             *      package.json中 eslintConfig 中设置
             *      "eslintConfig":{
                        "extends": "airbnb-base" //继承Airbnb的风格规范
                    }
             *      aribnb（js风格库） => 下载 eslint-config-airbnb-base eslint-plugin-import 
             */

            // 正常来讲，一个文件只能被一个loader处理
            // 当一个文件要被多个loader处理，name一定要指定loader执行的先后顺序
            // 先执行eslint-loader在执行babel-loader
            {
                test:/\.js$/,
                exclude:/node_modules/,
                // 优先执行
                enforce: 'pre',
                loader:'eslint-loader',
                options:{
                    // 自动修复eslint错误
                    fix: true
                }
            },
            /**
             * js兼容性处理：下载 babel-loader @babel/core  @babel/preset-env
             * 1、基本js兼容性处理 => @babel/preset-env 解决：使用babel/polyfill
             *    问题：只能转换基本语法，如promise等高级语法不能转换
             * 2、全部js兼容性处理 => 下载 @babel/polyfill（不需配置 直接在index.js引入import '@babel/polyfill')
             *    问题：只要解决部分兼容性问题，但是@babel/polyfill将所有兼容性代码全部引入，体积过大
             * 3、按需加载兼容性处理 => 下载core-js
             */
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:'babel-loader',
                options:{
                    // 预设：指示babel做怎样的兼容性处理
                    presets:[
                        [
                            '@babel/preset-env',
                            {
                                // 按需加载
                                useBuiltIns:'usage',
                                // 指定core-js版本
                                corejs:{
                                    version:2
                                },
                                // 指定兼容性做到那个版本浏览器
                                targets:{
                                    chrome:'60',
                                    firefox:'60',
                                    ie:'9',
                                    safari:'10',
                                    edge:'17'
                                }
                            }
                        ]
                    ]
                }
            },
            {
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
    plugins:[
        new HTMLWebpackPlugin({
            template:'./src/index.html',
            // 压缩html代码
            minify:{
                // 移出空格
                collapseWhitespace:true,
                // 移出注释
                removeComments:true
            }
        }),
        new MiniCssExtractPlugin({
            // 对输出的css文件重命名
            filename:'css/build.css'
        })
    ],
    // 生产环境下自动压缩js代码
    mode:'production'
}