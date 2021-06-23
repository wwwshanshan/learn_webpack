## 开发环境性能优化
* 优化打包构建速度
    * HMR: 热模块替换(一个模块发生变化，只会重新打包这一个模块)
    devServer: {hot: true}
* 优化代码调试
    * source-map: 一种 提供源代码到构建后 代码映射技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）devtool: 'source-map'

## 生产环境性能优化
* 优化打包构建速度
    * oneOf: 避免每个文件都被所有loader过一遍(不能有两个配置处理同一只类型文件)
    * babel缓存: {loader:'babel-loader',cacheDirectory: true} => 第二次打包构建速度更快
    * 多进程打包: {label: 'thread-loader',options: {workers: 2 //进程2个}},
    * externals 对某些库(第三方库：jq react vue)不打包 使用cdn引入
    * dll: 对某些库(第三方库：jq react vue)进行单独打包
* 优化代码运行的性能
    * 文件资源缓存: (hash-chunkhask-contenthash)
    * tree shaking: 去除无用代码 前提：1、必须使用es6模块化，2、开启production环境
    * code split: 代码分隔 并行加载 速度更快 optimization:{ splitChunks: { chunks: 'all' }}
    * js 懒加载(当文件需要使用时才加载) / 预加载(会在使用前提前加载js文件,兼容性较差)
    * pwa 离线访问(兼容性差)

