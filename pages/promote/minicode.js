const app = getApp()
const utils = require("../../utils/utils")
Page({

  data: {
    windowW: '', // 画布宽度
    windowH: '', // 画布高，没用到

    // 轮播参数
    image: [],
    inviterid: "",
    accessToken: "",
    token_url: "",
    urllink: "",
    qrcodeurl: "",
    tempqrcodeurl: "",
    avatarUrl: "",
    tempfilepath: "",
    qrcodeuploadlock: false,
    // 附带的参数
    usertype: "",
    unionid: "",
    page: 'pages/index/index',
    imageUrl: "",
    productid: "",
    params: "",
    color: {
      "r": 0,
      "g": 0,
      "b": 0
    },
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
    // 更新数据
    const db = app.globalData.c1.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        ["UserInfo.avatarUrl"]: this.data.avatarUrl,
      },
    })
  },
  onChooseImage(e) {
    console.log(e.detail.avatarUrl)
    this.setData({
      imageUrl: e.detail.avatarUrl,
    })
  },
  bvUnionId(e) {
    this.data.unionid = e.detail.value
    console.log(this.data.unionid)
  },
  bvPage(e) {
    this.data.page = e.detail.value
    console.log(this.data.page)
  },
  bvProductId(e) {
    this.data.productid = e.detail.value
    console.log(this.data.productid)
  },
  bvParams(e) {
    this.data.params = e.detail.value
    console.log(this.data.params)
  },
  bvColor(e) {
    console.log(e.detail.value)
    this.data.color = e.detail.value
    console.log(this.data.color)
  },
  getUrlLink() {
    // 调用云函数
    let that = this

    app.globalData.c1.callFunction({
      name: 'URLLink',
      data: {
        quey: 'userid=' + app.globalData.Guserid + "&page=" + that.data.page + "&params=" + that.data.params
      },
      success: res => {
        console.log('result', res.result)
        console.log('urllink', res.result.urlLink)
        that.setData({
          urllink: res.result.urlLink
        })
      },
      fail: err => {
        console.error('[云函数] [URLLink] 调用失败', err)
      }
    })
  },

  bvCopy: function (e) {
    let that = this;
    wx.setClipboardData({
      data: that.data.urllink, //这个是要复制的数据
      success: res => {
        wx.getClipboardData({
          success: res => {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  getUserQRCode() {
    // 调用云函数
    // var scene = app.globalData.Guserid; //scene参数不能有参数名，可以拼接你要添加的参数值

    let that = this;

    app.globalData.c1.callFunction({
      name: 'getQRCode',
      data: {
        // userid参数是使用在上传文件夹命名中
        path: 'minicode/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'tempqrcode.png',
        // 小程序码中包含的用户信息,scene长度不能超过32字符，否则报错
        scene: app.globalData.Guserid + '&' + that.data.params,
        page: that.data.page,
        color: that.data.color,
        // userid: "1234",
        // scene: "5678"
      },
      success: res => {
        console.log(res.result)
        app.globalData.c1.getTempFileURL({
          fileList: [res.result]
        }).then(res => {
          console.log(res.fileList)
          that.setData({
            tempqrcodeurl: res.fileList[0].tempFileURL
          })
          console.log("tempqrcodeurl", that.data.tempqrcodeurl);
          // 执行下一个方法的方法，把头像合并到小程序码里
          that.drawCanvas(this.data.avatarUrl)
        }).catch(error => {
          // handle error
        })
      }
    })

  },

  //通过https方式调用wxacodeunlimit获取二维码
  getcode(getAccessToken) {
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
      data: {
        appid: "wxf43d2aed3e5b6370",
        secret: "f880fc2af3f06d340166b0750cac2a78",
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.access_token)
        that.data.accessToken = res.data.access_token
        
        var scene = that.data.unionid + '&' + that.data.productid+ '&' + that.data.params //scene参数不能有参数名，可以拼接你要添加的参数值
        console.log('scene：', scene);
        wx.request({
          url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + that.data.accessToken,
          data: {
            scene: scene,
            page: that.data.page, //线上的小程序一定要有这个页面
          },
          method: 'POST',
          responseType: 'arraybuffer',
          success: function (res) {
            // var qrcode = wx.arrayBufferToBase64(res.data); //对数据进行转换
            that.setData({
              qrcode: wx.arrayBufferToBase64(res.data) //对数据进
            })
            // console.log("小程序码", that.data.qrcode);
            //保存base64小程序码到本地临时文件
            // data为base64的图片数据（注意：没有前缀 data:image/png;base64,）
            let random = new Date().getTime();
            let tempPath = wx.env.USER_DATA_PATH + `/${random}.png`;
            wx.getFileSystemManager().writeFile({
              filePath: tempPath,
              data: that.data.qrcode,
              encoding: 'base64',
              success: res => {
                that.setData({
                  ewmPath: tempPath
                })
                console.log('success', that.data.ewmPath);
                that.drawCanvas(that.data.imageUrl);
              },
              fail: err => {
                console.log(err);
              }
            })
          }
        })
      }
    })
  },

  drawCanvas: function (image) {
    console.log("执行了")
    let ctx = wx.createCanvasContext('myCanvas');
    wx.getImageInfo({
      src: this.data.tempqrcodeurl,
      success: (res) => {
        console.log("res2", res)
        ctx.drawImage(res.path, 0, 0, this.data.windowW, this.data.windowW); // 二维码
        ctx.save()
        ctx.beginPath()
        // 画圆弧，圆心坐标、半径、弧长
        ctx.arc(this.data.windowW / 2, this.data.windowW / 2, this.data.windowW * 0.2333, 0, 2 * Math.PI)
        ctx.closePath()
        // 下面就裁剪出一个圆形了，且坐标在 （50， 90）
        ctx.clip()
        // 然后画图片，res.tempFilePath 其实是下载到本地的一个路径，使用小程序画出图片记得一定要用本地的路径，可以用 wx.downloadFile 来实现。
        // 因为 drawImage 的第二个和第三个参数是图片的左上角在画布 canvas 的 x 坐标，y 坐标，所以图片的坐标比圆形的坐标分别都小圆的半径大小就刚刚好能被切成圆形，后面的两个参数就是图片的宽和高，请设定为圆形的直径长度。

        wx.getImageInfo({
          src: image,
          success: (res) => {
            console.log("res3", res)
            ctx.drawImage(res.path, this.data.windowW * 0.2667, this.data.windowW * 0.2667, this.data.windowW * 0.4667, this.data.windowW * 0.4667); //头像
            ctx.restore();
            ctx.draw();
          }
        })
      }
    })

  },
  // 保存到手机
  saveImage: function (e) {
    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        console.log("res4", res)
        that.setData({
          tempfilepath: res.tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            utils._SuccessToast("推广码保存成功")
            console.log("res5", that.data.qrcodeuploadlock)
            that.uploadqrcode()
          }
        })
      }
    })

  },
  uploadqrcode() {
    // 判断是否重复提交
    if (this.data.qrcodeuploadlock) {} else {
      console.log("res6", this.data.tempfilepath)
      const filePath = this.data.tempfilepath
      const cloudPath = 'minicode/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'qrcode.png'

      app.globalData.c1.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log("fileID", res.fileID)
          // 获取数据库引用
          const db = app.globalData.c1.database()
          // 更新数据
          db.collection('USER').where({
            UserId: app.globalData.Guserid
          }).update({
            data: {
              QRCode: res.fileID
            },
          })
        }
      })

      this.data.qrcodeuploadlock = true // 修改上传状态为锁定
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowW: app.globalData.Gsysteminfo.windowWidth - 40,
      windowH: app.globalData.Gsysteminfo.windowWidth - 40,
      image: app.globalData.Gimagearray,
      usertype: app.globalData.Guserdata.UserInfo.UserType,
      avatarUrl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickName: app.globalData.Guserdata.UserInfo.nickName,
    })
    var that = this;
    // 接收参数的方法开始
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      let inviterid = scene.split('&')[0];
      // let userId = scene.split("&")[1];
      //其他逻辑处理。。。。。
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})