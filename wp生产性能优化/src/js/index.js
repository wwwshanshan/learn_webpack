import '../css/a.css';
import '../css/b.css';
// import $ from 'jquery';
// import { mul } from './tree';
// import '@babel/polyfill'
const add = function add(x, y) {
  return x + y;
};
// 下一行eslint的的所有规则都失效（下一行不进行eslint检查）
// eslint-disable-next-line
console.log(add(2, 5));
const promise = new Promise((resolve) => {
  setTimeout(() => {
    // eslint-disable-next-line
    console.log('定时器执行完了');
    resolve();
  }, 1000);
});
const sum = (...args) => args.reduce((p, n) => p + n, 0);
// eslint-disable-next-line
console.log(sum(1,2,3,4))
// eslint-disable-next-line
console.log(promise);
// eslint-disable-next-line
// console.log(mul(2, 3));
// console.log($);

// import 动态导入语法：能将某个文件单独打包
// import (/*webpackChunkName: 'tree' */'./tree')
// .then((result)=>{
//     // eslint-disable-next-line
//     console.log(result)
//   }
// ).catch(()=>{
//     // eslint-disable-next-line
//   console.log('文件加载失败')
// })

//  懒加载：当文件需要使用时才加载
//  预加载：会在使用前提前加载js文件 （兼容性较差，慎用）
//   正常加载可以认为是并行加载，同一时间加载多个文件
//   预加载 Prefetch：等其他资源加载完毕，等浏览器空闲了，在偷偷加载资源
 document.getElementById('btn').onclick = () => {
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./tree').then(({mul})=>{
    // eslint-disable-next-line
    console.log(mul(4,5))
  })
}; 
/**
 * 1、问题：eslint 不认识 window navigator等全局变量
 * 解决：需要修改package.json中eslintConfig配置
 * "evn":{
 *    "browser":true 支持浏览器全局变量
 * }
 * 2、sw代码必须运行在服务器上
 *    => nodejs
 *    => npm i serve -g    serve -s build启动服务器，将build目录下的所有资源作为静态资源暴露出去
 * */
// 注册serviceWorker
// 处理兼用性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('sw注册成功');
      }).catch(() => {
        console.log('sw注册失败');
      });
  });
}
