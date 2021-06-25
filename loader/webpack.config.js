const { resolve } = require('path');
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                // loader: 'loader1'
                // use:['loader1', 'loader2',
                //     {   
                //         loader: 'loader3',
                //         options: {
                //             name: 'wss',
                //             age: 18
                //         }
                //     }
                // ],
                loader:'babelLoader',
                options:{
                    presets:[
                        '@babel/preset-env'
                    ]
                }
                
            }
        ]
    },
    // 配置loader的解析规则
    resolveLoader: {
        modules: [
            'node_modules',
            resolve(__dirname, 'loaders')
        ]
    },
    mode: 'production'
}