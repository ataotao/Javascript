/**************************************************************************
 * 自执行函数表达式
 ***************************************************************************/
// 下面2个括弧()都会立即执行

(function () { /* code */ }()); // 推荐使用这个
(function () { /* code */ })(); // 但是这个也是可以用的

// 由于括弧()和JS的&&，异或，逗号等操作符是在函数表达式和函数声明上消除歧义的
// 所以一旦解析器知道其中一个已经是表达式了，其它的也都默认为表达式了
// 不过，请注意下一章节的内容解释

var j = function () { return 10; }();
var iA = true && function () { return 20; }();
0, function () { console.log(111); }();

console.log(j);
console.log(iA);


// 如果你不在意返回值，或者不怕难以阅读
// 你甚至可以在function前面加一元操作符号

!function () { /* code */ }();
~function () { /* code */ }();
-function () { /* code */ }();
+function () { /* code */ }();

// 还有一个情况，使用new关键字,也可以用，但我不确定它的效率
// http://twitter.com/kuvos/status/18209252090847232

new function () { /* code */ };
new function () { /* code */ }(); // 如果需要传递参数，只需要加上括弧()

/**************************************************************************
 * 用闭包保存状态
 ***************************************************************************/
console.log('------------------用闭包保存状态-------------------');

// 这个代码是错误的，因为变量i从来就没背locked住
// 相反，当循环执行以后，我们在点击的时候i才获得数值
// 因为这个时候i操真正获得值
// 所以说无论点击那个连接，最终显示的都是I am link #10（如果有10个a元素的话）

var elemsA = document.getElementsByTagName('a');
for (var i = 0; i < elemsA.length; i++) {
    elemsA[i].addEventListener('click', function (e) {
        e.preventDefault();
        console.log('I am link #' + i);
    }, 'false');
}

// 这个是可以用的，因为他在自执行函数表达式闭包内部
// i的值作为locked的索引存在，在循环执行结束以后，尽管最后i的值变成了a元素总数（例如10）
// 但闭包内部的lockedInIndex值是没有改变，因为他已经执行完毕了
// 所以当点击连接的时候，结果是正确的

var elemsB = document.getElementsByTagName('a');
for (var iB = 0; iB < elemsB.length; iB++) {
    (function (lockedInIndex) {
        elemsB[iB].addEventListener('click', function (e) {
            e.preventDefault();
            console.log('I am link #' + lockedInIndex);
        }, 'false');
    })(iB);
}

// 你也可以像下面这样应用，在处理函数那里使用自执行函数表达式
// 而不是在addEventListener外部
// 但是相对来说，上面的代码更具可读性

var elemsC = document.getElementsByTagName('a');
for (var iC = 0; iC < elemsC.length; iC++) {
    elemsC[iC].addEventListener('click', (function (lockedInIndex) {
        return function (e) {
            e.preventDefault();
            console.log('I am link #' + lockedInIndex);
        };
    })(iC), 'false');
}
//其实，上面2个例子里的lockedInIndex变量，也可以换成i，因为和外面的i不在一个作用于，所以不会出现问题，这也是匿名函数+闭包的威力。

/**************************************************************************
 * 最后的旁白：Module模式
 ***************************************************************************/
console.log('------------------最后的旁白：Module模式-------------------');

// 创建一个立即调用的匿名函数表达式
// return一个变量，其中这个变量里包含你要暴露的东西
// 返回的这个变量将赋值给counter，而不是外面声明的function自身

var counter = (function () {
    var i = 0;
    return {
        get: function () {
            return i;
        },
        set: function (val) {
            i = val;
        },
        increment: function () {
            return ++i;
        }
    };
}());

// counter是一个带有多个属性的对象，上面的代码对于属性的体现其实是方法

console.log(counter.get()); // 0
counter.set(3);
console.log(counter.get()); // 3
console.log(counter.increment()); // 4
console.log(counter.increment()); // 5