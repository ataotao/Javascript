/**************************************************************************
 * 各种OOP实现的其它特性
 ***************************************************************************/
console.log('------------多态------------');
// 一个函数可以应用于不同的对象，就像原生对象的特性（因为这个值在进入执行上下文时确定的）：
var a = 1;
var b = 2;
function test() {
    console.log([this.a, this.b]);
}

test.call({ a: 10, b: 20 }); // 10, 20
test.call({ a: 100, b: 200 }); // 100, 200

test(); // 1, 2

// 不过，也有例外：Date.prototype.getTime()方法，根据标准这个值总是应该有一个日期对象，否则就会抛出异常。

console.log(Date.prototype.getTime.call(new Date())); // time
// console.log(Date.prototype.getTime.call(new String(''))); // TypeError

console.log('------------封装------------');

// 然而，在实践中是有可能看到有些东西被命名为“模仿JS封装”。 一般该上下文的目的是（作为一个规则，构造函数本身）使用。 不幸的是，经常实施这种“模仿”，程序员可以产生伪绝对非抽象的实体设置“getter / setter方法”（我再说一遍，它是错误的）：

function A() {

    var _a; // "private 私有" a

    this.getA = function _getA() {
        return _a;
    };

    this.setA = function _setA(a) {
        _a = a;
    };

}

var aa = new A();

aa.setA(10);
console.log(aa._a); // undefined, "private 私有"
console.log(aa.getA()); // 1


console.log('--------------Mixins------------------');

// helper for augmentation
Object.extend = function (destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
};

var X = { a: 10, b: 20 };
var Y = { c: 30, d: 40 };

Object.extend(X, Y); // mix Y into X
console.log([X.a, X.b, X.c, X.d]); //10, 20, 30, 40
console.log(X);
console.log(Y);

console.log('--------------对象组合------------------');
var _delegate = {
    foo: function () {
        console.log('_delegate.foo');
        console.log(this);
    }
};

var agregate = {

    delegate: _delegate,

    foo: function () {
        return this.delegate.foo.call(this);
    }

};

agregate.foo(); // delegate.foo

agregate.delegate = {
    foo: function () {
        console.log('foo from new delegate');
    }
};

agregate.foo(); // foo from new delegate

console.log('--------------AOP特性------------------');

// 拥有函数式参数的函数在某些方面是可以装饰和激活的（通过应用所谓的建议）：
// 最简单的装饰者例子：

function checkDecorator(originalFunction) {
    return function () {
        if (fooBar != 'testA') {
            console.log('wrong parameter');
            return false;
        }
        return originalFunction();
    };
}

function testA() {
    console.log('test function');
}

var testWithCheck = checkDecorator(testA);
var fooBar = false;

testA(); // 'testA function'
testWithCheck(); // 'wrong parameter'

fooBar = 'testA';
testA(); // 'testA function'
testWithCheck(); // 'testA function'