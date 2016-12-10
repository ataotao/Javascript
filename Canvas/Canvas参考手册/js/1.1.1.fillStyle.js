window.onload = function () {

    //getContext() 方法返回一个用于在画布上绘图的环境。

    /* 颜色、样式和阴影 */
    //属性
    //fillStyle	        设置或返回用于填充绘画的颜色、渐变或模式
    // JavaScript 语法：	context.fillStyle=color|gradient|pattern;

    //颜色填充
    var canvas1 = document.getElementById('canvas1');
    var ctx1 = canvas1.getContext('2d');

    ctx1.fillStyle = "#0000ff";

    ctx1.fillRect(20, 20, 150, 100);

    //渐变填充
    var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');

    var my_gradient = ctx2.createLinearGradient(0, 0, 170, 0);
    my_gradient.addColorStop(0, "black");
    my_gradient.addColorStop(0.5, "red");
    my_gradient.addColorStop(1, "white");
    ctx2.fillStyle = my_gradient;

    ctx2.fillRect(20, 20, 150, 100);

    //图片填充
    var canvas3 = document.getElementById('canvas3');
    var ctx3 = canvas3.getContext('2d');
    var img = document.getElementById("lamp");
    var pat = ctx3.createPattern(img, "repeat");
    ctx3.rect(0, 0, 150, 100);
    ctx3.fillStyle = pat;

    ctx3.fillRect(20, 20, 150, 100);

    //填充渐变文字
    var canvas4 = document.getElementById('canvas4');
    var ctx4 = canvas4.getContext('2d');

    ctx4.font = "40px Verdana";
    // 创建渐变
    var gradient = ctx4.createLinearGradient(0, 0, canvas4.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // 用渐变进行填充
    ctx4.fillStyle = gradient;
    ctx4.fillText("Big smile!", 0, 70);

};