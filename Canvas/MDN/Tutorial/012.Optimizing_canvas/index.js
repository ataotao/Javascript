/**
 * 性能贴士
 * 下面是一些改善性能的建议
 */

// 在离屏canvas上预渲染相似的图形或重复的对象
// 如果你发现你的在每一帧里有好多复杂的画图运算，请考虑创建一个离屏canvas，将图像在这个画布上画一次（或者每当图像改变的时候画一次），然后在每帧上画出视线以外的这个画布。
function offScreenCanvas() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var slider = document.getElementById("scale-range");
  
  var watermarkCanvas = document.createElement("canvas");
  var watermarkContext = watermarkCanvas.getContext("2d");

  canvas.width = 300;
  canvas.height = 300;

  var image = new Image();
  var scale = 1.0;
  image.src = "9.jpg";
  image.onload = function () {
    drawImage(image, scale);

    slider.onmousemove = function () {
      scale = slider.value;
      drawImage(image, scale);
    }
  }

  //setup watermark canvas  
  watermarkCanvas.width = 300;
  watermarkCanvas.height = 300;

  watermarkContext.font = "bold 40px Arial";
  watermarkContext.lineWidth = "1";
  watermarkContext.fillStyle = "rgba( 255 , 255 , 255 , 0.5 )";
  watermarkContext.textBaseline = "middle";
  watermarkContext.fillText("水印标记符号", 20, 50);

  function drawImage(image, scale) {

    imageWidth = 300 * scale;
    imageHeight = 300 * scale;

    if(imageWidth < canvas.width){
      imageWidth = canvas.width;
      imageHeight = canvas.height;
    }

    x = canvas.width / 2 - imageWidth / 2;
    y = canvas.height / 2 - imageHeight / 2;
  
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, x, y, imageWidth, imageHeight);
    context.drawImage(watermarkCanvas, canvas.width - watermarkCanvas.width, canvas.height - watermarkCanvas.height);
  }
}

// 避免浮点数的坐标点，用整数取而代之
// 当你画一个没有整数坐标点的对象时会发生子像素渲染。

// ctx.drawImage(myImage, 0.3, 0.5);
// 浏览器为了达到抗锯齿的效果会做额外的运算。为了避免这种情况，请保证在你调用drawImage()函数时，用Math.floor()函数对所有的坐标点取整。

// 不要在用drawImage时缩放图像
// 在离屏canvas中缓存图片的不同尺寸，而不要用drawImage()去缩放它们

// 使用多层画布去画一个复杂的场景
// 你可能会发现，你有些元素不断地改变或者移动，而其它的元素，例如外观，永远不变。这种情况的一种优化是去用多个画布元素去创建不同层次。
// 例如，你可以在最顶层创建一个外观层，而且仅仅在用户输入的时候被画出。你可以创建一个游戏层，在上面会有不断更新的元素和一个背景层，给那些较少更新的元素。
// div id="stage">
//   <canvas id="ui-layer" width="480" height="320"></canvas>
//   <canvas id="game-layer" width="480" height="320"></canvas>
//   <canvas id="background-layer" width="480" height="320"></canvas>
// </div>


// 用CSS设置大的背景图
// 如果像大多数游戏那样，你有一张静态的背景图，用一个静态的<div>元素，结合background 特性，以及将它置于画布元素之后。这么做可以避免在每一帧在画布上绘制大图。

// 用CSS transforms特性缩放画布
// CSS transforms 特性由于调用GPU，因此更快捷。最好的情况是，不要将小画布放大，而是去将大画布缩小。例如Firefox系统，目标分辨率480 x 320 px。

// var scaleX = canvas.width / window.innerWidth;
// var scaleY = canvas.height / window.innerHeight;

// var scaleToFit = Math.min(scaleX, scaleY);
// var scaleToCover = Math.max(scaleX, scaleY);

// stage.style.transformOrigin = "0 0"; //scale from top left
// stage.style.transform = "scale(" + scaleToFit + ")";


// 使用moz-opaque属性(仅限Gecko)
// 如果你的游戏使用画布而且不需要透明，请在画布上设置moz-opaque属性。这能够用于内部渲染优化。

// If your game uses canvas and doesn’t need to be transparent, set the moz-opaque attribute on the canvas tag. This information can be used internally to optimize rendering.

// <canvas id="mycanvas" moz-opaque></canvas>
// 更多的贴士
// 将画布的函数调用集合到一起（例如，画一条折线，而不要画多条分开的直线）
// 避免不必要的画布状态改变
// 渲染画布中的不同点，而非整个新状态
// 尽可能避免 shadowBlur特性
// 尽可能避免text rendering
// 使用不同的办法去清除画布(clearRect() vs. fillRect() vs. 调整canvas大小)
//  有动画，请使用window.requestAnimationFrame() 而非window.setInterval()
// 请谨慎使用大型物理库
// 用JSPerf测试性能


window.onload = function () {
  offScreenCanvas();

}





