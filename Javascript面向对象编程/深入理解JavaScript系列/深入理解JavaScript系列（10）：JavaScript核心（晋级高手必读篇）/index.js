/**************************************************************************
 * 原型链（Prototype chain）
 ***************************************************************************/
// 类似于类”A”，”B”，”C”，在ECMAScript中尼创建对象类”a”，”b”，”c”，相应地， 对象“a” 拥有对象“b”和”c”的共同部分。同时对象“b”和”c”只包含它们自己的附加属性或方法。
var a1 = {
    x: 10,
    calculate: function (z) {
        return this.x + this.y + z
    }
};

var b1 = {
    y: 20,
    __proto__: a1
};

var c1 = {
    y: 30,
    __proto__: a1
};

// 调用继承过来的方法
console.log(b1.calculate(30)); // 60
console.log(c1.calculate(40)); // 80
/**************************************************************************
 * 构造函数(Constructor)
 ***************************************************************************/
console.log('除了创建对象，构造函数(constructor) 还做了另一件有用的事情—自动为创建的新对象设置了原型对象(prototype object) 。原型对象存放于 ConstructorFunction.prototype 属性中。');

// 构造函数
function Foo(y) {
    // 构造函数将会以特定模式创建对象：被创建的对象都会有"y"属性
    this.y = y;
}

// "Foo.prototype"存放了新建对象的原型引用
// 所以我们可以将之用于定义继承和共享属性或方法
// 所以，和上例一样，我们有了如下代码：

// 继承属性"x"
Foo.prototype.x = 10;

// 继承方法"calculate"
Foo.prototype.calculate = function (z) {
    return this.x + this.y + z;
};

// 使用foo模式创建 "b" and "c"
var b = new Foo(20);
var c = new Foo(30);

// 调用继承的方法
console.log(b.calculate(30)); // 60
console.log(c.calculate(40)); // 80
console.log(b);
console.log(c);

// 让我们看看是否使用了预期的属性

console.log(

    b.__proto__ === Foo.prototype, // true
    c.__proto__ === Foo.prototype, // true

    // "Foo.prototype"自动创建了一个特殊的属性"constructor"
    // 指向a的构造函数本身
    // 实例"b"和"c"可以通过授权找到它并用以检测自己的构造函数

    b.constructor === Foo, // true
    c.constructor === Foo, // true
    Foo.prototype.constructor === Foo, // true

    b.calculate === b.__proto__.calculate, // true
    b.__proto__.calculate === Foo.prototype.calculate // true

);

/**************************************************************************
 * 变量对象(Variable Object)
 ***************************************************************************/
console.log('变量对象(Variable Object)全局执行上下文情况');
var foo = 10;

function bar() { } // // 函数声明
(function baz() { }); // 函数表达式

console.log(
    this.foo == foo, // true
    window.bar == bar, // true
    this.bar == bar // true
);

// console.log(baz); // 引用错误，baz没有被定义

/**************************************************************************
 * 活动对象(activation object)
 ***************************************************************************/
console.log('活动对象');
function fooA(x, y) {
    var z = 30;
    function bar() { } // 函数声明
    (function baz() { }); // 函数表达式

    console.log(x);
    console.log(y);
    console.log(z);
    console.log(arguments);
    console.log(bar);
    // console.log(baz); //不在当前作用域
}

fooA(10, 20);

/**************************************************************************
 * 作用域链(Scope Chains)
 ***************************************************************************/
console.log('作用域链的原理和原型链很类似，如果这个变量在自己的作用域中没有，那么它会寻找父级的，直到最顶层。');
// 当查找标识符的时候，会从作用域链的活动对象部分开始查找，然后(如果标识符没有在活动对象中找到)查找作用域链的顶部，循环往复，就像作用域链那样。

var x = 10;

(function foo() {
    var y = 20;
    (function bar() {
        var z = 30;
        // "x"和"y"是自由变量
        // 会在作用域链的下一个对象中找到（函数”bar”的互动对象之后）
        console.log(x + y + z);
    })();
})();

/**
 * 在代码执行过程中，如果使用with或者catch语句就会改变作用域链。而这些对象都是一些简单对象，他们也会有原型链。这样的话，作用域链会从两个维度来搜寻。
 * - 首先在原本的作用域链
 * - 每一个链接点的作用域的链（如果这个链接点是有prototype的话）
 */

Object.prototype.x = 10;

var w = 20;
var y = 30;

// 在SpiderMonkey全局对象里
// 例如，全局上下文的变量对象是从"Object.prototype"继承到的
// 所以我们可以得到“没有声明的全局变量”
// 因为可以从原型链中获取

console.log(x); // 10

(function foo() {

    // "foo" 是局部变量
    var w = 40;
    var x = 100;

    // "x" 可以从"Object.prototype"得到，注意值是10哦
    // 因为{z: 50}是从它那里继承的

    with ({ z: 50 }) {
        console.log(w, x, y, z); // 40, 10, 30, 50
    }

    // 在"with"对象从作用域链删除之后
    // x又可以从foo的上下文中得到了，注意这次值又回到了100哦
    // "w" 也是局部变量
    console.log(x, w); // 100, 40

    // 在浏览器里
    // 我们可以通过如下语句来得到全局的w值
    console.log(window.w); // 20

})();


/**************************************************************************
 * 闭包(Closures)
 ***************************************************************************/
console.log('-------------- 闭包 --------------------');

console.log('这种形式的作用域称为静态作用域[static/lexical scope]。上面的xB变量就是在函数fooB的[[Scope]]中搜寻到的。');
function fooB() {
    var xB = 10;
    return function bar() {
        console.log(xB);
    };
}

// "foo"返回的也是一个function
// 并且这个返回的function可以随意使用内部的变量x

var returnedFunction = fooB();

// 全局变量 "xB"
var xB = 20;

// 支持返回的function
returnedFunction(); // 结果是10而不是20

console.log('闭包是一系列代码块（在ECMAScript中是函数），并且静态保存所有父级的作用域。通过这些保存的作用域来搜寻到函数中的自由变量。');

(function () {
    // 全局变量 "x"
    var x = 10;

    // 全局function
    function foo() {
        console.log(x);
    }

    (function (funArg) {

        // 局部变量 "x"
        var x = 20;

        // 这不会有歧义
        // 因为我们使用"foo"函数的[[Scope]]里保存的全局变量"x",
        // 并不是caller作用域的"x"

        funArg(); // 10, 而不是20

    })(foo); // 将foo作为一个"funarg"传递下去
})();

console.log('几个函数可能含有相同的父级作用域（这是一个很普遍的情况，例如有好几个内部或者全局的函数）。在这种情况下，在[[Scope]]中存在的变量是会共享的。一个闭包中变量的变化，也会影响另一个闭包的。');

function baz() {
    var x = 1;
    return {
        foo: function foo() { return ++x; },
        bar: function bar() { return --x; }
    };
}

var closures = baz();

console.log(
    closures.foo(), // 2
    closures.bar()  // 1
);

console.log('在某个循环中创建多个函数时，上图会引发一个困惑。如果在创建的函数中使用循环变量(如”k”)，那么所有的函数都使用同样的循环变量，导致一些程序员经常会得不到预期值。现在清楚为什么会产生如此问题了——因为所有函数共享同一个[[Scope]]，其中循环变量为最后一次复赋值。');

var data = [];

for (var k = 0; k < 3; k++) {
    data[k] = function () {
        console.log(k);
    };
}

//当执行时，k已经为3，大家共享同一个[[Scope]]，其中循环变量为最后一次复赋值。
data[0](); // 3, but not 0
data[1](); // 3, but not 1
data[2](); // 3, but not 2


console.log('有一些用以解决这类问题的技术。其中一种技巧是在作用域链中提供一个额外的对象，比如增加一个函数：');

var dataA = [];

for (var kA = 0; kA < 3; kA++) {
    dataA[kA] = (function (x) {
        return function () {
            console.log(x);
        };
    })(kA); // 将kA当做参数传递进去
}

// 结果正确
dataA[0](); // 0
dataA[1](); // 1
dataA[2](); // 2

/**************************************************************************
 * This指针
 ***************************************************************************/
console.log('-------------- this是执行上下文环境的一个属性，而不是某个变量对象的属性 --------------------');

console.log('在global context(全局上下文)中，this的值就是指全局这个对象，这就意味着，this值就是这个变量本身。');
var x = 10;

console.log(
    this, //window
    x, // 10
    this.x, // 10
    window.x // 10
);


console.log('在函数上下文[function context]中，this会可能会根据每次的函数调用而成为不同的值.this会由每一次caller提供,caller是通过调用表达式[call expression]产生的（也就是这个函数如何被激活调用的）。例如，下面的例子中foo就是一个callee，在全局上下文中被激活。下面的例子就表明了不同的caller引起this的不同。');

// "foo"函数里的alert没有改变
// 但每次激活调用的时候this是不同的

function fooo() {
    console.log(this);
}

// caller 激活 "foo"这个callee，
// 并且提供"this"给这个 callee

fooo(); // 全局对象

fooo.prototype.constructor(); // fooo.prototype

var barr = {
    baz: fooo
};

barr.baz(); // barr

(barr.baz)(); // also barr
(barr.baz = barr.baz)(); // 这是一个全局对象
(barr.baz, barr.baz)(); // 也是全局对象
(false || barr.baz)(); // 也是全局对象

var otherFooo = barr.baz;
otherFooo(); // 还是全局对象
