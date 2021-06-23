/**
 * index.js --webpack入口起点文件
 * 1. 运行指令
 *    开发环境：webpack ./src/index.js -o ./build/build.js --mode=development
 *            (webpack会以.src/index.js 为入口文件开始打包，打包输出到./build/build.js，整体打包环境是开发环境)
 *    生产环境：webpack ./src/index.js -o ./build/build.js --mode=production
 *            (webpack会以.src/index.js 为入口文件开始打包，打包输出到./build/build.js，整体打包环境是生产环境)
 * 2.结论
 *      1.webpack能打包js/json资源,不能处理css/img等其他资源
 *      2.生产环境和开发环境将es6模块化编译成浏览器能识别的模块化
 *      3.生产环境比开发环境多一个压缩js代码
 *  
 * 
 * webpack.config.js webpack的配置文件  
 *      作用：指示 webpack 干哪些活（当你运行webpack指令时，会加载里面的配置）
 *      所有的构建工具都是基于nodejs平台运行的 模块化默认采用commonjs
 *  */ 
import './index.css';
import './index.less';
import './iconfont.css';
import data from './data.json';
console.log(data)
function add(x,y){
    return x+y
}
console.log(add(1,2))
console.log(add(3,2))