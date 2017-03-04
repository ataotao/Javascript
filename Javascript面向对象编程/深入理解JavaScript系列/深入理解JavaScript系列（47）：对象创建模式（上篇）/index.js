/**************************************************************************
 * 对象创建模式（上篇）
 * 本篇主要是介绍创建对象方面的模式，利用各种技巧可以极大地避免了错误或者可以编写出非常精简的代码。
 ***************************************************************************/
console.log('-----------模式1：命名空间（namespace）------------------');

(function () {
    // 命名空间可以减少全局命名所需的数量，避免命名冲突或过度。一般我们在进行对象层级定义的时候，经常是这样的：

    var app = app || {};
    app.moduleA = app.moduleA || {};
    app.moduleA.subModule = app.moduleA.subModule || {};
    app.moduleA.subModule.MethodA = function () {
        console.log('print A');
    };
    app.moduleA.subModule.MethodB = function () {
        console.log('print B');
    };


    // 如果层级很多的话，那就要一直这样继续下去，很是混乱。namespace模式就是为了解决这个问题而存在的，我们看代码：

    /*
    // 不安全，可能会覆盖已有的MYAPP对象
    var MYAPP = {};
    // 还好
    if (typeof MYAPP === 'undefined') {
        var MYAPP = {};
    }
    */
    // 更简洁的方式
    var MYAPP = MYAPP || {};

    //定义通用方法
    MYAPP.namespace = function (ns_string) {
        var parts = ns_string.split('.'),
            parent = MYAPP,
            i;

        // 默认如果第一个节点是MYAPP的话，就忽略掉，比如MYAPP.ModuleA
        if (parts[0] === 'MYAPP') {
            parts = parts.slice(1);
        }

        for (i = 0; i < parts.length; i += 1) {
            // 如果属性不存在，就创建
            if (typeof parent[parts[i]] === 'undefined') {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    };

    // 调用代码，非常简单：

    // 通过namespace以后，可以将返回值赋给一个局部变量
    var module2 = MYAPP.namespace('MYAPP.modules.module2');
    console.log(module2 === MYAPP.modules.module2); // true


    // 跳过MYAPP
    MYAPP.namespace('modules.module51');

    // 非常长的名字
    MYAPP.namespace('once.upon.a.time.there.was.this.long.nested.property');
    console.log(MYAPP);

})();


console.log('-----------模式2：定义依赖------------------');

(function () {

    // 有时候你的一个模块或者函数可能要引用第三方的一些模块或者工具，这时候最好将这些依赖模块在刚开始的时候就定义好，以便以后可以很方便地替换掉。

    var myFunction = function () {
        // 依赖模块
        var event = YAHOO.util.Event,
            dom = YAHOO.util.dom;

        // 其它函数后面的代码里使用局部变量event和dom
    };

    console.log(myFunction);

})();


console.log('-----------模式3：私有属性和私有方法------------------');

(function () {

    // JavaScript本身不提供特定的语法来支持私有属性和私有方法，但是我们可以通过闭包来实现，代码如下：


    function Gadget() {
        // 私有对象
        var name = 'iPod';
        // 公有函数
        this.getName = function () {
            return name;
        };
    }
    var toy = new Gadget();

    // name未定义，是私有的
    console.log(toy.name); // undefined

    // 公有方法访问name
    console.log(toy.getName()); // 'iPod'

    var myobj; // 通过自执行函数给myobj赋值

    (function () {
        // 自由对象
        var name = 'my, oh my';

        // 实现了公有部分，所以没有var
        myobj = {
            // 授权方法
            getName: function () {
                return name;
            }
        };
    }());

    console.log(myobj.getName());

})();

console.log('-----------模式4：Revelation模式------------------');

(function () {

    // 也是关于隐藏私有方法的模式，和《深入理解JavaScript系列（3）：全面解析Module模式》里的Module模式有点类似，但是不是return的方式，而是在外部先声明一个变量，然后在内部给变量赋值公有方法。代码如下：

    var myarray;

    (function () {
        var astr = '[object Array]',
            toString = Object.prototype.toString;

        function isArray(a) {
            return toString.call(a) === astr;
        }

        function indexOf(haystack, needle) {
            var i = 0,
                max = haystack.length;
            for (; i < max; i += 1) {
                if (haystack[i] === needle) {
                    return i;
                }
            }
            return -1;
        }

        //通过赋值的方式，将上面所有的细节都隐藏了
        myarray = {
            isArray: isArray,
            indexOf: indexOf,
            inArray: indexOf
        };
    }());

    //测试代码
    console.log(myarray.isArray([1, 2])); // true
    console.log(myarray.isArray({ 0: 1 })); // false
    console.log(myarray.indexOf(['a', 'b', 'z'], 'z')); // 2
    console.log(myarray.inArray(['a', 'b', 'z'], 'z')); // 2

    myarray.indexOf = null;
    console.log(myarray.inArray(['a', 'b', 'z'], 'z')); // 2
    console.log(myarray);

})();

console.log('-----------模式5：链模式------------------');

(function () {

    // 链模式可以你连续可以调用一个对象的方法，比如obj.add(1).remove(2).delete(4).add(2)这样的形式，其实现思路非常简单，就是将this原样返回。代码如下：

    var obj = {
        value: 1,
        increment: function () {
            this.value += 1;
            return this;
        },
        add: function (v) {
            this.value += v;
            return this;
        },
        shout: function () {
            console.log(this.value);
        }
    };

    // 链方法调用
    obj.increment().add(3).shout(); // 5
    obj.add(3).add(3).add(3).add(3).shout(); // 5

    // 也可以单独一个一个调用
    obj.value = 1;
    obj.increment();
    obj.add(3);
    obj.shout();

})();

