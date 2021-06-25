const { getOptions } = require("loader-utils");
const babelLoader = require('./babelschema');
const babel = require('@babel/core');
const util = require('util');
// babel.transform用来编译代码的方法 一个普通的异步方法
// util.promisify将普通的异步方法转换成基于promise的异步方法
const transform  = util.promisify(babel.transform);
module.exports = function(content, map, mate){
    const options = getOptions(this) || {}
    // 获取loader并校验
    this.getOptions(babelLoader);
    // 创建异步
    const callback = this.async();
    // 使用babel
    transform(content, options)
    .then(({code, map}) => callback(null, code, map, mate))
    .catch((e) => callback(e))
}