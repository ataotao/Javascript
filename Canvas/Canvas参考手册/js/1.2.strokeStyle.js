window.onload = function () {

    //getContext() 方法返回一个用于在画布上绘图的环境。

    /* 颜色、样式和阴影 */
    //属性
    //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式。
    // JavaScript 语法：	context.strokeStyle=color|gradient|pattern;

    //笔触填充
    var canvas1 = document.getElementById('canvas1');
    var ctx1 = canvas1.getContext('2d');

    ctx1.strokeStyle = "#0000ff";
    ctx1.strokeRect(20, 20, 150, 100);

    //笔触渐变填充
    var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');

    var gradient = ctx2.createLinearGradient(0, 0, 170, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx2.strokeStyle = gradient;
    ctx2.lineWidth = 50;
    ctx2.strokeRect(20, 20, 150, 100);

    //笔触渐变文字
    var canvas3 = document.getElementById('canvas3');
    var ctx3 = canvas3.getContext('2d');

    ctx3.font = "30px Verdana";
    // 创建渐变
    var gradient1 = ctx3.createLinearGradient(0, 0, canvas3.width, 0);
    gradient1.addColorStop("0", "magenta");
    gradient1.addColorStop("0.5", "blue");
    gradient1.addColorStop("1.0", "red");
    // 用渐变进行填充
    ctx3.strokeStyle = gradient1;
    ctx3.strokeText("Big smile!", 10, 50);


    //图片填充
    var canvas4 = document.getElementById('canvas4');
    var ctx4 = canvas4.getContext('2d');
    var img = document.getElementById("lamp");
    var pat = ctx4.createPattern(img, "repeat");
    ctx4.lineWidth = 50;
    ctx4.strokeStyle = pat;
    ctx4.strokeRect(20, 20, 150, 100);


};