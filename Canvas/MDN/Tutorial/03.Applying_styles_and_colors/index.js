/**
 * 色彩 Colors
 * 到目前为止，我们只看到过绘制内容的方法。如果我们想要给图形上色，有两个重要的属性可以做到：fillStyle 和 strokeStyle。
 * fillStyle = color   设置图形的填充颜色。
 * strokeStyle = color 设置图形轮廓的颜色。
 * 
 * color 可以是表示 CSS 颜色值的字符串，渐变对象或者图案对象。我们迟些再回头探讨渐变和图案对象。默认情况下，线条和填充颜色都是黑色（CSS 颜色值 #000000）。
 * 
 * 注意: 一旦您设置了 strokeStyle 或者 fillStyle 的值，那么这个新值就会成为新绘制的图形的默认值。如果你要给每个图形上不同的颜色，你需要重新设置 fillStyle 或 strokeStyle 的值。
 * 
 * 您输入的应该是符合 CSS3 颜色值标准 的有效字符串。下面的例子都表示同一种颜色。
 * 
 * 这些 fillStyle 的值均为 '橙色'
 * ctx.fillStyle = "orange";
 * ctx.fillStyle = "#FFA500";
 * ctx.fillStyle = "rgb(255,165,0)";
 * ctx.fillStyle = "rgba(255,165,0,1)";
 */

// fillStyle 示例
// 在本示例里，我会再度用两层 for 循环来绘制方格阵列，每个方格不同的颜色。结果如右图，但实现所用的代码却没那么绚丽。我用了两个变量 i 和 j 来为每一个方格产生唯一的 RGB 色彩值，其中仅修改红色和绿色通道的值，而保持蓝色通道的值不变。你可以通过修改这些颜色通道的值来产生各种各样的色板。通过增加渐变的频率，你还可以绘制出类似 Photoshop 里面的那样的调色板。

function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            let a = Math.floor(255 - 42.5 * i);
            let b = Math.floor(255 - 42.5 * j);
            ctx.fillStyle = 'rgb(' + a + ',' + b + ',0)';
            // console.log('Math.floor(255 - 42.5 * i)', a);
            // console.log('Math.floor(255 - 42.5 * j)', b);
            ctx.fillRect(j * 25, i * 25, 25, 25);
        }
    }
}

// strokeStyle 示例
// 这个示例与上面的有点类似，但这次用到的是 strokeStyle 属性，画的不是方格，而是用 arc 方法来画圆。

function draw1() {
    var ctx = document.getElementById('canvas1').getContext('2d');
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            ctx.strokeStyle = 'rgb(0,' + Math.floor(255 - 42.5 * i) + ',' + Math.floor(255 - 42.5 * j) + ')';
            ctx.beginPath();
            ctx.arc(12.5 + j * 25, 12.5 + i * 25, 10, 0, Math.PI * 2, true);
            ctx.stroke();
        }
    }
}

/**
 * 透明度 Transparency
 * 除了可以绘制实色图形，我们还可以用 canvas 来绘制半透明的图形。通过设置 globalAlpha 属性或者使用一个半透明颜色作为轮廓或填充的样式。
 * 
 * globalAlpha = transparencyValue
 * 这个属性影响到 canvas 里所有图形的透明度，有效的值范围是 0.0 （完全透明）到 1.0（完全不透明），默认是 1.0。
 * 
 * globalAlpha 属性在需要绘制大量拥有相同透明度的图形时候相当高效。不过，我认为下面的方法可操作性更强一点。
 * 
 * 因为 strokeStyle 和 fillStyle 属性接受符合 CSS 3 规范的颜色值，那我们可以用下面的写法来设置具有透明度的颜色。
 * // 指定透明颜色，用于描边和填充样式
 * ctx.strokeStyle = "rgba(255,0,0,0.5)";
 * ctx.fillStyle = "rgba(255,0,0,0.5)";
 * rgba() 方法与 rgb() 方法类似，就多了一个用于设置色彩透明度的参数。它的有效范围是从 0.0（完全透明）到 1.0（完全不透明）。
 */

// globalAlpha 示例
// 在这个例子里，将用四色格作为背景，设置 globalAlpha 为 0.2 后，在上面画一系列半径递增的半透明圆。最终结果是一个径向渐变效果。圆叠加得越更多，原先所画的圆的透明度会越低。通过增加循环次数，画更多的圆，背景图的中心部分会完全消失。

function draw2() {
    var ctx = document.getElementById('canvas2').getContext('2d');
    // 画背景
    ctx.fillStyle = '#FD0';
    ctx.fillRect(0, 0, 75, 75);
    ctx.fillStyle = '#6C0';
    ctx.fillRect(75, 0, 75, 75);
    ctx.fillStyle = '#09F';
    ctx.fillRect(0, 75, 75, 75);
    ctx.fillStyle = '#F30';
    ctx.fillRect(75, 75, 75, 75);
    ctx.fillStyle = '#FFF';

    // 设置透明度值
    ctx.globalAlpha = 0.2;

    // 画半透明圆
    for (var i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.arc(75, 75, 10 + 10 * i, 0, Math.PI * 2, true);
        ctx.fill();
    }
}

// rgba() 示例
// 第二个例子和上面那个类似，不过不是画圆，而是画矩形。这里还可以看出，rgba() 可以分别设置轮廓和填充样式，因而具有更好的可操作性和使用灵活性。

function draw3() {
    var ctx = document.getElementById('canvas3').getContext('2d');

    // 画背景
    ctx.fillStyle = 'rgb(255,221,0)';
    ctx.fillRect(0, 0, 150, 37.5);
    ctx.fillStyle = 'rgb(102,204,0)';
    ctx.fillRect(0, 37.5, 150, 37.5);
    ctx.fillStyle = 'rgb(0,153,255)';
    ctx.fillRect(0, 75, 150, 37.5);
    ctx.fillStyle = 'rgb(255,51,0)';
    ctx.fillRect(0, 112.5, 150, 37.5);

    // 画半透明矩形
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            ctx.fillStyle = 'rgba(255,255,255,' + (i + 1) / 10 + ')';
            for (let j = 0; j < 4; j++) {
                setTimeout(() => {
                    ctx.fillRect(5 + i * 14, 5 + j * 37.5, 14, 27.5);
                }, j * 50);
            }
        }, i * 50);
    }
}

/**
 * 线型 Line styles
 * 可以通过一系列属性来设置线的样式。
 * 
 * lineWidth = value        设置线条宽度。
 * lineCap = type           设置线条末端样式。
 * lineJoin = type          设定线条与线条间接合处的样式。
 * miterLimit = value       限制当两条线相交时交接处最大长度；所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度。
 * getLineDash()            返回一个包含当前虚线样式，长度为非负偶数的数组。
 * setLineDash(segments)    设置当前虚线样式。
 * lineDashOffset = value   设置虚线样式的起始偏移量。
 * 
 * 通过以下的样例可能会更加容易理解。
 */

// lineWidth 属性的例子
// 这个属性设置当前绘线的粗细。属性值必须为正数。默认值是1.0。
// 线宽是指给定路径的中心到两边的粗细。换句话说就是在路径的两边各绘制线宽的一半。因为画布的坐标并不和像素直接对应，当需要获得精确的水平或垂直线的时候要特别注意。
// 在下面的例子中，用递增的宽度绘制了10条直线。最左边的线宽1.0单位。并且，最左边的以及所有宽度为奇数的线并不能精确呈现，这就是因为路径的定位问题。

// 想要获得精确的线条，必须对线条是如何描绘出来的有所理解。见下图，用网格来代表 canvas 的坐标格，每一格对应屏幕上一个像素点。在第一个图中，填充了 (2,1) 至 (5,5) 的矩形，整个区域的边界刚好落在像素边缘上，这样就可以得到的矩形有着清晰的边缘。(见图一)

// 如果你想要绘制一条从 (3,1) 到 (3,5)，宽度是 1.0 的线条，你会得到像第二幅图一样的结果。实际填充区域（深蓝色部分）仅仅延伸至路径两旁各一半像素。而这半个像素又会以近似的方式进行渲染，这意味着那些像素只是部分着色，结果就是以实际笔触颜色一半色调的颜色来填充整个区域（浅蓝和深蓝的部分）。这就是上例中为何宽度为 1.0 的线并不准确的原因。

// 要解决这个问题，你必须对路径施以更加精确的控制。已知粗 1.0 的线条会在路径两边各延伸半像素，那么像第三幅图那样绘制从 (3.5,1) 到 (3.5,5) 的线条，其边缘正好落在像素边界，填充出来就是准确的宽为 1.0 的线条。

// 注意：在这个竖线的例子中，其Y坐标刚好落在网格线上，否则端点上同样会出现半渲染的像素点（但还要注意，这种行为的表现取决于当前的lineCap风格，它默认为butt；您可能希望通过将lineCap样式设置为square正方形，来得到与奇数宽度线的半像素坐标相一致的笔画，这样，端点轮廓的外边框将被自动扩展以完全覆盖整个像素格）。

// 还请注意，只有路径的起点和终点受此影响：如果一个路径是通过closePath()来封闭的，它是没有起点和终点的；相反的情况下，路径上的所有端点都与上一个点相连，下一段路径使用当前的lineJoin设置（默认为miter），如果相连路径是水平和/或垂直的话，会导致相连路径的外轮廓根据相交点自动延伸，因此渲染出的路径轮廓会覆盖整个像素格。接下来的两个小节将展示这些额外的行样式。

// 对于那些宽度为偶数的线条，每一边的像素数都是整数，那么你想要其路径是落在像素点之间 (如那从 (3,1) 到 (3,5)) 而不是在像素点的中间。同样，注意到那个例子的垂直线条，其 Y 坐标刚好落在网格线上，如果不是的话，端点上同样会出现半渲染的像素点。

// 虽然开始处理可缩放的 2D 图形时会有点小痛苦，但是及早注意到像素网格与路径位置之间的关系，可以确保图形在经过缩放或者其它任何变形后都可以保持看上去蛮好：线宽为 1.0 的垂线在放大 2 倍后，会变成清晰的线宽为 2.0，并且出现在它应该出现的位置上。

function draw4() {
    var ctx = document.getElementById('canvas4').getContext('2d');
    for (var i = 0; i < 10; i++) {
        let w = 1 + i;
        ctx.lineWidth = w;
        ctx.beginPath();
        let x = 5 + i * 14;
        if (w % 2 != 0) {
            x += 0.5; // 保证座标正确，才能清晰
        }
        ctx.moveTo(x, 5);
        ctx.lineTo(x, 140);
        ctx.stroke();
    }
}

// lineCap 属性的例子
// 属性 lineCap 的值决定了线段端点显示的样子。它可以为下面的三种的其中之一：butt，round 和 square。默认是 butt。
// 在这个例子里面，我绘制了三条直线，分别赋予不同的 lineCap 值。还有两条辅助线，为了可以看得更清楚它们之间的区别，三条线的起点终点都落在辅助线上。
// 最左边的线用了默认的 butt 。可以注意到它是与辅助线齐平的。中间的是 round 的效果，端点处加上了半径为一半线宽的半圆。右边的是 square 的效果，端点处加上了等宽且高度为一半线宽的方块。

function draw5() {
    var ctx = document.getElementById('canvas5').getContext('2d');
    var lineCap = ['butt', 'round', 'square'];

    // 创建路径
    ctx.strokeStyle = '#09f';
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(10, 140);
    ctx.moveTo(10, 140);
    ctx.lineTo(140, 140);
    ctx.stroke();

    // 画线条
    ctx.strokeStyle = 'black';
    for (var i = 0; i < lineCap.length; i++) {
        ctx.lineWidth = 15;
        ctx.lineCap = lineCap[i];
        ctx.beginPath();
        ctx.moveTo(25 + i * 50, 10);
        ctx.lineTo(25 + i * 50, 140);
        ctx.stroke();
    }
}

// lineJoin 属性的例子
// lineJoin 的属性值决定了图形中两线段连接处所显示的样子。它可以是这三种之一：round, bevel 和 miter。默认是 miter。
// 这里我同样用三条折线来做例子，分别设置不同的 lineJoin 值。最上面一条是 round 的效果，边角处被磨圆了，圆的半径等于线宽。中间和最下面一条分别是 bevel 和 miter 的效果。当值是 miter 的时候，线段会在连接处外侧延伸直至交于一点，延伸效果受到下面将要介绍的 miterLimit 属性的制约。

function draw6() {
    var ctx = document.getElementById('canvas6').getContext('2d');
    var lineJoin = ['round', 'bevel', 'miter'];
    ctx.lineWidth = 10;
    for (var i = 0; i < lineJoin.length; i++) {
        ctx.lineJoin = lineJoin[i];
        ctx.beginPath();
        ctx.moveTo(5, 15 + i * 40);
        ctx.lineTo(40, 55 + i * 40);
        ctx.lineTo(80, 15 + i * 40);
        ctx.lineTo(120, 55 + i * 40);
        ctx.lineTo(160, 15 + i * 40);
        ctx.stroke();
    }
}

// miterLimit 属性的演示例子
// 就如上一个例子所见的应用 miter 的效果，线段的外侧边缘会延伸交汇于一点上。线段直接夹角比较大的，交点不会太远，但当夹角减少时，交点距离会呈指数级增大。

// miterLimit 属性就是用来设定外延交点与连接点的最大距离，如果交点距离大于此值，连接效果会变成了 bevel。

// 下面是一个演示页面，你可以动手改变 miterLimit 的值，观察其影响效果。蓝色辅助线显示锯齿折线段的起点与终点所在的位置。

// 提示：只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。

function draw7() {
    var ctx = document.getElementById('canvas7').getContext('2d');

    ctx.lineWidth = 10;
    ctx.lineJoin = 'miter';

    for (var i = 0; i < 3; i++) {
        ctx.miterLimit = i / 2;
        ctx.beginPath();
        ctx.moveTo(5, 15 + i * 40);
        ctx.lineTo(40, 65 + i * 40);
        ctx.lineTo(80, 15 + i * 40);
        ctx.lineTo(120, 65 + i * 40);
        ctx.lineTo(160, 15 + i * 40);
        ctx.stroke();
    }
}

// 使用虚线
// 用 setLineDash 方法和 lineDashOffset 属性来制定虚线样式. setLineDash 方法接受一个数组，来指定线段与间隙的交替；lineDashOffset 属性设置起始偏移量.
// 在这个例子中，我们要创建一个行军蚁的效果。它往往是在计算机图形程序选区工具动效。它可以帮助用户通过动画的边界来区分图像背景选区边框。在本教程的后面部分，你可以学习如何做到这一点和其他基本的动画。


var offset = 0;

function draw8() {
    var ctx = document.getElementById('canvas8').getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setLineDash([4, 2]);
    ctx.lineDashOffset = -offset;
    ctx.strokeRect(20, 20, 100, 100);
}

function march() {
    offset++;
    if (offset > 16) {
        offset = 0;
    }
    draw8();
    setTimeout(march, 20);
}

/**
 * 渐变 Gradients
 * 就好像一般的绘图软件一样，我们可以用线性或者径向的渐变来填充或描边。我们用下面的方法新建一个 canvasGradient 对象，并且赋给图形的 fillStyle 或 strokeStyle 属性。
 * 
 * createLinearGradient(x1, y1, x2, y2)
 * createLinearGradient 方法接受 4 个参数，表示渐变的起点 (x1,y1) 与终点 (x2,y2)。
 * createRadialGradient(x1, y1, r1, x2, y2, r2)
 * createRadialGradient 方法接受 6 个参数，前三个定义一个以 (x1,y1) 为原点，半径为 r1 的圆，后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。
 * var lineargradient = ctx.createLinearGradient(0,0,150,150);
 * var radialgradient = ctx.createRadialGradient(75,75,0,75,75,100);
 * 创建出 canvasGradient 对象后，我们就可以用 addColorStop 方法给它上色了。
 * gradient.addColorStop(position, color)
 * addColorStop 方法接受 2 个参数，position 参数必须是一个 0.0 与 1.0 之间的数值，表示渐变中颜色所在的相对位置。例如，0.5 表示颜色会出现在正中间。color 参数必须是一个有效的 CSS 颜色值（如 #FFF， rgba(0,0,0,1)，等等）。
 * 
 * 你可以根据需要添加任意多个色标（color stops）。下面是最简单的线性黑白渐变的例子。
 * var lineargradient = ctx.createLinearGradient(0,0,150,150);
 * lineargradient.addColorStop(0,'white');
 * lineargradient.addColorStop(1,'black');
 */

function draw9() {
    var ctx1 = document.getElementById('canvas9-1').getContext('2d');
    var lineargradient = ctx1.createLinearGradient(0, 0, 150, 150);
    lineargradient.addColorStop(0, 'white');
    lineargradient.addColorStop(1, 'black');
    ctx1.fillStyle = lineargradient;
    ctx1.fillRect(10, 10, 130, 130);

    var ctx = document.getElementById('canvas9').getContext('2d');

    // Create gradients
    var lingrad = ctx.createLinearGradient(0, 0, 0, 150);
    lingrad.addColorStop(0, '#00ABEB');
    lingrad.addColorStop(0.5, '#fff');
    lingrad.addColorStop(0.5, '#26C000');
    lingrad.addColorStop(1, '#fff');

    var lingrad2 = ctx.createLinearGradient(0, 50, 0, 95);
    lingrad2.addColorStop(0.5, '#000');
    lingrad2.addColorStop(1, 'rgba(0,0,0,0)');

    // assign gradients to fill and stroke styles
    ctx.fillStyle = lingrad;
    ctx.strokeStyle = lingrad2;

    // draw shapes
    ctx.fillRect(10, 10, 130, 130);
    ctx.strokeRect(50, 50, 50, 50);
}

//  createRadialGradient 的例子
//  这个例子，我定义了 4 个不同的径向渐变。由于可以控制渐变的起始与结束点，所以我们可以实现一些比（如在 Photoshop 中所见的）经典的径向渐变更为复杂的效果。
// （经典的径向渐变是只有一个中心点，简单地由中心点向外围的圆形扩张）
//  这里，我让起点稍微偏离终点，这样可以达到一种球状 3D 效果。但最好不要让里圆与外圆部分交叠，那样会产生什么效果就真是不得而知了。
//  4 个径向渐变效果的最后一个色标都是透明色。如果想要两色标直接的过渡柔和一些，只要两个颜色值一致就可以了。代码里面看不出来，是因为我用了两种不同的颜色表示方法，但其实是相同的，#019F62 = rgba(1,159,98,1)。

function draw10() {
    // createRadialGradient(x1, y1, r1, x2, y2, r2)
    // createRadialGradient 方法接受 6 个参数，前三个定义一个以 (x1,y1) 为原点，半径为 r1 的圆，后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。
    // var ctx = document.getElementById('canvas10').getContext('2d');
    var ctx1 = document.getElementById('canvas10-1').getContext('2d');
    var ctx2 = document.getElementById('canvas10-2').getContext('2d');
    var ctx3 = document.getElementById('canvas10-3').getContext('2d');
    var ctx4 = document.getElementById('canvas10-4').getContext('2d');

    // 创建渐变
    var radgrad1 = ctx1.createRadialGradient(45, 45, 10, 45, 45, 30);
    radgrad1.addColorStop(0, '#A7D30C');
    radgrad1.addColorStop(0.9, '#019F62');
    radgrad1.addColorStop(1, 'rgba(1,159,98,0)');

    var radgrad2 = ctx2.createRadialGradient(50, 50, 20, 32, 65, 50);
    radgrad2.addColorStop(0, '#FF5F98');
    radgrad2.addColorStop(0.75, '#FF0188');
    radgrad2.addColorStop(1, 'rgba(255,1,136,0)');

    var radgrad3 = ctx3.createRadialGradient(95, 15, 15, 102, 20, 40);
    radgrad3.addColorStop(0, '#00C9FF');
    radgrad3.addColorStop(0.8, '#00B5E2');
    radgrad3.addColorStop(1, 'rgba(0,201,255,0)');

    var radgrad4 = ctx4.createRadialGradient(0, 150, 50, 0, 140, 90);
    radgrad4.addColorStop(0, '#F4F201');
    radgrad4.addColorStop(0.8, '#E4C700');
    radgrad4.addColorStop(1, 'rgba(228,199,0,0)');

    // 画图形
    ctx4.fillStyle = radgrad4;
    ctx4.fillRect(0, 0, 150, 150);
    ctx3.fillStyle = radgrad3;
    ctx3.fillRect(0, 0, 150, 150);
    ctx2.fillStyle = radgrad2;
    ctx2.fillRect(0, 0, 150, 150);
    ctx1.fillStyle = radgrad1;
    ctx1.fillRect(0, 0, 150, 150);
}

/**
 * 图案样式 Patterns
 * 上一节的一个例子里面，我用了循环来实现图案的效果。其实，有一个更加简单的方法：createPattern。
 * 
 * createPattern(image, type)
 * 该方法接受两个参数。Image 可以是一个 Image 对象的引用，或者另一个 canvas 对象。Type 必须是下面的字符串值之一：repeat，repeat-x，repeat-y 和 no-repeat。
 * 注意: 用 canvas 对象作为 Image 参数在 Firefox 1.5 (Gecko 1.8) 中是无效的。
 * 图案的应用跟渐变很类似的，创建出一个 pattern 之后，赋给 fillStyle 或 strokeStyle 属性即可。
 * var img = new Image();
 * img.src = 'someimage.png';
 * var ptrn = ctx.createPattern(img,'repeat');
 * 
 * 注意：与 drawImage 有点不同，你需要确认 image 对象已经装载完毕，否则图案可能效果不对的。
 */

// createPattern 的例子
// 在最后的例子中，我创建一个图案然后赋给了 fillStyle 属性。唯一要注意的是，使用 Image 对象的 onload handler 来确保设置图案之前图像已经装载完毕。

function draw11() {
    var ctx = document.getElementById('canvas11').getContext('2d');
    // 创建新 image 对象，用作图案
    var img = new Image();
    img.src = './9.jpg';
    img.onload = function () {
        // 创建图案
        var ptrn = ctx.createPattern(img, 'repeat');
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, 100, 150);
    }
}

/**
 * 阴影 Shadows
 * 
 * shadowOffsetX = float
 * shadowOffsetX 和 shadowOffsetY 用来设定阴影在 X 和 Y 轴的延伸距离，它们是不受变换矩阵所影响的。负值表示阴影会往上或左延伸，正值则表示会往下或右延伸，它们默认都为 0。
 * shadowOffsetY = float
 * shadowOffsetX 和 shadowOffsetY 用来设定阴影在 X 和 Y 轴的延伸距离，它们是不受变换矩阵所影响的。负值表示阴影会往上或左延伸，正值则表示会往下或右延伸，它们默认都为 0。
 * shadowBlur = float
 * shadowBlur 用于设定阴影的模糊程度，其数值并不跟像素数量挂钩，也不受变换矩阵的影响，默认为 0。
 * shadowColor = color
 * shadowColor 是标准的 CSS 颜色值，用于设定阴影颜色效果，默认是全透明的黑色。
 */

// 文字阴影的例子
// 这个例子绘制了带阴影效果的文字。

function draw12() {
    var ctx = document.getElementById('canvas12').getContext('2d');

    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

    ctx.font = "20px Times New Roman";
    ctx.fillStyle = "Black";
    ctx.fillText("测试 123 abc ABC", 5, 30);
}

// Canvas 填充规则
// 当我们用到 fill（或者 clip和isPointinPath ）你可以选择一个填充规则，该填充规则根据某处在路径的外面或者里面来决定该处是否被填充，这对于自己与自己路径相交或者路径被嵌套的时候是有用的。

// 两个可能的值：
//  "nonzero": non-zero winding rule, 默认值.
//  "evenodd":  even-odd winding rule.
// 这个例子，我们用填充规则 evenodd

function draw13() {
    var ctx = document.getElementById('canvas13').getContext('2d');
    ctx.beginPath();
    ctx.arc(50, 50, 30, 0, Math.PI * 2, true);
    ctx.arc(50, 50, 15, 0, Math.PI * 2, true);
    ctx.fill("evenodd");
}

window.onload = function () {
    draw();
    draw1();
    draw2();
    draw3();
    draw4();
    draw5();
    draw6();
    draw7();
    march();
    draw9();
    draw10();
    draw11();
    draw12();
    draw13();
}