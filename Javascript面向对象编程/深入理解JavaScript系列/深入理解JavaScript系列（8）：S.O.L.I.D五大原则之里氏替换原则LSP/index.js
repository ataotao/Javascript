/**************************************************************************
 * 深入理解JavaScript系列（8）：S.O.L.I.D五大原则之里氏替换原则LSP
 ***************************************************************************/

/**
 * 在面向对象编程里，继承提供了一个机制让子类和共享基类的代码，这是通过在基类型里封装通用的数据和行为来实现的，然后已经及类型来声明更详细的子类型，为了应用里氏替换原则，继承子类型需要在语义上等价于基类型里的期望行为。
 */

function Vehicle(my) {
    my = my || {};
    my.speed = 0;
    my.running = false;

    this.speed = function () {
        return my.speed;
    };
    this.start = function () {
        my.running = true;
    };
    this.stop = function () {
        my.running = false;
    };
    this.accelerate = function () {
        my.speed++;
        console.log();
    };
    this.decelerate = function () {
        my.speed--;
    };
    this.state = function () {
        if (!my.running) {
            return 'parked';
        }
        else if (my.running && my.speed) {
            return 'moving';
        }
        else if (my.running) {
            return 'idle';
        }
    };
}

// var vehicle = new Vehicle();
// console.log(vehicle.accelerate());

function FastVehicle(my) {
    my = my || {};

    var that = new Vehicle(my);
    that.accelerate = function () {
        my.speed += 3;
    };
    return that;
}

var maneuver = function (vehicle) {
    console.log(vehicle.state());
    vehicle.start();
    console.log(vehicle.state());
    vehicle.accelerate();
    console.log(vehicle.state());
    console.log(vehicle.speed());
    vehicle.decelerate();
    console.log(vehicle.speed());
    if (vehicle.state() != 'idle') {
        console.error('The vehicle is still moving!');
    }
    vehicle.stop();
    console.log(vehicle.state());
};

maneuver(new Vehicle());
console.log('------------------------------');
maneuver(new FastVehicle());


/**
 * 根据上面的代码，我们看到抛出的异常是“The vehicle is still moving!”，这是因为写这段代码的作者一直认为加速（accelerate）和减速（decelerate）的数字是一样的。但FastVehicle的代码和Vehicle的代码并不是完全能够替换掉的。因此，FastVehicle违反了里氏替换原则。 

* 在这点上，你可能会想：“但，客户端不能老假定vehicle都是按照这样的规则来做”，里氏替换原则(LSP)的妨碍（译者注：就是妨碍实现LSP的代码）不是基于我们所想的继承子类应该在行为里确保更新代码，而是这样的更新是否能在当前的期望中得到实现。

* 上述代码这个case，解决这个不兼容的问题需要在vehicle类库或者客户端调用代码上进行一点重新设计，或者两者都要改。
 */

/**
 * 避免继承
 * 避免LSP妨碍的另外一个测试是：如果可能的话，尽量不用继承，在Gamma的大作《Design Patterns – Elements of Reusable Object-Orineted Software》中，我们可以看到如下建议：
 * 与行为有关，而不是继承
 * 到现在，我们讨论了和继承上下文在内的里氏替换原则，指示出JavaScript的面向对象实。不过，里氏替换原则（LSP）的本质不是真的和继承有关，而是行为兼容性。JavaScript是一个动态语言，一个对象的契约行为不是对象的类型决定的，而是对象期望的功能决定的。里氏替换原则的初始构想是作为继承的一个原则指南，等价于对象设计中的隐式接口。
 */

console.log('---------------矩形例子-----------------');



// 考虑我们有一个程序用到下面这样的一个矩形对象:

var rectangle = {
    length: 0,
    width: 0
};
// 过后，程序有需要一个正方形，由于正方形就是一个长(length)和宽(width)都一样的特殊矩形，所以我们觉得创建一个正方形代替矩形。我们添加了length和width属性来匹配矩形的声明，但我们觉得使用属性的getters/setters一般我们可以让length和width保存同步，确保声明的是一个正方形：

var square = {};
(function () {
    var length = 0, width = 0;
    // 注意defineProperty方式是262-5版的新特性
    Object.defineProperty(square, 'length', {
        get: function () {
            return length;
        },
        set: function (value) {
            length = width = value;
        }
    });
    Object.defineProperty(square, 'width', {
        get: function () {
            return width;
        },
        set: function (value) {
            length = width = value;
        }
    });
})();

// 不幸的是，当我们使用正方形代替矩形执行代码的时候发现了问题，其中一个计算矩形面积的方法如下：
var g = function (rectangle) {
    rectangle.length = 3;
    rectangle.width = 4;
    console.log(rectangle.length);
    console.log(rectangle.width);
    console.log(rectangle.length * rectangle.width);
};
g(rectangle);
g(square);
// 该方法在调用的时候，结果是16，而不是期望的12，我们的正方形square对象违反了LSP原则，square的长度和宽度属性暗示着并不是和矩形100%兼容，但我们并不总是这样明确的暗示。解决这个问题，我们可以重新设计一个shape对象来实现程序，依据多边形的概念，我们声明rectangle和square，relevant。不管怎么说，我们的目的是要说里氏替换原则并不只是继承，而是任何方法（其中的行为可以另外的行为）。