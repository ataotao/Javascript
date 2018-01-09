
/**
 * 到目前为止，我们尚未深入了解Canvas画布真实像素的原理，事实上，你可以直接通过ImageData对象操纵像素数据，直接读取或将数据数组写入该对象中。
 * 稍后我们也将深入了解如何控制图像使其平滑（反锯齿）以及如何从Canvas画布中保存图像。
 * 
 * ImageData 对象
 * ImageData对象中存储着canvas对象真实的像素数据，它包含以下几个只读属性：
 * 
 * width   图片宽度，单位是像素
 * height  图片高度，单位是像素
 * data    Uint8ClampedArray类型的一维数组，包含着RGBA格式的整型数据，范围在0至255之间（包括255）。
 * data属性返回一个 Uint8ClampedArray，它可以被使用作为查看初始像素数据。每个像素用4个1bytes值(按照红，绿，蓝和透明值的顺序; 这就是"RGBA"格式) 来代表。每个颜色值部份用0至255来代表。每个部份被分配到一个在数组内连续的索引，左上角像素的红色部份在数组的索引0位置。像素从左到右被处理，然后往下，遍历整个数组。
 * Uint8ClampedArray  包含高度 × 宽度 × 4 bytes数据，索引值从0到(高度×宽度×4)-1
 * 
 * 例如，从行50，纵200的像素中读取图片的蓝色部份，你会写以下代码：
 * blueComponent = imageData.data[((50*(imageData.width*4)) + (200*4)) + 2];
 * 你可能用会使用Uint8ClampedArray.length属性来读取像素数组的大小（以bytes为单位）：
 * var numBytes = imageData.data.length;
 */

// 创建一个ImageData对象
// 去创建一个新的，空白的ImageData对象，你应该会使用createImageData() 方法。有2个版本的createImageData()方法。

// var myImageData = ctx.createImageData(width, height);
// 上面代码创建了一个新的具体特定尺寸的ImageData对象。所有像素被预设为透明黑。

// 你也可以创建一个被anotherImageData对象指定的相同像素的ImageData对象。这个新的对象像素全部被预设为透明黑。这个并非复制了图片数据。

// var myImageData = ctx.createImageData(anotherImageData);

// 得到场景像素数据
// 为了获得一个包含画布场景像素数据的ImageData对像，你可以用getImageData()方法：

// var myImageData = ctx.getImageData(left, top, width, height);
// 这个方法会返回一个ImageData对象，它代表了画布区域的对象数据，此画布的四个角落分别表示为(left, top), (left + width, top), (left, top + height), 以及(left + width, top + height)四个点。这些坐标点被设定为画布坐标空间元素。

// 注：任何在画布以外的元素都会被返回成一个透明黑的ImageData对像。

// 这个方法也会在文章用画布操作视频中展示。


// 颜色选择器
// 在这个例子里面，我们会使用getImageData()去展示鼠标光标下的颜色。为此，我们要当前鼠标的位置，记为layerX和layerY，然后我们去查询getImageData()给我们提供的在那个位置的像数数组里面的像素数据。最后我们使用数组数据去设置背景颜色和<div>的文字去展示颜色值。


// context.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
// imgData	规定要放回画布的 ImageData 对象。
// x	ImageData 对象左上角的 x 坐标，以像素计。
// y	ImageData 对象左上角的 y 坐标，以像素计。
// dirtyX	可选。水平值（x），以像素计，在画布上放置图像的位置。
// dirtyY	可选。水平值（y），以像素计，在画布上放置图像的位置。
// dirtyWidth	可选。在画布上绘制图像所使用的宽度。
// dirtyHeight	可选。在画布上绘制图像所使用的高度。
// 在场景中写入像素数据
// 你可以用putImageData()方法去对场景进行像素数据的写入。

// ctx.putImageData(myImageData, dx, dy);
// dx和dy参数表示你希望在场景内左上角绘制的像素数据所得到的设备坐标。

// 例如，为了在场景内左上角绘制myImageData代表的图片，你可以写如下的代码：

// ctx.putImageData(myImageData, 0, 0)

function putImageData() {
  var img = new Image();
  img.src = './rhino.jpg';
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    img.style.display = 'none';
  };
  var color = document.getElementById('color');
  function pick(event) {
    var x = event.layerX;
    var y = event.layerY;
    var pixel = ctx.getImageData(x, y, 1, 1);
    var data = pixel.data;
    var rgba = 'rgba(' + data[0] + ',' + data[1] +
      ',' + data[2] + ',' + (data[3] / 255) + ')';
    color.style.background = rgba;
    color.textContent = rgba;

    // 在场景中写入像素数据
    var imgData = ctx.getImageData(x - 50, y - 50, 100, 100);
    ctx.putImageData(imgData, 300, 300, 10, 10, 100, 100);
  }
  canvas.addEventListener('mousemove', pick);
}


// 图片灰度和反相颜色
// 在这个例子里，我们遍历所有像素以改变他们的数值。然后我们将被修改的像素数组通过putImageData()放回到画布中去。invert函数仅仅是去减掉颜色的最大色值255.grayscale函数仅仅是用红绿和蓝的平均值。你也可以用加权平均，例如x = 0.299r + 0.587g + 0.114b这个公式。更多资料请参考维基百科的Grayscale。

function grayscale() {
  var img = new Image();
  img.src = './rhino.jpg';
  img.onload = function () {
    draw(this);
  };

  function draw(img) {
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    img.style.display = 'none';
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var invert = function () {
      for (var i = 0; i < data.length; i += 4) {
        data[i] = 225 - data[i];     // red
        data[i + 1] = 225 - data[i + 1]; // green
        data[i + 2] = 225 - data[i + 2]; // blue
      }
      ctx.putImageData(imageData, 0, 0);
    };

    var grayscale = function () {
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      ctx.putImageData(imageData, 0, 0);
    };

    var invertbtn = document.getElementById('invertbtn');
    invertbtn.addEventListener('click', invert);
    var grayscalebtn = document.getElementById('grayscalebtn');
    grayscalebtn.addEventListener('click', grayscale);
  }
}


// 缩放和反锯齿
// 在drawImage() 方法， 第二个画布和imageSmoothingEnabled 属性的帮助下，我们可以放大显示我们的图片及看到详情内容。
// 我们得到鼠标的位置并裁剪出距左和上5像素，距右和下5像素的图片。然后我们将这幅图复制到另一个画布然后将图片调整到我们想要的大小。在缩放画布里，我们将10×10像素的对原画布的裁剪调整为 200×200 。
// zoomctx.drawImage(canvas, 
//                   Math.abs(x - 5), Math.abs(y - 5),
//                   10, 10, 0, 0, 200, 200);
// 因为反锯齿默认是启用的，我们可能想要关闭它以看到清楚的像素。你可以通过切换勾选框来看到imageSmoothingEnabled属性的效果（不同浏览器需要不同前缀）。

function zoomctx() {
  var img = new Image();
  // img.src = './rhino.jpg';
  img.src = './9.jpg';
  img.onload = function () {
    draw(this);
  };

  function draw(img) {
    var canvas = document.getElementById('canvas2');
    var ctx = canvas.getContext('2d');
    ctx.scale(0.35, 0.35);
    ctx.drawImage(img, 0, 0);
    img.style.display = 'none';

    var canv = document.createElement('canvas');
    canv.width = img.width;
    canv.height = img.height;
    canv.style.display = 'none';
    var canvCtx = canv.getContext('2d');
    canvCtx.drawImage(img, 0, 0);
    document.body.appendChild(canv);

    var zoomctx = document.getElementById('zoom').getContext('2d');

    var smoothbtn = document.getElementById('smoothbtn');
    var toggleSmoothing = function (event) {
      zoomctx.imageSmoothingEnabled = this.checked;
      zoomctx.mozImageSmoothingEnabled = this.checked;
      zoomctx.webkitImageSmoothingEnabled = this.checked;
      zoomctx.msImageSmoothingEnabled = this.checked;
    };
    smoothbtn.addEventListener('change', toggleSmoothing);



    var zoom = function (event) {
      var x = event.layerX;
      var y = event.layerY;
      // x, y	要绘制的图像的左上角的位置。
      // width, height	图像所应该绘制的尺寸。指定这些参数使得图像可以缩放。
      // sourceX, sourceY	图像将要被绘制的区域的左上角。这些整数参数用图像像素来度量。
      // sourceWidth, sourceHeight	图像所要绘制区域的大小，用图像像素表示。
      // destX, destY	所要绘制的图像区域的左上角的画布坐标。
      // destWidth, destHeight	图像区域所要绘制的画布大小。
      zoomctx.clearRect(0, 0, canvas.width, canvas.height);
      zoomctx.drawImage(canv,
        Math.abs(x - 5) / 0.35,
        Math.abs(y - 5) / 0.35,
        300, 300,
        0, 0,
        300, 300);
    };

    canvas.addEventListener('mousemove', zoom);
  }
}


// 保存图片
// HTMLCanvasElement  提供一个toDataURL()方法，此方法在保存图片的时候非常有用。它返回一个包含被类型参数规定的图像表现格式的数据链接。返回的图片分辨率是96dpi。

// canvas.toDataURL('image/png')
// 默认设定。创建一个PNG图片。
// Default setting. Creates a PNG image.
// canvas.toDataURL('image/jpeg', quality)
// 创建一个JPG图片。你可以有选择地提供从0到1的品质量，1表示最好品质，0基本不被辨析但有比较小的文件大小。
// 当你从画布中生成了一个数据链接，例如，你可以将它用于任何<image>元素，或者将它放在一个有download属性的超链接里用于保存到本地。

// 你也可以从画布中创建一个Blob对像。

// canvas.toBlob(callback, type, encoderOptions)
// 这个创建了一个在画布中的代表图片的Blob对像。

function toDataUrl() {
  var canvas = document.getElementById("canvas1");
  var dataURL = canvas.toDataURL("image/jpeg",);
  // console.log(dataURL);
  // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNby
  // blAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC"
  // 设置jpegs图片的质量
  var fullQuality = canvas.toDataURL("image/jpeg", 1.0);
  // data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...9oADAMBAAIRAxEAPwD/AD/6AP/Z"
  var mediumQuality = canvas.toDataURL("image/jpeg", 0.5);
  var lowQuality = canvas.toDataURL("image/jpeg", 0.1);
  // console.log(fullQuality);
  // console.log(mediumQuality);
  // console.log(lowQuality);

  var dBtn = document.getElementById('download');
  dBtn.setAttribute('href', dataURL)
  dBtn.setAttribute('download', '下载图片')
  // dBtn.setAttribute('download') = dataURL;
  // .attributes('download') = dataURL;
}

// 示例：动态更改图片
// 可以使用鼠标事件来动态改变图片（这个例子中改变图片灰度）。

window.addEventListener("load", removeColors);

function showColorImg() {
  this.style.display = "none";
  this.nextSibling.style.display = "inline";
}

function showGrayImg() {
  this.previousSibling.style.display = "inline";
  this.style.display = "none";
}

function removeColors() {
  var aImages = document.getElementsByClassName("grayscale"),
      nImgsLen = aImages.length,
      oCanvas = document.createElement("canvas"),
      oCtx = oCanvas.getContext("2d");
  for (var nWidth, nHeight, oImgData, oGrayImg, nPixel, aPix, nPixLen, nImgId = 0; nImgId < nImgsLen; nImgId++) {
    oColorImg = aImages[nImgId];
    nWidth = oColorImg.offsetWidth;
    nHeight = oColorImg.offsetHeight;
    oCanvas.width = nWidth;
    oCanvas.height = nHeight;
    oCtx.drawImage(oColorImg, 0, 0);
    oImgData = oCtx.getImageData(0, 0, nWidth, nHeight);
    aPix = oImgData.data;
    nPixLen = aPix.length;
    for (nPixel = 0; nPixel < nPixLen; nPixel += 4) {
      aPix[nPixel + 2] = aPix[nPixel + 1] = aPix[nPixel] = (aPix[nPixel] + aPix[nPixel + 1] + aPix[nPixel + 2]) / 3;
    }
    oCtx.putImageData(oImgData, 0, 0);
    oGrayImg = new Image();
    oGrayImg.src = oCanvas.toDataURL();
    oGrayImg.onmouseover = showColorImg;
    oColorImg.onmouseout = showGrayImg;
    oCtx.clearRect(0, 0, nWidth, nHeight);
    oColorImg.style.display = "none";
    oColorImg.parentNode.insertBefore(oGrayImg, oColorImg);
  }
}

// 将canvas图像转换为文件
// 当一个内容画到canvas上时，我们可以将它生成任何一个格式支持的图片文件。比如，下面的代码段获得了id为“canvas”的<canvas>元素中的图像，复制成一个PNG图，在文档中加入一个新的<img>元素，这个<img>元素的源图就是使用canvas创建的那个图像。 

function toBlob() {
  var canvas = document.getElementById("canvas");

// 注意，我们这里创建的是PNG图片；如果在toBlob()传入第二个参数，就可以指定图片格式。例如，生成JPEG格式的图片：
// canvas.toBlob(function(blob){...}, "image/jpeg", 0.95); // JPEG at 95% quality

  canvas.toBlob(function(blob) {
    var newImg = document.createElement("img"),
        url = URL.createObjectURL(blob);
    // newImg.onload = function() {
    //   // no longer need to read the blob so it's revoked
    //   URL.revokeObjectURL(url);
    // };
  
    newImg.src = url;
    document.body.appendChild(newImg);
  }, "image/jpeg", 0.8);
}



window.onload = () => {
  putImageData();
  grayscale();
  zoomctx();
  setTimeout(() => {
    toDataUrl();
    toBlob();
  }, 100);
    
}

