window.onload = function() {

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    // x0  渐变开始点的 x 坐标
    // y0  渐变开始点的 y 坐标
    // x1  渐变结束点的 x 坐标
    // y1  渐变结束点的 y 坐标

    grd.addColorStop(0, "black");
    grd.addColorStop(1, "white");

    ctx.fillStyle = grd;
    ctx.fillRect(20, 20, 150, 100);

    //定义一个渐变（从上到下）作为矩形的填充样式：
    var c1 = document.getElementById("canvas1");
    var ctx1 = c1.getContext("2d");
    var my_gradient1 = ctx1.createLinearGradient(0, 0, 0, 170);
    my_gradient1.addColorStop(0, "black");
    my_gradient1.addColorStop(1, "white");
    ctx1.fillStyle = my_gradient1;
    ctx1.fillRect(20, 20, 150, 150);

    //定义一个从黑到红再到白的渐变，作为矩形的填充样式：
    var c2 = document.getElementById("canvas2");
    var ctx2 = c2.getContext("2d");
    var my_gradient2 = ctx2.createLinearGradient(0, 0, 170, 0);
    my_gradient2.addColorStop(0, "black");
    my_gradient2.addColorStop(0.5, "red");
    my_gradient2.addColorStop(1, "white");
    ctx2.fillStyle = my_gradient2;
    ctx2.fillRect(20, 20, 150, 100);

};
