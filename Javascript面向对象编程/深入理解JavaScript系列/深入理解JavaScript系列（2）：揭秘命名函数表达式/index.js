/**************************************************************************
 * 函数声明在条件语句内虽然可以用，但是没有被标准化，也就是说不同的环境可能有不同的执行结果，所以条件判断这样情况下，最好使用函数表达式：
 ***************************************************************************/
console.log('-------------函数声明在条件语句内虽然可以用，但是没有被标准化，也就是说不同的环境可能有不同的执行结果，所以条件判断这样情况下，最好使用函数表达式----------');
if (!fooA) {
    function foo() {
        return 'first';
    }
} else {
    function foo() {
        return 'second';
    }
}

console.log(foo());

// 相反，这样情况，我们要用函数表达式
var fooA;
if (!fooA) {
    fooA = function () {
        return 'first';
    };
} else {
    fooA = function () {
        return 'second';
    };
}
fooA();
console.log(fooA());

/**************************************************************************
 * JScript的内存管理
 ***************************************************************************/
console.log('--------------JScript的内存管理-----------------------');
var f = (function () {
    var f, g;
    if (true) {
        f = function g() {
            return 1;
        };
    } else {
        f = function g() {
            return 2;
        };
    }
    // 设置g为null以后它就不会再占内存了
    g = null;
    return f;
})();

console.log(f());

//测试
//显示断开引用可以释放内存，但是释放的内存不是很多，10000个函数对象才释放大约3M的内存，这对一些小型脚本不算什么，但对于大型程序，或者长时间运行在低内存的设备里的时候，这是非常有必要的。
function createFn() {
    return (function () {
        var f;
        if (true) {
            f = function F() {
                return 'standard';
            };
        } else if (false) {
            f = function F() {
                return 'alternative';
            };
        } else {
            f = function F() {
                return 'fallback';
            };
        }
        // var F = null;
        return f;
    })();
}

var arr = [];
for (var i = 0; i < 10000; i++) {
    arr[i] = createFn();
}

/**************************************************************************
 * arguments.callee属性将在严格模式下被“封杀”。因此，在处于严格模式时，访问arguments.callee会导致TypeError（参见ECMA-262第5版的10.6节）。而我之所以在此提到严格模式，是因为如果在基于第5版标准的实现中无法使用arguments.callee来执行递归操作，那么使用命名函数表达式的可能性就会大大增加。从这个意义上来说，理解命名函数表达式的语义及其bug也就显得更加重要了。
 ***************************************************************************/
console.log('---------------arguments.callee属性将在严格模式下被“封杀”-----------------');


// 此前，你可能会使用arguments.callee
(function (x) {
    if (x <= 1) return 1;
    return x * arguments.callee(x - 1);
})(10);

// 但在严格模式下，有可能就要使用命名函数表达式
(function factorial(x) {
    if (x <= 1) return 1;
    return x * factorial(x - 1);
})(10);

// 要么就退一步，使用没有那么灵活的函数声明
function factorial(x) {
    console.log(x);
    if (x <= 1) return 1;
    return x * factorial(x - 1);
}
factorial(10);