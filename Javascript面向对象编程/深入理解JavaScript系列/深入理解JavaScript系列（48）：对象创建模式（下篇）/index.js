/**************************************************************************
 * 对象创建模式（下篇）
 * 本篇主要是介绍创建对象方面的模式的下篇，利用各种技巧可以极大地避免了错误或者可以编写出非常精简的代码。
 ***************************************************************************/
console.log('-----------模式6：函数语法糖------------------');

(function () {
    //  函数语法糖是为一个对象快速添加方法（函数）的扩展，这个主要是利用prototype的特性，代码比较简单，我们先来看一下实现代码：

    if (typeof Function.prototype.method !== 'function') {
        Function.prototype.method = function (name, implementation) {
            this.prototype[name] = implementation;
            return this;
        };
    }
    // 扩展对象的时候，可以这么用：

    var Person = function (name) {
        this.name = name;
    }
        .method('getName',
        function () {
            return this.name;
        })
        .method('setName', function (name) {
            this.name = name;
            return this;
        });
    // 这样就给Person函数添加了getName和setName这2个方法，接下来我们来验证一下结果：

    var a = new Person('Adam');
    console.log(a.getName()); // 'Adam'
    console.log(a.setName('Eve').getName()); // 'Eve'

})();


console.log('-----------模式7：对象常量------------------');

(function () {
    // 对象常量是在一个对象提供set,get,ifDefined各种方法的体现，而且对于set的方法只会保留最先设置的对象，后期再设置都是无效的，已达到别人无法重载的目的。实现代码如下：

    var constant = (function () {
        var constants = {},
            ownProp = Object.prototype.hasOwnProperty,
            // 只允许设置这三种类型的值
            allowed = {
                string: 1,
                number: 1,
                boolean: 1
            },
            prefix = (Math.random() + '_').slice(2);

        return {
            // 设置名称为name的属性
            set: function (name, value) {
                if (this.isDefined(name)) {
                    return false;
                }
                if (!ownProp.call(allowed, typeof value)) {
                    return false;
                }
                constants[prefix + name] = value;
                return true;
            },
            // 判断是否存在名称为name的属性
            isDefined: function (name) {
                return ownProp.call(constants, prefix + name);
            },
            // 获取名称为name的属性
            get: function (name) {
                if (this.isDefined(name)) {
                    return constants[prefix + name];
                }
                return null;
            }
        };
    }());
    // 验证代码如下：

    // 检查是否存在
    console.log(constant.isDefined('maxwidth')); // false

    // 定义
    console.log(constant.set('maxwidth', 480)); // true

    // 重新检测
    console.log(constant.isDefined('maxwidth')); // true

    // 尝试重新定义
    console.log(constant.set('maxwidth', 320)); // false

    // 判断原先的定义是否还存在
    console.log(constant.get('maxwidth')); // 480


})();


console.log('-----------模式8：沙盒模式------------------');

(function () {

    // 沙盒（Sandbox）模式即时为一个或多个模块提供单独的上下文环境，而不会影响其他模块的上下文环境，比如有个Sandbox里有3个方法event,dom,ajax，在调用其中2个组成一个环境的话，和调用三个组成的环境完全没有干扰。Sandbox实现代码如下：

    function Sandbox() {
        // 将参数转为数组
        var args = Array.prototype.slice.call(arguments),
            // 最后一个参数为callback
            callback = args.pop(),
            // 除最后一个参数外，其它均为要选择的模块
            modules = (args[0] && typeof args[0] === 'string') ? args : args[0],
            i;

        // 强制使用new操作符
        if (!(this instanceof Sandbox)) {
            return new Sandbox(modules, callback);
        }

        // 添加属性
        this.a = 1;
        this.b = 2;

        // 向this对象上需想添加模块
        // 如果没有模块或传入的参数为 '*' ，则以为着传入所有模块
        if (!modules || modules == '*') {
            modules = [];
            for (i in Sandbox.modules) {
                if (Sandbox.modules.hasOwnProperty(i)) {
                    modules.push(i);
                }
            }
        }

        // 初始化需要的模块
        for (i = 0; i < modules.length; i += 1) {
            Sandbox.modules[modules[i]](this);
        }

        // 调用 callback
        callback(this);
    }

    // 默认添加原型对象
    Sandbox.prototype = {
        name: 'My Application',
        version: '1.0',
        getName: function () {
            return this.name;
        }
    };
    // 然后我们再定义默认的初始模块：

    Sandbox.modules = {};

    Sandbox.modules.dom = function (box) {
        box.getElement = function () {
        };
        box.getStyle = function () {
        };
        box.foo = 'bar';
    };

    Sandbox.modules.event = function (box) {
        // access to the Sandbox prototype if needed:
        // box.constructor.prototype.m = 'mmm';
        box.attachEvent = function () {
        };
        box.detachEvent = function () {
        };
    };

    Sandbox.modules.ajax = function (box) {
        box.makeRequest = function () {
        };
        box.getResponse = function () {
        };
    };
    // 调用方式如下：

    // 调用方式
    Sandbox(['ajax', 'event'], function (box) {
        console.log(typeof (box.foo));
        // 没有选择dom，所以box.foo不存在
    });

    Sandbox('ajax', 'dom', function (box) {
        console.log(typeof (box.attachEvent));
        // 没有选择event,所以event里定义的attachEvent也不存在
    });

    Sandbox('*', function (box) {
        console.log(box); // 上面定义的所有方法都可访问
    });
    // 通过三个不同的调用方式，我们可以看到，三种方式的上下文环境都是不同的，第一种里没有foo; 而第二种则没有attachEvent，因为只加载了ajax和dom，而没有加载event; 第三种则加载了全部。

})();

console.log('-----------模式9：静态成员------------------');

(function () {
    // 静态成员（Static Members）只是一个函数或对象提供的静态属性，可分为私有的和公有的，就像C#或Java里的public static和private static一样。

    // 我们先来看一下公有成员，公有成员非常简单，我们平时声明的方法，函数都是公有的，比如：

    /*
    // 构造函数
    var Gadget = function () {
    };
    
    // 公有静态方法
    Gadget.isShiny = function () {
        return "you bet";
    };
    
    // 原型上添加的正常方法
    Gadget.prototype.setPrice = function (price) {
        this.price = price;
    };
    
    // 调用静态方法
    console.log(Gadget.isShiny()); // "you bet"
    
    // 创建实例，然后调用方法
    var iphone = new Gadget();
    iphone.setPrice(500);
    
    console.log(typeof Gadget.setPrice); // "undefined"
    console.log(typeof iphone.isShiny); // "undefined"
    Gadget.prototype.isShiny = Gadget.isShiny;
    console.log(iphone.isShiny()); // "you bet"
    而私有静态成员，我们可以利用其闭包特性去实现，以下是两种实现方式。
    */


    // 第一种实现方式：

    var Gadget = (function () {
        // 静态变量/属性
        var counter = 0;

        // 闭包返回构造函数的新实现
        return function () {
            console.log(counter += 1);
        };
    }()); // 立即执行

    var g1 = new Gadget(); // logs 1
    var g2 = new Gadget(); // logs 2
    var g3 = new Gadget(); // logs 3
    // 可以看出，虽然每次都是new的对象，但数字依然是递增的，达到了静态成员的目的。


    console.log('第二种方式：');

    var Gadget1 = (function () {
        // 静态变量/属性
        var counter = 0,
            NewGadget;

        //新构造函数实现
        NewGadget = function () {
            counter += 1;
        };

        // 授权可以访问的方法
        NewGadget.prototype.getLastId = function () {
            return counter;
        };

        // 覆盖构造函数
        return NewGadget;
    }()); // 立即执行

    var iphone = new Gadget1();
    console.log(iphone.getLastId()); // 1

    var ipod = new Gadget1();
    console.log(ipod.getLastId()); // 2

    var ipad = new Gadget1();
    console.log(ipad.getLastId()); // 3
    // 数字也是递增了，这是利用其内部授权方法的闭包特性实现的。

})();
