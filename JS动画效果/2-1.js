window.onload = function () {
    var oDiv = document.getElementById('div1');
    oDiv.onmouseover = function () {
        startMove();
    };
};

function startMove() {
    var oDiv = document.getElementById('div1');
    setInterval(function () {
        oDiv.style.left = oDiv.offsetLeft + 10 + 'px';
    }, 30);
}
