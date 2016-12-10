window.onload = function () {

    //getContext() 方法返回一个用于在画布上绘图的环境。

    /* 颜色、样式和阴影 */
    //属性
    // shadowBlur 属性设置或返回阴影的模糊级数。
    // JavaScript 语法：	context.shadowBlur=number;

    //笔触填充
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    ctx.shadowColor = "rgba(0,0,0,0.3)";

    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 20;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = "blue";

    ctx.fillRect(20, 20, 100, 80);

};