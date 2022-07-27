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
    let that = this
    // 接收参数方法一开始
    if (options.userid) {

      this.data.inviterid = options.userid;
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
        this.data.inviterid = scene.split('&')[0];
        app.globalData.Ginviterid = scene.split('&')[0];
        console.log("扫码参数:", this.data.inviterid);
      } else {
        // 两种都不带参数，则是搜索小程序进入，推荐人指定为开发人
        this.data.inviterid = "oa1De5G404TbDrFGtCingTlGFQVQ"
        app.globalData.Ginviterid = "oa1De5G404TbDrFGtCingTlGFQVQ"
        console.log("搜索进入参数:", this.data.inviterid);
      }
    }
    //获取小程序全局设置
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

    //准备调用云数据库
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 通过传递来的参数查询推荐人信息
    db.collection('USER').where({
      _openid: this.data.inviterid
    }).get({
      success: res => {
        wx.setStorageSync('LInviterUser', res.data[0]);
        this.setData({
          invitercompanyname: res.data[0].CompanyName,
          inviterusername: res.data[0].UserName,
          indirectinviterid: res.data[0].InviterOpenId
        })
        app.globalData.Gindirectinviterid = res.data[0].InviterOpenId;
      }
    })
    // 查询在售的产品并存入本地
    db.collection('PRODUCT').where({
      // 状态为在售的产品
      Status: "在售"
    }).get({
      success: res => {
        //括号1开始
        wx.setStorageSync('LProductList', res.data)
      }
    })
    // 通过云函数获取用户本人的小程序ID
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.Gopenid = res.result.openid
        console.log("全局参数Gopenid=:", app.globalData.Gopenid)
        // 查询小程序数据库是否有当前用户信息
        const db = wx.cloud.database()
        db.collection('USER').where({
          _openid: res.result.openid,
        }).get({
          success: res => {
            console.log(res);
            // 如果云数据库中有本人信息，则把用户本人信息存入本地
            wx.setStorageSync('LUserInfo', res.data[0]);
            // 查询结果赋值给数组参数
            this.setData({
              userinfo: res.data[0]
            })
            console.log(res.data.length);
            // 判断是否新用户并提交数据库起始
            if (res.data.length == 0) {
              // 在USER数据库中新增用户信息
              db.collection("USER").add({
                data: {
                  SysAddDate: new Date().getTime(),
                  AddDate: new Date().toLocaleString(),
                  InviterOpenId: this.data.inviterid,
                  InviterCompanyName: this.data.invitercompanyname,
                  InviterUserName: this.data.inviterusername,
                  UserType: "client",
                  DiscountLevel: "DL4",
                  PromoterLevel: "normal",
                },
                success: res => {
                  wx.cloud.callFunction({
                    name: 'SendNewUser',
                    data: {
                      openid: that.data.inviterid,
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

            } else {
              app.globalData.Gcompanyname = this.data.userinfo.CompanyName
              app.globalData.Gusername = this.data.userinfo.UserName
              app.globalData.GnickName = this.data.userinfo.nickName
              app.globalData.GavatarUrl = this.data.userinfo.avatarUrl
              app.globalData.Gusertype = this.data.userinfo.UserType
              app.globalData.Gdiscountlevel = this.data.userinfo.DiscountLevel
              app.globalData.Gpromoterlevel = this.data.userinfo.PromoterLevel
            }
            // 判断是否新用户并提交数据库的代码框结束
          }
        })
      }
    })


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