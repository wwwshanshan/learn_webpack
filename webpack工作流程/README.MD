# Webpack 执行流程
1、 初始化 Comlier： new webpack(config) 得到 Compiler 对象
2、 开始编译： 调用complier 对象 run方法开始执行编译
3、 确定入口： 根据配置中的 entry 找出所有的入口文件
4、 编译模块： 从入口文件触发，调用所有配置的 Loader 对模块进行编译， 再找出该模块依赖的模块，递归直到所有模块被加载进来
5、 完成模块编译：在经过第4步使用 Loader 编译完所有的模块后，得到了每个模块被编译后的最终内容以及它们之间的依赖关系
6、 输出资源： 根据入口和模块之间的依赖关系， 组成一个个包含多个模块的 Chunk ，再把每个 Chunk 转换成一个单独的文件 加入到输出列表（注意：这步是可以修改输出内容的最后机会）
7、 输出完成： 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件写入到文件系统
