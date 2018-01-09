/**
 * 绘制文本
 * canvas 提供了两种方法来渲染文本:
 * 
 * fillText(text, x, y [, maxWidth])
 * 在指定的(x,y)位置填充指定的文本，绘制的最大宽度是可选的.
 * strokeText(text, x, y [, maxWidth])
 * 在指定的(x,y)位置绘制文本边框，绘制的最大宽度是可选的.
 */

// 一个填充文本的示例
// 文本用当前的填充方式被填充：

function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = "48px arial";
  ctx.fillText("Hello world", 10, 50, 100);
}

// 一个文本边框的示例
// 文本用当前的边框样式被绘制：

function draw1() {
  var ctx = document.getElementById('canvas1').getContext('2d');
  ctx.font = "48px serif";
  ctx.strokeText("Hello world", 10, 50);
}

// 有样式的文本
// 在上面的例子用我们已经使用了 font 来使文本比默认尺寸大一些. 还有更多的属性可以让你改变canvas显示文本的方式：

// font = value
// 当前我们用来绘制文本的样式. 这个字符串使用和 CSS font 属性相同的语法. 默认的字体是 10px sans-serif。
// textAlign = value
// 文本对齐选项. 可选的值包括：start, end, left, right or center. 默认值是 start。
// textBaseline = value
// 基线对齐选项. 可选的值包括：top, hanging, middle, alphabetic, ideographic, bottom。默认值是 alphabetic。
// direction = value
// 文本方向。可能的值包括：ltr, rtl, inherit。默认值是 inherit。
// 如果你之前使用过CSS，那么这些选项你会很熟悉。

// textBaseline例子
// 编辑下面的代码，看看它们在canvas中的变化：

function draw2() {
    var ctx = document.getElementById('canvas2').getContext('2d');
    ctx.font = "italic small-caps bolder 48px/3 cursive";
    ctx.textBaseline = "hanging";
    ctx.strokeText("Hello world", 10, 100);
    ctx.fillText("Hello world", 8, 98);
    
  }

// 先进的文本测量
// 当你需要获得更多的文本细节时，下面的方法可以给你测量文本的方法。

// measureText()
// 将返回一个 TextMetrics对象的宽度、所在像素，这些体现文本特性的属性。
// 下面的代码段将展示如何测量文本来获得它的宽度：

function draw3() {
  var ctx = document.getElementById('canvas3').getContext('2d');
  var text = ctx.measureText("foo"); // TextMetrics object
  console.log(text);

  ctx.font="30px cursive";
  var txt="Hello World"
  console.log( ctx.measureText(txt), '可以提前获取文字宽度');
  ctx.fillText("width:" + ctx.measureText(txt).width,10,50)
  ctx.fillText(txt,10,100);  

}


window.onload = function () {
    draw();
    draw1();
    draw2();
    draw3();
}
