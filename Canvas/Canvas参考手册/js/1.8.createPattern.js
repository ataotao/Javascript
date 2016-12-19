window.onload = function() {

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("lamp");
    var pat = ctx.createPattern(img, "repeat");
    ctx.rect(0, 0, 150, 100);
    ctx.fillStyle = pat;
    ctx.fill();

};
