
/**
 * 在之前的例子里面，我们总是将一个图形画在另一个之上，对于其他更多的情况，仅仅这样是远远不够的。比如，对合成的图形来说，绘制顺序会有限制。
 * 不过，我们可以利用 globalCompositeOperation 属性来改变这种状况。此外, clip属性允许我们隐藏不想看到的部分图形.
 * 
 * globalCompositeOperation
 * 我们不仅可以在已有图形后面再画新图形，还可以用来遮盖指定区域，清除画布中的某些部分（清除区域不仅限于矩形，像clearRect()方法做的那样 ）以及更多其他操作。
 * 
 * globalCompositeOperation = type
 * 这个属性设定了在画新图形时采用的遮盖策略，其值是一个标识12种遮盖方式的字符串。
 * 查看下面遮盖例子的对应代码。
 */

var canvas1 = document.createElement("canvas");
var canvas2 = document.createElement("canvas");
var gco = ['source-over', 'source-in', 'source-out', 'source-atop',
  'destination-over', 'destination-in', 'destination-out', 'destination-atop',
  'lighter', 'copy', 'xor', 'multiply', 'screen', 'overlay', 'darken',
  'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light',
  'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
].reverse();
var gcoText = [
  'This is the default setting and draws new shapes on top of the existing canvas content.',
  'The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent.',
  'The new shape is drawn where it doesn\'t overlap the existing canvas content.',
  'The new shape is only drawn where it overlaps the existing canvas content.',
  'New shapes are drawn behind the existing canvas content.',
  'The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent.',
  'The existing content is kept where it doesn\'t overlap the new shape.',
  'The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content.',
  'Where both shapes overlap the color is determined by adding color values.',
  'Only the new shape is shown.',
  'Shapes are made transparent where both overlap and drawn normal everywhere else.',
  'The pixels are of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result.',
  'The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)',
  'A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.',
  'Retains the darkest pixels of both layers.',
  'Retains the lightest pixels of both layers.',
  'Divides the bottom layer by the inverted top layer.',
  'Divides the inverted bottom layer by the top layer, and then inverts the result.',
  'A combination of multiply and screen like overlay, but with top and bottom layer swapped.',
  'A softer version of hard-light. Pure black or white does not result in pure black or white.',
  'Subtracts the bottom layer from the top layer or the other way round to always get a positive value.',
  'Like difference, but with lower contrast.',
  'Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.',
  'Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.',
  'Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.',
  'Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.'
].reverse();
var width = 320;
var height = 340;
window.onload = function () {
  // lum in sRGB
  var lum = {
    r: 0.33,
    g: 0.33,
    b: 0.33
  };
  // resize canvas
  canvas1.width = width;
  canvas1.height = height;
  canvas2.width = width;
  canvas2.height = height;
  lightMix()
  colorSphere();
  runComposite();
  return;
};
function createCanvas() {
  var canvas = document.createElement("canvas");
  canvas.style.background = "url(" + op_8x8.data + ")";
  canvas.style.border = "1px solid #000";
  canvas.style.margin = "5px";
  canvas.width = width / 2;
  canvas.height = height / 2;
  return canvas;
}

function runComposite() {
  var dl = document.createElement("dl");
  document.body.appendChild(dl);
  while (gco.length) {
    var pop = gco.pop();
    var dt = document.createElement("dt");
    dt.textContent = pop;
    dl.appendChild(dt);
    var dd = document.createElement("dd");
    var p = document.createElement("p");
    p.textContent = gcoText.pop();
    dd.appendChild(p);

    var canvasToDrawOn = createCanvas();
    var canvasToDrawFrom = createCanvas();
    var canvasToDrawResult = createCanvas();

    var ctx = canvasToDrawResult.getContext('2d');
    ctx.clearRect(0, 0, width, height)
    ctx.save();
    ctx.drawImage(canvas1, 0, 0, width / 2, height / 2);
    ctx.globalCompositeOperation = pop;
    ctx.drawImage(canvas2, 0, 0, width / 2, height / 2);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, height / 2 - 20, width / 2, 20);
    ctx.fillStyle = "#FFF";
    ctx.font = "14px arial";
    ctx.fillText(pop, 5, height / 2 - 5);
    ctx.restore();

    var ctx = canvasToDrawOn.getContext('2d');
    ctx.clearRect(0, 0, width, height)
    ctx.save();
    ctx.drawImage(canvas1, 0, 0, width / 2, height / 2);
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, height / 2 - 20, width / 2, 20);
    ctx.fillStyle = "#FFF";
    ctx.font = "14px arial";
    ctx.fillText('existing content', 5, height / 2 - 5);
    ctx.restore();

    var ctx = canvasToDrawFrom.getContext('2d');
    ctx.clearRect(0, 0, width, height)
    ctx.save();
    ctx.drawImage(canvas2, 0, 0, width / 2, height / 2);
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, height / 2 - 20, width / 2, 20);
    ctx.fillStyle = "#FFF";
    ctx.font = "14px arial";
    ctx.fillText('new content', 5, height / 2 - 5);
    ctx.restore();

    dd.appendChild(canvasToDrawOn);
    dd.appendChild(canvasToDrawFrom);
    dd.appendChild(canvasToDrawResult);

    dl.appendChild(dd);

  }
};
var lightMix = function () {
  var ctx = canvas2.getContext("2d");
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.beginPath();
  ctx.fillStyle = "rgba(255,0,0,1)";
  ctx.arc(100, 200, 100, Math.PI * 2, 0, false);
  ctx.fill()
  ctx.beginPath();
  ctx.fillStyle = "rgba(0,0,255,1)";
  ctx.arc(220, 200, 100, Math.PI * 2, 0, false);
  ctx.fill()
  ctx.beginPath();
  ctx.fillStyle = "rgba(0,255,0,1)";
  ctx.arc(160, 100, 100, Math.PI * 2, 0, false);
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.fillStyle = "#f00";
  ctx.fillRect(0, 0, 30, 30)
  ctx.fill();
};
var colorSphere = function (element) {
  var ctx = canvas1.getContext("2d");
  var width = 360;
  var halfWidth = width / 2;
  var rotate = (1 / 360) * Math.PI * 2; // per degree
  var offset = 0; // scrollbar offset
  var oleft = -20;
  var otop = -20;
  for (var n = 0; n <= 359; n++) {
    var gradient = ctx.createLinearGradient(oleft + halfWidth, otop, oleft + halfWidth, otop + halfWidth);
    var color = Color.HSV_RGB({ H: (n + 300) % 360, S: 100, V: 100 });
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.7, "rgba(" + color.R + "," + color.G + "," + color.B + ",1)");
    gradient.addColorStop(1, "rgba(255,255,255,1)");
    ctx.beginPath();
    ctx.moveTo(oleft + halfWidth, otop);
    ctx.lineTo(oleft + halfWidth, otop + halfWidth);
    ctx.lineTo(oleft + halfWidth + 6, otop);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.translate(oleft + halfWidth, otop + halfWidth);
    ctx.rotate(rotate);
    ctx.translate(-(oleft + halfWidth), -(otop + halfWidth));
  }
  ctx.beginPath();
  ctx.fillStyle = "#00f";
  ctx.fillRect(15, 15, 30, 30)
  ctx.fill();
  return ctx.canvas;
};
// HSV (1978) = H: Hue / S: Saturation / V: Value
Color = {};
Color.HSV_RGB = function (o) {
  var H = o.H / 360,
    S = o.S / 100,
    V = o.V / 100,
    R, G, B;
  var A, B, C, D;
  if (S == 0) {
    R = G = B = Math.round(V * 255);
  } else {
    if (H >= 1) H = 0;
    H = 6 * H;
    D = H - Math.floor(H);
    A = Math.round(255 * V * (1 - S));
    B = Math.round(255 * V * (1 - (S * D)));
    C = Math.round(255 * V * (1 - (S * (1 - D))));
    V = Math.round(255 * V);
    switch (Math.floor(H)) {
      case 0:
        R = V;
        G = C;
        B = A;
        break;
      case 1:
        R = B;
        G = V;
        B = A;
        break;
      case 2:
        R = A;
        G = V;
        B = C;
        break;
      case 3:
        R = A;
        G = B;
        B = V;
        break;
      case 4:
        R = C;
        G = A;
        B = V;
        break;
      case 5:
        R = V;
        G = A;
        B = B;
        break;
    }
  }
  return {
    R: R,
    G: G,
    B: B
  };
};

var createInterlace = function (size, color1, color2) {
  var proto = document.createElement("canvas").getContext("2d");
  proto.canvas.width = size * 2;
  proto.canvas.height = size * 2;
  proto.fillStyle = color1; // top-left
  proto.fillRect(0, 0, size, size);
  proto.fillStyle = color2; // top-right
  proto.fillRect(size, 0, size, size);
  proto.fillStyle = color2; // bottom-left
  proto.fillRect(0, size, size, size);
  proto.fillStyle = color1; // bottom-right
  proto.fillRect(size, size, size, size);
  var pattern = proto.createPattern(proto.canvas, "repeat");
  pattern.data = proto.canvas.toDataURL();
  return pattern;
};


var op_8x8 = createInterlace(8, "#FFF", "#eee");


/**
 * 裁切路径 Clipping paths
 * 裁切路径和普通的 canvas 图形差不多，不同的是它的作用是遮罩，用来隐藏不需要的部分。如右图所示。红边五角星就是裁切路径，所有在路径以外的部分都不会在 canvas 上绘制出来。
 * 如果和上面介绍的 globalCompositeOperation 属性作一比较，它可以实现与 source-in 和 source-atop 差不多的效果。最重要的区别是裁切路径不会在 canvas 上绘制东西，
 * 而且它永远不受新图形的影响。这些特性使得它在特定区域里绘制图形时相当好用。
 * 
 * 在 绘制图形 一章中，我只介绍了 stroke 和 fill 方法，这里介绍第三个方法 clip。
 * 
 * clip()
 * Turns the path currently being built into the current clipping path.
 * 我们使用 clip() 方法来创建一个新的裁切路径。
 * 
 * 默认情况下，canvas 有一个与它自身一样大的裁切路径（也就是没有裁切效果）。
 */

// clip 的例子
// 这个例子，我会用一个圆形的裁切路径来限制随机星星的绘制区域。

function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.fillRect(0, 0, 150, 150);
  ctx.translate(75, 75);

  // Create a circular clipping path
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2, true);
  ctx.clip();

  // draw background
  var lingrad = ctx.createLinearGradient(0, -75, 0, 75);
  lingrad.addColorStop(0, '#232256');
  lingrad.addColorStop(1, '#143778');

  ctx.fillStyle = lingrad;
  ctx.fillRect(-75, -75, 150, 150);

  // draw stars
  for (var j = 1; j < 50; j++) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.translate(75 - Math.floor(Math.random() * 150),
      75 - Math.floor(Math.random() * 150));
    drawStar(ctx, Math.floor(Math.random() * 4) + 2);
    ctx.restore();
  }

}
function drawStar(ctx, r) {
  ctx.save();
  ctx.beginPath()
  ctx.moveTo(r, 0);
  for (var i = 0; i < 9; i++) {
    ctx.rotate(Math.PI / 5);
    if (i % 2 == 0) {
      ctx.lineTo((r / 0.525731) * 0.200811, 0);
    } else {
      ctx.lineTo(r, 0);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

draw();

// 首先，我画了一个与 canvas 一样大小的黑色方形作为背景，然后移动原点至中心点。然后用 clip 方法创建一个弧形的裁切路径。裁切路径也属于 canvas 状态的一部分，可以被保存起来。如果我们在创建新裁切路径时想保留原来的裁切路径，我们需要做的就是保存一下 canvas 的状态。

// 裁切路径创建之后所有出现在它里面的东西才会画出来。在画线性渐变时我们就会注意到这点。然后会绘制出50 颗随机位置分布（经过缩放）的星星，当然也只有在裁切路径里面的星星才会绘制出来。