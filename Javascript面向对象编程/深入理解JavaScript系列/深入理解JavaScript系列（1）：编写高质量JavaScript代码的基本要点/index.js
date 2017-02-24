/**************************************************************************
 * 当不是数组，而是一个HTMLCollection对象的时候。测试缓存length和不缓存的性能差异
 ***************************************************************************/

console.log('------------当不是数组，而是一个HTMLCollection对象的时候。测试缓存length和不缓存的性能差异------------');
var listBox = document.getElementById('listBox');

for (var index = 0; index <= 500; index++) {
    listBox.innerHTML += '<li>' + index + '</li>';
}
var listArray = document.querySelectorAll('li');

//缓存数组的结果
console.time('forEach-one');
for (var i = 0, max = listArray.length; i < max; i++) {
    if (i === listArray.length - 1) {
        console.timeEnd('forEach-one');
    }
}

//未缓存的结果
console.time('forEach-two');
for (var j = 0; j < document.querySelectorAll('li').length; j++) {
    if (j === listArray.length - 1) {
        console.timeEnd('forEach-two');
    }
}

/****************************************************************************
 * for in 最佳实践
 ***************************************************************************/
console.log('------------for in 最佳实践 hasOwnProperty------------');
// 对象
var obj = {
    hands: 'hands',
    legs: 'legs',
    heads: 'heads'
};

// 在代码的某个地方一个方法添加给了所有对象
if (typeof Object.prototype.clone === 'undefined') {
    Object.prototype.clone = function () { };
}

//严格来说，不使用hasOwnProperty()并不是一个错误。根据任务以及你对代码的自信程度，你可以跳过它以提高些许的循环速度。
//但是当你对当前对象内容（和其原型链）不确定的时候，添加hasOwnProperty()更加保险些。
for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
        var element = obj[key];
        console.log(element);
    }
}

