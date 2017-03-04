/**************************************************************************
 * 深入理解JavaScript系列（42）：设计模式之原型模式
 * 
 ***************************************************************************/
console.log('-----------原型模式（prototype）是指用原型实例指向创建对象的种类，并且通过拷贝这些原型创建新的对象。------------------');

(function () {

    // 因为不是构造函数，所以不用大写
    var someCar = {
        drive: function () {
            return 'drive';
        },
        name: '马自达 3'
    };

    // 使用Object.create创建一个新车x
    var anotherCar = Object.create(someCar);
    console.log(anotherCar.name);
    anotherCar.name = '丰田佳美';
    console.log(anotherCar);
    console.log(anotherCar.name);
    console.log(anotherCar.drive());

})();

console.log('-----------Object.create运行你直接从其它对象继承过来，使用该方法的第二个参数，你可以初始化额外的其它属性。例如：------------------');
(function () {
    // 这里，可以在Object.create的第二个参数里使用对象字面量传入要初始化的额外属性，其语法与Object.defineProperties或Object.defineProperty方法类型。它允许您设定属性的特性，例如enumerable, writable 或 configurable。
    var vehicle = {
        getModel: function () {
            console.log('车辆的模具是：' + this.model);
        }
    };

    var car = Object.create(vehicle, {
        'id': {
            value: 1,
            enumerable: true // 默认writable:false, configurable:false
        },
        'model': {
            value: '福特',
            enumerable: true
        }
    });
    car.id = 2;
    console.log(car);

})();



console.log('--------------如果你希望自己去实现原型模式，而不直接使用Object.create 。你可以使用像下面这样的代码为上面的例子来实现：---------------');
(function () {


    var vehiclePrototype = {
        init: function (carModel) {
            this.model = carModel;
        },
        getModel: function () {
            console.log('车辆模具是：' + this.model);
        }
    };


    function vehicle(model) {
        function F() { }
        F.prototype = vehiclePrototype;

        var f = new F();

        f.init(model);
        return f;
    }

    var car = vehicle('福特Escort');
    car.getModel();

})();
/**
 * 原型模式在JavaScript里的使用简直是无处不在，其它很多模式有很多也是基于prototype的，就不多说了，这里大家要注意的依然是浅拷贝和深拷贝的问题，免得出现引用问题。


 */

