// 	function Cat(name,color){
// 		this.name=name;
// 		this.color=color;
// 		this.type = "猫科动物";
// 		this.eat = function(){
// 			console.log("吃老鼠");
// 		};
// 	}
// 　　var cat1 = new Cat("大毛","黄色");
// 　　var cat2 = new Cat ("二毛","黑色");
// 	console.log(cat1.type); // 猫科动物
// 	cat1.eat(); // 吃老鼠
// 	console.log(cat1.eat == cat2.eat); //false
//相同的属性type 和 eat 这样浪费内存,采用原型就好一些

// console.log(cat1.constructor === Cat); //true
// console.log(cat2.constructor === Cat); //true
// console.log(cat1 instanceof Cat); //true
// console.log(cat2 instanceof Cat); //true

//Prototype模式
function Cat(name, color) {
    this.name = name;
    this.color = color;
}

Cat.prototype.type = "猫科动物";
Cat.prototype.eat = function () {
    console.log("吃老鼠");
};

var cat1 = new Cat("大毛", "黄色");
var cat2 = new Cat("二毛", "黑色");
var cat3 = function () {
    return true;
};

console.log('cat1.type', cat1.type); // 猫科动物
cat1.eat(); // 吃老鼠

//通过原型占用了相同的内存空间
console.log('cat1.eat == cat2.eat', cat1.eat == cat2.eat); //true
console.log('cat1.type == cat2.type', cat1.type == cat2.type); //true

//Prototype模式的验证方法

//isPrototypeOf() 
//这个方法用来判断，某个proptotype对象和某个实例之间的关系。
console.log('Cat.prototype.isPrototypeOf(cat1)', Cat.prototype.isPrototypeOf(cat1)); //true
console.log('Cat.prototype.isPrototypeOf(cat2)', Cat.prototype.isPrototypeOf(cat2)); //true
console.log('Cat.prototype.isPrototypeOf(cat3)', Cat.prototype.isPrototypeOf(cat3)); //false

//hasOwnProperty()
//每个实例对象都有一个hasOwnProperty()方法，用来判断某一个属性到底是本地属性，还是继承自prototype对象的属性。
console.log('cat1.hasOwnProperty("name")', cat1.hasOwnProperty("name")); // true
console.log('cat1.hasOwnProperty("type")', cat1.hasOwnProperty("type")); // false

//in运算符
//in运算符可以用来判断，某个实例是否含有某个属性，不管是不是本地属性。
console.log('"name" in cat1', "name" in cat1); // true
console.log('"type" in cat1', "type" in cat1); // true
console.log('"eat" in cat1', "eat" in cat1); // true
//in运算符还可以用来遍历某个对象的所有属性。
for (var prop in cat1) { 
    console.log("cat1[" + prop + "]=" + cat1[prop]); 
}