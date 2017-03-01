/**************************************************************************
 * 全局代码中的this this与上下文中可执行代码的类型有直接关系，this值在进入上下文时确定，并且在上下文运行期间永久不变。
 ***************************************************************************/
console.log('------------全局代码中this始终是全局对象本身，这样就有可能间接的引用到它了。------------');
// 显示定义全局对象的属性
this.a = 10; // global.a = 10
console.log(a); // 10

// 通过赋值给一个无标示符隐式
b = 20;
console.log(this.b); // 20

// 也是通过变量声明隐式声明的
// 因为全局上下文的变量对象是全局对象自身
var c = 30;
console.log(this.c); // 30

/**************************************************************************
 * 函数代码中的this
 ***************************************************************************/
console.log('------------在通常的函数调用中，this是由激活上下文代码的调用者来提供的，即调用函数的父上下文(parent context )。this取决于调用函数的方式。------------');
var foo = { x: 10 };

var bar = {
    x: 20,
    test: function () {
        console.log(this, 'this');
        console.log(this === bar, 'this === bar');
        console.log(this.x, 'this.x');
        //this = foo; // 错误，任何时候不能改变this的值
    }

};

// 在进入上下文的时候
// this被当成bar对象
// determined as "bar" object; why so - will
// be discussed below in detail

bar.test(); // true, 20

foo.test = bar.test;

// 不过，这里this是foo
// 尽管调用的是相同的function

foo.test(); // false, 10
console.log('---------------即使是正常的全局函数也会被调用方式的不同形式激活，这些不同的调用方式导致了不同的this值-----------------------');

function fooA() {
    console.log(this);
}

fooA(); // global

console.log(fooA === fooA.prototype.constructor); // true

// 但是同一个function的不同的调用表达式，this是不同的

fooA.prototype.constructor(); // foo.prototype

console.log('---------------有可能作为一些对象定义的方法来调用函数，但是this将不会设置为这个对象。-----------------------');

var fooB = {
    bar: function () {
        console.log(this, 'this');
        console.log(this === fooB, 'this === fooB');
    }
};

fooB.bar(); // fooB, true

var exampleFunc = fooB.bar;

console.log(exampleFunc === fooB.bar, 'exampleFunc === fooB.bar'); // true

// 再一次，同一个function的不同的调用表达式，this是不同的

exampleFunc(); // global, false

console.log('-----------引用类型（Reference type）------------------------');


(function () {
    function foo() {
        console.log(this);
    }

    foo(); // global, because

    console.log(foo === foo.prototype.constructor); // true

    // 另外一种形式的调用表达式

    foo.prototype.constructor(); // foo.prototype, because

}());

(function () {

    function foo(t) {
        console.log(this.bar, t + '.bar');
    }

    var x = { bar: 10 };
    var y = { bar: 20 };

    x.test = foo;
    y.test = foo;

    x.test('x'); // 10
    y.test('y'); // 20

}());

console.log('-----------函数调用和非引用类型------------------------');
// 我们有一个函数对象但不是引用类型的对象（它不是标示符，也不是属性访问器），相应地，this值最终设为全局对象。

/**
 * 
 * 为什么我们有一个属性访问器，它的中间值应该为引用类型的值，在某些调用中我们得到的this值不是base对象，而是global对象？
 * 问题在于后面的三个调用，在应用一定的运算操作之后，在调用括号的左边的值不在是引用类型。
 * 
 * 第一个例子很明显———明显的引用类型，结果是，this为base对象，即foo。
 * 第二个例子中，组运算符并不适用，想想上面提到的，从引用类型中获得一个对象真正的值的方法，如GetValue。相应的，在组运算的返回中———我们得到仍是一个引用类型。这就是this值为什么再次设为base对象，即foo。
 * 第三个例子中，与组运算符不同，赋值运算符调用了GetValue方法。返回的结果是函数对象（但不是引用类型），这意味着this设为null，结果是global对象。
 * 第四个和第五个也是一样——逗号运算符和逻辑运算符（OR）调用了GetValue 方法，相应地，我们失去了引用而得到了函数。并再次设为global。

 */

(function () {

    var foo = {
        bar: function () {
            console.log(this);
        }
    };

    foo.bar(); // Reference, OK => foo
    (foo.bar)(); // Reference, OK => foo

    (foo.bar = foo.bar)(); // global?
    (false || foo.bar)(); // global?
    (foo.bar, foo.bar)(); // global?
    console.log(foo.bar, foo.bar);  //逗号运算符和逻辑运算符（OR）调用了GetValue 方法，相应地，我们失去了引用而得到了函数。并再次设为global
}());


console.log('-----------引用类型和this为null-------------------');
// 有一种情况是这样的：当调用表达式限定了call括号左边的引用类型的值， 尽管this被设定为null，但结果被隐式转化成global。当引用类型值的base对象是被活动对象时，这种情况就会出现。
(function () {
    function foo() {
        function bar() {
            console.log(this); // global
        }
        bar(); // the same as AO.bar()
    }

    foo();

}());

console.log('-----------活动对象总是作为this返回，值为null——（即伪代码的AO.bar()相当于null.bar()）。这里我们再次回到上面描述的例子，this设置为全局对象。-------------------');

// 有一种情况除外：如果with对象包含一个函数名属性，在with语句的内部块中调用函数。With语句添加到该对象作用域的最前端，即在活动对象的前面。相应地，也就有了引用类型（通过标示符或属性访问器）， 其base对象不再是活动对象，而是with语句的对象。顺便提一句，它不仅与内部函数相关，也与全局函数相关，因为with对象比作用域链里的最前端的对象(全局对象或一个活动对象)还要靠前。
(function () {

    var x = 10;
    var obj = {
        foo: function () {
            console.log(this.x);
        },
        x: 20

    };

    with (obj) {
        foo(); // 20
    }

}());

console.log('同样的情况出现在catch语句的实际参数中函数调用：在这种情况下，catch对象添加到作用域的最前端，即在活动对象或全局对象的前面。但是，这个特定的行为被确认为ECMA-262-3的一个bug，这个在新版的ECMA-262-5中修复了。这样，在特定的活动对象中，this指向全局对象。而不是catch对象。');

try {
    throw function () {
        console.log(this, 'ES3标准里是__catchObject, ES5标准里是global');
    };
} catch (e) {
    e(); // ES3标准里是__catchObject, ES5标准里是global 
}



console.log('同样的情况出现在命名函数（函数的更对细节参考第15章Functions）的递归调用中。在函数的第一次调用中，base对象是父活动对象（或全局对象），在递归调用中，base对象应该是存储着函数表达式可选名称的特定对象。但是，在这种情况下，this总是指向全局对象。');

(function foo(bar) {

    console.log(this);

    !bar && foo(1); // "should" be special object, but always (correct) global

})(); // global


console.log('作为构造器调用的函数中的this');
// 还有一个与this值相关的情况是在函数的上下文中，这是一个构造函数的调用。
// 在这个例子中，new运算符调用“A”函数的内部的[[Construct]] 方法，接着，在对象创建后，调用内部的[[Call]] 方法。 所有相同的函数“A”都将this的值设置为新创建的对象。

(function () {
    function A() {
        console.log(this); // "a"对象下创建一个新属性
        this.x = 10;
    }
    var a = new A();
    console.log(a.x); // 10
}());

console.log('函数调用中手动设置this');
// 在函数原型中定义的两个方法（因此所有的函数都可以访问它）允许去手动设置函数调用的this值。它们是.apply和.call方法。
// 他们用接受的第一个参数作为this值，this 在调用的作用域中使用。
// 这两个方法的区别很小，对于.apply，第二个参数必须是数组（或者是类似数组的对象，如arguments，反过来，.call能接受任何参数。两个方法必须的参数是第一个——this。
(function () {

    window.bB = 10;

    function a(c) {
        console.log(this.bB);
        console.log(c);
    }

    a(20); // this === global, this.b == 10, c == 20
    a.call({ bB: 20 }, 30); // this === {b: 20}, this.b == 20, c == 30
    a.apply({ bB: 30 }, [40]); // this === {b: 30}, this.b == 30, c == 40


}());