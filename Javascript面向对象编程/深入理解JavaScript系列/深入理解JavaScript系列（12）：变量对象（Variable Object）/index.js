/**************************************************************************
 * 不同执行上下文中的变量对象
 ***************************************************************************/
console.log('------------全局上下文中的变量对象------------');
var a = new String('test');

console.log(a); // 直接访问，在VO(globalContext)里找到："test"

console.log(window['a']); // 间接通过global访问：global === VO(globalContext): "test"
console.log(a === this.a); // true

var aKey = 'a';
console.log(window[aKey]); // 间接通过动态属性名称访问："test"

console.log('------------函数上下文中的变量对象------------');

/**
 * 
 * 在函数执行上下文中，VO是不能直接访问的，此时由活动对象(activation object,缩写为AO)扮演VO的角色。
 * VO(functionContext) === AO;
 * 活动对象是在进入函数上下文时刻被创建的，它通过函数的arguments属性初始化。arguments属性的值是Arguments对象：
 * 
 * AO = {
 *   arguments: <ArgO>
 * };
 * Arguments对象是活动对象的一个属性，它包括如下属性：
 * callee — 指向当前函数的引用
 * length — 真正传递的参数个数
 * properties-indexes (字符串类型的整数) 属性的值就是函数的参数值(按参数列表从左到右排列)。 properties-indexes内部元素的个数等于arguments.length. 
 * roperties-indexes 的值和实际传递进来的参数之间是共享的。
 * 
 */
function foo(x, y, z) {

    // 声明的函数参数数量arguments (x, y, z)
    console.log(foo.length); // 3

    // 真正传进来的参数个数(only x, y)
    console.log(arguments.length); // 2

    // 参数的callee是函数自身
    console.log(arguments.callee === foo); // true

    // 参数共享

    console.log(x === arguments[0]); // true
    console.log(x); // 10

    arguments[0] = 20;
    console.log(x); // 20

    x = 30;
    console.log(arguments[0]); // 30

    // 不过，没有传进来的参数z，和参数的第3个索引值是不共享的

    z = 40;
    console.log(arguments[2]); // undefined

    arguments[2] = 50;
    console.log(z); // 40

}

foo(10, 20);


console.log('----------看下函数声明和变量申明重复时的状态-----------');

/**
 * 执行步骤
 * VO = {};
 * VO['x'] = <reference to FunctionDeclaration "x">
 * 
 *  // 找到var x = 10;
 *  // 如果function "x"没有已经声明的话
 *  // 这时候"x"的值应该是undefined
 *  // 但是这个case里变量声明没有影响同名的function的值
 * 
 * VO['x'] = <the value is not disturbed, still function>
 * 
 * 紧接着，在执行代码阶段，VO做如下修改：
 * VO['x'] = 10;
 * VO['x'] = 20;
 */

console.log(x); // function
var x = 10;
console.log(x); // 10
x = 20;
function x() { }
console.log(x); // 20 不会打印x函数


console.log('----------在下面的例子里我们可以再次看到，变量是在进入上下文阶段放入VO中的。(因为，虽然else部分代码永远不会执行，但是不管怎样，变量“b”仍然存在于VO中。-----------');

if (true) {
    var aa = 1;
} else {
    var bb = 2;
}

console.log(aa); // 1
console.log(bb); // undefined,不是bb没有声明，而是bb的值是undefined



a = 10;
console.log(window.a); // 10

console.log(delete window.a); // true

console.log(window.a); // undefined

var b = 20;
console.log(window.b); // 20

console.log(delete window.b); // false

console.log(window.b); // still 20