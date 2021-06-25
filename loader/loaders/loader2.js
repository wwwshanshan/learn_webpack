// loader 本质上是个函数
// 异步loader
module.exports = function (content, map, meta) {
    console.log(222);
    const callback = this.async();
    setTimeout(() => {
        callback(null, content)
    }, 1000)
    return content;
}
module.exports.pitch = function() {
    console.log('pitch 222');
}