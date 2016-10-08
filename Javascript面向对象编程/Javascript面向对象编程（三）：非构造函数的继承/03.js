//"非构造函数"的继承？

//请问怎样才能让"医生"去继承"中国人"，也就是说，我怎样才能生成一个"中国医生"的对象？
　　
var Chinese = {
    nation: '中国'
};　　
var Doctor = {
    career: '医生'
};

//一、object()方法
// function object(o) {
//     function F() {}
//     F.prototype = o;
//     return new F();
// }
// var Doctor = object(Chinese);
// Doctor.career = '医生';
// console.log(Doctor.nation + Doctor.career); //中国
// console.log(Doctor);


/* 

//二、浅拷贝
//除了使用"prototype链"以外，还有另一种思路：把父对象的属性，全部拷贝给子对象，也能实现继承。
//下面这个函数，就是在做拷贝：

function extendCopy(p) {　　　　
    var c = {};　　　　
    for (var i in p) {　　　　　　
        c[i] = p[i];　　　　
    }　　　　
    c.uber = p;　　　　
    return c;　　
}

//使用的时候，这样写：
　　
var Doctor = extendCopy(Chinese);　　
Doctor.career = '医生';
console.log(Doctor.nation); // 中国
console.log(Doctor); // 中国
//但是，这样的拷贝有一个问题。那就是，如果父对象的属性等于数组或另一个对象，那么实际上，子对象获得的只是一个内存地址，而不是真正拷贝，因此存在父对象被篡改的可能。
//请看，现在给Chinese添加一个"出生地"属性，它的值是一个数组。
　　
Chinese.birthPlaces = ['北京', '上海', '香港'];
//通过extendCopy()函数，Doctor继承了Chinese。
　　
var Doctor = extendCopy(Chinese);
//然后，我们为Doctor的"出生地"添加一个城市：
　　
Doctor.birthPlaces.push('厦门');
//发生了什么事？Chinese的"出生地"也被改掉了！
console.log('"Doctor"', Doctor.birthPlaces); //北京, 上海, 香港, 厦门
console.log('"Doctor"', Doctor);
console.log('"Chinese"', Chinese.birthPlaces); //北京, 上海, 香港, 厦门
console.log('"Chinese"', Chinese);
//所以，extendCopy()只是拷贝基本类型的数据，我们把这种拷贝叫做"浅拷贝"。这是早期jQuery实现继承的方式。

*/

//三、深拷贝
//所谓"深拷贝"，就是能够实现真正意义上的数组和对象的拷贝。它的实现并不难，只要递归调用"浅拷贝"就行了。

function deepCopy(p, c) {　　　　
    var c = c || {};　　　　
    for (var i in p) {　　　　　　
        if (typeof p[i] === 'object') {　　　　　　　　
            c[i] = (p[i].constructor === Array) ? [] : {};　　　　　　　　
            deepCopy(p[i], c[i]);　　　　　　
        } else {　　　　　　　　　
            c[i] = p[i];　　　　　　
        }　　　　
    }　　　　
    return c;　　
}

//现在，给父对象加一个属性，值为数组
Chinese.birthPlaces = ['北京', '上海', '香港'];

//使用的时候这样写：
var Doctor = deepCopy(Chinese);

//然后，在子对象上修改这个属性：
Doctor.birthPlaces.push('厦门');

//这时，父对象就不会受到影响了。
console.log(Doctor.birthPlaces); //北京, 上海, 香港, 厦门
console.log(Chinese.birthPlaces); //北京, 上海, 香港
//目前，jQuery库使用的就是这种继承方法。