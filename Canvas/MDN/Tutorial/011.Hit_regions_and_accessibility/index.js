/**
 * 
 */

// 内容兼容
// <canvas> ... </canvas>标签里的内容被可以对一些不支持canvas的浏览器提供兼容。这对残疾用户设备也很有用（比如屏幕阅读器），这样它们就可以读取并解释DOM里的子节点。在html5accessibility.com有个很好的例子来演示它如何运作。

function drawPicture() {
  var canvas = document.getElementById('example');

  var context = canvas.getContext('2d');
  context.clearRect(0, 0, 260, 300); // clear canvas
  context.fillStyle = "rgb(0,255,0)";
  context.fillRect(25, 25, 100, 100);
  context.save();

  context.fillStyle = "rgba(255,0,0, 0.6)";
  context.beginPath();
  context.arc(125, 100, 50, 0, Math.PI * 2, true);
  context.fill();

  context.fillStyle = "rgba(0,0,255,0.6)";
  context.beginPath();
  context.moveTo(125, 100);
  context.lineTo(175, 50);
  context.lineTo(225, 150);
  context.fill();

  context.fillStyle = '#00008b';
  context.font = '20px sans-serif';
  context.textBaseline = 'top';
  context.fillText('Shapes', 20, 0);
  //context.font         = 'bold 30px sans-serif';
  //context.strokeText('Hello world!', 0, 50);
  //


}

function drawSquare() {

  var canvas = document.getElementById('example');

  var context = canvas.getContext('2d');



  context.strokeStyle = '#f00'; // red
  context.lineWidth = 4;
  context.strokeRect(25, 25, 100, 100);

}

function drawCircle() {

  var canvas = document.getElementById('example');

  var context = canvas.getContext('2d');


  context.strokeStyle = '#f00'; // red
  context.lineWidth = 4;
  //context.fillStyle = "rgba(255,0,0, 0.6)";
  context.beginPath();
  context.arc(125, 100, 50, 0, Math.PI * 2, true);
  context.stroke();
  //context.fill();

}

function drawTriangle() {

  var canvas = document.getElementById('example');

  var context = canvas.getContext('2d');



  context.strokeStyle = '#f00'; // red
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(125, 100);
  context.lineTo(175, 50);
  context.lineTo(225, 150);
  context.closePath();
  context.stroke();
}
function showDescription()
{
document.getElementById('example').insertAdjacentHTML('AfterEnd', document.getElementById('example').innerHTML)

}


// // 点击区域
// function addHitRegion() {
//   var canvas = document.getElementById("canvas");
//   var ctx = canvas.getContext("2d");
  
//   ctx.beginPath();
//   ctx.arc(70, 80, 10, 0, 2 * Math.PI, false);
//   ctx.fill();
//   debugger;
//   ctx.canvas.addHitRegion({id: "circle"});
  
//   canvas.addEventListener("mousemove", function(event){
//     if(event.region) {
//       alert("hit region: " + event.region);
//     }
//   });
// }


window.onload = ()=> {
  drawPicture();
  // addHitRegion();
};