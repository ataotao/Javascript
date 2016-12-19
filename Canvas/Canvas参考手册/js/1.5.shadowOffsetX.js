window.onload = function() {

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 20;
    ctx.shadowColor = "black";

    ctx.fillStyle = "blue";
    ctx.fillRect(20, 20, 100, 80);

};