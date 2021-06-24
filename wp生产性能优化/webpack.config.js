
/**
 * 缓存：
 *      babel缓存  cacheDirectory: true => 第二次打包构建速度更快
 *      文件资源缓存 
 *      hash：每次webpack构建是会生成唯一的hash值
 *           问题：因为js跟css同时使用一个hash值，重新打包，所有文件的 hsah 值都改变，会导致所有缓存失效。（可能只改动了一个文件）
 *      chunkhash：根据chunk生成的hash值，如果打包来源于同一个chunk，那么hash值就一样
 *           问题：js跟css的hash值还是一样的
 *           因为css是在js中被引入的，所以同属于一个chunk
 *      contenthash：根据文件的内容生成hash值，不同文件hash值不一样 => 让代码上线运行缓存更好使用
 * 
 * tree sharking：去除无用代码
 *      前提：1、必须使用es6模块化，2、开启production环境
 *      作用：减少代码体积
 * 
 *      在page.json中配置
 *      "sideEffects":false 所以代码都没有副作用，都可进行tree shaking
 *          问题：可能会把css / @babel/polyfill 副作用文件干掉
 *          "sideEffects":["*.css","*.less"]
 * 
 * code split: 代码分隔 并行加载 速度更快
    可以将node_modules中代码单独打包成一个chunk最终输出
    自动分析多入口chunk中，有没有公共文件，如果有会单独打包成单独一个chunk
    optimization:{
        splitChunks: {
            chunks: 'all'
        }
    },
    单个入口文件，通过js代码，让某个文件被单独打包成一个chunk
    // import 动态导入语法：能将某个文件单独打包
    import(/* webpackChunkName: 'tree' * /'./tree').then(
    (result)=>{
        // eslint-disable-next-line
        console.log(result)
    }
    ).catch(
    ()=>{
        // eslint-disable-next-line
    console.log('文件加载失败')
    })

 * 懒加载：当文件需要使用时才加载
   预加载：会在使用前提前加载js文件 （兼容性较差，慎用）
        正常加载可以认为是并行加载，同一时间加载多个文件
        预加载：等其他资源加载完毕，等浏览器空闲了，在偷偷加载资源
    document.getElementById('btn').onclick = () => {
        import(/ * webpackChunkName: 'test', webpackPrefetch: true * /'./tree').then(({mul})=>{
            // eslint-disable-next-line
            console.log(mul(4,5)) 
        })
    };
 PWA:渐进式网络开发应用程序（离线可访问）
    workbox => workbox-webpack-plugin

 */
const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebbpackPlugin = require('workbox-webpack-plugin');
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
    // 入口文件 (单入口)
    entry: './src/js/index.js',
    // 入口文件 (多入口) 
    // entry:{
    //     main: './src/js/index.js',
    //     test: './src/js/tree.js',
    // },
    output:{
        // [name]:取文件名
        filename:'js/[name].[contenthash:10].js',
        // filename:'js/.[contenthash:10].js',
        path:resolve(__dirname, "build")
    },
    module:{
        rules:[
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
                // test:/\.js$/,
                // exclude:/node_modules/,
                // // 优先执行
                // enforce: 'pre',
                // loader:'eslint-loader',
                // options:{
                //     // 自动修复eslint错误
                //     fix: true
                // }
            },
            {
                // 以下loader只会匹配一个，提升构建速度
                // 注意：不能有两个配置处理同一只类型文件
                oneOf:[
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
                        use: [
                            /*
                            开启多进程打包
                            进程启动大概600ms，进程通讯也有开销。
                            只有工作消耗实际较长，才需要多进程打包
                            */
                            {
                                loader: 'thread-loader',
                                options: {
                                    workers: 2 //进程2个
                                }
                            },
                            {
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
                                ],
                                // 开启babel缓存，第二次构建会读取之前的缓存
                                cacheDirectory: true
                        }
                            }
                        ],
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
            filename:'css/build.[contenthash:10].css'
        }),
        new WorkboxWebbpackPlugin.GenerateSW({
            /**
             * 1、帮助serviceworker快速启动
             * 2、删除旧的serviceworker
             * 
             * 生成一个servicework配置文件
             */
            clientsClaim: true,
            skipWaiting: true
        })
    ],
    /**
     * 可以将node_modules中代码单独打包成一个chunk最终输出
     * 自动分析多入口chunk中，有没有公共文件，如果有会单独打包成单独一个chunk
     *  */ 
    optimization:{
        splitChunks: {
            chunks: 'all'
        }
    },
    // 生产环境下自动压缩js代码
    mode:'production'
    // externals: {
    //     // 拒绝jquery被打包，通过cdn引进<script src="cdn引入">
    //     // 写法：忽略库名:pm包名
    //     jquery: jQuery
    // }
    /**
     * 使用dll技术，对某些库(第三方库：jq react vue)进行单独打包
    */
}