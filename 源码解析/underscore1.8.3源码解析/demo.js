var obj = { a: 1, b: 2 };
var arr = [1, 2, 3];
function eachFn(value, key, list) {
    // console.log(this);
    console.log(value, '_.each');
    //var textnode = document.createTextNode(key);
    //this.appendChild(textnode);
}

function mapFn(value, key, list) {
    return value + ':' + key;
}

/**
 * 
 * @param {Memo是reduce函数的初始值} memo
 * @param {当前的值} value
 * @param {index或key} index
 * @param {绑定的list} list
 * @returns
 */
function reduceFn(memo, value, index, list) {
    return this.num = memo + num;
    // return memo + num;
}

/**
 * 
 * @param {Memo是reduce函数的初始值} memo
 * @param {当前的值} value
 * @param {index或key} index
 * @param {绑定的list} list
 * @returns
 */
function reduceRightFn(memo, value, index, list) {
    
    return memo.concat(value);
}

/****************************************
* _.each(list, iteratee, [context]) 
*****************************************/
// _.each(obj, eachFn, document.getElementById('test'));


/****************************************
 * _.map(list, iteratee, [context])
 ****************************************/

// var results = _.map(obj, mapFn, document.getElementById('test'));

//如果传入的value为null，亦即没有传入iteratee，则iteratee的行为只是返回当前迭代元素自身，比如
//var results = _.map([1,2,3]); // => results：[1,2,3]

// 如果传入了一个key，那么显示出来的结果是对应name的 ['yoyoyohamapi', 'wxj'];
// var results： = _.map([{name:'yoyoyohamapi',id:1},{name:'wxj',id:2}],'name'); // => results：['yoyoyohamapi','wxj']

// 如果value传入的是一个对象，那么返回的iteratee（_.matcher）的目的是想要知道当前被迭代元素是否匹配给定的这个对象：
// var results = _.map([{name:'atao'},{name: 'chen',age:33}], {name: 'chen'});
// => results: [false,true]

//underscore支持通过覆盖其提供的_.iteratee函数来自定义iteratee，更确切的说，来自己决定如何产生一个iteratee：
// _.iteratee = function (value, context) {
//     // 现在，value为对象时，也是返回自身  
//     if (value == null || _.isObject(value)) return _.identity;
//     if (_.isFunction(value)) return optimizeCb(value, context, argCount);
//     return _.property(value);
// }
// var results = _.map([{ name: 'atao' }, { name: 'chen', age: 33 }], { name: 'chen' });

// console.log(results, '_.map');


/***********************************************************
 * _.reduce(list, iteratee, [memo], [context]) 
 * memo相当于上一个迭代的值
 * 如果没有memo传递给reduce的初始调用，iteratee不会被列表中的第一个元素调用。第一个元素将取代 传递给列表中下一个元素调用iteratee的memo参数。
 * 有了reduce，我们可以轻松实现二维数组的扁平化：
 ***********************************************************/

// var results = _.reduce(arr, reduceFn, 0, obj);
// console.log(results);

// 二维数组扁平化
// var matrix = [
//   [1, 2],
//   [3, 4],
//   [5, 6]
// ];

// var flatten = _.reduce(matrix, function (previous, current) {
//   return previous.concat(current);
// });

// console.log(flatten); // [1, 2, 3, 4, 5, 6]

/***********************************************************
 * _.reduceRight(list, iteratee, memo, [context]) 
 * _.reduce和_.reduceRight的区别只是倒序
 * var a = ["1", "2", "3", "4", "5"]; 
 * var left  = _.reduce(a, function(prev, cur)      { return prev + cur; }); 
 * var right = _.reduceRight(a, function(prev, cur) { return prev + cur; }); 
 * console.log(left);  // "12345"
 * console.log(right); // "54321"
 ************************************************************/
// var results = _.reduceRight(arr, reduceRightFn, [], obj);
// console.log(results);

/**
 * _.find(list, predicate, [context]) 
 * 在list中逐项查找，返回第一个通过predicate迭代函数真值检测的元素值，如果没有值传递给测试迭代器将返回undefined。 如果找到匹配的元素，函数将立即返回，不会遍历整个list。
 */
// var even = _.find([1, 2, 3, 4, 5, 6], function(num, key, list){ 
//     return num % 2 == 0; 
// });
// console.log(even);
