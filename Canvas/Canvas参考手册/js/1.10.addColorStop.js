window.onload = function() {

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, "black");
    grd.addColorStop("0.3", "magenta");
    grd.addColorStop("0.5", "blue");
    grd.addColorStop("0.6", "green");
    grd.addColorStop("0.8", "yellow");
    grd.addColorStop(1, "red");

    ctx.fillStyle = grd;
    ctx.fillRect(20, 20, 150, 100);

};
