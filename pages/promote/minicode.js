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
    usertype:"",
    unionid:"",
    page: 'pages/index/index',
    params: "",
    color:{"r":0,"g":0,"b":0},
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
    // 更新数据
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        ["UserInfo.avatarUrl"]: this.data.avatarUrl,
      },
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
    wx.cloud.callFunction({
      name: 'URLLink',
      data: {
        quey: 'userid=' + app.globalData.Guserid + "&page=" + this.data.page + "&params=" + this.data.params
      },
      success: res => {
        console.log('result', res.result)
        console.log('urllink', res.result.urlLink)
        this.setData({
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

  getQRCode() {
    // 调用云函数
    // var scene = app.globalData.Guserid; //scene参数不能有参数名，可以拼接你要添加的参数值

    let that = this;
    wx.cloud.callFunction({
      name: 'getQRCode',
      data: {
        // userid参数是使用在上传文件夹命名中
        path: 'minicode/'+app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone+'tempqrcode.png',
        // 小程序码中包含的用户信息,scene长度不能超过32字符，否则报错
        scene: this.data.unionid+'&'+this.data.params,
        page: this.data.page,
        color:this.data.color,
        // userid: "1234",
        // scene: "5678"
      },
      success: res => {
        that.setData({
          tempqrcodeurl: res.result
        })
        console.log("tempqrcodeurl", this.data.tempqrcodeurl);
        // 执行下一个方法的方法，把头像合并到小程序码里
        // that.drawCanvas()
      }
    })
  },

  getUserQRCode() {
    // 调用云函数
    // var scene = app.globalData.Guserid; //scene参数不能有参数名，可以拼接你要添加的参数值

    let that = this;
    wx.cloud.callFunction({
      name: 'getQRCode',
      data: {
        // userid参数是使用在上传文件夹命名中
        path: 'minicode/'+app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone+'tempqrcode.png',
        // 小程序码中包含的用户信息,scene长度不能超过32字符，否则报错
        scene: app.globalData.Guserid+'&'+this.data.params,
        page: this.data.page,
        color:this.data.color,
        // userid: "1234",
        // scene: "5678"
      },
      success: res => {
        that.setData({
          tempqrcodeurl: res.result
        })
        console.log("tempqrcodeurl", this.data.tempqrcodeurl);
        // 执行下一个方法的方法，把头像合并到小程序码里
        that.drawCanvas()
      }
    })
  },

  //通过https方式调用wxacodeunlimit获取二维码，有效，但当前方法用不到了
  getcode(getAccessToken) {
    var that = this;
    var scene = app.globalData.Guserid; //scene参数不能有参数名，可以拼接你要添加的参数值
    console.log('scene：', scene);
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + this.data.accessToken,
      data: {
        scene: scene,
        page: 'pages/index/index', //线上的小程序一定要有这个页面
      },
      method: 'POST',
      responseType: 'arraybuffer',
      success: function (res) {
        // var qrcode = wx.arrayBufferToBase64(res.data); //对数据进行转换
        that.setData({
          qrcode: wx.arrayBufferToBase64(res.data) //对数据进行转换
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
            // that.drawCanvas();
          },
          fail: err => {
            console.log(err);
          }
        })
      }
    })
  },

  drawCanvas: function () {
    // var that = this;
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
          src: this.data.avatarUrl,
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
      const cloudPath = 'minicode/'+app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone+'qrcode.png'
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log("fileID", res.fileID)
          // 获取数据库引用
          const db = wx.cloud.database()
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
      usertype:app.globalData.Guserdata.UserInfo.UserType,
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
    //  接收参数的方法结束

    // wx.getSystemInfo({ // 获取设备宽高 canvas设置  由于项目需求背景图不是整屏  我把高减少一部分
    //   success: function (res) {
    //     that.setData({
    //       windowW: res.windowWidth - 40,
    //       windowH: res.windowWidth - 40
    //     })
    //   }
    // })

    // 获取accesstoken,当前方法用不到accessToken了

    // wx.cloud.callFunction({
    //     // 云函数名称
    //     name: 'getAccessToken',
    //     // 传给云函数的参数
    //     data: {},
    //   })
    //   .then(res => {
    //     this.setData({
    //       accessToken: res.result
    //     });
    //     console.log('云函数获取res.result：', res.result);
    //     console.log('云函数获取this.data.accessToken：', this.data.accessToken);
    //   })
    //   .catch(console.error)
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