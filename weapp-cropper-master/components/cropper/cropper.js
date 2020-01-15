/**
 * @param width canvas的宽 默认图片的宽, 最大1080
 * @param height canvas的高 默认图片的高
 * @param imgUrl 需要截取的图片资源地址, 网络地址或临时路径或者本地地址, 本地地址需是绝对路径
 * @param cutRatio 裁剪比例 无默认值
 * @param cornerStyle 右下角手指块样式
 * @param sizeInfo 是否显示实时裁剪大小
 * @param croppedMult 生成图片大小倍数
 * @param fileType 生成图片的类型
 * @param quality 生成图片质量
 * 
 */
var times = 0
Component({
  properties: {
    options: {
      type: Object,
      value: {}
    },
  },
  data: {
    cropperOpts: {
      width: 330,
      height: 0,
      imgUrl: '',
      cutRatio: 0,
      cornerStyle: '',
      sizeInfo: true,
      croppedMult: 1,
      fileType: 'png',
      quality: 1
    },
    flag: 0, // 阻止初始设置moveable-view位置时也会触发change事件的操作
    imgTempFilePath: '', // 需要裁剪的图片的临时地址
    canvasWidth: 0,
    canvasHeight: 0,
    x: 0, // 初始moveable-view偏移
    y: 0,
    movingX: 0, // 移动时moveable-view的x值
    movingY: 0,
    imgInfo: {},
    sysInfo: {},
    touchStartX: 0, // 小方块移动的初始位置
    touchStartY: 0,
    movableViewWidth: 0, // moveable-view的大小
    movableViewHeight: 0,
    movableViewInitWidth: 0, // moveable-view每次改变大小前的初始值
    movableViewInitHeight: 0,
    ratio: 0, // 需要裁剪的图片和实际展示的图片的比例
    ctx: null,
    unitRatio: 2,
    isRatioBound: false,
    ratioBound: 1,
    imgLeftBound: 0,
    imgRightBound: 0,
    imgTopBound: 0,
    imgBottomBound: 0,
    lastX: 0,
    lastY: 0,
    connerLeft: 0,
    connerTop: 0,
    connerWidth: 0,
    connerHeight: 0,
    cropperWrapMaxHeight: 800,
    deviationX: 0,
    deviationY: 0,
    querySelector: null,
    angle: 0, // 旋转角度
    scale: 1,
    _hypotenuse_length: 0, //双指触摸时斜边长度
    _flag_img_endtouch: false, //是否结束触摸,
    move_throttle_flag: true
  },
  externalClasses: ['outer-class'],

  ready() {
    console.warn(this.properties.cropperOpts)
    Object.keys(this.properties.options).forEach(key => {
      this.data.cropperOpts[key] = this.properties.options[key]
    })
    this.data.cropperOpts.cutRatio = Number(this.data.cropperOpts.cutRatio)
    this.init()
  },
  methods: {
    init() {
      // 横图和竖图都如何展示
      this.data.sysInfo = wx.getSystemInfoSync()
      console.warn(this.data.sysInfo)
      // 基于375px来计算当前屏幕是375的倍数比例
      this.data.unitRatio = this.data.sysInfo.screenWidth / 375
      // 375屏幕screenRatio = 0.5

      this.getImageInfo(this.data.cropperOpts.imgUrl).then((res) => {
        this.data.imgInfo = res
        if (!/(http|https|wxfile):\/\//.test(this.data.cropperOpts.imgUrl)) {
          this.data.imgInfo.path = `/${this.data.imgInfo.path}`
        }
        this.setData({
          imgTempFilePath: this.data.imgInfo.path
        })
        this.setCropper()
      }).catch((err) => {
        console.error('_getImageInfo error', err)
      })
    },
    getImageInfo(url) {
      const _this = this
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: url,
          success(res) {
            console.warn(res)
            // 安卓下canvas过大或导致小程序crash, 实测超过1080极容易crash
            // 由于需要根据图片的大小来设置canvas大小, 所以图片大小最大为1080
            if (res.width > 1080) {
              res.height = 1080 / (res.width / res.height)
              res.width = 1080
            }
            resolve(res)
          },
          fail(err) {
            reject(err)
          }
        })
      })
    },
    setCropper() {
      let width
      let height
      const imgRatio = this.data.imgInfo.width / this.data.imgInfo.height
      width = this.computPx(this.data.cropperOpts.width)
      // 计算展示img的高度
      height = width / imgRatio

      this.data.ratio = this.data.imgInfo.width / width

      const movableViewWidth = width
      const movableViewHeight = this.data.cropperOpts.cutRatio ? parseInt(movableViewWidth / this.data.cropperOpts.cutRatio) : parseInt(movableViewWidth / (16 / 9))
      // 计算moveable-view的初始x, y, 居中
      const cropperWrapMaxHeight = this.data.sysInfo.windowHeight - 75
      const x = 0
      const y = height >= cropperWrapMaxHeight ? (cropperWrapMaxHeight - movableViewHeight) / 2 : (height - movableViewHeight) / 2

      this.data.cropperOpts.width = width
      this.data.cropperOpts.height = height
      this.setData({
        x,
        y,
        width,
        height,
        cropperOpts: this.data.cropperOpts,
        movableViewWidth,
        movableViewHeight,
        cropperWrapMaxHeight,
        canvasWidth: this.data.imgInfo.width, // 根据图片宽高设置canvas大小
        canvasHeight: this.data.imgInfo.height
      }, () => {
        console.warn(this.data.cropperOpts)
        const _this = this
        _this.ctx = wx.createCanvasContext('weapp-cropper', this)
        _this.data.movableViewInitWidth = movableViewWidth
        _this.data.movableViewInitHeight = movableViewHeight
        _this.data.movingX = x
        _this.data.movingY = y
        _this.draw()
        _this.data.querySelector = wx.createSelectorQuery().in(this)
        _this.data.querySelector.selectAll('.dom').boundingClientRect()
        _this.data.querySelector.exec(function (res) {
          const dom = res[0][0]
          _this.data.connerLeft = res[0][1].left
          _this.data.connerTop = res[0][1].top
          _this.data.connerWidth = res[0][1].width
          _this.data.connerHeight = res[0][1].height
          // 获取截取边界
          _this.data.imgRightBound = dom.left + dom.width
          _this.data.imgLeftBound = dom.left
          _this.data.imgTopBound = dom.top
          _this.data.imgBottomBound = dom.top + dom.height
        })
      })
    },
    movableViewChange(e) {
      console.log(e);
      
      if (this.data.flag === 0) return
      this.setData({
        movingX: e.detail.x,
        movingY: e.detail.y
      })
    },
    cropperMovStart() {
      this.data.flag = 1
    },
    cropperTouchend() {
      this.getConnerLayoutInfo()
      this.setData({
        movableViewInitWidth: parseInt(this.data.movableViewWidth),
        movableViewInitHeight: parseInt(this.data.movableViewHeight)
      })
    },
    cornerTouchstart(e) {
      // 测试过程发现, 如果手指移动超过了边界, 会继续触发change事件, 然后movingXY也会一直改变, movable-view大小也就一直在边, 只是增长方向相反了
      const pageX = e.changedTouches[0].pageX
      const pageY = e.changedTouches[0].pageY
      this.data.flag = 1
      this.data.touchStartX = pageX
      this.data.touchStartY = pageY
      this.data.deviationX = this.data.connerWidth - (pageX - this.data.connerLeft)
      this.data.deviationY = this.data.connerHeight - (pageY - this.data.connerTop)
    },
    cornerTouchmove(e) {
      // 设置moveable-view的宽高
      // 控制设置宽高的频率, 即间隔几次设置一次
      // if (times < this.data.cropperOpts.movableChangeInterval) {
      //   times += 1
      //   return
      // } else {
      //   times = 0
      // }

      let pageX = e.touches[0].pageX
      let pageY = e.touches[0].pageY

      if (pageX + this.data.deviationX >= this.data.imgRightBound) {
        pageX = this.data.imgRightBound - this.data.deviationX - 1
      }
      if (pageY + this.data.deviationY >= this.data.imgBottomBound) {
        pageY = this.data.imgBottomBound - this.data.deviationY - 1
      }

      let movableViewWidth = parseInt(this.data.movableViewInitWidth + pageX - this.data.touchStartX)

      // movable-view最小设置为20
      if (movableViewWidth <= 50) movableViewWidth = 50

      let movableViewHeight
      if (this.data.cropperOpts.cutRatio == 0) {
        movableViewHeight = parseInt(this.data.movableViewInitHeight + pageY - this.data.touchStartY)
      } else {
        movableViewHeight = parseInt(movableViewWidth / this.data.cropperOpts.cutRatio)
      }

      if (movableViewHeight <= 50) movableViewHeight = 50
      this.setData({
        movableViewWidth,
        movableViewHeight
      })
    },
    cornerTouchend(e) {
      this.getConnerLayoutInfo()
      this.setData({
        movableViewInitWidth: parseInt(this.data.movableViewWidth),
        movableViewInitHeight: parseInt(this.data.movableViewHeight)
      })
    },
    draw(canvasToTempFilePath) {
      const centerX = this.data.canvasWidth / 2;
      const cneterY = this.data.canvasHeight / 2;
      // 旋转处理
      this.ctx.translate(centerX, cneterY)
      this.ctx.rotate(this.data.angle * Math.PI / 180);
      this.ctx.translate(-centerX, -cneterY)

      this.ctx.drawImage(this.data.imgInfo.path, 0, 0, this.data.canvasWidth * this.data.scale, this.data.canvasHeight * this.data.scale)
      this.ctx.draw(false, () => {
        canvasToTempFilePath && canvasToTempFilePath();
      })
    },
    canvasToTempFilePath(success, fail) {
      const _this = this
      const ratio = _this.data.ratio
      const savedInfo = {
        x: _this.data.movingX * ratio,
        y: _this.data.movingY * ratio,
        width: _this.data.movableViewWidth * ratio,
        height: _this.data.movableViewHeight * ratio,
        fileType: _this.data.cropperOpts.fileType,
        quality: _this.data.cropperOpts.quality,
        canvasId: 'weapp-cropper',
        success: function (res) {
          console.warn(res)
          success && success(res.tempFilePath)
        },
        fail(err) {
          fail && fail(err)
        }
      }
      if (_this.data.cropperOpts.croppedMult) {
        savedInfo.destWidth = _this.data.movableViewWidth * ratio * _this.data.cropperOpts.croppedMult
        savedInfo.destHeight = _this.data.movableViewHeight * ratio * _this.data.cropperOpts.croppedMult
      }
      this.draw(() => {
        wx.canvasToTempFilePath(savedInfo, this)
      })

    },
    getConnerLayoutInfo() {
      const _this = this
      _this.data.querySelector.select('.conner-block')
      _this.data.querySelector.exec(function (res) {
        _this.data.connerLeft = res[0][1].left
        _this.data.connerTop = res[0][1].top
        _this.data.connerWidth = res[0][1].width
        _this.data.connerHeight = res[0][1].height
      })
    },
    getImg() {
      this.canvasToTempFilePath((tempFilePath) => {
        this.triggerEvent('cutOk', tempFilePath)
      }, (err) => {
        console.warn('第一次获取图片失败, 已重试', err)
        setTimeout(() => {
          this.canvasToTempFilePath(function (tempFilePath) {
            this.triggerEvent('cutOk', tempFilePath)
          })
        }, 500)
      })
    },
    cancel() {
      this.triggerEvent('cancel')
    },
    computPx(val) {
      var n = parseFloat(val)
      return isNaN(n) ? console.error('_computPx val must be a number') : n * this.data.unitRatio
    },

    // 左旋转
    rotateL() {
      const angle = this.data.angle;
      const _angle = angle - 90;
      this.setData({ angle: _angle });
    },

    // 右旋转
    rotateR() {
      const angle = this.data.angle;
      const _angle = angle + 90;
      this.setData({ angle: _angle });
    },

    //节流 - image
    _move_throttle(){
      clearTimeout(this.MOVE_THROTTLE);
      this.MOVE_THROTTLE = setTimeout(() => {
        this.data.move_throttle_flag = true;
      }, 1000 / 40);
    },

    //开始触摸 - image
    _start(event) {
      this.data._flag_img_endtouch = false;
      if(event.touches.length > 1 ) {
        let width = Math.abs(event.touches[0].clientX - event.touches[1].clientX);
        let height = Math.abs(event.touches[0].clientY - event.touches[1].clientY);
        this.data._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      }
    },

    // 触摸移动 - image
    _move(event) {
      if (this.data._flag_img_endtouch || !this.data.move_throttle_flag) return;
      if(event.touches.length > 1) {
        this.data.MOVE_THROTTLE_FLAG = false;
        this._move_throttle();
        //双指放大
        let width = (Math.abs(event.touches[0].clientX - event.touches[1].clientX)),
            height = (Math.abs(event.touches[0].clientY - event.touches[1].clientY)),
            hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
            scale = this.data.scale * (hypotenuse / this.data._hypotenuse_length);
            scale = scale <= 1 ? 1 : scale;
            scale = scale >= 3 ? 3 : scale;
        this.setData({
          scale
        })
        this.data._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      }
    },
    // 触摸结束 - image
    _end(event) {
      console.log('_end', event.touches);
      this.data._flag_img_endtouch = true;
    },
    _preventTouchMove() {
    },
  }
})

