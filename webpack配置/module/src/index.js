import count from './count';
import('./add').then(({default: add}) => {
    console.log(add(1,2));
})
console.log('111');

console.log(count(9,3));