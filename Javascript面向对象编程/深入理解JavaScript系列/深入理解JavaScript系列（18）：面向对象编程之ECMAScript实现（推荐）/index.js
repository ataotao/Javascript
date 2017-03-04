/**************************************************************************
 * Object类型
 ***************************************************************************/
console.log('------------动态性------------');

// ES中的对象是完全动态的。这意味着，在程序执行的时候我们可以任意地添加，修改或删除对象的属性。

var foo = { x: 10 };

// 添加新属性
foo.y = 20;
console.log(foo); // {x: 10, y: 20}

// 将属性值修改为函数
foo.x = function () {
    console.log('foo.x');
};

foo.x(); // 'foo.x'

// 删除属性
delete foo.x;
console.log(foo); // {y: 20}

console.log('------------有些属性不能被修改——（只读属性、已删除属性或不可配置的属性）。 我们将稍后在属性特性里讲解。------------');
// 另外，ES5规范规定，静态对象不能扩展新的属性，并且它的属性页不能删除或者修改。他们是所谓的冻结对象，可以通过应用Object.freeze(o)方法得到。

(function () {
    var foo = { x: 10 };

    // 冻结对象
    Object.freeze(foo);
    console.log(Object.isFrozen(foo)); // true

    // 不能修改
    foo.x = 100;

    // 不能扩展
    foo.y = 200;

    // 不能删除
    delete foo.x;

    console.log(foo); // {x: 10}
})();


console.log('------------在ES5规范里，也使用Object.preventExtensions(o)方法防止扩展，或者使用Object.defineProperty(o)方法来定义属性：------------');

(function () {

    var foo = { x: 10 };

    Object.defineProperty(foo, 'y', {
        value: 20,
        writable: false, // 只读
        configurable: false // 不可配置
    });

    // 不能修改
    foo.y = 200;

    // 不能删除
    delete foo.y; // false

    // 防治扩展
    Object.preventExtensions(foo);
    console.log(Object.isExtensible(foo)); // false

    // 不能添加新属性
    foo.z = 30;

    console.log(foo); //{ x: 10, y: 20 }

})();

console.log('-------属性的特性------');
var fa = { a: 1, b: 2 };
var fooA = {};
fooA.__proto__ = fa;

Object.defineProperty(fooA, 'x', {
    value: 10,
    writable: false, // 即{ReadOnly} = false 忽略向属性赋值的写操作尝，但只读属性可以由宿主环境行为改变——也就是说不是“恒定值” ;
    enumerable: false, // 即{DontEnum} = true 属性不能被for..in循环枚举
    configurable: false // 即{DontDelete} = false delete操作符的行为被忽略（即删不掉）
});

console.log(fooA.x); // 10

console.log(fooA.x = 20, '设置 fooA.x = 20');

for (var key in fooA) {
    if (fooA.hasOwnProperty(key)) {
        var element = fooA[key];
        console.log(element);
        //没有输出值
    }
}

// 通过descriptor获取特性集attributes
var desc = Object.getOwnPropertyDescriptor(fooA, 'x');

console.log(desc.enumerable); // false
console.log(desc.writable); // false

console.log(delete fooA.x, 'delete fooA.x');

console.log(fooA);


/**************************************************************************
 * 构造函数
 ***************************************************************************/
console.log('----------------ECMAScript中的对象是通过所谓的构造函数来创建的。---------------');
// 注意，用户代码只能在初始化阶段访问，虽然在初始化阶段我们可以返回不同的对象（忽略第一阶段创建的tihs对象）：

function A() {
    // 更新新创建的对象
    this.x = 10;
    // 但返回的是不同的对象
    return [1, 2, 3];
}

var a = new A();
console.log(a.x, a); //undefined, [1, 2, 3];

console.log('----------------内部方法[[Construct]]是通过使用带new运算符的构造函数来激活的，正如我们所说的这个方法是负责内存分配和对象创建的。如果没有参数，调用构造函数的括号也可以省略：---------------');

function AA(x) { // constructor А
    this.x = x || 10;
}

// 不传参数的话，括号也可以省略
var aa = new AA; // or new A();
console.log(aa.x); // 10

// 显式传入参数x
var bb = new AA(20);
console.log(bb.x); // 20


console.log('----------------对象创建的算法----------------------');
/**
 * 请注意两个主要特点：
 * 首先，新创建对象的原型是从当前时刻函数的prototype属性获取的（这意味着同一个构造函数创建的两个创建对象的原型可以不同是因为函数的prototype属性也可以不同）。
 * 其次，正如我们上面提到的，如果在对象初始化的时候，[[Call]]返回的是对象，这恰恰是用于整个new操作符的结果：
 */
(function () {
    function A() { }
    A.prototype.x = 10;

    var a = new A();
    console.log(a.x); // 10 – 从原型上得到

    // 设置.prototype属性为新对象
    // 为什么显式声明.constructor属性将在下面说明
    A.prototype = {
        constructor: A,
        y: 100
    };

    var aa = new A();
    // 对象"aa"有了新属性
    console.log(aa.x); // undefined
    console.log(aa.y); // 100 – 从原型上得到
    console.log(a);
    console.log(aa);

    // 但a对象的原型依然可以得到原来的结果
    console.log(a.x); // 10 - 从原型上得到

    function B() {
        this.x = 10;
        return new Array();
    }

    // 如果"B"构造函数没有返回（或返回this）
    // 那么this对象就可以使用，但是下面的情况返回的是array
    var b = new B();
    console.log(b.x); // undefined
    console.log(Object.prototype.toString.call(b)); // [object Array]


})();



/**************************************************************************
 * 原型
 ***************************************************************************/
console.log('----------------属性构造函数(Property constructor)---------------');

// 上面的例子有有2个重要的知识点，第一个是关于函数的constructor属性的prototype属性，在函数创建的算法里，我们知道constructor属性在函数创建阶段被设置为函数的prototype属性，constructor属性的值是函数自身的重要引用：
(function () {

    function A() { }
    var a = new A();
    console.log(a.constructor); // function A() {}, by delegation
    console.log(a.constructor === A); // true

})();


// 通常在这种情况下，存在着一个误区：constructor构造属性作为新创建对象自身的属性是错误的，但是，正如我们所看到的的，这个属性属于原型并且通过继承来访问对象。

console.log('---------------通过继承constructor属性的实例，可以间接得到的原型对象的引用：---------------');
(function () {
    function A() { }
    A.prototype.x = new Number(10);

    var a = new A();
    console.log(a.constructor.prototype); // [object Object]

    console.log(a.x); // 10, 通过原型
    // 和a.[[Prototype]].x效果一样
    console.log(a.constructor.prototype.x); // 10

    console.log(a.constructor.prototype.x === a.x); // true

    console.log(a);

})();

console.log(`----------------------------
但请注意，函数的constructor和prototype属性在对象创建以后都可以重新定义的。在这种情况下，对象失去上面所说的机制。如果通过函数的prototype属性去编辑元素的prototype原型的话（添加新对象或修改现有对象），实例上将看到新添加的属性。

然而，如果我们彻底改变函数的prototype属性（通过分配一个新的对象），那原始构造函数的引用就是丢失，这是因为我们创建的对象不包括constructor属性：
---------------`);
(function () {
    function A() { }
    A.prototype = {
        x: 10
    };

    var a = new A();
    console.log(a.x); // 10
    console.log(a.constructor === A); // false!
    console.log(a);

})();


console.log('----------------------------因此，对函数的原型引用需要手工恢复：---------------');
(function () {
    function A() { }
    A.prototype = {
        constructor: A, //注释掉看看  function A() { }会不输出
        x: 10
    };

    var a = new A();
    console.log(a.x); // 10
    console.log(a.constructor === A); // true
    console.log(a);

    for (var key in A.prototype) {
        if (A.prototype.hasOwnProperty(key)) {
            var element = A.prototype[key];
            console.log(element);
        }
    }

})();

console.log('----------------------------注意虽然手动恢复了constructor属性，和原来丢失的原型相比，{DontEnum}enumerable特性没有了，也就是说A.prototype里的for..in循环语句不支持了，不过第5版规范里，通过[[Enumerable]] 特性提供了控制可枚举状态enumerable的能力。----------------------------');

(function () {

    var foo = { x: 10 };

    Object.defineProperty(foo, 'y', {
        value: 20,
        enumerable: false // aka {DontEnum} = true
    });

    console.log(foo.x, foo.y); // 10, 20

    for (var k in foo) {
        console.log(k); // only "x"
    }

    var xDesc = Object.getOwnPropertyDescriptor(foo, 'x');
    var yDesc = Object.getOwnPropertyDescriptor(foo, 'y');

    console.log(
        xDesc.enumerable, // true
        yDesc.enumerable  // false
    );

})();

console.log('------------对象的原型是对象的创建的时候创建的，并且在此之后不能修改为新的对象，如果依然引用到同一个对象，可以通过构造函数的显式prototype引用，对象创建以后，只能对原型的属性进行添加或修改。---------------');

(function () {

    function A() { }
    A.prototype.x = 10;

    var a = new A();
    console.log(a.x); // 10


    A.prototype = {
        constructor: A,
        x: 20,
        y: 30
    };

    // 对象a是通过隐式的[[Prototype]]引用从原油的prototype上获取的值
    console.log(a.x); // 10
    console.log(a.y); // undefined
    var b = new A();

    // 但新对象是从新原型上获取的值
    console.log(b.x); // 20
    console.log(b.y); // 30

    console.log(a.__proto__);
    console.log(b.__proto__);

})();


console.log('------------对象独立于构造函数---------------');
// 因为实例的原型独立于构造函数和构造函数的prototype属性，构造函数完成了自己的主要工作（创建对象）以后可以删除。原型对象通过引用[[Prototype]]属性继续存在：
(function () {

    function A() { }
    A.prototype.x = 10;

    var a = new A();
    console.log(a.x); // 10

    // 设置A为null - 显示引用构造函数
    A = null;

    // 但如果.constructor属性没有改变的话，
    // 依然可以通过它创建对象
    var b = new a.constructor();
    console.log(b.x); // 10

    // 隐式的引用也删除掉
    delete a.constructor.prototype.constructor;
    delete b.constructor.prototype.constructor;

    // 通过A的构造函数再也不能创建对象了
    // 但这2个对象依然有自己的原型
    console.log(a.x); // 10
    console.log(b.x); // 10

})();


console.log('----------------原型可以存放方法并共享属性------------------------');
(function () {
    // 大部分程序里使用原型是用来存储对象的方法、默认状态和共享对象的属性。
    // 事实上，对象可以拥有自己的状态 ，但方法通常是一样的。 因此，为了内存优化，方法通常是在原型里定义的。 这意味着，这个构造函数创建的所有实例都可以共享找个方法。

    function A(x) {
        this.x = x || 100;
    }

    A.prototype = (function () {

        // 初始化上下文
        // 使用额外的对象

        var _someSharedVar = 500;

        function _someHelper() {
            console.log('internal helper: ' + _someSharedVar);
        }

        function method1() {
            console.log('method1: ' + this.x);
        }

        function method2() {
            console.log('method2: ' + this.x);
            _someHelper();
        }

        // 原型自身
        return {
            constructor: A,
            method1: method1,
            method2: method2
        };

    })();

    var a = new A(10);
    var b = new A(20);

    a.method1(); // method1: 10
    a.method2(); // method2: 10, internal helper: 500

    b.method1(); // method1: 20
    b.method2(); // method2: 20, internal helper: 500

    // 2个对象使用的是原型里相同的方法
    console.log(a.method1 === b.method1); // true
    console.log(a.method2 === b.method2); // true


})();


/**************************************************************************
 * 原型链
 ***************************************************************************/
console.log('-------------------让我们展示如何为用户定义对象创建原型链，非常简单：---------------------');

(function () {

    function A() {
        console.log('A.[[Call]] activated');
        this.x = 10;
    }

    A.prototype.y = 20;

    var a = new A();
    console.log([a.x, a.y]); // 10 (自身), 20 (继承)

    function B() { }

    // 最近的原型链方式就是设置对象的原型为另外一个新对象
    B.prototype = new A();

    // 修复原型的constructor属性，否则的话是A了 
    B.prototype.constructor = B;

    var b = new B();
    console.log([b.x, b.y]); // 10, 20, 2个都是继承的

    console.log(a);
    console.log(b);

})();



console.log(`
---------------在父类的构造函数有太多代码的话也是一种缺点。----------------
解决这些“功能”和问题，程序员使用原型链的标准模式（下面展示），主要目的就是在中间包装构造函数的创建，这些包装构造函数的链里包含需要的原型。
`);

(function () {
    function A() {
        console.log('A.[[Call]] activated');
        this.x = 10;
    }
    A.prototype.y = 20;

    var a = new A();
    console.log([a.x, a.y]); // 10 (自身), 20 (集成)

    function B() {
        // 或者使用A.apply(this, arguments)
        B.superproto.constructor.apply(this, arguments);
    }

    // 继承：通过空的中间构造函数将原型连在一起
    var F = function () { };
    F.prototype = A.prototype; // 引用
    B.prototype = new F();
    B.superproto = A.prototype; // 显示引用到另外一个原型上, "sugar"

    // 修复原型的constructor属性，否则的就是A了
    B.prototype.constructor = B;

    var b = new B();
    console.log([b.x, b.y]); // 10 (自身), 20 (集成)


})();


console.log('----------------ES5为原型链标准化了这个工具函数，那就是Object.create方法----------------');

(function () {
    // 用法
    var foo = { x: 10 };
    var bar = Object.create(foo, { y: { value: 20 } });
    console.log(bar.x, bar.y); // 继承 10, 20
    console.log(foo);
    console.log(bar);
})();