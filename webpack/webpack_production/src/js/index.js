import 'core-js/modules/es.object.to-string';
import 'core-js/modules/es.promise';


import 'core-js/modules/es.promise'; // 项目入口文件

import '../css/a.css';
import '../css/b.css';
/* import "@babel/polyfill" */

function add(x, y) {
  return x + y;
} // 如果不想对某行的js 语句进行eslint 语法检查，可以在那条语句上方下一个注释如下：
// eslint-disable-next-line


console.log(add(1, 2));

const fn = function fn(a, b) {
  return a * b;
};

console.log(fn(2, 3));
const p = Promise.resolve('sasa');
p.then((data) => {
  console.log(data);
});
