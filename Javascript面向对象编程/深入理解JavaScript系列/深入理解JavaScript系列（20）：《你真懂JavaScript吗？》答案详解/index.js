/**************************************************************************
 * 大叔手记（19）：你真懂JavaScript吗？
 ***************************************************************************/
console.log('------------大叔手记（19）：你真懂JavaScript吗？------------');

(function () {
    if (!('a' in window)) {
        var a = 1;
    }
    console.log(a); //1
})();

console.log('------------------------');
//函数声明会覆盖变量声明，但不会覆盖变量赋值
/*
function value(){
    return 1;
}
var value;
alert(typeof value);    //"function"
尽快变量声明在下面定义，但是变量value依然是function，也就是说这种情况下，函数声明的优先级高于变量声明的优先级，但如果该变量value赋值了，那结果就完全不一样了：
 
function value(){
    return 1;
}
var value = 1;
alert(typeof value);    //"number"
 */
// 变量a在函数a后面，那么，变量a遇到函数a怎么办呢？还是根据变量对象中介绍的，当变量申明遇到VO中已经有同名的时候，不会影响已经存在的属性。而函数表达式不会影响VO的内容，所以b只有在执行的时候才会触发里面的内容。
(function () {
    var a = 1,
        b = function a(x) {
            x && a(--x);
        };

    console.log(a); //1

})();


console.log('------------------------');
(function () {
    function a(x) {
        return x * 2;
    }
    var a;
    console.log(a); //function
})();

console.log('------------------------');
(function () {
    function b(x, y, a) {
        arguments[2] = 10;
        console.log(a); //10
    }
    b(1, 2, 3);
})();

console.log('------------------------');
(function () {
    function a() {
        console.log(this);
    }
    a.call(null); //window
})();


/*
 * 找出数字数组中最大的元素（使用Match.max函数）
 * 转化一个数字数组为function数组（每个function都弹出相应的数字）
 * 给object数组进行排序（排序条件是每个元素对象的属性个数）
 * 利用JavaScript打印出Fibonacci数（不使用全局变量）
 * 实现如下语法的功能：var a = (5).plus(3).minus(6); //2
 * 实现如下语法的功能：var a = add(2)(3)(4); //9
 */

console.log('----------找出数字数组中最大的元素（使用Match.max函数）------------');
(function () {
    var arr = [1, 10, 158, 23];
    var max = Math.max.apply(null, arr);
    console.log(max);
})();

console.log('----------转化一个数字数组为function数组（每个function都弹出相应的数字）------------');
(function () {

    // var arr = [10, 11, 12, 13, 14];

    // for (var i = 0; i < arr.length; i++) {
    //     (function (index) {
    //         var _val = arr[index];
    //         arr[index] = function () {
    //             console.log(_val);
    //         };
    //     })(i);
    // }

    // for (var j = 0; j < arr.length; j++) {
    //     arr[j]();
    // }


    var arr = [10, 11, 12, 13, 14];
    var arr2 = arr.map(function (value, index) {
        return function () {
            console.log(value);
        };
    });
    for (var j = 0; j < arr2.length; j++) {
        arr2[j]();
    }

})();

console.log('----------给object数组进行排序（排序条件是每个元素对象的属性个数）------------');

(function () {

    var arr = [{
        a: 1
    },
    {
        a: 1,
        b: 1
    },
    {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1
    },
    {
        a: 1,
        b: 1,
        c: 1,
        d: 1
    },
    {
        a: 1,
        b: 1,
        c: 1
    }
    ];

    // function fn(a, b) {
    //     var _a = [],
    //         _b = [];

    //     for (var i in a) {
    //         if (a.hasOwnProperty(i)) {
    //             _a.push(a[i]);
    //         }
    //     }

    //     for (var j in b) {
    //         if (b.hasOwnProperty(j)) {
    //             _b.push(b[j]);
    //         }
    //     }

    //     return _b.length - _a.length;
    // }

    // arr.sort(fn);

    //拓展count方法
    Object.prototype.count = function () {
        var p, count = 0;
        for (p in this) {
            if (this.hasOwnProperty(p)) {
                count++;
            }
        }
        return count;
    };

    function compare(obj1, obj2) {
        return obj1.count() - obj2.count();
    }
    console.log(arr.sort(compare));


    console.log(arr[0]);
    console.log(arr[1]);
    console.log(arr[2]);
    console.log(arr[3]);
    console.log(arr[4]);

})();


console.log('----------利用JavaScript打印出Fibonacci数（不使用全局变量）------------');
// 1、1、2、3、5、8、13、21、34
// 这个数列从第3项开始，每一项都等于前两项之和。
(function () {

    function outputFibonacci(n) {
        return n < 2 ? n : outputFibonacci(n - 1) + outputFibonacci(n - 2);
    }
    console.time('start');
    console.log(outputFibonacci(20));
    console.timeEnd('start');


    function outputFibonacciA(n) {
        var memo = [0, 1];
        var fib = function (n) {
            var result = memo[n];
            if (typeof result !== 'number') {
                result = fib(n - 1) + fib(n - 2);
                memo[n] = result;
            }
            return result;
        };
        return fib;
    }

    console.time('startA');
    console.log(outputFibonacciA()(20));
    console.timeEnd('startA');

})();


console.log('----------实现如下语法的功能：var a = (5).plus(3).minus(6); //2------------');
(function () {
    Number.prototype.plus = function (a) {
        return this.valueOf() + a;
    };

    Number.prototype.minus = function (a) {
        return this.valueOf() - a;
    };

    var a = (5).plus(3).minus(6);
    console.log(a);
})();

console.log('----------实现如下语法的功能：var a = add(2)(3)(4); //9------------');
(function () {
    function add(a) {
        var temp = function (b) {
            return add(a + b);
        };
        //如果只重写了toString，对象转换时会无视valueOf的存在来进行转换。但是，如果只重写了valueOf方法，在要转换为字符串的时候会优先考虑toString方法。在不能调用toString的情况下，只能让valueOf上阵了。对于那个奇怪的字符串拼接问题，可能是出于操作符上，翻开ECMA262-5 发现都有一个getValue操作。嗯，那么谜底应该是揭开了。重写会加大它们调用的优化高，而在有操作符的情况下，valueOf的优先级本来就比toString的高。
        temp.valueOf = temp.toString = function () {
            return a;
        };
        return temp;
    }

    var num = add(2)(3)(4); // 9
    //这里输出的时候，才会调用 temp.valueOf = temp.toString = function () { return a; };
    console.log(num); //这时候的num 实际上就是 temp

})();