
/**
 * 在上一章，我们制作了基本动画以及逐步了解了让物件移动的方法。在这一部分，我们将会对运动有更深的了解并学会添加一些符合物理的运动以让我们的动画更加高级。
 */

// 绘制小球
// 我们将会画一个小球用于动画学习，所以首先在画布上画一个球。下面的代码帮助我们建立画布。

// <canvas id="canvas" width="600" height="300"></canvas>
// 跟平常一样，我们需要先画一个 context（画布场景）。为了画出这个球，我们又会创建一个包含一些相关属性以及 draw() 函数的 ball 对象，来完成绘制。
// 这里并没有什么特别的。小球实际上是一个简单的圆形，在arc() 函数的帮助下画出。

// function initdraw() {
//   var canvas = document.getElementById('canvas');
//   var ctx = canvas.getContext('2d');

//   var ball = {
//     x: 100,
//     y: 100,
//     radius: 25,
//     color: 'blue',
//     draw: function () {
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
//       ctx.closePath();
//       ctx.fillStyle = this.color;
//       ctx.fill();
//     }
//   };

//   ball.draw();
// }



// // 添加速率
// // 现在我们有了一个小球，正准备添加一些基本动画，正如我们上一章所学的。
// // 又是这样，window.requestAnimationFrame() 再一次帮助我们控制动画。小球依旧依靠添加速率矢量进行移动。在每一帧里面，我们依旧用clear 清理掉之前帧里旧的圆形。

// // 边界  
// // 若没有任何的碰撞检测，我们的小球很快就会超出画布。我们需要检查小球的 x 和 y 位置是否已经超出画布的尺寸以及是否需要将速度矢量反转。为了这么做，我们把下面的检查代码添加进 draw 函数：

// function initdraw1() {
//   var canvas = document.getElementById('canvas1');
//   var ctx = canvas.getContext('2d');
//   var raf;

//   var ball = {
//     x: 100,
//     y: 100,
//     vx: 5,
//     vy: 2,
//     radius: 25,
//     color: 'blue',
//     draw: function () {
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
//       ctx.closePath();
//       ctx.fillStyle = this.color;
//       ctx.fill();
//     }
//   };

//   function draw() {
//     // ctx.clearRect(0, 0, canvas.width, canvas.height);   
//     // 长尾效果 现在，我们使用的是 clearRect 函数帮我们清除前一帧动画。若用一个半透明的 fillRect 函数取代之，就可轻松制作长尾效果。
//     ctx.fillStyle = 'rgba(255,255,255,0.3)';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     ball.draw();
//     ball.x += ball.vx;
//     ball.y += ball.vy;
//     // 加速度 为了让动作更真实，你可以像这样处理速度，例如：
//     ball.vy *= .99;
//     ball.vy += .25;
//     // 若没有任何的碰撞检测，我们的小球很快就会超出画布。我们需要检查小球的 x 和 y 位置是否已经超出画布的尺寸以及是否需要将速度矢量反转。
//     if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
//       ball.vy = -ball.vy;
//     }
//     if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
//       ball.vx = -ball.vx;
//     }

//     raf = window.requestAnimationFrame(draw);
//   }

//   canvas.addEventListener('mouseover', function (e) {
//     raf = window.requestAnimationFrame(draw);
//   });

//   canvas.addEventListener('mouseout', function (e) {
//     window.cancelAnimationFrame(raf);
//   });

//   ball.draw();
// }

// 添加鼠标控制
// 为了更好地控制小球，我们可以用 mousemove事件让它跟随鼠标活动。下面例子中，click 事件会释放小球然后让它重新跳起。

function initdraw2() {
  var canvas = document.getElementById('canvas2');
  var ctx = canvas.getContext('2d');
  var raf;
  var running = false;

  var ball = {
    x: 100,
    y: 100,
    vx: 5,
    vy: 1,
    radius: 25,
    color: 'blue',
    draw: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  };

  function clear() {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    clear();
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
      ball.vy = -ball.vy;
    }
    if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
      ball.vx = -ball.vx;
    }

    raf = window.requestAnimationFrame(draw);
  }
  
  canvas.addEventListener('mousemove', function (e) {
    if (!running) {
      clear();
      ball.x = e.clientX;
      ball.y = e.clientY;
      ball.draw();
    }
  });

  canvas.addEventListener('click', function (e) {
    if (!running) {
      raf = window.requestAnimationFrame(draw);
      running = true;
    }else{
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ball.x = e.clientX;
      ball.y = e.clientY;
      ball.draw();
      window.cancelAnimationFrame(raf);
      running = false;
    }
  });

  canvas.addEventListener('mouseout', function (e) {
    window.cancelAnimationFrame(raf);
    running = false;
  });

  ball.draw();
}

window.onload = () => {
  // initdraw();
  // initdraw1();
  initdraw2();
}