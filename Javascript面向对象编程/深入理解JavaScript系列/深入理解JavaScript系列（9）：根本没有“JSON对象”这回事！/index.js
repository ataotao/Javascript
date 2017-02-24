/**************************************************************************
 * 何时是JSON，何时不是JSON？
 ***************************************************************************/
console.log('*----------何时是JSON，何时不是JSON？-------------');
// JSON是设计成描述数据交换格式的，他也有自己的语法，这个语法是JavaScript的一个子集。
// { "prop": "val" } 这样的声明有可能是JavaScript对象字面量也有可能是JSON字符串，取决于什么上下文使用它，如果是用在string上下文（用单引号或双引号引住，或者从text文件读取）的话，那它就是JSON字符串，如果是用在对象字面量上下文中，那它就是对象字面量。

// 这是JSON字符串
var foo = '{ "prop": "val" }';
console.log(foo);
// 这是对象字面量
var bar = { "prop": "val" };
console.log(bar);

/**************************************************************************
 * 真正的JSON对象
 ***************************************************************************/
console.log('-----------------真正的JSON对象------------------');
// 开头已经提到，对象字面量不是JSON对象，但是有真正的JSON对象。但是两者完全不一样概念，在新版的浏览器里JSON对象已经被原生的内置对象了，目前有2个静态方法：JSON.parse用来将JSON字符串反序列化成对象，JSON.stringify用来将对象序列化成JSON字符串。老版本的浏览器不支持这个对象，但你可以通过json2.js来实现同样的功能。

// 这是JSON字符串，比如从AJAX获取字符串信息
var my_json_string = '{"prop": "val" }';
console.log(my_json_string, 'my_json_string');

// 将字符串反序列化成对象
var my_obj = JSON.parse(my_json_string);
console.log(my_obj, 'my_obj');

console.log(my_obj.prop == 'val', 'my_obj.prop == "val"'); //  提示 true, 和想象的一样!

// 将对象序列化成JSON字符串
var my_other_json_string = JSON.stringify(my_obj);
console.log(my_other_json_string, 'my_other_json_string');

var my_obj1 = JSON.parse(my_other_json_string);

console.log(my_obj == my_obj1);


/**
 * Date.prototype.toJSON()
 */

console.log('------------toJSON() 方法返回 Date 对象的字符串形式。---------------');
var jsonDate = (new Date()).toJSON();
var backToDate = new Date(jsonDate);

console.log(jsonDate);
console.log(backToDate);