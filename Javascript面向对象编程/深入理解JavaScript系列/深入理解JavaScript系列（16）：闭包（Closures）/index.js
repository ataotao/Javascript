/**************************************************************************
 * 闭包
 ***************************************************************************/
console.log('------------所有对象都引用一个[[Scope]]------------');

var firstClosure;
var secondClosure;

function foo() {

    var x = 1;

    firstClosure = function () { return ++x; };
    secondClosure = function () { return --x; };

    x = 2; // 影响 AO["x"], 在2个闭包公有的[[Scope]]中

    console.log(firstClosure()); // 3, 通过第一个闭包的[[Scope]]
}

foo();

console.log(firstClosure()); // 4
console.log(secondClosure()); // 3


console.log('------------同一个上下文中创建的闭包是共用一个[[Scope]]属性的。因此上层上下文中的变量“k”是可以很容易就被改变的。------------');

/**
 * ctiveContext.Scope = [
 *   ... // 其它变量对象
 *   {data: [...], k: 3} // 活动对象
 * ];
 * 
 * data[0].[[Scope]] === Scope;
 * data[1].[[Scope]] === Scope;
 * data[2].[[Scope]] === Scope;
 */


var data = [];
// 错误例子
for (var k = 0; k < 3; k++) {
    data[k] = function () {
        console.log(k);
    };
}

data[0](); // 3, 而不是0
data[1](); // 3, 而不是1
data[2](); // 3, 而不是2

// 正确例子
for (var j = 0; j < 3; j++) {
    data[j] = (function _helper(x) {
        return function () {
            console.log(x);
            // 在返回的函数中，如果要获取“j”的值，那么该值还是会是3。
        };
    })(j); // 传入"j"值
}


// 现在结果是正确的了
data[0](); // 0
data[1](); // 1
data[2](); // 2

/*
data[0].[[Scope]] === [
  ... // 其它变量对象
  父级上下文中的活动对象AO: {data: [...], k: 3},
  _helper上下文中的活动对象AO: {x: 0}
];

data[1].[[Scope]] === [
  ... // 其它变量对象
  父级上下文中的活动对象AO: {data: [...], k: 3},
  _helper上下文中的活动对象AO: {x: 1}
];

data[2].[[Scope]] === [
  ... // 其它变量对象
  父级上下文中的活动对象AO: {data: [...], k: 3},
  _helper上下文中的活动对象AO: {x: 2}
];
*/

// 上述提到的方法并不是唯一的方法。通过其他方式也可以获得正确的“k”的值，如下所示：

for (var f = 0; f < 3; f++) {
    (data[f] = function () {
        console.log(arguments.callee.x);
    }).x = f; // 将k作为函数的一个属性
}

// 结果也是对的
data[0](); // 0
data[1](); // 1
data[2](); // 2



console.log('-----------Funarg和return-------------------');
// ECMAScript标准的退出行为如下：

function getElement() {

    [1, 2, 3].forEach(function (element) {
        if (element % 2 == 0) {
            // 返回给函数"forEach"函数
            // 而不是返回给getElement函数
            console.log('found: ' + element); // found: 2
            return element;  //forEach无法退出，需要通过try catch可以实现效果：
        }

    });

    return null;
}
console.log(getElement());

console.log('---------------通过try catch可以实现退出效果：---------------');

(function () {
    var $break = {};

    function getElement() {

        try {
            [1, 2, 3].forEach(function (element) {
                console.log(element); //只循环了2次
                if (element % 2 == 0) {
                    // 从getElement中"返回"
                    console.log('found: ' + element); // found: 2
                    $break.data = element;
                    throw $break;
                }

            });

        } catch (e) {
            if (e == $break) {
                return $break.data;
            }
        }

        return null;
    }

    console.log(getElement()); // 2
})();


/**************************************************************************
 * 闭包用法实战
 ***************************************************************************/

console.log('---------------实际使用的时候，闭包可以创建出非常优雅的设计，允许对funarg上定义的多种计算方式进行定制。如下就是数组排序的例子，它接受一个排序条件函数作为参数：---------------');
var arr = [1, 2, 3];
arr.sort(function (a, b) {
    return b - a;
});
console.log(arr); //arr被改变
console.log('---------------同样的例子还有，数组的map方法是根据函数中定义的条件将原数组映射到一个新的数组中：---------------');

var s1 = [1, 2, 3].map(function (element) {
    return element * 2;
}); // [2, 4, 6]
console.log(s1);
console.log('---------------使用函数式参数，可以很方便的实现一个搜索方法，并且可以支持无限制的搜索条件：---------------');

// someCollection.find(function (element) {
//     return element.someProperty == 'searchCondition';
// });

console.log('---------------还有应用函数，比如常见的forEach方法，将函数应用到每个数组元素：---------------');

[1, 2, 3].forEach(function (element) {
    if (element % 2 != 0) {
        console.log(element);
    }
}); // 1, 3

console.log('---------------顺便提下，函数对象的 apply 和 call方法，在函数式编程中也可以用作应用函数。 apply和call已经在讨论“this”的时候介绍过了；这里，我们将它们看作是应用函数 —— 应用到参数中的函数（在apply中是参数列表，在call中是独立的参数）：---------------');
(function () {
    console.log([].join.call(arguments, ';')); // 1;2;3
}).apply(this, [1, 2, 3]);

console.log('---------------闭包还有另外一个非常重要的应用 —— 延迟调用：---------------');

var a = 10;
setTimeout(function () {
    console.log(a); // 10, after one second
}, 1000);

console.log('---------------还有回调函数---------------');
/*
//...
var x = 10;
// only for example
xmlHttpRequestObject.onreadystatechange = function () {
    // 当数据就绪的时候，才会调用;
    // 这里，不论是在哪个上下文中创建
    // 此时变量“x”的值已经存在了
    console.log(x); // 10
};

//...
*/
console.log('---------------还可以创建封装的作用域来隐藏辅助对象：---------------');

var fooo = {};

// 初始化
(function (object) {

    var x = '获得闭包 x';

    object.getX = function () {
        return x;
    };

})(fooo);

console.log(fooo.getX()); // 获得闭包 "x"
console.log(fooo); 