window.onload = function () {

    //getContext() 方法返回一个用于在画布上绘图的环境。

    /* 颜色、样式和阴影 */
    //属性
    // shadowColor 属性设置或返回用于阴影的颜色。
    // 注释：请将 shadowColor 属性与 shadowBlur 属性一起使用，来创建阴影。
    // 提示：请通过使用 shadowOffsetX 和 shadowOffsetY 属性来调节阴影效果。

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