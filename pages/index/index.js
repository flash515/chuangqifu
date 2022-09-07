const app = getApp()
Page({
  data: {
    //inviterid接收传入的参数
    inviterid: "",
    indirectinviterid: "",
    invitercompanyname: "",
    inviterusername: "",
    tempimage: [],
    userinfo: [],
  },
  onLoad: function (options) {

    //准备调用云数据库
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 通过云函数获取用户本人的小程序ID
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.Gopenid = res.result.openid
        console.log("全局参数Gopenid=:", app.globalData.Gopenid)
        // 查询小程序数据库是否有当前用户信息
        this._usercheck()
      }
    })
    this._setting()
    this._productcheck()
  },
  _invitercheck() {
    console.log("invitercheck执行了")
    // 查询推荐人信息
    const db = wx.cloud.database()
    db.collection('USER').where({
      _openid: app.globalData.Ginviterid
    }).get({
      success: res => {
        wx.setStorageSync('LInviter', res.data[0]);
        this.setData({
          invitercompanyname: res.data[0].CompanyName,
          inviterusername: res.data[0].UserName,
          indirectinviterid: res.data[0].InviterOpenId
        })
        app.globalData.Gindirectinviterid = res.data[0].InviterOpenId;
        app.globalData.Ginviterpromoterlevel = res.data[0].PromoterLevel;
        app.globalData.Ginviterbalance = res.data[0].Balance;
        console.log(app.globalData.Gindirectinviterid)
      }
    })
  },
  _productcheck() {
    console.log("productcheck执行了")
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "PRODUCT",
        command: "or",
        where: [{
          Status: "在售"
        }]
      },
      success: res => {
        wx.setStorageSync('LProductList', res.result.data)
      }
    })
  },
  _setting() {
    //获取小程序全局设置
    let that = this
    const db = wx.cloud.database()
    db.collection('setting')
      .where({
        currentstatus: "effect"
      })
      .get({
        success: res => {
          app.globalData.Gpointsmagnification = res.data[0].pointsmagnification;
          console.log("轮播图：", res);
          wx.setStorageSync('LSetting', res.data[0]);
          //异步获取图片生成轮播图地址
          for (let i = 0; i < res.data[0].swiper.length; i++) {
            wx.getImageInfo({
              //把图片地址转换为本地地址
              src: res.data[0].swiper[i],
              success(res) {
                that.data.tempimage.push(res.path)
                app.globalData.Gimagearray = that.data.tempimage
              }
            })
          }
        }
      })
  },
  _usercheck() {
    console.log("usercheck执行了")
    const db = wx.cloud.database()
    db.collection('USER').where({
      _openid: app.globalData.Gopenid,
    }).get({
      success: res => {
        console.log(res);
        console.log(res.data.length);
        // 判断是否新用户并提交数据库起始
        if (res.data.length == 0) {
          this._newuser()
        } else {
          // 如果云数据库中有本人信息，则把用户本人信息存入本地
          wx.setStorageSync('LUserInfo', res.data[0]);
          // 查询结果赋值给数组参数
          this.setData({
            userinfo: res.data[0],
            inviterid: res.data[0].InviterOpenId,
          })
          app.globalData.Ginviterid = res.data[0].InviterOpenId;
          this._olduser()
          this._invitercheck()
        }
        // 判断是否新用户并提交数据库的代码框结束
      }
    })
  },
  _newuser() {
    console.log("新用户操作执行了")
    // 如果是新用户，检查是否有传递过来的推荐人id
    // 接收参数方法一开始
    if (options.userid) {
      this.setData({
        inviterid: options.userid,
      })
      app.globalData.Ginviterid = options.userid;
      console.log("方法一如果参数以userid=格式存在，则显示接收到的参数", this.data.inviterid);
      // 接收参数方法一结束
    } else {

      // 接收参数方法二开始，scene中只有参数值
      if (options.scene) {
        let scene = decodeURIComponent(options.scene);
        //可以连接多个参数值，&是我们定义的参数链接方式
        // let inviterid = scene.split('&')[0];
        // let userId = scene.split("&")[1];
        this.setData({
          inviterid: scene.split('&')[0],
        })
        // this.data.inviterid = scene.split('&')[0];
        app.globalData.Ginviterid = scene.split('&')[0];
        console.log("扫码参数:", this.data.inviterid);
      } else {
        // 两种都不带参数，则是搜索小程序进入，推荐人指定为开发人
        // this.data.inviterid = "oa1De5G404TbDrFGtCingTlGFQVQ"
        // app.globalData.Ginviterid = "oa1De5G404TbDrFGtCingTlGFQVQ"
        console.log("搜索进入参数:", this.data.inviterid);
      }
    }

    // 在USER数据库中新增用户信息
    db.collection("USER").add({
      data: {
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString(),
        InviterOpenId: this.data.inviterid,
        InviterCompanyName: this.data.invitercompanyname,
        InviterUserName: this.data.inviterusername,
        UserType: "client",
        UserPhone: "",
        DiscountLevel: "DL4",
        PromoterLevel: "normal",
        Balance: 0
      },
      success: res => {
        wx.cloud.callFunction({
          name: 'SendNewUser',
          data: {
            openid: this.data.inviterid,
            date1: new Date().toLocaleString(),
            phrase2: "新用户",
            thing3: "有新的用户通过您的分享开启创企服"
          }
        }).then(res => {
          console.log("推送消息成功", res)
        }).catch(res => {
          console.log("推送消息失败", res)
        })
        wx.cloud.callFunction({
          name: 'SendNewUser',
          data: {
            openid: "oa1De5G404TbDrFGtCingTlGFQVQ",
            date1: new Date().toLocaleString(),
            phrase2: "新用户",
            thing3: "有新的用户开启创企服"
          }
        }).then(res => {
          console.log("推送消息成功", res)
        }).catch(res => {
          console.log("推送消息失败", res)
        })
      },
    })
    app.globalData.Gusertype = "client"
    app.globalData.Gdiscountlevel = "DL4"
    app.globalData.Gpromoterlevel = "null"
  },
  _olduser() {
    console.log("老用户操作执行了")
    // 老用户确认价格等级
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('DISCOUNTORDER').where({
      _openid: app.globalData.Gopenid,
      PaymentStatus: "checked",
      OrderStatus: "checked",
      Available: true,
    }).orderBy('OrderId', 'desc').get({
      success: res => {
        console.log(res)
        if (res.data.length != 0) {
          var tempfliter = []
          for (var i = 0; i < res.data.length; i++) {
            if (new Date(res.data[i].DLStartDate).getTime() <= new Date().getTime() && new Date(res.data[i].DLEndDate).getTime() >= new Date().getTime()) {
              tempfliter.push(res.data[i]);
            }
          }
          if (tempfliter.length != 0 && tempfliter.length != undefined) {
            console.log(tempfliter)
            console.log(tempfliter[0].DiscountLevel)
            app.globalData.Gdiscountlevel = tempfliter[0].DiscountLevel
            app.globalData.Gdiscounttype = tempfliter[0].DiscountType
            console.log(app.globalData.Gdiscountlevel)
          } else {
            //卡券已过期
            app.globalData.Gdiscountlevel = "DL4"
          }
        } else {
          //没有卡券
          app.globalData.Gdiscountlevel = "DL4"
        }
      }
    })
    app.globalData.Gcompanyname = this.data.userinfo.CompanyName
    app.globalData.Gusername = this.data.userinfo.UserName
    app.globalData.GnickName = this.data.userinfo.nickName
    app.globalData.GavatarUrl = this.data.userinfo.avatarUrl
    app.globalData.Gusertype = this.data.userinfo.UserType
    app.globalData.Gpromoterlevel = this.data.userinfo.PromoterLevel
    app.globalData.Gbalance = this.data.userinfo.Balance
  },
  onShow: function () {
    // 延时跳转
    setTimeout(function () {
      wx.switchTab({
        url: '../index/home',
      })
    }, 4000)
  },

})