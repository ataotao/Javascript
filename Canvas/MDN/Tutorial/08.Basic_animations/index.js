
/**
 * 由于我们是用 JavaScript 去操控 <canvas> 对象，这样要实现一些交互动画也是相当容易的。在本章中，我们将看看如何做一些基本的动画。
 * 可能最大的限制就是图像一旦绘制出来，它就是一直保持那样了。如果需要移动它，我们不得不对所有东西（包括之前的）进行重绘。重绘是相当费时的，而且性能很依赖于电脑的速度。
 */

/**
 * 动画的基本步骤
 * 
 * 你可以通过以下的步骤来画出一帧:
 * 1、清空 canvas
 * 除非接下来要画的内容会完全充满 canvas （例如背景图），否则你需要清空所有。最简单的做法就是用 clearRect 方法。
 * 2、保存 canvas 状态
 * 如果你要改变一些会改变 canvas 状态的设置（样式，变形之类的），又要在每画一帧之时都是原始状态的话，你需要先保存一下。
 * 3、绘制动画图形（animated shapes）
 * 这一步才是重绘动画帧。
 * 4、恢复 canvas 状态
 * 如果已经保存了 canvas 的状态，可以先恢复它，然后重绘下一帧。
 */

/**
 * 操控动画 Controlling an animation
 * 在 canvas 上绘制内容是用 canvas 提供的或者自定义的方法，而通常，我们仅仅在脚本执行结束后才能看见结果，比如说，在 for 循环里面做完成动画是不太可能的。
 * 因此， 为了实现动画，我们需要一些可以定时执行重绘的方法。有两种方法可以实现这样的动画操控。首先可以通过 setInterval 和 setTimeout 方法来控制在设定的时间点上执行重绘。
 * 
 * 有安排的更新画布 Scheduled updates
 * 首先，可以用window.setInterval(), window.setTimeout(),和window.requestAnimationFrame()来设定定期执行一个指定函数。
 * setInterval(function, delay)
 * 当设定好间隔时间后，function会定期执行。
 * setTimeout(function, delay)
 * 在设定好的时间之后执行函数
 * 
 * requestAnimationFrame(callback)
 * 告诉浏览器你希望执行一个动画，并在重绘之前，请求浏览器执行一个特定的函数来更新动画。
 * 如果你并不需要与用户互动，你可以使用setInterval()方法，它就可以定期执行指定代码。如果我们需要做一个游戏，我们可以使用键盘或者鼠标事件配合上setTimeout()方法来实现。通过设置事件监听，我们可以捕捉用户的交互，并执行相应的动作。
 * 
 * 下面的例子，采用 window.requestAnimationFrame()实现动画效果。这个方法提供了更加平缓并更加有效率的方式来执行动画，当系统准备好了重绘条件的时候，才调用绘制动画帧。一般每秒钟回调函数执行60次，也有可能会被降低。想要了解更多关于动画循环的信息，尤其是游戏，可以在Game development zone 参考这篇文章 Anatomy of a video game。
 */

// 太阳系的动画
// 这个例子里面，我会做一个小型的太阳系模拟动画。

var sun = new Image();
var moon = new Image();
var earth = new Image();
function init() {
  sun.src = './Canvas_sun.png';
  moon.src = './Canvas_moon.png';
  earth.src = './Canvas_earth.png';
  window.requestAnimationFrame(draw);
}

function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, 300, 300); // clear canvas

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.strokeStyle = 'rgba(0,153,255,0.4)';
  ctx.save();
  ctx.translate(150, 150);

  // Earth
  var time = new Date();
  ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
  ctx.translate(105, 0);
  ctx.fillRect(0, -12, 50, 24); // Shadow
  ctx.drawImage(earth, -12, -12);

  // Moon
  ctx.save();
  ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
  ctx.translate(0, 28.5);
  ctx.drawImage(moon, -3.5, -3.5);
  ctx.restore();

  ctx.restore();

  ctx.beginPath();
  ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
  ctx.stroke();

  ctx.drawImage(sun, 0, 0, 300, 300);

  window.requestAnimationFrame(draw);
}

init();



// 动画时钟
// 这个例子实现一个动态时钟， 可以显示当前时间。

function clock() {
  var now = new Date();
  var ctx = document.getElementById('canvas1').getContext('2d');
  ctx.save();
  ctx.clearRect(0, 0, 150, 150);
  ctx.translate(75, 75);
  ctx.scale(0.4, 0.4);
  ctx.rotate(-Math.PI / 2);
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";

  // Hour marks
  ctx.save();
  for (var i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI / 6);
    ctx.moveTo(100, 0);
    ctx.lineTo(120, 0);
    ctx.stroke();
  }
  ctx.restore();

  // Minute marks
  ctx.save();
  ctx.lineWidth = 5;
  for (i = 0; i < 60; i++) {
    if (i % 5 != 0) {
      ctx.beginPath();
      ctx.moveTo(117, 0);
      ctx.lineTo(120, 0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI / 30);
  }
  ctx.restore();

  var sec = now.getSeconds();
  var min = now.getMinutes();
  var hr = now.getHours();
  hr = hr >= 12 ? hr - 12 : hr;

  ctx.fillStyle = "black";

  // write Hours
  ctx.save();
  ctx.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) * sec)
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(80, 0);
  ctx.stroke();
  ctx.restore();

  // write Minutes
  ctx.save();
  ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec)
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(112, 0);
  ctx.stroke();
  ctx.restore();

  // Write seconds
  ctx.save();
  ctx.rotate(sec * Math.PI / 30);
  ctx.strokeStyle = "#D40000";
  ctx.fillStyle = "#D40000";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(83, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#325FA2';
  ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
  ctx.stroke();

  ctx.restore();

  window.requestAnimationFrame(clock);
}

window.requestAnimationFrame(clock);



// 循环全景照片
// 在这个例子中，会有一个自左向右滑动的全景图。我们使用了在维基百科中找到的尤塞米提国家公园的图片，当然你可以随意找一张任何尺寸大于canvas的图片。

function picDraw() {

  var img = new Image();

  // User Variables - customize these to change the image being scrolled, its
  // direction, and the speed.

  img.src = './Capitan_Meadows,_Yosemite_National_Park.jpg';
  var CanvasXSize = 800;
  var CanvasYSize = 200;
  var speed = 30; //lower is faster
  var scale = 1.05;
  var y = -4.5; //vertical offset

  // Main program

  var dx = 0.75;
  var imgW;
  var imgH;
  var x = 0;
  var clearX;
  var clearY;
  var ctx2;

  img.onload = function () {
    imgW = img.width * scale;
    imgH = img.height * scale;
    if (imgW > CanvasXSize) { x = CanvasXSize - imgW; } // image larger than canvas
    if (imgW > CanvasXSize) { clearX = imgW; } // image larger than canvas
    else { clearX = CanvasXSize; }
    if (imgH > CanvasYSize) { clearY = imgH; } // image larger than canvas
    else { clearY = CanvasYSize; }
    //Get Canvas Element
    ctx2 = document.getElementById('canvas2').getContext('2d');
    //Set Refresh Rate
    return setInterval(draw, speed);
  }

  function draw() {
    //Clear Canvas
    ctx2.clearRect(0, 0, clearX, clearY);
    //If image is <= Canvas Size
    if (imgW <= CanvasXSize) {
      //reset, start from beginning
      if (x > (CanvasXSize)) { x = 0; }
      //draw aditional image
      if (x > (CanvasXSize - imgW)) { ctx2.drawImage(img, x - CanvasXSize + 1, y, imgW, imgH); }
    }
    //If image is > Canvas Size
    else {
      //reset, start from beginning
      if (x > (CanvasXSize)) { x = CanvasXSize - imgW; }
      //draw aditional image
      if (x > (CanvasXSize - imgW)) { ctx2.drawImage(img, x - imgW + 1, y, imgW, imgH); }
    }
    //draw image
    ctx2.drawImage(img, x, y, imgW, imgH);
    //amount to move
    x += dx;
  }
}

window.onload = () => {
  picDraw();
};

// window.onload = () => {
//   var start = null;
//   var element = document.getElementById('SomeElementYouWantToAnimate');
//   element.style.position = 'absolute';

//   function step(timestamp) {
//     if (!start) start = timestamp;
//     var progress = timestamp - start;
//     // console.log('progress', progress);
//     // console.log(start);
//     // console.log(timestamp);

//     element.style.left = Math.min(progress / 10, 200) + 'px';
//     if (progress < 2000) {
//       window.requestAnimationFrame(step);
//     }
//   }

//   window.requestAnimationFrame(step);
// };