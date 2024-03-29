// pages/index/home.js
const app = getApp()
const track = require("../../utils/track");
const utils = require("../../utils/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化相关
    params: {},
    tempinviterid: "",
    remark: "",
    // 登录框相关变量
    loginshow: false,
    loginbtnshow: false,
    region: [],
    usertype: "",
    userphone: "",
    promotelevel: "",
    noticearray: [],
    // 轮播头图
    image: [],
  },
  bvLoginShow: function (e) {
    this.setData({
      loginshow: true
    })
  },

  onLogin(e) {
    this.setData({
      loginshow: e.detail.loginshow,
      loginbtnshow: e.detail.loginbtnshow,
      userphone: e.detail.userphone,
    })
  },

  bindRegionChange: async function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
      const db = app.globalData.c1.database()
      db.collection('USER').where({
        UserId: app.globalData.Guserid,
      }).update({
        data: {
          ['UserInfo.Region']: this.data.region
        }
    })
  },
  // 转发小程序功能
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '邀请您体验创企服小程序：',
      path: '/pages/index/index?userid=' + app.globalData.Guserid,
      imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/%E5%88%9B%E4%BC%81%E6%9C%8Dsharepic.png?sign=3eb6823c407fcaaaa895491a923c5ec1&t=1687071530', //封面
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(this.data.path.value)
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
  },
  // 分享朋友圈
  onShareTimeline: function () {
    return {
      title: '创企服小程序！',
      query: '/pages/index/index?userid=' + app.globalData.Guserid,
      imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/%E5%88%9B%E4%BC%81%E6%9C%8Dsharepic.png?sign=3eb6823c407fcaaaa895491a923c5ec1&t=1687071530', //封面
    }
  },

  /**
   * 生命周期函数--监听页面加载
  //  */
  onLoad: async function (options) {
    let that = this

    //options内容：scene扫码参数，page跳转页面，type跳转类型，path1路径1，path2路径2，userid推荐人ID,productid产品id
    console.log("接收到的参数", options)
    if (options.userid) {
      // 如果是通过链接打开
      this.data.params = options
      this.data.tempinviterid = options.userid
      this.data.remark = "创企服用户分享链接进入"
      console.log("通过链接打开接收到的参数", this.data.tempinviterid);
    } else if (options.scene) {
      // 如果是通过扫码进入（scene中只有参数值，通过&和顺序区分）
      let scene = decodeURIComponent(options.scene);
      //可以连接多个参数值，&是我们定义的参数链接方式
      // let inviterid = scene.split('&')[0];
      // let userId = scene.split("&")[1];
      this.data.params = scene
      this.data.tempinviterid = scene.split('&')[0]
      this.data.remark = "创企服用户小程序码进入"
      // openid升级unionid后的适配，老名片用完后一年后可删除
      if (this.data.tempinviterid == "omLS75Xib_obyxkVAahnBffPytcA") {
        this.data.tempinviterid = "oo7kw5rohI15ogf6TCX_SGAxYUao"
      }
      console.log("小程序码进入参数:", this.data.tempinviterid);
    } else {
      // 两种都不带参数，则是自主搜索小程序进入，推荐人指定为开发人
      this.data.tempinviterid = "oo7kw5rohI15ogf6TCX_SGAxYUao"
      this.data.remark = "创企服无参数进入"
    }
    wx.showLoading({
      title: '加载中',
    })
    // 调用方法初始化
    await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
    wx.hideLoading()
    this.setData({
      image: app.globalData.Gimagearray,
    })
    if (app.globalData.Guserdata.UserInfo.UserPhone != '') {
      this.setData({
        loginbtnshow: false,
        userphone: app.globalData.Guserdata.UserInfo.UserPhone,
        region: app.globalData.Guserdata.UserInfo.Region
      })
    } else {
      this.setData({
        loginbtnshow: true
      })
    }

    // 使用双等号是比较，否则单等号变成赋值
    if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "member") {
      this.setData({
        promotelevel: "会员"
      })
    } else if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "silver") {
      this.setData({
        promotelevel: "白银会员"
      })
    } else if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "gold") {
      this.setData({
        promotelevel: "黄金会员"
      })
    } else if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "platinum") {
      this.setData({
        promotelevel: "铂金会员"
      })
    } else {
      this.setData({
        promotelevel: "普客"
      })
    }
    if (app.globalData.Guserdata.UserInfo.UserType == "client") {
      this.setData({
        usertype: "客户"
      })
    } else if (app.globalData.Guserdata.UserInfo.UserType == "provider") {
      this.setData({
        usertype: "供应伙伴"
      })
    } else if (app.globalData.Guserdata.UserInfo.UserType == "admin") {
      this.setData({
        usertype: "管理员"
      })
    }

      const db = app.globalData.c1.database()
      db.collection('notice').where({
        Status: "onshow"
      }).get({
        success: res => {
          let tempnoticearray = []
          for (let i = 0; i < res.data.length; i++) {
            tempnoticearray.push(res.data[i].Content)
          }
          //一定要用setData赋值才会在前端出现，一定要用that
          that.setData({
            noticearray: tempnoticearray,
          })
          console.log("noticearray", that.data.noticearray)
        }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // 点击 tab 时用此方法触发埋点

  onShow: function () {

  },
  handlerClick(e) {
    track.startByClick(e.currentTarget.id);
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

})