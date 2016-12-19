window.onload = function() {

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    var grd = ctx.createRadialGradient(100, 100, 10, 100, 100, 150);
    // x0 渐变的开始圆的 x 坐标
    // y0 渐变的开始圆的 y 坐标
    // r0 开始圆的半径
    // x1 渐变的结束圆的 x 坐标
    // y1 渐变的结束圆的 y 坐标
    // r1 结束圆的半径

    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    // Fill with gradient
    ctx.fillStyle = grd;

    ctx.fillRect(0, 0, 200, 200);

};
