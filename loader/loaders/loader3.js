// loader 本质上是个函数
const { options } = require('colorette');
const { getOptions } = require('loader-utils'); // 获取loader上options的值
// const { validate } = require('schema-utils'); // 校验
const schema = require("./schema");

module.exports = function (content, map, meta) {
    // 获取options
    const option = getOptions(this);
    console.log(333, option)
    // // 校验options是否合法(没起作用？？？)
    // validate(schema, options, {
    //     name:'loader3',
    // })

    this.getOptions(schema); // 用此方法可获取并校验
    return content;
}
module.exports.pitch = function() {
    console.log('pitch 333');
}
/**
 * 
 * {
    "type": "object",
    "properties": { // 属性
        "name": {
            "type": "string", // 类型
            "description": "名称", // 描述
        }
    },
    "additionalProperties": true, // 是否允许追加其他属性
}
 */