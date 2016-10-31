function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    else {
        return getComputedStyle(obj, null)[attr];
    }
}

//运动框架封装
function onMove(obj, json,second, fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true;
        for (var attr in json) {
            var crs = 0;
            //获取当前属性值
            if (attr == 'opacity') {
                crs = Math.round(parseFloat(getStyle(obj, attr)) * 100);
            }
            else {
                crs = parseInt(getStyle(obj, attr));
            }

            //获取运动速度
            var speed = (json[attr] - crs) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

            //运动操作
            if (crs != json[attr]) {
                flag = false;
                if (attr == 'opacity') {
                    obj.style.filter = 'alpha(opacity:' + (crs + speed) + ')';
                    obj.style.opacity = (crs + speed) / 100;
                }
                else {
                    obj.style[attr] = crs + speed + 'px';
                }
            }
        }
        if (flag == true) {
            clearInterval(obj.timer);
            if (fn) {
                fn();
            }
        }
    }, second)
}

