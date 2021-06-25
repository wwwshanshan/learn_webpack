// loader 本质上是个函数
// 同步loader
// module.exports = function (content, map, meta) {
//     console.log(111);
//     return content;
// }
module.exports = function (content, map, meta) {
    console.log(111);
    this.callback(null, content, map, meta)
    return content;
}
module.exports.pitch = function() {
    console.log('pitch 111');
}