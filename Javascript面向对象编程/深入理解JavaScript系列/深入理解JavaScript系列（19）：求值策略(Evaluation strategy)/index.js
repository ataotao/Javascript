/**************************************************************************
 * 赋值理论里一般有2中赋值策略：严格——意思是说参数在进入程序之前是经过计算过的；非严格——意思是参数的计算是根据计算要求才去计算（也就是相当于延迟计算）。
 ***************************************************************************/
console.log('------------传递这种行为可以理解为简单的赋值，我们可以看到，内部是完全不同的对象，只不过引用的是相同的值——也就是地址副本。------------');

var foo = { x: 10, y: 20 };
var bar = foo;

console.log(bar === foo); // true

bar.x = 100;
bar.y = 200;

console.log([foo.x, foo.y]); // [100, 200]


console.log('------------即两个标识符（名称绑定）绑定到内存中的同一个对象， 共享这个对象：------------');
console.log('------------而重新赋值分配，绑定是新的对象标识符（新地址），而不影响已经先前绑定的对象 ：------------');

bar = { z: 1, q: 2 };

console.log([foo.x, foo.y]); // [100, 200] – 没改变
console.log([bar.z, bar.q]); // [1, 2] – 但现在引用的是新对象


console.log('------------或针对这种情况下，专门称之为“按共享传递”，通过这个正好可以看到传统的按值传递和按引用传递的区别，这种情况，可以分成2个种情况：1：原始值按值传递；2：对象按共享传递。-----------------------');