/**************************************************************************
 * ECMAScript标准里的执行上下文和相关可执行代码的各种类型。
 ***************************************************************************/
console.log('------------函数代码------------');
(function foo(bar) {
    if (bar) {
        return;
    }
    foo(true);
})();

console.log('------------eval 代码有一个概念： 调用上下文(calling context),例如，eval函数调用的时候产生的上下文。eval(变量或函数声明)活动会影响调用上下文(calling context)。------------');
eval('var x = 10');

(function foo() {
    eval('var y = 20');
})();

console.log(x); // 10
//console.log(y); // "y" 提示没有声明


console.log('------------在版本号1.7以上的SpiderMonkey(内置于Firefox,Thunderbird)的实现中，可以把调用上下文作为第二个参数传递给eval。那么，如果这个上下文存在，就有可能影响“私有”(有人喜欢这样叫它)变量。------------');

function foo() {
    var x = 1;
    return function () {
        console.log(x);
    };
}

var bar = foo();

bar(); // 1

eval('x = 2', bar); // 传入上下文，影响了内部的var x 变量

bar(); // 2  

// 这段代码只能在SpiderMonkey1.7以上的解释器执行，firefox用的是这个解释器。
// 而chrome用的是V8解释器，目前还不支持。所以不推荐使用这种方式的代码。