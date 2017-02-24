/**************************************************************************
 * 基本用法
 ***************************************************************************/
var Calculator = function (eq) {
    //这里可以声明私有成员

    var eqCtl = document.getElementById(eq);

    return {
        // 暴露公开的成员
        add: function (x, y) {
            var val = x + y;
            eqCtl.innerHTML = val;
        }
    };
};

var calculator = new Calculator('listBox');
calculator.add(2, 2);


console.log('-------匿名闭包-------');

(function () {
    // ... 所有的变量和function都在这里声明，并且作用域也只能在这个匿名闭包里
    // ...但是这里的代码依然可以访问外部全局的对象
}());

(function () {/* 内部代码 */ })();
//不过我们推荐使用第一种方式

console.log('-------引用全局变量-------');
var jQuery = 'jQuery';
var YAHOO = 'YAHOO';


(function ($, YAHOO) {
    // 这里，我们的代码就可以使用全局的jQuery对象了，YAHOO也是一样
    console.log($, YAHOO);
}(jQuery, YAHOO));

//不过，有时候可能不仅仅要使用全局变量，而是也想声明全局变量，如何做呢？我们可以通过匿名函数的返回值来返回这个全局变量，这也就是一个基本的Module模式，来看一个完整的代码：

var blogModule = (function () {
    var my = {}, privateName = '博客园';

    function privateAddTopic(data) {
        // 这里是内部处理代码
        my.topic = data;
    }

    my.Name = privateName;
    my.AddTopic = function (data) {
        privateAddTopic(data);
    };

    return my;
}());
//上面的代码声明了一个全局变量blogModule，并且带有2个可访问的属性：blogModule.AddTopic和blogModule.Name，除此之外，其它代码都在匿名函数的闭包里保持着私有状态。同时根据上面传入全局变量的例子，我们也可以很方便地传入其它的全局变量

blogModule.AddTopic('测试');
console.log(blogModule);

/**************************************************************************
 * 高级用法
 ***************************************************************************/
console.log('---------------------扩展----------------------------');

var blogModule = (function (my) {
    my.AddPhoto = function () {
        //添加内部代码  
    };
    return my;
} (blogModule));
console.log(blogModule);

console.log('---------------------松耦合扩展----------------------------');

var blogModule = (function (my) {

    // 添加一些功能   
    
    return my;
} (blogModule || {}));  
console.log(blogModule);

console.log('---------------------紧耦合扩展----------------------------');

var blogModule = (function (my) {
    var oldAddPhotoMethod = my.AddPhoto;

    my.AddPhoto = function () {
        // 重载方法，依然可通过oldAddPhotoMethod调用旧的方法
        console.log(oldAddPhotoMethod);
    };

    return my;
} (blogModule));
blogModule.AddPhoto();

console.log('---------------------克隆与继承----------------------------');
var blogModule = (function (old) {
    var my = {},
        key;

    for (key in old) {
        if (old.hasOwnProperty(key)) {
            my[key] = old[key];
        }
    }

    var oldAddPhotoMethod = old.AddPhoto;
    my.AddPhoto = function () {
        // 克隆以后，进行了重写，当然也可以继续调用oldAddPhotoMethod
    };

    return my;
} (blogModule));
// 这种方式灵活是灵活，但是也需要花费灵活的代价，其实该对象的属性对象或function根本没有被复制，只是对同一个对象多了一种引用而已，所以如果老对象去改变它，那克隆以后的对象所拥有的属性或function函数也会被改变，解决这个问题，我们就得是用递归，但递归对function函数的赋值也不好用，所以我们在递归的时候eval相应的function。不管怎么样，我还是把这一个方式放在这个帖子里了，大家使用的时候注意一下就行了。

console.log('---------------------跨文件共享私有对象----------------------------');
var blogModule = (function (my) {
    var _private = my._private = my._private || {},
        
        _seal = my._seal = my._seal || function () {
            delete my._private;
            delete my._seal;
            delete my._unseal;
            
        },
        
        _unseal = my._unseal = my._unseal || function () {
            my._private = _private;
            my._seal = _seal;
            my._unseal = _unseal;
        };
        
    return my;
} (blogModule || {}));

console.log(blogModule);

console.log('---------------------子模块----------------------------');

blogModule.CommentSubModule = (function () {
    var my = {};
    // ...

    return my;
} ());